// Environment variables for the frontend
const env = {
    // API URL defaults to localhost if not provided
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    
    // Environment name
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Optional: Supabase public URL and key if needed on frontend
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY
  };
  
  // Validate required environment variables
  const requiredVars = ['API_URL'];
  
  for (const varName of requiredVars) {
    if (!env[varName as keyof typeof env]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }
  
  export default env;