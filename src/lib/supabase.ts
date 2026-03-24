import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjrpqadkvpekazszgegf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcnBxYWRrdnBla2F6c3pnZWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NTYyMTYsImV4cCI6MjA4NzMzMjIxNn0.JAUwao-6FkEaiIMryE6FF4NfPsO8WA0wG-CcC8z-zns';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
