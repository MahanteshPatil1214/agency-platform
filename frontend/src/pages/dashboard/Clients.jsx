import React, { useState, useEffect } from 'react';
import { Search, Mail, Building, Phone, MoreVertical, UserPlus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import { getAllClients } from '../../api/dashboard';
import CreateClientModal from '../../components/modals/CreateClientModal';
import { register } from '../../api/auth';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [clientForm, setClientForm] = useState({
        fullName: '',
        email: '',
        companyName: '',
        password: '',
        confirmPassword: ''
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await getAllClients();
            setClients(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setLoading(false);
        }
    };

    const handleCreateClient = () => {
        setClientForm({
            username: '',
            fullName: '',
            email: '',
            companyName: '',
            password: '',
            confirmPassword: ''
        });
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
                username: clientForm.username,
                fullName: clientForm.fullName,
                email: clientForm.email,
                password: clientForm.password,
                companyName: clientForm.companyName,
                roles: ['client']
            });

            await fetchClients();
            setShowCreateModal(false);
            alert("Client account created successfully!");
        } catch (err) {
            setCreateError(err.response?.data?.message || "Failed to create client");
        } finally {
            setCreateLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        (client.fullName && client.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.companyName && client.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Clients</h1>
                    <p className="text-text-muted">Manage your client base and their details.</p>
                </div>
                <Button onClick={handleCreateClient}>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add New Client
                </Button>
            </div>

            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full glass-input pl-10"
                        />
                    </div>
                    <div className="text-sm text-text-muted">
                        Total Clients: <span className="text-white font-bold">{filteredClients.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-text-muted border-b border-white/10">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Company</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Joined Date</th>
                                <th className="p-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length > 0 ? filteredClients.map((client) => (
                                <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {client.fullName ? client.fullName.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <span className="font-medium text-white">{client.fullName || client.username}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-main">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-text-muted" />
                                            {client.companyName || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-main">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-text-muted" />
                                            {client.email}
                                        </div>
                                    </td>
                                    <td className="p-4 text-text-muted">
                                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-text-muted">
                                        No clients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateClientModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={submitCreateClient}
                form={clientForm}
                setForm={setClientForm}
                loading={createLoading}
                error={createError}
            />
        </DashboardLayout>
    );
};

export default Clients;
