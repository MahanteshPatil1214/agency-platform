import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import { getClientStats, getClientProjects } from '../../api/dashboard';
import StatCard from '../../components/dashboard/StatCard';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeProjects: 0,
        pendingTasks: 0,
        completedProjects: 0,
        needsReview: 0
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await getClientStats();
                const projectsData = await getClientProjects();

                setStats(statsData);
                setProjects(projectsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="client">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="client">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">Dashboard Overview</h1>
                <p className="text-text-muted">Welcome back, here's what's happening with your projects.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Projects"
                    value={stats.activeProjects}
                    icon={Briefcase}
                    color="bg-primary"
                    trend="+1 this month"
                />
                <StatCard
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                    icon={Clock}
                    color="bg-accent"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedProjects}
                    icon={CheckCircle}
                    color="bg-secondary"
                    trend="+2 this week"
                />
                <StatCard
                    title="Needs Review"
                    value={stats.needsReview}
                    icon={AlertCircle}
                    color="bg-red-500"
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="glass-card p-6 lg:col-span-2">
                    <h2 className="text-xl font-heading font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <div key={project.id} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0 group">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white group-hover:text-primary transition-colors">Project Update: {project.name}</h4>
                                    <p className="text-sm text-text-muted mt-1">{project.update}</p>
                                </div>
                                <span className="ml-auto text-xs text-text-muted bg-white/5 px-2 py-1 rounded-lg">{project.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h2 className="text-xl font-heading font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/dashboard/client/projects')}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent text-left transition-all duration-300 text-sm font-medium flex items-center justify-between group"
                        >
                            <span>+ New Project Request</span>
                            <Briefcase className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/client/messages')}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent text-left transition-all duration-300 text-sm font-medium flex items-center justify-between group"
                        >
                            <span>Contact Support</span>
                            <Clock className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button
                            onClick={() => alert("Invoicing feature coming soon!")}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-transparent text-left transition-all duration-300 text-sm font-medium flex items-center justify-between group"
                        >
                            <span>View Invoices</span>
                            <CheckCircle className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ClientDashboard;
