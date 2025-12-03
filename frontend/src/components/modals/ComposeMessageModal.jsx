import React, { useState, useEffect } from 'react';
import { X, Send, Paperclip } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getContacts, sendMessage } from '../../api/dashboard';

const ComposeMessageModal = ({ onClose, onMessageSent }) => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({
        receiverId: '',
        subject: '',
        priority: 'NORMAL',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingContacts, setFetchingContacts] = useState(true);

    useEffect(() => {
        const fetchContactsData = async () => {
            try {
                const data = await getContacts();
                setContacts(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, receiverId: data[0].id }));
                }
            } catch (error) {
                console.error("Error fetching contacts", error);
            } finally {
                setFetchingContacts(false);
            }
        };
        fetchContactsData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.receiverId || !formData.content) return;

        setLoading(true);
        try {
            await sendMessage(formData.receiverId, formData.content, formData.subject, formData.priority);
            onMessageSent();
            onClose();
        } catch (error) {
            console.error("Error sending message", error);
            alert("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-2xl glass-card p-0 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-heading font-bold">New Message</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* To */}
                    <div className="flex items-center gap-4">
                        <label className="w-16 text-sm font-medium text-text-muted">To:</label>
                        <select
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
                            value={formData.receiverId}
                            onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
                            disabled={fetchingContacts}
                        >
                            {fetchingContacts ? (
                                <option>Loading contacts...</option>
                            ) : (
                                contacts.map(contact => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.fullName || contact.username} ({contact.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-4">
                        <label className="w-16 text-sm font-medium text-text-muted">Subject:</label>
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter subject..."
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-4">
                        <label className="w-16 text-sm font-medium text-text-muted">Priority:</label>
                        <div className="flex gap-4">
                            {['LOW', 'NORMAL', 'HIGH'].map((p) => (
                                <label key={p} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="priority"
                                        value={p}
                                        checked={formData.priority === p}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="accent-primary"
                                    />
                                    <span className={`text-sm ${p === 'HIGH' ? 'text-red-400' :
                                            p === 'LOW' ? 'text-text-muted' : 'text-white'
                                        }`}>
                                        {p.charAt(0) + p.slice(1).toLowerCase()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mt-4">
                        <textarea
                            className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary resize-none"
                            placeholder="Write your message here..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        ></textarea>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-between items-center">
                    <button className="text-text-muted hover:text-white flex items-center gap-2 text-sm">
                        <Paperclip className="w-4 h-4" />
                        Attach File
                    </button>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose}>Discard</Button>
                        <Button onClick={handleSubmit} disabled={loading || !formData.content || !formData.receiverId}>
                            {loading ? 'Sending...' : (
                                <>
                                    Send Message
                                    <Send className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComposeMessageModal;
