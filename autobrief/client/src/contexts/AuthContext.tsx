import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Custom warning toast function
const toastWarning = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: '#FEF3C7',
      color: '#92400E',
      border: '1px solid #F59E0B',
    },
  });
};

// Define user roles type
export type UserRole = 'employee' | 'project_manager' | 'ceo' | 'admin';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
  emailVerified: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  integrations: string[];
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, role?: UserRole) => Promise<void>;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    // Get role from localStorage or use the provided role or default to employee
    const storedRole = localStorage.getItem('user_role') as UserRole | null;
    const role = additionalData.role || storedRole || 'employee';
    
    // Create a local profile without Firestore dependency
    const localProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || user.email!.split('@')[0],
      photoURL: user.photoURL || undefined,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      emailVerified: user.emailVerified,
      plan: 'free',
      integrations: [],
      role: role, // Use the determined role
      ...additionalData
    };
    
    // Store the role in localStorage
    localStorage.setItem('user_role', role);
    
    setUserProfile(localProfile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await createUserProfile(user);
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(user);
        if (user) {
          setUserProfile({
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || user.email!.split('@')[0],
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            emailVerified: user.emailVerified,
            plan: 'free',
            integrations: [],
            role: 'employee' // Default role
          });
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string, role: UserRole = 'employee') => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Store the role in localStorage
    localStorage.setItem('user_role', role);
    
    // Create user profile
    await createUserProfile(user, { displayName, role });
    
    toast.success('Account created successfully! Please verify your email.');
  };

  const login = async (email: string, password: string, role: UserRole = 'employee') => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await createUserProfile(user, { role }); // Pass the role to createUserProfile
    
    // Store the role in localStorage
    localStorage.setItem('user_role', role);
    
    toast.success('Welcome back!');
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      toast.success('Welcome!');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') return;
      console.error('Google sign-in error:', error);
      toast.error(`Sign-in failed: ${error.message}`);
    }
  };



  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    
    // Clear the role from localStorage
    localStorage.removeItem('user_role');
    
    toast.success('Signed out successfully');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent!');
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    
    // Update local profile
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    
    // Update Firebase Auth profile if display name changes
    if (updates.displayName && updates.displayName !== currentUser.displayName) {
      await updateProfile(currentUser, { displayName: updates.displayName });
    }
  };

  // Helper function to check if user has a specific role or one of multiple roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    // Get the role from localStorage or from userProfile
    const storedRole = localStorage.getItem('user_role') as UserRole | null;
    const role = userProfile?.role || storedRole;
    
    if (!role) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(role);
    }
    
    return role === roles;
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};