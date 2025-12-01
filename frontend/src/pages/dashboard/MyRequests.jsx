import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { getMyRequests } from '../../api/dashboard';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getMyRequests();
                setRequests(data);
            } catch (error) {
                console.error("Error fetching requests", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-primary bg-primary/10 border border-primary/20';
            case 'REJECTED': return 'text-red-400 bg-red-400/10 border border-red-400/20';
            case 'PENDING': return 'text-accent bg-accent/10 border border-accent/20';
            default: return 'text-text-muted bg-white/5 border border-white/10';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'REJECTED': return <XCircle className="w-4 h-4 mr-1" />;
            case 'PENDING': return <Clock className="w-4 h-4 mr-1" />;
            default: return <AlertCircle className="w-4 h-4 mr-1" />;
        }
    };

    return (
        <DashboardLayout role="client">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold mb-2">My Requests</h1>
                <p className="text-text-muted">Track the status of your service requests.</p>
            </div>

            <Card>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : requests.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-text-muted border-b border-white/10">
                                    <th className="p-4 font-medium">Request Type</th>
                                    <th className="p-4 font-medium">Service</th>
                                    <th className="p-4 font-medium">Description</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{req.requestType?.replace('_', ' ') || 'N/A'}</td>
                                        <td className="p-4 text-primary">{req.serviceType || 'N/A'}</td>
                                        <td className="p-4 max-w-xs truncate text-text-muted" title={req.description}>
                                            {req.description}
                                        </td>
                                        <td className="p-4 text-sm text-text-muted">
                                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                                                {getStatusIcon(req.status)}
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-text-muted" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Requests Found</h3>
                        <p className="text-text-muted">You haven't submitted any service requests yet.</p>
                    </div>
                )}
            </Card>
        </DashboardLayout>
    );
};

export default MyRequests;
