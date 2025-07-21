import React from 'react';
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";

interface BaseDashboardProps {
  children: React.ReactNode;
  pageTitle: string;
  role: UserRole;
}

const BaseDashboard: React.FC<BaseDashboardProps> = ({ 
  children, 
  pageTitle,
  role
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { userProfile } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardHeader onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
      
      <motion.main 
        className="container mx-auto px-6 py-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Header */}
        <motion.div className="mb-8" variants={heroVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
              <p className="text-muted-foreground">
                {userProfile?.displayName} • <span className="capitalize">{role.replace('_', ' ')}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        {children}
      </motion.main>
    </div>
  );
};

export default BaseDashboard;