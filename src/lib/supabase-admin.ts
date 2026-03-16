import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a function to get the admin client to avoid crashing at build time
export const getSupabaseAdmin = () => {
    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase admin credentials missing (URL or Service Role Key)');
    }
    return createClient<Database>(supabaseUrl, supabaseServiceKey);
};

// For backward compatibility but safe-guarded
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
    ? createClient<Database>(supabaseUrl, supabaseServiceKey) 
    : null as any;
