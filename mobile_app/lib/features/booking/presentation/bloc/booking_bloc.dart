import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/services/notification_service.dart';
import '../../domain/repositories/booking_repository.dart';
import 'booking_event.dart';
import 'booking_state.dart';

class BookingBloc extends Bloc<BookingEvent, BookingState> {
  final BookingRepository bookingRepository;

  BookingBloc({required this.bookingRepository}) : super(const BookingState()) {
    on<LoadUserBookingsEvent>(_onLoadUserBookings);
    on<CreateBookingEvent>(_onCreateBooking);
    on<CancelBookingEvent>(_onCancelBooking);
  }

  Future<void> _onLoadUserBookings(
    LoadUserBookingsEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(state.copyWith(status: BookingProcessStatus.loading));
    try {
      final bookings = await bookingRepository.getUserBookings();
      emit(state.copyWith(
        status: BookingProcessStatus.initial,
        bookings: bookings,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: BookingProcessStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  Future<void> _onCreateBooking(
    CreateBookingEvent event,
    Emitter<BookingState> emit,
  ) async {
    emit(state.copyWith(status: BookingProcessStatus.loading, errorMessage: null));
    try {
      final created = await bookingRepository.createBooking(event.booking);
      final allBookings = await bookingRepository.getUserBookings();

      // Trigger instant push notification
      NotificationService.instance.addNotification(
        title: 'Booking Confirmed!',
        body: 'Your reservation at ${created.hotelName} has been secured. Booking ID: #${created.id.substring(0, 8)}',
        type: 'booking',
        data: {'bookingId': created.id},
      );

      emit(state.copyWith(
        status: BookingProcessStatus.success,
        bookings: allBookings,
        lastCreatedBooking: created,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: BookingProcessStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  Future<void> _onCancelBooking(
    CancelBookingEvent event,
    Emitter<BookingState> emit,
  ) async {
    try {
      await bookingRepository.cancelBooking(event.bookingId);
      final allBookings = await bookingRepository.getUserBookings();

      NotificationService.instance.addNotification(
        title: 'Booking Cancelled',
        body: 'Your booking has been cancelled and refunded to your original payment method.',
        type: 'booking',
      );

      emit(state.copyWith(
        bookings: allBookings,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: BookingProcessStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }
}
