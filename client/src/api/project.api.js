import api from './axios';

export const fetchProjects = () => api.get('/projects');
export const fetchProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const inviteMember = (id, data) => api.post(`/projects/${id}/invite`, data);
