import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { redirectToDashboard } from '@/utils/redirectUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = false,
  allowedRoles
}) => {
  const { currentUser, loading, userProfile, hasRole } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      setLocation('/auth/login');
    } else if (!loading && requireEmailVerification && currentUser && !currentUser.emailVerified) {
      setLocation('/auth/verify-email');
    } else if (!loading && currentUser && allowedRoles && userProfile && !hasRole(allowedRoles)) {
      // Get the role from localStorage or from userProfile
      const storedRole = localStorage.getItem('user_role');
      const role = userProfile?.role || storedRole || 'employee';
      
      // Use the utility function to force redirect
      redirectToDashboard(role);
    }
  }, [currentUser, loading, requireEmailVerification, allowedRoles, userProfile, hasRole, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  if (requireEmailVerification && !currentUser.emailVerified) {
    return null; // Will redirect via useEffect
  }
  
  // Check role-based access
  if (allowedRoles && userProfile && !hasRole(allowedRoles)) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;