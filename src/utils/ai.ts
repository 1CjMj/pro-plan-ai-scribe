
import type { Task } from '@/contexts/ProjectContext';

/**
 * Initialize AI models needed for the application
 */
export const initializeAIModels = async (): Promise<boolean> => {
  try {
    // This would typically load models from a service like Hugging Face
    // For now we're just simulating successful initialization
    console.log('AI models initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize AI models:', error);
    return false;
  }
};

/**
 * Generate tasks from text description using AI
 */
export const generateTasksFromText = async (description: string, category: string): Promise<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[]> => {
  try {
    // For now, return mock tasks based on the project description and category
    const mockTasks: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] = [];
    
    if (category === 'technical') {
      mockTasks.push(
        {
          title: 'Setup development environment',
          description: 'Install and configure all necessary development tools',
          status: 'not-started',
          skills: ['DevOps', 'Development'],
          estimatedHours: 4,
          resources: [],
          createdBy: 'ai',
        },
        {
          title: 'Create technical specifications',
          description: 'Document technical requirements and architecture',
          status: 'not-started',
          skills: ['Documentation', 'Architecture'],
          estimatedHours: 8,
          resources: [],
          createdBy: 'ai',
        }
      );
    } else if (category === 'creative') {
      mockTasks.push(
        {
          title: 'Brainstorming session',
          description: 'Conduct creative brainstorming session with team',
          status: 'not-started',
          skills: ['Creativity', 'Communication'],
          estimatedHours: 3,
          resources: [],
          createdBy: 'ai',
        },
        {
          title: 'Create mood board',
          description: 'Develop visual mood board for project direction',
          status: 'not-started',
          skills: ['Visual Design', 'Art Direction'],
          estimatedHours: 5,
          resources: [],
          createdBy: 'ai',
        }
      );
    } else {
      // General category
      mockTasks.push(
        {
          title: 'Project kickoff meeting',
          description: 'Initial meeting to align team on project goals',
          status: 'not-started',
          skills: ['Project Management', 'Communication'],
          estimatedHours: 2,
          resources: [],
          createdBy: 'ai',
        },
        {
          title: 'Create project plan',
          description: 'Develop detailed project plan with milestones',
          status: 'not-started',
          skills: ['Project Management', 'Planning'],
          estimatedHours: 6,
          resources: [],
          createdBy: 'ai',
        }
      );
    }
    
    return mockTasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw new Error('Failed to generate tasks');
  }
};

/**
 * Calculate the skill match between task requirements and employee skills
 */
export const calculateSkillMatch = async (taskSkills: string[], employeeSkills: string[]): Promise<number> => {
  // For simplicity, we'll use a basic matching algorithm
  const matchCount = employeeSkills.filter(skill => 
    taskSkills.some(taskSkill => 
      taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(taskSkill.toLowerCase())
    )
  ).length;
  
  return matchCount > 0 ? matchCount / Math.max(taskSkills.length, 1) : 0;
};
