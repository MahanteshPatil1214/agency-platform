import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Briefcase, DollarSign, Activity } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import { getAdminStats } from '../../api/dashboard';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeProjects: 0,
        revenue: '$0',
        systemHealth: '0%'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    // Mock data for charts since we don't have a charting library
    const revenueData = [40, 60, 45, 70, 65, 85, 80, 95, 85, 100, 90, 105];
    const userGrowthData = [20, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];

    return (
        <DashboardLayout role="admin">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">Analytics Overview</h1>
                <p className="text-text-muted">Detailed insights into platform performance.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={stats.revenue}
                    icon={DollarSign}
                    color="bg-green-500"
                    trend="+12.5% vs last month"
                />
                <StatCard
                    title="Active Projects"
                    value={stats.activeProjects}
                    icon={Briefcase}
                    color="bg-primary"
                    trend="+5 new this week"
                />
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    icon={Users}
                    color="bg-blue-500"
                    trend="+3 new this month"
                />
                <StatCard
                    title="System Health"
                    value={stats.systemHealth}
                    icon={Activity}
                    color="bg-purple-500"
                    trend="Stable"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart Placeholder */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Revenue Growth
                        </h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-text-muted">
                            <option>Last 12 Months</option>
                            <option>Last 6 Months</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {revenueData.map((value, index) => (
                            <div key={index} className="w-full bg-white/5 rounded-t-lg relative group hover:bg-green-500/20 transition-colors">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-green-500/50 rounded-t-lg transition-all duration-500 group-hover:bg-green-500"
                                    style={{ height: `${value}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${value}k
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-text-muted">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* User Growth Chart Placeholder */}
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-500" />
                            Client Acquisition
                        </h3>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-text-muted">
                            <option>Last 12 Months</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {userGrowthData.map((value, index) => (
                            <div key={index} className="w-full bg-white/5 rounded-t-lg relative group hover:bg-blue-500/20 transition-colors">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-500/50 rounded-t-lg transition-all duration-500 group-hover:bg-blue-500"
                                    style={{ height: `${value}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-text-muted">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
