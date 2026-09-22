import 'package:equatable/equatable.dart';
import '../../domain/entities/booking_entity.dart';

abstract class BookingEvent extends Equatable {
  const BookingEvent();

  @override
  List<Object?> get props => [];
}

class LoadUserBookingsEvent extends BookingEvent {}

class CreateBookingEvent extends BookingEvent {
  final BookingEntity booking;

  const CreateBookingEvent(this.booking);

  @override
  List<Object?> get props => [booking];
}

class CancelBookingEvent extends BookingEvent {
  final String bookingId;

  const CancelBookingEvent(this.bookingId);

  @override
  List<Object?> get props => [bookingId];
}
