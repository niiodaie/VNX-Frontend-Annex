import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  'https://eojnpjnlvscxtboimhln.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  console.log('Testing user-provided script...');
  
  const userId = crypto.randomUUID();

  const { data, error } = await supabase.from('profiles').insert({
    id: userId,
    email: 'visnecm@gmail.com', // This column doesn't exist
    display_name: 'Visnec Media',
    role: 'user'
  });

  if (error) {
    console.error('❌ Insert failed:', error.message);
    console.log('Expected error: email column does not exist in profiles table');
    
    // Now try the corrected version
    console.log('\nTrying corrected version...');
    const { data: correctedData, error: correctedError } = await supabase.from('profiles').insert({
      id: crypto.randomUUID(),
      display_name: 'Visnec Media',
      role: 'user'
    });
    
    if (correctedError) {
      console.error('❌ Corrected insert also failed:', correctedError.message);
    } else {
      console.log('✅ Corrected insert successful');
    }
  } else {
    console.log('✅ Insert successful:', data);
  }
})();