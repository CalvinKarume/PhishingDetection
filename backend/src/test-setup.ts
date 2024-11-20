import dotenv from 'dotenv';
import { supabase, testConnection } from './config/database';

async function runTests() {
    console.log('🚀 Starting backend tests...\n');

    // 1. Test Environment Variables
    try {
        console.log('📝 Checking environment variables...');
        const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
        
        for (const varName of requiredVars) {
            if (!process.env[varName]) {
                throw new Error(`Missing ${varName}`);
            }
        }
        console.log('✅ Environment variables verified\n');
    } catch (error) {
        console.error('❌ Environment variable check failed:', error);
        return false;
    }

    // 2. Test Database Connection
    try {
        console.log('🔌 Testing database connection...');
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error('Database connection failed');
        }
        console.log('✅ Database connection successful\n');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }

    // 3. Test Basic Query
    try {
        console.log('🔍 Testing basic query...');
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .single();

        if (error) throw error;
        console.log('✅ Query successful\n');
    } catch (error) {
        console.error('❌ Query failed:', error);
        return false;
    }

    return true;
}

// Run all tests
runTests()
    .then(success => {
        if (success) {
            console.log('✨ All tests passed successfully!');
            process.exit(0);
        } else {
            console.error('❌ Some tests failed');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });