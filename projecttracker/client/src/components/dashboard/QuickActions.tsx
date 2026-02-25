import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Users } from 'lucide-react';
import { Link } from 'wouter';

export function QuickActions() {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/projects">
            <Button variant="outline" className="w-full justify-start h-auto p-4">
              <Plus className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Create Project</div>
                <div className="text-sm text-gray-600">Start a new project</div>
              </div>
            </Button>
          </Link>
          
          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <Clock className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Add Task</div>
              <div className="text-sm text-gray-600">Create a quick task</div>
            </div>
          </Button>
          
          <Button variant="outline" className="w-full justify-start h-auto p-4">
            <Users className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Invite Team</div>
              <div className="text-sm text-gray-600">Add team members</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}