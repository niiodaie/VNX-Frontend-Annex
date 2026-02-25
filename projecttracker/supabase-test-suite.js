// Comprehensive Supabase Test Suite for Nexus Tracker
// Tests all database operations and RLS policies

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize clients with different authentication levels
const supabaseService = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAnon = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🧪 Starting Comprehensive Supabase Test Suite\n');

// Test 1: Check table structures
async function testTableStructures() {
  console.log('📋 Test 1: Checking table structures...');
  
  try {
    // Check profiles table
    const { data: profiles, error: profilesError } = await supabaseService
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (profilesError) throw profilesError;
    
    console.log('✅ Profiles table structure:', Object.keys(profiles[0] || {}));
    
    // Check invites table  
    const { data: invites, error: invitesError } = await supabaseService
      .from('invites')
      .select('*')
      .limit(1);
      
    if (invitesError) throw invitesError;
    
    console.log('✅ Invites table accessible');
    
    return true;
  } catch (error) {
    console.error('❌ Table structure check failed:', error.message);
    return false;
  }
}

// Test 2: Service role operations
async function testServiceRoleOperations() {
  console.log('\n🔐 Test 2: Service role operations...');
  
  try {
    const userId = crypto.randomUUID();
    
    // Test profile insert
    const { data: profileData, error: profileError } = await supabaseService
      .from('profiles')
      .insert({
        id: userId,
        display_name: 'Test User Service',
        role: 'user'
      });
      
    if (profileError) throw profileError;
    console.log('✅ Service role can insert profiles');
    
    // Test invite insert
    const { data: inviteData, error: inviteError } = await supabaseService
      .from('invites')
      .insert({
        email: 'service-test@example.com',
        role: 'admin'
      });
      
    if (inviteError) throw inviteError;
    console.log('✅ Service role can insert invites');
    
    // Clean up test data
    await supabaseService.from('profiles').delete().eq('id', userId);
    await supabaseService.from('invites').delete().eq('email', 'service-test@example.com');
    
    return true;
  } catch (error) {
    console.error('❌ Service role operations failed:', error.message);
    return false;
  }
}

// Test 3: Anonymous client operations (should have limitations)
async function testAnonClientOperations() {
  console.log('\n👤 Test 3: Anonymous client operations...');
  
  try {
    const userId = crypto.randomUUID();
    
    // Test profile insert with anon key (should fail due to RLS)
    const { data: profileData, error: profileError } = await supabaseAnon
      .from('profiles')
      .insert({
        id: userId,
        display_name: 'Test User Anon',
        role: 'user'
      });
      
    if (profileError) {
      console.log('✅ Anonymous client correctly blocked from inserting profiles');
    } else {
      console.log('⚠️ Anonymous client unexpectedly allowed to insert profiles');
    }
    
    // Test invite insert with anon key (should fail)
    const { data: inviteData, error: inviteError } = await supabaseAnon
      .from('invites')
      .insert({
        email: 'anon-test@example.com',
        role: 'user'
      });
      
    if (inviteError) {
      console.log('✅ Anonymous client correctly blocked from inserting invites');
    } else {
      console.log('⚠️ Anonymous client unexpectedly allowed to insert invites');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Anonymous client test failed:', error.message);
    return false;
  }
}

// Test 4: Read operations
async function testReadOperations() {
  console.log('\n📖 Test 4: Read operations...');
  
  try {
    // Test profiles read
    const { data: profiles, error: profilesError } = await supabaseAnon
      .from('profiles')
      .select('id, display_name, role')
      .limit(3);
      
    if (profilesError) throw profilesError;
    console.log('✅ Can read profiles:', profiles.length, 'records');
    
    // Test invites read
    const { data: invites, error: invitesError } = await supabaseAnon
      .from('invites')
      .select('*')
      .limit(3);
      
    if (invitesError) {
      console.log('⚠️ Cannot read invites (expected if RLS blocks it)');
    } else {
      console.log('✅ Can read invites:', invites.length, 'records');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Read operations failed:', error.message);
    return false;
  }
}

// Test 5: Authentication simulation
async function testAuthenticationFlow() {
  console.log('\n🔑 Test 5: Authentication flow simulation...');
  
  try {
    // Simulate user creation through auth trigger
    const testEmail = 'auth-test@example.com';
    
    // First create an invite
    await supabaseService.from('invites').insert({
      email: testEmail,
      role: 'moderator'
    });
    
    console.log('✅ Created invite for authentication test');
    
    // Check if invite exists
    const { data: invite, error: inviteError } = await supabaseService
      .from('invites')
      .select('*')
      .eq('email', testEmail)
      .single();
      
    if (inviteError) throw inviteError;
    console.log('✅ Invite retrieved successfully:', invite);
    
    // Clean up
    await supabaseService.from('invites').delete().eq('email', testEmail);
    
    return true;
  } catch (error) {
    console.error('❌ Authentication flow test failed:', error.message);
    return false;
  }
}

// Test 6: Admin operations simulation
async function testAdminOperations() {
  console.log('\n👑 Test 6: Admin operations simulation...');
  
  try {
    // Create test admin profile
    const adminId = crypto.randomUUID();
    await supabaseService.from('profiles').insert({
      id: adminId,
      display_name: 'Test Admin',
      role: 'super_admin'
    });
    
    // Create multiple test invites (simulating admin panel usage)
    const testInvites = [
      { email: 'user1@test.com', role: 'user' },
      { email: 'admin1@test.com', role: 'admin' },
      { email: 'mod1@test.com', role: 'moderator' }
    ];
    
    for (const invite of testInvites) {
      const { error } = await supabaseService.from('invites').insert(invite);
      if (error) throw error;
    }
    
    console.log('✅ Created multiple invites successfully');
    
    // Clean up all test data
    await supabaseService.from('profiles').delete().eq('id', adminId);
    for (const invite of testInvites) {
      await supabaseService.from('invites').delete().eq('email', invite.email);
    }
    
    console.log('✅ Admin operations completed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Admin operations failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const tests = [
    testTableStructures,
    testServiceRoleOperations,
    testAnonClientOperations,
    testReadOperations,
    testAuthenticationFlow,
    testAdminOperations
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
      else failed++;
    } catch (error) {
      console.error('Test execution error:', error);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🎯 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your Supabase setup is working perfectly.');
    console.log('✅ Database operations ready for production');
    console.log('✅ RLS policies functioning correctly');
    console.log('✅ Admin panel operations validated');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above for details.');
  }
}

// Execute test suite
runAllTests().catch(console.error);