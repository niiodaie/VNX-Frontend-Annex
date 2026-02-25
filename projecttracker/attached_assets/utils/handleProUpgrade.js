const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function handleProUpgrade(userId) {
  const { error } = await supabase
    .from('users')
    .update({ is_pro: true })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update user as Pro:', error.message);
  } else {
    console.log(`User ${userId} upgraded to Pro.`);
  }
}

module.exports = { handleProUpgrade };
