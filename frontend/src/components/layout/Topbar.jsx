import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Topbar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <header className="h-16 border-b border-white/10 bg-surface/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#0F172A]"></span>
                </button>

                <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">{user.fullName || user.username || 'User'}</p>
                        <p className="text-xs text-text-muted capitalize">{user.roles?.[0]?.replace('ROLE_', '').toLowerCase() || 'Client'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
