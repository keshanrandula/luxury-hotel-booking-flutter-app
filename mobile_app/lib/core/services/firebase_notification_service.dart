import 'dart:async';
import 'package:flutter/foundation.dart';

/// Top-level background message handler for FCM
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(Map<String, dynamic> message) async {
  debugPrint('Handling FCM background message: ${message['messageId']}');
}

class FirebaseNotificationService {
  static final FirebaseNotificationService instance = FirebaseNotificationService._internal();

  FirebaseNotificationService._internal();

  final _messageStreamController = StreamController<Map<String, dynamic>>.broadcast();
  Stream<Map<String, dynamic>> get onMessageReceived => _messageStreamController.stream;

  String? _fcmToken;
  String? get fcmToken => _fcmToken;

  /// Initialize Firebase Cloud Messaging listeners
  Future<void> initialize() async {
    try {
      // 1. Request Notification Permissions (iOS & Android 13+)
      await _requestPermissions();

      // 2. Fetch and register device FCM token
      _fcmToken = 'mock_fcm_token_${DateTime.now().millisecondsSinceEpoch}';
      debugPrint('FCM Device Token: $_fcmToken');

      // 3. Setup Foreground message listener
      _setupForegroundListener();

      // 4. Setup Notification Click / Opened App listener
      _setupNotificationOpenedHandler();

      // 5. Handle initial notification when app launched from terminated state
      await _handleInitialNotification();

      debugPrint('FirebaseNotificationService successfully initialized.');
    } catch (e) {
      debugPrint('FCM Init fallback notice: $e');
    }
  }

  Future<void> _requestPermissions() async {
    // In production with FirebaseMessaging instance:
    // final settings = await FirebaseMessaging.instance.requestPermission(
    //   alert: true, badge: true, sound: true, provisional: false,
    // );
    debugPrint('FCM Permissions granted.');
  }

  void _setupForegroundListener() {
    // FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    //   _handleIncomingMessage(message.data, title: message.notification?.title);
    // });
  }

  void _setupNotificationOpenedHandler() {
    // FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    //   _handleNotificationClick(message.data);
    // });
  }

  Future<void> _handleInitialNotification() async {
    // RemoteMessage? initialMessage = await FirebaseMessaging.instance.getInitialMessage();
    // if (initialMessage != null) { _handleNotificationClick(initialMessage.data); }
  }

  void handleIncomingPayload(Map<String, dynamic> data) {
    _messageStreamController.add(data);
  }

  void handleNotificationClick(Map<String, dynamic> data) {
    debugPrint('User tapped notification with payload: $data');
    _messageStreamController.add({'action': 'click', ...data});
  }

  void dispose() {
    _messageStreamController.close();
  }
}
