import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/services/notification_service.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../../notifications/presentation/screens/notifications_screen.dart';
import '../../domain/entities/hotel_entity.dart';
import '../bloc/hotel_bloc.dart';
import '../bloc/hotel_event.dart';
import '../bloc/hotel_state.dart';
import '../widgets/hotel_card.dart';
import '../widgets/search_filter_bar.dart';
import 'hotel_detail_screen.dart';

class HomeExploreScreen extends StatefulWidget {
  const HomeExploreScreen({super.key});

  static const String routeName = '/explore';

  @override
  State<HomeExploreScreen> createState() => _HomeExploreScreenState();
}

class _HomeExploreScreenState extends State<HomeExploreScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Load hotels if not already loaded
    final hotelBloc = context.read<HotelBloc>();
    if (hotelBloc.state.status == HotelStatus.initial) {
      hotelBloc.add(const LoadHotelsEvent());
    }
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearch(String query) {
    context.read<HotelBloc>().add(SearchHotelsEvent(query));
  }

  void _toggleFavorite(HotelEntity hotel) {
    final bloc = context.read<HotelBloc>();
    final isFav = bloc.state.favoriteHotelIds.contains(hotel.id);
    bloc.add(ToggleFavoriteEvent(hotel.id));

    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isFav
              ? 'Removed "${hotel.name}" from your wishlist'
              : 'Saved "${hotel.name}" to your luxury wishlist ❤️',
        ),
        action: isFav
            ? SnackBarAction(
                label: 'Undo',
                textColor: AppColors.accentGold,
                onPressed: () => bloc.add(ToggleFavoriteEvent(hotel.id)),
              )
            : null,
        duration: const Duration(seconds: 2),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: () async {
            context.read<HotelBloc>().add(const LoadHotelsEvent());
          },
          color: AppColors.accentGold,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
            slivers: [
              // Header Section with User Greeting & VIP Status
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      BlocBuilder<AuthBloc, AuthState>(
                        builder: (context, authState) {
                          final user = authState.user;
                          final name = user?.name.split(' ').first ?? 'Explorer';
                          final tier = user?.tier ?? 'Member';

                          return Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        'Welcome back, $name',
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      const Icon(Icons.verified_rounded, size: 16, color: AppColors.accentGold),
                                    ],
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Discover Sanctuaries',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: -0.5,
                                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                    ),
                                  ),
                                ],
                              ),
                              Row(
                                children: [
                                  // VIP Tier Badge
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      gradient: AppColors.goldGradient,
                                      borderRadius: BorderRadius.circular(20),
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.accentGold.withOpacity(0.3),
                                          blurRadius: 8,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: Text(
                                      tier.toUpperCase(),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 0.8,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),

                                  // Notification Bell Icon with Badge
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                                      ).then((_) => setState(() {}));
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: isDark ? AppColors.surfaceDark : Colors.white,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: isDark ? AppColors.borderDark : AppColors.borderLight,
                                        ),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(isDark ? 0.2 : 0.05),
                                            blurRadius: 6,
                                            offset: const Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: Stack(
                                        clipBehavior: Clip.none,
                                        children: [
                                          Icon(
                                            Icons.notifications_outlined,
                                            size: 20,
                                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                          ),
                                          if (NotificationService.instance.unreadCount > 0)
                                            Positioned(
                                              right: -2,
                                              top: -2,
                                              child: Container(
                                                padding: const EdgeInsets.all(3.5),
                                                decoration: const BoxDecoration(
                                                  color: AppColors.error,
                                                  shape: BoxShape.circle,
                                                ),
                                                child: Text(
                                                  '${NotificationService.instance.unreadCount}',
                                                  style: const TextStyle(
                                                    fontSize: 8,
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.white,
                                                    height: 1,
                                                  ),
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 20),

                      // Search & Categories Filter Bar
                      BlocBuilder<HotelBloc, HotelState>(
                        builder: (context, hotelState) {
                          return SearchFilterBar(
                            selectedCategory: hotelState.selectedCategory,
                            searchController: _searchController,
                            onCategorySelected: (cat) {
                              context.read<HotelBloc>().add(FilterCategoryEvent(cat));
                            },
                            onSearchSubmitted: _onSearch,
                          );
                        },
                      ),
                      const SizedBox(height: 14),

                      // AI Concierge Quick Banner
                      GestureDetector(
                        onTap: () {
                          Navigator.pushNamed(context, '/ai-concierge');
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppColors.accentGold.withOpacity(0.18),
                                AppColors.accentGold.withOpacity(0.05),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.accentGold.withOpacity(0.35)),
                          ),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(7),
                                decoration: BoxDecoration(
                                  gradient: AppColors.goldGradient,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.accentGold.withOpacity(0.3),
                                      blurRadius: 6,
                                    ),
                                  ],
                                ),
                                child: const Icon(Icons.auto_awesome, color: Colors.white, size: 14),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Plan with AI Concierge',
                                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.accentGold),
                                    ),
                                    Text(
                                      'Ask for custom 3-day tours, private villas & dining...',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.accentGold),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Featured Hotels Horizontal Rail
              SliverToBoxAdapter(
                child: BlocBuilder<HotelBloc, HotelState>(
                  builder: (context, state) {
                    if (state.featuredHotels.isEmpty || state.searchQuery.isNotEmpty) {
                      return const SizedBox.shrink();
                    }

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 12),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Featured Escapes',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                ),
                              ),
                              const Text(
                                'Exclusive Handpicked',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.accentGold,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 250,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.only(left: 20, right: 4),
                            itemCount: state.featuredHotels.length,
                            itemBuilder: (context, index) {
                              final hotel = state.featuredHotels[index];
                              return HotelCard(
                                hotel: hotel,
                                isHorizontal: true,
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => HotelDetailScreen(hotel: hotel),
                                    ),
                                  );
                                },
                                onToggleFavorite: () => _toggleFavorite(hotel),
                              );
                            },
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),

              // All / Filtered Hotels Section Title
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
                  child: BlocBuilder<HotelBloc, HotelState>(
                    builder: (context, state) {
                      return Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            state.selectedCategory == 'All'
                                ? 'All Sanctuaries'
                                : '${state.selectedCategory} Escapes',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            ),
                          ),
                          Text(
                            '${state.hotels.length} Properties',
                            style: TextStyle(
                              fontSize: 12,
                              color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),

              // Hotel Cards List
              BlocBuilder<HotelBloc, HotelState>(
                builder: (context, state) {
                  if (state.status == HotelStatus.loading && state.hotels.isEmpty) {
                    return const SliverFillRemaining(
                      hasScrollBody: false,
                      child: Center(
                        child: CircularProgressIndicator(color: AppColors.accentGold),
                      ),
                    );
                  }

                  if (state.hotels.isEmpty) {
                    return SliverFillRemaining(
                      hasScrollBody: false,
                      child: Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.travel_explore_rounded, size: 56, color: AppColors.accentGold),
                            const SizedBox(height: 12),
                            Text(
                              'No properties found',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Try adjusting your search or category filter',
                              style: TextStyle(
                                fontSize: 13,
                                color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  return SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    sliver: SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final hotel = state.hotels[index];
                          return HotelCard(
                            hotel: hotel,
                            isHorizontal: false,
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => HotelDetailScreen(hotel: hotel),
                                ),
                              );
                            },
                            onToggleFavorite: () => _toggleFavorite(hotel),
                          );
                        },
                        childCount: state.hotels.length,
                      ),
                    ),
                  );
                },
              ),

              const SliverToBoxAdapter(
                child: SizedBox(height: 100),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
