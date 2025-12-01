import api from './axios';

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export const updateProfile = async (userData) => {
    const response = await api.put('/users/profile', userData);
    // Update local storage if user data changes
    if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
};

export const changePassword = async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response.data;
};
