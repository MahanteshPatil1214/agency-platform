import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

// Client Dashboard API
export const getClientStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects/stats`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching client stats", error);
        throw error;
    }
};

export const getClientProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects/my-projects`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching client projects", error);
        throw error;
    }
};

export const submitServiceRequest = async (requestData) => {
    try {
        const response = await axios.post(`${API_URL}/requests/submit`, requestData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error submitting service request", error);
        throw error;
    }
};

export const getMyRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/requests/my-requests`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching my requests", error);
        throw error;
    }
};

// Admin Dashboard API
export const getAdminStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard/admin/stats`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching admin stats", error);
        throw error;
    }
};

export const getAllClients = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/clients`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching all clients", error);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching projects", error);
        throw error;
    }
};

export const getAllProjects = async () => {
    try {
        const response = await axios.get(`${API_URL}/projects/all`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching all projects", error);
        throw error;
    }
};

export const getServiceRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/requests/all`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching service requests", error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await axios.post(`${API_URL}/projects/create`, projectData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error creating project", error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/projects/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching project", error);
        throw error;
    }
};

export const addTask = async (projectId, task) => {
    try {
        const response = await axios.post(`${API_URL}/projects/${projectId}/tasks`, task, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error adding task", error);
        throw error;
    }
};

export const updateTask = async (projectId, taskId, taskUpdate) => {
    try {
        const response = await axios.put(`${API_URL}/projects/${projectId}/tasks/${taskId}`, taskUpdate, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error updating task", error);
        throw error;
    }
};

export const updateRequestStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}/requests/${id}/status`, { status }, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error updating request status", error);
        throw error;
    }
};

export const getContacts = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages/contacts`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching contacts", error);
        throw error;
    }
};

export const getMessages = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/messages/conversation/${userId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error fetching messages", error);
        throw error;
    }
};

export const sendMessage = async (receiverId, content) => {
    try {
        const response = await axios.post(`${API_URL}/messages/send`, { receiverId, content }, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};
