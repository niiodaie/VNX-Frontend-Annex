// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xuptevcpwsuxckuhsnwr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // 🔐 wrap in quotes

export const supabase = createClient(supabaseUrl, supabaseKey);
