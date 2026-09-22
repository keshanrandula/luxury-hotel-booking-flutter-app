import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/hotel_entity.dart';
import '../bloc/hotel_bloc.dart';
import '../bloc/hotel_event.dart';
import '../bloc/hotel_state.dart';
import '../widgets/hotel_card.dart';
import 'hotel_detail_screen.dart';

class WishlistScreen extends StatefulWidget {
  final VoidCallback? onExploreTap;

  const WishlistScreen({super.key, this.onExploreTap});

  static const String routeName = '/wishlist';

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Beachfront',
    'Mountain',
    'Luxury',
    'Boutique',
    'Hill Country',
    'Villas',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Saved Sanctuaries',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        actions: [
          BlocBuilder<HotelBloc, HotelState>(
            builder: (context, state) {
              final count = state.favoriteHotelIds.length;
              if (count == 0) return const SizedBox.shrink();
              return Container(
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accentGold.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.favorite_rounded, size: 14, color: AppColors.error),
                    const SizedBox(width: 5),
                    Text(
                      '$count Saved',
                      style: const TextStyle(
                        color: AppColors.accentGold,
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: BlocBuilder<HotelBloc, HotelState>(
        builder: (context, state) {
          // Find all favorite hotels from both hotels list and featured
          final allHotelsMap = <String, HotelEntity>{};
          for (final h in state.hotels) {
            allHotelsMap[h.id] = h;
          }
          for (final h in state.featuredHotels) {
            allHotelsMap[h.id] = h;
          }

          final favoriteHotels = state.favoriteHotelIds
              .where((id) => allHotelsMap.containsKey(id))
              .map((id) => allHotelsMap[id]!)
              .toList();

          final filteredHotels = _selectedCategory == 'All'
              ? favoriteHotels
              : favoriteHotels
                  .where((h) => h.category.toLowerCase() == _selectedCategory.toLowerCase())
                  .toList();

          if (favoriteHotels.isEmpty) {
            return _buildEmptyState(context, isDark);
          }

          return CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Category Filter Rail
              SliverToBoxAdapter(
                child: Container(
                  height: 44,
                  margin: const EdgeInsets.only(top: 8, bottom: 14),
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: _categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      final isSelected = _selectedCategory == category;

                      return GestureDetector(
                        onTap: () => setState(() => _selectedCategory = category),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.accentGold
                                : (isDark ? AppColors.surfaceDark : Colors.white),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.accentGold
                                  : (isDark ? AppColors.borderDark : AppColors.borderLight),
                            ),
                          ),
                          child: Center(
                            child: Text(
                              category,
                              style: TextStyle(
                                fontSize: 12.5,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                color: isSelected
                                    ? AppColors.primaryNavy
                                    : (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),

              // Summary counter
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _selectedCategory == 'All' ? 'All Saved Properties' : '$_selectedCategory Sanctuaries',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      Text(
                        '${filteredHotels.length} ${filteredHotels.length == 1 ? 'Property' : 'Properties'}',
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 8)),

              // Saved Hotel Cards
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final hotel = filteredHotels[index];
                      return HotelCard(
                        hotel: hotel.copyWith(isFavorite: true),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => HotelDetailScreen(hotel: hotel),
                            ),
                          );
                        },
                        onToggleFavorite: () {
                          context.read<HotelBloc>().add(ToggleFavoriteEvent(hotel.id));

                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Removed "${hotel.name}" from your wishlist'),
                              action: SnackBarAction(
                                label: 'Undo',
                                textColor: AppColors.accentGold,
                                onPressed: () {
                                  context.read<HotelBloc>().add(ToggleFavoriteEvent(hotel.id));
                                },
                              ),
                              behavior: SnackBarBehavior.floating,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          );
                        },
                      );
                    },
                    childCount: filteredHotels.length,
                  ),
                ),
              ),

              const SliverToBoxAdapter(child: SizedBox(height: 24)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, bool isDark) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.favorite_border_rounded,
                size: 54,
                color: AppColors.error,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Your Wishlist is Empty',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.3,
                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Explore our curated luxury portfolio and tap the heart icon on any sanctuary to save it for your next journey.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                height: 1.4,
                color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: widget.onExploreTap ?? () => Navigator.pop(context),
              icon: const Icon(Icons.explore_rounded, size: 18, color: AppColors.primaryNavy),
              label: const Text(
                'Explore Sanctuaries',
                style: TextStyle(
                  color: AppColors.primaryNavy,
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accentGold,
                elevation: 4,
                shadowColor: AppColors.accentGold.withOpacity(0.3),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
