import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, User } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getContacts, getMessages, sendMessage } from '../../api/dashboard';
import { getCurrentUser } from '../../api/auth';

const Messages = ({ role }) => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUser = getCurrentUser();

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            // Poll for new messages every 5 seconds
            const interval = setInterval(() => {
                fetchMessages(selectedContact.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchContacts = async () => {
        try {
            const data = await getContacts();
            setContacts(data);
            if (data.length > 0 && !selectedContact) {
                setSelectedContact(data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contacts", error);
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const data = await getMessages(userId);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        setSending(true);
        try {
            await sendMessage(selectedContact.id, newMessage);
            setNewMessage('');
            fetchMessages(selectedContact.id);
        } catch (error) {
            console.error("Error sending message", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <DashboardLayout role={role}>
            <div className="h-[calc(100vh-8rem)] flex gap-6">
                {/* Contacts Sidebar */}
                <div className="w-1/3 flex flex-col glass-card p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="text-lg font-heading font-bold mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                className="w-full glass-input pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-4 text-center text-text-muted">Loading contacts...</div>
                        ) : contacts.length === 0 ? (
                            <div className="p-4 text-center text-text-muted">No contacts found.</div>
                        ) : (
                            contacts.map(contact => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all duration-200 text-left border-b border-white/5 ${selectedContact?.id === contact.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${selectedContact?.id === contact.id ? 'bg-primary text-black shadow-glow-primary' : 'bg-white/5 text-text-muted'
                                        }`}>
                                        {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-medium truncate transition-colors ${selectedContact?.id === contact.id ? 'text-white' : 'text-text-muted'
                                            }`}>{contact.fullName || contact.username}</h3>
                                        <p className="text-xs text-text-muted truncate opacity-70">{contact.companyName || contact.email}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col glass-card p-0 overflow-hidden">
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5 backdrop-blur-md">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold shadow-glow-primary">
                                    {selectedContact.fullName ? selectedContact.fullName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold">{selectedContact.fullName || selectedContact.username}</h3>
                                    <p className="text-xs text-text-muted">{selectedContact.email}</p>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Send className="w-6 h-6" />
                                        </div>
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.senderId === currentUser.id;
                                        return (
                                            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${isMe ? 'bg-primary text-black rounded-tr-none shadow-glow-primary' : 'glass text-white rounded-tl-none'
                                                    }`}>
                                                    <p className="text-sm font-medium">{msg.content}</p>
                                                    <p className={`text-[10px] mt-2 text-right ${isMe ? 'text-black/60' : 'text-white/40'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex gap-3 bg-white/5 backdrop-blur-md">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 glass-input"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" disabled={!newMessage.trim() || sending} className="px-4 aspect-square flex items-center justify-center rounded-xl">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-text-muted">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse-slow">
                                <User className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-2">Select a Contact</h3>
                            <p className="text-sm opacity-50">Choose a person from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Messages;
