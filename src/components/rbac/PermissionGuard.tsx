import React from 'react';
import { Module, UserRole, Permission } from '@/types/rbac';
import { userService } from '@/services/userService';

interface PermissionGuardProps {
  children: React.ReactNode;
  module: Module;
  permission?: Permission;
  fallback?: React.ReactNode;
  role?: UserRole;
}

export default function PermissionGuard({ 
  children, 
  module, 
  permission, 
  fallback = null,
  role 
}: PermissionGuardProps) {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkPermission = async () => {
      setIsLoading(true);
      
      try {
        const session = await userService.getCurrentUser();
        
        if (!session?.isAuthenticated) {
          setHasPermission(false);
          return;
        }

        // Check if specific role is required
        if (role && session.user.role !== role) {
          setHasPermission(false);
          return;
        }

        // Check module access
        if (module) {
          const canAccess = await userService.canAccessModule(module);
          setHasPermission(canAccess);
          return;
        }

        // Check specific permission
        if (permission) {
          const hasSpecificPermission = await userService.hasPermission(module, permission);
          setHasPermission(hasSpecificPermission);
          return;
        }

        setHasPermission(true);
      } catch (error) {
        console.error('Permission check failed:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [module, permission, role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-t-transparent"></div>
        <p className="ml-3 text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <>
        {fallback}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h.013M12 19v6m0 4h.01M12 5v6m0 4h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Access Restricted</h3>
                <p className="text-gray-600 text-sm">You don't have permission to access this feature.</p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
