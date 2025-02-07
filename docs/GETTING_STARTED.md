# Getting Started with SocialEventory

This guide will help you set up and run SocialEventory locally for development.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A Supabase account
- A Mapbox account

## Installation Steps

1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd socialeventory
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create a `.env` file in the root directory with the following variables:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

4. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Tools

- **VS Code Extensions**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

- **Browser Extensions**
  - React Developer Tools
  - Redux DevTools

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and types
├── pages/           # Page components
├── services/        # API and external service integrations
└── styles/          # Global styles and Tailwind config
```

## Common Tasks

- **Running Tests**: `npm test`
- **Building for Production**: `npm run build`
- **Linting**: `npm run lint`
- **Type Checking**: `npm run typecheck`

## Troubleshooting

Common issues and their solutions:

1. **Build Errors**
   - Clear the `.cache` directory
   - Delete `node_modules` and run `npm install`

2. **Environment Variables**
   - Ensure all required env variables are set
   - Restart the dev server after changes

3. **Supabase Connection**
   - Verify credentials in `.env`
   - Check RLS policies

## Next Steps

- Review the [Architecture Overview](ARCHITECTURE.md)
- Check the [Contributing Guide](CONTRIBUTING.md)
- Explore the [API Documentation](API.md)