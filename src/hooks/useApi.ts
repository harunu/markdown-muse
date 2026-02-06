/**
 * API hooks for React Query integration
 * Based on 10-frontend-integration.md
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { queryKeys } from '@/lib/query-client';
import {
  DashboardStats,
  SonArama,
  KaydedilenArama,
  Ilan,
  IlanOzet,
  PaginatedResponse,
  AramaIstegi,
  Favori,
  AiAnaliz,
  AiKarsilastirma,
  ImportDurum,
  Kullanici,
  ProfilGuncelle,
  TercihlerGuncelle,
  SifreDegistirRequest,
} from '@/types/api';

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; veri: DashboardStats }>('/dashboard/stats');
      return response.data.veri;
    },
  });
};

export const useRecentSearches = () => {
  return useQuery({
    queryKey: queryKeys.search.recent,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; sonuclar: SonArama[] }>('/search/recent');
      return response.data.sonuclar;
    },
  });
};

// Properties hooks
export const useProperties = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: params ? queryKeys.properties.filtered(params) : queryKeys.properties.all,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean } & PaginatedResponse<IlanOzet>>('/properties', { params });
      return {
        sonuclar: response.data.sonuclar,
        toplam: response.data.toplam,
        sayfa: response.data.sayfa,
        toplam_sayfa: response.data.toplam_sayfa,
      };
    },
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Ilan>(`/properties/${id}`);
      return response.data;
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

// Search hooks
export const useSearch = () => {
  return useMutation({
    mutationFn: async (request: AramaIstegi) => {
      const response = await apiClient.post<{
        basarili: boolean;
        sonuclar: IlanOzet[];
        toplam: number;
        sayfa: number;
        toplam_sayfa: number;
        arama_tipi: string;
      }>('/search/', request);
      return response.data;
    },
  });
};

export const useSaveSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sorgu?: string; filtreler?: Record<string, unknown>; sonuc_sayisi: number; isim: string }) => {
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
      const response = await apiClient.get<{ basarili: boolean; sonuclar: KaydedilenArama[] }>('/search/saved');
      return response.data.sonuclar;
    },
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery({
    queryKey: queryKeys.favorites.all,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; sonuclar: Favori[] }>('/favorites/');
      return response.data.sonuclar;
    },
  });
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ilanId: number) => {
      const response = await apiClient.post('/favorites/', { ilan_id: ilanId });
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
    mutationFn: async (ilanId: number) => {
      await apiClient.delete(`/favorites/${ilanId}`);
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
    mutationFn: async ({ ilanId, notMetni }: { ilanId: number; notMetni: string }) => {
      const response = await apiClient.patch(`/favorites/${ilanId}/note`, { not_metni: notMetni });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
    },
  });
};

// AI hooks
export const useAiAnalysis = (ilanId: number) => {
  return useQuery({
    queryKey: queryKeys.ai.analysis(ilanId),
    queryFn: async () => {
      const response = await apiClient.post<{ basarili: boolean; analiz: AiAnaliz; cached?: boolean }>('/ai/analyze', { ilan_id: ilanId });
      return response.data;
    },
    enabled: !!ilanId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (cached on backend)
  });
};

export const useAiComparison = () => {
  return useMutation({
    mutationFn: async (ilanIdleri: number[]) => {
      const response = await apiClient.post<{ basarili: boolean; karsilastirma: AiKarsilastirma }>('/ai/compare', { ilan_idleri: ilanIdleri });
      return response.data;
    },
  });
};

export const useAiChat = () => {
  return useMutation({
    mutationFn: async (data: {
      mesaj: string;
      session_id?: string;
      baglam_tipi?: 'property' | 'search' | 'comparison' | 'general';
      baglam_verisi?: Record<string, unknown>;
    }) => {
      const response = await apiClient.post<{ basarili: boolean; session_id: string; yanit: string }>('/ai/chat', data);
      return response.data;
    },
  });
};

// Import hooks
export const useImportHistory = () => {
  return useQuery({
    queryKey: queryKeys.import.history,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; sonuclar: ImportDurum[] }>('/import/history');
      return response.data.sonuclar;
    },
  });
};

export const useImportStatus = (importId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.import.status(importId),
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; import: ImportDurum }>(`/import/${importId}/status`);
      return response.data.import;
    },
    enabled: enabled && !!importId,
    refetchInterval: (query) => {
      const data = query.state.data as ImportDurum | undefined;
      // Stop polling when complete or failed
      if (data?.durum === 'tamamlandi' || data?.durum === 'hatali') {
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

      const response = await apiClient.post<{ basarili: boolean; import_id: string }>('/import/upload', formData, {
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

// User/Profile hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await apiClient.get<{ basarili: boolean; kullanici: Kullanici }>('/auth/me');
      return response.data.kullanici;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfilGuncelle) => {
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
    mutationFn: async (data: TercihlerGuncelle) => {
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
    mutationFn: async (data: SifreDegistirRequest) => {
      const response = await apiClient.post('/auth/change-password', data);
      return response.data;
    },
  });
};
