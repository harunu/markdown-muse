/**
 * API hooks for React Query integration
 * Based on 10-frontend-integration.md
 * Updated to use English API response keys
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import {
  DashboardStats,
  RecentSearch,
  SavedSearch,
  Property,
  PropertySummary,
  PaginatedResponse,
  SearchRequest,
  Favorite,
  AIAnalysis,
  AIComparison,
  ImportStatus,
  User,
  ProfileUpdate,
  PreferencesUpdate,
  ChangePasswordRequest,
} from '@/types/api';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
      return response.data.data;
    },
  });
};

export const useRecentSearches = () => {
  return useQuery({
    queryKey: queryKeys.search.recent,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; results: RecentSearch[] }>('/search/recent');
      return response.data.results;
    },
  });
};

// Properties hooks
export const useProperties = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: params ? queryKeys.properties.filtered(params) : queryKeys.properties.all,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean } & PaginatedResponse<PropertySummary>>('/properties', { params });
      return {
        results: response.data.results,
        total: response.data.total,
        page: response.data.page,
        total_pages: response.data.total_pages,
      };
    },
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Property }>(`/properties/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.post('/properties', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

// Search hooks
export const useSearch = () => {
  return useMutation({
    mutationFn: async (request: SearchRequest) => {
      const response = await apiClient.post<{
        success: boolean;
        results: PropertySummary[];
        total: number;
        page: number;
        total_pages: number;
        search_type: string;
      }>('/search/', request);
      return response.data;
    },
  });
};

export const useSaveSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { query?: string; filters?: Record<string, unknown>; result_count: number; name: string }) => {
      const response = await apiClient.post('/search/save', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.saved });
    },
  });
};

export const useSavedSearches = () => {
  return useQuery({
    queryKey: queryKeys.search.saved,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; results: SavedSearch[] }>('/search/saved');
      return response.data.results;
    },
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; results: Favorite[] }>('/favorites/');
      return response.data.results;
    },
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: number) => {
      const response = await apiClient.post('/favorites/', { property_id: propertyId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: number) => {
      await apiClient.delete(`/favorites/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
};

export const useUpdateFavoriteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, note }: { propertyId: number; note: string }) => {
      const response = await apiClient.patch(`/favorites/${propertyId}/note`, { note });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    },
  });
};

// AI hooks
export const useAiAnalysis = (propertyId: number) => {
  return useQuery({
    queryKey: queryKeys.ai.analysis(propertyId),
    queryFn: async () => {
      const response = await apiClient.post<{ success: boolean; analysis: AIAnalysis; cached?: boolean }>('/ai/analyze', { property_id: propertyId });
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (cached on backend)
  });
};

export const useAiComparison = () => {
  return useMutation({
    mutationFn: async (propertyIds: number[]) => {
      const response = await apiClient.post<{ success: boolean; comparison: AIComparison }>('/ai/compare', { property_ids: propertyIds });
      return response.data;
    },
  });
};

export const useAiChat = () => {
  return useMutation({
    mutationFn: async (data: {
      message: string;
      session_id?: string;
      context_type?: 'property' | 'search' | 'comparison' | 'general';
      context_data?: Record<string, unknown>;
    }) => {
      const response = await apiClient.post<{ success: boolean; session_id: string; response: string }>('/ai/chat', data);
      return response.data;
    },
  });
};

// Import hooks
export const useImportHistory = () => {
  return useQuery({
    queryKey: queryKeys.import.history,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; results: ImportStatus[] }>('/import/history');
      return response.data.results;
    },
  });
};

export const useImportStatus = (importId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.import.status(importId),
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: ImportStatus }>(`/import/${importId}/status`);
      return response.data.data;
    },
    enabled: enabled && !!importId,
    refetchInterval: (query) => {
      const data = query.state.data as ImportStatus | undefined;
      // Stop polling when complete or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
};

export const useUploadCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<{ success: boolean; import_id: string }>('/import/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.import.history });
    },
  });
};

export const useConfirmImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (importId: string) => {
      const response = await apiClient.post(`/import/${importId}/confirm`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.import.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
};

// Admin stats hook
export const useBulkStatusUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, status }: { ids: number[]; status: 'active' | 'inactive' | 'draft' }) => {
      const response = await apiClient.post('/properties/bulk-action', {
        action: 'update_status',
        property_ids: ids,
        new_status: status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          stats: {
            total_listings: number;
            active_listings: number;
            today_updated: number;
            quality_issues: number;
          };
          city_breakdown: { city: string; count: number }[];
          time_series: { name: string; value: number }[];
          recent_imports: {
            id: string;
            file_name: string;
            status: string;
            total_rows: number;
            valid_rows: number;
            error_rows: number;
            created_at: string;
          }[];
        };
      }>('/admin/stats');
      return response.data.data;
    },
  });
};

export const useReportsSummary = () => {
  return useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          stats: { total_listings: number; avg_price_per_sqm: number; city_count: number };
          city_breakdown: { city: string; count: number; avg_price: number; color: string }[];
          district_breakdown: { city: string; count: number; avg_price: number; color: string }[];
          monthly_trend: { month: string; count: number }[];
        };
      }>('/reports/summary');
      return response.data.data;
    },
  });
};

// User/Profile hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; user: User }>('/auth/me');
      return response.data.user;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileUpdate) => {
      const response = await apiClient.patch('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PreferencesUpdate) => {
      const response = await apiClient.patch('/auth/preferences', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.post('/auth/change-password', data);
      return response.data;
    },
  });
};
