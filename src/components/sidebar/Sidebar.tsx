import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  User, 
  Activity,
  Settings
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuthStore } from '@/stores';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Roles', href: '/roles', icon: Shield },
  { name: 'Permissions', href: '/permissions', icon: Key },
  { name: 'System Health', href: '/system-health', icon: Activity },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <Shield className="w-8 h-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">IAM System</span>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.userType}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Profile Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;