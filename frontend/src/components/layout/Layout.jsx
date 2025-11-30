import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-text-main font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none z-0" />
            <Navbar />
            <main className="relative z-10 pt-24 pb-12 px-6 container mx-auto min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
