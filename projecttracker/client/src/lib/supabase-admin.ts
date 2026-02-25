import { supabase } from '@/lib/supabase'

export interface UserProfile {
  id: string
  display_name: string
  role: string
  created_at: string
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, created_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching users:', error)
      return { data: [], error }
    }
    
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Unexpected error fetching users:', error)
    return { data: [], error }
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
    
    if (error) {
      console.error('Error updating user role:', error)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error updating user role:', error)
    return { data: null, error }
  }
}

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
    
    if (error) {
      console.error('Error deleting user:', error)
      return { data: null, error }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error deleting user:', error)
    return { data: null, error }
  }
}

export async function getUserStats() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
    
    if (error) {
      console.error('Error fetching user stats:', error)
      return { stats: {}, error }
    }
    
    const stats = (data || []).reduce((acc: Record<string, number>, user: { role: string }) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})
    
    return { stats, error: null }
  } catch (error) {
    console.error('Unexpected error fetching user stats:', error)
    return { stats: {}, error }
  }
}