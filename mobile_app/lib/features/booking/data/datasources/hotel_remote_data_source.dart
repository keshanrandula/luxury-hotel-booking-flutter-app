import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/hotel_model.dart';

abstract class HotelRemoteDataSource {
  Future<List<HotelModel>> getHotels({String? category, String? query});
  Future<HotelModel> getHotelDetails(String hotelId);
}

class HotelRemoteDataSourceImpl implements HotelRemoteDataSource {
  final ApiClient apiClient;

  HotelRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<HotelModel>> getHotels({String? category, String? query}) async {
    final response = await apiClient.get(
      ApiEndpoints.getHotels,
      queryParameters: {
        if (category != null && category != 'All') 'category': category,
        if (query != null && query.isNotEmpty) 'q': query,
      },
    );

    final rawList = response.data as List;
    var hotels = rawList.map((e) => HotelModel.fromJson(Map<String, dynamic>.from(e as Map))).toList();

    if (category != null && category.isNotEmpty && category != 'All') {
      hotels = hotels.where((h) => h.category.toLowerCase() == category.toLowerCase()).toList();
    }

    if (query != null && query.trim().isNotEmpty) {
      final q = query.toLowerCase().trim();
      hotels = hotels.where((h) {
        return h.name.toLowerCase().contains(q) ||
            h.location.toLowerCase().contains(q) ||
            h.city.toLowerCase().contains(q) ||
            h.country.toLowerCase().contains(q);
      }).toList();
    }

    return hotels;
  }

  @override
  Future<HotelModel> getHotelDetails(String hotelId) async {
    final hotels = await getHotels();
    final hotel = hotels.firstWhere(
      (h) => h.id == hotelId,
      orElse: () => hotels.first,
    );
    return hotel;
  }
}
