
import React, { useState, useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { calculateSkillMatch } from '@/utils/ai';
import { getWorkers } from '@/utils/workerUtils';
import { useProjects } from '@/contexts/ProjectContext';

interface TaskAssigneeSelectProps {
  currentAssigneeId?: string;
  taskSkills: string[];
  onAssign: (userId: string, userName: string) => Promise<void>;
  disabled?: boolean;
}

const TaskAssigneeSelect = ({ 
  currentAssigneeId, 
  taskSkills, 
  onAssign, 
  disabled = false 
}: TaskAssigneeSelectProps) => {
  const { toast } = useToast();
  const [isAssigning, setIsAssigning] = useState(false);
  const { projects } = useProjects();
  
  // Get workers
  const workers = getWorkers();
  
  // Count actual tasks assigned to each employee from projects data
  const employeeTaskCount = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // Initialize counts for all workers
    workers.forEach(worker => {
      counts[worker.id] = 0;
    });
    
    // Count tasks assigned to each employee across all projects
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.assignedTo && counts[task.assignedTo] !== undefined) {
          counts[task.assignedTo]++;
        }
      });
    });
    
    return counts;
  }, [projects, workers]);

  // Generate recommendation scores for employees based on skills and workload
  const rankedEmployees = useMemo(() => {
    // Create a copy of employees with scores
    return [...workers].map(employee => {
      const taskCount = employeeTaskCount[employee.id] || 0;
      const workloadFactor = 1 / (1 + (taskCount * 0.2)); // Penalize employees with more tasks
      
      // Check if employee has at least one matching skill (simplified matching)
      const hasMatchingSkills = employee.skills.some(skill => 
        taskSkills.some(taskSkill => 
          taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(taskSkill.toLowerCase())
        )
      );
      
      // Count how many skills match
      const matchingSkillsCount = employee.skills.filter(skill => 
        taskSkills.some(taskSkill => 
          taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(taskSkill.toLowerCase())
        )
      ).length;
      
      // Calculate skill match ratio - how many of the task skills are matched
      const skillMatchRatio = taskSkills.length > 0 ? matchingSkillsCount / taskSkills.length : 0;
      
      return {
        ...employee,
        taskCount,
        workloadFactor,
        hasMatchingSkills,
        matchingSkillsCount,
        // Score prioritizes having at least one skill, then considers skill match ratio and workload
        score: hasMatchingSkills 
          ? (0.6 * skillMatchRatio + 0.4 * workloadFactor) 
          : (0.2 * workloadFactor) // Lower score if no skills match
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }, [taskSkills, workers, employeeTaskCount]);

  const handleAssigneeChange = async (userId: string) => {
    if (userId === currentAssigneeId) return;
    
    setIsAssigning(true);
    try {
      // Handle the special "unassigned" case
      if (userId === "unassigned") {
        await onAssign("", "");
        toast({
          title: "Task unassigned",
          description: "Task has been unassigned",
        });
      } else {
        const employee = workers.find(emp => emp.id === userId);
        if (employee) {
          await onAssign(userId, employee.name);
          toast({
            title: "Task reassigned",
            description: `Task has been reassigned to ${employee.name}`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Failed to reassign task",
        description: "An error occurred while reassigning the task.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };
  
  return (
    <Select 
      disabled={disabled || isAssigning}
      value={currentAssigneeId || "unassigned"} 
      onValueChange={handleAssigneeChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {rankedEmployees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name} {employee.hasMatchingSkills ? "★" : ""} 
            ({employee.taskCount} tasks)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskAssigneeSelect;
