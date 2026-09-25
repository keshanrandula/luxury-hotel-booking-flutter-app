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
      if (currentUser.phone != null && currentUser.phone!.isNotEmpty) {
        _phoneController.text = currentUser.phone!;
      }
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

    final cardBg = isDark ? const Color(0xFF131B2E) : Colors.white;
    final borderColor = isDark ? const Color(0xFF2A364F) : const Color(0xFFE2E8F0);
    final inputBg = isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final textPrimary = isDark ? const Color(0xFFF8FAFC) : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

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
        backgroundColor: isDark ? const Color(0xFF090D16) : const Color(0xFFF8FAFC),
        appBar: AppBar(
          backgroundColor: isDark ? const Color(0xFF090D16) : Colors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back_ios_new_rounded, size: 18, color: textPrimary),
            onPressed: () => Navigator.pop(context),
          ),
          title: Text(
            'Confirm & Reserve',
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 18,
              color: textPrimary,
              letterSpacing: -0.2,
            ),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Hotel & Room Summary Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Image.network(
                          widget.selectedRoom.imageUrl,
                          width: 84,
                          height: 84,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            width: 84,
                            height: 84,
                            color: isDark ? const Color(0xFF1E293B) : const Color(0xFFE2E8F0),
                            child: const Icon(Icons.hotel, color: AppColors.accentGold),
                          ),
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
                                fontWeight: FontWeight.w800,
                                color: textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.accentGold.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                widget.selectedRoom.name,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.accentGold,
                                  fontWeight: FontWeight.w700,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                Icon(Icons.location_on_outlined, size: 14, color: textSecondary),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    widget.hotel.location,
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: textSecondary,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 2. Dates & Duration Section
                _buildSectionHeader('Dates & Duration', textPrimary),
                const SizedBox(height: 8),
                InkWell(
                  onTap: _selectDateRange,
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: borderColor),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppColors.accentGold.withOpacity(0.12),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.calendar_month_rounded, color: AppColors.accentGold, size: 20),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  DateFormatter.dateRange(_checkInDate, _checkOutDate),
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                    color: textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '$_nights Night${_nights > 1 ? 's' : ''} Stay',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'Change',
                            style: TextStyle(
                              color: AppColors.accentGold,
                              fontWeight: FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // 3. Guests Section
                _buildSectionHeader('Guests', textPrimary),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    children: [
                      // Adults Counter
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Adults',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                  color: textPrimary,
                                ),
                              ),
                              Text(
                                'Age 18 and above',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: textSecondary,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              _buildCounterBtn(
                                icon: Icons.remove,
                                isEnabled: _adultsCount > 1,
                                isDark: isDark,
                                onTap: () => setState(() => _adultsCount--),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                child: Text(
                                  '$_adultsCount',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16,
                                    color: textPrimary,
                                  ),
                                ),
                              ),
                              _buildCounterBtn(
                                icon: Icons.add,
                                isEnabled: _adultsCount < widget.selectedRoom.maxGuests,
                                isDark: isDark,
                                onTap: () => setState(() => _adultsCount++),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Divider(color: borderColor, height: 1),
                      ),
                      // Children Counter
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Children',
                                style: TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                  color: textPrimary,
                                ),
                              ),
                              Text(
                                'Age 0 to 17',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: textSecondary,
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              _buildCounterBtn(
                                icon: Icons.remove,
                                isEnabled: _childrenCount > 0,
                                isDark: isDark,
                                onTap: () => setState(() => _childrenCount--),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 14),
                                child: Text(
                                  '$_childrenCount',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 16,
                                    color: textPrimary,
                                  ),
                                ),
                              ),
                              _buildCounterBtn(
                                icon: Icons.add,
                                isEnabled: _childrenCount < 4,
                                isDark: isDark,
                                onTap: () => setState(() => _childrenCount++),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 4. Primary Guest Information
                _buildSectionHeader('Primary Guest Contact', textPrimary),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInputLabel('Full Name', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _nameController,
                        style: TextStyle(color: textPrimary, fontSize: 14),
                        validator: (v) => Validators.validateName(v, 'Full name'),
                        decoration: _buildInputDecoration(
                          hint: 'e.g. Alexander Vance',
                          icon: Icons.person_outline_rounded,
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textSecondary: textSecondary,
                        ),
                      ),
                      const SizedBox(height: 14),

                      _buildInputLabel('Email Address (for Itinerary & Confirmation)', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        style: TextStyle(color: textPrimary, fontSize: 14),
                        validator: Validators.validateEmail,
                        decoration: _buildInputDecoration(
                          hint: 'e.g. member@luxurystays.com',
                          icon: Icons.email_outlined,
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textSecondary: textSecondary,
                        ),
                      ),
                      const SizedBox(height: 14),

                      _buildInputLabel('Contact Phone Number (for VIP Butler)', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        style: TextStyle(color: textPrimary, fontSize: 14),
                        validator: Validators.validatePhone,
                        decoration: _buildInputDecoration(
                          hint: '+94 77 123 4567',
                          icon: Icons.phone_outlined,
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textSecondary: textSecondary,
                        ),
                      ),
                      const SizedBox(height: 14),

                      _buildInputLabel('Special Requests (Optional)', textPrimary),
                      const SizedBox(height: 6),
                      TextFormField(
                        controller: _requestsController,
                        maxLines: 2,
                        style: TextStyle(color: textPrimary, fontSize: 14),
                        decoration: _buildInputDecoration(
                          hint: 'e.g. High floor, Airport limousine, Champagne on arrival',
                          icon: Icons.notes_rounded,
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textSecondary: textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 5. Payment Preference
                _buildSectionHeader('Payment Preference', textPrimary),
                const SizedBox(height: 8),
                _buildPaymentOption(
                  id: 'concierge',
                  title: 'VIP Concierge Pay on Arrival',
                  subtitle: 'No charge today. Settle upon check-in at resort.',
                  icon: Icons.hotel_class_rounded,
                  isDark: isDark,
                  cardBg: cardBg,
                  borderColor: borderColor,
                  textPrimary: textPrimary,
                  textSecondary: textSecondary,
                ),
                const SizedBox(height: 10),
                _buildPaymentOption(
                  id: 'card',
                  title: 'Credit / Debit Card',
                  subtitle: 'Instant authorization with luxury travel protection.',
                  icon: Icons.credit_card_rounded,
                  isDark: isDark,
                  cardBg: cardBg,
                  borderColor: borderColor,
                  textPrimary: textPrimary,
                  textSecondary: textSecondary,
                ),
                const SizedBox(height: 20),

                // 6. Promo Codes & Coupons Section
                _buildSectionHeader('Promo Code & Special Offers', textPrimary),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _appliedPromoCode != null ? AppColors.success : borderColor,
                      width: _appliedPromoCode != null ? 1.5 : 1,
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
                            border: Border.all(color: AppColors.success.withOpacity(0.4)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 22),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '$_appliedPromoCode Applied',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w800,
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
                                style: TextStyle(color: textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
                                decoration: InputDecoration(
                                  hintText: 'Enter code (e.g. WELCOME10)',
                                  hintStyle: TextStyle(fontSize: 13, color: textSecondary),
                                  prefixIcon: const Icon(Icons.confirmation_number_outlined, size: 18, color: AppColors.accentGold),
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                  filled: true,
                                  fillColor: inputBg,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(color: borderColor),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(color: borderColor),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: const BorderSide(color: AppColors.accentGold, width: 1.5),
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
                                style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
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
                          'Available Offers:',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: textSecondary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildPromoChip('WELCOME10', '10% OFF', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('HOLIDAY20', '20% OFF', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('BLACKDIAMOND', '\$500 OFF', isDark),
                              const SizedBox(width: 8),
                              _buildPromoChip('SUMMERSCAPE', '15% OFF', isDark),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 7. Price Breakdown Card
                _buildSectionHeader('Price Summary', textPrimary),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    children: [
                      _buildPriceRow(
                        '${CurrencyFormatter.format(widget.selectedRoom.pricePerNight)} × $_nights nights',
                        CurrencyFormatter.format(_baseRoomTotal),
                        textPrimary,
                        textSecondary,
                      ),
                      if (_weekendNights > 0 && _weekendSurcharge > 0) ...[
                        const SizedBox(height: 8),
                        _buildPriceRow(
                          'Weekend Rate Adjustment ($_weekendNights nights)',
                          '+ ${CurrencyFormatter.format(_weekendSurcharge)}',
                          textPrimary,
                          textSecondary,
                        ),
                      ],
                      const SizedBox(height: 8),
                      _buildPriceRow(
                        'Taxes & Tourism Levy (12%)',
                        CurrencyFormatter.format(_roomSubtotal * AppConstants.taxRate),
                        textPrimary,
                        textSecondary,
                      ),
                      const SizedBox(height: 8),
                      _buildPriceRow(
                        'Resort & Wellness Fee',
                        CurrencyFormatter.format(AppConstants.serviceFee),
                        textPrimary,
                        textSecondary,
                      ),
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
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.success,
                                  ),
                                ),
                              ],
                            ),
                            Text(
                              '- ${CurrencyFormatter.format(_discountAmount)}',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: AppColors.success,
                              ),
                            ),
                          ],
                        ),
                      ],
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Divider(color: borderColor, height: 1),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Grand Total',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 16,
                              color: textPrimary,
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              if (_discountAmount > 0)
                                Text(
                                  CurrencyFormatter.format(_roomSubtotal + _taxesAndFees),
                                  style: TextStyle(
                                    fontSize: 12,
                                    decoration: TextDecoration.lineThrough,
                                    color: textSecondary,
                                  ),
                                ),
                              Text(
                                CurrencyFormatter.format(_grandTotal),
                                style: const TextStyle(
                                  fontWeight: FontWeight.w900,
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
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),

        // Bottom Sticky Reservation Button
        bottomNavigationBar: Container(
          padding: const EdgeInsets.fromLTRB(18, 12, 18, 18),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF131B2E) : Colors.white,
            border: Border(
              top: BorderSide(color: borderColor, width: 1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(isDark ? 0.4 : 0.08),
                blurRadius: 16,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: BlocBuilder<BookingBloc, BookingState>(
              builder: (context, state) {
                final isLoading = state.status == BookingProcessStatus.loading;

                return ElevatedButton(
                  onPressed: isLoading ? null : _onConfirmBooking,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accentGold,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 0,
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
                                fontWeight: FontWeight.w800,
                                letterSpacing: 0.3,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color textColor) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w800,
        color: textColor,
        letterSpacing: -0.2,
      ),
    );
  }

  Widget _buildInputLabel(String label, Color textColor) {
    return Text(
      label,
      style: TextStyle(
        fontSize: 12.5,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
    );
  }

  InputDecoration _buildInputDecoration({
    required String hint,
    required IconData icon,
    required Color inputBg,
    required Color borderColor,
    required Color textSecondary,
  }) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(fontSize: 13, color: textSecondary.withOpacity(0.7)),
      prefixIcon: Icon(icon, size: 18, color: textSecondary),
      filled: true,
      fillColor: inputBg,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppColors.accentGold, width: 1.5),
      ),
    );
  }

  Widget _buildCounterBtn({
    required IconData icon,
    required bool isEnabled,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: isEnabled ? onTap : null,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          width: 34,
          height: 34,
          decoration: BoxDecoration(
            color: isEnabled
                ? (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9))
                : (isDark ? const Color(0xFF131B2E) : const Color(0xFFF8FAFC)),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isEnabled ? AppColors.accentGold.withOpacity(0.4) : Colors.transparent,
            ),
          ),
          child: Icon(
            icon,
            size: 18,
            color: isEnabled ? AppColors.accentGold : (isDark ? Colors.white24 : Colors.black26),
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
    required Color cardBg,
    required Color borderColor,
    required Color textPrimary,
    required Color textSecondary,
  }) {
    final isSelected = _paymentMethod == id;

    return InkWell(
      onTap: () => setState(() => _paymentMethod = id),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.accentGold.withOpacity(0.08) : cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.accentGold : borderColor,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.accentGold.withOpacity(0.15) : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: isSelected ? AppColors.accentGold : textSecondary,
                size: 20,
              ),
            ),
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
                      color: textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 11.5,
                      color: textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.accentGold : textSecondary.withOpacity(0.5),
                  width: 2,
                ),
              ),
              child: isSelected
                  ? Center(
                      child: Container(
                        width: 10,
                        height: 10,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.accentGold,
                        ),
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, String amount, Color textPrimary, Color textSecondary) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: textSecondary,
          ),
        ),
        Text(
          amount,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: textPrimary,
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
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
          decoration: BoxDecoration(
            color: AppColors.accentGold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: AppColors.accentGold.withOpacity(0.35),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.local_offer_outlined, size: 13, color: AppColors.accentGold),
              const SizedBox(width: 6),
              Text(
                '$code ($subtitle)',
                style: const TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.accentGold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
