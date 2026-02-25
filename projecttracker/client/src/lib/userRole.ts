import { supabase } from '@/lib/supabase';

export async function fetchUserRole(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no results gracefully

    if (error) {
      console.error('Error fetching role:', error.message);
      return 'user'; // Default fallback role
    }

    if (!data) {
      console.log('No profile found for user, defaulting to user role');
      return 'user';
    }

    return data.role || 'user';
  } catch (err) {
    console.error('Unexpected error fetching user role:', err);
    return 'user';
  }
}

export async function createUserProfile(userId: string, email: string, role: string = 'user') {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        role: role,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error creating user profile:', err);
    return null;
  }
}