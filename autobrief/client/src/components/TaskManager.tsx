import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  Plus, 
  Trash2,
  Edit,
  X
} from "lucide-react";
import { format, isToday, isFuture, isPast, parseISO } from 'date-fns';

// Task type definition
interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  progress: number;
}

const TaskManager = () => {
  // Default tasks data
  const defaultTasks: Task[] = [
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Finish writing the technical documentation for the new feature',
      dueDate: '2023-07-15',
      priority: 'high',
      status: 'in-progress',
      progress: 60
    },
    {
      id: '2',
      title: 'Review pull requests',
      dueDate: '2023-07-10',
      priority: 'medium',
      status: 'todo',
      progress: 0
    },
    {
      id: '3',
      title: 'Update dependencies',
      dueDate: '2023-07-05',
      priority: 'low',
      status: 'completed',
      progress: 100
    },
    {
      id: '4',
      title: 'Prepare for team meeting',
      dueDate: '2023-07-08',
      priority: 'high',
      status: 'todo',
      progress: 20
    }
  ];
  
  // Load tasks from localStorage or use default tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('employee-tasks');
      return savedTasks ? JSON.parse(savedTasks) : defaultTasks;
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return defaultTasks;
    }
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('employee-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Add a new task
  const handleAddTask = () => {
    console.log('Adding task:', newTask);
    
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }
    
    if (!newTask.dueDate) {
      alert('Please select a due date');
      return;
    }
    
    try {
      // Validate the date format
      parseISO(newTask.dueDate);
      
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        status: 'todo',
        progress: 0
      };
      
      console.log('New task created:', task);
      
      // Update the tasks array with the new task
      const updatedTasks = [...tasks, task];
      console.log('Updated tasks array:', updatedTasks);
      
      setTasks(updatedTasks);
      setNewTask({ title: '', dueDate: '', priority: 'medium' });
      setIsAddingTask(false);
    } catch (error) {
      console.error('Invalid date format:', error);
      alert('Please enter a valid date');
    }
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle task status
  const handleToggleStatus = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
        return {
          ...task,
          status: newStatus,
          progress: newStatus === 'completed' ? 100 : 0
        };
      }
      return task;
    }));
  };

  // Update task progress
  const handleUpdateProgress = (id: string, progress: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'todo';
        return { ...task, progress, status: newStatus };
      }
      return task;
    }));
  };

  // Safe date parsing function
  const safeParseDate = (dateString: string) => {
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return new Date(); // Fallback to current date
    }
  };

  // Filter tasks by status
  const todayTasks = tasks.filter(task => {
    try {
      return isToday(safeParseDate(task.dueDate));
    } catch (e) {
      return false;
    }
  });
  
  const upcomingTasks = tasks.filter(task => {
    try {
      const date = safeParseDate(task.dueDate);
      return isFuture(date) && !isToday(date);
    } catch (e) {
      return false;
    }
  });
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const overdueTasks = tasks.filter(task => {
    try {
      const date = safeParseDate(task.dueDate);
      return isPast(date) && task.status !== 'completed' && !isToday(date);
    } catch (e) {
      return false;
    }
  });

  // Priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge>Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'todo':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  // Render task item
  const renderTaskItem = (task: Task) => (
    <div key={task.id} className="p-4 border rounded-lg mb-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleToggleStatus(task.id)}
            className="focus:outline-none"
          >
            {getStatusIcon(task.status)}
          </button>
          <span className={task.status === 'completed' ? 'line-through text-gray-500' : 'font-medium'}>
            {task.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityBadge(task.priority)}
          <button 
            onClick={() => handleDeleteTask(task.id)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="pl-7">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(safeParseDate(task.dueDate), 'MMM dd, yyyy')}</span>
          </div>
          <span>{task.progress}% complete</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={task.progress} className="flex-1 h-2" />
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={task.progress}
            onChange={(e) => handleUpdateProgress(task.id, parseInt(e.target.value))}
            className="w-20 h-2"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Personal Tasks</CardTitle>
        <Button 
          onClick={() => setIsAddingTask(!isAddingTask)} 
          size="sm" 
          className="h-8 gap-1"
        >
          {isAddingTask ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> New Task
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent>
        {isAddingTask && (
          <div className="mb-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-medium mb-2">Add New Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddTask();
            }} className="space-y-3">
              <div>
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <select
                    className="w-full h-10 px-3 rounded-md border"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
              >
                Add Task
              </Button>
            </form>
          </div>
        )}
        
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="today">Today ({todayTasks.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingTasks.length})</TabsTrigger>
            <TabsTrigger value="overdue">Overdue ({overdueTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {todayTasks.length > 0 ? (
              todayTasks.map(renderTaskItem)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No tasks due today</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(renderTaskItem)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No upcoming tasks</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="overdue" className="space-y-4">
            {overdueTasks.length > 0 ? (
              overdueTasks.map(renderTaskItem)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No overdue tasks</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map(renderTaskItem)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No completed tasks</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManager;