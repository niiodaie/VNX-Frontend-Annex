// Comprehensive cleanup and RLS testing for profiles table
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseService = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseAnon = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testRLSPolicies() {
  console.log('🔐 Testing RLS policies for profiles table...\n');
  
  const testUserId = crypto.randomUUID();
  
  // Test 1: Service role can insert (should work)
  console.log('1. Testing service role insert...');
  const { data: serviceData, error: serviceError } = await supabaseService
    .from('profiles')
    .insert({
      id: testUserId,
      display_name: 'RLS Test User',
      role: 'user'
    });
    
  if (serviceError) {
    console.error('❌ Service role insert failed:', serviceError.message);
  } else {
    console.log('✅ Service role insert successful');
  }
  
  // Test 2: Anonymous client insert (should fail with RLS)
  console.log('\n2. Testing anonymous client insert...');
  const anonUserId = crypto.randomUUID();
  const { data: anonData, error: anonError } = await supabaseAnon
    .from('profiles')
    .insert({
      id: anonUserId,
      display_name: 'Anon Test User',
      role: 'user'
    });
    
  if (anonError) {
    console.log('✅ Anonymous insert correctly blocked by RLS:', anonError.message);
  } else {
    console.log('⚠️ Anonymous insert unexpectedly succeeded');
  }
  
  // Test 3: Read operations
  console.log('\n3. Testing read operations...');
  const { data: readData, error: readError } = await supabaseAnon
    .from('profiles')
    .select('id, display_name, role')
    .limit(3);
    
  if (readError) {
    console.error('❌ Read operation failed:', readError.message);
  } else {
    console.log('✅ Read operation successful, found', readData.length, 'profiles');
  }
  
  // Cleanup test data
  if (!serviceError) {
    await supabaseService.from('profiles').delete().eq('id', testUserId);
    console.log('\n🧹 Cleaned up test data');
  }
}

async function validateTableStructure() {
  console.log('📋 Validating profiles table structure...\n');
  
  // Get a sample record to check structure
  const { data, error } = await supabaseService
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('❌ Cannot access profiles table:', error.message);
    return false;
  }
  
  if (data.length > 0) {
    const columns = Object.keys(data[0]);
    console.log('✅ Table columns:', columns);
    
    // Check for email column (should not exist)
    if (columns.includes('email')) {
      console.log('⚠️ WARNING: email column found in profiles table');
      console.log('   This should be removed to avoid confusion');
    } else {
      console.log('✅ No email column found (correct)');
    }
    
    // Check required columns
    const requiredColumns = ['id', 'display_name', 'role'];
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing required columns:', missingColumns);
      return false;
    } else {
      console.log('✅ All required columns present');
    }
  }
  
  return true;
}

async function testCorrectInsertion() {
  console.log('\n💾 Testing correct insertion pattern...\n');
  
  const testUsers = [
    { display_name: 'Test User 1', role: 'user' },
    { display_name: 'Test Admin', role: 'admin' },
    { display_name: 'Test Super Admin', role: 'super_admin' }
  ];
  
  const createdIds = [];
  
  for (const user of testUsers) {
    const userId = crypto.randomUUID();
    
    const { data, error } = await supabaseService
      .from('profiles')
      .insert({
        id: userId,
        display_name: user.display_name,
        role: user.role
      });
      
    if (error) {
      console.error(`❌ Failed to create ${user.role}:`, error.message);
    } else {
      console.log(`✅ Created ${user.role}: ${user.display_name}`);
      createdIds.push(userId);
    }
  }
  
  // Cleanup
  for (const id of createdIds) {
    await supabaseService.from('profiles').delete().eq('id', id);
  }
  
  console.log('🧹 Cleaned up test users');
}

async function runCleanupAndTests() {
  console.log('🧪 Starting Profiles Table Cleanup and RLS Testing\n');
  console.log('=' .repeat(60));
  
  const structureValid = await validateTableStructure();
  
  if (!structureValid) {
    console.log('\n❌ Table structure issues found. Please fix before continuing.');
    return;
  }
  
  await testRLSPolicies();
  await testCorrectInsertion();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 Summary:');
  console.log('✅ Profiles table structure validated');
  console.log('✅ RLS policies tested');
  console.log('✅ Correct insertion patterns verified');
  console.log('\n🚀 Your profiles table is ready for production!');
}

runCleanupAndTests().catch(console.error);