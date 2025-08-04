import React, { useEffect, useState } from 'react';
import { Users, Shield, Key, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore, useUserStore } from '@/stores';
import { api } from '@/services/api';
import { formatDate, getStatusColor } from '@/utils';

interface ServiceHealth {
  service: string;
  status: string;
  url?: string;
}

interface SystemHealth {
  gateway: string;
  services: Record<string, string>;
  overall_status: string;
  healthy_services: number;
  total_services: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchSystemHealth();
  }, []);

  const fetchSystemHealth = async () => {
    try {
      setIsLoadingHealth(true);
      const response = await api.getGatewayHealth();
      setSystemHealth(response.data);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Sessions',
      value: '12', // This would come from your analytics
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'System Health',
      value: systemHealth?.overall_status || 'Unknown',
      icon: TrendingUp,
      color: systemHealth?.overall_status === 'HEALTHY' ? 'text-green-600' : 'text-yellow-600',
      bgColor: systemHealth?.overall_status === 'HEALTHY' ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      title: 'Services Running',
      value: systemHealth ? `${systemHealth.healthy_services}/${systemHealth.total_services}` : '0/0',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 opacity-90">
          Here's what's happening with your IAM system today.
        </p>
        <p className="text-sm opacity-75 mt-1">
          Last login: {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingHealth ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : systemHealth ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall Status</span>
                  <Badge className={getStatusColor(systemHealth.overall_status)}>
                    {systemHealth.overall_status}
                  </Badge>
                </div>
                
                {Object.entries(systemHealth.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{service.replace('-', ' ')}</span>
                    <Badge className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <AlertTriangle className="h-6 w-6 mr-2" />
                Unable to fetch system health
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.slice(0, 5).map((user) => (
                <div key={user.userId} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant="info" className="text-xs">
                    {user.userStatusId === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No users found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create User</h3>
              <p className="text-sm text-gray-500">Add a new user to the system</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Shield className="h-6 w-6 text-green-600 mb-2" />
              <h3 className="font-medium text-gray-900">Create Role</h3>
              <p className="text-sm text-gray-500">Define a new role with permissions</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Key className="h-6 w-6 text-purple-600 mb-2" />
              <h3 className="font-medium text-gray-900">Manage Permissions</h3>
              <p className="text-sm text-gray-500">Configure system permissions</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;