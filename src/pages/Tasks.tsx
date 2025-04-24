
import React, { useState } from 'react';
import { useProjects } from '@/contexts/ProjectContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter,
  ListFilter,
  CheckCircle2,
  PlayCircle,
  XCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskStatus } from '@/contexts/ProjectContext';

const Tasks = () => {
  const { projects, loading, updateTaskStatus } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  
  // Flatten all tasks from all projects
  const allTasks = projects.flatMap(project => 
    project.tasks.map(task => ({
      ...task,
      projectId: project.id,
      projectTitle: project.title,
    }))
  );
  
  // Apply filters
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesProject = projectFilter ? task.projectId === projectFilter : true;
    
    return matchesSearch && matchesStatus && matchesProject;
  });
  
  // Get task status badge
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
  
  const handleChangeTaskStatus = async (taskId: string, projectId: string, status: TaskStatus) => {
    await updateTaskStatus(taskId, projectId, status);
  };
  
  // Function to count tasks by status
  const getTaskCounts = () => {
    const counts = {
      total: allTasks.length,
      notStarted: allTasks.filter(t => t.status === 'not-started').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
    };
    
    return counts;
  };
  
  const taskCounts = getTaskCounts();

  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              View and manage all tasks across projects
            </p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant={statusFilter === null ? "secondary" : "outline"}
              onClick={() => setStatusFilter(null)}
              className="text-sm h-8"
            >
              All ({taskCounts.total})
            </Button>
            <Button
              variant={statusFilter === 'not-started' ? "secondary" : "outline"}
              onClick={() => setStatusFilter('not-started')}
              className="text-sm h-8"
            >
              Not Started ({taskCounts.notStarted})
            </Button>
            <Button
              variant={statusFilter === 'in-progress' ? "secondary" : "outline"}
              onClick={() => setStatusFilter('in-progress')}
              className="text-sm h-8"
            >
              In Progress ({taskCounts.inProgress})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? "secondary" : "outline"}
              onClick={() => setStatusFilter('completed')}
              className="text-sm h-8"
            >
              Completed ({taskCounts.completed})
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" />
                Filter by Project
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem onClick={() => setProjectFilter(null)}>
                All Projects
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {projects.map(project => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setProjectFilter(project.id)}
                  className={projectFilter === project.id ? "bg-primary/10" : ""}
                >
                  {project.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {(projectFilter || statusFilter) && (
          <div className="flex gap-2">
            {projectFilter && (
              <Badge variant="outline" className="px-3 py-1">
                Project: {projects.find(p => p.id === projectFilter)?.title}
                <button 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setProjectFilter(null)}
                >
                  ×
                </button>
              </Badge>
            )}
            {statusFilter && (
              <Badge variant="outline" className="px-3 py-1">
                Status: {statusFilter.replace('-', ' ')}
                <button 
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setStatusFilter(null)}
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mb-4">Try changing your search or filters</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="text-center">Est. Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/projects/${task.projectId}`}
                        className="text-primary hover:underline"
                      >
                        {task.projectTitle}
                      </Link>
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
                    <TableCell className="text-center">{task.estimatedHours}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Change Status
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleChangeTaskStatus(task.id, task.projectId, 'not-started')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Not Started
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleChangeTaskStatus(task.id, task.projectId, 'in-progress')}
                            >
                              <PlayCircle className="mr-2 h-4 w-4" />
                              In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleChangeTaskStatus(task.id, task.projectId, 'completed')}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;
