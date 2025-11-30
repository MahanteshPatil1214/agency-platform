import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import { getClientStats, getClientProjects } from '../../api/dashboard';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-heading font-bold">{value}</p>
    </Card>
);

const ClientDashboard = () => {
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
                    color="bg-blue-500"
                    trend="+1 this month"
                />
                <StatCard
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                    icon={Clock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedProjects}
                    icon={CheckCircle}
                    color="bg-green-500"
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
                <Card className="lg:col-span-2">
                    <h2 className="text-xl font-heading font-bold mb-6">Recent Activity</h2>
                    <div className="space-y-6">
                        {projects.map((project) => (
                            <div key={project.id} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Project Update: {project.name}</h4>
                                    <p className="text-sm text-text-muted">{project.update}</p>
                                </div>
                                <span className="ml-auto text-sm text-text-muted">{project.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-heading font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors text-sm font-medium">
                            + New Project Request
                        </button>
                        <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                        <button className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left transition-colors text-sm font-medium">
                            View Invoices
                        </button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ClientDashboard;
