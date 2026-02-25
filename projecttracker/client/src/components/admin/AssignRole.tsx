import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserCog, Users } from 'lucide-react';

interface UserProfile {
  id: string;
  display_name?: string;
  role?: string;
}

export default function AssignRole() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  
  const roles = ['admin', 'moderator', 'user'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        setUsers([]);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, role');

      if (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a user and role',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', selectedUser);

      if (error) {
        console.error('Error updating role:', error);
        toast({
          title: 'Role Assignment Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        // Update local state to reflect the change
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === selectedUser 
              ? { ...user, role: selectedRole }
              : user
          )
        );
        
        toast({
          title: 'Role Updated',
          description: `User role successfully changed to ${selectedRole}`,
        });
        
        // Reset form
        setSelectedUser('');
        setSelectedRole('');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <UserCog className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold">Assign Role</h3>
      </div>
      
      {users.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Users
          </label>
          <input
            type="text"
            placeholder="Search by name or role"
            className="w-full p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select User
          </label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {filteredUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  <div className="flex flex-col">
                    <span>{user.display_name || user.id}</span>
                    <span className="text-xs text-gray-500">
                      Current: {user.role || 'user'}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Assign Role
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((roleOption) => (
                <SelectItem key={roleOption} value={roleOption}>
                  <div className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    <span className="capitalize">{roleOption}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAssign} 
          disabled={loading || !selectedUser || !selectedRole}
          className="w-full"
        >
          {loading ? (
            <>
              <UserCog className="h-4 w-4 mr-2 animate-pulse" />
              Assigning...
            </>
          ) : (
            <>
              <UserCog className="h-4 w-4 mr-2" />
              Assign Role
            </>
          )}
        </Button>

        {users.length === 0 && (
          <div className="text-center p-4 bg-gray-50 rounded">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}