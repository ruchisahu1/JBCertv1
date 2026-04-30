import { motion } from "framer-motion";
import { Award, Users, FileText, Download, Zap, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Overview() {
    const navigate = useNavigate();
    return (
        <div className="p-6 max-w-[1200px] mx-auto">
            {/* Header with quick stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-1 text-4xl font-bold tracking-tight"
                    >
                        Dashboard <span className="text-indigo-400">Overview</span>
                    </motion.h1>
                    <p className="text-slate-400 text-lg">Your certificate ecosystem at a glance.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl"
                >
                    <div className="px-4 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Status</p>
                        <span className="text-xs font-bold">Active</span>

                    </div>
                    <div className="w-px bg-white/10 my-2"></div>
                    <div className="px-4 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Uptime</p>
                        <span className="text-xs font-bold">99.9%</span>
                    </div>
                </motion.div>
            </div>

            {/* Main Grid: Staggered and Dynamic */}
            <div className="grid grid-cols-12 gap-6 items-start">

                {/* Large Stat: Efficiency */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-12 lg:col-span-8 glass-card p-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">

                        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                            <div className="lg:w-[100%] w-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-indigo-500/20 p-3 rounded-2xl">
                                        <TrendingUp size={28} className="text-indigo-400" />
                                    </div>
                                    <h2 className="text-3xl m-0 font-bold">Performance Hub</h2>
                                </div>
                                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                    127 Certificates generated with <b className="text-white">24%</b> more usage this month.
                                    Ready to hit the next milestone?
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => navigate("/dashboard/single")}
                                        className="btn-primary px-10 py-4 text-base shadow-lg shadow-indigo-500/20"
                                    >
                                        Create New <Zap size={18} />
                                    </button>
                                    {/* <button className="btn-primary bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-4 text-base">
                                        View Reports
                                    </button> */}
                                </div>
                            </div>
                        </div>

                        {/* <div className="lg:w-[35%] w-full">
                            <div className="grid grid-cols-2 gap-4">
                                <CompactStat label="Total PDF" value="1.2k" />
                                <CompactStat label="Success" value="99%" />
                                <CompactStat label="Avg Time" value="1.4s" />
                                <CompactStat label="Storage" value="2.1GB" />
                            </div>
                        </div> */}
                    </div>
                </motion.div>

                {/* Small Stat: Active Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-12 md:col-span-6 lg:col-span-4 glass-card p-6 h-full flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="m-0 text-slate-200">User Growth</h3>
                            <Users size={20} className="text-purple-400" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <h1 className="m-0 text-5xl">142</h1>
                            <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><TrendingUp size={14} /> +12%</span>
                        </div>
                        <p className="text-slate-400 text-sm">New students enrolled this week.</p>
                    </div>
                    <div className="mt-8 flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                            +12
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activity: Slim Sidebar Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-12 md:col-span-6 lg:col-span-4 glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="m-0 text-sm font-bold uppercase tracking-widest text-slate-500">Live Traffic</h3>
                        <Clock size={16} className="text-slate-500" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <TrafficItem name="Sarah S." type="Single" time="8m ago" />
                        <TrafficItem name="Mike J." type="Template" time="15m ago" />

                    </div>
                    {/* <button className="w-full mt-2 py-2 text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer">
                        View All Activity
                    </button> */}
                </motion.div>

                {/* Template Quick Access
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-span-12 lg:col-span-8 glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="m-0">Favorite Templates</h3>
                        <FileText size={20} className="text-emerald-400" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <TemplateThumb name="Standard" />
                        <TemplateThumb name="Minimal" />
                        <TemplateThumb name="Classic" />
                        <div className="aspect-[1.414/1] rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/20 transition-all cursor-pointer group">
                            <Plus size={20} className="text-slate-500 group-hover:text-white" />
                            <span className="text-[10px] text-slate-500 font-bold">NEW</span>
                        </div>
                    </div>
                </motion.div> */}

            </div>
        </div>
    );
}

function CompactStat({ label, value }) {
    return (
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</p>
            <p className="text-xl font-bold m-0 text-slate-200">{value}</p>
        </div>
    );
}

function TrafficItem({ name, type, time }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></div>
            <div className="flex-1">
                <p className="text-sm font-medium m-0">{name} <span className="text-slate-500">processed</span> {type}</p>
            </div>
            <span className="text-[10px] text-slate-500 font-bold">{time}</span>
        </div>
    );
}

function TemplateThumb({ name }) {
    return (
        <div className="group cursor-pointer">
            <div className="aspect-[1.414/1] bg-slate-800 rounded-xl overflow-hidden border border-white/5 group-hover:border-indigo-500/50 transition-all relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] font-bold text-white">{name}</span>
                </div>
            </div>
            <p className="mt-2 text-[10px] text-center text-slate-500 font-bold group-hover:text-slate-300">{name}</p>
        </div>
    );
}

function Plus({ size, className }) {
    return <Zap size={size} className={className} />; // Reusing Zap as a plus icon for flair or just import Plus
}
