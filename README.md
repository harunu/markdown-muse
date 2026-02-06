# AI Emlak Asistani - Frontend

React + TypeScript frontend for the AI Real Estate Assistant platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Query** - Server state management
- **React Router** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20)
- npm or bun

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |

## Docker

### Build Docker Image

```bash
docker build -t emlak-frontend .
```

### Run with Docker

```bash
docker run -p 80:80 emlak-frontend
```

### Run with Docker Compose (Recommended)

From the project root:

```bash
# Development mode with hot reloading
docker compose -f docker-compose.dev.yml up frontend

# Production mode
docker compose up frontend
```

## Project Structure

```
src/
├── assets/           # Static assets (images)
├── components/
│   ├── internal/     # Internal app components
│   └── ui/           # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx   # Authentication state
├── hooks/
│   ├── useApi.ts     # React Query hooks
│   └── use-toast.ts  # Toast notifications
├── lib/
│   ├── api-client.ts # Axios instance
│   ├── query-client.ts # React Query config
│   └── utils.ts      # Utility functions
├── pages/
│   ├── Login.tsx
│   ├── internal/     # Protected pages
│   │   ├── Dashboard.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ListingsPage.tsx
│   │   ├── ListingDetailPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── ImportPage.tsx
│   │   └── SettingsPage.tsx
│   └── admin/        # Admin pages
├── types/
│   └── api.ts        # TypeScript interfaces
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Pages

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/login` | Login page | No |
| `/dashboard` | Dashboard with stats | Yes |
| `/search` | AI-powered search | Yes |
| `/listings` | Property list | Yes |
| `/listings/:id` | Property detail | Yes |
| `/favorites` | Saved favorites | Yes |
| `/compare` | Compare properties | Yes |
| `/import` | CSV import | Yes |
| `/settings` | User settings | Yes |
| `/admin/*` | Admin pages | Yes (Admin only) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## API Integration

The frontend uses React Query for data fetching and caching. All API calls are made through the centralized API client.

### Example Usage

```tsx
import { useDashboardStats, useSearch } from '@/hooks/useApi';

// Fetch dashboard stats
const { data, isLoading, error } = useDashboardStats();

// Search properties
const searchMutation = useSearch();
const handleSearch = async (query: string) => {
  const results = await searchMutation.mutateAsync({
    sorgu: query,
    sayfa: 1,
  });
};
```

## Authentication

JWT authentication is handled by `AuthContext`. Tokens are stored in localStorage and automatically refreshed.

```tsx
import { useAuth } from '@/contexts/AuthContext';

const { user, login, logout, isAuthenticated } = useAuth();
```

## Health Check

The frontend exposes a health check at `/health`:

```bash
curl http://localhost/health
```

Response:
```json
{"status":"healthy"}
```

## Testing

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Linting

```bash
npm run lint
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run linting and tests
4. Submit a pull request

## License

Proprietary - Internal use only.
