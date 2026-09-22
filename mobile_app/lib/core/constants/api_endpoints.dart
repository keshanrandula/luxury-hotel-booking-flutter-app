import 'package:flutter/foundation.dart';
import 'dart:io' show Platform;

class ApiEndpoints {
  ApiEndpoints._();

  /// Automatically resolves backend API URL depending on the running environment:
  /// - Android Emulator -> http://10.0.2.2:5000/api
  /// - Web / Windows / macOS / Linux / iOS -> http://127.0.0.1:5000/api
  static String get _defaultHost {
    if (kIsWeb) {
      return 'http://127.0.0.1:5000/api';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:5000/api';
      }
    } catch (_) {}
    return 'http://127.0.0.1:5000/api';
  }

  static String baseUrl = _defaultHost;
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 15);

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String profile = '/auth/profile';

  // Hotel & Listings
  static const String getHotels = '/hotels';
  static const String getHotelDetails = '/hotels/{id}';
  static const String searchHotels = '/hotels/search';
  static const String getFeaturedHotels = '/hotels/featured';
  static const String getReviews = '/hotels/{id}/reviews';

  // Bookings
  static const String createBooking = '/bookings';
  static const String getUserBookings = '/bookings/my';
  static const String cancelBooking = '/bookings/{id}/cancel';

  // AI Concierge
  static const String aiChat = '/ai/chat';

  // Notifications
  static const String getNotifications = '/notifications';
  static const String updateFCMToken = '/notifications/fcm-token';
}
