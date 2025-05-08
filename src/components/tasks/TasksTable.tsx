
import React, { useState } from 'react';
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
import { getWorkers } from '@/utils/workerUtils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TasksTableProps {
  tasks: Task[];
  showProject?: boolean;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, showProject = false }) => {
  const { resources, getProjectById, assignTask } = useProjects();
  // Track assigned tasks to trigger UI updates
  const [assignedTasks, setAssignedTasks] = useState<Record<string, string>>({});
  
  // Create a map of resource IDs to resource names
  const resourceNames = resources.reduce<Record<string, string>>((acc, resource) => {
    acc[resource.id] = resource.name;
    return acc;
  }, {});
  
  const handleAssignTask = async (taskId: string, projectId: string, userId: string, userName: string) => {
    await assignTask(taskId, projectId, userId, userName);
    
    // Update local state to ensure UI reflects the change immediately
    setAssignedTasks(prev => ({
      ...prev,
      [taskId]: userId || ""
    }));
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
              const isDescriptionTruncated = task.description && task.description.length > 50;
              
              // Use either the assigned value from state (if changed) or from the task data
              const currentAssigneeId = assignedTasks[task.id] !== undefined 
                ? assignedTasks[task.id] 
                : task.assignedTo;
                
              // Update assignee name based on the current assignee ID
              let assigneeName = "Unassigned";
              if (currentAssigneeId) {
                const workers = getWorkers();
                const worker = workers.find(w => w.id === currentAssigneeId);
                assigneeName = worker?.name || "Unknown";
              }
              
              return (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div>{task.title}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {isDescriptionTruncated ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="cursor-help text-left">
                              {task.description.substring(0, 50)}...
                            </TooltipTrigger>
                            <TooltipContent className="w-80">
                              <p className="text-sm">{task.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        task.description
                      )}
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
                    {assigneeName}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <TaskAssigneeSelect
                      currentAssigneeId={currentAssigneeId}
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
