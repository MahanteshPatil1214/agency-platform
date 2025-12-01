import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Briefcase,
    MessageSquare,
    PieChart,
    FileText
} from 'lucide-react';
import { logout } from '../../api/auth';

const Sidebar = ({ role = 'client' }) => {
    const location = useLocation();

    const clientLinks = [
        { name: 'Overview', path: '/dashboard/client', icon: LayoutDashboard },
        { name: 'Projects', path: '/dashboard/client/projects', icon: Briefcase },
        { name: 'My Requests', path: '/dashboard/client/requests', icon: FileText },
        { name: 'Messages', path: '/dashboard/client/messages', icon: MessageSquare },
        { name: 'Settings', path: '/dashboard/client/settings', icon: Settings },
    ];

    const adminLinks = [
        { name: 'Overview', path: '/dashboard/admin', icon: LayoutDashboard },
        { name: 'Clients', path: '/dashboard/admin/clients', icon: Users },
        { name: 'Messages', path: '/dashboard/admin/messages', icon: MessageSquare },
        { name: 'Analytics', path: '/dashboard/admin/analytics', icon: PieChart },
        { name: 'Settings', path: '/dashboard/admin/settings', icon: Settings },
    ];

    const links = role === 'admin' ? adminLinks : clientLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/5 flex flex-col z-50">
            <div className="p-6 border-b border-white/5">
                <Link to="/" className="flex items-center gap-3 text-2xl font-heading font-bold text-white group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform duration-300">
                        <span className="text-xl text-black font-bold">N</span>
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">NAVAM</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-primary/20 text-primary shadow-glow-primary border border-primary/20'
                                : 'text-text-muted hover:bg-white/5 hover:text-white hover:border hover:border-white/5'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-primary/10 blur-xl" />
                            )}
                            <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'}`} />
                            <span className="font-medium relative z-10">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 border border-transparent hover:border-red-500/20"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
