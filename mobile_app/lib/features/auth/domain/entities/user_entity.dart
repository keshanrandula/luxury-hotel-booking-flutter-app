import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String tier;
  final int points;
  final String? phone;
  final String? country;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.tier = 'Silver Prestige',
    this.points = 5000,
    this.phone,
    this.country,
  });

  @override
  List<Object?> get props => [id, name, email, avatarUrl, tier, points, phone, country];
}
