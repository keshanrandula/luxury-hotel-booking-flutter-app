import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../constants/app_constants.dart';
import 'hive_boxes.dart';

class HiveService {
  static final HiveService instance = HiveService._internal();

  HiveService._internal();

  late Box _userBox;
  late Box _hotelsBox;
  late Box _bookingsBox;
  late Box _settingsBox;
  late Box _favoritesBox;

  Future<void> init() async {
    await Hive.initFlutter();

    _userBox = await Hive.openBox(HiveBoxes.userBox);
    _hotelsBox = await Hive.openBox(HiveBoxes.hotelsBox);
    _bookingsBox = await Hive.openBox(HiveBoxes.bookingsBox);
    _settingsBox = await Hive.openBox(HiveBoxes.settingsBox);
    _favoritesBox = await Hive.openBox(HiveBoxes.favoritesBox);

    debugPrint('Hive initialized successfully with all boxes opened.');
  }

  // Auth & Token Storage
  Future<void> saveToken(String token) async {
    await _userBox.put(AppConstants.tokenKey, token);
  }

  String? getToken() {
    return _userBox.get(AppConstants.tokenKey);
  }

  Future<void> saveUserData(Map<String, dynamic> userJson) async {
    await _userBox.put(AppConstants.currentUserKey, jsonEncode(userJson));
  }

  Map<String, dynamic>? getUserData() {
    final raw = _userBox.get(AppConstants.currentUserKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  Future<void> clearAuth() async {
    await _userBox.delete(AppConstants.tokenKey);
    await _userBox.delete(AppConstants.currentUserKey);
  }

  // Theme & Settings
  Future<void> setDarkMode(bool isDark) async {
    await _settingsBox.put(AppConstants.isDarkModeKey, isDark);
  }

  bool isDarkMode() {
    return _settingsBox.get(AppConstants.isDarkModeKey, defaultValue: true);
  }

  // Hotel Caching
  Future<void> cacheHotels(List<Map<String, dynamic>> hotels) async {
    await _hotelsBox.put(AppConstants.cachedHotelsKey, jsonEncode(hotels));
  }

  List<Map<String, dynamic>> getCachedHotels() {
    final raw = _hotelsBox.get(AppConstants.cachedHotelsKey);
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List;
      return decoded.map((e) => Map<String, dynamic>.from(e as Map)).toList();
    } catch (_) {
      return [];
    }
  }

  // Bookings Storage
  Future<void> saveBooking(Map<String, dynamic> booking) async {
    final currentBookings = getBookings();
    currentBookings.removeWhere((b) => b['id'] == booking['id']);
    currentBookings.insert(0, booking);
    await _bookingsBox.put(AppConstants.cachedBookingsKey, jsonEncode(currentBookings));
  }

  List<Map<String, dynamic>> getBookings() {
    final raw = _bookingsBox.get(AppConstants.cachedBookingsKey);
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List;
      return decoded.map((e) => Map<String, dynamic>.from(e as Map)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> removeBooking(String bookingId) async {
    final currentBookings = getBookings();
    currentBookings.removeWhere((b) => b['id'] == bookingId);
    await _bookingsBox.put(AppConstants.cachedBookingsKey, jsonEncode(currentBookings));
  }

  // Favorites
  List<String> getFavoriteIds() {
    final raw = _favoritesBox.get(AppConstants.favoriteIdsKey);
    if (raw == null) return [];
    try {
      final decoded = jsonDecode(raw) as List;
      return decoded.map((e) => e.toString()).toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> toggleFavorite(String hotelId) async {
    final favorites = getFavoriteIds();
    if (favorites.contains(hotelId)) {
      favorites.remove(hotelId);
    } else {
      favorites.add(hotelId);
    }
    await _favoritesBox.put(AppConstants.favoriteIdsKey, jsonEncode(favorites));
  }

  bool isFavorite(String hotelId) {
    return getFavoriteIds().contains(hotelId);
  }
}
