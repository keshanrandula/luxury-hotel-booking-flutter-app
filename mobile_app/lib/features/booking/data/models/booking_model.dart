import '../../domain/entities/booking_entity.dart';

class BookingModel extends BookingEntity {
  const BookingModel({
    required super.id,
    required super.hotelId,
    required super.hotelName,
    required super.hotelImage,
    required super.location,
    required super.roomId,
    required super.roomName,
    required super.checkIn,
    required super.checkOut,
    required super.adults,
    super.children = 0,
    required super.nights,
    required super.roomTotal,
    required super.taxesAndFees,
    required super.grandTotal,
    super.status = BookingStatus.confirmed,
    required super.guestName,
    required super.guestEmail,
    required super.guestPhone,
    super.specialRequests,
    required super.createdAt,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    DateTime parseDate(dynamic val, DateTime fallback) {
      if (val == null) return fallback;
      try {
        return DateTime.parse(val.toString());
      } catch (_) {
        return fallback;
      }
    }

    final now = DateTime.now();

    return BookingModel(
      id: (json['id'] ?? json['_id'] ?? 'BK-${now.millisecondsSinceEpoch}').toString(),
      hotelId: (json['hotelId'] ?? '').toString(),
      hotelName: json['hotelName'] as String? ?? 'Luxury Resort',
      hotelImage: json['hotelImage'] as String? ??
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      location: json['location'] as String? ?? '',
      roomId: (json['roomId'] ?? 'rm-default').toString(),
      roomName: json['roomName'] as String? ?? 'Signature Suite',
      checkIn: parseDate(json['checkIn'], now.add(const Duration(days: 7))),
      checkOut: parseDate(json['checkOut'], now.add(const Duration(days: 10))),
      adults: (json['adults'] as num?)?.toInt() ?? 2,
      children: (json['children'] as num?)?.toInt() ?? 0,
      nights: (json['nights'] as num?)?.toInt() ?? 3,
      roomTotal: (json['roomTotal'] as num?)?.toDouble() ?? 1500.0,
      taxesAndFees: (json['taxesAndFees'] as num?)?.toDouble() ?? 250.0,
      grandTotal: (json['grandTotal'] as num?)?.toDouble() ?? 1750.0,
      status: BookingStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => BookingStatus.confirmed,
      ),
      guestName: json['guestName'] as String? ?? 'Valued Guest',
      guestEmail: json['guestEmail'] as String? ?? '',
      guestPhone: json['guestPhone'] as String? ?? '',
      specialRequests: json['specialRequests'] as String?,
      createdAt: parseDate(json['createdAt'], now),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'hotelId': hotelId,
      'hotelName': hotelName,
      'hotelImage': hotelImage,
      'location': location,
      'roomId': roomId,
      'roomName': roomName,
      'checkIn': checkIn.toIso8601String(),
      'checkOut': checkOut.toIso8601String(),
      'adults': adults,
      'children': children,
      'nights': nights,
      'roomTotal': roomTotal,
      'taxesAndFees': taxesAndFees,
      'grandTotal': grandTotal,
      'status': status.name,
      'guestName': guestName,
      'guestEmail': guestEmail,
      'guestPhone': guestPhone,
      'specialRequests': specialRequests,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory BookingModel.fromEntity(BookingEntity entity) {
    return BookingModel(
      id: entity.id,
      hotelId: entity.hotelId,
      hotelName: entity.hotelName,
      hotelImage: entity.hotelImage,
      location: entity.location,
      roomId: entity.roomId,
      roomName: entity.roomName,
      checkIn: entity.checkIn,
      checkOut: entity.checkOut,
      adults: entity.adults,
      children: entity.children,
      nights: entity.nights,
      roomTotal: entity.roomTotal,
      taxesAndFees: entity.taxesAndFees,
      grandTotal: entity.grandTotal,
      status: entity.status,
      guestName: entity.guestName,
      guestEmail: entity.guestEmail,
      guestPhone: entity.guestPhone,
      specialRequests: entity.specialRequests,
      createdAt: entity.createdAt,
    );
  }
}
