import { useEffect, useState } from 'react'
import { getUsers, updateUserRole, deleteUser, UserProfile as AdminUserProfile } from '@/lib/supabase-admin'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Users, Search, UserPlus, Settings, Trash2, Shield, User, Crown } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminUserPanel() {
  const [users, setUsers] = useState<AdminUserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<AdminUserProfile | null>(null)
  const [newRole, setNewRole] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await getUsers()
      
      if (error) {
        toast.error(`Failed to load users: ${(error as any)?.message || 'Unknown error'}`)
        return
      }
      
      setUsers(data)
      toast.success(`Loaded ${data.length} users`)
    } catch (error) {
      toast.error('Failed to connect to database')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    const loadingToast = toast.loading('Updating user role...')
    
    try {
      const { error } = await updateUserRole(userId, newRole)
      
      if (error) {
        toast.dismiss(loadingToast)
        toast.error(`Failed to update role: ${(error as any)?.message || 'Unknown error'}`)
        return
      }
      
      toast.dismiss(loadingToast)
      toast.success('User role updated successfully!')
      
      // Refresh users list
      await fetchUsers()
      setSelectedUser(null)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    const loadingToast = toast.loading('Deleting user...')
    
    try {
      const { error } = await deleteUser(userId)
      
      if (error) {
        toast.dismiss(loadingToast)
        toast.error(`Failed to delete user: ${(error as any)?.message || 'Unknown error'}`)
        return
      }
      
      toast.dismiss(loadingToast)
      toast.success(`User ${userName} deleted successfully`)
      
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to delete user')
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive'
      case 'admin': return 'default'
      case 'moderator': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-3 h-3" />
      case 'admin': return <Shield className="w-3 h-3" />
      case 'moderator': return <Settings className="w-3 h-3" />
      default: return <User className="w-3 h-3" />
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user accounts and roles in your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchUsers} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">
                        {user.display_name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {user.id.slice(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setNewRole(user.role)
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Update User Role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Change the role for {user.display_name}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => selectedUser && updateUserRole(selectedUser.id, newRole)}
                              >
                                Update Role
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.display_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteUser(user.id, user.display_name || 'Unknown User')}
                              >
                                Delete User
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-gray-500">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'super_admin').length}
            </div>
            <div className="text-sm text-gray-500">Super Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-500">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-gray-500">Regular Users</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}