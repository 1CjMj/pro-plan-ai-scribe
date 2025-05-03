import type { Task, Project } from '@/contexts/ProjectContext';
import { generate_project_tasks } from '../../backend/task_generator_coding';
import { generate_non_coding_tasks } from '../../backend/task_generator_non_coding';

export const generateTasksFromText = async (description: string, category: string): Promise<Task[]> => {
  try {
    let rawOutput;
    if (category === 'coding') {
      rawOutput = generate_project_tasks(description);
    } else {
      rawOutput = generate_non_coding_tasks(description);
    }

    // Assuming the raw output is already parsed into tasks
    return rawOutput.tasks || rawOutput;
  } catch (error) {
    console.error('Error generating tasks:', error);
    return [
      {
        title: 'Fallback Task',
        description: `Fallback task for category: ${category}`,
        status: 'not-started',
        skills: ['Fallback'],
        estimatedHours: 4,
        resources: [],
        createdBy: 'ai',
      },
    ];
  }
};

export const calculateSkillMatch = async (taskSkills: string[], employeeSkills: string[]): Promise<number> => {
  try {
    // Fallback to a simple text matching approach
    const matchCount = employeeSkills.filter(skill => 
      taskSkills.some(taskSkill => 
        taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(taskSkill.toLowerCase())
      )
    ).length;
    
    return matchCount > 0 ? matchCount / Math.max(taskSkills.length, 1) : 0;
  } catch (error) {
    console.error('Error calculating skill match:', error);
    return 0;
  }
};
