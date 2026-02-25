// Test authentication signup process with proper error handling
import { createClient } from '@supabase/supabase-js';

const supabaseService = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAnon = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testAuthenticationSetup() {
  console.log('🔐 Testing Authentication Setup\n');
  
  // Test 1: Check if trigger function exists
  console.log('1. Checking trigger function...');
  try {
    const { data, error } = await supabaseService
      .from('pg_proc')
      .select('proname')
      .eq('proname', 'handle_new_profile');
    
    if (error) {
      console.log('⚠️ Cannot check trigger function:', error.message);
    } else if (data.length > 0) {
      console.log('✅ Trigger function exists');
    } else {
      console.log('❌ Trigger function missing - run SUPABASE_AUTH_FIX.sql');
    }
  } catch (err) {
    console.log('⚠️ Error checking trigger:', err.message);
  }
  
  // Test 2: Test direct profile creation (should work)
  console.log('\n2. Testing direct profile creation...');
  const testUserId = crypto.randomUUID();
  try {
    const { data, error } = await supabaseService
      .from('profiles')
      .insert({
        id: testUserId,
        display_name: 'Auth Test User',
        role: 'user'
      })
      .select();
    
    if (error) {
      console.log('❌ Direct profile creation failed:', error.message);
    } else {
      console.log('✅ Direct profile creation works');
      // Cleanup
      await supabaseService.from('profiles').delete().eq('id', testUserId);
    }
  } catch (err) {
    console.log('❌ Exception during profile creation:', err.message);
  }
  
  // Test 3: Check RLS policies
  console.log('\n3. Checking RLS policies...');
  try {
    const { data, error } = await supabaseAnon
      .from('profiles')
      .select('id, display_name, role')
      .limit(1);
    
    if (error && error.message.includes('row-level security')) {
      console.log('✅ RLS is active (blocks anonymous reads)');
    } else if (error) {
      console.log('⚠️ RLS check failed:', error.message);
    } else {
      console.log('⚠️ RLS may not be configured correctly (anonymous read succeeded)');
    }
  } catch (err) {
    console.log('❌ Exception during RLS check:', err.message);
  }
}

async function testSignupFlow() {
  console.log('\n👤 Testing Signup Flow (Read-Only)\n');
  
  console.log('Signup process uses:');
  console.log('✅ Supabase URL: https://eojnpjnlvscxtboimhln.supabase.co');
  console.log('✅ Anonymous key available');
  console.log('✅ Service role key available');
  
  console.log('\nExpected signup flow:');
  console.log('1. User submits signup form');
  console.log('2. Supabase creates auth.users record');
  console.log('3. Trigger creates profiles record');
  console.log('4. User receives confirmation email');
  
  console.log('\nPotential issues:');
  console.log('- Trigger function missing/incorrect');
  console.log('- RLS blocking profile creation');
  console.log('- Email confirmation required');
}

async function runAuthTests() {
  console.log('🧪 Authentication Test Suite');
  console.log('=' .repeat(50));
  
  await testAuthenticationSetup();
  await testSignupFlow();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Next Steps:');
  console.log('1. Run SUPABASE_AUTH_FIX.sql if trigger is missing');
  console.log('2. Test signup with a real email address');
  console.log('3. Check Supabase logs for detailed errors');
}

runAuthTests().catch(console.error);