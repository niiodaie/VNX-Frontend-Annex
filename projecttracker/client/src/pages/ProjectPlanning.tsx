import { Layout } from '@/components/Layout';
import TryOncePlanner from '@/components/TryOncePlanner';
import ProjectPlanner from '@/components/ProjectPlanner';
import { usePlan } from '@/hooks/usePlan';
import { useAuth } from '@/components/AuthProvider';

export default function ProjectPlanningPage() {
  const { isPremium } = usePlan();
  const { user } = useAuth();

  return (
    <Layout>
      {/* Show TryOncePlanner for non-premium users, full ProjectPlanner for premium */}
      {user && isPremium ? <ProjectPlanner /> : <TryOncePlanner />}
    </Layout>
  );
}