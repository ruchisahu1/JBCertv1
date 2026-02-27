import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import jwt from "jsonwebtoken";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

dotenv.config();

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI is not defined ❌");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => {
        console.error("MongoDB Connection Error ❌", err);
        process.exit(1);
    });

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

// Serve Template Images
app.use("/templates", express.static(path.join(__dirname, "../../backend-python/templates")));

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

const USERS = [
    { email: "admin@jb.com", password: "!!admin))", name: "Admin" },
    { email: "cert1@jb.com", password: "12jbcert12", name: "JB Cert1" }
];

// Middleware
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });
        req.user = user;
        next();
    });
};

// Simple Auth
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    const user = USERS.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({ token, user: { email: user.email, name: user.name } });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Template Listing (Protected)
app.get("/api/templates", authenticateToken, (req, res) => {
    const templatesDir = path.join(__dirname, "../../backend-python/templates");
    try {
        const files = fs.readdirSync(templatesDir)
            .filter(file => file.endsWith(".png") || file.endsWith(".jpg"));
        res.json(files);
    } catch (err) {
        res.json(["certificate.png"]); // Default
    }
});

// Single Gen (Protected)
app.post("/generate-certificate", authenticateToken, async (req, res) => {
    const { studentName, courseName, template } = req.body;

    const formData = new URLSearchParams();
    formData.append("student_name", studentName);
    if (courseName) formData.append("course_name", courseName);

    const response = await fetch(
        `${process.env.PDF_SERVICE_URL}/generate?template=${template || "certificate.png"}`,
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) return res.status(500).send("PDF generation failed");

    res.setHeader("Content-Type", "application/pdf");
    const body = response.body;
    if (body) {
        body.pipe(res);
    } else {
        res.status(500).send("Empty response body");
    }
});

// Bulk Gen (Protected)
app.post("/generate-bulk", authenticateToken, async (req, res) => {
    const { students, template } = req.body; // students: [{name, course}]
    const zip = new AdmZip();

    try {
        const promises = students.map(async (student: any) => {
            const formData = new URLSearchParams();
            formData.append("student_name", student.name);
            if (student.course) formData.append("course_name", student.course);

            const response = await fetch(
                `${process.env.PDF_SERVICE_URL}/generate?template=${template || "certificate.png"}`,
                { method: "POST", body: formData }
            );

            if (response.ok) {
                const buffer = await response.arrayBuffer();
                zip.addFile(`${student.name.replace(/\s+/g, "_")}.pdf`, Buffer.from(buffer));
            }
        });

        await Promise.all(promises);

        const zipBuffer = zip.toBuffer();
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=certificates.zip");
        res.send(zipBuffer);
    } catch (error) {
        console.error("Bulk generation error:", error);
        res.status(500).send("Bulk generation failed");
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Node backend running on port ${PORT}`);
});
