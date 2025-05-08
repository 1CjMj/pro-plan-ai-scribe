
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  
  // Process resources to display either the resource name from resourceNames
  // or directly use resourceId if it's a plain string (from AI generation)
  const processedResources = resources.map(resource => {
    let displayName = resourceNames[resource.resourceId] || resource.resourceId;
    // If resourceId contains spaces or looks like a descriptive name, use it directly
    if (resource.resourceId && (resource.resourceId.includes(' ') || !resource.resourceId.startsWith('resource-'))) {
      displayName = resource.resourceId;
    }
    return {
      ...resource,
      displayName
    };
  });
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {displaySkills.map((skill, index) => (
          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            {skill}
          </Badge>
        ))}
        
        {hiddenSkillsCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-help">
                  +{hiddenSkillsCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {resources && resources.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {processedResources.slice(0, 2).map((resource, index) => (
            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
              {resource.displayName} ({resource.amount})
            </Badge>
          ))}
          
          {processedResources.length > 2 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-help">
                    +{processedResources.length - 2} more
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="w-auto max-w-xs">
                  <div className="text-sm">
                    <p className="font-medium mb-1">All resources:</p>
                    <div className="flex flex-wrap gap-1">
                      {processedResources.map((resource, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {resource.displayName} ({resource.amount})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSkillsDisplay;
