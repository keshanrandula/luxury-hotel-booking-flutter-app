import '../../domain/entities/hotel_entity.dart';
import 'review_model.dart';
import 'room_model.dart';

class HotelModel extends HotelEntity {
  const HotelModel({
    required super.id,
    required super.name,
    required super.tagline,
    required super.location,
    required super.city,
    required super.country,
    required super.rating,
    required super.reviewCount,
    required super.pricePerNight,
    super.originalPrice,
    super.discountPercent = 0,
    required super.category,
    required super.images,
    required super.description,
    required super.amenities,
    required super.rooms,
    required super.reviews,
    super.isFeatured = false,
    super.latitude = 0.0,
    super.longitude = 0.0,
    super.isFavorite = false,
  });

  factory HotelModel.fromJson(Map<String, dynamic> json, {bool isFavorite = false}) {
    final rawImages = json['images'] as List?;
    final imagesList = rawImages != null && rawImages.isNotEmpty
        ? rawImages.map((e) => e.toString()).toList()
        : [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
          ];

    final hotelPrice = (json['pricePerNight'] as num?)?.toDouble() ?? 500.0;
    final rawRooms = json['rooms'] as List?;
    final roomsList = (rawRooms != null && rawRooms.isNotEmpty)
        ? rawRooms.map((e) => RoomModel.fromJson(Map<String, dynamic>.from(e as Map))).toList()
        : [
            RoomModel(
              id: 'rm-default',
              name: 'Signature Suite',
              bedType: '1 King Bed',
              maxGuests: 2,
              sizeSqM: 100,
              pricePerNight: hotelPrice,
              imageUrl: imagesList.first,
              features: const ['Balcony', 'Ensuite Bath', 'Butler Service'],
            ),
          ];

    return HotelModel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: json['name'] as String? ?? 'Luxury Resort',
      tagline: json['tagline'] as String? ?? '',
      location: json['location'] as String? ?? '',
      city: json['city'] as String? ?? '',
      country: json['country'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.95,
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 1,
      pricePerNight: hotelPrice,
      originalPrice: (json['originalPrice'] as num?)?.toDouble(),
      discountPercent: (json['discountPercent'] as num?)?.toInt() ?? 0,
      category: json['category'] as String? ?? 'Luxury',
      images: imagesList,
      description: json['description'] as String? ?? '',
      amenities: (json['amenities'] as List?)?.map((e) => e.toString()).toList() ??
          ['High-speed Wi-Fi', 'Spa & Wellness', 'Infinity Pool'],
      rooms: roomsList,
      reviews: (json['reviews'] as List?)
              ?.map((e) => ReviewModel.fromJson(Map<String, dynamic>.from(e as Map)))
              .toList() ??
          [],
      isFeatured: json['isFeatured'] as bool? ?? false,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
      isFavorite: isFavorite,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'tagline': tagline,
      'location': location,
      'city': city,
      'country': country,
      'rating': rating,
      'reviewCount': reviewCount,
      'pricePerNight': pricePerNight,
      'originalPrice': originalPrice,
      'discountPercent': discountPercent,
      'category': category,
      'images': images,
      'description': description,
      'amenities': amenities,
      'rooms': rooms.map((r) => RoomModel.fromEntity(r).toJson()).toList(),
      'reviews': reviews.map((r) => ReviewModel.fromEntity(r).toJson()).toList(),
      'isFeatured': isFeatured,
      'latitude': latitude,
      'longitude': longitude,
    };
  }

  factory HotelModel.fromEntity(HotelEntity entity) {
    return HotelModel(
      id: entity.id,
      name: entity.name,
      tagline: entity.tagline,
      location: entity.location,
      city: entity.city,
      country: entity.country,
      rating: entity.rating,
      reviewCount: entity.reviewCount,
      pricePerNight: entity.pricePerNight,
      originalPrice: entity.originalPrice,
      discountPercent: entity.discountPercent,
      category: entity.category,
      images: entity.images,
      description: entity.description,
      amenities: entity.amenities,
      rooms: entity.rooms,
      reviews: entity.reviews,
      isFeatured: entity.isFeatured,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isFavorite: entity.isFavorite,
    );
  }
}
