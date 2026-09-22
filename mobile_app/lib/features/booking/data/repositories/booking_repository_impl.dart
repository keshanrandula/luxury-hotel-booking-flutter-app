import '../../domain/entities/booking_entity.dart';
import '../../domain/repositories/booking_repository.dart';
import '../datasources/booking_local_data_source.dart';
import '../datasources/booking_remote_data_source.dart';
import '../models/booking_model.dart';

class BookingRepositoryImpl implements BookingRepository {
  final BookingLocalDataSource localDataSource;
  final BookingRemoteDataSource? remoteDataSource;

  BookingRepositoryImpl({
    required this.localDataSource,
    this.remoteDataSource,
  });

  @override
  Future<BookingEntity> createBooking(BookingEntity booking) async {
    final model = BookingModel.fromEntity(booking);
    BookingModel result = model;
    
    // Save to remote backend API if available
    if (remoteDataSource != null) {
      try {
        result = await remoteDataSource!.createBooking(model);
      } catch (e) {
        // Fallback to local if network fails
      }
    }

    // Always cache locally
    await localDataSource.saveBooking(result);
    return result;
  }

  @override
  Future<List<BookingEntity>> getUserBookings() async {
    if (remoteDataSource != null) {
      try {
        final remoteBookings = await remoteDataSource!.getUserBookings();
        if (remoteBookings.isNotEmpty) {
          return remoteBookings;
        }
      } catch (_) {}
    }
    return localDataSource.getBookings();
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    if (remoteDataSource != null) {
      try {
        await remoteDataSource!.cancelBooking(bookingId);
      } catch (_) {}
    }
    await localDataSource.cancelBooking(bookingId);
  }
}

