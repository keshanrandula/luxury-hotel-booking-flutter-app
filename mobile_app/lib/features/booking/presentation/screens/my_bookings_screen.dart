import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../domain/entities/booking_entity.dart';
import '../bloc/booking_bloc.dart';
import '../bloc/booking_event.dart';
import '../bloc/booking_state.dart';
import '../widgets/write_review_sheet.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  static const String routeName = '/my-bookings';

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    context.read<BookingBloc>().add(LoadUserBookingsEvent());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _onCancelBooking(String bookingId) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Cancel Reservation?'),
        content: const Text(
          'Are you sure you want to cancel this booking? Full refund will be processed to your account immediately.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Keep Booking'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<BookingBloc>().add(CancelBookingEvent(bookingId));
            },
            child: const Text('Cancel Trip', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'My Trips & Sanctuaries',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.accentGold,
          labelColor: AppColors.accentGold,
          unselectedLabelColor: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
          tabs: const [
            Tab(text: 'Upcoming Escapes'),
            Tab(text: 'History & Cancelled'),
          ],
        ),
      ),
      body: BlocBuilder<BookingBloc, BookingState>(
        builder: (context, state) {
          final activeBookings = state.bookings
              .where((b) => b.status == BookingStatus.confirmed || b.status == BookingStatus.active)
              .toList();

          final pastBookings = state.bookings
              .where((b) => b.status == BookingStatus.completed || b.status == BookingStatus.cancelled)
              .toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _buildBookingsList(activeBookings, isUpcoming: true, isDark: isDark),
              _buildBookingsList(pastBookings, isUpcoming: false, isDark: isDark),
            ],
          );
        },
      ),
    );
  }

  Widget _buildBookingsList(List<BookingEntity> bookings, {required bool isUpcoming, required bool isDark}) {
    if (bookings.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.luggage_rounded, size: 48, color: AppColors.accentGold),
              ),
              const SizedBox(height: 16),
              Text(
                isUpcoming ? 'No upcoming journeys' : 'No past trips yet',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                isUpcoming
                    ? 'Explore our curated luxury properties and reserve your dream getaway.'
                    : 'Your completed stays will appear here after checkout.',
                textAlign: TextAlign.center,
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

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: bookings.length,
      itemBuilder: (context, index) {
        final booking = bookings[index];
        final isCancelled = booking.status == BookingStatus.cancelled;

        return Container(
          margin: const EdgeInsets.only(bottom: 18),
          decoration: BoxDecoration(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isDark ? AppColors.borderDark : AppColors.borderLight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header image & status tag
              Stack(
                children: [
                  AspectRatio(
                    aspectRatio: 16 / 7,
                    child: Image.network(
                      booking.hotelImage,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: AppColors.secondaryNavy),
                    ),
                  ),
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: isCancelled ? AppColors.error : AppColors.success,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        booking.status.name.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      booking.hotelName,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      booking.roomName,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.accentGold,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Date & Reference
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, size: 14, color: AppColors.accentGold),
                            const SizedBox(width: 6),
                            Text(
                              DateFormatter.dateRange(booking.checkIn, booking.checkOut),
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                            ),
                          ],
                        ),
                        Text(
                          CurrencyFormatter.format(booking.grandTotal),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppColors.accentGold,
                          ),
                        ),
                      ],
                    ),

                    if (isUpcoming && !isCancelled) ...[
                      const SizedBox(height: 14),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton.icon(
                            onPressed: () => _onCancelBooking(booking.id),
                            icon: const Icon(Icons.cancel_outlined, size: 16, color: AppColors.error),
                            label: const Text(
                              'Cancel Trip',
                              style: TextStyle(color: AppColors.error, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ],

                    if (!isUpcoming && booking.status == BookingStatus.completed) ...[
                      const SizedBox(height: 14),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.verified_outlined, size: 15, color: AppColors.success),
                              SizedBox(width: 4),
                              Text(
                                'Verified Stay',
                                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.success),
                              ),
                            ],
                          ),
                          ElevatedButton.icon(
                            onPressed: () {
                              WriteReviewSheet.show(
                                context,
                                booking: booking,
                                onReviewSubmitted: () {
                                  context.read<BookingBloc>().add(LoadUserBookingsEvent());
                                },
                              );
                            },
                            icon: const Icon(Icons.star_rounded, size: 16, color: AppColors.primaryNavy),
                            label: const Text(
                              'Write a Review',
                              style: TextStyle(
                                color: AppColors.primaryNavy,
                                fontWeight: FontWeight.w700,
                                fontSize: 12.5,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.accentGold,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
