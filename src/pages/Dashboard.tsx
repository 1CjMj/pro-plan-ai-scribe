import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectContext';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Plus, 
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Progress } from '@/components/ui/progress';

const ManagerDashboard = () => {
  const { projects, loading } = useProjects();

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;
  let notStartedTasks = 0;
  let unassignedTasks = 0;
  let upcomingDeadlines = 0;
  let recentlyCompletedTasks = 0;

  // Today's date and date 48 hours from now for deadline calculations
  const today = new Date();
  const in48Hours = new Date(today);
  in48Hours.setHours(today.getHours() + 48);

  projects.forEach(project => {
    totalTasks += project.tasks.length;
    completedTasks += project.tasks.filter(t => t.status === 'completed').length;
    inProgressTasks += project.tasks.filter(t => t.status === 'in-progress').length;
    notStartedTasks += project.tasks.filter(t => t.status === 'not-started').length;
    
    // Count unassigned tasks
    unassignedTasks += project.tasks.filter(t => !t.assignedTo).length;
    
    // Count tasks with upcoming deadlines (within 48 hours)
    project.tasks.forEach(task => {
      if (task.endDate) {
        const endDate = new Date(task.endDate);
        if (endDate > today && endDate < in48Hours) {
          upcomingDeadlines++;
        }
      }
    });
    
    // Count recently completed tasks (completed within the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    project.tasks.forEach(task => {
      if (task.status === 'completed' && task.updatedAt) {
        const updatedDate = new Date(task.updatedAt);
        if (updatedDate >= sevenDaysAgo) {
          recentlyCompletedTasks++;
        }
      }
    });
  });
  
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all your projects and tasks
          </p>
        </div>
        <Link to="/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {activeProjects} active, {completedProjects} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Progress
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            <Progress value={taskCompletionRate} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Task Status
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Completed: {completedTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm">In Progress: {inProgressTasks}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-300" />
              <span className="text-sm">Not Started: {notStartedTasks}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Utilization
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              4 of 6 team members assigned to tasks
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-4 card-hover">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your most recently created projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6 border rounded-lg bg-muted/20">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="font-medium text-lg mb-1">No projects yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first project to get started
                </p>
                <Link to="/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </Link>
              </div>
            ) : (
              projects.slice(0, 5).map(project => (
                <Link to={`/projects/${project.id}`} key={project.id}>
                  <div className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium">{project.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {project.tasks.length} tasks · {project.tasks.filter(t => t.status === 'completed').length} completed
                      </span>
                    </div>
                    {project.status === 'in-progress' && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">In Progress</span>
                    )}
                    {project.status === 'completed' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                    )}
                    {project.status === 'planning' && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Planning</span>
                    )}
                    {project.status === 'on-hold' && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">On Hold</span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Link to="/projects" className="w-full">
              <Button variant="outline" className="w-full">View All Projects</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="col-span-7 md:col-span-3 card-hover">
          <CardHeader>
            <CardTitle>Tasks Requiring Attention</CardTitle>
            <CardDescription>
              Tasks that may need your review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-md border">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Unassigned Tasks</h4>
                <p className="text-sm text-muted-foreground">{unassignedTasks} tasks have not been assigned yet</p>
                <Link to="/tasks" className="text-sm text-primary hover:underline block mt-1">
                  Review tasks
                </Link>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md border">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Upcoming Deadlines</h4>
                <p className="text-sm text-muted-foreground">{upcomingDeadlines} tasks due in the next 48 hours</p>
                <Link to="/tasks" className="text-sm text-primary hover:underline block mt-1">
                  Review deadlines
                </Link>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md border">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Tasks Ready for Review</h4>
                <p className="text-sm text-muted-foreground">{recentlyCompletedTasks} tasks recently marked as completed</p>
                <Link to="/tasks" className="text-sm text-primary hover:underline block mt-1">
                  Review completed tasks
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const WorkerDashboard = () => {
  const { currentUser } = useAuth();
  const { getTasksByUserId } = useProjects();
  
  const tasks = currentUser ? getTasksByUserId(currentUser.id) : [];
  
  const notStartedTasks = tasks.filter(t => t.status === 'not-started');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your assigned tasks
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Tasks
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your start
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently working on
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              Tasks you've completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>
              Your current and upcoming work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-6">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <h3 className="font-medium text-lg">No tasks assigned yet</h3>
                <p className="text-muted-foreground text-sm">
                  You don't have any tasks assigned to you at the moment
                </p>
              </div>
            ) : (
              <>
                {inProgressTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">IN PROGRESS</h3>
                    <div className="space-y-2">
                      {inProgressTasks.map(task => (
                        <div key={task.id} className="p-3 rounded-md border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {notStartedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">TO DO</h3>
                    <div className="space-y-2">
                      {notStartedTasks.map(task => (
                        <div key={task.id} className="p-3 rounded-md border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <Button variant="outline" size="sm">
                              Start
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {completedTasks.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">COMPLETED</h3>
                    <div className="space-y-2">
                      {completedTasks.slice(0, 3).map(task => (
                        <div key={task.id} className="p-3 rounded-md border bg-muted/20">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/my-tasks" className="w-full">
              <Button variant="outline" className="w-full">View All Tasks</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { isManager, isWorker } = useAuth();
  
  return (
    <Layout requiresAuth>
      {isManager() && <ManagerDashboard />}
      {isWorker() && <WorkerDashboard />}
    </Layout>
  );
};

export default Dashboard;
