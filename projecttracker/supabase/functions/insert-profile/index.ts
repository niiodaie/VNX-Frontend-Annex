import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    'https://eojnpjnlvscxtboimhln.supabase.co',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { id, display_name, role } = await req.json();

    // Validate required fields
    if (!id || !display_name || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id, display_name, role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate role values
    const validRoles = ['user', 'admin', 'super_admin'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be: user, admin, or super_admin' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase.from('profiles').insert([
      { id, display_name, role }
    ]).select();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid request or JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});