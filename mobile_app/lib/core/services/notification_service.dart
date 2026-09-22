import 'dart:async';
import 'package:flutter/foundation.dart';
import '../../features/booking/domain/entities/booking_entity.dart';
import '../utils/date_formatter.dart';

class NotificationItem {
  final String id;
  final String title;
  final String body;
  final DateTime timestamp;
  final String type; // 'booking_confirmed', 'checkin_reminder', 'promo_deal', 'system_alert'
  final bool isRead;
  final Map<String, dynamic>? data;

  const NotificationItem({
    required this.id,
    required this.title,
    required this.body,
    required this.timestamp,
    required this.type,
    this.isRead = false,
    this.data,
  });

  NotificationItem copyWith({
    String? id,
    String? title,
    String? body,
    DateTime? timestamp,
    String? type,
    bool? isRead,
    Map<String, dynamic>? data,
  }) {
    return NotificationItem(
      id: id ?? this.id,
      title: title ?? this.title,
      body: body ?? this.body,
      timestamp: timestamp ?? this.timestamp,
      type: type ?? this.type,
      isRead: isRead ?? this.isRead,
      data: data ?? this.data,
    );
  }
}

class NotificationService {
  static final NotificationService instance = NotificationService._internal();

  NotificationService._internal();

  final _notificationStreamController = StreamController<NotificationItem>.broadcast();
  Stream<NotificationItem> get onNotificationReceived => _notificationStreamController.stream;

  final List<NotificationItem> _inbox = [];

  List<NotificationItem> get notifications => List.unmodifiable(_inbox);

  int get unreadCount => _inbox.where((n) => !n.isRead).length;

  String? _fcmDeviceToken;
  String? get fcmDeviceToken => _fcmDeviceToken;

  Future<void> init() async {
    // Generate/register simulated FCM device token
    _fcmDeviceToken = 'fcm_mobile_token_${DateTime.now().millisecondsSinceEpoch}';

    // Seed realistic luxury concierge notifications if empty
    if (_inbox.isEmpty) {
      _inbox.addAll([
        NotificationItem(
          id: 'notif-seed-01',
          title: 'Reservation Confirmed! 🛎️',
          body: 'Your luxury stay at The St. Regis Maldives Vommuli (Overwater Villa) is confirmed. Your Butler is ready.',
          timestamp: DateTime.now().subtract(const Duration(minutes: 45)),
          type: 'booking_confirmed',
          isRead: false,
          data: {'bookingId': 'BK-1001', 'hotelId': 'hotel-001', 'screen': 'booking_details'},
        ),
        NotificationItem(
          id: 'notif-seed-02',
          title: '⏰ Check-In Tomorrow: The Chedi Andermatt',
          body: 'Your private Deluxe Alpine Suite is being prepared. Your Ski Butler is ready to assist your mountain arrival.',
          timestamp: DateTime.now().subtract(const Duration(hours: 4)),
          type: 'checkin_reminder',
          isRead: false,
          data: {'hotelId': 'hotel-002', 'screen': 'itinerary'},
        ),
        NotificationItem(
          id: 'notif-seed-03',
          title: '🏷️ 20% Holiday Special: Code HOLIDAY20',
          body: 'Experience private island luxury with 20% off all beachfront villas and private residences.',
          timestamp: DateTime.now().subtract(const Duration(days: 1)),
          type: 'promo_deal',
          isRead: true,
          data: {'promoCode': 'HOLIDAY20', 'screen': 'promos'},
        ),
        NotificationItem(
          id: 'notif-seed-04',
          title: '👑 VIP Elite Concierge Activated',
          body: 'Welcome to Luxe Member tier. Enjoy complimentary champagne, late checkouts, and priority reservations.',
          timestamp: DateTime.now().subtract(const Duration(days: 2)),
          type: 'system_alert',
          isRead: true,
          data: {'tier': 'VIP_ELITE', 'screen': 'profile'},
        ),
      ]);
    }
    debugPrint('NotificationService initialized with FCM Token: $_fcmDeviceToken');
  }

  void addNotification({
    required String title,
    required String body,
    required String type,
    Map<String, dynamic>? data,
  }) {
    final newNotification = NotificationItem(
      id: 'notif-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      body: body,
      timestamp: DateTime.now(),
      type: type,
      isRead: false,
      data: data,
    );

    _inbox.insert(0, newNotification);
    _notificationStreamController.add(newNotification);
  }

  // Convenience Trigger: Booking Confirmation Alert
  void notifyBookingConfirmed(BookingEntity booking) {
    final checkInStr = DateFormatter.medium(booking.checkIn);
    addNotification(
      title: 'Reservation Confirmed! 🛎️',
      body: 'Your stay at ${booking.hotelName} (${booking.roomName}) is booked for $checkInStr. Your itinerary is ready.',
      type: 'booking_confirmed',
      data: {
        'bookingId': booking.id,
        'hotelId': booking.hotelId,
        'grandTotal': booking.grandTotal.toString(),
        'screen': 'booking_details',
      },
    );
  }

  // Convenience Trigger: 24h Check-in Reminder Alert
  void notifyCheckInReminder(BookingEntity booking) {
    addNotification(
      title: '⏰ Check-In Tomorrow: ${booking.hotelName}',
      body: 'Your ${booking.roomName} is being prepared. Your Butler is ready to assist your arrival.',
      type: 'checkin_reminder',
      data: {
        'bookingId': booking.id,
        'hotelId': booking.hotelId,
        'screen': 'itinerary',
      },
    );
  }

  // Convenience Trigger: Special Offer & Promo Deal Alert
  void notifyPromoOffer(String title, String body, String promoCode) {
    addNotification(
      title: title,
      body: body,
      type: 'promo_deal',
      data: {
        'promoCode': promoCode,
        'screen': 'promos',
      },
    );
  }

  void markAllAsRead() {
    for (int i = 0; i < _inbox.length; i++) {
      _inbox[i] = _inbox[i].copyWith(isRead: true);
    }
  }

  void markAsRead(String id) {
    final index = _inbox.indexWhere((n) => n.id == id);
    if (index != -1) {
      _inbox[index] = _inbox[index].copyWith(isRead: true);
    }
  }

  void deleteNotification(String id) {
    _inbox.removeWhere((n) => n.id == id);
  }

  void clearAll() {
    _inbox.clear();
  }

  void dispose() {
    _notificationStreamController.close();
  }
}
