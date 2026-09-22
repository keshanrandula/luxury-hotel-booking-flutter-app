import 'package:equatable/equatable.dart';

class RoomEntity extends Equatable {
  final String id;
  final String name;
  final String bedType;
  final int maxGuests;
  final int sizeSqM;
  final double pricePerNight;
  final String imageUrl;
  final List<String> features;
  final int totalInventory;
  final int availableCount;
  final double weekendMultiplier;

  const RoomEntity({
    required this.id,
    required this.name,
    required this.bedType,
    required this.maxGuests,
    required this.sizeSqM,
    required this.pricePerNight,
    required this.imageUrl,
    required this.features,
    this.totalInventory = 5,
    this.availableCount = 5,
    this.weekendMultiplier = 1.15,
  });

  bool get isAvailable => availableCount > 0;
  bool get isLowStock => availableCount > 0 && availableCount <= 2;

  @override
  List<Object?> get props => [
        id,
        name,
        bedType,
        maxGuests,
        sizeSqM,
        pricePerNight,
        imageUrl,
        features,
        totalInventory,
        availableCount,
        weekendMultiplier,
      ];
}
