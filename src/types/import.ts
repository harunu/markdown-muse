/**
 * Import-related TypeScript types
 * These match the backend serializer response shapes exactly
 * Updated to match English backend API field names
 */

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportJobDetail {
  id: string;
  file_name: string;
  status: 'validating' | 'pending_confirmation' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  created_count: number;
  updated_count: number;
  preview: Record<string, string>[];
  errors: ImportError[];
  created_at: string;
  completed_at: string | null;
}

export interface ImportUploadResponse {
  success: boolean;
  import_id: string;
  status: string;
  message: string;
}

export interface ImportConfirmResponse {
  success: boolean;
  message: string;
  created_count: number;
  updated_count: number;
}

export interface ImportConfirmSettings {
  update_existing: boolean;
  skip_errors: boolean;
}
