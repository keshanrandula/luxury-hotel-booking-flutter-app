import '../../domain/entities/user_entity.dart';

class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.name,
    required super.email,
    super.avatarUrl,
    super.tier = 'Silver Prestige',
    super.points = 5000,
    super.phone,
    super.country,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: (json['id'] ?? json['_id']) as String? ?? 'usr_guest',
      name: json['name'] as String? ?? 'Guest Traveler',
      email: json['email'] as String? ?? '',
      avatarUrl: json['avatarUrl'] as String?,
      tier: json['tier'] as String? ?? 'Silver Prestige',
      points: (json['points'] as num?)?.toInt() ?? 5000,
      phone: json['phone'] as String? ?? json['contactNumber'] as String? ?? '+1 (555) 234-5678',
      country: json['country'] as String? ?? 'Sri Lanka',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      '_id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'tier': tier,
      'points': points,
      'phone': phone,
      'country': country,
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
      phone: entity.phone,
      country: entity.country,
    );
  }
}
