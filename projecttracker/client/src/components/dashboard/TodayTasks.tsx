import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle } from 'lucide-react';
import { APITask, APIProject } from '@/lib/api';

interface TodayTasksProps {
  tasks: APITask[];
  projects: APIProject[] | undefined;
}

export function TodayTasks({ tasks, projects }: TodayTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Today's Tasks
        </CardTitle>
        <CardDescription>Tasks scheduled for today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const project = projects?.find(p => p.id === task.projectId);
            const priorityColors = {
              high: 'border-red-500',
              medium: 'border-yellow-500',
              low: 'border-green-500'
            };
            const dueTime = task.dueDate ? new Date(task.dueDate).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }) : '';
            
            return (
              <div key={task.id} className={`flex items-center space-x-3 p-3 border rounded-lg ${
                task.status === 'done' ? 'bg-green-50' : 'hover:bg-gray-50'
              }`}>
                {task.status === 'done' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <div className={`w-4 h-4 border-2 rounded ${priorityColors[task.priority]}`}></div>
                )}
                <div className="flex-1">
                  <h4 className={`font-medium ${task.status === 'done' ? 'text-green-800' : ''}`}>
                    {task.title}
                  </h4>
                  <p className={`text-sm ${task.status === 'done' ? 'text-green-600' : 'text-gray-600'}`}>
                    {project?.name} • {task.priority} priority
                  </p>
                </div>
                <div className={`text-xs ${task.status === 'done' ? 'text-green-500' : 'text-gray-500'}`}>
                  {task.status === 'done' ? 'Done' : `Due ${dueTime}`}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <p>No tasks due today</p>
            <p className="text-sm">Great job staying on top of things!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}