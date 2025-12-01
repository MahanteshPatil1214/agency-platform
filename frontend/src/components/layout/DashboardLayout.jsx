import React from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role = 'client' }) => {
    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 selection:text-white flex relative overflow-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none z-0" />
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col ml-64 min-h-screen">
                <Topbar />
                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
