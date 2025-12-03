import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, Clock, CheckCircle, AlertCircle, Search, Filter, X, Edit, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getClientProjects, submitServiceRequest } from '../../api/dashboard';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [serviceFilter, setServiceFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Recently Updated');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('new'); // 'new' or 'existing'
    const [selectedProject, setSelectedProject] = useState(null);
    const [requestLoading, setRequestLoading] = useState(false);
    const [requestMessage, setRequestMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        serviceType: 'Web Development',
        description: '',
        companyName: '',
        projectName: '',
        priority: 'Medium',
        budgetRange: 'Less than $1,000',
        timeline: 'Urgent (ASAP)',
        referenceLinks: ''
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getClientProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const openNewProjectModal = () => {
        setModalType('new');
        setFormData({
            serviceType: 'Web Development',
            description: '',
            companyName: '',
            projectName: '',
            priority: 'Medium',
            budgetRange: 'Less than $1,000',
            timeline: 'Urgent (ASAP)',
            referenceLinks: ''
        });
        setSelectedProject(null);
        setShowModal(true);
    };

    const openExistingProjectModal = (project) => {
        setModalType('existing');
        setFormData({
            serviceType: project.serviceType || 'Web Development',
            description: '',
            companyName: project.name,
            projectName: project.name,
            priority: 'Medium',
            budgetRange: 'Less than $1,000',
            timeline: 'Urgent (ASAP)',
            referenceLinks: ''
        });
        setSelectedProject(project);
        setShowModal(true);
    };

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        setRequestLoading(true);
        setRequestMessage({ type: '', text: '' });

        const requestData = {
            ...formData,
            projectId: selectedProject ? selectedProject.id : null,
            serviceType: formData.serviceType,
            requestType: modalType === 'existing' ? 'PROJECT_UPDATE' : 'NEW_PROJECT'
        };

        try {
            await submitServiceRequest(requestData);
            setRequestMessage({ type: 'success', text: 'Request submitted successfully!' });
            setTimeout(() => {
                setShowModal(false);
                setRequestMessage({ type: '', text: '' });
            }, 2000);
        } catch (error) {
            setRequestMessage({ type: 'error', text: 'Failed to submit request.' });
        } finally {
            setRequestLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-blue-400 bg-blue-400/10';
            case 'Completed': return 'text-green-400 bg-green-400/10';
            case 'Pending': return 'text-yellow-400 bg-yellow-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const filteredProjects = projects
        .filter(project => {
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
            const matchesService = serviceFilter === 'All' || project.serviceType === serviceFilter;
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesService && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'Recently Updated':
                    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
                case 'Newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'Oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                default:
                    return 0;
            }
        });

    return (
        <DashboardLayout role="client">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">My Projects</h1>
                    <p className="text-text-muted">Manage and track your ongoing projects.</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={openNewProjectModal}>
                        + Start New Project
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <Card className="mb-8 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {/* Status Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['All', 'Active', 'Pending', 'Completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                        ? 'bg-primary text-white'
                                        : 'bg-white/5 text-text-muted hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center border-t border-white/10 pt-4">
                        {/* Service Type Filter */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="w-4 h-4 text-text-muted" />
                            <select
                                value={serviceFilter}
                                onChange={(e) => setServiceFilter(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="All">All Services</option>
                                <option value="Web Development">Web Development</option>
                                <option value="App Development">App Development</option>
                                <option value="Digital Marketing">Digital Marketing</option>
                                <option value="SEO Optimization">SEO Optimization</option>
                                <option value="UI/UX Design">UI/UX Design</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="flex items-center gap-2 w-full md:w-auto ml-auto">
                            <span className="text-sm text-text-muted">Sort by:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="Recently Updated">Recently Updated</option>
                                <option value="Newest">Newest</option>
                                <option value="Oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Projects Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <Card
                            key={project.id}
                            className="flex flex-col h-full hover:border-primary/30 transition-colors cursor-pointer group relative"
                            onClick={() => navigate(`/dashboard/client/projects/${project.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary/10 transition-colors">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.serviceType && (
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                        {project.serviceType}
                                    </span>
                                )}
                                {project.priority && (
                                    <span className={`text-xs font-medium px-2 py-1 rounded border ${project.priority === 'High' || project.priority === 'Critical' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                                        {project.priority} Priority
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                            <p className="text-text-muted text-sm mb-6 line-clamp-2 flex-grow">
                                {project.description}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex items-center text-sm text-text-muted">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Started: {new Date(project.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                {project.endDate && (
                                    <div className="flex items-center text-sm text-text-muted">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-text-muted">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>

                            <div className="mt-6 mb-4">
                                <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress || 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-text-muted">
                                    <span>Progress</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <Button
                                    variant="outline"
                                    className="flex-1 border-white/10 hover:bg-white/5"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openExistingProjectModal(project);
                                    }}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Request Changes
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="px-3 hover:bg-primary/10 hover:text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dashboard/client/projects/${project.id}`);
                                    }}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
                    <p className="text-text-muted mb-6">You don't have any projects matching your criteria.</p>
                    <Button onClick={openNewProjectModal}>Start New Project</Button>
                </div>
            )}

            {/* Request Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            {modalType === 'new' ? 'Start New Project' : `Request Changes: ${selectedProject?.name}`}
                        </h2>

                        {requestMessage.text && (
                            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${requestMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                {requestMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {requestMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateRequest} className="space-y-4">
                            {modalType === 'new' ? (
                                <>
                                    <Input
                                        label="Project Name"
                                        value={formData.projectName}
                                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-muted">Service Type</label>
                                            <select
                                                value={formData.serviceType}
                                                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="Web Development">Web Development</option>
                                                <option value="App Development">App Development</option>
                                                <option value="Digital Marketing">Digital Marketing</option>
                                                <option value="SEO Optimization">SEO Optimization</option>
                                                <option value="UI/UX Design">UI/UX Design</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-muted">Budget Range</label>
                                            <select
                                                value={formData.budgetRange}
                                                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            >
                                                <option value="Less than $1,000">Less than $1,000</option>
                                                <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                                                <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                                <option value="$10,000+">$10,000+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-text-muted">Timeline</label>
                                        <select
                                            value={formData.timeline}
                                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        >
                                            <option value="Urgent (ASAP)">Urgent (ASAP)</option>
                                            <option value="1 Month">Within 1 Month</option>
                                            <option value="1-3 Months">1-3 Months</option>
                                            <option value="Flexible">Flexible</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-text-muted">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-muted">
                                    {modalType === 'new' ? 'Detailed Description' : 'Change Details'}
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[100px]"
                                    placeholder={modalType === 'new' ? "Describe your project goals, features, and target audience..." : "Describe the changes you need..."}
                                    required
                                />
                            </div>

                            {modalType === 'new' && (
                                <Input
                                    label="Reference Links (Optional)"
                                    placeholder="e.g., inspiration websites"
                                    value={formData.referenceLinks}
                                    onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                                />
                            )}

                            <Button type="submit" className="w-full" disabled={requestLoading}>
                                {requestLoading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Projects;
