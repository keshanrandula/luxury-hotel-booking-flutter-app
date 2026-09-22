import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/notification_service.dart';
import '../../../../core/utils/currency_formatter.dart';
import '../../../../core/utils/date_formatter.dart';
import '../../../../core/utils/validators.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../domain/entities/booking_entity.dart';
import '../../domain/entities/hotel_entity.dart';
import '../../domain/entities/room_entity.dart';
import '../bloc/booking_bloc.dart';
import '../bloc/booking_event.dart';
import '../bloc/booking_state.dart';
import 'booking_success_screen.dart';

class BookingCheckoutScreen extends StatefulWidget {
  final HotelEntity hotel;
  final RoomEntity selectedRoom;

  const BookingCheckoutScreen({
    super.key,
    required this.hotel,
    required this.selectedRoom,
  });

  @override
  State<BookingCheckoutScreen> createState() => _BookingCheckoutScreenState();
}

class _BookingCheckoutScreenState extends State<BookingCheckoutScreen> {
  final _formKey = GlobalKey<FormState>();

  late DateTime _checkInDate;
  late DateTime _checkOutDate;
  int _adultsCount = 2;
  int _childrenCount = 0;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController(text: '+1 (555) 392-8819');
  final _requestsController = TextEditingController();
  final _promoController = TextEditingController();

  String _paymentMethod = 'concierge'; // 'concierge', 'card', 'apple_pay'
  String? _appliedPromoCode;
  double _discountAmount = 0.0;
  String? _promoDescription;
  String? _promoError;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _checkInDate = now.add(const Duration(days: 7));
    _checkOutDate = now.add(const Duration(days: 10));

    final currentUser = context.read<AuthBloc>().state.user;
    if (currentUser != null) {
      _nameController.text = currentUser.name;
      _emailController.text = currentUser.email;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _requestsController.dispose();
    _promoController.dispose();
    super.dispose();
  }

  int get _nights => DateFormatter.calculateNights(_checkInDate, _checkOutDate);

  int get _weekendNights {
    int count = 0;
    for (int i = 0; i < _nights; i++) {
      final d = _checkInDate.add(Duration(days: i));
      if (d.weekday == DateTime.friday || d.weekday == DateTime.saturday) {
        count++;
      }
    }
    return count;
  }

  double get _baseRoomTotal => widget.selectedRoom.pricePerNight * _nights;
  double get _weekendSurcharge =>
      _weekendNights *
      widget.selectedRoom.pricePerNight *
      (widget.selectedRoom.weekendMultiplier - 1.0);

  double get _roomSubtotal => _baseRoomTotal + _weekendSurcharge;
  double get _taxesAndFees => (_roomSubtotal * AppConstants.taxRate) + AppConstants.serviceFee;
  double get _grandTotal {
    final subtotalWithTax = _roomSubtotal + _taxesAndFees;
    final finalTotal = subtotalWithTax - _discountAmount;
    return finalTotal > 0 ? finalTotal : 0.0;
  }

