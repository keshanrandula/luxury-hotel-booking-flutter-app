import 'package:equatable/equatable.dart';

class UserEntity extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String tier;
  final int points;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    this.tier = 'Member',
    this.points = 0,
  });

  @override
  List<Object?> get props => [id, name, email, avatarUrl, tier, points];
}
