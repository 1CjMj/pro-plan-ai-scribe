
import { ProjectStatus } from '@/contexts/ProjectContext';

/**
 * Utility function to update a project's status
 */
export const updateProjectStatus = async (projectId: string, status: ProjectStatus): Promise<void> => {
  // This would typically be an API call to a backend service
  // For now, we just return a resolved promise
  return Promise.resolve();
};

/**
 * Utility function to delete a project
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  // This would typically be an API call to a backend service
  // For now, we just return a resolved promise
  return Promise.resolve();
};
