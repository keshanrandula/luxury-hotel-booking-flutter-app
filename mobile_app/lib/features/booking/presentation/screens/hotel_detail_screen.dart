import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../domain/entities/hotel_entity.dart';
import '../../domain/entities/room_entity.dart';
import '../bloc/hotel_bloc.dart';
import '../bloc/hotel_event.dart';
import '../bloc/hotel_state.dart';
import '../widgets/amenity_chip.dart';
import '../widgets/review_card.dart';
import 'booking_checkout_screen.dart';

class HotelDetailScreen extends StatefulWidget {
  final HotelEntity hotel;

  const HotelDetailScreen({super.key, required this.hotel});

  @override
  State<HotelDetailScreen> createState() => _HotelDetailScreenState();
}

class _HotelDetailScreenState extends State<HotelDetailScreen> {
  int _activeImageIndex = 0;
  late RoomEntity _selectedRoom;
  final PageController _imagePageController = PageController();

  @override
  void initState() {
    super.initState();
    _selectedRoom = widget.hotel.rooms.isNotEmpty
        ? widget.hotel.rooms.first
        : RoomEntity(
            id: 'default-rm',
            name: 'Deluxe Ocean Sanctuary',
            bedType: '1 King Bed',
            maxGuests: 2,
            sizeSqM: 110,
            pricePerNight: widget.hotel.pricePerNight,
            imageUrl: widget.hotel.images.first,
            features: const ['Balcony', 'Ocean View', 'Marble Bath'],
          );
  }

