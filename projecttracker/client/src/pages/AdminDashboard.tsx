import { Layout } from '@/components/Layout'
import InviteUser from '@/components/admin/InviteUser'
import AssignRole from '@/components/admin/AssignRole'
import ManageProjects from '@/components/admin/ManageProjects'
import EdgeFunctionTest from '@/components/admin/EdgeFunctionTest'
import AdminUserPanel from '@/components/AdminUserPanel'
import { useAuth } from '@/components/AuthProvider'
import { useEffect } from 'react'
import { useLocation } from 'wouter'

export default function AdminDashboard() {
  const { userRole, loading } = useAuth()
  const [, setLocation] = useLocation()

  useEffect(() => {
    if (!loading && userRole !== 'admin' && userRole !== 'super_admin') {
      setLocation('/') // redirect home
    }
  }, [userRole, loading, setLocation])

  // Show loading while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Redirect if not admin
  if (userRole !== 'admin' && userRole !== 'super_admin') {
    return null
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">Current Role:</p>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium capitalize">
                {userRole}
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {/* Enhanced User Management Panel */}
            <AdminUserPanel />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-3">Invite User</h2>
                <InviteUser />
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-3">Assign Role</h2>
                <AssignRole />
              </div>
              <div className="col-span-1 md:col-span-2 bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-3">Manage Projects</h2>
                <ManageProjects />
              </div>
              {userRole === 'super_admin' && (
                <div className="col-span-1 md:col-span-2 bg-white p-4 rounded shadow">
                  <h2 className="font-semibold mb-3">Edge Function Testing</h2>
                  <EdgeFunctionTest />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}