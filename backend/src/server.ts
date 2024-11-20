import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import analysisRoutes from './routes/analysis';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug route to test server
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes - add console log to debug
console.log('Setting up auth routes...');
app.use('/api/auth', authRoutes);
console.log('Setting up analysis routes...');
app.use('/api/analysis', analysisRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/analysis/analyze');
});

export default app;