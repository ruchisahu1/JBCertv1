import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Download, Loader2, Trash2, ImageIcon, X, Check } from "lucide-react";

export default function BulkGeneration() {
    const [rows, setRows] = useState(Array(10).fill({ name: "", course: "" }));
    const [numToAdd, setNumToAdd] = useState(1);
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("certificate.png");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jb_token");
        fetch(`${import.meta.env.VITE_API_URL}/api/templates`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTemplates(data))
            .catch(() => setTemplates(["certificate.png"]));
    }, []);

    const handleAddRows = () => {
        const newRows = Array(parseInt(numToAdd) || 1).fill({ name: "", course: "" });
        setRows([...rows, ...newRows]);
    };

    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const removeRow = (index) => {
        if (rows.length <= 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleBulkGenerate = async () => {
        const validStudents = rows.filter(r => r.name.trim() !== "");
        if (validStudents.length === 0) {
            alert("Please enter at least one student name");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("jb_token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/generate-bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    students: validStudents,
                    template: selectedTemplate
                }),
            });

            if (!res.ok) throw new Error("Bulk generation failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `certificates_bulk_${Date.now()}.zip`;
            a.click();
        } catch (error) {
            console.error(error);
            alert("Failed to generate ZIP archive");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col h-100">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-1 text-3xl">Bulk Generation</h1>
                    <p className="text-slate-400 m-0">Generate hundreds of certificates in one click.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}
                    >
                        <ImageIcon size={20} />
                        Template: {selectedTemplate}
                    </button>
                    <button
                        disabled={loading}
                        onClick={handleBulkGenerate}
                        className="btn-primary"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Download size={20} />}
                        {loading ? "Processing ZIP..." : "Download All (ZIP)"}
                    </button>
                </div>
            </div>

            <div className="glass-card flex-1 overflow-hidden flex flex-col">
                {/* Bulk Toolbar */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 font-medium">Add rows:</span>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                className="input-field py-1 h-9"
                                style={{ width: "80px" }}
                                value={numToAdd}
                                onChange={(e) => setNumToAdd(e.target.value)}
                                min="1"
                                max="100"
                            />
                            <button
                                onClick={handleAddRows}
                                className="btn-primary py-1 h-9 px-4"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                        {rows.filter(r => r.name.trim() !== "").length} Students Validated
                    </span>
                </div>

                {/* Bulk Table */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-100 border-collapse">
                        <thead className="sticky top-0 bg-slate-900 z-10 shadow-lg">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">#</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">Student Name</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800"> </th>
                                <th className="px-6 py-4 border-b border-slate-800"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-white/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-3 text-slate-600 font-medium text-sm w-12">{index + 1}</td>
                                    <td className="px-6 py-3">
                                        <input
                                            className="input-field bg-transparent border-transparent hover:border-slate-700 focus:border-primary transition-all p-2 text-sm"
                                            placeholder="Student full name"
                                            value={row.name}
                                            onChange={(e) => updateRow(index, "name", e.target.value)}
                                        />
                                    </td>

                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => removeRow(index)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg border-none bg-transparent cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Template Selection Modal (Same as Single but potentially different context) */}
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
                                <h2 className="m-0">Select Template for Bulk Load</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-full border-none bg-transparent cursor-pointer text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {templates.map(t => (
                                    <div
                                        key={t}
                                        onClick={() => { setSelectedTemplate(t); setShowModal(false); }}
                                        className={`
                      cursor-pointer rounded-xl border-2 p-1 transition-all
                      ${selectedTemplate === t ? "border-primary bg-primary/10" : "border-slate-800 hover:border-slate-600 bg-slate-900/50"}
                    `}
                                    >
                                        <div className="aspect-[1] bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-500 overflow-hidden mb-2">
                                            <p className="m-0 text-center px-1 truncate">{t}</p>
                                        </div>
                                        <div className="px-1 py-1 flex items-center justify-between">
                                            <span className="text-[10px] font-medium truncate">{t}</span>
                                            {selectedTemplate === t && <Check size={12} className="text-primary" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setShowModal(false)} className="btn-primary" style={{ background: "rgba(255,255,255,0.05)" }}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
