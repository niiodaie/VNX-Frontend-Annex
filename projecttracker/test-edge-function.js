// Test script for the insert-profile Edge Function
import crypto from 'crypto';

async function testEdgeFunction() {
  console.log('🧪 Testing insert-profile Edge Function\n');
  
  // Check environment variables
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    console.log('Add this to your Replit Secrets:');
    console.log('Key: SUPABASE_SERVICE_ROLE_KEY');
    console.log('Value: your-service-role-key-here');
    return;
  }
  
  console.log('✅ Service role key found');
  
  // Test data
  const testProfile = {
    id: crypto.randomUUID(),
    display_name: 'Edge Function Test User',
    role: 'user'
  };
  
  console.log('\n📤 Testing profile creation...');
  console.log('Test data:', testProfile);
  
  try {
    // Replace with your actual Edge Function URL when deployed
    const edgeFunctionUrl = 'https://eojnpjnlvscxtboimhln.supabase.co/functions/v1/insert-profile';
    
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`
      },
      body: JSON.stringify(testProfile)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Edge Function test successful!');
      console.log('Response:', result);
    } else {
      console.log('⚠️ Edge Function returned error:');
      console.log('Status:', response.status);
      console.log('Error:', result);
    }
    
  } catch (error) {
    console.log('❌ Network error calling Edge Function:');
    console.log(error.message);
    console.log('\nNote: This is expected if the Edge Function is not yet deployed.');
    console.log('Deploy it using: supabase functions deploy insert-profile');
  }
}

async function validateEnvironment() {
  console.log('🔧 Environment Validation\n');
  
  const requiredEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value) {
      console.log(`✅ ${envVar}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${envVar}: Missing`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
}

async function main() {
  await validateEnvironment();
  await testEdgeFunction();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Add SUPABASE_SERVICE_ROLE_KEY to Replit Secrets');
  console.log('2. Deploy Edge Function: supabase functions deploy insert-profile');
  console.log('3. Test the deployed function with this script');
}

main().catch(console.error);