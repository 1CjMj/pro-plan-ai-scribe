/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/useProjects';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Search,
  Grid,
  List, 
  Calendar,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProjectContext } from '@/contexts/ProjectContext';

const ProjectCard = ({ project }: { project: any }) => {
  // Calculate task completion percentage
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
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

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{project.description}</p>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Progress</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div 
                className="h-2 bg-primary rounded-full" 
                style={{ width: `${completionPercentage}%` }} 
              />
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks</p>
              <p className="text-xs font-medium">{completionPercentage}%</p>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {project.category}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const ProjectListItem = ({ project }: { project: any }) => {
  // Calculate task completion percentage
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
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

  return (
    <Link to={`/projects/${project.id}`}>
      <div className="border rounded-md p-4 hover:bg-slate-50 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{project.title}</h3>
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('-', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          <div className="text-right min-w-[120px]">
            <div className="text-sm">{completionPercentage}%</div>
            <div className="text-xs text-muted-foreground">{completedTasks}/{totalTasks} tasks</div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
          <div>
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </div>
          <div>
            Category: {project.category}
          </div>
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const { projects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { deleteProject } = useContext(ProjectContext);
  const navigate = useNavigate();
  
  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    const matchesCategory = categoryFilter ? project.category === categoryFilter : true;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  return (
    <Layout requiresAuth>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('planning')}>
                  Planning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('on-hold')}>
                  On Hold
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                  All categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('technical')}>
                  Technical
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('creative')}>
                  Creative
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('general')}>
                  General
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon" onClick={() => setViewType('grid')}
              className={viewType === 'grid' ? 'bg-primary/10' : ''}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setViewType('list')}
              className={viewType === 'list' ? 'bg-primary/10' : ''}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          {statusFilter && (
            <Badge variant="outline" className="mr-2">
              Status: {statusFilter}
              <button className="ml-1" onClick={() => setStatusFilter(null)}>×</button>
            </Badge>
          )}
          {categoryFilter && (
            <Badge variant="outline">
              Category: {categoryFilter}
              <button className="ml-1" onClick={() => setCategoryFilter(null)}>×</button>
            </Badge>
          )}
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="text-muted-foreground mb-4">Try changing your search or filters</p>
                <Link to="/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
              </div>
            ) : viewType === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map(project => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.filter(p => p.status === 'in-progress' || p.status === 'planning').length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No active projects found</h3>
                <p className="text-muted-foreground mb-4">Try changing your search or filters</p>
                <Link to="/projects/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
              </div>
            ) : viewType === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects
                  .filter(p => p.status === 'in-progress' || p.status === 'planning')
                  .map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects
                  .filter(p => p.status === 'in-progress' || p.status === 'planning')
                  .map(project => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading projects...</p>
              </div>
            ) : filteredProjects.filter(p => p.status === 'completed').length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No completed projects found</h3>
                <p className="text-muted-foreground mb-4">Projects will appear here when they're completed</p>
              </div>
            ) : viewType === 'grid' ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects
                  .filter(p => p.status === 'completed')
                  .map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects
                  .filter(p => p.status === 'completed')
                  .map(project => (
                    <ProjectListItem key={project.id} project={project} />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
