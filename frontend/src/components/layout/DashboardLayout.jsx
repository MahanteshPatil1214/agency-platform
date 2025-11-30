import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, role = 'client' }) => {
    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 selection:text-white">
            <Sidebar role={role} />
            <main className="pl-64 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
