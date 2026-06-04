import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  CreateUserData, 
  UpdateUserData 
} from '@/types/rbac';
import { 
  Users, 
  Edit, 
  Trash2, 
  Search, 
  Eye, 
  EyeOff, 
  UserPlus 
} from 'lucide-react';
import { roleService } from '@/services/roleService';
import { userService } from '@/services/userService';

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  permissions?: Record<string, boolean>;
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'employee',
    department: '',
    permissions: {}
  });
  const [roleStats, setRoleStats] = useState<{ role: UserRole; count: number }[]>([]);
  const [deptStats, setDeptStats] = useState<{ department: string; count: number }[]>([]);

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userList = await roleService.getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const [roleData, deptData] = await Promise.all([
        roleService.getRoleStatistics(),
        roleService.getDepartmentStatistics()
      ]);
      setRoleStats(roleData);
      setDeptStats(deptData);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await roleService.searchUsers(query);
        setUsers(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      loadUsers();
    }
  };

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await userService.createUser(userData);
      setShowCreateModal(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'employee',
        department: '',
        permissions: {}
      });
      await loadUsers();
      await loadStatistics();
      alert('User created successfully!');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!selectedUser) return;
    
    try {
      await roleService.updateUser(selectedUser.id, userData);
      setShowEditModal(false);
      setSelectedUser(null);
      await loadUsers();
      await loadStatistics();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await roleService.deleteUser(userId);
      await loadUsers();
      await loadStatistics();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await roleService.toggleUserStatus(userId);
      await loadUsers();
      await loadStatistics();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      role: user.role,
      department: user.department || '',
      permissions: {}
    });
    setShowEditModal(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handlePermissionToggle = (module: string, permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [`${module}_${permission}`]: !prev.permissions?.[`${module}_${permission}`]
      }
    }));
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      administrator: 'bg-blue-100 text-blue-800',
      salesperson: 'bg-green-100 text-green-800',
      financing_staff: 'bg-orange-100 text-orange-800',
      rental_manager: 'bg-red-100 text-red-800',
      employee: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">User Management</span>
            </div>
            
            {/* Statistics */}
            <div className="space-y-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Role Distribution</h3>
                <div className="space-y-2">
                  {roleStats.map(stat => (
                    <div key={stat.role} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{stat.role.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-white font-semibold">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Department Distribution</h3>
                <div className="space-y-2">
                  {deptStats.map(stat => (
                    <div key={stat.department} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{stat.department}</span>
                      <span className="text-white font-semibold">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add User
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.department || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-primary hover:text-secondary transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`${
                                  user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                                } transition-colors`}
                              >
                                {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateUser({
                  email: formData.email,
                  password: 'defaultPassword123', // Default password for demo
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  role: formData.role,
                  department: formData.department,
                  permissions: formData.permissions
                }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="employee">Employee</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="financing_staff">Financing Staff</option>
                        <option value="rental_manager">Rental Manager</option>
                        <option value="administrator">Administrator</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., Sales, Finance, Operations"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-colors"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Edit User</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser({
                  id: selectedUser.id,
                  email: formData.email,
                  name: `${formData.firstName} ${formData.lastName}`,
                  role: formData.role,
                  department: formData.department,
                  permissions: formData.permissions
                }); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                        disabled
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="employee">Employee</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="financing_staff">Financing Staff</option>
                        <option value="rental_manager">Rental Manager</option>
                        <option value="administrator">Administrator</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="e.g., Sales, Finance, Operations"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-colors"
                    >
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
