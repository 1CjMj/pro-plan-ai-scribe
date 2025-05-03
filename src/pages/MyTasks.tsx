/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  XCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { TaskStatus } from '@/contexts/ProjectContext';

const TaskCard = ({ task, onStatusChange }: { 
  task: any; 
  onStatusChange: (taskId: string, projectId: string, status: TaskStatus) => void;
}) => {
  return (
    <Card className="hover:border-primary/20 transition-colors">
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="text-sm text-muted-foreground">
            Project: <Link to={`/projects/${task.projectId}`} className="text-primary hover:underline">{task.projectTitle}</Link>
          </span>
        </div>
        <h3 className="text-lg font-medium mb-1">{task.title}</h3>
        <p className="text-muted-foreground line-clamp-2 mb-3">{task.description}</p>
        
        <div className="mt-auto space-y-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {task.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-slate-50">
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {task.estimatedHours} hours
            </div>
            
            {task.status === 'not-started' && (
              <Button 
                size="sm" 
                onClick={() => onStatusChange(task.id, task.projectId, 'in-progress')}
              >
                Start Task
              </Button>
            )}
            
            {task.status === 'in-progress' && (
              <Button 
                size="sm" 
                onClick={() => onStatusChange(task.id, task.projectId, 'completed')}
              >
                Complete
              </Button>
            )}
            
            {task.status === 'completed' && (
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MyTasks = () => {
  const { getTasksByUserId, updateTaskStatus, projects } = useProjects();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const myTasks = currentUser ? getTasksByUserId(currentUser.id) : [];
  
  // Add project title to tasks
  const tasksWithProject = myTasks.map(task => {
    const project = projects.find(p => p.id === task.projectId);
    return {
      ...task,
      projectTitle: project ? project.title : 'Unknown Project'
    };
  });
  
  // Filter tasks by search term
  const filteredTasks = tasksWithProject.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group tasks by status
  const notStartedTasks = filteredTasks.filter(task => task.status === 'not-started');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const handleTaskStatusChange = async (taskId: string, projectId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, projectId, status);
  };
  
  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            View and manage your assigned tasks
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All Tasks ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="not-started">
              Not Started ({notStartedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-primary/30 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No tasks found</h3>
                  <p className="text-muted-foreground mb-0">
                    {searchTerm ? "Try a different search term" : "You don't have any tasks assigned yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="not-started" className="mt-6">
            {notStartedTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <XCircle className="h-12 w-12 text-primary/30 mb-4" />
                  <h3 className="text-xl font-medium mb-1">No tasks to start</h3>
                  <p className="text-muted-foreground">
                    You don't have any not-started tasks
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notStartedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="in-progress" className="mt-6">
            {inProgressTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <Clock className="h-12 w-12 text-primary/30 mb-4" />
                  <h3 className="text-xl font-medium mb-1">Nothing in progress</h3>
                  <p className="text-muted-foreground">
                    You don't have any tasks in progress
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inProgressTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-primary/30 mb-4" />
                  <h3 className="text-xl font-medium mb-1">Nothing completed yet</h3>
                  <p className="text-muted-foreground">
                    You don't have any completed tasks
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTasks;
