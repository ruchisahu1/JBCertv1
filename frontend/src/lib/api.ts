/// <reference types="vite/client" />
const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Login failed");
    }

    return res.json();
}

export async function generateCertificate(studentName: string, courseName: string) {
    const res = await fetch(`${API_URL}/generate-certificate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentName, courseName }),
    });

    if (!res.ok) {
        throw new Error("Certificate generation failed");
    }

    return res.blob();
}
