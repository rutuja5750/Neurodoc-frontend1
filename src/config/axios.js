import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;