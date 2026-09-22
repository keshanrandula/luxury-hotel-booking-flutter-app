import '../entities/booking_entity.dart';

abstract class BookingRepository {
  Future<BookingEntity> createBooking(BookingEntity booking);
  Future<List<BookingEntity>> getUserBookings();
  Future<void> cancelBooking(String bookingId);
}
