import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../ai_concierge/presentation/screens/ai_concierge_screen.dart';
import '../bloc/hotel_bloc.dart';
import '../bloc/hotel_state.dart';
import 'home_explore_screen.dart';
import 'my_bookings_screen.dart';
import 'profile_screen.dart';
import 'wishlist_screen.dart';

class MainNavigationShell extends StatefulWidget {
  final Function(bool) onThemeToggle;

  const MainNavigationShell({super.key, required this.onThemeToggle});

  static const String routeName = '/main';

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final screens = [
      const HomeExploreScreen(),
      WishlistScreen(onExploreTap: () => setState(() => _currentIndex = 0)),
      const AiConciergeScreen(),
      const MyBookingsScreen(),
      ProfileScreen(onThemeToggle: widget.onThemeToggle),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          border: Border(
            top: BorderSide(
              color: isDark ? AppColors.borderDark : AppColors.borderLight,
              width: 1,
            ),
          ),
        ),
        child: BlocBuilder<HotelBloc, HotelState>(
          builder: (context, hotelState) {
            final favoriteCount = hotelState.favoriteHotelIds.length;

            return BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) => setState(() => _currentIndex = index),
              type: BottomNavigationBarType.fixed,
              selectedItemColor: AppColors.accentGold,
              unselectedItemColor: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
              selectedFontSize: 11,
              unselectedFontSize: 11,
              selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700),
              unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
              items: [
                const BottomNavigationBarItem(
                  icon: Icon(Icons.explore_outlined),
                  activeIcon: Icon(Icons.explore_rounded),
                  label: 'Explore',
                ),
                BottomNavigationBarItem(
                  icon: Badge(
                    isLabelVisible: favoriteCount > 0,
                    backgroundColor: AppColors.error,
                    label: Text(
                      '$favoriteCount',
                      style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    child: const Icon(Icons.favorite_outline_rounded),
                  ),
                  activeIcon: Badge(
                    isLabelVisible: favoriteCount > 0,
                    backgroundColor: AppColors.error,
                    label: Text(
                      '$favoriteCount',
                      style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    child: const Icon(Icons.favorite_rounded, color: AppColors.error),
                  ),
                  label: 'Saved',
                ),
                const BottomNavigationBarItem(
                  icon: Icon(Icons.auto_awesome_outlined),
                  activeIcon: Icon(Icons.auto_awesome, color: AppColors.accentGold),
                  label: 'AI Concierge',
                ),
                const BottomNavigationBarItem(
                  icon: Icon(Icons.luggage_outlined),
                  activeIcon: Icon(Icons.luggage_rounded),
                  label: 'My Trips',
                ),
                const BottomNavigationBarItem(
                  icon: Icon(Icons.person_outline_rounded),
                  activeIcon: Icon(Icons.person_rounded),
                  label: 'VIP Profile',
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
