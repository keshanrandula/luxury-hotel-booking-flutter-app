class AppConstants {
  AppConstants._();

  static const String appName = 'LuxeStays';
  static const String appTagline = 'Bespoke Luxury Escapes & Curated Resorts';
  
  // Hive Box Names
  static const String userBox = 'user_box';
  static const String hotelsBox = 'hotels_box';
  static const String bookingsBox = 'bookings_box';
  static const String settingsBox = 'settings_box';
  static const String favoritesBox = 'favorites_box';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String currentUserKey = 'current_user';
  static const String isDarkModeKey = 'is_dark_mode';
  static const String cachedHotelsKey = 'cached_hotels';
  static const String cachedBookingsKey = 'cached_bookings';
  static const String favoriteIdsKey = 'favorite_hotel_ids';

  // Booking Defaults
  static const double taxRate = 0.12; // 12% luxury & city tax
  static const double serviceFee = 45.0; // Flat resort service fee
}
