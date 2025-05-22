import axios from "../config/axios";
import { config } from "../config/config";

const BASE_URL = `${config.API_URL}/api/users`;

export const userService = {
    async register(userData) {
      try {
        console.log('Making registration request to:', `${BASE_URL}/register`);
        
        const { data } = await axios.post(`${BASE_URL}/register`, userData);
        console.log('Registration response:', data);
  
        if (!data.success || !data.data || !data.data.token) {
          throw new Error('Invalid response format from server');
        }
  
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.data;
      } catch (error) {
        console.error('Registration service error:', error);
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },
  
    async login(credentials) {
      try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        const data = response.data;
        
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Login service error:', error);
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },
  
    async logout() {
      try {
        await axios.post(`${BASE_URL}/logout`);
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Logout service error:', error);
        throw new Error(error.response?.data?.message || 'Logout failed');
      }
    },
  
    async getAllUsers() {
      try {
        const { data } = await axios.get('/get-all-users');
        return data.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
      }
    },
  
    getCurrentUser() {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    },
};

export { userService as authService }; 