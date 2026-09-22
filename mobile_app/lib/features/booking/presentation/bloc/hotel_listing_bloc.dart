import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/hotel_entity.dart';
import '../../domain/repositories/hotel_repository.dart';

// ==========================================
// 1. BLOC EVENTS
// ==========================================
abstract class HotelListingEvent extends Equatable {
  const HotelListingEvent();

  @override
  List<Object?> get props => [];
}

class FetchHotels extends HotelListingEvent {
  final String? category;
  final String? query;

  const FetchHotels({this.category, this.query});

  @override
  List<Object?> get props => [category, query];
}

class RefreshHotels extends HotelListingEvent {
  final String? category;

  const RefreshHotels({this.category});

  @override
  List<Object?> get props => [category];
}

// ==========================================
// 2. BLOC STATES
// ==========================================
abstract class HotelListingState extends Equatable {
  const HotelListingState();

  @override
  List<Object?> get props => [];
}

class HotelLoading extends HotelListingState {}

class HotelLoaded extends HotelListingState {
  final List<HotelEntity> hotels;
  final List<HotelEntity> featuredHotels;
  final String selectedCategory;

  const HotelLoaded({
    required this.hotels,
    this.featuredHotels = const [],
    this.selectedCategory = 'All',
  });

  @override
  List<Object?> get props => [hotels, featuredHotels, selectedCategory];
}

class HotelError extends HotelListingState {
  final String message;

  const HotelError(this.message);

  @override
  List<Object?> get props => [message];
}

// ==========================================
// 3. BLOC IMPLEMENTATION
// ==========================================
class HotelListingBloc extends Bloc<HotelListingEvent, HotelListingState> {
  final HotelRepository hotelRepository;

  HotelListingBloc({required this.hotelRepository}) : super(HotelLoading()) {
    on<FetchHotels>(_onFetchHotels);
    on<RefreshHotels>(_onRefreshHotels);
  }

  Future<void> _onFetchHotels(
    FetchHotels event,
    Emitter<HotelListingState> emit,
  ) async {
    emit(HotelLoading());
    try {
      final hotels = await hotelRepository.getHotels(
        category: event.category == 'All' ? null : event.category,
        query: event.query,
      );
      final featured = await hotelRepository.getFeaturedHotels();

      emit(HotelLoaded(
        hotels: hotels,
        featuredHotels: featured,
        selectedCategory: event.category ?? 'All',
      ));
    } catch (e) {
      emit(HotelError(e.toString()));
    }
  }

  Future<void> _onRefreshHotels(
    RefreshHotels event,
    Emitter<HotelListingState> emit,
  ) async {
    try {
      final hotels = await hotelRepository.getHotels(
        category: event.category == 'All' ? null : event.category,
      );
      final featured = await hotelRepository.getFeaturedHotels();

      emit(HotelLoaded(
        hotels: hotels,
        featuredHotels: featured,
        selectedCategory: event.category ?? 'All',
      ));
    } catch (e) {
      emit(HotelError(e.toString()));
    }
  }
}
