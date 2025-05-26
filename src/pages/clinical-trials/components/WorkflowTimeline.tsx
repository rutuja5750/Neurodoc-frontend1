import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  status: string;
  label: string;
  timestamp?: string;
  user?: string;
  isCurrent?: boolean;
}

interface WorkflowTimelineProps {
  currentStatus: string;
  steps: Step[];
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ currentStatus, steps }) => {
  const getStepStatus = (step: Step) => {
    if (step.isCurrent) return 'current';
    const currentIndex = steps.findIndex(s => s.status === currentStatus);
    const stepIndex = steps.findIndex(s => s.status === step.status);
    return stepIndex < currentIndex ? 'completed' : 'upcoming';
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      
      <div className="space-y-8">
        {steps.map((step) => {
          const status = getStepStatus(step);
          
          return (
            <div key={step.status} className="relative flex items-start">
              <div className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-border">
                {status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : status === 'current' ? (
                  <Clock className="h-4 w-4 text-blue-500 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              
              <div className="ml-12">
                <div className="flex items-center space-x-2">
                  <h3 className={cn(
                    "text-sm font-medium",
                    status === 'completed' && "text-green-600",
                    status === 'current' && "text-blue-600",
                    status === 'upcoming' && "text-muted-foreground"
                  )}>
                    {step.label}
                  </h3>
                  {status === 'current' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  )}
                </div>
                
                {step.timestamp && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.timestamp}
                  </p>
                )}
                
                {step.user && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    By {step.user}
                  </p>
                )}
                
                {status === 'current' && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                    <p className="text-sm text-blue-800">
                      This document is currently being processed. You can track its progress here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTimeline; 