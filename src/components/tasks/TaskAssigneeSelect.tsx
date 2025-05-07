
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
  
  // Get workers
  const workers = getWorkers();
  
  // Generate recommendation scores for employees based on skills and workload
  const rankedEmployees = useMemo(() => {
    // Function to count tasks per employee
    const getEmployeeTaskCount = (employeeId: string): number => {
      // This is a simplified approach, ideally we'd get this from context
      return workers.reduce((count, emp) => 
        emp.id === employeeId ? count + 1 : count, 0);
    };

    // Create a copy of employees with scores
    return [...workers].map(employee => {
      const taskCount = getEmployeeTaskCount(employee.id);
      const workloadFactor = 1 / (1 + (taskCount * 0.2)); // Penalize employees with more tasks
      
      // Calculate preliminary skill match (will be updated asynchronously)
      const hasMatchingSkills = employee.skills.some(skill => 
        taskSkills.some(taskSkill => 
          taskSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(taskSkill.toLowerCase())
        )
      );
      
      return {
        ...employee,
        taskCount,
        workloadFactor,
        hasMatchingSkills,
        // Initial score based on workload and simple skill matching
        score: hasMatchingSkills ? workloadFactor * 1.5 : workloadFactor
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  }, [taskSkills, workers]);

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
  
  // Get the current assignee name
  const currentAssigneeName = currentAssigneeId 
    ? workers.find(emp => emp.id === currentAssigneeId)?.name || "Unknown"
    : "Unassigned";
  
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
