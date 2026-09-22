import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/booking_model.dart';

abstract class BookingRemoteDataSource {
  Future<BookingModel> createBooking(BookingModel booking);
  Future<List<BookingModel>> getUserBookings();
  Future<void> cancelBooking(String bookingId);
}

class BookingRemoteDataSourceImpl implements BookingRemoteDataSource {
  final ApiClient apiClient;

  BookingRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<BookingModel> createBooking(BookingModel booking) async {
    final response = await apiClient.post(
      ApiEndpoints.createBooking,
      data: booking.toJson(),
    );

    final data = response.data;
    if (data is Map<String, dynamic> && data['data'] != null) {
      return BookingModel.fromJson(Map<String, dynamic>.from(data['data'] as Map));
    }
    if (data is Map<String, dynamic>) {
      return BookingModel.fromJson(data);
    }
    return booking;
  }

  @override
  Future<List<BookingModel>> getUserBookings() async {
    final response = await apiClient.get(ApiEndpoints.getUserBookings);
    final data = response.data;

    List list = [];
    if (data is List) {
      list = data;
    } else if (data is Map<String, dynamic> && data['bookings'] is List) {
      list = data['bookings'] as List;
    }

    return list.map((e) => BookingModel.fromJson(Map<String, dynamic>.from(e as Map))).toList();
  }

  @override
  Future<void> cancelBooking(String bookingId) async {
    await apiClient.post('/bookings/$bookingId/cancel');
  }
}
