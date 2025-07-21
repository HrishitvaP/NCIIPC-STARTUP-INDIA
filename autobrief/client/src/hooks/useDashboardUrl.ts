import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

import { redirectToDashboard } from '@/utils/redirectUtils';

export const useDashboardUrl = () => {
  const { userProfile } = useAuth();
  
  const getDashboardUrl = (): string => {
    // Get the role from localStorage or from userProfile
    const storedRole = localStorage.getItem('user_role');
    const role = userProfile?.role || storedRole || 'employee';
    
    // Log the role for debugging
    console.log('useDashboardUrl role:', role);
    
    switch (role) {
      case 'employee':
        return '/standard-dashboard';
      case 'project_manager':
        return '/manager-dashboard';
      case 'ceo':
        return '/ceo-dashboard';
      default:
        return '/standard-dashboard';
    }
  };
  
  return getDashboardUrl();
};