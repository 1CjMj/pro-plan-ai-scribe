
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronLeft,
  Clock,
  Calendar,
  ListTodo,
  Edit,
  MoreHorizontal,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  UserCheck,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { TaskStatus } from '@/contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';

const TaskDialog = ({
  open,
  onOpenChange,
  projectId,
  onAddTask,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddTask: (task: any) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const { resources } = useProjects();
  const [selectedResources, setSelectedResources] = useState<{resourceId: string, amount: number}[]>([]);

  const handleAddResource = (resourceId: string) => {
    if (!selectedResources.find(r => r.resourceId === resourceId)) {
      setSelectedResources([...selectedResources, { resourceId, amount: 1 }]);
    }
  };

  const handleRemoveResource = (resourceId: string) => {
    setSelectedResources(selectedResources.filter(r => r.resourceId !== resourceId));
  };

  const handleResourceAmountChange = (resourceId: string, amount: number) => {
    setSelectedResources(
      selectedResources.map(r => 
        r.resourceId === resourceId ? { ...r, amount } : r
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsList = skills.split(',').map(skill => skill.trim()).filter(Boolean);
    
    const newTask = {
      title,
      description,
      status: 'not-started' as TaskStatus,
      skills: skillsList,
      estimatedHours: parseFloat(estimatedHours) || 0,
      resources: selectedResources,
      createdBy: 'manual' as const,
    };
    
    onAddTask(newTask);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setSkills('');
    setEstimatedHours('');
    setSelectedResources([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Task Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this task involves"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, React, Content Writing (comma separated)"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours</Label>
              <Input
                id="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Resources</Label>
              <Select onValueChange={handleAddResource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resource" />
                </SelectTrigger>
                <SelectContent>
                  {resources.map(resource => (
                    <SelectItem key={resource.id} value={resource.id}>
                      {resource.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedResources.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Selected Resources:</p>
                  <div className="space-y-2">
                    {selectedResources.map(selectedResource => {
                      const resource = resources.find(r => r.selectedResource?.resourceId === r.id);
                      return (
                        <div key={selectedResource.resourceId} className="flex items-center space-x-2 border p-2 rounded-md">
                          <span className="text-sm flex-1">
                            {resources.find(r => r.id === selectedResource.resourceId)?.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={selectedResource.amount}
                              onChange={(e) => handleResourceAmountChange(
                                selectedResource.resourceId,
                                parseFloat(e.target.value) || 0
                              )}
                              className="w-20"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveResource(selectedResource.resourceId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    updateProject,
    deleteProject,
    addTask,
    updateTaskStatus,
    assignTask,
    autoAssignTasks,
    generateTasksFromDescription,
    loading 
  } = useProjects();
  const [project, setProject] = useState<any>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      const fetchedProject = getProjectById(id);
      if (fetchedProject) {
        setProject(fetchedProject);
      } else {
        navigate('/projects', { replace: true });
      }
    }
  }, [id, getProjectById, loading, navigate]);
  
  if (!project) {
    return (
      <Layout requiresAuth>
        <div className="h-96 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">Loading project...</span>
        </div>
      </Layout>
    );
  }
  
  const handleStatusChange = async (status: string) => {
    await updateProject(project.id, { status });
    setProject({ ...project, status });
    
    toast({
      title: "Status updated",
      description: `Project status changed to ${status}`,
    });
  };
  
  const handleDeleteProject = async () => {
    await deleteProject(project.id);
    navigate('/projects');
    
    toast({
      title: "Project deleted",
      description: "The project has been deleted successfully",
    });
  };
  
  const handleAddTask = async (taskData: any) => {
    await addTask(project.id, taskData);
    
    // Refresh project data
    const updatedProject = getProjectById(project.id);
    setProject(updatedProject);
    
    toast({
      title: "Task added",
      description: "The task has been added to the project",
    });
  };
  
  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, project.id, status);
    
    // Refresh project data
    const updatedProject = getProjectById(project.id);
    setProject(updatedProject);
    
    toast({
      title: "Task status changed",
      description: `Task status updated to ${status.replace('-', ' ')}`,
    });
  };
  
  const handleGenerateTasks = async () => {
    setIsGeneratingTasks(true);
    await generateTasksFromDescription(project.id);
    
    // Refresh project data
    const updatedProject = getProjectById(project.id);
    setProject(updatedProject);
    
    setIsGeneratingTasks(false);
  };
  
  const handleAutoAssignTasks = async () => {
    setIsAutoAssigning(true);
    await autoAssignTasks(project.id);
    
    // Refresh project data
    const updatedProject = getProjectById(project.id);
    setProject(updatedProject);
    
    setIsAutoAssigning(false);
  };
  
  // Calculate task statistics
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
  const inProgressTasks = project.tasks.filter((task: any) => task.status === 'in-progress').length;
  const notStartedTasks = project.tasks.filter((task: any) => task.status === 'not-started').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get task status badge color
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started': 
        return <Badge variant="outline" className="bg-gray-100">Not Started</Badge>;
      case 'in-progress': 
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">In Progress</Badge>;
      case 'completed': 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects')}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('-', ' ')}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Project</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleStatusChange('planning')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Planning</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  <span>In Progress</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('on-hold')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span>On Hold</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Completed</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
                  <AlertDialogTrigger className="w-full">
                    <div className="flex w-full items-center">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Project</span>
                    </div>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the project and all associated tasks. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                {project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project · {project.tasks.length} Tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">DESCRIPTION</h3>
                <p className="text-sm">{project.description}</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {project.startDate}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {project.endDate || 'Not set'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    {new Date(project.updatedAt).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Tasks</h3>
                  <p className="flex items-center">
                    <ListTodo className="h-4 w-4 mr-1 text-muted-foreground" />
                    {completedTasks} of {totalTasks} completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>
                Overall project completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2">{completionPercentage}%</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              
              <Progress value={completionPercentage} className="h-2 mb-6" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium">{completedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In Progress:</span>
                  <span className="font-medium">{inProgressTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Not Started:</span>
                  <span className="font-medium">{notStartedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{totalTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleAutoAssignTasks}
              disabled={isAutoAssigning || loading}
            >
              {isAutoAssigning ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Auto-Assign Tasks
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGenerateTasks}
              disabled={isGeneratingTasks || loading}
            >
              {isGeneratingTasks ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Tasks
                </>
              )}
            </Button>
            
            <Button onClick={() => setIsTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
            
            <TaskDialog
              open={isTaskDialogOpen}
              onOpenChange={setIsTaskDialogOpen}
              projectId={project.id}
              onAddTask={handleAddTask}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center">
                            <ListTodo className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
                            <p className="text-muted-foreground">No tasks found</p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Get started by generating or creating tasks
                            </p>
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" onClick={handleGenerateTasks} disabled={isGeneratingTasks}>
                                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                                Generate with AI
                              </Button>
                              <Button size="sm" onClick={() => setIsTaskDialogOpen(true)}>
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Add Task
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.tasks.map((task: any) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {task.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTaskStatusBadge(task.status)}
                          </TableCell>
                          <TableCell>
                            {task.assignedToName || (
                              <span className="text-muted-foreground text-sm">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {task.skills.slice(0, 2).map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-slate-50">
                                  {skill}
                                </Badge>
                              ))}
                              {task.skills.length > 2 && (
                                <Badge variant="outline" className="bg-slate-50">
                                  +{task.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{task.estimatedHours}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Task</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'not-started')}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  <span>Not Started</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'in-progress')}>
                                  <PlayCircle className="mr-2 h-4 w-4" />
                                  <span>In Progress</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'completed')}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  <span>Completed</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Not Started Tab */}
          <TabsContent value="not-started" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.filter((task: any) => task.status === 'not-started').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p className="text-muted-foreground">No tasks in this category</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.tasks
                        .filter((task: any) => task.status === 'not-started')
                        .map((task: any) => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getTaskStatusBadge(task.status)}
                            </TableCell>
                            <TableCell>
                              {task.assignedToName || (
                                <span className="text-muted-foreground text-sm">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.skills.slice(0, 2).map((skill: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-slate-50">
                                    {skill}
                                  </Badge>
                                ))}
                                {task.skills.length > 2 && (
                                  <Badge variant="outline" className="bg-slate-50">
                                    +{task.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{task.estimatedHours}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                              >
                                Start
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* In Progress Tab */}
          <TabsContent value="in-progress" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.filter((task: any) => task.status === 'in-progress').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p className="text-muted-foreground">No tasks in this category</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.tasks
                        .filter((task: any) => task.status === 'in-progress')
                        .map((task: any) => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getTaskStatusBadge(task.status)}
                            </TableCell>
                            <TableCell>
                              {task.assignedToName || (
                                <span className="text-muted-foreground text-sm">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.skills.slice(0, 2).map((skill: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-slate-50">
                                    {skill}
                                  </Badge>
                                ))}
                                {task.skills.length > 2 && (
                                  <Badge variant="outline" className="bg-slate-50">
                                    +{task.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{task.estimatedHours}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleTaskStatusChange(task.id, 'completed')}
                              >
                                Complete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Completed Tab */}
          <TabsContent value="completed" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.filter((task: any) => task.status === 'completed').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <p className="text-muted-foreground">No tasks in this category</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      project.tasks
                        .filter((task: any) => task.status === 'completed')
                        .map((task: any) => (
                          <TableRow key={task.id}>
                            <TableCell>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getTaskStatusBadge(task.status)}
                            </TableCell>
                            <TableCell>
                              {task.assignedToName || (
                                <span className="text-muted-foreground text-sm">Unassigned</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.skills.slice(0, 2).map((skill: string, index: number) => (
                                  <Badge key={index} variant="outline" className="bg-slate-50">
                                    {skill}
                                  </Badge>
                                ))}
                                {task.skills.length > 2 && (
                                  <Badge variant="outline" className="bg-slate-50">
                                    +{task.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{task.estimatedHours}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                              >
                                Re-open
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
