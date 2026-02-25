import { useMemo } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Layout } from '@/components/Layout';
import { Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardHeader, StatsGrid, RecentProjects, TodayTasks, QuickActions } from '@/components/dashboard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AIHelper } from '@/components/AIHelper';
import WelcomeBanner from '@/components/WelcomeBanner';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  // Get all tasks across projects for dashboard metrics
  const { data: allTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks/all'],
    queryFn: async () => {
      if (!projects?.length) return [];
      const taskPromises = projects.map(project => api.getProjectTasks(project.id));
      const taskArrays = await Promise.all(taskPromises);
      return taskArrays.flat();
    },
    enabled: !!projects?.length,
  });

  const stats = useMemo(() => {
    if (!projects || !allTasks) return { activeProjects: 0, completedTasks: 0, pendingTasks: 0, productivity: 0 };
    
    const completedTasks = allTasks.filter(task => task.status === 'done').length;
    const pendingTasks = allTasks.filter(task => task.status !== 'done').length;
    const productivity = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;
    
    return {
      activeProjects: projects.length,
      completedTasks,
      pendingTasks,
      productivity
    };
  }, [projects, allTasks]);

  const todayTasks = useMemo(() => {
    if (!allTasks) return [];
    const today = new Date().toISOString().split('T')[0];
    return allTasks.filter(task => task.dueDate?.startsWith(today)).slice(0, 3);
  }, [allTasks]);

  const recentProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }, [projects]);

  if (projectsLoading || tasksLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 p-6">
        <WelcomeBanner />
        <div className="mt-6">
          <StatsGrid stats={stats} todayTasksCount={todayTasks.length} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <RecentProjects projects={recentProjects} allTasks={allTasks} />
          <TodayTasks tasks={todayTasks} projects={projects} />
          <div className="space-y-6">
            <ActivityFeed />
            <AIHelper />
          </div>
        </div>

        <QuickActions />
      </div>
    </Layout>
  );
};

export default Dashboard;