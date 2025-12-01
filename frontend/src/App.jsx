import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import Projects from './pages/dashboard/Projects';
import ProjectDetails from './pages/dashboard/ProjectDetails';
import MyRequests from './pages/dashboard/MyRequests';
import Settings from './pages/dashboard/Settings';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Messages from './pages/dashboard/Messages';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/services" element={<Layout><Services /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />

                {/* Dashboard Routes - Layout is handled inside the pages */}
                <Route
                    path="/dashboard/client"
                    element={
                        <ErrorBoundary>
                            <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                                <ClientDashboard />
                            </ProtectedRoute>
                        </ErrorBoundary>
                    }
                />
                <Route
                    path="/dashboard/client/projects"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                            <Projects />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/client/projects/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                            <ProjectDetails role="client" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/client/requests"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                            <MyRequests />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/client/settings"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/client/messages"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_CLIENT']}>
                            <Messages role="client" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/admin/clients"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/admin/projects/:id"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <ProjectDetails role="admin" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/admin/messages"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <Messages role="admin" />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/admin/settings"
                    element={
                        <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                            <Settings role="admin" />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
