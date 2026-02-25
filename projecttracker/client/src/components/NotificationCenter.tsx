import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Bell, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: number
  type: 'task_due' | 'project_update' | 'reminder' | 'achievement'
  title: string
  message: string
  read: boolean
  createdAt: string
  projectId?: number
  taskId?: number
}

export function NotificationCenter() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  // Mock notifications for now - would be real API in production
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async (): Promise<Notification[]> => {
      // Mock data - replace with real API call
      return [
        {
          id: 1,
          type: 'task_due',
          title: 'Task Due Soon',
          message: 'Complete website redesign is due in 2 hours',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          taskId: 1
        },
        {
          id: 2,
          type: 'achievement',
          title: 'Milestone Reached',
          message: 'You completed 10 tasks this week! 🎉',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
          id: 3,
          type: 'project_update',
          title: 'Project Progress',
          message: 'Mobile App Development is 75% complete',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          projectId: 1
        }
      ]
    },
    enabled: !!user
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      // Mock API call - would be real endpoint
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] })
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // Mock API call - would be real endpoint
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] })
    }
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_due':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'project_update':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
              >
                Mark all as read
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Stay updated with your project activities
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-96 overflow-y-auto space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`${notification.read ? 'opacity-60' : 'border-blue-200'}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}