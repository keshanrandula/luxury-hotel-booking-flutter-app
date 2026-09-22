import '../../../../core/local_storage/hive_service.dart';
import '../models/hotel_model.dart';

abstract class HotelLocalDataSource {
  Future<void> cacheHotels(List<HotelModel> hotels);
  List<HotelModel> getCachedHotels();
  List<String> getFavoriteIds();
  Future<void> toggleFavorite(String hotelId);
}

class HotelLocalDataSourceImpl implements HotelLocalDataSource {
  final HiveService hiveService;

  HotelLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> cacheHotels(List<HotelModel> hotels) async {
    final list = hotels.map((h) => h.toJson()).toList();
    await hiveService.cacheHotels(list);
  }

  @override
  List<HotelModel> getCachedHotels() {
    final raw = hiveService.getCachedHotels();
    final favIds = getFavoriteIds();
    return raw.map((json) {
      final id = json['id'] as String;
      return HotelModel.fromJson(json, isFavorite: favIds.contains(id));
    }).toList();
  }

  @override
  List<String> getFavoriteIds() {
    return hiveService.getFavoriteIds();
  }

  @override
  Future<void> toggleFavorite(String hotelId) async {
    await hiveService.toggleFavorite(hotelId);
  }
}
