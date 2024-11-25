import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Key:', supabaseServiceRoleKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase URL or Key in environment variables');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Test specific table access
async function testDatabaseAccess() {
  console.log('Testing database access...');
  
  try {
    // Test users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count');
    
    console.log('Users table access:', usersError ? 'Failed' : 'Success');
    if (usersError) console.error('Users error:', usersError);

    // Test url_analyses table
    const { data: analysesData, error: analysesError } = await supabase
      .from('url_analyses')
      .select('count');
    
    console.log('URL analyses table access:', analysesError ? 'Failed' : 'Success');
    if (analysesError) console.error('Analyses error:', analysesError);

  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabaseAccess();

export const testInsert = async () => {
  try {
    const { data, error } = await supabase
      .from('url_analyses')
      .insert([
        {
          user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
          url: 'https://test.com',
          threat_level: 'low',
          details: { test: true }
        }
      ]);

    console.log('Test insert result:', error ? 'Failed' : 'Success');
    if (error) console.error('Test insert error:', error);
    return { data, error };
  } catch (error) {
    console.error('Test insert exception:', error);
    return { data: null, error };
  }
};