import { Loader2, Search, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentStatus } from '@/hooks/useChatStream';

interface AgentProgressProps {
  status: AgentStatus | null;
  className?: string;
}

const stageIcons = {
  initializing: Loader2,
  thinking: Brain,
  searching: Search,
  processing: Loader2,
  finalizing: CheckCircle,
};

const stageColors = {
  initializing: 'text-blue-500',
  thinking: 'text-purple-500',
  searching: 'text-green-500',
  processing: 'text-yellow-500',
  finalizing: 'text-emerald-500',
};

export const AgentProgress = ({ status, className }: AgentProgressProps) => {
  if (!status) return null;

  const Icon = stageIcons[status.stage];
  const colorClass = stageColors[status.stage];

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl",
      "backdrop-blur-xl bg-card/60 border border-border/50",
      "shadow-lg animate-fade-in",
      className
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        "bg-gradient-to-br from-primary/20 to-primary/10",
        "border border-primary/20"
      )}>
        <Icon className={cn("w-4 h-4", colorClass, {
          "animate-spin": status.stage === 'initializing' || status.stage === 'processing'
        })} />
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {status.message}
        </p>
        {status.tool && (
          <p className="text-xs text-muted-foreground mt-1">
            Using {status.tool}
          </p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1">
        {Object.keys(stageIcons).map((stage, index) => {
          const isActive = stage === status.stage;
          const isCompleted = Object.keys(stageIcons).indexOf(status.stage) > index;
          
          return (
            <div
              key={stage}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isActive && "bg-primary scale-125",
                isCompleted && "bg-primary/60",
                !isActive && !isCompleted && "bg-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
