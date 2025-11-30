import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Briefcase,
    MessageSquare,
    PieChart
} from 'lucide-react';
import { logout } from '../../api/auth';

const Sidebar = ({ role = 'client' }) => {
    const location = useLocation();

    const clientLinks = [
        { name: 'Overview', path: '/dashboard/client', icon: LayoutDashboard },
        { name: 'Projects', path: '/dashboard/client/projects', icon: Briefcase },
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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-white/10 flex flex-col">
            <div className="p-6 border-b border-white/10">
                <Link to="/" className="flex items-center gap-2 text-2xl font-heading font-bold text-white">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-lg">N</span>
                    </div>
                    NAVAM
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-text-muted hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white'}`} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
