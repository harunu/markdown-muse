/**
 * React Query configuration
 * Based on 10-frontend-integration.md
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false, // Internal tool - users control their own flow
    },
    mutations: {
      retry: 0, // Don't retry mutations (side effects)
    },
  },
});

/**
 * Query Key Convention:
 * ["properties"]                    → property list
 * ["properties", id]                → single property
 * ["properties", { filters }]       → filtered search results
 * ["search", "recent"]              → recent searches
 * ["search", "saved"]               → saved searches
 * ["dashboard", "stats"]            → dashboard stats
 * ["favorites"]                     → favorites list
 * ["import", importId, "status"]    → import job status
 * ["import", "history"]             → import history
 * ["ai", "analysis", ilanId]        → AI analysis result
 * ["ai", "compare", [...ilanIds]]   → AI comparison
 * ["ai", "chat", sessionId]         → chat session
 * ["auth", "me"]                    → current user
 */

export const queryKeys = {
  // Properties
  properties: {
    all: ['properties'] as const,
    detail: (id: number) => ['properties', id] as const,
    filtered: (filters: Record<string, unknown>) => ['properties', filters] as const,
  },

  // Search
  search: {
    recent: ['search', 'recent'] as const,
    saved: ['search', 'saved'] as const,
    results: (filters: Record<string, unknown>) => ['search', 'results', filters] as const,
  },

  // Dashboard
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },

  // Favorites
  favorites: {
    all: ['favorites'] as const,
  },

  // Import
  import: {
    history: ['import', 'history'] as const,
    status: (importId: string) => ['import', importId, 'status'] as const,
  },

  // AI
  ai: {
    analysis: (ilanId: number) => ['ai', 'analysis', ilanId] as const,
    compare: (ilanIds: number[]) => ['ai', 'compare', ilanIds] as const,
    chat: (sessionId: string) => ['ai', 'chat', sessionId] as const,
    sessions: ['ai', 'chat', 'sessions'] as const,
  },

  // Auth
  auth: {
    me: ['auth', 'me'] as const,
  },
};

export default queryClient;
