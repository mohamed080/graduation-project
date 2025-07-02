import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

/* ───── Request interceptor: attach auth token ───── */
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ───── Response interceptor: handle errors globally ───── */
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Example: redirect to login on 401
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.replace('/login');
        }

        // Log or toast the error here if you have a toast system
        console.error(
            `[Axios] ${error.response?.status || ''} ${error.config?.url}`,
            error.response?.data || error.message
        );

        return Promise.reject(error);
    }
);

export default axiosInstance;
