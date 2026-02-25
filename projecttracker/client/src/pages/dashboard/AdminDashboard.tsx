import { useAuth } from '@/components/AuthProvider'
import AdminDashboard from '@/pages/AdminDashboard'

export default function DashboardAdmin() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard />
    </div>
  )
}