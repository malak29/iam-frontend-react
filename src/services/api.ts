import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// ===============================================================
// API Client Configuration
// ===============================================================
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken } = response.data;
              
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else if (error.message) {
          toast.error(error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(refreshToken: string) {
    return axios.post('/api/v1/auth/refresh', { refreshToken });
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // ===============================================================
  // Generic HTTP Methods
  // ===============================================================
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // ===============================================================
  // Authentication Methods
  // ===============================================================
  async login(email: string, password: string) {
    const response = await this.post('/auth/login', { email, password });
    return response.data;
  }

  async logout() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        await this.post('/auth/logout', { accessToken });
      } catch (error) {
        console.warn('Logout request failed:', error);
      }
    }
    this.clearTokens();
  }

  async validateToken(token: string) {
    return this.post('/auth/validate', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ===============================================================
  // User Service Methods
  // ===============================================================
  async getUsers() {
    const response = await this.get('/users');
    return response.data;
  }

  async getUserById(userId: string) {
    const response = await this.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: any) {
    const response = await this.post('/users', userData);
    return response.data;
  }

  async updateUser(userId: string, userData: any) {
    const response = await this.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: string) {
    const response = await this.delete(`/users/${userId}`);
    return response.data;
  }

  async getUsersByOrganization(orgId: number) {
    const response = await this.get(`/users/organization/${orgId}`);
    return response.data;
  }

  // ===============================================================
  // Authorization Service Methods
  // ===============================================================
  async getRoles() {
    const response = await this.get('/roles');
    return response.data;
  }

  async getRoleById(roleId: string) {
    const response = await this.get(`/roles/${roleId}`);
    return response.data;
  }

  async createRole(roleData: any) {
    const response = await this.post('/roles', roleData);
    return response.data;
  }

  async updateRole(roleId: string, roleData: any) {
    const response = await this.put(`/roles/${roleId}`, roleData);
    return response.data;
  }

  async deleteRole(roleId: string) {
    const response = await this.delete(`/roles/${roleId}`);
    return response.data;
  }

  async getPermissions() {
    const response = await this.get('/permissions');
    return response.data;
  }

  async createPermission(permissionData: any) {
    const response = await this.post('/permissions', permissionData);
    return response.data;
  }

  async assignRole(userId: string, roleId: string) {
    const response = await this.post('/authorization/assign-role', { userId, roleId });
    return response.data;
  }

  async revokeRole(userId: string, roleId: string) {
    const response = await this.delete(`/authorization/users/${userId}/roles/${roleId}`);
    return response.data;
  }

  async getUserRoles(userId: string) {
    const response = await this.get(`/authorization/users/${userId}/roles`);
    return response.data;
  }

  async getUserPermissions(userId: string) {
    const response = await this.get(`/authorization/users/${userId}/permissions`);
    return response.data;
  }

  async checkPermission(userId: string, resource: string, action: string) {
    const response = await this.post('/authorization/check-permission', { userId, resource, action });
    return response.data;
  }

  // ===============================================================
  // Health Check Methods
  // ===============================================================
  async getGatewayHealth() {
    const response = await this.get('/gateway/health');
    return response.data;
  }

  async getUserServiceHealth() {
    const response = await this.get('/users/health');
    return response.data;
  }

  async getAuthServiceHealth() {
    const response = await this.get('/auth/health');
    return response.data;
  }

  async getAuthorizationServiceHealth() {
    const response = await this.get('/authorization/health');
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();

// ===============================================================
// HTTP Status Helpers
// ===============================================================
export const isSuccessResponse = (response: AxiosResponse): boolean => {
  return response.status >= 200 && response.status < 300;
};

export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};