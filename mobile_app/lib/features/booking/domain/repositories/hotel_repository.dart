import '../entities/hotel_entity.dart';

abstract class HotelRepository {
  Future<List<HotelEntity>> getHotels({String? category, String? query});
  Future<HotelEntity> getHotelDetails(String hotelId);
  Future<List<HotelEntity>> getFeaturedHotels();
  Future<void> toggleFavorite(String hotelId);
  List<String> getFavoriteHotelIds();
}
