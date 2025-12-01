import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { login } from '../api/auth';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login({
                username: formData.email,
                password: formData.password
            });
            // Redirect based on role
            if (data.roles && data.roles.includes('ROLE_ADMIN')) {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard/client');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md relative overflow-hidden">
                {/* Decorative background blur inside card */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Welcome Back</h2>
                        <p className="text-text-muted">Sign in to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 backdrop-blur-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Input
                            label="Email Address or Username"
                            type="text"
                            name="email"
                            placeholder="you@example.com or username"
                            value={formData.email}
                            onChange={handleChange}
                            icon={Mail}
                            required
                        />

                        <div className="flex flex-col gap-2">
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                icon={Lock}
                                required
                            />
                            <div className="flex justify-end">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full group mt-2 shadow-glow-primary"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>
                </div>

                {/* Registration link removed */}
            </Card>
        </div>
    );
};

export default Login;
