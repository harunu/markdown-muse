/**
 * TypeScript types for API integration
 * Based on 10-frontend-integration.md
 * Updated to match English backend API field names
 */

// API Error object (nested error envelope)
export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string[]> | null;
}

// API Response Envelope
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// Paginated Response
export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  total_pages: number;
}

// User Preferences
export interface UserPreferences {
  default_city: string;
  results_per_page: number;
  ai_auto: boolean;
  email_notifications: boolean;
}

// User
export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'professional' | 'admin' | 'super_admin';
  preferences?: UserPreferences;
}

// Auth Response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Property (Full)
export interface Property {
  id: number;
  title: string;
  listing_type: 'sale' | 'rent';
  property_type: 'apartment' | 'villa' | 'land' | 'commercial' | 'residence';
  city: string;
  district: string;
  neighborhood?: string | null;
  price: number;
  area?: number | null;
  room_count?: string | null;
  building_age?: number | null;
  floor?: number | null;
  total_floors?: number | null;
  heating?: string | null;
  description?: string | null;
  features: string[];
  images: string[];
  location?: { lat: number; lng: number } | null;
  source: string;
  status: 'active' | 'inactive' | 'draft' | 'deleted';
  price_per_sqm?: number | null;
  created_at: string;
  updated_at: string;
}

// Property Summary (used in lists)
export interface PropertySummary {
  id: number;
  title: string;
  listing_type: 'sale' | 'rent';
  property_type: string;
  city: string;
  district: string;
  price: number;
  area?: number | null;
  room_count?: string | null;
  building_age?: number | null;
  status: string;
  source: string;
  price_per_sqm?: number | null;
  location?: { lat: number; lng: number } | null;
  created_at: string;
  updated_at: string;
  ai_score?: number;
}

// AI Analysis
export interface AIAnalysis {
  price_score: number;
  price_evaluation: string;
  price_per_sqm?: number;
  area_average_price_per_sqm?: number;
  price_difference_percent?: number;
  advantages: string[];
  disadvantages: string[];
  recommendation: string;
  overall_evaluation: string;
}

// AI Comparison
export interface AIComparison {
  summary: string;
  best_price?: {
    property_id: number;
    title: string;
    reason: string;
  };
  best_location?: {
    property_id: number;
    title: string;
    reason: string;
  };
  best_value?: {
    property_id: number;
    title: string;
    reason: string;
  };
  comparison_table?: Array<{
    property_id: number;
    title: string;
    price_score: number;
    location_score: number;
    feature_score: number;
    overall_score: number;
    standout_feature: string;
    attention_point: string;
  }>;
  recommendation: string;
}

// Import Status
export interface ImportStatus {
  import_id: string;
  status: 'validating' | 'pending_confirmation' | 'processing' | 'completed' | 'failed';
  progress: number;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  preview?: Record<string, unknown>[];
  errors?: Array<{ row: number; field: string; message: string }>;
}

// Dashboard Stats
export interface DashboardStats {
  total_properties: number;
  today_searches: number;
  favorites_count: number;
  last_import?: {
    id: string;
    file_name: string;
    status: string;
    total_rows: number;
    successful_rows: number;
    failed_rows: number;
    date: string;
  } | null;
}

// Recent Search
export interface RecentSearch {
  id: number;
  query: string;
  filters: Record<string, unknown>;
  result_count: number;
  date: string;
}

// Saved Search
export interface SavedSearch {
  id: number;
  query: string;
  filters: Record<string, unknown>;
  result_count: number;
  name: string;
  date: string;
}

// Favorite
export interface Favorite {
  id: number;
  property: PropertySummary;
  note: string;
  added_at: string;
}

// Search Request
export interface SearchRequest {
  query?: string;
  filters?: {
    city?: string;
    district?: string;
    property_type?: string;
    listing_type?: string;
    price_min?: number;
    price_max?: number;
    area_min?: number;
    area_max?: number;
    room_count?: string;
  };
  sort_by?: string;
  page?: number;
  page_size?: number;
}

// Chat Message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chat Session
export interface ChatSession {
  session_id: string;
  session_type: 'property' | 'search' | 'comparison' | 'general';
  message_count: number;
  last_message?: string;
  updated_at: string;
}

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Change Password Request
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}

// Profile Update Request
export interface ProfileUpdate {
  full_name?: string;
}

// Preferences Update Request
export interface PreferencesUpdate {
  default_city?: string;
  results_per_page?: number;
  ai_auto?: boolean;
  email_notifications?: boolean;
}
