import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  BarChart3,
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import BaseDashboard from '@/components/BaseDashboard';
import { useAuth } from "@/contexts/AuthContext";
import { useUserId } from "@/lib/userService";
import { useQuery } from "@tanstack/react-query";
import { ActivityFeed } from "@/components/ActivityFeed";

const CEODashboard = () => {
  const { currentUser } = useAuth();
  const userId = useUserId(currentUser?.uid);

  // Fetch user's activities for stats
  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'}/activities?userId=${userId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!userId,
  });

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Mock data for company metrics
  const companyMetrics = {
    revenue: {
      current: 1250000,
      previous: 980000,
      growth: 27.55
    },
    projects: {
      total: 12,
      onTrack: 8,
      atRisk: 3,
      delayed: 1
    },
    employees: {
      total: 48,
      active: 45,
      onLeave: 3,
      utilization: 87
    },
    clients: {
      total: 24,
      active: 18,
      new: 3
    }
  };

  // Mock data for department performance
  const departments = [
    { 
      id: 1, 
      name: "Engineering", 
      headCount: 22, 
      projectsCount: 6,
      utilization: 92,
      performance: 88,
      budget: { allocated: 450000, spent: 380000 }
    },
    { 
      id: 2, 
      name: "Design", 
      headCount: 8, 
      projectsCount: 9,
      utilization: 85,
      performance: 90,
      budget: { allocated: 180000, spent: 140000 }
    },
    { 
      id: 3, 
      name: "Marketing", 
      headCount: 6, 
      projectsCount: 4,
      utilization: 78,
      performance: 82,
      budget: { allocated: 220000, spent: 190000 }
    },
    { 
      id: 4, 
      name: "Sales", 
      headCount: 7, 
      projectsCount: 2,
      utilization: 95,
      performance: 86,
      budget: { allocated: 280000, spent: 210000 }
    },
    { 
      id: 5, 
      name: "Operations", 
      headCount: 5, 
      projectsCount: 3,
      utilization: 88,
      performance: 84,
      budget: { allocated: 150000, spent: 120000 }
    }
  ];

  // Mock data for key projects
  const keyProjects = [
    { 
      id: 1, 
      name: "Enterprise Platform Redesign", 
      progress: 75, 
      status: "on-track", 
      manager: "Sarah Williams",
      budget: { allocated: 350000, spent: 260000 },
      dueDate: "2023-09-30",
      team: 12
    },
    { 
      id: 2, 
      name: "Mobile Banking App", 
      progress: 45, 
      status: "at-risk", 
      manager: "Michael Brown",
      budget: { allocated: 280000, spent: 180000 },
      dueDate: "2023-10-15",
      team: 8
    },
    { 
      id: 3, 
      name: "Data Analytics Platform", 
      progress: 90, 
      status: "on-track", 
      manager: "Alex Johnson",
      budget: { allocated: 420000, spent: 380000 },
      dueDate: "2023-08-20",
      team: 10
    },
    { 
      id: 4, 
      name: "Cloud Migration", 
      progress: 30, 
      status: "delayed", 
      manager: "Emily Davis",
      budget: { allocated: 500000, spent: 200000 },
      dueDate: "2023-12-01",
      team: 15
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <BaseDashboard pageTitle="Executive Dashboard" role="ceo">
      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[500px] mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Company Metrics */}
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(companyMetrics.revenue.current)}
                    </p>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Revenue</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {companyMetrics.revenue.growth.toFixed(1)}%
                      </span>
                      <span className="text-emerald-600/70 dark:text-emerald-400/70">vs last quarter</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-600 dark:bg-emerald-500 rounded-full">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{companyMetrics.projects.total}</p>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Projects</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span className="text-blue-600 dark:text-blue-400">
                        {companyMetrics.projects.onTrack}
                      </span>
                      <span className="text-blue-600/70 dark:text-blue-400/70">on track</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{companyMetrics.employees.total}</p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Employees</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <Target className="h-3 w-3 text-purple-600" />
                      <span className="text-purple-600 dark:text-purple-400">
                        {companyMetrics.employees.utilization}%
                      </span>
                      <span className="text-purple-600/70 dark:text-purple-400/70">utilization</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{companyMetrics.clients.total}</p>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Clients</p>
                    <div className="flex items-center gap-1 text-xs mt-1">
                      <TrendingUp className="h-3 w-3 text-orange-600" />
                      <span className="text-orange-600 dark:text-orange-400">
                        {companyMetrics.clients.new}
                      </span>
                      <span className="text-orange-600/70 dark:text-orange-400/70">new this quarter</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-600 dark:bg-orange-500 rounded-full">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Projects Status
                </div>
                <Button size="sm" variant="outline">View All Projects</Button>
              </CardTitle>
              <CardDescription>Performance of high-priority projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {keyProjects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{project.team} members</span>
                          <span>•</span>
                          <span>Manager: {project.manager}</span>
                        </div>
                      </div>
                      <Badge variant={
                        project.status === 'on-track' ? 'outline' : 
                        project.status === 'at-risk' ? 'default' : 
                        'destructive'
                      } className="capitalize">
                        {project.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due {project.dueDate}</span>
                      </div>
                      <div>
                        Budget: {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.allocated)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Overview
              </CardTitle>
              <CardDescription>Performance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {departments.slice(0, 3).map(dept => (
                  <div key={dept.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{dept.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{dept.headCount} employees</span>
                          <span>•</span>
                          <Briefcase className="h-3 w-3" />
                          <span>{dept.projectsCount} projects</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{dept.performance}%</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Utilization</span>
                        <span>{dept.utilization}%</span>
                      </div>
                      <Progress value={dept.utilization} className="h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Budget: {formatCurrency(dept.budget.spent)} / {formatCurrency(dept.budget.allocated)} ({Math.round((dept.budget.spent / dept.budget.allocated) * 100)}%)
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Departments</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Department Performance</h2>
              <p className="text-muted-foreground">Detailed metrics for all departments</p>
            </div>
            <Button>Generate Report</Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {departments.map(dept => (
              <Card key={dept.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{dept.name} Department</span>
                    <Badge variant="outline">{dept.headCount} employees</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    <span>{dept.projectsCount} active projects</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Performance</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{dept.performance}%</div>
                        <Badge variant={dept.performance >= 85 ? "success" : "default"} className="h-fit">
                          {dept.performance >= 85 ? "Excellent" : "Good"}
                        </Badge>
                      </div>
                      <Progress value={dept.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Utilization</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{dept.utilization}%</div>
                        <Badge variant={dept.utilization >= 85 ? "success" : "default"} className="h-fit">
                          {dept.utilization >= 85 ? "Optimal" : "Average"}
                        </Badge>
                      </div>
                      <Progress value={dept.utilization} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Budget Utilization</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{Math.round((dept.budget.spent / dept.budget.allocated) * 100)}%</div>
                        <Badge variant="outline" className="h-fit">
                          {formatCurrency(dept.budget.spent)} / {formatCurrency(dept.budget.allocated)}
                        </Badge>
                      </div>
                      <Progress value={(dept.budget.spent / dept.budget.allocated) * 100} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">View Team</Button>
                    <Button size="sm">Department Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Project Portfolio</h2>
              <p className="text-muted-foreground">Comprehensive view of all company projects</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Filter</Button>
              <Button>+ New Project</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {keyProjects.map(project => (
              <Card key={project.id} className={`border-l-4 ${
                project.status === 'on-track' ? 'border-l-green-500' : 
                project.status === 'at-risk' ? 'border-l-yellow-500' : 
                'border-l-red-500'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{project.name}</span>
                    <Badge variant={
                      project.status === 'on-track' ? 'outline' : 
                      project.status === 'at-risk' ? 'default' : 
                      'destructive'
                    } className="capitalize">
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>Manager: {project.manager}</span>
                    <span>•</span>
                    <span>{project.team} team members</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{project.progress}%</div>
                        <Badge variant={
                          project.progress >= 75 ? "success" : 
                          project.progress >= 40 ? "default" : 
                          "destructive"
                        } className="h-fit">
                          {project.progress >= 75 ? "On Schedule" : 
                           project.progress >= 40 ? "In Progress" : 
                           "Behind Schedule"}
                        </Badge>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Budget</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">{Math.round((project.budget.spent / project.budget.allocated) * 100)}%</div>
                        <Badge variant="outline" className="h-fit">
                          {formatCurrency(project.budget.spent)} / {formatCurrency(project.budget.allocated)}
                        </Badge>
                      </div>
                      <Progress value={(project.budget.spent / project.budget.allocated) * 100} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Timeline</div>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold">
                          <Clock className="h-5 w-5 inline-block mr-1" />
                        </div>
                        <Badge variant="outline" className="h-fit">
                          Due {project.dueDate}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 60) + 30} days remaining
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">View Team</Button>
                    <Button size="sm">Project Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Executive Reports</h2>
              <p className="text-muted-foreground">Key business metrics and analytics</p>
            </div>
            <Button>Generate New Report</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
                <CardDescription>Quarterly financial performance</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="mt-2 text-muted-foreground">Financial charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resource Utilization
                </CardTitle>
                <CardDescription>Team and resource allocation</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
                <div className="text-center">
                  <Activity className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="mt-2 text-muted-foreground">Utilization charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Metrics
                </CardTitle>
                <CardDescription>Business growth indicators</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="mt-2 text-muted-foreground">Growth charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Project and business risks</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <p className="mt-2 text-muted-foreground">Risk assessment data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </BaseDashboard>
  );
};

export default CEODashboard;