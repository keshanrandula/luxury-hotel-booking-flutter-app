import 'package:equatable/equatable.dart';
import '../../domain/entities/booking_entity.dart';

enum BookingProcessStatus { initial, loading, success, error }

class BookingState extends Equatable {
  final BookingProcessStatus status;
  final List<BookingEntity> bookings;
  final BookingEntity? lastCreatedBooking;
  final String? errorMessage;

  const BookingState({
    this.status = BookingProcessStatus.initial,
    this.bookings = const [],
    this.lastCreatedBooking,
    this.errorMessage,
  });

  BookingState copyWith({
    BookingProcessStatus? status,
    List<BookingEntity>? bookings,
    BookingEntity? lastCreatedBooking,
    String? errorMessage,
  }) {
    return BookingState(
      status: status ?? this.status,
      bookings: bookings ?? this.bookings,
      lastCreatedBooking: lastCreatedBooking ?? this.lastCreatedBooking,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, bookings, lastCreatedBooking, errorMessage];
}
