# Phishing Detector Backend

Node.js Express backend for the Phishing URL Detector application.

## Features

- User authentication (JWT)
- URL analysis engine
- Supabase integration
- Security middleware
- Error handling

## Tech Stack

- Node.js
- Express
- TypeScript
- Supabase
- JWT Authentication

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
PORT=5000
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

3. Run development server:
`npm run dev`


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure
backend/
├── src/
│ ├── routes/ # API routes
│ ├── middleware/ # Middleware functions
│ ├── config/ # Configuration files
│ ├── types/ # TypeScript types
│ └── server.ts # Main server file
├── dist/ # Compiled JavaScript
└── tsconfig.json # TypeScript config


## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### URL Analysis
- `POST /api/analysis/analyze` - Analyze URL

## Environment Variables

- `PORT`: Server port
- `JWT_SECRET`: JWT signing secret
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

## Database Schema

### Users Table
CREATE TABLE public.users (
id UUID PRIMARY KEY,
email TEXT UNIQUE,
password TEXT,
created_at TIMESTAMP
);


### URL Analyses Table
CREATE TABLE public.url_analyses (
id UUID PRIMARY KEY,
user_id UUID REFERENCES users(id),
url TEXT,
threat_level TEXT,
details JSONB,
analyzed_at TIMESTAMP
);


## Deployment

The backend is deployed on Railway. Pushing to the main branch will trigger automatic deployment.

## Contributing

See main README for contribution guidelines.