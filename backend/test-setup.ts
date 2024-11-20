import dotenv from 'dotenv';
dotenv.config();

console.log('🧪 Starting backend test setup...');

// First, let's check if our environment variables are loaded
console.log('\n📋 Checking environment variables...');
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing environment variables:', missingEnvVars);
  process.exit(1);
}

console.log('✅ Environment variables loaded');

// Now test the database connection
import { supabase } from './config/database';

async function testConnection() {
  try {
    console.log('\n📦 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
    console.log('\n✨ Initial test complete!');
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
