import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const userId = crypto.randomUUID();

  const { data, error } = await supabase.from('profiles').insert({
    id: userId,
    email: 'visnecm@gmail.com',
    display_name: 'Visnec Media',
    role: 'user'
  });

  if (error) {
    console.error('❌ Insert failed:', error.message);
  } else {
    console.log('✅ Insert successful:', data);
  }
})();
