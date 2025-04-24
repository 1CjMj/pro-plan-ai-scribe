
import { pipeline } from '@huggingface/transformers';
import type { Task, Project } from '@/contexts/ProjectContext';

let taskGenerator: any = null;
let skillMatcher: any = null;

export const initializeAIModels = async () => {
  try {
    taskGenerator = await pipeline('text-generation', 'distilgpt2');
    skillMatcher = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2');
    return true;
  } catch (error) {
    console.error('Error initializing AI models:', error);
    return false;
  }
};

export const generateTasksFromText = async (description: string, category: string): Promise<Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">[]> => {
  if (!taskGenerator) {
    throw new Error('Task generator model not initialized');
  }

  const prompt = `Generate project tasks for a ${category} project: ${description}\nTasks:`;
  
  try {
    const result = await taskGenerator(prompt, {
      max_length: 500,
      num_return_sequences: 1,
      temperature: 0.7,
    });

    const tasksText = result[0].generated_text.split('\n').filter(Boolean);
    
    return tasksText.map((text: string) => ({
      title: text.trim(),
      description: `Auto-generated task: ${text.trim()}`,
      status: 'not-started' as const,
      skills: ['AI Generated'],
      estimatedHours: 8,
      resources: [],
      createdBy: 'ai' as const,
    }));
  } catch (error) {
    console.error('Error generating tasks:', error);
    // Return a single fallback task if AI generation fails
    return [{
      title: "Review project requirements",
      description: `Fallback task: Review ${category} project requirements for "${description.substring(0, 30)}..."`,
      status: 'not-started' as const,
      skills: ['Planning'],
      estimatedHours: 4,
      resources: [],
      createdBy: 'ai' as const,
    }];
  }
};

export const calculateSkillMatch = async (taskSkills: string[], employeeSkills: string[]): Promise<number> => {
  if (!skillMatcher) {
    throw new Error('Skill matcher model not initialized');
  }

  try {
    // Get embeddings for both skill sets
    const taskEmbeddings = await skillMatcher(taskSkills.join(', '));
    const employeeEmbeddings = await skillMatcher(employeeSkills.join(', '));

    // Calculate cosine similarity between embeddings
    const similarity = cosineSimilarity(taskEmbeddings[0], employeeEmbeddings[0]);
    return similarity;
  } catch (error) {
    console.error('Error calculating skill match:', error);
    // Fallback to a simple text matching approach
    const matchCount = employeeSkills.filter(skill => 
      taskSkills.some(taskSkill => 
        taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(taskSkill.toLowerCase())
      )
    ).length;
    
    return matchCount > 0 ? matchCount / Math.max(taskSkills.length, 1) : 0;
  }
};

// Helper function to calculate cosine similarity
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (norm1 * norm2);
}
