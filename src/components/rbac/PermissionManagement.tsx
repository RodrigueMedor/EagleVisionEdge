import React, { useState, useEffect } from 'react';
import { UserRole, Module, Permission, ROLE_DISPLAY, MODULE_CONFIG } from '@/types/rbac';
import { permissionService } from '@/services/permissionService';
import { 
  Settings, 
  Save, 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Users, 
  ToggleLeft,
  Info,
  Edit
} from 'lucide-react';

interface PermissionToggleProps {
  role: UserRole;
  module: Module;
  permission: Permission;
  currentPermission: Permission;
  onToggle: (module: Module, permission: Permission, newPermission: Permission) => void;
}

export default function PermissionManagement() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [selectedModule, setSelectedModule] = useState<Module>('dashboard');
  const [permissionChanges, setPermissionChanges] = useState<Record<string, { module: Module; permission: Permission }>>({});

  useEffect(() => {
    // Load permission changes from localStorage
    const saved = localStorage.getItem('permission_changes');
    if (saved) {
      try {
        setPermissionChanges(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load permission changes:', e);
      }
    }
  }, []);

  const savePermissionChanges = () => {
    localStorage.setItem('permission_changes', JSON.stringify(permissionChanges));
  };

  const resetToDefaults = () => {
    setPermissionChanges({});
    localStorage.removeItem('permission_changes');
  };

  const applyPermissionChanges = async () => {
    // In a real implementation, this would call the backend
    console.log('Applying permission changes:', permissionChanges);
    savePermissionChanges();
    // Show success message
    alert('Permission changes saved successfully!');
  };

  const PermissionToggle: React.FC<PermissionToggleProps> = ({ 
    role, 
    module, 
    permission, 
    currentPermission, 
    onToggle 
  }) => {
    const isHigher = permissionService.hasHigherOrEqualRole(role, 'super_admin');
    const canModify = role === 'super_admin' || role === 'administrator';

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${ROLE_DISPLAY[role].color}-100 flex items-center justify-center`}>
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{role.replace('_', ' ').toUpperCase()}</p>
              <p className="text-xs text-gray-500">{module.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {permissionService.getPermissionDescription(currentPermission)}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>View Only</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>Read</span>
            </div>
            <div className="flex items-center gap-1">
              <Edit className="w-3 h-3" />
              <span>Update</span>
            </div>
            <div className="flex items-center gap-1">
              <Unlock className="w-3 h-3" />
              <span>Full Access</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onToggle(module, permission, permission)}
          disabled={!canModify}
          className={`
            relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
            ${currentPermission === permission 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
            ${!canModify ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          {currentPermission === permission ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          
          <span>{permissionService.getPermissionDescription(permission)}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Permission Management</h1>
          <p className="text-gray-600">Configure role-based access control for dealership operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Role Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Role</h2>
            
            <div className="space-y-2">
              {Object.entries(ROLE_DISPLAY).map(([role, display]) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role as UserRole)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${selectedRole === role 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-full ${display.color}-100 flex items-center justify-center`}>
                    {display.icon === 'crown' && <Shield className="w-4 h-4" />}
                    {display.icon === 'shield' && <Shield className="w-4 h-4" />}
                    {display.icon === 'user' && <Users className="w-4 h-4" />}
                    {display.icon === 'credit-card' && <Settings className="w-4 h-4" />}
                    {display.icon === 'car' && <Settings className="w-4 h-4" />}
                  </div>
                  
                  <div className="text-left">
                    <p className="font-medium">{display.label}</p>
                    <p className="text-sm text-gray-500">{display.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Module Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Module Permissions</h2>
            
            <div className="space-y-2">
              {Object.entries(MODULE_CONFIG).map(([module, config]) => {
                const moduleConfig = config as typeof MODULE_CONFIG[keyof typeof MODULE_CONFIG];
                return (
                <button
                  key={module}
                  onClick={() => setSelectedModule(module as Module)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${selectedModule === module 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {moduleConfig.icon === 'layout' && <Settings className="w-4 h-4 text-gray-600" />}
                                        {moduleConfig.icon === 'users' && <Users className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'target' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'credit-card' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'car' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'bar-chart' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'bell' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'file-text' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'users-cog' && <Settings className="w-4 h-4 text-gray-600" />}
                    {moduleConfig.icon === 'shield' && <Settings className="w-4 h-4 text-gray-600" />}
                  </div>
                  
                  <div className="text-left">
                    <p className="font-medium">{moduleConfig.name}</p>
                    <p className="text-sm text-gray-500">{moduleConfig.description}</p>
                  </div>
                </button>
                );
              })}
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Permission Matrix</h2>
            
            {selectedRole && selectedModule ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Configuring: <span className="font-bold">{ROLE_DISPLAY[selectedRole].label}</span>
                    </p>
                    <p className="text-xs text-blue-700">
                      Module: <span className="font-bold">{MODULE_CONFIG[selectedModule].name}</span>
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                        {(['view_only', 'read', 'update', 'delete', 'full_access'] as Permission[]).map(perm => (
                          <th key={perm} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {permissionService.getPermissionDescription(perm)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(['view_only', 'read', 'update', 'delete', 'full_access'] as Permission[]).map(permission => (
                        <tr key={permission} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {permissionService.getPermissionDescription(permission)}
                          </td>
                          
                          <PermissionToggle
                            role={selectedRole}
                            module={selectedModule}
                            permission={permission}
                            currentPermission={permissionService.getUserPermissions(selectedRole)[selectedModule] || 'view_only'}
                            onToggle={(module, perm, newPerm) => {
                              setPermissionChanges(prev => ({
                                ...prev,
                                [`${module}_${perm}`]: { module, permission: newPerm }
                              }));
                            }}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={resetToDefaults}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <ToggleLeft className="w-4 h-4" />
                    Reset to Defaults
                  </button>
                  
                  <button
                    onClick={applyPermissionChanges}
                    className="flex-1 bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Apply Changes
                  </button>
                </div>

                {Object.keys(permissionChanges).length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Unsaved Changes:</span> {Object.keys(permissionChanges).length} permission(s) modified
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a role and module to configure permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
