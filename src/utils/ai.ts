import type { Task } from '@/contexts/ProjectContext';

// Google Generative AI configuration
const GEMINI_API_KEY = "AIzaSyBXgkoIoxI7oE24Wr5V-SJ0ZG_lxg1hpLs";

/**
 * Parse tasks from the AI response output
 */
const parseTasks = (output: string): Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] => {
  const tasks: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] = [];
  const lines = output.split('\n');

  let currentTask: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>> | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("*   **Task:**")) {
      // Save the previous task if it exists
      if (currentTask) {
        tasks.push(currentTask as Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>);
      }

      // Start a new task
      currentTask = {
        title: trimmedLine.split("**Task:**")[1]?.trim() || "New Task",
        description: "",
        status: "not-started",
        skills: [],
        estimatedHours: 0,
        resources: [],
        createdBy: "ai",
      };
    } else if (trimmedLine.startsWith("*   **Skills:**") && currentTask) {
      const skills = trimmedLine.split("**Skills:**")[1]?.trim() || "";
      currentTask.skills = skills ? skills.split(",").map((s) => s.trim()) : [];
    } else if (trimmedLine.startsWith("*   **Resources:**") && currentTask) {
      const resources = trimmedLine.split("**Resources:**")[1]?.trim() || "";
      currentTask.resources = resources
        ? resources.split(",").map((r) => ({ resourceId: r.trim(), amount: 1 }))
        : [];
    } else if (trimmedLine.startsWith("*   **Time:**") && currentTask) {
      try {
        const estimatedDays = parseInt(trimmedLine.split("**Time:**")[1]?.trim() || "0", 10);
        currentTask.estimatedHours = estimatedDays * 8; // Convert days to hours
      } catch (e) {
        currentTask.estimatedHours = 0;
      }
    } else if (trimmedLine && currentTask && !currentTask.description) {
      // Use this as the description if not set
      currentTask.description = trimmedLine;
    }
  }

  // Add the last task
  if (currentTask) {
    tasks.push(currentTask as Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>);
  }

  return tasks;
};

/**
 * Generate tasks from text description using Gemini AI
 */
export const generateTasksFromText = async (
  description: string, 
  category: string
): Promise<Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[]> => {
  try {
    // Prepare the prompt based on project category
    const prompt = `Generate a comprehensive list of tasks for a ${category} project with the following description: "${description}". 
    
For each task, please provide:
- Task: [Task title]
- Skills: [Comma-separated list of skills required]
- Resources: [Comma-separated list of resources needed]
- Time: [Estimated time in days]

Generate at least 5 tasks that cover the entire project lifecycle.`;

    // Call the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    console.log('Raw AI response:', generatedText);
    
    // If API fails, fall back to mock tasks
    if (!generatedText) {
      return getFallbackTasks(category);
    }
    
    // Parse the output into task objects
    const tasks = parseTasks(generatedText);
    
    // If parsing fails, use fallback
    if (tasks.length === 0) {
      return getFallbackTasks(category);
    }

    return tasks;
  } catch (error) {
    console.error('Error generating tasks:', error);
    // Fallback to mock tasks in case of error
    return getFallbackTasks(category);
  }
};

/**
 * Get fallback tasks in case the AI service fails
 */
const getFallbackTasks = (
  category: string
): Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[] => {
  if (category === 'technical') {
    return [
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
    ];
  } else if (category === 'creative') {
    return [
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
    ];
  } else {
    // General category
    return [
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
    ];
  }
};

/**
 * Calculate the skill match between task requirements and employee skills
 */
export const calculateSkillMatch = async (taskSkills: string[], employeeSkills: string[]): Promise<number> => {
  try {
    // For simple skill matching, we'll continue to use the basic algorithm
    // For more complex matching, Gemini could be used here too
    const matchCount = employeeSkills.filter(skill => 
      taskSkills.some(taskSkill => 
        taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(taskSkill.toLowerCase())
      )
    ).length;
    
    return matchCount > 0 ? matchCount / Math.max(taskSkills.length, 1) : 0;
  } catch (error) {
    console.error('Error in skill matching:', error);
    // Fall back to simple calculation
    const matchCount = employeeSkills.filter(skill => 
      taskSkills.includes(skill)
    ).length;
    return matchCount > 0 ? matchCount / taskSkills.length : 0;
  }
};

/**
 * Recommend skills and resources for a given task using Gemini AI
 */
export const recommendSkillsAndResources = async (taskDescription: string): Promise<{
  skills: string[];
  resources: string[];
}> => {
  try {
    const prompt = `For the task described below, recommend the following:
    - Skills: A comma-separated list of skills required to complete the task.
    - Resources: A comma-separated list of resources required to complete the task.
    
    Task Description: ${taskDescription}
    
    Output format:
    - Skills: [Comma-separated list of skills]
    - Resources: [Comma-separated list of resources]`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    let skills: string[] = [];
    let resources: string[] = [];
    
    // Parse the skills and resources from the response
    const lines = generatedText.split('\n');
    for (const line of lines) {
      if (line.startsWith('- Skills:')) {
        const skillsText = line.substring('- Skills:'.length).trim();
        skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      } else if (line.startsWith('- Resources:')) {
        const resourcesText = line.substring('- Resources:'.length).trim();
        resources = resourcesText.split(',').map(r => r.trim()).filter(Boolean);
      }
    }
    
    return { skills, resources };
  } catch (error) {
    console.error('Error recommending skills and resources:', error);
    // Return empty arrays as fallback
    return { skills: [], resources: [] };
  }
};