  void _applyPromoCode(String code) {
    final cleanCode = code.trim().toUpperCase();
    if (cleanCode.isEmpty) return;

    final subtotal = _roomSubtotal;

    setState(() {
      _promoError = null;
    });

    if (cleanCode == 'WELCOME10') {
      if (subtotal < 500) {
        setState(() {
          _promoError = 'Minimum booking amount of \$500 required for WELCOME10';
        });
        return;
      }
      final disc = subtotal * 0.10;
      final capped = disc > 150 ? 150.0 : disc;
      setState(() {
        _appliedPromoCode = cleanCode;
        _discountAmount = capped;
        _promoDescription = '10% Welcome Discount applied';
        _promoError = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Coupon "$cleanCode" applied! You saved \$${capped.toStringAsFixed(2)}'),
          backgroundColor: AppColors.success,
        ),
      );
    } else if (cleanCode == 'HOLIDAY20') {
      if (subtotal < 2000) {
        setState(() {
          _promoError = 'Minimum booking amount of \$2,000 required for HOLIDAY20';
        });
        return;
      }
      final disc = subtotal * 0.20;
      final capped = disc > 800 ? 800.0 : disc;
      setState(() {
        _appliedPromoCode = cleanCode;
        _discountAmount = capped;
        _promoDescription = '20% Holiday Season Special applied';
        _promoError = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Coupon "$cleanCode" applied! You saved \$${capped.toStringAsFixed(2)}'),
          backgroundColor: AppColors.success,
        ),
      );
    } else if (cleanCode == 'BLACKDIAMOND') {
      if (subtotal < 3000) {
        setState(() {
          _promoError = 'Minimum booking amount of \$3,000 required for BLACKDIAMOND';
        });
        return;
      }
      setState(() {
        _appliedPromoCode = cleanCode;
        _discountAmount = 500.0;
        _promoDescription = 'VIP Elite \$500 Voucher applied';
        _promoError = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Coupon "BLACKDIAMOND" applied! You saved \$500.00'),
          backgroundColor: AppColors.success,
        ),
      );
    } else if (cleanCode == 'SUMMERSCAPE') {
      if (subtotal < 800) {
        setState(() {
          _promoError = 'Minimum booking amount of \$800 required for SUMMERSCAPE';
        });
        return;
      }
      final disc = subtotal * 0.15;
      final capped = disc > 300 ? 300.0 : disc;
      setState(() {
        _appliedPromoCode = cleanCode;
        _discountAmount = capped;
        _promoDescription = '15% Summer Gateway Escapes applied';
        _promoError = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Coupon "$cleanCode" applied! You saved \$${capped.toStringAsFixed(2)}'),
          backgroundColor: AppColors.success,
        ),
      );
    } else {
      // Generic or custom coupon from Admin
      final disc = subtotal * 0.10;
      setState(() {
        _appliedPromoCode = cleanCode;
        _discountAmount = disc;
        _promoDescription = 'Special promotion discount applied';
        _promoError = null;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Promo Code "$cleanCode" applied!'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  void _removePromoCode() {
    setState(() {
      _appliedPromoCode = null;
      _discountAmount = 0.0;
      _promoDescription = null;
      _promoError = null;
      _promoController.clear();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Promo code removed'),
      ),
    );
  }

  Future<void> _selectDateRange() async {
    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: DateTimeRange(start: _checkInDate, end: _checkOutDate),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
                  primary: AppColors.accentGold,
                  onPrimary: Colors.white,
                ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _checkInDate = picked.start;
        _checkOutDate = picked.end;
      });
    }
  }

