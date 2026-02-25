import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xuptevcpwsuxckuhsnwr.supabase.co";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
export const supabase = createClient(supabaseUrl, supabaseKey);
