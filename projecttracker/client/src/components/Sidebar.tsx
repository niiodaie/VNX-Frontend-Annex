import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { Link, useLocation } from "wouter";
import { Plus, Folder, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "@/hooks/useProjects";
import { useAuth } from "@/components/AuthProvider";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { data: projects = [], isLoading } = useProjects();
  const { userRole } = useAuth();
  const createProject = useCreateProject();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) return;
    
    await createProject.mutateAsync({
      name: newProject.name,
      description: newProject.description || undefined,
    });
    
    setNewProject({ name: "", description: "" });
    setShowCreateDialog(false);
  };

  const sidebarContent = (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-vnx-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-vnx-blue to-vnx-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VNX</span>
          </div>
          <h1 className="text-xl font-semibold text-vnx-gray-900">Nexus Tracker</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/">
          <div className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
            location === "/" 
              ? "bg-vnx-blue text-white" 
              : "text-vnx-gray-700 hover:bg-vnx-gray-100"
          )}>
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Dashboard
          </div>
        </Link>

        <Link href="/projects">
          <div className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
            location === "/projects" 
              ? "bg-vnx-blue text-white" 
              : "text-vnx-gray-700 hover:bg-vnx-gray-100"
          )}>
            <Folder className="mr-3 h-5 w-5" />
            All Projects
          </div>
        </Link>

        <Link href="/project-planning">
          <div className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
            location === "/project-planning" 
              ? "bg-vnx-blue text-white" 
              : "text-vnx-gray-700 hover:bg-vnx-gray-100"
          )}>
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Project Planning
          </div>
        </Link>

        <Link href="/analytics">
          <div className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
            location === "/analytics" 
              ? "bg-vnx-blue text-white" 
              : "text-vnx-gray-700 hover:bg-vnx-gray-100"
          )}>
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Analytics
          </div>
        </Link>

        <Link href="/account">
          <div className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
            location === "/account" 
              ? "bg-vnx-blue text-white" 
              : "text-vnx-gray-700 hover:bg-vnx-gray-100"
          )}>
            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            My Account
          </div>
        </Link>

        {/* Admin Navigation */}
        {(userRole === 'admin' || userRole === 'super_admin') && (
          <>
            <div className="pt-4 pb-2">
              <div className="h-px bg-vnx-gray-200"></div>
            </div>
            
            <Link href="/admin-dashboard">
              <div className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                location === "/admin-dashboard" 
                  ? "bg-blue-600 text-white" 
                  : "text-blue-600 hover:bg-blue-50"
              )}>
                <Users className="mr-3 h-5 w-5" />
                Admin Dashboard
              </div>
            </Link>

            {userRole === 'super_admin' && (
              <Link href="/admin">
                <div className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                  location === "/admin" 
                    ? "bg-red-600 text-white" 
                    : "text-red-600 hover:bg-red-50"
                )}>
                  <Shield className="mr-3 h-5 w-5" />
                  Super Admin Panel
                </div>
              </Link>
            )}
          </>
        )}
        
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-vnx-gray-500 uppercase tracking-wider mb-3">Projects</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-vnx-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {projects.map(project => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div 
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer",
                      location === `/project/${project.id}`
                        ? "bg-vnx-gray-100 text-vnx-gray-900"
                        : "text-vnx-gray-700 hover:bg-vnx-gray-100"
                    )}
                    onClick={onClose}
                  >
                    <div 
                      className="mr-3 h-2 w-2 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="flex-1 truncate">{project.name}</span>
                    <span className="ml-auto text-xs text-vnx-gray-500">
                      {/* Task count would go here */}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <button className="w-full text-vnx-gray-500 hover:text-vnx-blue hover:bg-vnx-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg border-2 border-dashed border-vnx-gray-300">
              <Plus className="mr-3 h-5 w-5" />
              New Project
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Project description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject}
                  disabled={!newProject.name.trim() || createProject.isPending}
                >
                  {createProject.isPending ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </nav>

      {/* User Profile */}
      <div className="flex-shrink-0 p-4 border-t border-vnx-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-vnx-blue rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">DU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-vnx-gray-900 truncate">Demo User</p>
            <p className="text-xs text-vnx-gray-500 truncate">demo@nexustracker.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-vnx-gray-200">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-vnx-gray-200 transform transition-transform duration-200 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
