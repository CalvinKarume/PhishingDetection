# Phishing Detector Frontend

React TypeScript frontend for the Phishing URL Detector application.

## Features

- User authentication interface
- URL analysis form
- Real-time analysis results display
- Responsive design
- Protected routes
- Error handling

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Fetch API

## Getting Started

1. Install dependencies: `npm install`

2. Create `.env` file:
REACT_APP_API_URL=your_backend_url
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

3. Run development server:
npm run dev


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Project Structure
frontend/
├── src/
│ ├── components/ # React components
│ ├── services/ # API services
│ ├── types/ # TypeScript types
│ ├── config/ # Configuration files
│ ├── styles/ # CSS styles
│ └── App.tsx # Main app component
├── public/ # Static files
└── index.html # HTML template


## Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_SUPABASE_URL`: Supabase URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase anon key

## Deployment

The frontend is deployed on Vercel. Pushing to the main branch will trigger automatic deployment.

## Contributing

See main README for contribution guidelines.