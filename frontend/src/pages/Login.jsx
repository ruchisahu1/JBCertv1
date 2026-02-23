import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="flex items-center justify-center min-vh-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-100"
                style={{ maxWidth: "420px" }}
            >
                <div className="text-center mb-8">
                    <h1 className="gradient-text mb-2">JBCert</h1>
                    <p style={{ color: "var(--text-muted)" }}>Sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-sm">Email Address</label>
                        <input
                            className="input-field"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Password</label>
                        <input
                            className="input-field"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button className="btn-primary mt-4" type="submit">
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
