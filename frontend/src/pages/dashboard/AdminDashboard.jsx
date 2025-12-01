import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, Activity, Briefcase, UserPlus, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getAdminStats, getServiceRequests, getAllClients, createProject, updateRequestStatus, getAllProjects } from '../../api/dashboard';
import { register } from '../../api/auth';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="glass-card p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
            <Icon className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-white/5`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                {trend && (
                    <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg flex items-center gap-1">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-heading font-bold text-white">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalClients: 0,
        activeProjects: 0,
        revenue: '$0',
        systemHealth: '0%'
    });
    const [requests, setRequests] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filtering and Sorting State
    const [statusFilter, setStatusFilter] = useState('All');
    const [serviceFilter, setServiceFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Newest');
    const [searchTerm, setSearchTerm] = useState('');

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
        status: 'Active',
        serviceType: 'Web Development',
        priority: 'Medium',
        startDate: '',
        endDate: ''
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch real requests
                const requestsData = await getServiceRequests();
                setRequests(requestsData);

                // Fetch all projects
                const projectsData = await getAllProjects();
                setProjects(projectsData);

                // Fetch real stats
                const statsData = await getAdminStats();
                setStats(statsData);

                // Fetch clients for duplicate check
                const clientsData = await getAllClients();
                setClients(clientsData);

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
            // Check if client already exists
            const existingClient = clients.find(c => c.email === request.email);
            if (existingClient) {
                // Client exists, open Create Project modal instead
                setProjectForm({
                    clientId: existingClient.id,
                    name: `${request.serviceType} Project`,
                    description: request.description,
                    status: 'Active',
                    serviceType: request.serviceType,
                    priority: 'Medium',
                    startDate: '',
                    endDate: ''
                });
                setSelectedRequest(request); // Keep track of request to update status later
                setShowDetailsModal(false);
                setShowProjectModal(true);
                alert(`Client with email ${request.email} already exists. Redirecting to Create Project.`);
                return;
            }

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
            const formattedProject = {
                ...projectForm,
                startDate: projectForm.startDate ? new Date(projectForm.startDate).toISOString() : null,
                endDate: projectForm.endDate ? new Date(projectForm.endDate).toISOString() : null
            };
            await createProject(formattedProject);
            setShowProjectModal(false);
            alert("Project created successfully!");
            // Refresh stats and projects
            const statsData = await getAdminStats();
            setStats(statsData);
            const projectsData = await getAllProjects();
            setProjects(projectsData);

            // If this was from a service request, update its status
            if (selectedRequest) {
                await updateRequestStatus(selectedRequest.id, 'APPROVED');
                // Refresh requests
                const requestsData = await getServiceRequests();
                setRequests(requestsData);
                setSelectedRequest(null); // Clear selected request
            }
        } catch (error) {
            console.error("Error creating project", error);
            alert("Failed to create project");
        }
    };

    const filteredRequests = requests
        .filter(req => {
            const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
            const matchesService = serviceFilter === 'All' || req.serviceType === serviceFilter;
            const matchesSearch =
                (req.fullName && req.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (req.companyName && req.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (req.email && req.email.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesStatus && matchesService && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
        });

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
                <StatCard title="Total Clients" value={stats.totalClients} icon={Users} color="bg-secondary" trend="+12%" />
                <StatCard title="Active Projects" value={stats.activeProjects} icon={Briefcase} color="bg-primary" trend="+5 new" />
                <StatCard title="Revenue (MoM)" value={stats.revenue} icon={DollarSign} color="bg-green-400" trend="+8.2%" />
                <StatCard title="System Health" value={stats.systemHealth} icon={Activity} color="bg-accent" />
            </div>

            {/* Active Projects Section */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-bold">Active Projects</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin/projects')}>View All</Button>
                </div>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.slice(0, 3).map((project) => (
                            <div
                                key={project.id}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                                onClick={() => navigate(`/dashboard/admin/projects/${project.id}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${project.status === 'Active' ? 'bg-primary/10 text-primary' :
                                        project.status === 'Completed' ? 'bg-green-400/10 text-green-400' :
                                            'bg-white/10 text-text-muted'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
                                    <div
                                        className="bg-primary h-1.5 rounded-full"
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-text-muted">
                                    <span>{project.serviceType}</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-text-muted">
                        No active projects found.
                    </div>
                )}
            </div>

            {/* Service Requests */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-bold">Service Requests</h2>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['All', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${statusFilter === status
                                        ? 'bg-primary text-black shadow-glow-primary'
                                        : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full glass-input pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="w-4 h-4 text-text-muted" />
                            <select
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                                className="glass-input py-2 text-sm"
                            >
                                <option value="All">All Services</option>
                                <option value="Web Development">Web Development</option>
                                <option value="App Development">App Development</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="SEO Optimization">SEO Optimization</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
                            <span className="text-sm text-text-muted">Sort by:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="glass-input py-2 text-sm"
                            >
                                <option value="Newest">Newest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
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
                            {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                                <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-white group-hover:text-primary transition-colors">{req.fullName}</div>
                                        <div className="text-xs text-text-muted">{req.email}</div>
                                    </td>
                                    <td className="p-4 text-text-main">{req.companyName}</td>
                                    <td className="p-4 text-text-main">{req.serviceType}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${req.status === 'PENDING' ? 'bg-accent/10 text-accent border-accent/20' :
                                            req.status === 'APPROVED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(req)} className="hover:bg-white/10">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        {req.status === 'PENDING' && (
                                            <Button size="sm" onClick={() => handleCreateClient(req)} className="bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20">
                                                Approve
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-text-muted">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                <Search className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p>No pending requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-lg glass-card p-6 animate-in fade-in zoom-in duration-200">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md glass-card p-6 animate-in fade-in zoom-in duration-200">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md glass-card p-6 animate-in fade-in zoom-in duration-200">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Service Type</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                        value={projectForm.serviceType}
                                        onChange={(e) => setProjectForm({ ...projectForm, serviceType: e.target.value })}
                                    >
                                        <option value="Web Development">Web Development</option>
                                        <option value="App Development">App Development</option>
                                        <option value="Digital Marketing">Digital Marketing</option>
                                        <option value="SEO Optimization">SEO Optimization</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-1">Priority</label>
                                    <select
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                        value={projectForm.priority}
                                        onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={projectForm.startDate}
                                    onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                                />
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={projectForm.endDate}
                                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                                />
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
