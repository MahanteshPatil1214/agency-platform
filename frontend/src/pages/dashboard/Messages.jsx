import React, { useState, useEffect } from 'react';
import { Search, Mail, Star, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import ComposeMessageModal from '../../components/modals/ComposeMessageModal';
import { getMessages, getContacts } from '../../api/dashboard';
import { getCurrentUser } from '../../api/auth';

const Messages = ({ role }) => {
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [selectedThread, setSelectedThread] = useState(null);
    const currentUser = getCurrentUser();

    // Mock grouping for now since backend returns flat list
    // In a real app, backend should return threads
    const processMessages = (flatMessages) => {
        // Group by subject + other person
        const threads = {};
        flatMessages.forEach(msg => {
            const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            const key = `${otherId}-${msg.subject || 'No Subject'}`;

            if (!threads[key]) {
                threads[key] = {
                    id: key,
                    otherId,
                    subject: msg.subject || '(No Subject)',
                    priority: msg.priority || 'NORMAL',
                    messages: [],
                    lastMessage: null,
                    updatedAt: null
                };
            }
            threads[key].messages.push(msg);
            // Update last message info
            if (!threads[key].updatedAt || new Date(msg.createdAt) > new Date(threads[key].updatedAt)) {
                threads[key].updatedAt = msg.createdAt;
                threads[key].lastMessage = msg;
            }
        });
        return Object.values(threads).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    };

    const fetchAllMessages = async () => {
        setLoading(true);
        try {
            // Fetch contacts first to know who to fetch messages for
            // This is inefficient but works for now without a dedicated "get all my threads" endpoint
            const contactsData = await getContacts();
            setContacts(contactsData);
            let allMsgs = [];
            for (const contact of contactsData) {
                const msgs = await getMessages(contact.id);
                allMsgs = [...allMsgs, ...msgs];
            }
            // Remove duplicates if any (though logic above shouldn't create them if API is clean)
            // Filter unique by ID
            allMsgs = Array.from(new Map(allMsgs.map(m => [m.id, m])).values());

            setMessages(processMessages(allMsgs));
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllMessages();
    }, []);

    const getSenderName = (senderId) => {
        if (senderId === currentUser.id) return 'You';
        const contact = contacts.find(c => c.id === senderId);
        return contact ? (contact.fullName || contact.username) : 'Unknown Sender';
    };

    return (
        <DashboardLayout role={role}>
            <div className="h-[calc(100vh-8rem)] flex gap-6">
                {/* Inbox List */}
                <div className={`${selectedThread ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 flex-col glass-card p-0 overflow-hidden`}>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-xl font-heading font-bold">Inbox</h2>
                        <Button size="sm" onClick={() => setShowCompose(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Compose
                        </Button>
                    </div>

                    <div className="p-4 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full glass-input pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-text-muted">Loading inbox...</div>
                        ) : messages.length === 0 ? (
                            <div className="p-8 text-center text-text-muted flex flex-col items-center">
                                <Mail className="w-12 h-12 mb-4 opacity-20" />
                                <p>No messages yet</p>
                            </div>
                        ) : (
                            messages.map(thread => (
                                <div
                                    key={thread.id}
                                    onClick={() => setSelectedThread(thread)}
                                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${selectedThread?.id === thread.id ? 'bg-white/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-white truncate pr-2">
                                            {getSenderName(thread.otherId)}: {thread.subject}
                                        </h3>
                                        <span className="text-xs text-text-muted whitespace-nowrap">
                                            {new Date(thread.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-xs px-2 py-0.5 rounded ${thread.priority === 'HIGH' ? 'bg-red-400/10 text-red-400' :
                                            thread.priority === 'LOW' ? 'bg-white/10 text-text-muted' :
                                                'bg-primary/10 text-primary'
                                            }`}>
                                            {thread.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-muted truncate">
                                        {thread.lastMessage?.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Thread View */}
                <div className={`${selectedThread ? 'flex' : 'hidden lg:flex'} flex-1 flex-col glass-card p-0 overflow-hidden`}>
                    {selectedThread ? (
                        <>
                            {/* Thread Header */}
                            <div className="p-6 border-b border-white/5 bg-white/5">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 lg:hidden mb-2">
                                        <button onClick={() => setSelectedThread(null)} className="text-text-muted hover:text-white">
                                            <ChevronRight className="w-5 h-5 rotate-180" />
                                        </button>
                                        <span className="text-sm text-text-muted">Back to Inbox</span>
                                    </div>
                                    <h1 className="text-2xl font-heading font-bold">{selectedThread.subject}</h1>
                                    <div className="flex gap-2">
                                        <span className={`px-3 py-1 rounded text-xs font-medium border ${selectedThread.priority === 'HIGH' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                                            'bg-primary/10 text-primary border-primary/20'
                                            }`}>
                                            {selectedThread.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {selectedThread.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, idx) => {
                                    const isMe = msg.senderId === currentUser.id;
                                    return (
                                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[80%] rounded-xl p-5 ${isMe ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'
                                                }`}>
                                                <div className="flex justify-between items-center mb-2 gap-4">
                                                    <span className="font-bold text-sm text-white">
                                                        {getSenderName(msg.senderId)}
                                                    </span>
                                                    <span className="text-xs text-text-muted">
                                                        {new Date(msg.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-text-muted leading-relaxed whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Mail className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-2">Select a Conversation</h3>
                            <p className="text-sm opacity-50">Choose a thread from the inbox to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {showCompose && (
                <ComposeMessageModal
                    onClose={() => setShowCompose(false)}
                    onMessageSent={() => {
                        fetchAllMessages();
                        setShowCompose(false);
                    }}
                />
            )}
        </DashboardLayout>
    );
};

export default Messages;
