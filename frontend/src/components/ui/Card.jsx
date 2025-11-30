import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass rounded-2xl p-8 border border-white/10 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
