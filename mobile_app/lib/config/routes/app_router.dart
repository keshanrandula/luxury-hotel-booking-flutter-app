import 'package:flutter/material.dart';
import '../../features/ai_concierge/presentation/screens/ai_concierge_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/booking/presentation/screens/main_navigation_shell.dart';
import '../../features/booking/presentation/screens/my_bookings_screen.dart';
import '../../features/notifications/presentation/screens/notifications_screen.dart';

class AppRouter {
  AppRouter._();

  static Route<dynamic> generateRoute(RouteSettings settings, {required Function(bool) onThemeToggle}) {
    switch (settings.name) {
      case LoginScreen.routeName:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case RegisterScreen.routeName:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case MainNavigationShell.routeName:
        return MaterialPageRoute(
          builder: (_) => MainNavigationShell(onThemeToggle: onThemeToggle),
        );
      case AiConciergeScreen.routeName:
        return MaterialPageRoute(builder: (_) => const AiConciergeScreen());
      case MyBookingsScreen.routeName:
        return MaterialPageRoute(builder: (_) => const MyBookingsScreen());
      case NotificationsScreen.routeName:
        return MaterialPageRoute(builder: (_) => const NotificationsScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => MainNavigationShell(onThemeToggle: onThemeToggle),
        );
    }
  }
}
