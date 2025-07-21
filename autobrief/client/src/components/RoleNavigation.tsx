import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const RoleNavigation = () => {
  const { userProfile } = useAuth();
  
  if (!userProfile) return null;
  
  // Return null instead of the navigation buttons
  return null;
};
};

export default RoleNavigation;