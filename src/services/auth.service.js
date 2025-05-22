import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthService {
  login(email, password) {
    return axios.post(`${API_URL}/auth/login`, { email, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  loginWithGoogle(credential) {
    return axios.post(`${API_URL}/auth/google`, { credential })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  loginWithMicrosoft(token) {
    return axios.post(`${API_URL}/auth/microsoft`, { token })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(firstName, lastName, email, password, role, organization) {
    return axios.post(`${API_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
      role,
      organization
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user?.token;
  }

  isSuperAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'SUPER_ADMIN';
  }

  refreshToken() {
    const user = this.getCurrentUser();
    if (!user?.refreshToken) {
      this.logout();
      return Promise.reject('No refresh token available');
    }

    return axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken: user.refreshToken
    })
      .then(response => {
        if (response.data.token) {
          const updatedUser = { ...user, token: response.data.token };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return response.data;
        }
        return response.data;
      })
      .catch(error => {
        this.logout();
        return Promise.reject(error);
      });
  }

  setupAxiosInterceptors() {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            const user = this.getCurrentUser();
            originalRequest.headers['Authorization'] = 'Bearer ' + user.token;
            return axios(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    axios.interceptors.request.use(
      (config) => {
        const user = this.getCurrentUser();
        if (user?.token) {
          config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService(); 