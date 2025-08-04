// ===============================================================
// API Response Types
// ===============================================================
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    errors?: string[];
    timestamp?: string;
  }
  
  // ===============================================================
  // User Types
  // ===============================================================
  export interface User {
    userId: string;
    email: string;
    username: string;
    name: string;
    orgId: number;
    departmentId: number;
    authTypeId: number;
    userTypeId: number;
    userStatusId: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateUserRequest {
    email: string;
    username: string;
    name: string;
    password: string;
    orgId: number;
    departmentId: number;
    userTypeId: number;
    userStatusId: number;
    authTypeId: number;
  }
  
  export interface UpdateUserRequest {
    email?: string;
    username?: string;
    name?: string;
    password?: string;
    orgId?: number;
    departmentId?: number;
    userTypeId?: number;
    userStatusId?: number;
    authTypeId?: number;
  }
  
  // ===============================================================
  // Authentication Types
  // ===============================================================
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    userInfo: UserInfo;
    loginAt: string;
  }
  
  export interface UserInfo {
    userId: string;
    email: string;
    username: string;
    name: string;
    orgId: number;
    departmentId: number;
    userType: string;
    userStatus: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  // ===============================================================
  // Authorization Types
  // ===============================================================
  export interface Role {
    roleId: string;
    roleName: string;
    description: string;
    orgId: number;
    departmentId?: number;
    isActive: boolean;
    isSystemRole: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    permissions?: Permission[];
    userCount?: number;
  }
  
  export interface Permission {
    permissionId: string;
    permissionName: string;
    resource: string;
    action: string;
    description: string;
    isActive: boolean;
    isSystemPermission: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
  }
  
  export interface CreateRoleRequest {
    roleName: string;
    description?: string;
    orgId: number;
    departmentId?: number;
    isSystemRole?: boolean;
    permissionIds?: string[];
  }
  
  export interface CreatePermissionRequest {
    permissionName: string;
    resource: string;
    action: string;
    description?: string;
    isSystemPermission?: boolean;
  }
  
  export interface AssignRoleRequest {
    userId: string;
    roleId: string;
    expiresAt?: string;
  }
  
  export interface CheckPermissionRequest {
    userId: string;
    resource: string;
    action: string;
  }
  
  export interface PermissionCheckResponse {
    userId: string;
    resource: string;
    action: string;
    hasPermission: boolean;
    grantingRoles?: string[];
    reason?: string;
  }
  
  // ===============================================================
  // UI State Types
  // ===============================================================
  export interface AuthState {
    user: UserInfo | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }
  
  export interface UserState {
    users: User[];
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface AuthorizationState {
    roles: Role[];
    permissions: Permission[];
    userRoles: { [userId: string]: Role[] };
    userPermissions: { [userId: string]: Permission[] };
    isLoading: boolean;
    error: string | null;
  }
  
  // ===============================================================
  // Form Types
  // ===============================================================
  export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface CreateUserFormData {
    email: string;
    username: string;
    name: string;
    password: string;
    confirmPassword: string;
    orgId: number;
    departmentId: number;
    userTypeId: number;
    userStatusId: number;
    authTypeId: number;
  }
  
  export interface CreateRoleFormData {
    roleName: string;
    description: string;
    orgId: number;
    departmentId?: number;
    permissionIds: string[];
  }
  
  // ===============================================================
  // Utility Types
  // ===============================================================
  export interface TableColumn<T> {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
  }
  
  export interface ActionMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
  }
  
  // ===============================================================
  // Constants
  // ===============================================================
  export const USER_TYPES = {
    1: 'GUEST_USER',
    2: 'DEPT_USER', 
    3: 'MANAGER',
    4: 'DEPT_USER',
    5: 'DEPT_HEAD',
    8: 'ORG_ADMIN',
    10: 'SUPER_ADMIN'
  } as const;
  
  export const USER_STATUSES = {
    1: 'ACTIVE',
    2: 'INACTIVE', 
    3: 'PENDING',
    4: 'SUSPENDED',
    5: 'LOCKED'
  } as const;
  
  export const AUTH_TYPES = {
    1: 'PASSWORD',
    2: 'OAUTH',
    3: 'LDAP',
    4: 'SSO'
  } as const;