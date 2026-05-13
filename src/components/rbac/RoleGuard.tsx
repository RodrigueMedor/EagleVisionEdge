import React from 'react';
import { Navigate } from 'react-router-dom';
import { userService } from '@/services/userService';
import { UserRole } from '@/types/rbac';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  const [isChecking, setIsChecking] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [currentRole, setCurrentRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      
      try {
        const session = await userService.getCurrentUser();
        
        if (!session?.isAuthenticated) {
          setHasAccess(false);
          return;
        }

        const userRole = session.user.role;
        setCurrentRole(userRole);
        const canAccess = allowedRoles.includes(userRole);
        setHasAccess(canAccess);
      } catch (error) {
        console.error('Role check failed:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [allowedRoles]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Checking role permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h.013M12 19v6m0 4h.01M12 5v6m0 4h.01" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Role Restricted</h2>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Your account doesn't have the required role to access this page.
              </p>
              
              <p className="text-sm">
                Required roles: <span className="font-semibold text-primary">
                  {allowedRoles.join(', ').replace('_', ' ').toUpperCase()}
                </span>
              </p>
              
              <p className="text-sm">
                Current role: <span className="font-semibold text-primary">
                  {currentRole ? currentRole.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
                </span>
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go Back
              </button>
              
              <button
                onClick={() => window.location.href = fallbackPath}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
