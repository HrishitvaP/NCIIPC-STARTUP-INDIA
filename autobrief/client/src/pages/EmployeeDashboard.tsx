import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  GitCommit,
  BarChart3,
  Activity,
  CheckCircle,
  Clock,
  ListTodo
} from "lucide-react";
import TaskManager from '@/components/TaskManager';
import BaseDashboard from '@/components/BaseDashboard';
import { useAuth } from "@/contexts/AuthContext";
import { useUserId } from "@/lib/userService";
import { useQuery } from "@tanstack/react-query";
import { ActivityFeed } from "@/components/ActivityFeed";

const EmployeeDashboard = () => {
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

  // Mock data for tasks
  const tasks = [
    { id: 1, title: "Complete project documentation", status: "in-progress", dueDate: "2023-06-30", priority: "high" },
    { id: 2, title: "Fix UI bugs in dashboard", status: "todo", dueDate: "2023-07-05", priority: "medium" },
    { id: 3, title: "Review pull requests", status: "todo", dueDate: "2023-07-02", priority: "high" },
    { id: 4, title: "Update dependencies", status: "completed", dueDate: "2023-06-28", priority: "low" },
  ];

  // Mock data for upcoming meetings
  const meetings = [
    { id: 1, title: "Daily Standup", time: "10:00 AM", duration: "15 min", participants: 5 },
    { id: 2, title: "Sprint Planning", time: "2:00 PM", duration: "1 hour", participants: 8 },
    { id: 3, title: "Code Review", time: "4:30 PM", duration: "45 min", participants: 3 },
  ];

  return (
    <BaseDashboard pageTitle="Employee Dashboard" role="employee">
      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:w-[400px] mb-4">
          <TabsTrigger value="overview" data-value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks" data-value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="activity" data-value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.meetings}</p>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Meetings</p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">This week</p>
                  </div>
                  <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.commits}</p>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Commits</p>
                    <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">This week</p>
                  </div>
                  <div className="p-3 bg-green-600 dark:bg-green-500 rounded-full">
                    <GitCommit className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.tasks}</p>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Tasks</p>
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Assigned</p>
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
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.totalActivities}</p>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Activities</p>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-1">All time</p>
                  </div>
                  <div className="p-3 bg-orange-600 dark:bg-orange-500 rounded-full">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tasks and Meetings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    Today's Tasks
                  </div>
                  <Button size="sm" variant="outline" onClick={() => document.querySelector('[data-value="tasks"]')?.click()}>View All</Button>
                </CardTitle>
                <CardDescription>Your assigned tasks for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {task.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{task.title}</p>
                          <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                        </div>
                      </div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'default' : 
                        'outline'
                      } className="capitalize">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                  {tasks.length > 3 && (
                    <div className="text-center">
                      <Button variant="link" onClick={() => document.querySelector('[data-value="tasks"]')?.click()}>
                        View {tasks.length - 3} more tasks
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Meetings
                </CardTitle>
                <CardDescription>Your scheduled meetings for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map(meeting => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{meeting.title}</p>
                          <p className="text-xs text-muted-foreground">{meeting.time} • {meeting.duration}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        {meeting.participants} attendees
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-6">
          <TaskManager />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Feed
              </CardTitle>
              <CardDescription>Your recent activities across all platforms</CardDescription>
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

export default EmployeeDashboard;