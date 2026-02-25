import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen } from 'lucide-react';
import { Link } from 'wouter';
import { APIProject, APITask } from '@/lib/api';

interface RecentProjectsProps {
  projects: APIProject[];
  allTasks: APITask[] | undefined;
}

export function RecentProjects({ projects, allTasks }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Projects
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>Your most recently active projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => {
            const projectTasks = allTasks?.filter(task => task.projectId === project.id) || [];
            const completedTasks = projectTasks.filter(task => task.status === 'done').length;
            const progressPercentage = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
            const lastUpdated = new Date(project.updatedAt).toLocaleDateString();
            
            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: project.color }}></div>
                  <div className="flex-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">{projectTasks.length} tasks • Updated {lastUpdated}</p>
                  </div>
                  <div className="text-sm text-gray-500">{progressPercentage}%</div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FolderOpen className="h-8 w-8 mx-auto mb-2" />
            <p>No projects yet</p>
            <Link href="/projects">
              <Button variant="outline" size="sm" className="mt-2">
                Create your first project
              </Button>  
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}