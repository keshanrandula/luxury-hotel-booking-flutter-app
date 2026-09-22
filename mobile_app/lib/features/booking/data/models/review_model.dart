import '../../domain/entities/review_entity.dart';

class ReviewModel extends ReviewEntity {
  const ReviewModel({
    required super.id,
    super.hotelId = '',
    super.bookingId = '',
    required super.userName,
    required super.userAvatar,
    required super.rating,
    required super.date,
    required super.comment,
    super.photos = const [],
  });

  factory ReviewModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedPhotos = [];
    if (json['photos'] != null && json['photos'] is List) {
      parsedPhotos = (json['photos'] as List).map((p) => p.toString()).toList();
    }

    return ReviewModel(
      id: (json['id'] ?? json['_id'] ?? 'rev-${DateTime.now().millisecondsSinceEpoch}').toString(),
      hotelId: (json['hotelId'] ?? '').toString(),
      bookingId: (json['bookingId'] ?? '').toString(),
      userName: json['userName'] as String? ?? 'Guest Traveler',
      userAvatar: json['userAvatar'] as String? ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      date: json['date'] as String? ?? 'Recent',
      comment: json['comment'] as String? ?? 'Exceptional experience!',
      photos: parsedPhotos,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'hotelId': hotelId,
      'bookingId': bookingId,
      'userName': userName,
      'userAvatar': userAvatar,
      'rating': rating,
      'date': date,
      'comment': comment,
      'photos': photos,
    };
  }

  factory ReviewModel.fromEntity(ReviewEntity entity) {
    return ReviewModel(
      id: entity.id,
      hotelId: entity.hotelId,
      bookingId: entity.bookingId,
      userName: entity.userName,
      userAvatar: entity.userAvatar,
      rating: entity.rating,
      date: entity.date,
      comment: entity.comment,
      photos: entity.photos,
    );
  }
}
