# Architecture Overview

## Frontend Architecture

### Core Technologies
- React + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn UI for component library
- React Query for data fetching
- React Router for navigation
- Framer Motion for animations
- React Window for virtualization

### Directory Structure
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

### Key Components
- **EventCard**: Displays event information in a card format
- **EventMap**: Shows events on an interactive map
- **VirtualizedEventList**: Efficiently renders large lists of events
- **SearchFilters**: Handles event filtering and search
- **Navigation**: Manages app routing and navigation

## Backend Architecture (Supabase)

### Database Schema
- **events**: Main events table
- **profiles**: User profiles and preferences
- **comments**: Event comments
- **event_likes**: Event likes tracking
- **event_attendees**: Event attendance tracking

### Security
- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication flow

### API Layer
- RESTful endpoints
- Real-time subscriptions
- Edge Functions for custom logic

## Performance Optimizations
- Virtualized list rendering
- Image lazy loading
- Efficient data caching
- Debounced search
- Map marker clustering

## State Management
- React Query for server state
- Context API for global UI state
- Local state for component-specific data

## Testing Strategy
- Unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Cypress

## Deployment
- CI/CD pipeline
- Environment configuration
- Performance monitoring
- Error tracking