import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ProjectsList = ({ projects }) => {
    const navigate = useNavigate();

    return (
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
    );
};

export default ProjectsList;
