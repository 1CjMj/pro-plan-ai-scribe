/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateProjectStatus = (projects: any[], projectId: string, status: string) => {
  return projects.map((project) =>
    project.id === projectId
      ? { ...project, status, updatedAt: new Date().toISOString() }
      : project
  );
};

export const deleteProject = (projects: any[], projectId: string) => {
  return projects.filter((project) => project.id !== projectId);
};