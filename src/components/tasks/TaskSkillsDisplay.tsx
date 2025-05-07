
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface TaskSkillsDisplayProps {
  skills: string[];
  resources?: { resourceId: string; amount: number }[];
  resourceNames?: Record<string, string>;
  maxDisplay?: number;
}

const TaskSkillsDisplay = ({ 
  skills, 
  resources = [], 
  resourceNames = {}, 
  maxDisplay = 3 
}: TaskSkillsDisplayProps) => {
  const displaySkills = skills.slice(0, maxDisplay);
  const hiddenSkillsCount = Math.max(0, skills.length - maxDisplay);
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {displaySkills.map((skill, index) => (
          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            {skill}
          </Badge>
        ))}
        
        {hiddenSkillsCount > 0 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-help">
                +{hiddenSkillsCount} more
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="max-w-xs">
              <div className="text-sm">
                <p className="font-medium mb-1">All skills:</p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
      
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {resources.slice(0, 2).map((resource, index) => (
            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
              {resourceNames[resource.resourceId] || 'Resource'} ({resource.amount})
            </Badge>
          ))}
          
          {resources.length > 2 && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-help">
                  +{resources.length - 2} more
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="max-w-xs">
                <div className="text-sm">
                  <p className="font-medium mb-1">All resources:</p>
                  <div className="flex flex-wrap gap-1">
                    {resources.map((resource, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {resourceNames[resource.resourceId] || 'Resource'} ({resource.amount})
                      </Badge>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSkillsDisplay;
