/**
 * Import hook for CSV import functionality
 * Wraps backend import API endpoints
 * Updated to use English API response keys
 */
import { AxiosError } from 'axios';
import apiClient from '@/lib/api-client';
import {
  ImportUploadResponse,
  ImportJobDetail,
  ImportConfirmResponse,
  ImportConfirmSettings,
} from '@/types/import';

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return 'Connection error. Please try again.';
};

export const useImport = () => {
  /**
   * Upload a CSV file for import
   * POST /api/v1/import/upload
   * Content-Type: multipart/form-data
   * Field name: file
   */
  const uploadCSV = async (file: File): Promise<ImportUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<ImportUploadResponse>(
        '/import/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  /**
   * Get the status of an import job
   * GET /api/v1/import/{importId}/status
   */
  const getImportStatus = async (importId: string): Promise<ImportJobDetail> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: ImportJobDetail }>(
        `/import/${importId}/status`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  /**
   * Confirm and start processing an import job
   * POST /api/v1/import/{importId}/confirm
   * Body: { update_existing, skip_errors }
   */
  const confirmImport = async (
    importId: string,
    settings: ImportConfirmSettings
  ): Promise<ImportConfirmResponse> => {
    try {
      const response = await apiClient.post<ImportConfirmResponse>(
        `/import/${importId}/confirm`,
        settings
      );
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  /**
   * Download the CSV template
   * GET /api/v1/import/template
   * Triggers browser file download
   */
  const downloadTemplate = async (): Promise<void> => {
    try {
      const response = await apiClient.get('/import/template', {
        responseType: 'blob',
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'import_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  };

  return {
    uploadCSV,
    getImportStatus,
    confirmImport,
    downloadTemplate,
  };
};

export default useImport;
