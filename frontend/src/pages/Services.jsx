import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Briefcase, Share2 } from 'lucide-react';
import Card from '../components/ui/Card';

const ServiceCard = ({ icon: Icon, title, description, features }) => (
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
    </Card>
);

const Services = () => {
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
                        <ServiceCard {...service} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Services;
