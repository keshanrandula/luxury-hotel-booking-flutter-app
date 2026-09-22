import '../../domain/entities/hotel_entity.dart';
import '../../domain/repositories/hotel_repository.dart';
import '../datasources/hotel_local_data_source.dart';
import '../datasources/hotel_remote_data_source.dart';

class HotelRepositoryImpl implements HotelRepository {
  final HotelRemoteDataSource remoteDataSource;
  final HotelLocalDataSource localDataSource;

  HotelRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<List<HotelEntity>> getHotels({String? category, String? query}) async {
    try {
      final remoteHotels = await remoteDataSource.getHotels(
        category: category,
        query: query,
      );
      // Cache remote hotels
      if (category == null && query == null) {
        await localDataSource.cacheHotels(remoteHotels);
      }

      final favIds = localDataSource.getFavoriteIds();
      return remoteHotels.map((h) {
        return h.copyWith(isFavorite: favIds.contains(h.id));
      }).toList();
    } catch (_) {
      // Offline fallback
      final cached = localDataSource.getCachedHotels();
      if (cached.isNotEmpty) {
        var filtered = cached;
        if (category != null && category != 'All') {
          filtered = filtered.where((h) => h.category.toLowerCase() == category.toLowerCase()).toList();
        }
        if (query != null && query.isNotEmpty) {
          final q = query.toLowerCase();
          filtered = filtered.where((h) => h.name.toLowerCase().contains(q) || h.location.toLowerCase().contains(q)).toList();
        }
        return filtered;
      }
      rethrow;
    }
  }

  @override
  Future<HotelEntity> getHotelDetails(String hotelId) async {
    final hotel = await remoteDataSource.getHotelDetails(hotelId);
    final isFav = localDataSource.getFavoriteIds().contains(hotelId);
    return hotel.copyWith(isFavorite: isFav);
  }

  @override
  Future<List<HotelEntity>> getFeaturedHotels() async {
    final hotels = await getHotels();
    return hotels.where((h) => h.isFeatured).toList();
  }

  @override
  Future<void> toggleFavorite(String hotelId) async {
    await localDataSource.toggleFavorite(hotelId);
  }

  @override
  List<String> getFavoriteHotelIds() {
    return localDataSource.getFavoriteIds();
  }
}
