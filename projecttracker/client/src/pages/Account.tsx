import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Layout } from '@/components/Layout'
import { useAuth } from '@/components/AuthProvider'
import { useProjects } from '@/hooks/useProjects'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { User, Crown, Settings, CreditCard, Globe, Edit, Loader2, BarChart3, Trash2 } from 'lucide-react'
import { RoleBadge } from '@/components/RoleBadge'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Account() {
  const { t } = useTranslation()
  const { user, signOut, userRole, isPremium } = useAuth()
  const { toast } = useToast()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { data: projects } = useProjects()

  // Get user statistics
  const { data: userStats } = useQuery({
    queryKey: ['/api/user/stats'],
    queryFn: async () => {
      if (!projects?.length) return { totalProjects: 0, totalTasks: 0, completedTasks: 0 };
      const taskPromises = projects.map(project => api.getProjectTasks(project.id));
      const taskArrays = await Promise.all(taskPromises);
      const allTasks = taskArrays.flat();
      
      return {
        totalProjects: projects.length,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(task => task.status === 'done').length,
      };
    },
    enabled: !!projects,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
      company: user?.user_metadata?.company || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          company: data.company,
        }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditingProfile(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Note: Account deletion would need to be implemented on the backend
        toast({
          title: 'Info',
          description: 'Please contact support to delete your account',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to delete account',
          variant: 'destructive',
        });
      }
    }
  };

  const userPlan = user?.user_metadata?.plan || 'free';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

  if (!user) {
    return (
      <Layout>
        <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user.user_metadata?.first_name ? 
                  `${user.user_metadata.first_name} ${user.user_metadata?.last_name || ''}`.trim() : 
                  'My Profile'
                }
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-slate-100 px-2 py-1 rounded font-medium">
                  {userRole}
                </span>
                <RoleBadge size="sm" showIcon />
              </div>
            </div>
          </div>
          <Badge variant={userPlan === 'free' ? 'secondary' : 'default'}>
            {userPlan === 'free' ? 'Free Plan' : 
             userPlan === 'pro' ? 'Pro Plan' : 
             'Premium Plan'}
          </Badge>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Projects</p>
                  <p className="text-xl font-bold">{userStats?.totalProjects || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-xl font-bold">{userStats?.totalTasks || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold">{userStats?.completedTasks || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Update your personal information and email preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingProfile ? (
                <>
                  <div>
                    <Label>First Name</Label>
                    <p className="text-sm mt-1">{user.user_metadata?.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <p className="text-sm mt-1">{user.user_metadata?.last_name || 'Not set'}</p>
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <p className="text-sm mt-1">{user.email}</p>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <p className="text-sm mt-1">{user.user_metadata?.company || 'Not set'}</p>
                  </div>
                </>
              ) : (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" size="sm">
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Manage your current plan and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Plan</span>
                <Badge variant={userPlan === 'free' ? 'secondary' : 'default'}>
                  {userPlan === 'free' ? 'Free' : 
                   userPlan === 'pro' ? 'Pro' : 
                   'Premium'}
                </Badge>
              </div>
              
              {userPlan === 'free' && (
                <div className="p-4 bg-blue-50 rounded-lg border">
                  <p className="text-sm text-blue-800 mb-2">
                    Upgrade to unlock premium features like unlimited projects, AI assistance, and advanced analytics.
                  </p>
                  <Button size="sm" className="w-full">
                    Upgrade Plan
                  </Button>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p>Member since: {memberSince}</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure your account security and password settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-600">Change your account password</p>
                </div>
                <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsChangingPassword(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Change Password
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-gray-600">
                    {user.email_confirmed_at ? 'Email verified' : 'Email not verified'}
                  </p>
                </div>
                <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'}>
                  {user.email_confirmed_at ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Configure your language and regional settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Use the language switcher in the header to change your language preference.
                </p>
              </div>
              <div>
                <Label>Timezone</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>
              </div>
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-gray-600 mt-1">
                  Light mode (Dark mode coming soon)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible and destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-gray-600">
                  Permanently delete your account and all associated data including projects, tasks, and AI conversations.
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-gray-600">
                  Sign out of your account on this device.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}