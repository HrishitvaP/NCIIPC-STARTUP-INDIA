import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  GitCommit,
  BarChart3,
  Activity,
  Users,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import BaseDashboard from '@/components/BaseDashboard';
import { useAuth } from "@/contexts/AuthContext";
import { useUserId } from "@/lib/userService";
import { useQuery } from "@tanstack/react-query";
import { ActivityFeed } from "@/components/ActivityFeed";

const ManagerDashboard = () => {
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

  // Calculate stats from activities
  const stats = {
    totalActivities: activities.length,
    commits: activities.filter((a: any) => a.activityType === 'commit').length,
    meetings: activities.filter((a: any) => a.activityType === 'calendar_event').length,
    tasks: activities.filter((a: any) => a.activityType === 'task').length || 0,
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Mock data for projects
  const projects = [
    { 
      id: 1, 
      name: "Website Redesign", 
      progress: 75, 
      status: "on-track", 
      teamSize: 5,
      dueDate: "2023-07-15",
      tasks: { total: 24, completed: 18 }
    },
    { 
      id: 2, 
      name: "Mobile App Development", 
      progress: 45, 
      status: "at-risk", 
      teamSize: 8,
      dueDate: "2023-08-30",
      tasks: { total: 56, completed: 25 }
    },
    { 
      id: 3, 
      name: "API Integration", 
      progress: 90, 
      status: "on-track", 
      teamSize: 3,
      dueDate: "2023-07-05",
      tasks: { total: 18, completed: 16 }
    },
    { 
      id: 4, 
      name: "Database Migration", 
      progress: 30, 
      status: "delayed", 
      teamSize: 4,
      dueDate: "2023-09-10",
      tasks: { total: 32, completed: 10 }
    },
  ];

  // Mock data for team members
  const teamMembers = [
    { id: 1, name: "Alex Johnson", role: "Frontend Developer", tasks: 8, completed: 5, avatar: "AJ" },
    { id: 2, name: "Sarah Williams", role: "Backend Developer", tasks: 12, completed: 9, avatar: "SW" },
    { id: 3, name: "Michael Brown", role: "UI/UX Designer", tasks: 6, completed: 4, avatar: "MB" },
    { id: 4, name: "Emily Davis", role: "QA Engineer", tasks: 15, completed: 12, avatar: "ED" },
    { id: 5, name: "David Wilson", role: "DevOps Engineer", tasks: 7, completed: 3, avatar: "DW" },
  ];

  return (
    <BaseDashboard pageTitle="Project Manager Dashboard" role="project_manager">
      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[500px] mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projects.length}</p>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Projects</p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">In progress</p>
                  </div>
                  <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
                    <ListTodo className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{teamMembers.length}</p>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Team Members</p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Active</p>
                  </div>
                  <div className="p-3 bg-green-600 dark:bg-green-500 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {projects.reduce((acc, project) => acc + project.tasks.total, 0)}
                    </p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Tasks</p>
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Across all projects</p>
                  </div>
                  <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-full">
                    <ListTodo className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.meetings}</p>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Meetings</p>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">This week</p>
                  </div>
                  <div className="p-3 bg-orange-600 dark:bg-orange-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Project Overview
                </div>
                <Button size="sm">+ New Project</Button>
              </CardTitle>
              <CardDescription>Status of your active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{project.teamSize} members</span>
                          <span>•</span>
                          <span>Due {project.dueDate}</span>
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
                    <div className="text-xs text-muted-foreground">
                      {project.tasks.completed} of {project.tasks.total} tasks completed
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Performance
              </CardTitle>
              <CardDescription>Task completion rate by team member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-medium">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{member.name}</p>
                        <span className="text-sm">{Math.round((member.completed / member.tasks) * 100)}%</span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(member.completed / member.tasks) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{member.role}</span>
                          <span>{member.completed}/{member.tasks} tasks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Projects</h2>
              <p className="text-muted-foreground">Manage and track all your team's projects</p>
            </div>
            <Button>+ New Project</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
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
                    <span>{project.teamSize} team members</span>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>Due {project.dueDate}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <ListTodo className="h-4 w-4" />
                      </div>
                      <span>{project.tasks.completed}/{project.tasks.total} tasks completed</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Team Management</h2>
              <p className="text-muted-foreground">Manage your team members and their assignments</p>
            </div>
            <Button>+ Add Member</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Performance and task allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-medium text-lg">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Task Completion</span>
                          <span>{Math.round((member.completed / member.tasks) * 100)}%</span>
                        </div>
                        <Progress value={(member.completed / member.tasks) * 100} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{member.completed} of {member.tasks} tasks completed</span>
                          <span>{member.tasks - member.completed} remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Feed
              </CardTitle>
              <CardDescription>Recent activities across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              {userId && <ActivityFeed userId={userId} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </BaseDashboard>
  );
};

export default ManagerDashboard;