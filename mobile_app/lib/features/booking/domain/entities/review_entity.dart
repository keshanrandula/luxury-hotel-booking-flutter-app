import 'package:equatable/equatable.dart';

class ReviewEntity extends Equatable {
  final String id;
  final String hotelId;
  final String bookingId;
  final String userName;
  final String userAvatar;
  final double rating;
  final String date;
  final String comment;
  final List<String> photos;

  const ReviewEntity({
    required this.id,
    this.hotelId = '',
    this.bookingId = '',
    required this.userName,
    required this.userAvatar,
    required this.rating,
    required this.date,
    required this.comment,
    this.photos = const [],
  });

  @override
  List<Object?> get props => [id, hotelId, bookingId, userName, userAvatar, rating, date, comment, photos];
}
