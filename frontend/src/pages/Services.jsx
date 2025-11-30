import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle, Code, Smartphone, Globe, Database, Cloud, Lock, Briefcase, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import api from '../api/axios';

const ServiceCard = ({ icon: Icon, title, description, features, onRequest }) => (
    <Card className="h-full hover:border-primary/50 transition-colors duration-300 group flex flex-col">
        <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-heading font-bold mb-3">{title}</h3>
        <p className="text-text-muted mb-6 flex-grow">{description}</p>
        <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-text-muted">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                    {feature}
                </li>
            ))}
        </ul>
        <Button className="w-full" onClick={onRequest}>
            Raise a Request
            <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
    </Card>
);

const Services = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyName: '',
        serviceType: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const services = [
        {
            icon: Briefcase,
            title: "Service Based Company",
            description: "End-to-end software development and IT consulting services for your business.",
            features: ["Custom Software Development", "Enterprise Solutions", "IT Consulting", "System Integration"]
        },
        {
            icon: Share2,
            title: "Social Media Agency",
            description: "Strategic social media management and digital marketing solutions.",
            features: ["Content Strategy", "Brand Management", "Digital Marketing", "Analytics & Growth"]
        }
    ];

    const handleRequest = (serviceTitle) => {
        setFormData(prev => ({ ...prev, serviceType: serviceTitle }));
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/requests/submit', formData);
            setSuccess(true);
            setTimeout(() => {
                setShowForm(false);
                setSuccess(false);
                setFormData({
                    fullName: '',
                    email: '',
                    companyName: '',
                    serviceType: '',
                    description: ''
                });
            }, 3000);
        } catch (error) {
            console.error('Error submitting request:', error);
            setError('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-20">
            {/* Header */}
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-heading font-bold mb-6"
                >
                    Our <span className="text-gradient">Services</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-text-muted max-w-2xl mx-auto"
                >
                    Choose the right solution for your business needs.
                </motion.p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto px-4">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                    >
                        <ServiceCard {...service} onRequest={() => handleRequest(service.title)} />
                    </motion.div>
                ))}
            </div>

            {/* Request Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-lg"
                    >
                        <Card className="relative">
                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-4 right-4 text-text-muted hover:text-white"
                            >
                                ✕
                            </button>

                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
                                    <p className="text-text-muted">We'll be in touch shortly.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-heading font-bold mb-6">Request Service</h2>
                                    <p className="text-text-muted mb-6">
                                        Requesting for: <span className="text-primary font-bold">{formData.serviceType}</span>
                                    </p>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            label="Full Name"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Company Name"
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                            required
                                        />

                                        {/* Hidden or Read-only Service Type */}
                                        <div className="hidden">
                                            <Input
                                                label="Service Type"
                                                value={formData.serviceType}
                                                readOnly
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-muted mb-1">Project Description</label>
                                            <textarea
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white min-h-[100px]"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                required
                                                placeholder="Tell us about your requirements..."
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? 'Submitting...' : 'Submit Request'}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Services;
