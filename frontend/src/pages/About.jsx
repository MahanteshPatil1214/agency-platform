import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-heading font-bold mb-6"
            >
                About <span className="text-gradient">Us</span>
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-text-muted max-w-2xl"
            >
                Learn more about our mission, vision, and the team behind NAVAM.
            </motion.p>
        </div>
    );
};

export default About;
