import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Activity, Briefcase, UserPlus, CheckCircle, XCircle, Eye } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getAdminStats, getServiceRequests, getAllClients, createProject, updateRequestStatus } from '../../api/dashboard';
import { register } from '../../api/auth';

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

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        activeProjects: 0,
        revenue: '$0',
        systemHealth: '0%'
    });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Create Client Form State
    const [clientForm, setClientForm] = useState({
        fullName: '',
        email: '',
        companyName: '',
        password: '',
        confirmPassword: ''
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    // Create Project Form State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [projectForm, setProjectForm] = useState({
        clientId: '',
        name: '',
        description: '',
        status: 'Active'
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real requests
                const requestsData = await getServiceRequests();
                setRequests(requestsData);

                // Fetch real stats
                const statsData = await getAdminStats();
                setStats(statsData);

                setError(null);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setError("Failed to load data. Please try refreshing.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleCreateClient = (request = null) => {
        if (request) {
            setClientForm({
                fullName: request.fullName,
                email: request.email,
                companyName: request.companyName,
                password: '',
                confirmPassword: ''
            });
            setSelectedRequest(request);
        } else {
            setClientForm({
                fullName: '',
                email: '',
                companyName: '',
                password: '',
                confirmPassword: ''
            });
            setSelectedRequest(null);
        }
        setShowDetailsModal(false); // Close details modal if open
        setShowCreateModal(true);
    };

    const submitCreateClient = async (e) => {
        e.preventDefault();
        if (clientForm.password !== clientForm.confirmPassword) {
            setCreateError("Passwords do not match");
            return;
        }
        setCreateLoading(true);
        setCreateError('');

        try {
            await register({
                username: clientForm.email,
                fullName: clientForm.fullName,
                email: clientForm.email,
                password: clientForm.password,
                companyName: clientForm.companyName,
                roles: ['client']
            });

            // If this was from a service request, update its status
            if (selectedRequest) {
                await updateRequestStatus(selectedRequest.id, 'APPROVED');
                // Refresh requests
                const requestsData = await getServiceRequests();
                setRequests(requestsData);
            }

            setShowCreateModal(false);
            alert("Client account created successfully!");
        } catch (err) {
            setCreateError(err.response?.data?.message || "Failed to create client");
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCreateProject = async () => {
        try {
            console.log("Fetching clients for project creation...");
            const clientsData = await getAllClients();
            console.log("Clients fetched:", clientsData);
            setClients(clientsData);
            setShowProjectModal(true);
        } catch (error) {
            console.error("Error fetching clients", error);
            alert("Failed to fetch clients");
        }
    };

    const submitCreateProject = async (e) => {
        e.preventDefault();
        try {
            await createProject(projectForm);
            setShowProjectModal(false);
            alert("Project created successfully!");
            // Refresh stats
            const statsData = await getAdminStats();
            setStats(statsData);
        } catch (error) {
            console.error("Error creating project", error);
            alert("Failed to create project");
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="admin">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Admin Overview</h1>
                    <p className="text-text-muted">Monitor platform performance and client activities.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={() => handleCreateProject()}>
                        <Briefcase className="w-5 h-5 mr-2" />
                        Create Project
                    </Button>
                    <Button onClick={() => handleCreateClient()}>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Client
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Clients" value={stats.totalClients} icon={Users} color="bg-blue-500" trend="+12% vs last month" />
                <StatCard title="Active Projects" value={stats.activeProjects} icon={Briefcase} color="bg-purple-500" trend="+5 new" />
                <StatCard title="Revenue (MoM)" value={stats.revenue} icon={DollarSign} color="bg-green-500" trend="+8.2%" />
                <StatCard title="System Health" value={stats.systemHealth} icon={Activity} color="bg-cyan-500" />
            </div>

            {/* Service Requests */}
            <Card className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-bold">Service Requests</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-text-muted border-b border-white/10">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Company</th>
                                <th className="p-4 font-medium">Service</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? requests.map((req) => (
                                <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{req.fullName}</div>
                                        <div className="text-xs text-text-muted">{req.email}</div>
                                    </td>
                                    <td className="p-4">{req.companyName}</td>
                                    <td className="p-4">{req.serviceType}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                            req.status === 'APPROVED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(req)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        {req.status === 'PENDING' && (
                                            <Button size="sm" onClick={() => handleCreateClient(req)}>
                                                Approve
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-muted">
                                        No pending requests.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* View Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-[#0F172A] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Request Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Full Name</label>
                                    <p className="font-medium">{selectedRequest.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Email</label>
                                    <p className="font-medium">{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Company</label>
                                    <p className="font-medium">{selectedRequest.companyName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Service Type</label>
                                    <p className="font-medium text-primary">{selectedRequest.serviceType}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-text-muted uppercase">Description</label>
                                <div className="mt-1 p-3 bg-white/5 rounded-xl text-sm leading-relaxed">
                                    {selectedRequest.description}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-text-muted uppercase">Submitted At</label>
                                <p className="text-sm text-text-muted">
                                    {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowDetailsModal(false)}>Close</Button>
                            {selectedRequest.status === 'PENDING' && (
                                <Button onClick={() => handleCreateClient(selectedRequest)}>
                                    Approve & Create Account
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Client Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create Client Account</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        {createError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {createError}
                            </div>
                        )}

                        <form onSubmit={submitCreateClient} className="space-y-4">
                            <Input
                                label="Full Name"
                                value={clientForm.fullName}
                                onChange={(e) => setClientForm({ ...clientForm, fullName: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={clientForm.email}
                                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Company"
                                value={clientForm.companyName}
                                onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                value={clientForm.password}
                                onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                value={clientForm.confirmPassword}
                                onChange={(e) => setClientForm({ ...clientForm, confirmPassword: e.target.value })}
                                required
                            />
                            <Button type="submit" className="w-full" disabled={createLoading}>
                                {createLoading ? 'Creating...' : 'Create Account'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Project</h2>
                            <button onClick={() => setShowProjectModal(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        <form onSubmit={submitCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Client</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    value={projectForm.clientId}
                                    onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Client</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>{client.username} ({client.email})</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Project Name"
                                value={projectForm.name}
                                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Description"
                                value={projectForm.description}
                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    value={projectForm.status}
                                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full">
                                Create Project
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
