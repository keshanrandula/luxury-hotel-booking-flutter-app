import 'package:equatable/equatable.dart';

abstract class HotelEvent extends Equatable {
  const HotelEvent();

  @override
  List<Object?> get props => [];
}

class LoadHotelsEvent extends HotelEvent {
  final String? category;
  final String? query;

  const LoadHotelsEvent({this.category, this.query});

  @override
  List<Object?> get props => [category, query];
}

class FilterCategoryEvent extends HotelEvent {
  final String category;

  const FilterCategoryEvent(this.category);

  @override
  List<Object?> get props => [category];
}

class SearchHotelsEvent extends HotelEvent {
  final String query;

  const SearchHotelsEvent(this.query);

  @override
  List<Object?> get props => [query];
}

class ToggleFavoriteEvent extends HotelEvent {
  final String hotelId;

  const ToggleFavoriteEvent(this.hotelId);

  @override
  List<Object?> get props => [hotelId];
}
