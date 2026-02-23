import { useState } from "react";

export default function Home() {
    const [studentName, setStudentName] = useState("");
    const [courseName, setCourseName] = useState("");

    async function generate() {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/generate-certificate`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentName, courseName })
            }
        );

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "certificate.pdf";
        a.click();
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Certificate Generator</h1>

            <input
                placeholder="Student Name"
                onChange={(e) => setStudentName(e.target.value)}
            />
            <br /><br />

            <input
                placeholder="Course Name"
                onChange={(e) => setCourseName(e.target.value)}
            />
            <br /><br />

            <button onClick={generate}>Generate Certificate</button>
        </div>
    );
}
