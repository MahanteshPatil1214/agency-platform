import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, AlertTriangle, ArrowRight, CheckCircle, Brain } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { getAllProjects, getClientProjects, callMcpTool } from '../../api/dashboard';

const AIAssistant = ({ role }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const data = role === 'client'
                    ? await getClientProjects()
                    : await getAllProjects();
                setProjects(data);
                if (data.length > 0) setSelectedProject(data[0].id);
            } catch (error) {
                console.error("Error fetching projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [role]);

    const handleAnalyze = async () => {
        if (!selectedProject) return;
        setAnalyzing(true);
        setAnalysis(null);
        try {
            const result = await callMcpTool('analyze_project', { projectId: selectedProject });
            setAnalysis(parseAnalysis(result.analysis));
        } catch (error) {
            console.error("Error analyzing project", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const parseAnalysis = (text) => {
        console.log("Raw AI Response:", text); // Debugging
        if (!text) return null;

        try {
            // 1. Try to find JSON object if it's wrapped in text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonStr);
            }

            // 2. If no JSON found, try to parse sections via Regex
            // Matches "**Status:** content... **Risks:** content... **Next Steps:** content..."
            const statusMatch = text.match(/\*\*Status:\*\*\s*([\s\S]*?)(?=\*\*Risks:|$)/i);
            const risksMatch = text.match(/\*\*Risks:\*\*\s*([\s\S]*?)(?=\*\*Next Steps:|$)/i);
            const nextStepsMatch = text.match(/\*\*Next Steps:\*\*\s*([\s\S]*?)$/i);

            if (statusMatch || risksMatch || nextStepsMatch) {
                return {
                    status: statusMatch ? statusMatch[1].trim() : "See full report below.",
                    risks: risksMatch ? risksMatch[1].trim() : "See full report below.",
                    nextSteps: nextStepsMatch ? nextStepsMatch[1].trim() : "See full report below."
                };
            }

            // 3. Fallback: If all parsing fails, display raw text in Status
            return {
                status: text,
                risks: "See Project Status for details.",
                nextSteps: "See Project Status for details."
            };
        } catch (e) {
            console.error("Failed to parse AI response", e);
            return {
                status: text,
                risks: "See Project Status for details.",
                nextSteps: "See Project Status for details."
            };
        }
    };

    const renderSectionContent = (content) => {
        if (!content) return null;
        return content.split('\n').map((line, i) => (
            <p key={i} className="mb-2 text-sm text-text-muted leading-relaxed">
                {line.replace(/^\*\s/, '• ').replace(/\*\*/g, '')}
            </p>
        ));
    };

    return (
        <DashboardLayout role={role}>
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Brain className="text-primary w-8 h-8" />
                    </div>
                    AI Project Intelligence
                </h1>
                <p className="text-text-muted">Advanced AI analysis to detect risks and optimize project delivery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-accent" />
                            Run Analysis
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Select Project</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <option>Loading projects...</option>
                                    ) : projects.length === 0 ? (
                                        <option>No projects found</option>
                                    ) : (
                                        projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                className="w-full py-4 text-lg shadow-glow-primary"
                                disabled={analyzing || !selectedProject}
                            >
                                {analyzing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-3"></div>
                                        Analyzing Project...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate Report
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="glass-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Pro Tip
                        </h3>
                        <p className="text-sm text-text-muted">
                            Regular analysis helps identify potential blockers before they impact your timeline. Run this weekly for active projects.
                        </p>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8">
                    {analysis ? (
                        <div className="space-y-6 animate-fade-in">
                            {/* Status Card */}
                            <div className="glass-card p-6 border-l-4 border-l-green-500">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                                    <Activity className="w-5 h-5" />
                                    Project Status
                                </h3>
                                <div className="bg-black/20 rounded-xl p-4">
                                    {renderSectionContent(analysis.status) || <p className="text-text-muted">No specific status data found.</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Risks Card */}
                                <div className="glass-card p-6 border-l-4 border-l-red-500">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                                        <AlertTriangle className="w-5 h-5" />
                                        Risk Assessment
                                    </h3>
                                    <div className="bg-black/20 rounded-xl p-4 min-h-[150px]">
                                        {renderSectionContent(analysis.risks) || <p className="text-text-muted">No risks identified.</p>}
                                    </div>
                                </div>

                                {/* Next Steps Card */}
                                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                                        <ArrowRight className="w-5 h-5" />
                                        Recommended Actions
                                    </h3>
                                    <div className="bg-black/20 rounded-xl p-4 min-h-[150px]">
                                        {renderSectionContent(analysis.nextSteps) || <p className="text-text-muted">No specific actions recommended.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-white/10">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                                <Brain className="w-10 h-10 text-text-muted opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ready to Analyze</h3>
                            <p className="text-text-muted max-w-md mx-auto">
                                Select a project from the left panel to generate a comprehensive AI-powered health report, risk assessment, and action plan.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AIAssistant;
