import 'package:equatable/equatable.dart';
import '../../domain/entities/hotel_entity.dart';

enum HotelStatus { initial, loading, loaded, error }

class HotelState extends Equatable {
  final HotelStatus status;
  final List<HotelEntity> hotels;
  final List<HotelEntity> featuredHotels;
  final String selectedCategory;
  final String searchQuery;
  final List<String> favoriteHotelIds;
  final String? errorMessage;

  const HotelState({
    this.status = HotelStatus.initial,
    this.hotels = const [],
    this.featuredHotels = const [],
    this.selectedCategory = 'All',
    this.searchQuery = '',
    this.favoriteHotelIds = const [],
    this.errorMessage,
  });

  HotelState copyWith({
    HotelStatus? status,
    List<HotelEntity>? hotels,
    List<HotelEntity>? featuredHotels,
    String? selectedCategory,
    String? searchQuery,
    List<String>? favoriteHotelIds,
    String? errorMessage,
  }) {
    return HotelState(
      status: status ?? this.status,
      hotels: hotels ?? this.hotels,
      featuredHotels: featuredHotels ?? this.featuredHotels,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      searchQuery: searchQuery ?? this.searchQuery,
      favoriteHotelIds: favoriteHotelIds ?? this.favoriteHotelIds,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [
        status,
        hotels,
        featuredHotels,
        selectedCategory,
        searchQuery,
        favoriteHotelIds,
        errorMessage,
      ];
}
