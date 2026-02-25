// Test Supabase Insert Operation
// Run this with: node test-supabase-insert.js

import { createClient } from '@supabase/supabase-js';

// Using your actual Supabase credentials
const supabase = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY // Use anon key for client operations
);

// For service role operations (backend)
const supabaseAdmin = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

async function testProfileInsert() {
  console.log('Testing profile insert with anon key...');
  
  // Generate proper UUID
  const userId = crypto.randomUUID();
  
  const { data, error } = await supabase.from('profiles').insert({
    id: userId,
    email: 'visnecm@gmail.com',
    display_name: 'Visnec Media', // Use display_name, not full_name
    role: 'user'
  });

  if (error) {
    console.error('❌ Insert failed with anon key:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Insert successful with anon key:', data);
  }
}

async function testProfileInsertAdmin() {
  console.log('\nTesting profile insert with service role key...');
  
  // Generate proper UUID
  const userId = crypto.randomUUID();
  
  const { data, error } = await supabaseAdmin.from('profiles').insert({
    id: userId,
    email: 'visnecm-admin@gmail.com',
    display_name: 'Visnec Media Admin',
    role: 'super_admin'
  });

  if (error) {
    console.error('❌ Insert failed with service role:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Insert successful with service role:', data);
  }
}

async function testInviteInsert() {
  console.log('\nTesting invite insert...');
  
  const { data, error } = await supabaseAdmin.from('invites').insert({
    email: 'test-invite@gmail.com',
    role: 'admin'
  });

  if (error) {
    console.error('❌ Invite insert failed:', error.message);
    console.error('Error details:', error);
  } else {
    console.log('✅ Invite insert successful:', data);
  }
}

async function checkTables() {
  console.log('\nChecking table structures...');
  
  // Check profiles table
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (profilesError) {
    console.error('❌ Cannot access profiles table:', profilesError.message);
  } else {
    console.log('✅ Profiles table accessible');
  }
  
  // Check invites table
  const { data: invites, error: invitesError } = await supabaseAdmin
    .from('invites')
    .select('*')
    .limit(1);
    
  if (invitesError) {
    console.error('❌ Cannot access invites table:', invitesError.message);
  } else {
    console.log('✅ Invites table accessible');
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Supabase RLS Tests\n');
  
  await checkTables();
  await testProfileInsert();
  await testProfileInsertAdmin();
  await testInviteInsert();
  
  console.log('\n🎯 Test Summary:');
  console.log('- If anon key insert fails: RLS policies need the fix from DATABASE_SETUP_INSTRUCTIONS.md');
  console.log('- If service role insert works: Your backend operations should work');
  console.log('- If invite insert works: Admin panel should work after RLS fix');
}

runTests().catch(console.error);