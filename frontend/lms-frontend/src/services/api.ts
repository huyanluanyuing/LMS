import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot
});

// session management 
export const getCurrentUserId = (): number | null => {
  const stored = localStorage.getItem('userId'); 
  return stored ? parseInt(stored) : null;
};

export const getCurrentUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

export const login = (id: number, role: string) => {
  localStorage.setItem('userId', id.toString());
  localStorage.setItem('userRole', role);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};

export default api;