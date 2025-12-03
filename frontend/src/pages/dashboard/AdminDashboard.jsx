import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, UserPlus, XCircle, Users, DollarSign, Activity } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { getAdminStats, getServiceRequests, getAllClients, createProject, updateRequestStatus, getAllProjects } from '../../api/dashboard';
import { register } from '../../api/auth';

// Components
import StatCard from '../../components/dashboard/StatCard';
import StatsGrid from '../../components/dashboard/StatsGrid';
import ProjectsList from '../../components/dashboard/ProjectsList';
import RequestsTable from '../../components/dashboard/RequestsTable';
import CreateClientModal from '../../components/modals/CreateClientModal';
import CreateProjectModal from '../../components/modals/CreateProjectModal';

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
                console.log("Projects fetched:", projectsData);
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

    const handleApproveRequest = async (request = null) => {
        if (!request) {
            // Manual trigger for Create Client (button click)
            setClientForm({
                username: '',
                fullName: '',
                email: '',
                companyName: '',
                password: '',
                confirmPassword: ''
            });
            setSelectedRequest(null);
            setShowCreateModal(true);
            return;
        }

        // Handle Project Update Requests
        if (request.requestType === 'PROJECT_UPDATE') {
            if (window.confirm(`Approve update request for project "${request.companyName}"?`)) {
                try {
                    await updateRequestStatus(request.id, 'APPROVED');
                    // Refresh requests
                    const requestsData = await getServiceRequests();
                    setRequests(requestsData);
                    alert("Request approved successfully.");
                } catch (err) {
                    console.error("Error approving request", err);
                    alert("Failed to approve request.");
                }
            }
            return;
        }

        // Handle New Client / New Project Requests
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
            username: '',
            fullName: request.fullName,
            email: request.email,
            companyName: request.companyName,
            password: '',
            confirmPassword: ''
        });
        setSelectedRequest(request);
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
            const response = await register({
                username: clientForm.username,
                fullName: clientForm.fullName,
                email: clientForm.email,
                password: clientForm.password,
                companyName: clientForm.companyName,
                roles: ['client']
            });
            console.log("Register response:", response);

            // If this was from a service request, create project and update status
            if (selectedRequest) {
                console.log("Creating project for request:", selectedRequest);
                // Create Project automatically
                const newProject = {
                    clientId: response.userId, // Use ID from response
                    name: `${selectedRequest.serviceType} Project`,
                    description: selectedRequest.description,
                    status: 'Active',
                    serviceType: selectedRequest.serviceType,
                    priority: 'Medium',
                    startDate: new Date().toISOString(),
                    endDate: null // Open-ended by default
                };
                console.log("New Project Payload:", newProject);
                await createProject(newProject);
                console.log("Project created successfully");

                await updateRequestStatus(selectedRequest.id, 'APPROVED');
                // Refresh requests
                const requestsData = await getServiceRequests();
                setRequests(requestsData);

                // Refresh projects
                const projectsData = await getAllProjects();
                setProjects(projectsData);
            }

            // Refresh clients list to ensure duplicate check works for next time
            const clientsData = await getAllClients();
            setClients(clientsData);

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

    // Optimized filtering and sorting using useMemo
    const filteredRequests = useMemo(() => {
        return requests
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
    }, [requests, statusFilter, serviceFilter, searchTerm, sortOrder]);

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
                    <Button onClick={() => handleApproveRequest()}>
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

            <StatsGrid stats={stats} />

            <ProjectsList projects={projects} />

            <RequestsTable
                requests={filteredRequests}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                serviceFilter={serviceFilter}
                setServiceFilter={setServiceFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onViewDetails={handleViewDetails}
                onApprove={handleApproveRequest}
            />

            {/* View Details Modal - Kept inline for simplicity as it's small, or could be extracted too */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-2xl glass-card p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Request Details</h2>
                            <button onClick={() => setShowDetailsModal(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Full Name</label>
                                    <p className="font-medium">{selectedRequest.fullName}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-text-muted uppercase">Email</label>
                                    <p className="font-medium truncate" title={selectedRequest.email}>{selectedRequest.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Phone</label>
                                    <p className="font-medium">{selectedRequest.phoneNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Company</label>
                                    <p className="font-medium">{selectedRequest.companyName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Service Type</label>
                                    <p className="font-medium text-primary">{selectedRequest.serviceType}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Budget Range</label>
                                    <p className="font-medium">{selectedRequest.budgetRange || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase">Timeline</label>
                                    <p className="font-medium">{selectedRequest.timeline || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 md:col-span-3">
                                    <label className="text-xs text-text-muted uppercase">Reference Links</label>
                                    <p className="font-medium text-sm truncate text-blue-400">
                                        {selectedRequest.referenceLinks ? (
                                            <a href={selectedRequest.referenceLinks} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                {selectedRequest.referenceLinks}
                                            </a>
                                        ) : 'N/A'}
                                    </p>
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
                                <Button onClick={() => handleApproveRequest(selectedRequest)}>
                                    Approve & Create Account
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <CreateClientModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={submitCreateClient}
                form={clientForm}
                setForm={setClientForm}
                loading={createLoading}
                error={createError}
            />

            <CreateProjectModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onSubmit={submitCreateProject}
                form={projectForm}
                setForm={setProjectForm}
                clients={clients}
            />
        </DashboardLayout>
    );
};

export default AdminDashboard;
