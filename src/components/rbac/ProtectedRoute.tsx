import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userService } from '@/services/userService';
import { Module, UserRole } from '@/types/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredModule?: Module;
  requiredPermission?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredModule,
  requiredPermission,
  fallbackPath = '/dashboard' 
}: ProtectedRouteProps) {
  const location = useLocation();
  const [isChecking, setIsChecking] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    const checkAccess = async () => {
      setIsChecking(true);
      
      try {
        const session = await userService.getCurrentUser();
        
        if (!session?.isAuthenticated) {
          setHasAccess(false);
          return;
        }

        // Check role-based access
        if (requiredRole && session.user.role !== requiredRole) {
          setHasAccess(false);
          return;
        }

        // Check module-based access
        if (requiredModule) {
          const canAccess = await userService.canAccessModule(requiredModule);
          setHasAccess(canAccess);
          return;
        }

        // Check specific permission
        if (requiredPermission && requiredModule) {
          const hasPermission = await userService.hasPermission(requiredModule, requiredPermission);
          setHasAccess(hasPermission);
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Access check failed:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [requiredRole, requiredModule, requiredPermission]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
