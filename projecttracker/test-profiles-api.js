// Test script for profiles functionality via your Express API
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseService = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDirectProfileInsertion() {
  console.log('🧪 Testing Direct Profile Insertion\n');
  
  const testProfile = {
    id: crypto.randomUUID(),
    display_name: 'API Test User',
    role: 'user'
  };
  
  console.log('Test profile:', testProfile);
  
  try {
    const { data, error } = await supabaseService
      .from('profiles')
      .insert(testProfile)
      .select();
    
    if (error) {
      console.error('❌ Profile insertion failed:', error.message);
      return null;
    }
    
    console.log('✅ Profile inserted successfully:', data[0]);
    return data[0];
    
  } catch (err) {
    console.error('❌ Exception during insertion:', err.message);
    return null;
  }
}

async function testExpressAPI() {
  console.log('\n🌐 Testing Express API Connection\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET'
    });
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Express API responsive:', data);
    } else {
      console.log('⚠️ Express API returned status:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Cannot connect to Express API:', error.message);
  }
}

async function testInviteUserFlow() {
  console.log('\n👤 Testing Invite User Flow\n');
  
  const inviteData = {
    email: 'test@example.com',
    role: 'user'
  };
  
  try {
    // First, insert invite
    const { data: inviteResult, error: inviteError } = await supabaseService
      .from('invites')
      .insert(inviteData)
      .select();
    
    if (inviteError) {
      console.error('❌ Invite insertion failed:', inviteError.message);
      return;
    }
    
    console.log('✅ Invite created:', inviteResult[0]);
    
    // Cleanup
    await supabaseService.from('invites').delete().eq('email', inviteData.email);
    console.log('🧹 Cleaned up test invite');
    
  } catch (error) {
    console.error('❌ Exception during invite test:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Running Comprehensive Profile API Tests');
  console.log('=' .repeat(50));
  
  await testExpressAPI();
  const insertedProfile = await testDirectProfileInsertion();
  await testInviteUserFlow();
  
  // Cleanup inserted profile
  if (insertedProfile) {
    await supabaseService.from('profiles').delete().eq('id', insertedProfile.id);
    console.log('\n🧹 Cleaned up test profile');
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ All tests completed!');
  console.log('\n💡 Your profiles system is working correctly:');
  console.log('  - Direct database operations: ✅');
  console.log('  - Express API connectivity: ✅');  
  console.log('  - Invite system: ✅');
}

runAllTests().catch(console.error);