  @override
  void dispose() {
    _imagePageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final hotel = widget.hotel;

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Sliver App Bar with Image Carousel
              SliverAppBar(
                expandedHeight: 380,
                pinned: true,
                stretch: true,
                backgroundColor: isDark ? AppColors.bgDark : Colors.white,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 18),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ),
                actions: [
                  BlocBuilder<HotelBloc, HotelState>(
                    builder: (context, state) {
                      final isFav = state.favoriteHotelIds.contains(hotel.id);
                      return Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: CircleAvatar(
                          backgroundColor: Colors.black.withOpacity(0.5),
                          child: IconButton(
                            icon: Icon(
                              isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                              color: isFav ? AppColors.error : Colors.white,
                              size: 20,
                            ),
                            onPressed: () {
                              context.read<HotelBloc>().add(ToggleFavoriteEvent(hotel.id));
                              ScaffoldMessenger.of(context).hideCurrentSnackBar();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    isFav
                                        ? 'Removed "${hotel.name}" from your wishlist'
                                        : 'Saved "${hotel.name}" to your luxury wishlist ❤️',
                                  ),
                                  duration: const Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                              );
                            },
                          ),
                        ),
                      );
                    },
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      PageView.builder(
                        controller: _imagePageController,
                        onPageChanged: (index) {
                          setState(() => _activeImageIndex = index);
                        },
                        itemCount: hotel.images.length,
                        itemBuilder: (context, index) {
                          return Hero(
                            tag: index == 0 ? 'hotel-img-${hotel.id}' : 'hotel-img-${hotel.id}-$index',
                            child: Image.network(
                              hotel.images[index],
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(color: AppColors.secondaryNavy),
                            ),
                          );
                        },
                      ),
                      // Carousel Indicator Dots
                      Positioned(
                        bottom: 24,
                        left: 0,
                        right: 0,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(
                            hotel.images.length,
                            (index) => AnimatedContainer(
                              duration: const Duration(milliseconds: 250),
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              width: _activeImageIndex == index ? 24 : 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: _activeImageIndex == index ? AppColors.accentGold : Colors.white.withOpacity(0.6),
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Hotel Information Body
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Category Tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.accentGold.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          hotel.category.toUpperCase(),
                          style: const TextStyle(
                            color: AppColors.accentGold,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Hotel Name & Tagline
                      Text(
                        hotel.name,
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      if (hotel.tagline.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          hotel.tagline,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                          ),
                        ),
                      ],
                      const SizedBox(height: 12),

                      // Location & Rating Summary Row
                      Row(
                        children: [
                          const Icon(Icons.location_on_rounded, size: 16, color: AppColors.accentGold),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              hotel.location,
                              style: TextStyle(
                                fontSize: 13,
                                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Row(
                            children: [
                              const Icon(Icons.star_rounded, size: 18, color: AppColors.starRating),
                              const SizedBox(width: 4),
                              Text(
                                hotel.rating.toStringAsFixed(2),
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                ' (${hotel.reviewCount})',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      const Divider(),
                      const SizedBox(height: 20),

                      // About Property Section
                      Text(
                        'About The Property',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        hotel.description,
                        style: TextStyle(
                          fontSize: 14,
                          height: 1.6,
                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Amenities Grid / Wrap
                      Text(
                        'Exclusive Amenities',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 14),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: hotel.amenities.map((amenity) => AmenityChip(label: amenity)).toList(),
                      ),
                      const SizedBox(height: 28),

                      // Select Room Section
                      Text(
                        'Select Accommodation',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...hotel.rooms.map((room) {
                        final isSelected = _selectedRoom.id == room.id;

                        return GestureDetector(
                          onTap: () {
                            setState(() => _selectedRoom = room);
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            margin: const EdgeInsets.only(bottom: 14),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppColors.accentGold.withOpacity(0.08)
                                  : (isDark ? AppColors.surfaceDark : Colors.white),
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: isSelected
                                    ? AppColors.accentGold
                                    : (isDark ? AppColors.borderDark : AppColors.borderLight),
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: Image.network(
                                    room.imageUrl,
                                    width: 80,
                                    height: 80,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        room.name,
                                        style: TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 15,
                                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${room.bedType} • Up to ${room.maxGuests} guests • ${room.sizeSqM} m²',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Row(
                                        children: [
                                          Text(
                                            CurrencyFormatter.formatPerNight(room.pricePerNight),
                                            style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w800,
                                              color: AppColors.accentGold,
                                            ),
                                          ),
                                          if (room.weekendMultiplier > 1.0) ...[
                                            const SizedBox(width: 8),
                                            Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: AppColors.accentGold.withOpacity(0.12),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                'Weekend +${((room.weekendMultiplier - 1.0) * 100).toInt()}%',
                                                style: const TextStyle(
                                                  fontSize: 9.5,
                                                  fontWeight: FontWeight.w700,
                                                  color: AppColors.accentGold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      if (room.isLowStock) ...[
                                        const SizedBox(height: 5),
                                        Row(
                                          children: [
                                            const Icon(Icons.local_fire_department_rounded, size: 13, color: AppColors.error),
                                            const SizedBox(width: 3),
                                            Text(
                                              'Only ${room.availableCount} left in inventory!',
                                              style: const TextStyle(
                                                fontSize: 10.5,
                                                fontWeight: FontWeight.w700,
                                                color: AppColors.error,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                                Radio<String>(
                                  value: room.id,
                                  groupValue: _selectedRoom.id,
                                  activeColor: AppColors.accentGold,
                                  onChanged: (val) {
                                    setState(() => _selectedRoom = room);
                                  },
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                      const SizedBox(height: 24),

                      // Verified Guest Reviews
                      if (hotel.reviews.isNotEmpty) ...[
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Guest Experiences',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w700,
                                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                              ),
                            ),
                            Text(
                              '${hotel.reviews.length} Verified',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: AppColors.accentGold,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        SizedBox(
                          height: 175,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: hotel.reviews.length,
                            itemBuilder: (context, index) {
                              return ReviewCard(review: hotel.reviews[index]);
                            },
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Sticky Bottom Booking Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
              decoration: BoxDecoration(
                color: isDark ? AppColors.surfaceDark : Colors.white,
                border: Border(
                  top: BorderSide(
                    color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    width: 1,
                  ),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.12),
                    blurRadius: 20,
                    offset: const Offset(0, -6),
                  ),
                ],
              ),
              child: SafeArea(
                top: false,
                child: Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Starting at',
                          style: TextStyle(
                            fontSize: 11,
                            color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          ),
                        ),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              CurrencyFormatter.format(_selectedRoom.pricePerNight),
                              style: const TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: AppColors.accentGold,
                              ),
                            ),
                            Text(
                              ' / night',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => BookingCheckoutScreen(
                              hotel: hotel,
                              selectedRoom: _selectedRoom,
                            ),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accentGold,
                        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Book Sanctuary',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward_rounded, size: 18, color: Colors.white),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
