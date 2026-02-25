import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  console.log('Testing Supabase insert operation...');
  
  const userId = crypto.randomUUID();

  // First, let's check the table structure
  console.log('Checking profiles table structure...');
  const { data: tableData, error: tableError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (tableError) {
    console.error('Cannot access profiles table:', tableError);
    return;
  }
  
  console.log('Sample profile data:', tableData);
  
  // Test invites table
  console.log('\nTesting invites table...');
  const { data: inviteData, error: inviteError } = await supabase.from('invites').insert({
    email: 'test@example.com',
    role: 'user'
  });

  if (inviteError) {
    console.error('❌ Invite insert failed:', inviteError.message);
    console.error('Error details:', inviteError);
  } else {
    console.log('✅ Invite insert successful:', inviteData);
  }

  // Test profiles insert
  console.log('\nTesting profiles insert...');
  const { data, error } = await supabase.from('profiles').insert({
    id: userId,
    display_name: 'Visnec Media',
    role: 'user'
  });

  if (error) {
    console.error('❌ Profile insert failed:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Profile insert successful:', data);
  }
})();