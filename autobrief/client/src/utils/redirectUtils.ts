import { UserRole } from '@/contexts/AuthContext';

// This function redirects to the appropriate dashboard based on role
export const redirectToDashboard = (role: UserRole | string | null) => {
  console.log('Redirecting based on role:', role);
  
  // Force redirect based on role
  if (role === 'project_manager') {
    window.location.href = '/manager-dashboard';
  } else if (role === 'ceo') {
    window.location.href = '/ceo-dashboard';
  } else {
    window.location.href = '/standard-dashboard';
  }
};