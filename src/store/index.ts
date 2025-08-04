import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';
import type { 
  AuthState, 
  UserState, 
  AuthorizationState, 
  User, 
  UserInfo, 
  Role, 
  Permission,
  LoginRequest,
  CreateUserRequest,
  CreateRoleRequest,
  CreatePermissionRequest
} from '@/types';

// ===============================================================
// Authentication Store
// ===============================================================
interface AuthStore extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
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
        localStorage.removeItem('user');

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

// ===============================================================
// User Management Store
// ===============================================================
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
      set({ users: response.data, isLoading: false });
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

// ===============================================================
// Authorization Store
// ===============================================================
interface AuthorizationStore extends AuthorizationState {
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  createRole: (roleData: CreateRoleRequest) => Promise<void>;
  createPermission: (permissionData: CreatePermissionRequest) => Promise<void>;
  assignRole: (userId: string, roleId: string) => Promise<void>;
  revokeRole: (userId: string, roleId: string) => Promise<void>;
  fetchUserRoles: (userId: string) => Promise<void>;
  fetchUserPermissions: (userId: string) => Promise<void>;
  checkPermission: (userId: string, resource: string, action: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthorizationStore = create<AuthorizationStore>()((set, get) => ({
  roles: [],
  permissions: [],
  userRoles: {},
  userPermissions: {},
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getRoles();
      set({ roles: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch roles';
      set({ error: message, isLoading: false });
    }
  },

  fetchPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getPermissions();
      set({ permissions: response.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch permissions';
      set({ error: message, isLoading: false });
    }
  },

  createRole: async (roleData: CreateRoleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createRole(roleData);
      const newRole = response.data;
      set(state => ({ 
        roles: [...state.roles, newRole], 
        isLoading: false 
      }));
      toast.success('Role created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create role';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  createPermission: async (permissionData: CreatePermissionRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.createPermission(permissionData);
      const newPermission = response.data;
      set(state => ({ 
        permissions: [...state.permissions, newPermission], 
        isLoading: false 
      }));
      toast.success('Permission created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create permission';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  assignRole: async (userId: string, roleId: string) => {
    try {
      await api.assignRole(userId, roleId);
      // Refresh user roles
      await get().fetchUserRoles(userId);
      toast.success('Role assigned successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to assign role';
      toast.error(message);
      throw error;
    }
  },

  revokeRole: async (userId: string, roleId: string) => {
    try {
      await api.revokeRole(userId, roleId);
      // Refresh user roles
      await get().fetchUserRoles(userId);
      toast.success('Role revoked successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to revoke role';
      toast.error(message);
      throw error;
    }
  },

  fetchUserRoles: async (userId: string) => {
    try {
      const response = await api.getUserRoles(userId);
      set(state => ({
        userRoles: { ...state.userRoles, [userId]: response.data }
      }));
    } catch (error: any) {
      console.error('Failed to fetch user roles:', error);
    }
  },

  fetchUserPermissions: async (userId: string) => {
    try {
      const response = await api.getUserPermissions(userId);
      set(state => ({
        userPermissions: { ...state.userPermissions, [userId]: response.data }
      }));
    } catch (error: any) {
      console.error('Failed to fetch user permissions:', error);
    }
  },

  checkPermission: async (userId: string, resource: string, action: string): Promise<boolean> => {
    try {
      const response = await api.checkPermission(userId, resource, action);
      return response.data.hasPermission;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));