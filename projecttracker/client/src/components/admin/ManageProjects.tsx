import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import InviteUser from "./InviteUser";
import AssignRole from "./AssignRole";
import TaskSummaryCard from "./TaskSummaryCard";

interface Project {
  id: string;
  name: string;
}

export default function ManageProjects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data);
    }
  };

  const fetchUserRole = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!error && data?.role) {
      setUserRole(data.role);

      // Redirect if not super admin
      if (data.role !== "super_admin") {
        toast.error("Access denied. Super admin privileges required.");
        setLocation("/dashboard");
      } else {
        fetchProjects();
      }
    }
  };

  const handleCreate = async () => {
    if (!newProject.trim()) {
      toast.error("Project name cannot be empty");
      return;
    }
    const { error } = await supabase.from("projects").insert({ name: newProject });
    if (error) {
      console.error(error);
      toast.error("Failed to create project.");
    } else {
      toast.success("Project created successfully!");
      setNewProject("");
      fetchProjects();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast.error("Failed to delete project.");
    } else {
      toast.success("Project deleted.");
      fetchProjects();
    }
  };

  if (userRole !== "super_admin" && userRole !== "") {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          You do not have sufficient permissions to access this page. Please contact a Super Admin.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold mb-4">Manage Projects</h2>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${userRole === 'super_admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {userRole === 'super_admin' ? 'Super Admin' : 'User'}
        </span>
      </div>

      <TaskSummaryCard />

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="New project name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <button
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleCreate}
        >
          Create Project
        </button>
      </div>

      <ul className="divide-y">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between py-2">
            <span>{project.name}</span>
            <button
              onClick={() => handleDelete(project.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Invite Users</h2>
        <InviteUser />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Assign Roles</h2>
        <AssignRole />
      </div>
    </div>
  );
}