import api from './axios';

// Client Dashboard API
export const getClientStats = async () => {
    try {
        const response = await api.get('/projects/stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching client stats", error);
        throw error;
    }
};

export const getClientProjects = async () => {
    try {
        const response = await api.get('/projects/my-projects');
        return response.data;
    } catch (error) {
        console.error("Error fetching client projects", error);
        throw error;
    }
};

export const submitServiceRequest = async (requestData) => {
    try {
        const response = await api.post('/requests/submit', requestData);
        return response.data;
    } catch (error) {
        console.error("Error submitting service request", error);
        throw error;
    }
};

export const getMyRequests = async () => {
    try {
        const response = await api.get('/requests/my-requests');
        return response.data;
    } catch (error) {
        console.error("Error fetching my requests", error);
        throw error;
    }
};

// Admin Dashboard API
export const getAdminStats = async () => {
    try {
        const response = await api.get('/dashboard/admin/stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching admin stats", error);
        throw error;
    }
};

export const getAllClients = async () => {
    try {
        const response = await api.get('/users/clients');
        return response.data;
    } catch (error) {
        console.error("Error fetching all clients", error);
        throw error;
    }
};

export const getProjects = async () => {
    try {
        const response = await api.get('/projects');
        return response.data;
    } catch (error) {
        console.error("Error fetching projects", error);
        throw error;
    }
};

export const getAllProjects = async () => {
    try {
        const response = await api.get('/projects/all');
        return response.data;
    } catch (error) {
        console.error("Error fetching all projects", error);
        throw error;
    }
};

export const getServiceRequests = async () => {
    try {
        const response = await api.get('/requests/all');
        return response.data;
    } catch (error) {
        console.error("Error fetching service requests", error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await api.post('/projects/create', projectData);
        return response.data;
    } catch (error) {
        console.error("Error creating project", error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project", error);
        throw error;
    }
};

export const addTask = async (projectId, task) => {
    try {
        const response = await api.post(`/projects/${projectId}/tasks`, task);
        return response.data;
    } catch (error) {
        console.error("Error adding task", error);
        throw error;
    }
};

export const updateTask = async (projectId, taskId, taskUpdate) => {
    try {
        const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, taskUpdate);
        return response.data;
    } catch (error) {
        console.error("Error updating task", error);
        throw error;
    }
};

export const updateRequestStatus = async (id, status) => {
    try {
        const response = await api.put(`/requests/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating request status", error);
        throw error;
    }
};

export const getContacts = async () => {
    try {
        const response = await api.get('/messages/contacts');
        return response.data;
    } catch (error) {
        console.error("Error fetching contacts", error);
        throw error;
    }
};

export const getMessages = async (userId) => {
    try {
        const response = await api.get(`/messages/conversation/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages", error);
        throw error;
    }
};

export const sendMessage = async (receiverId, content, subject, priority) => {
    try {
        const response = await api.post('/messages/send', { receiverId, content, subject, priority });
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        throw error;
    }
};

export const generateTasks = async (description) => {
    try {
        const response = await api.post('/ai/generate-tasks', { description });
        return response.data;
    } catch (error) {
        console.error("Error generating tasks", error);
        throw error;
    }
};

export const callMcpTool = async (toolName, args) => {
    try {
        const response = await api.post('/mcp/call', { name: toolName, arguments: args });
        return response.data;
    } catch (error) {
        console.error("Error calling MCP tool", error);
        throw error;
    }
};
