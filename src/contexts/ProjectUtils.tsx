import { useContext } from 'react';
import { ProjectContext } from './ProjectContext'; // Adjust the path as needed

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

// Define or import updateProjectStatusUtil
const updateProjectStatusUtil = () => {
  // Add your implementation here
};

export { updateProjectStatusUtil };