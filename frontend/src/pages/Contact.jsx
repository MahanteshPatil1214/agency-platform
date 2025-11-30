import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-heading font-bold mb-6"
            >
                Get in <span className="text-gradient">Contact</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-text-muted max-w-2xl"
            >
                We'd love to hear from you. Reach out to us for any inquiries or support.
            </motion.p>
        </div>
    );
};

export default Contact;
