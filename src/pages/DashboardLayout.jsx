import { useNavigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, Settings, LogOut, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex min-vh-100 bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -250 }}
                animate={{ x: 0 }}
                className="glass-card m-4 mr-0 p-6 flex flex-col gap-8"
                style={{ width: "260px", borderRadius: "16px" }}
            >
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <shield-check size={24} className="text-white" />
                    </div>
                    <h2 className="gradient-text m-0">Junkbot Certificate Generator</h2>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" end />
                    <SidebarLink to="/dashboard/single" icon={<Award size={20} />} label="Single Certificate" />
                    <SidebarLink to="/dashboard/bulk" icon={<Users size={20} />} label="Bulk Load" />
                    <SidebarLink to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0] || "A"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate m-0">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate m-0">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-100 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Log Out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-100"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

function SidebarLink({ to, icon, label, end }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
        ${isActive
                    ? "bg-primary text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"}
      `}
            style={{ textDecoration: "none" }}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    );
}
