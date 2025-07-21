import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { redirectToDashboard } from '@/utils/redirectUtils';

const DashboardRedirect = () => {
  const [, setLocation] = useLocation();
  const { userProfile, loading } = useAuth();
  const [showStandardLink, setShowStandardLink] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Show standard dashboard link after a short delay
      setTimeout(() => setShowStandardLink(true), 1000);
      
      // Get the role from localStorage or from userProfile
      const storedRole = localStorage.getItem('user_role');
      const role = userProfile?.role || storedRole || 'employee';
      
      console.log('Redirecting with role:', role);
      
      // Use the utility function to force redirect
      redirectToDashboard(role);
    }
  }, [userProfile, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <p className="text-muted-foreground mb-4">Redirecting to your dashboard...</p>
        
        {showStandardLink && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-2">Or view the standard dashboard:</p>
            <Button 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                // Prevent the automatic redirect
                window.history.pushState({}, '', '/standard-dashboard');
                window.location.reload();
              }}
            >
              Go to Standard Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRedirect;