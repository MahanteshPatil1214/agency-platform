import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowLeft,
    Plus,
    MoreVertical,
    FileText,
    MessageSquare
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { getProjectById, addTask, updateTask } from '../../api/dashboard';

const ProjectDetails = ({ role = 'client' }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', status: 'Pending' });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching project details:", err);
                setError("Failed to load project details.");
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const updatedProject = await addTask(id, {
                ...newTask,
                completed: false
            });
            setProject(updatedProject);
            setShowAddTask(false);
            setNewTask({ title: '', status: 'Pending' });
        } catch (err) {
            console.error("Error adding task:", err);
            alert("Failed to add task");
        }
    };

    const handleToggleTask = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
            const isCompleted = newStatus === 'Completed';

            const updatedProject = await updateTask(id, taskId, {
                status: newStatus,
                completed: isCompleted
            });
            setProject(updatedProject);
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role={role}>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !project) {
        return (
            <DashboardLayout role={role}>
                <div className="flex flex-col items-center justify-center h-[60vh] text-text-muted">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <p>{error || "Project not found"}</p>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const calculateProgress = () => {
        if (!project.tasks || project.tasks.length === 0) return project.progress || 0;
        const completedTasks = project.tasks.filter(t => t.status === 'Completed').length;
        return Math.round((completedTasks / project.tasks.length) * 100);
    };

    const progress = calculateProgress();

    return (
        <DashboardLayout role={role}>
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-heading font-bold">{project.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${project.status === 'Active' ? 'bg-primary/10 text-primary border-primary/20' :
                                    project.status === 'Completed' ? 'bg-green-400/10 text-green-400 border-green-400/20' :
                                        'bg-accent/10 text-accent border-accent/20'
                                }`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-text-muted">{project.description}</p>
                    </div>

                    {role === 'admin' && (
                        <Button onClick={() => setShowAddTask(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Card */}
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-lg font-bold">Project Progress</h3>
                            <span className="text-2xl font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500 shadow-glow-primary"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-xs text-text-muted uppercase block mb-1">Start Date</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span className="font-medium">
                                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                <span className="text-xs text-text-muted uppercase block mb-1">Due Date</span>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-accent" />
                                    <span className="font-medium">
                                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Section */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-4">Tasks & Milestones</h3>

                        {project.tasks && project.tasks.length > 0 ? (
                            <div className="space-y-3">
                                {project.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${task.status === 'Completed'
                                                ? 'bg-green-400/5 border-green-400/20'
                                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => role === 'admin' && handleToggleTask(task.id, task.status)}
                                                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${task.status === 'Completed'
                                                        ? 'bg-green-400 border-green-400 text-black'
                                                        : 'border-white/30 hover:border-primary'
                                                    } ${role !== 'admin' ? 'cursor-default' : 'cursor-pointer'}`}
                                            >
                                                {task.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                                            </button>
                                            <span className={task.status === 'Completed' ? 'text-text-muted line-through' : 'text-white'}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-lg ${task.status === 'Completed' ? 'bg-green-400/10 text-green-400' : 'bg-white/10 text-text-muted'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-text-muted bg-white/5 rounded-xl border border-dashed border-white/10">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>No tasks created yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-4">Project Info</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-text-muted uppercase block mb-1">Service Type</span>
                                <div className="flex items-center gap-2 text-white">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    {project.serviceType || 'General'}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-text-muted uppercase block mb-1">Priority</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${project.priority === 'High' || project.priority === 'Critical' ? 'bg-red-400/10 text-red-400' :
                                            project.priority === 'Medium' ? 'bg-accent/10 text-accent' :
                                                'bg-green-400/10 text-green-400'
                                        }`}>
                                        {project.priority || 'Medium'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-text-muted uppercase block mb-1">Client ID</span>
                                <code className="text-xs bg-black/30 px-2 py-1 rounded text-text-muted font-mono">
                                    {project.clientId}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {showAddTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md glass-card p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Add New Task</h2>
                            <button onClick={() => setShowAddTask(false)} className="text-text-muted hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleAddTask} className="space-y-4">
                            <Input
                                label="Task Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                required
                                placeholder="e.g., Design Homepage Mockup"
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1">Status</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full">
                                Add Task
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ProjectDetails;
