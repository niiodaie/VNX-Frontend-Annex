import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { APITask } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: APITask;
  onClick?: () => void;
  onStatusChange?: (status: string) => void;
}

export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  const statusColors = {
    todo: "bg-gray-100",
    in_progress: "bg-blue-50",
    done: "bg-green-50"
  };

  return (
    <Card 
      className={cn(
        "p-4 mb-3 shadow-sm border border-vnx-gray-200 hover:shadow-md transition-shadow cursor-pointer",
        statusColors[task.status as keyof typeof statusColors],
        task.status === "done" && "opacity-75"
      )}
      onClick={onClick}
    >
      <h4 className="font-medium text-vnx-gray-900 mb-2">{task.title}</h4>
      
      {task.description && (
        <p className="text-sm text-vnx-gray-600 mb-3">{task.description}</p>
      )}

      {task.status === "in_progress" && task.progress !== undefined && (
        <div className="w-full bg-vnx-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-vnx-blue h-2 rounded-full transition-all duration-300" 
            style={{ width: `${task.progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-vnx-blue rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">U</span>
          </div>
          {task.dueDate && (
            <span className="text-xs text-vnx-gray-500">
              Due {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge 
            variant="secondary"
            className={priorityColors[task.priority as keyof typeof priorityColors]}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          
          {task.status === "done" && (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
}
