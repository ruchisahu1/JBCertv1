import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Image as ImageIcon, Download, Loader2, Check, X } from "lucide-react";

export default function SingleGeneration() {
    const [studentName, setStudentName] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("certificate.png");
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jb_token");
        fetch(`${import.meta.env.VITE_API_URL}/api/templates`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(() => setTemplates(["certificate.png"]));
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("jb_token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/generate-certificate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ studentName, template: selectedTemplate }),
            });

            if (!res.ok) throw new Error("Generation failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${studentName.replace(/\s+/g, "_")}_certificate.pdf`;
            a.click();
        } catch (error) {
            console.error(error);
            alert("Failed to generate certificate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col h-100">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-1">Generate Certificate</h1>
                    <p className="text-slate-400 m-0">Create a personalized certificate for a student.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
                >
                    <ImageIcon size={20} />
                    Change Template
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-8"
                >
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium">Student Full Name</label>
                        <input
                            className="input-field text-lg"
                            placeholder="e.g. John Doe"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                        <p className="mt-2 text-xs text-slate-500">The name will be automatically capitalized on the certificate.</p>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-8">
                        <div className="flex gap-3">
                            <div className="bg-indigo-500/20 p-2 rounded-lg h-fit">
                                <ImageIcon size={18} className="text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium m-0">Selected Template</p>
                                <p className="text-xs text-slate-400 m-0">{selectedTemplate}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!studentName || loading}
                        onClick={handleGenerate}
                        className="btn-primary w-100 py-4 text-lg"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Download size={22} />}
                        {loading ? "Generating PDF..." : "Generate & Download"}
                    </button>
                </motion.div>

                Preview Side
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-4 h-100 flex flex-col"
                    style={{ minHeight: "400px" }}
                >
                    <div className="flex items-center justify-between mb-4 px-2">
                        <p className="text-sm font-medium m-0 flex items-center gap-2">
                            <Award size={16} className="text-indigo-400" />
                            Template Preview
                        </p>
                        <span className="text-xs text-slate-500">Draft version</span>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                        {/* Visual simulation of the certificate */}
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <div className="relative w-full aspect-[1.414/1] bg-white rounded shadow-2xl overflow-hidden">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/templates/${selectedTemplate}`}
                                    alt="Certificate Template"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Dynamic Name Placement
                                <div
                                    className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 text-[#1a1c2e] font-bold text-center w-[60%]"
                                    style={{ fontSize: "clamp(8px, 1.8vw, 24px)", fontFamily: "serif" }}
                                >
                                    {studentName.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') || "Student Name"}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Template Selection Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card p-6 w-100"
                            style={{ maxWidth: "600px" }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="m-0">Select Template</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-full border-none bg-transparent cursor-pointer text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {templates.map(t => (
                                    <div
                                        key={t}
                                        onClick={() => { setSelectedTemplate(t); setShowModal(false); }}
                                        className={`
                      cursor-pointer rounded-xl border-2 p-1 transition-all
                      ${selectedTemplate === t ? "border-primary bg-primary/10" : "border-slate-800 hover:border-slate-600 bg-slate-900/50"}
                    `}
                                    >
                                        <div className="aspect-[1.414/1] bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}/templates/${t}`}
                                                alt={t}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="px-2 py-1 flex items-center justify-between">
                                            <span className="text-xs font-medium truncate">{t}</span>
                                            {selectedTemplate === t && <Check size={14} className="text-primary" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button onClick={() => setShowModal(false)} className="btn-primary" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
