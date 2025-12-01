import React from 'react';
import { Search, Filter, Eye } from 'lucide-react';
import Button from '../ui/Button';

const RequestsTable = ({
    requests,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
    onViewDetails,
    onCreateClient
}) => {
    return (
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
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="font-medium text-white group-hover:text-primary transition-colors">{req.fullName}</div>
                                    <div className="text-xs text-text-muted">{req.email}</div>
                                </td>
                                <td className="p-4 text-text-main">
                                    <button
                                        onClick={() => onViewDetails(req)}
                                        className="hover:text-primary hover:underline text-left transition-colors"
                                    >
                                        {req.companyName}
                                    </button>
                                </td>
                                <td className="p-4 text-text-main">{req.serviceType}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${req.status === 'PENDING' ? 'bg-accent/10 text-accent border-accent/20' :
                                        req.status === 'APPROVED' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => onViewDetails(req)} className="hover:bg-white/10">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    {req.status === 'PENDING' && (
                                        <Button size="sm" onClick={() => onCreateClient(req)} className="bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/20">
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
                                        <p>No requests found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default RequestsTable;
