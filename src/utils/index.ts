import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { USER_TYPES, USER_STATUSES, AUTH_TYPES } from '@/types';

// ===============================================================
// CSS Class Utilities
// ===============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===============================================================
// Date Formatting
// ===============================================================
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ===============================================================
// User Type Utilities
// ===============================================================
export const getUserTypeName = (typeId: number): string => {
  return USER_TYPES[typeId as keyof typeof USER_TYPES] || 'UNKNOWN';
};

export const getUserStatusName = (statusId: number): string => {
  return USER_STATUSES[statusId as keyof typeof USER_STATUSES] || 'UNKNOWN';
};

export const getAuthTypeName = (authTypeId: number): string => {
  return AUTH_TYPES[authTypeId as keyof typeof AUTH_TYPES] || 'UNKNOWN';
};

// ===============================================================
// Status Badge Colors
// ===============================================================
export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'UP':
    case 'HEALTHY':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
    case 'DOWN':
    case 'CRITICAL':
      return 'bg-red-100 text-red-800';
    case 'PENDING':
    case 'PARTIAL':
      return 'bg-yellow-100 text-yellow-800';
    case 'SUSPENDED':
    case 'LOCKED':
    case 'DEGRADED':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getUserTypeColor = (typeId: number): string => {
  switch (typeId) {
    case 10: // SUPER_ADMIN
      return 'bg-purple-100 text-purple-800';
    case 8: // ORG_ADMIN
      return 'bg-blue-100 text-blue-800';
    case 5: // DEPT_HEAD
      return 'bg-indigo-100 text-indigo-800';
    case 3: // MANAGER
      return 'bg-cyan-100 text-cyan-800';
    case 2: // DEPT_USER
    case 4:
      return 'bg-green-100 text-green-800';
    case 1: // GUEST_USER
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// ===============================================================
// Validation Utilities
// ===============================================================
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// ===============================================================
// Permission Utilities
// ===============================================================
export const formatPermissionName = (resource: string, action: string): string => {
  return `${resource}.${action}`;
};

export const parsePermissionName = (permissionName: string): { resource: string; action: string } => {
  const [resource, action] = permissionName.split('.');
  return { resource: resource || '', action: action || '' };
};

// ===============================================================
// Search & Filter Utilities
// ===============================================================
export const searchUsers = (users: any[], searchTerm: string): any[] => {
  if (!searchTerm) return users;
  
  const term = searchTerm.toLowerCase();
  return users.filter(user => 
    user.name?.toLowerCase().includes(term) ||
    user.email?.toLowerCase().includes(term) ||
    user.username?.toLowerCase().includes(term)
  );
};

export const searchRoles = (roles: any[], searchTerm: string): any[] => {
  if (!searchTerm) return roles;
  
  const term = searchTerm.toLowerCase();
  return roles.filter(role => 
    role.roleName?.toLowerCase().includes(term) ||
    role.description?.toLowerCase().includes(term)
  );
};

export const searchPermissions = (permissions: any[], searchTerm: string): any[] => {
  if (!searchTerm) return permissions;
  
  const term = searchTerm.toLowerCase();
  return permissions.filter(permission => 
    permission.permissionName?.toLowerCase().includes(term) ||
    permission.resource?.toLowerCase().includes(term) ||
    permission.action?.toLowerCase().includes(term) ||
    permission.description?.toLowerCase().includes(term)
  );
};

// ===============================================================
// Local Storage Utilities
// ===============================================================
export const getStoredToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getStoredUser = (): any | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// ===============================================================
// URL Utilities
// ===============================================================
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

// ===============================================================
// Error Handling Utilities
// ===============================================================
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

export const handleApiError = (error: any, defaultMessage: string = 'Operation failed'): string => {
  const message = extractErrorMessage(error);
  console.error('API Error:', message, error);
  return message || defaultMessage;
};

// ===============================================================
// Debounce Utility
// ===============================================================
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};