import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/hotel_repository.dart';
import 'hotel_event.dart';
import 'hotel_state.dart';

class HotelBloc extends Bloc<HotelEvent, HotelState> {
  final HotelRepository hotelRepository;

  HotelBloc({required this.hotelRepository}) : super(const HotelState()) {
    on<LoadHotelsEvent>(_onLoadHotels);
    on<FilterCategoryEvent>(_onFilterCategory);
    on<SearchHotelsEvent>(_onSearchHotels);
    on<ToggleFavoriteEvent>(_onToggleFavorite);
  }

  Future<void> _onLoadHotels(
    LoadHotelsEvent event,
    Emitter<HotelState> emit,
  ) async {
    emit(state.copyWith(status: HotelStatus.loading));
    try {
      final category = event.category ?? state.selectedCategory;
      final query = event.query ?? state.searchQuery;

      final hotels = await hotelRepository.getHotels(
        category: category == 'All' ? null : category,
        query: query.isEmpty ? null : query,
      );
      final featuredHotels = await hotelRepository.getFeaturedHotels();
      final favIds = hotelRepository.getFavoriteHotelIds();

      emit(state.copyWith(
        status: HotelStatus.loaded,
        hotels: hotels,
        featuredHotels: featuredHotels,
        selectedCategory: category,
        searchQuery: query,
        favoriteHotelIds: favIds,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: HotelStatus.error,
        errorMessage: e.toString(),
      ));
    }
  }

  Future<void> _onFilterCategory(
    FilterCategoryEvent event,
    Emitter<HotelState> emit,
  ) async {
    emit(state.copyWith(selectedCategory: event.category, status: HotelStatus.loading));
    try {
      final hotels = await hotelRepository.getHotels(
        category: event.category == 'All' ? null : event.category,
        query: state.searchQuery.isEmpty ? null : state.searchQuery,
      );
      emit(state.copyWith(
        status: HotelStatus.loaded,
        hotels: hotels,
      ));
    } catch (e) {
      emit(state.copyWith(status: HotelStatus.error, errorMessage: e.toString()));
    }
  }

  Future<void> _onSearchHotels(
    SearchHotelsEvent event,
    Emitter<HotelState> emit,
  ) async {
    emit(state.copyWith(searchQuery: event.query, status: HotelStatus.loading));
    try {
      final hotels = await hotelRepository.getHotels(
        category: state.selectedCategory == 'All' ? null : state.selectedCategory,
        query: event.query,
      );
      emit(state.copyWith(
        status: HotelStatus.loaded,
        hotels: hotels,
      ));
    } catch (e) {
      emit(state.copyWith(status: HotelStatus.error, errorMessage: e.toString()));
    }
  }

  Future<void> _onToggleFavorite(
    ToggleFavoriteEvent event,
    Emitter<HotelState> emit,
  ) async {
    await hotelRepository.toggleFavorite(event.hotelId);
    final favIds = hotelRepository.getFavoriteHotelIds();

    final updatedHotels = state.hotels.map((h) {
      return h.copyWith(isFavorite: favIds.contains(h.id));
    }).toList();

    final updatedFeatured = state.featuredHotels.map((h) {
      return h.copyWith(isFavorite: favIds.contains(h.id));
    }).toList();

    emit(state.copyWith(
      hotels: updatedHotels,
      featuredHotels: updatedFeatured,
      favoriteHotelIds: favIds,
    ));
  }
}