  void _onConfirmBooking() {
    if (!widget.selectedRoom.isAvailable) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selected room is currently sold out for these dates. Please choose another room or date range.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    if (_formKey.currentState?.validate() ?? false) {
      final newBooking = BookingEntity(
        id: const Uuid().v4(),
        hotelId: widget.hotel.id,
        hotelName: widget.hotel.name,
        hotelImage: widget.selectedRoom.imageUrl,
        location: widget.hotel.location,
        roomId: widget.selectedRoom.id,
        roomName: widget.selectedRoom.name,
        checkIn: _checkInDate,
        checkOut: _checkOutDate,
        adults: _adultsCount,
        children: _childrenCount,
        nights: _nights,
        roomTotal: _roomSubtotal,
        taxesAndFees: _taxesAndFees,
        grandTotal: _grandTotal,
        guestName: _nameController.text.trim(),
        guestEmail: _emailController.text.trim(),
        guestPhone: _phoneController.text.trim(),
        specialRequests: _requestsController.text.trim().isNotEmpty ? _requestsController.text.trim() : null,
        createdAt: DateTime.now(),
      );

      context.read<BookingBloc>().add(CreateBookingEvent(newBooking));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return BlocListener<BookingBloc, BookingState>(
      listener: (context, state) {
        if (state.status == BookingProcessStatus.success && state.lastCreatedBooking != null) {
          // Trigger local in-app notification & update badge
          NotificationService.instance.notifyBookingConfirmed(state.lastCreatedBooking!);

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (_) => BookingSuccessScreen(booking: state.lastCreatedBooking!),
            ),
          );
        } else if (state.status == BookingProcessStatus.error && state.errorMessage != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.errorMessage!),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(
            'Confirm & Reserve',
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 18,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Selected Hotel & Room Summary Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.surfaceDark : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    ),
                  ),
                  child: Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Image.network(
                          widget.selectedRoom.imageUrl,
                          width: 85,
                          height: 85,
                          fit: BoxFit.cover,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.hotel.name,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.selectedRoom.name,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.accentGold,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.hotel.location,
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Trip Dates Section
                Text(
                  'Dates & Duration',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 10),
                GestureDetector(
                  onTap: _selectDateRange,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.surfaceDark : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isDark ? AppColors.borderDark : AppColors.borderLight,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.calendar_month_rounded, color: AppColors.accentGold),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  DateFormatter.dateRange(_checkInDate, _checkOutDate),
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                  ),
                                ),
                                Text(
                                  '$_nights Night${_nights > 1 ? 's' : ''} Stay',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const Text(
                          'Change',
                          style: TextStyle(
                            color: AppColors.accentGold,
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Guests Counter Section
                Text(
                  'Guests',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.surfaceDark : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Adults (18+)',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                ),
                              ),
                              Text(
                                'Ages 18 or above',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline_rounded),
                                onPressed: _adultsCount > 1
                                    ? () => setState(() => _adultsCount--)
                                    : null,
                              ),
                              Text(
                                '$_adultsCount',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.accentGold),
                                onPressed: _adultsCount < widget.selectedRoom.maxGuests
                                    ? () => setState(() => _adultsCount++)
                                    : null,
                              ),
                            ],
                          ),
                        ],
                      ),
                      const Divider(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Children (0-17)',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                  color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                                ),
                              ),
                              Text(
                                'Ages under 18',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline_rounded),
                                onPressed: _childrenCount > 0
                                    ? () => setState(() => _childrenCount--)
                                    : null,
                              ),
                              Text(
                                '$_childrenCount',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline_rounded, color: AppColors.accentGold),
                                onPressed: _childrenCount < 4
                                    ? () => setState(() => _childrenCount++)
                                    : null,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Primary Guest Information
                Text(
                  'Primary Guest Contact',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _nameController,
                  validator: (v) => Validators.validateName(v, 'Full name'),
                  decoration: const InputDecoration(
                    labelText: 'Full Name',
                    prefixIcon: Icon(Icons.person_outline_rounded, size: 20),
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  validator: Validators.validateEmail,
                  decoration: const InputDecoration(
                    labelText: 'Email Address for Itinerary',
                    prefixIcon: Icon(Icons.email_outlined, size: 20),
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  validator: Validators.validatePhone,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number for VIP Butler',
                    prefixIcon: Icon(Icons.phone_outlined, size: 20),
                  ),
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _requestsController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Special Requests (e.g. Airport pickup, champagne)',
                    prefixIcon: Icon(Icons.notes_rounded, size: 20),
                  ),
                ),
                const SizedBox(height: 24),

                // Payment Method Selector
                Text(
                  'Payment Preference',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 10),
                _buildPaymentOption(
                  id: 'concierge',
                  title: 'VIP Concierge Pay on Arrival',
                  subtitle: 'No charge today. Settle upon check-in at resort.',
                  icon: Icons.hotel_class_rounded,
                  isDark: isDark,
                ),
                const SizedBox(height: 10),
                _buildPaymentOption(
                  id: 'card',
                  title: 'Credit / Debit Card',
                  subtitle: 'Instant authorization with luxury travel protection.',
                  icon: Icons.credit_card_rounded,
                  isDark: isDark,
                ),
                const SizedBox(height: 24),

                // Promo Codes & Coupons Section
                Text(
                  'Promo Code & Special Offers',
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.surfaceDark : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: _appliedPromoCode != null
                          ? AppColors.success.withOpacity(0.5)
                          : (isDark ? AppColors.borderDark : AppColors.borderLight),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (_appliedPromoCode != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.success.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '$_appliedPromoCode Applied',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                        color: AppColors.success,
                                      ),
                                    ),
                                    if (_promoDescription != null)
                                      Text(
                                        _promoDescription!,
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: isDark ? Colors.white70 : Colors.black87,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.close_rounded, size: 18, color: Colors.grey),
                                onPressed: _removePromoCode,
                                tooltip: 'Remove Coupon',
                              ),
                            ],
                          ),
                        ),
                      ] else ...[
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _promoController,
                                textCapitalization: TextCapitalization.characters,
                                decoration: InputDecoration(
                                  hintText: 'Enter promo code (e.g. WELCOME10)',
                                  hintStyle: TextStyle(
                                    fontSize: 13,
                                    color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                  ),
                                  prefixIcon: const Icon(Icons.confirmation_number_outlined, size: 20, color: AppColors.accentGold),
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                  filled: true,
                                  fillColor: isDark ? AppColors.bgDark : const Color(0xFFF1F5F9),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            ElevatedButton(
                              onPressed: () => _applyPromoCode(_promoController.text),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.accentGold,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 0,
                              ),
                              child: const Text(
                                'Apply',
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                        if (_promoError != null) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.error_outline_rounded, size: 14, color: AppColors.error),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  _promoError!,
                                  style: const TextStyle(fontSize: 12, color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                        ],
                        const SizedBox(height: 12),
                        Text(
                          'Recommended Deals:',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildPromoChip('WELCOME10', '10% OFF (Min \$500)', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('HOLIDAY20', '20% OFF (Min \$2k)', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('BLACKDIAMOND', '\$500 Flat Voucher', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('SUMMERSCAPE', '15% OFF (Min \$800)', isDark),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Price Breakdown Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.surfaceDark : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    ),
                  ),
                  child: Column(
                    children: [
                      _buildPriceRow(
                        '${CurrencyFormatter.format(widget.selectedRoom.pricePerNight)} x $_nights nights',
                        CurrencyFormatter.format(_baseRoomTotal),
                        isDark,
                      ),
                      if (_weekendNights > 0 && _weekendSurcharge > 0) ...[
                        const SizedBox(height: 8),
                        _buildPriceRow(
                          'Weekend Rate Adjustment ($_weekendNights nights)',
                          '+ ${CurrencyFormatter.format(_weekendSurcharge)}',
                          isDark,
                        ),
                      ],
                      const SizedBox(height: 8),
                      _buildPriceRow('Taxes & Tourism Levy (12%)', CurrencyFormatter.format(_roomSubtotal * AppConstants.taxRate), isDark),
                      const SizedBox(height: 8),
                      _buildPriceRow('Resort & Wellness Fee', CurrencyFormatter.format(AppConstants.serviceFee), isDark),
                      if (_discountAmount > 0) ...[
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.local_offer_rounded, size: 14, color: AppColors.success),
                                const SizedBox(width: 6),
                                Text(
                                  'Promo Discount (${_appliedPromoCode ?? "Coupon"})',
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.success,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              '- ${CurrencyFormatter.format(_discountAmount)}',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: AppColors.success,
                              ),
                            ),
                          ],
                        ),
                      ],
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Divider(),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total Price',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 17,
                              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (_discountAmount > 0)
                                Text(
                                  CurrencyFormatter.format(_roomSubtotal + _taxesAndFees),
                                  style: TextStyle(
                                    fontSize: 13,
                                    decoration: TextDecoration.lineThrough,
                                    color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                                  ),
                                ),
                              Text(
                                CurrencyFormatter.format(_grandTotal),
                                style: const TextStyle(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 22,
                                  color: AppColors.accentGold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom Reserve Button
        bottomSheet: Container(
          padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
          decoration: BoxDecoration(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            border: Border(
              top: BorderSide(
                color: isDark ? AppColors.borderDark : AppColors.borderLight,
              ),
            ),
          ),
          child: SafeArea(
            top: false,
            child: BlocBuilder<BookingBloc, BookingState>(
              builder: (context, state) {
                final isLoading = state.status == BookingProcessStatus.loading;

                return SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: isLoading ? null : _onConfirmBooking,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentGold,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: isLoading
                        ? const SizedBox(
                            height: 22,
                            width: 22,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.lock_outline_rounded, size: 18, color: Colors.white),
                              const SizedBox(width: 8),
                              Text(
                                'Confirm Reservation • ${CurrencyFormatter.format(_grandTotal)}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOption({
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isDark,
  }) {
    final isSelected = _paymentMethod == id;

    return GestureDetector(
      onTap: () => setState(() => _paymentMethod = id),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.accentGold.withOpacity(0.08)
              : (isDark ? AppColors.surfaceDark : Colors.white),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.accentGold : (isDark ? AppColors.borderDark : AppColors.borderLight),
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, color: isSelected ? AppColors.accentGold : (isDark ? Colors.white70 : Colors.black54)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11,
                      color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                    ),
                  ),
                ],
              ),
            ),
            Radio<String>(
              value: id,
              groupValue: _paymentMethod,
              activeColor: AppColors.accentGold,
              onChanged: (val) => setState(() => _paymentMethod = val!),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, String amount, bool isDark) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
          ),
        ),
        Text(
          amount,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
      ],
    );
  }

  Widget _buildPromoChip(String code, String subtitle, bool isDark) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          _promoController.text = code;
          _applyPromoCode(code);
        },
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.accentGold.withOpacity(0.08),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: AppColors.accentGold.withOpacity(0.35),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.local_offer_outlined, size: 13, color: AppColors.accentGold),
              const SizedBox(width: 5),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    code,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.accentGold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w500,
                      color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
