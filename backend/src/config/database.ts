import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Configure dotenv with the correct path
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});

// Verify environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Required environment variables: SUPABASE_URL and SUPABASE_ANON_KEY must be defined');
}

// Create Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count').single();
    if (error) {
      console.error('Database connection error:', error.message);
      return false;
    }
    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Unexpected error connecting to Supabase:', error);
    return false;
  }
};