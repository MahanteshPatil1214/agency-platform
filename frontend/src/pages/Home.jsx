import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surfaceHighlight/50 border border-white/10 text-sm font-medium text-accent shadow-glow-primary backdrop-blur-sm"
            >
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Next Generation Platform</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight tracking-tight"
            >
                Build the Future with <br />
                <span className="text-gradient drop-shadow-2xl">Intelligent Solutions</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-text-muted max-w-2xl mb-12 leading-relaxed"
            >
                Empower your business with our cutting-edge full-stack solutions.
                Seamlessly integrate AI, secure authentication, and premium design.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
            >
                <Button size="lg" className="group w-full sm:w-auto text-lg shadow-glow-primary">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg">
                    View Demo
                </Button>
            </motion.div>

            {/* Abstract Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow" />
            <div className="absolute top-1/4 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-float" />
        </div>
    );
};

export default Home;
