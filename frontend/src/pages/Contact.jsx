import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { submitServiceRequest } from '../api/dashboard';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        serviceType: 'Web Development',
        budgetRange: 'Less than $1,000',
        timeline: 'Urgent (ASAP)',
        description: '',
        referenceLinks: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const SERVICE_TYPE_MAPPING = {
        'Web Development': 'WEB_DEVELOPMENT',
        'App Development': 'APP_DEVELOPMENT',
        'Digital Marketing': 'DIGITAL_MARKETING',
        'SEO Optimization': 'SEO_OPTIMIZATION',
        'UI/UX Design': 'UI_UX_DESIGN'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Public requests are always NEW_CLIENT
            const payload = {
                ...formData,
                serviceType: SERVICE_TYPE_MAPPING[formData.serviceType],
                requestType: 'NEW_CLIENT'
            };

            await submitServiceRequest(payload);
            setMessage({ type: 'success', text: 'Request submitted! Our team will review it and contact you.' });
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                companyName: '',
                serviceType: 'Web Development',
                budgetRange: 'Less than $1,000',
                timeline: 'Urgent (ASAP)',
                description: '',
                referenceLinks: ''
            });
        } catch (error) {
            console.error("Submission error:", error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to submit request. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        Start Your <span className="text-gradient">Project</span>
                    </h1>
                    <p className="text-text-muted text-lg">
                        Tell us about your vision. The more detail you provide, the better we can understand your needs.
                    </p>
                </motion.div>

                <Card className="p-8">
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                            />
                            <Input
                                label="Company Name (Optional)"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-muted">Service Type</label>
                                <select
                                    value={formData.serviceType}
                                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="App Development">App Development</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="SEO Optimization">SEO Optimization</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-muted">Estimated Budget</label>
                                <select
                                    value={formData.budgetRange}
                                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="Less than $1,000">Less than $1,000</option>
                                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                                    <option value="$10,000+">$10,000+</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-muted">Timeline Expectation</label>
                            <select
                                value={formData.timeline}
                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="Urgent (ASAP)">Urgent (ASAP)</option>
                                <option value="1 Month">Within 1 Month</option>
                                <option value="1-3 Months">1-3 Months</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-muted">Project Description (Be Detailed)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors min-h-[150px]"
                                placeholder="Describe your project goals, target audience, and key features..."
                                required
                            />
                        </div>

                        <Input
                            label="Reference Links (Optional)"
                            placeholder="e.g., websites you like, design inspiration"
                            value={formData.referenceLinks}
                            onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                        />

                        <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                            {!loading && <Send className="w-5 h-5 ml-2" />}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Contact;
