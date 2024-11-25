import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { authenticateToken } from '../middleware/auth';
import { User, DecodedToken } from '../types';

const router = express.Router();

console.log('Auth routes initialized');

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('1. Register endpoint hit');
    console.log('2. Request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('3. Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('4. Checking if user exists');
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.log('5. Error checking user:', checkError);
      return res.status(500).json({ message: 'Error checking user existence' });
    }

    if (existingUser) {
      console.log('6. User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('7. Hashing password');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('8. Creating new user');
    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        { email, password: hashedPassword }
      ])
      .select()
      .single();

    if (createError) {
      console.log('9. Error creating user:', createError);
      return res.status(500).json({ message: 'Error creating user', error: createError.message });
    }

    console.log('10. User created:', newUser);

    // Generate JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email 
      } as DecodedToken,
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_2024',
      { expiresIn: '24h' }
    );

    console.log('11. Registration successful');
    
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('Login attempt for:', req.body.email); // Debug log
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    console.log('User found:', user ? 'Yes' : 'No'); // Debug log

    if (userError || !user) {
      console.log('User error:', userError); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword); // Debug log

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      } as DecodedToken,
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_2024',
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', email); // Debug log

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
});

// Add the profile route
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

export default router;