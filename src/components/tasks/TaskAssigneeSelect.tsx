
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { initialEmployees } from '@/contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';

interface TaskAssigneeSelectProps {
  currentAssigneeId?: string;
  onAssign: (userId: string, userName: string) => Promise<void>;
  disabled?: boolean;
}

const TaskAssigneeSelect = ({ currentAssigneeId, onAssign, disabled = false }: TaskAssigneeSelectProps) => {
  const { toast } = useToast();
  const [isAssigning, setIsAssigning] = React.useState(false);
  
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
        const employee = initialEmployees.find(emp => emp.id === userId);
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
    ? initialEmployees.find(emp => emp.id === currentAssigneeId)?.name || "Unknown"
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
        {initialEmployees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id}>
            {employee.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskAssigneeSelect;
