import { create } from 'zustand';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { User, CreateUserRequest, UserState } from '@/types';

interface UserStore extends UserState {
  fetchUsers: () => Promise<void>;
  fetchUserById: (userId: string) => Promise<void>;
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUser: (userId: string, userData: Partial<CreateUserRequest>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getUsers();
      set({ users: response.data || [], isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch users';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchUserById: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getUserById(userId);
      set({ currentUser: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch user';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createUser(userData);
      const newUser = response.data;
      set(state => ({ 
        users: [...state.users, newUser], 
        isLoading: false 
      }));
      toast.success('User created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create user';
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  updateUser: async (userId: string, userData: Partial<CreateUserRequest>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.updateUser(userId, userData);
      const updatedUser = response.data;
      set(state => ({
        users: state.users.map(user => 
          user.userId === userId ? updatedUser : user
        ),
        currentUser: state.currentUser?.userId === userId ? updatedUser : state.currentUser,
        isLoading: false
      }));
      toast.success('User updated successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update user';
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteUser(userId);
      set(state => ({
        users: state.users.filter(user => user.userId !== userId),
        currentUser: state.currentUser?.userId === userId ? null : state.currentUser,
        isLoading: false
      }));
      toast.success('User deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete user';
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));