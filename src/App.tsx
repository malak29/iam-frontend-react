import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { AuthState, UserInfo, LoginRequest } from '@/types';

interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.login(credentials.email, credentials.password);
          const { accessToken, refreshToken, userInfo } = response.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          set({
            user: userInfo,
            token: accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.error || 'Login failed';
          toast.error(message);
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toast.success('Logged out successfully');
      },

      refreshToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token available');

        try {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken, userInfo } = response.data.data;

          localStorage.setItem('accessToken', accessToken);

          set({
            token: accessToken,
            user: userInfo,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      checkAuth: () => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          set({
            token,
            user: JSON.parse(user),
            isAuthenticated: true,
          });
        }
      },

      clearError: () => set({ isLoading: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);