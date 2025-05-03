import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { initializeAIModels, generateTasksFromText, calculateSkillMatch } from '@/utils/ai';
import AIStatusBar from '@/components/ui/AIStatusBar';

// Define project-related types
export type ProjectStatus = 'planning' | 'in-progress' | 'completed' | 'on-hold';
export type ProjectCategory = 'technical' | 'general' | 'creative';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed';

export interface Resource {
  id: string;
  name: string;
  type: string;
  availability: number; // Percentage of availability
  quantity?: number;
  unit?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  skills: string[];
  assignedTo?: string; // User ID
  assignedToName?: string; // User Name
  startDate?: string;
  endDate?: string;
  estimatedHours: number;
  actualHours?: number;
  resources: {
    resourceId: string;
    amount: number;
  }[];
  dependencies?: string[]; // Task IDs this task depends on
  createdBy: 'ai' | 'manual';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  managerId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  resources: Resource[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getProjectById: (projectId: string) => Project | undefined;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (taskId: string, projectId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string, projectId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, projectId: string, status: TaskStatus) => Promise<void>;
  assignTask: (taskId: string, projectId: string, userId: string, userName: string) => Promise<void>;
  autoAssignTasks: (projectId: string) => Promise<void>;
  generateTasksFromDescription: (projectId: string) => Promise<void>;
  getTasksByUserId: (userId: string) => Task[];
  addResource: (resource: Omit<Resource, 'id'>) => Promise<Resource>;
  updateResource: (resourceId: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  importEmployeesFromFile: (data: any) => Promise<void>;
  importResourcesFromFile: (data: any) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mock resources
const initialResources: Resource[] = [
  { id: 'resource-001', name: 'MacBook Pro', type: 'hardware', availability: 70, quantity: 5, unit: 'unit' },
  { id: 'resource-002', name: 'Adobe Creative Suite', type: 'software', availability: 100, quantity: 10, unit: 'license' },
  { id: 'resource-003', name: 'Meeting Room A', type: 'space', availability: 80, quantity: 1, unit: 'room' },
  { id: 'resource-004', name: 'Server Cluster', type: 'hardware', availability: 90, quantity: 1, unit: 'cluster' },
];

// Mock projects
const initialProjects: Project[] = [
  {
    id: 'project-001',
    title: 'Company Website Redesign',
    description: 'Redesign the company website with a modern look and improved user experience.',
    category: 'creative',
    status: 'in-progress',
    startDate: '2023-04-01',
    endDate: '2023-06-30',
    managerId: 'user-001',
    tasks: [
      {
        id: 'task-001',
        projectId: 'project-001',
        title: 'Create wireframes',
        description: 'Create wireframes for all main pages of the website',
        status: 'completed',
        skills: ['UI Design', 'UX Research'],
        assignedTo: 'user-002',
        assignedToName: 'Jane Worker',
        startDate: '2023-04-01',
        endDate: '2023-04-15',
        estimatedHours: 40,
        actualHours: 35,
        resources: [
          { resourceId: 'resource-002', amount: 1 },
        ],
        createdBy: 'manual',
        createdAt: '2023-03-25T10:00:00Z',
        updatedAt: '2023-04-15T14:30:00Z',
      },
      {
        id: 'task-002',
        projectId: 'project-001',
        title: 'Frontend development',
        description: 'Implement the frontend of the website using React',
        status: 'in-progress',
        skills: ['React', 'JavaScript', 'HTML/CSS'],
        assignedTo: 'user-002',
        assignedToName: 'Jane Worker',
        startDate: '2023-04-16',
        estimatedHours: 80,
        resources: [
          { resourceId: 'resource-001', amount: 1 },
          { resourceId: 'resource-002', amount: 1 },
        ],
        createdBy: 'manual',
        createdAt: '2023-03-25T10:30:00Z',
        updatedAt: '2023-04-16T09:00:00Z',
      },
    ],
    createdAt: '2023-03-15T08:00:00Z',
    updatedAt: '2023-04-16T09:00:00Z',
  }
];

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAILoading] = useState(true);
  const [aiError, setAIError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Initialize AI models
  useEffect(() => {
    const loadAI = async () => {
      try {
        setAILoading(true);
        const success = await initializeAIModels();
        if (!success) {
          setAIError('Failed to initialize AI models');
        }
      } catch (error) {
        setAIError(error instanceof Error ? error.message : 'Unknown error initializing AI');
      } finally {
        setAILoading(false);
      }
    };

    loadAI();
  }, []);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProjects = localStorage.getItem('projects');
        const savedResources = localStorage.getItem('resources');
        
        setProjects(savedProjects ? JSON.parse(savedProjects) : initialProjects);
        setResources(savedResources ? JSON.parse(savedResources) : initialResources);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load saved projects and resources",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Save data whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('projects', JSON.stringify(projects));
      localStorage.setItem('resources', JSON.stringify(resources));
    }
  }, [projects, resources, loading]);

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      tasks: [],
      createdAt: now,
      updatedAt: now,
    };
    
    setProjects((prev) => [...prev, newProject]);
    toast({
      title: "Project created",
      description: `Project "${newProject.title}" has been created successfully.`,
    });
    
    return newProject;
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) => 
      prev.map((project) => 
        project.id === projectId 
          ? { 
              ...project, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            }
          : project
      )
    );
    
    toast({
      title: "Project updated",
      description: "The project has been updated successfully.",
    });
  };

  const deleteProject = async (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    
    toast({
      title: "Project deleted",
      description: "The project has been deleted successfully.",
    });
  };

  const getProjectById = (projectId: string) => {
    return projects.find((project) => project.id === projectId);
  };

  const addTask = async (projectId: string, task: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      projectId,
      createdAt: now,
      updatedAt: now,
    };
    
    setProjects((prev) => 
      prev.map((project) => 
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, newTask],
              updatedAt: now,
            }
          : project
      )
    );
    
    toast({
      title: "Task added",
      description: `Task "${newTask.title}" has been added to the project.`,
    });
    
    return newTask;
  };

  const updateTask = async (taskId: string, projectId: string, updates: Partial<Task>) => {
    setProjects((prev) => 
      prev.map((project) => 
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                  : task
              ),
              updatedAt: new Date().toISOString(),
            }
          : project
      )
    );
    
    toast({
      title: "Task updated",
      description: "The task has been updated successfully.",
    });
  };

  const deleteTask = async (taskId: string, projectId: string) => {
    setProjects((prev) => 
      prev.map((project) => 
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
              updatedAt: new Date().toISOString(),
            }
          : project
      )
    );
    
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const updateTaskStatus = async (taskId: string, projectId: string, status: TaskStatus) => {
    await updateTask(taskId, projectId, { status });
  };

  const assignTask = async (taskId: string, projectId: string, userId: string, userName: string) => {
    await updateTask(taskId, projectId, { assignedTo: userId, assignedToName: userName });
  };

  const generateTasksFromDescription = async (projectId: string) => {
    setLoading(true);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const generatedTasks = await generateTasksFromText(project.description, project.category);
      
      // Add tasks to project
      for (const task of generatedTasks) {
        await addTask(projectId, task);
      }

      toast({
        title: "Tasks generated",
        description: `${generatedTasks.length} tasks have been generated using AI.`,
      });
    } catch (error) {
      toast({
        title: "Error generating tasks",
        description: error instanceof Error ? error.message : "Failed to generate tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const autoAssignTasks = async (projectId: string) => {
    setLoading(true);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const employees = [
        {
          id: 'user-002',
          name: 'Jane Worker',
          skills: ['React', 'JavaScript', 'UI Design', 'Content Writing', 'Frontend Development'],
        },
        {
          id: 'user-003',
          name: 'Bob Developer',
          skills: ['Backend Development', 'API Design', 'Database Design', 'SQL', 'DevOps'],
        },
        {
          id: 'user-004',
          name: 'Alice Designer',
          skills: ['UI/UX Design', 'Graphic Design', 'Visual Design', 'Art Direction', 'Brand Strategy'],
        },
        {
          id: 'user-005',
          name: 'Charlie Manager',
          skills: ['Project Management', 'Communication', 'Risk Management', 'Strategic Planning', 'Presentation'],
        },
      ];

      const updatedProjects = await Promise.all(projects.map(async (p) => {
        if (p.id === projectId) {
          const updatedTasks = await Promise.all(p.tasks.map(async (task) => {
            if (task.assignedTo) return task;

            let bestMatch = null;
            let bestMatchScore = 0;

            for (const employee of employees) {
              const matchScore = await calculateSkillMatch(task.skills, employee.skills);
              
              if (matchScore > bestMatchScore) {
                bestMatch = employee;
                bestMatchScore = matchScore;
              }
            }

            if (bestMatch && bestMatchScore >= 0.5) {
              return {
                ...task,
                assignedTo: bestMatch.id,
                assignedToName: bestMatch.name,
                updatedAt: new Date().toISOString(),
              };
            }

            return task;
          }));

          return {
            ...p,
            tasks: updatedTasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      }));

      setProjects(updatedProjects);
      
      toast({
        title: "Tasks assigned",
        description: "Tasks have been automatically assigned based on AI skill matching.",
      });
    } catch (error) {
      toast({
        title: "Error assigning tasks",
        description: error instanceof Error ? error.message : "Failed to assign tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTasksByUserId = (userId: string): Task[] => {
    const userTasks: Task[] = [];
    
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.assignedTo === userId) {
          userTasks.push({
            ...task,
            projectId: project.id,
          });
        }
      });
    });
    
    return userTasks;
  };
  
  const addResource = async (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: uuidv4(),
    };
    
    setResources(prev => [...prev, newResource]);
    
    toast({
      title: "Resource added",
      description: `Resource "${newResource.name}" has been added.`,
    });
    
    return newResource;
  };
  
  const updateResource = async (resourceId: string, updates: Partial<Resource>) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId
          ? { ...resource, ...updates }
          : resource
      )
    );
    
    toast({
      title: "Resource updated",
      description: "The resource has been updated successfully.",
    });
  };
  
  const deleteResource = async (resourceId: string) => {
    // Check if resource is used in any tasks
    let isUsed = false;
    
    for (const project of projects) {
      for (const task of project.tasks) {
        if (task.resources.some(r => r.resourceId === resourceId)) {
          isUsed = true;
          break;
        }
      }
      if (isUsed) break;
    }
    
    if (isUsed) {
      toast({
        title: "Cannot delete resource",
        description: "This resource is currently being used in one or more tasks.",
        variant: "destructive",
      });
      return;
    }
    
    setResources(prev => prev.filter(resource => resource.id !== resourceId));
    
    toast({
      title: "Resource deleted",
      description: "The resource has been deleted successfully.",
    });
  };
  
  const importEmployeesFromFile = async (data: any) => {
    // Mock implementation - would validate and process file data
    toast({
      title: "Employees imported",
      description: "Employee data has been imported successfully.",
    });
    
    return Promise.resolve();
  };
  
  const importResourcesFromFile = async (data: any) => {
    // Mock implementation - would validate and process file data
    toast({
      title: "Resources imported",
      description: "Resource data has been imported successfully.",
    });
    
    return Promise.resolve();
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      resources,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      assignTask,
      autoAssignTasks,
      generateTasksFromDescription,
      getTasksByUserId,
      addResource,
      updateResource,
      deleteResource,
      importEmployeesFromFile,
      importResourcesFromFile,
    }}>
      {children}
      <AIStatusBar loading={aiLoading} error={aiError} />
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
