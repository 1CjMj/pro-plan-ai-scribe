
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useProjects, Task, Resource } from '@/contexts/ProjectContext';
import TaskSkillsDisplay from './TaskSkillsDisplay';
import TaskAssigneeSelect from './TaskAssigneeSelect';
import { Badge } from '@/components/ui/badge';

interface TasksTableProps {
  tasks: Task[];
  showProject?: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, showProject = false }) => {
  const { resources, getProjectById, assignTask } = useProjects();
  
  // Create a map of resource IDs to resource names
  const resourceNames = resources.reduce<Record<string, string>>((acc, resource) => {
    acc[resource.id] = resource.name;
    return acc;
  }, {});
  
  const handleAssignTask = async (taskId: string, projectId: string, userId: string, userName: string) => {
    await assignTask(taskId, projectId, userId, userName);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Task</TableHead>
            {showProject && <TableHead>Project</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Skills & Resources</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showProject ? 6 : 5} className="h-24 text-center">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const project = getProjectById(task.projectId);
              
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div>{task.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {task.description}
                    </div>
                  </TableCell>
                  
                  {showProject && (
                    <TableCell>
                      {project?.title || "Unknown Project"}
                    </TableCell>
                  )}
                  
                  <TableCell>
                    {task.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Completed
                      </Badge>
                    )}
                    {task.status === 'in-progress' && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        In Progress
                      </Badge>
                    )}
                    {task.status === 'not-started' && (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                        Not Started
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <TaskSkillsDisplay 
                      skills={task.skills} 
                      resources={task.resources} 
                      resourceNames={resourceNames}
                    />
                  </TableCell>
                  
                  <TableCell>
                    {task.assignedToName || "Unassigned"}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <TaskAssigneeSelect
                      currentAssigneeId={task.assignedTo}
                      taskSkills={task.skills}
                      onAssign={(userId, userName) => 
                        handleAssignTask(task.id, task.projectId, userId, userName)
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksTable;
