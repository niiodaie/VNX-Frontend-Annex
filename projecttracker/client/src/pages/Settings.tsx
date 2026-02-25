import React, { useState } from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Clock, 
  Database, 
  Zap,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Mail,
  Smartphone
} from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useToast } from '@/hooks/use-toast'

export default function Settings() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      projectUpdates: true,
      weeklyReports: false,
      sound: true,
      soundVolume: [75]
    },
    appearance: {
      theme: 'light',
      compactMode: false,
      showProfilePictures: true,
      animationsEnabled: true,
      fontSize: 'medium'
    },
    productivity: {
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekStart: 'monday',
      autoArchiveCompleted: true,
      focusMode: false,
      pomodoroTimer: 25
    },
    privacy: {
      profileVisibility: 'private',
      shareAnalytics: false,
      dataRetention: '1year',
      exportData: false
    }
  })

  const handleSave = async () => {
    try {
      // In a real app, this would save to the backend
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleReset = () => {
    // Reset to defaults
    toast({
      title: 'Settings reset',
      description: 'All settings have been reset to their default values.',
    })
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-gray-600">Customize your Nexus Tracker experience</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-medium">Notification Types</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Task Reminders</span>
                  </div>
                  <Switch
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, taskReminders: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Project Updates</span>
                  </div>
                  <Switch
                    checked={settings.notifications.projectUpdates}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, projectUpdates: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Weekly Reports</span>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, weeklyReports: checked }
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Notifications</Label>
                    <p className="text-sm text-gray-600">Play sounds for notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.sound}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, sound: checked }
                      }))
                    }
                  />
                </div>

                {settings.notifications.sound && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Volume
                      </Label>
                      <span className="text-sm text-gray-600">{settings.notifications.soundVolume[0]}%</span>
                    </div>
                    <Slider
                      value={settings.notifications.soundVolume}
                      onValueChange={(value) =>
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, soundVolume: value }
                        }))
                      }
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, theme: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={settings.appearance.fontSize}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, fontSize: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, compactMode: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-gray-600">Enable smooth transitions and effects</p>
                </div>
                <Switch
                  checked={settings.appearance.animationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, animationsEnabled: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Productivity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Productivity
              </CardTitle>
              <CardDescription>
                Configure your work preferences and productivity features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Work Start Time</Label>
                  <Input
                    type="time"
                    value={settings.productivity.workingHours.start}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        productivity: {
                          ...prev.productivity,
                          workingHours: { ...prev.productivity.workingHours, start: e.target.value }
                        }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Work End Time</Label>
                  <Input
                    type="time"
                    value={settings.productivity.workingHours.end}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        productivity: {
                          ...prev.productivity,
                          workingHours: { ...prev.productivity.workingHours, end: e.target.value }
                        }
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Week Starts On</Label>
                <Select
                  value={settings.productivity.weekStart}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      productivity: { ...prev.productivity, weekStart: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pomodoro Timer (minutes)</Label>
                <Input
                  type="number"
                  min="15"
                  max="60"
                  value={settings.productivity.pomodoroTimer}
                  onChange={(e) =>
                    setSettings(prev => ({
                      ...prev,
                      productivity: { ...prev.productivity, pomodoroTimer: parseInt(e.target.value) }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-archive Completed Tasks</Label>
                  <p className="text-sm text-gray-600">Automatically archive tasks after 30 days</p>
                </div>
                <Switch
                  checked={settings.productivity.autoArchiveCompleted}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      productivity: { ...prev.productivity, autoArchiveCompleted: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Focus Mode</Label>
                  <p className="text-sm text-gray-600">Hide distractions during work sessions</p>
                </div>
                <Switch
                  checked={settings.productivity.focusMode}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      productivity: { ...prev.productivity, focusMode: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Retention</Label>
                <Select
                  value={settings.privacy.dataRetention}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, dataRetention: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Analytics</Label>
                  <p className="text-sm text-gray-600">Help improve Nexus Tracker with anonymous usage data</p>
                </div>
                <Switch
                  checked={settings.privacy.shareAnalytics}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, shareAnalytics: checked }
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label className="text-base font-medium">Data Management</Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Export Your Data</p>
                    <p className="text-sm text-gray-600">Download a copy of all your data</p>
                  </div>
                  <Button variant="outline">
                    Export Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}