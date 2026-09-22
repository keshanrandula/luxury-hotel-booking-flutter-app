import '../../../../core/local_storage/hive_service.dart';
import '../../domain/entities/booking_entity.dart';
import '../models/booking_model.dart';

abstract class BookingLocalDataSource {
  Future<void> saveBooking(BookingModel booking);
  List<BookingModel> getBookings();
  Future<void> cancelBooking(String bookingId);
}

class BookingLocalDataSourceImpl implements BookingLocalDataSource {
  final HiveService hiveService;

  BookingLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> saveBooking(BookingModel booking) async {
    await hiveService.saveBooking(booking.toJson());
  }

  @override
  List<BookingModel> getBookings() {
    final list = hiveService.getBookings();
    return list.map((json) => BookingModel.fromJson(json)).toList();
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    final bookings = getBookings();
    final index = bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      final updated = bookings[index].copyWith(status: BookingStatus.cancelled);
      await hiveService.saveBooking(BookingModel.fromEntity(updated).toJson());
    }
  }
}
