
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

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
  const { toast } = useToast();
  const { currentUser } = useAuth();

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

  // Mock AI task generation
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
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI-generated tasks based on project category
    let aiTasks: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] = [];
    
    if (project.category === 'technical') {
      aiTasks = [
        {
          title: 'Requirements gathering',
          description: 'Interview stakeholders and document technical requirements',
          status: 'not-started',
          skills: ['Project Management', 'Technical Analysis'],
          estimatedHours: 20,
          resources: [{ resourceId: 'resource-003', amount: 2 }],
          createdBy: 'ai',
        },
        {
          title: 'System architecture design',
          description: 'Create high-level system architecture diagrams and documentation',
          status: 'not-started',
          skills: ['System Design', 'Architecture'],
          estimatedHours: 30,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-004', amount: 0.5 }],
          createdBy: 'ai',
        },
        {
          title: 'Database schema design',
          description: 'Design database schema based on requirements',
          status: 'not-started',
          skills: ['Database Design', 'SQL'],
          estimatedHours: 20,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Backend development',
          description: 'Implement backend APIs and services',
          status: 'not-started',
          skills: ['Backend Development', 'API Design'],
          estimatedHours: 80,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-004', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Frontend development',
          description: 'Build user interface components and screens',
          status: 'not-started',
          skills: ['Frontend Development', 'UI Design'],
          estimatedHours: 70,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-002', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Integration testing',
          description: 'Perform integration testing of all system components',
          status: 'not-started',
          skills: ['QA', 'Testing'],
          estimatedHours: 40,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Deployment setup',
          description: 'Configure deployment environments and CI/CD pipeline',
          status: 'not-started',
          skills: ['DevOps', 'Cloud Infrastructure'],
          estimatedHours: 25,
          resources: [{ resourceId: 'resource-004', amount: 1 }],
          createdBy: 'ai',
        },
      ];
    } else if (project.category === 'creative') {
      aiTasks = [
        {
          title: 'Brand guidelines review',
          description: 'Review existing brand guidelines and identify areas for improvement',
          status: 'not-started',
          skills: ['Brand Strategy', 'Design'],
          estimatedHours: 10,
          resources: [{ resourceId: 'resource-003', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Mood board creation',
          description: 'Create mood boards for visual direction',
          status: 'not-started',
          skills: ['Visual Design', 'Art Direction'],
          estimatedHours: 15,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-002', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Concept development',
          description: 'Develop initial creative concepts based on brief',
          status: 'not-started',
          skills: ['Creative Ideation', 'Concept Development'],
          estimatedHours: 25,
          resources: [{ resourceId: 'resource-002', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Design mockups',
          description: 'Create high-fidelity design mockups for key deliverables',
          status: 'not-started',
          skills: ['Graphic Design', 'UI/UX Design'],
          estimatedHours: 40,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-002', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Copywriting',
          description: 'Develop written content and messaging',
          status: 'not-started',
          skills: ['Copywriting', 'Content Strategy'],
          estimatedHours: 30,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Client presentation',
          description: 'Prepare and deliver client presentation of creative work',
          status: 'not-started',
          skills: ['Presentation', 'Client Management'],
          estimatedHours: 15,
          resources: [{ resourceId: 'resource-002', amount: 1 }, { resourceId: 'resource-003', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Revisions and finalization',
          description: 'Incorporate feedback and finalize creative assets',
          status: 'not-started',
          skills: ['Design', 'Attention to Detail'],
          estimatedHours: 25,
          resources: [{ resourceId: 'resource-001', amount: 1 }, { resourceId: 'resource-002', amount: 1 }],
          createdBy: 'ai',
        },
      ];
    } else { // general
      aiTasks = [
        {
          title: 'Project kickoff',
          description: 'Conduct kickoff meeting with all stakeholders',
          status: 'not-started',
          skills: ['Project Management', 'Communication'],
          estimatedHours: 4,
          resources: [{ resourceId: 'resource-003', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Stakeholder interviews',
          description: 'Interview key stakeholders to gather requirements and expectations',
          status: 'not-started',
          skills: ['Research', 'Communication'],
          estimatedHours: 20,
          resources: [{ resourceId: 'resource-003', amount: 2 }],
          createdBy: 'ai',
        },
        {
          title: 'Market research',
          description: 'Conduct market research and competitive analysis',
          status: 'not-started',
          skills: ['Market Research', 'Analysis'],
          estimatedHours: 30,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Project plan development',
          description: 'Create detailed project plan with timeline and milestones',
          status: 'not-started',
          skills: ['Project Planning', 'Project Management'],
          estimatedHours: 15,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Progress reporting',
          description: 'Create regular progress reports for stakeholders',
          status: 'not-started',
          skills: ['Reporting', 'Communication'],
          estimatedHours: 10,
          resources: [{ resourceId: 'resource-001', amount: 0.5 }],
          createdBy: 'ai',
        },
        {
          title: 'Risk assessment',
          description: 'Identify and document potential risks and mitigation strategies',
          status: 'not-started',
          skills: ['Risk Management', 'Strategic Planning'],
          estimatedHours: 8,
          resources: [{ resourceId: 'resource-003', amount: 1 }],
          createdBy: 'ai',
        },
        {
          title: 'Final deliverable preparation',
          description: 'Compile and prepare final project deliverables',
          status: 'not-started',
          skills: ['Organization', 'Attention to Detail'],
          estimatedHours: 20,
          resources: [{ resourceId: 'resource-001', amount: 1 }],
          createdBy: 'ai',
        },
      ];
    }
    
    // Add tasks to project
    for (const task of aiTasks) {
      await addTask(projectId, task);
    }
    
    setLoading(false);
    
    toast({
      title: "Tasks generated",
      description: `${aiTasks.length} tasks have been generated using AI.`,
    });
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
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock employee skills data
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
    
    // Update tasks with assigned users based on skills match
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const updatedTasks = p.tasks.map(task => {
          // Skip already assigned tasks
          if (task.assignedTo) {
            return task;
          }
          
          // Find best match employee based on skills
          let bestMatch = null;
          let bestMatchScore = 0;
          
          for (const employee of employees) {
            let matchScore = 0;
            
            // Count matching skills
            for (const skill of task.skills) {
              if (employee.skills.includes(skill)) {
                matchScore += 1;
              } else {
                // Fuzzy matching - partial credit for similar skills
                for (const empSkill of employee.skills) {
                  if (empSkill.toLowerCase().includes(skill.toLowerCase()) || 
                      skill.toLowerCase().includes(empSkill.toLowerCase())) {
                    matchScore += 0.5;
                  }
                }
              }
            }
            
            // Normalize score as percentage of required skills
            const normalizedScore = task.skills.length > 0 ? matchScore / task.skills.length : 0;
            
            // Update best match if this employee has a better score
            if (normalizedScore > bestMatchScore) {
              bestMatch = employee;
              bestMatchScore = normalizedScore;
            }
          }
          
          // Only assign if match score is above threshold (50%)
          if (bestMatch && bestMatchScore >= 0.5) {
            return {
              ...task,
              assignedTo: bestMatch.id,
              assignedToName: bestMatch.name,
              updatedAt: new Date().toISOString(),
            };
          }
          
          return task;
        });
        
        return {
          ...p,
          tasks: updatedTasks,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    setLoading(false);
    
    toast({
      title: "Tasks assigned",
      description: "Tasks have been automatically assigned based on skills matching.",
    });
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
    <ProjectContext.Provider
      value={{
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
      }}
    >
      {children}
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
