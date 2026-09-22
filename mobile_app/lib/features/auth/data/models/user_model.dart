import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.avatarUrl,
    super.tier = 'Member',
    super.points = 0,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? 'usr_guest',
      name: json['name'] as String? ?? 'Guest Traveler',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String?,
      tier: json['tier'] as String? ?? 'Member',
      points: (json['points'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'tier': tier,
      'points': points,
    };
  }

  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      name: entity.name,
      email: entity.email,
      avatarUrl: entity.avatarUrl,
      tier: entity.tier,
      points: entity.points,
    );
  }
}
