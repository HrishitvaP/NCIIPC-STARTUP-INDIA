import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { userProfile } = useAuth();
  
  // Determine where to redirect the user based on their role
  const getDashboardLink = () => {
    if (!userProfile) return '/auth/login';
    
    switch (userProfile.role) {
      case 'employee':
        return '/employee-dashboard';
      case 'project_manager':
        return '/manager-dashboard';
      case 'ceo':
        return '/ceo-dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            This area requires different permissions than what your account currently has.
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link to={getDashboardLink()}>
              <Home className="mr-2 h-4 w-4" />
              Go to Your Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;