import { useState } from "react";
import { Layout } from "@/components/Layout";
import { TabNavigation } from "@/components/TabNavigation";
import { ProjectBoard } from "@/components/ProjectBoard";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Plus, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: projects = [], isLoading } = useProjects();
  const [activeTab, setActiveTab] = useState("overview");

  if (projects.length > 0) {
    // Redirect to first project if projects exist
    return (
      <Layout>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-vnx-gray-900 mb-4">
                Welcome to Nexus Tracker
              </h1>
              <p className="text-lg text-vnx-gray-600 mb-6">
                Your simplified project management solution
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: project.color }}
                          />
                          <span>{project.name}</span>
                        </CardTitle>
                        <Folder className="w-5 h-5 text-vnx-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-vnx-gray-600 mb-4">
                        {project.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-vnx-gray-500">
                        <span>Click to open</span>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {/* Create Project Card */}
              <Card className="border-2 border-dashed border-vnx-gray-300 hover:border-vnx-blue transition-colors">
                <CardContent className="flex flex-col items-center justify-center h-full py-12">
                  <Plus className="w-8 h-8 text-vnx-gray-400 mb-4" />
                  <h3 className="font-medium text-vnx-gray-700 mb-2">Create New Project</h3>
                  <p className="text-sm text-vnx-gray-500 text-center">
                    Start organizing your work with a new project
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-vnx-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <Folder className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-vnx-gray-900 mb-4">
            Welcome to Nexus Tracker
          </h1>
          
          <p className="text-vnx-gray-600 mb-8">
            Get started by creating your first project. Organize tasks, collaborate with AI, and stay on top of your deadlines.
          </p>
          
          <Button className="bg-vnx-blue text-white hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      </div>
    </Layout>
  );
}
