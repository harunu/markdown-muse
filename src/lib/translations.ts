/**
 * Translation utility for converting English backend messages to Turkish UI text
 * This file maps English API error/success messages to Turkish translations for display
 */

// English to Turkish message translations
const messageTranslations: Record<string, string> = {
  // Authentication errors
  'Invalid email or password.': 'Geçersiz e-posta veya şifre.',
  'Password is too weak.': 'Şifre çok zayıf.',
  'Passwords do not match.': 'Şifreler eşleşmiyor.',
  'Current password is incorrect.': 'Mevcut şifre yanlış.',
  'Invalid or expired token.': 'Geçersiz veya süresi dolmuş token.',
  'Token has expired.': 'Token süresi dolmuş.',
  'Authentication required.': 'Giriş yapmanız gerekmektedir.',
  'Invalid credentials.': 'Geçersiz kimlik bilgileri.',

  // Permission errors
  'You do not have permission.': 'Bu işlem için yetkiniz bulunmuyor.',
  'Access denied.': 'Erişim reddedildi.',
  'Admin permission required.': 'Yönetici izni gerekli.',

  // Validation errors
  'This field is required.': 'Bu alan zorunludur.',
  'Invalid email format.': 'Geçersiz e-posta formatı.',
  'Invalid phone format.': 'Geçersiz telefon formatı.',
  'Value must be a positive number.': 'Değer pozitif bir sayı olmalıdır.',
  'This value already exists.': 'Bu değer zaten mevcut.',
  'Invalid date format.': 'Geçersiz tarih formatı.',
  'File size cannot exceed 50MB.': 'Dosya boyutu 50MB\'ı geçemez.',
  'Unsupported file format.': 'Desteklenmeyen dosya formatı.',

  // Resource errors
  'Property not found.': 'İlan bulunamadı.',
  'User not found.': 'Kullanıcı bulunamadı.',
  'Search not found.': 'Arama bulunamadı.',
  'Favorite not found.': 'Favori bulunamadı.',
  'Import job not found.': 'Import işi bulunamadı.',
  'Resource not found.': 'Kaynak bulunamadı.',

  // Import errors
  'File is required.': 'Dosya zorunludur.',
  'File cannot be empty.': 'Dosya boş olamaz.',
  'File expired. Please upload again.': 'Dosya süresi doldu. Lütfen tekrar yükleyin.',
  'Import already confirmed.': 'Import zaten onaylanmış.',
  'Import cannot be confirmed in current state.': 'Import mevcut durumda onaylanamaz.',
  'Import is not ready for confirmation.': 'Import onay için hazır değil.',

  // AI errors
  'AI service is currently unavailable.': 'AI servisi şu anda kullanılamıyor.',
  'Property analysis failed.': 'İlan analizi başarısız oldu.',
  'Comparison requires 2-5 properties.': 'Karşılaştırma için 2-5 ilan gereklidir.',

  // Success messages
  'Login successful.': 'Giriş başarılı.',
  'Logout successful.': 'Çıkış başarılı.',
  'Password changed successfully.': 'Şifre başarıyla değiştirildi.',
  'Profile updated successfully.': 'Profil başarıyla güncellendi.',
  'Preferences updated successfully.': 'Tercihler başarıyla güncellendi.',
  'Property created successfully.': 'İlan başarıyla oluşturuldu.',
  'Property updated successfully.': 'İlan başarıyla güncellendi.',
  'Property deleted successfully.': 'İlan başarıyla silindi.',
  'Added to favorites.': 'Favorilere eklendi.',
  'Removed from favorites.': 'Favorilerden kaldırıldı.',
  'Favorite note updated.': 'Favori notu güncellendi.',
  'Search saved successfully.': 'Arama başarıyla kaydedildi.',
  'Saved search deleted successfully.': 'Kayıtlı arama başarıyla silindi.',
  'File uploaded successfully.': 'Dosya başarıyla yüklendi.',
  'Import started successfully.': 'Import başarıyla başlatıldı.',
  'Import completed successfully.': 'Import başarıyla tamamlandı.',

  // Generic errors
  'An unexpected error occurred.': 'Beklenmeyen bir hata oluştu.',
  'Connection error. Please try again.': 'Bağlantı hatası. Lütfen tekrar deneyin.',
  'Server error. Please try again later.': 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
  'Request timeout.': 'İstek zaman aşımına uğradı.',
  'Too many requests. Please wait.': 'Çok fazla istek. Lütfen bekleyin.',
};

