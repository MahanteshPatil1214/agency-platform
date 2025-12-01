import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
        // Redirect to appropriate dashboard if role doesn't match
        if (user.roles.includes('ROLE_ADMIN')) {
            return <Navigate to="/dashboard/admin" replace />;
        } else {
            return <Navigate to="/dashboard/client" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
