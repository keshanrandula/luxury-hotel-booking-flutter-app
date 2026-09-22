import 'package:equatable/equatable.dart';
import 'review_entity.dart';
import 'room_entity.dart';

class HotelEntity extends Equatable {
  final String id;
  final String name;
  final String tagline;
  final String location;
  final String city;
  final String country;
  final double rating;
  final int reviewCount;
  final double pricePerNight;
  final double? originalPrice;
  final int discountPercent;
  final String category;
  final List<String> images;
  final String description;
  final List<String> amenities;
  final List<RoomEntity> rooms;
  final List<ReviewEntity> reviews;
  final bool isFeatured;
  final double latitude;
  final double longitude;
  final bool isFavorite;

  const HotelEntity({
    required this.id,
    required this.name,
    required this.tagline,
    required this.location,
    required this.city,
    required this.country,
    required this.rating,
    required this.reviewCount,
    required this.pricePerNight,
    this.originalPrice,
    this.discountPercent = 0,
    required this.category,
    required this.images,
    required this.description,
    required this.amenities,
    required this.rooms,
    required this.reviews,
    this.isFeatured = false,
    this.latitude = 0.0,
    this.longitude = 0.0,
    this.isFavorite = false,
  });

  HotelEntity copyWith({
    String? id,
    String? name,
    String? tagline,
    String? location,
    String? city,
    String? country,
    double? rating,
    int? reviewCount,
    double? pricePerNight,
    double? originalPrice,
    int? discountPercent,
    String? category,
    List<String>? images,
    String? description,
    List<String>? amenities,
    List<RoomEntity>? rooms,
    List<ReviewEntity>? reviews,
    bool? isFeatured,
    double? latitude,
    double? longitude,
    bool? isFavorite,
  }) {
    return HotelEntity(
      id: id ?? this.id,
      name: name ?? this.name,
      tagline: tagline ?? this.tagline,
      location: location ?? this.location,
      city: city ?? this.city,
      country: country ?? this.country,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      pricePerNight: pricePerNight ?? this.pricePerNight,
      originalPrice: originalPrice ?? this.originalPrice,
      discountPercent: discountPercent ?? this.discountPercent,
      category: category ?? this.category,
      images: images ?? this.images,
      description: description ?? this.description,
      amenities: amenities ?? this.amenities,
      rooms: rooms ?? this.rooms,
      reviews: reviews ?? this.reviews,
      isFeatured: isFeatured ?? this.isFeatured,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        tagline,
        location,
        city,
        country,
        rating,
        reviewCount,
        pricePerNight,
        originalPrice,
        discountPercent,
        category,
        images,
        description,
        amenities,
        rooms,
        reviews,
        isFeatured,
        latitude,
        longitude,
        isFavorite,
      ];
}