// Status translations
const statusTranslations: Record<string, string> = {
  // Property status
  'active': 'Aktif',
  'inactive': 'Pasif',
  'draft': 'Taslak',
  'deleted': 'Silindi',

  // Import status
  'validating': 'Doğrulanıyor',
  'pending_confirmation': 'Onay Bekliyor',
  'processing': 'İşleniyor',
  'completed': 'Tamamlandı',
  'failed': 'Başarısız',
  'cancelled': 'İptal Edildi',

  // Listing type
  'sale': 'Satılık',
  'rent': 'Kiralık',

  // Property type
  'apartment': 'Daire',
  'villa': 'Villa',
  'land': 'Arsa',
  'commercial': 'İşyeri',
  'residence': 'Rezidans',

  // User roles
  'professional': 'Profesyonel',
  'admin': 'Yönetici',
  'super_admin': 'Süper Admin',
};

// Field name translations (for form labels and error messages)
const fieldTranslations: Record<string, string> = {
  'title': 'Başlık',
  'listing_type': 'İlan Tipi',
  'property_type': 'Emlak Tipi',
  'city': 'Şehir',
  'district': 'İlçe',
  'neighborhood': 'Mahalle',
  'price': 'Fiyat',
  'currency': 'Para Birimi',
  'area': 'Metrekare',
  'room_count': 'Oda Sayısı',
  'bathroom_count': 'Banyo Sayısı',
  'building_age': 'Bina Yaşı',
  'floor': 'Kat',
  'total_floors': 'Toplam Kat',
  'heating_type': 'Isıtma Tipi',
  'description': 'Açıklama',
  'features': 'Özellikler',
  'images': 'Görseller',
  'location': 'Konum',
  'email': 'E-posta',
  'password': 'Şifre',
  'full_name': 'Ad Soyad',
  'current_password': 'Mevcut Şifre',
  'new_password': 'Yeni Şifre',
  'new_password_confirm': 'Yeni Şifre Tekrar',
  'file': 'Dosya',
  'note': 'Not',
  'query': 'Arama',
  'filters': 'Filtreler',
  'message': 'Mesaj',
};

/**
 * Translate an English message to Turkish
 * Falls back to original message if no translation found
 */
export const translateMessage = (message: string): string => {
  return messageTranslations[message] || message;
};

/**
 * Translate a status value to Turkish
 * Falls back to original status if no translation found
 */
export const translateStatus = (status: string): string => {
  return statusTranslations[status.toLowerCase()] || status;
};

/**
 * Translate a field name to Turkish
 * Falls back to original field name if no translation found
 */
export const translateField = (field: string): string => {
  return fieldTranslations[field.toLowerCase()] || field;
};

/**
 * Translate API validation errors object
 * Converts { field: ['error1', 'error2'] } to Turkish
 */
export const translateValidationErrors = (
  errors: Record<string, string[]>
): Record<string, string[]> => {
  const translated: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(errors)) {
    const translatedField = translateField(field);
    translated[translatedField] = messages.map(translateMessage);
  }

  return translated;
};

/**
 * Format a validation error for display
 * Returns a formatted string like "Alan: Hata mesajı"
 */
export const formatValidationError = (field: string, message: string): string => {
  const translatedField = translateField(field);
  const translatedMessage = translateMessage(message);
  return `${translatedField}: ${translatedMessage}`;
};

// Export the translation maps for custom usage
export const translations = {
  messages: messageTranslations,
  statuses: statusTranslations,
  fields: fieldTranslations,
};

export default {
  translateMessage,
  translateStatus,
  translateField,
  translateValidationErrors,
  formatValidationError,
  translations,
};
