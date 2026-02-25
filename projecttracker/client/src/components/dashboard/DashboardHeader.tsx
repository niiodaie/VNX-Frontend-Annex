interface DashboardHeaderProps {
  user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {user?.user_metadata?.first_name || 'there'}!
      </h1>
      <p className="text-gray-600 mt-2">Here's what's happening with your projects today.</p>
    </div>
  );
}