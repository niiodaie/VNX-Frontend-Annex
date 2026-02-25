import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useProjectTasks, useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APITask } from "@/lib/api";

interface ProjectBoardProps {
  projectId: number;
}

interface TaskFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export function ProjectBoard({ projectId }: ProjectBoardProps) {
  const { data: tasks = [], isLoading } = useProjectTasks(projectId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<string>("todo");
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  const columns = [
    { id: "todo", title: "To Do", bgColor: "bg-vnx-gray-100" },
    { id: "in_progress", title: "In Progress", bgColor: "bg-blue-50" },
    { id: "done", title: "Done", bgColor: "bg-green-50" }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    await createTask.mutateAsync({
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      projectId,
      status: newTaskColumn
    });
    
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
    setShowCreateDialog(false);
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      data: { status: newStatus as APITask["status"] }
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full p-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-vnx-gray-100 rounded-xl p-4 animate-pulse">
            <div className="h-6 bg-vnx-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2].map(j => (
                <div key={j} className="h-24 bg-white rounded-lg"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map(column => (
          <div key={column.id} className={`${column.bgColor} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-vnx-gray-900">{column.title}</h3>
              <span className="bg-vnx-gray-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {getTasksByStatus(column.id).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                />
              ))}
            </div>

            <Dialog 
              open={showCreateDialog && newTaskColumn === column.id} 
              onOpenChange={(open) => {
                setShowCreateDialog(open);
                if (open) setNewTaskColumn(column.id);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-2 border-dashed border-vnx-gray-300 text-vnx-gray-500 hover:text-vnx-blue hover:border-vnx-blue"
                  onClick={() => setNewTaskColumn(column.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Task Title</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Task description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Due Date (Optional)</label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateTask}
                      disabled={!newTask.title.trim() || createTask.isPending}
                    >
                      {createTask.isPending ? "Creating..." : "Create Task"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
