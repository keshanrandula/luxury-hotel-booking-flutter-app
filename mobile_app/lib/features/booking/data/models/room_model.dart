import '../../domain/entities/room_entity.dart';

class RoomModel extends RoomEntity {
  const RoomModel({
    required super.id,
    required super.name,
    required super.bedType,
    required super.maxGuests,
    required super.sizeSqM,
    required super.pricePerNight,
    required super.imageUrl,
    required super.features,
    super.totalInventory = 5,
    super.availableCount = 5,
    super.weekendMultiplier = 1.15,
  });

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      id: (json['id'] ?? json['_id'] ?? 'rm-${DateTime.now().millisecondsSinceEpoch}').toString(),
      name: json['name'] as String? ?? 'Signature Suite',
      bedType: json['bedType'] as String? ?? '1 King Bed',
      maxGuests: (json['maxGuests'] as num?)?.toInt() ?? 2,
      sizeSqM: (json['sizeSqM'] as num?)?.toInt() ?? 90,
      pricePerNight: (json['pricePerNight'] as num?)?.toDouble() ?? 500.0,
      imageUrl: json['imageUrl'] as String? ??
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      features: (json['features'] as List?)?.map((e) => e.toString()).toList() ??
          ['Panoramic View', 'Marble Bath', 'Butler Service'],
      totalInventory: (json['totalInventory'] as num?)?.toInt() ?? 5,
      availableCount: (json['availableCount'] as num?)?.toInt() ?? 5,
      weekendMultiplier: (json['weekendMultiplier'] as num?)?.toDouble() ?? 1.15,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'bedType': bedType,
      'maxGuests': maxGuests,
      'sizeSqM': sizeSqM,
      'pricePerNight': pricePerNight,
      'imageUrl': imageUrl,
      'features': features,
      'totalInventory': totalInventory,
      'availableCount': availableCount,
      'weekendMultiplier': weekendMultiplier,
    };
  }

  factory RoomModel.fromEntity(RoomEntity entity) {
    return RoomModel(
      id: entity.id,
      name: entity.name,
      bedType: entity.bedType,
      maxGuests: entity.maxGuests,
      sizeSqM: entity.sizeSqM,
      pricePerNight: entity.pricePerNight,
      imageUrl: entity.imageUrl,
      features: entity.features,
      totalInventory: entity.totalInventory,
      availableCount: entity.availableCount,
      weekendMultiplier: entity.weekendMultiplier,
    );
  }
}
