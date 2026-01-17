
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
