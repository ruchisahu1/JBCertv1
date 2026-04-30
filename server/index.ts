import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import multer from "multer";
import jwt from "jsonwebtoken";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { generatePdfBuffer } from "./pdfService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
// const upload = multer(); // Unused in this version

app.use(cors());
app.use(express.json());

// Path configuration
const TEMPLATES_DIR = path.join(__dirname, "../assets/templates");
const FRONTEND_BUILD_DIR = path.join(__dirname, "../dist");

// Serve Template Images
app.use("/templates", express.static(TEMPLATES_DIR));

// Serve Frontend (if built)
if (fs.existsSync(FRONTEND_BUILD_DIR)) {
    app.use(express.static(FRONTEND_BUILD_DIR));
}

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
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    const user = USERS.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });
        return res.json({ token, user: { email: user.email, name: user.name } });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Template Listing (Protected)
app.get("/api/templates", authenticateToken, (_: any, res: any) => {
    try {
        const files = fs.readdirSync(TEMPLATES_DIR)
            .filter(file => file.endsWith(".png") || file.endsWith(".jpg"));
        res.json(files);
    } catch (err) {
        res.json(["certificate.png"]); // Default
    }
});

// Single Gen (Protected)
app.post("/api/generate-certificate", authenticateToken, async (req, res) => {
    const { studentName, courseName, template } = req.body;

    try {
        const pdfBuffer = await generatePdfBuffer(studentName, courseName, template || "certificate.png");
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdfBuffer);
    } catch (err) {
        console.error("PDF generation error:", err);
        res.status(500).send("PDF generation failed");
    }
});

// Bulk Gen (Protected)
app.post("/api/generate-bulk", authenticateToken, async (req, res) => {
    const { students, template } = req.body; // students: [{name, course}]
    const zip = new AdmZip();

    try {
        const promises = students.map(async (student: any) => {
            try {
                const pdfBuffer = await generatePdfBuffer(student.name, student.course, template || "certificate.png");
                zip.addFile(`${student.name.replace(/\s+/g, "_")}.pdf`, pdfBuffer);
            } catch (err) {
                console.error(`Failed to generate PDF for ${student.name}:`, err);
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

// Fallback to Frontend Index for SPA routing
app.use((_: any, res: any, next: any) => {
    const indexPath = path.join(FRONTEND_BUILD_DIR, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        next();
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Consolidated JBCert server running on port ${PORT}`);
});

