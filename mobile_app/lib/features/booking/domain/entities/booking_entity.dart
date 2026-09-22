import 'package:equatable/equatable.dart';

enum BookingStatus { confirmed, active, completed, cancelled }

class BookingEntity extends Equatable {
  final String id;
  final String hotelId;
  final String hotelName;
  final String hotelImage;
  final String location;
  final String roomId;
  final String roomName;
  final DateTime checkIn;
  final DateTime checkOut;
  final int adults;
  final int children;
  final int nights;
  final double roomTotal;
  final double taxesAndFees;
  final double grandTotal;
  final BookingStatus status;
  final String guestName;
  final String guestEmail;
  final String guestPhone;
  final String? specialRequests;
  final DateTime createdAt;

  const BookingEntity({
    required this.id,
    required this.hotelId,
    required this.hotelName,
    required this.hotelImage,
    required this.location,
    required this.roomId,
    required this.roomName,
    required this.checkIn,
    required this.checkOut,
    required this.adults,
    this.children = 0,
    required this.nights,
    required this.roomTotal,
    required this.taxesAndFees,
    required this.grandTotal,
    this.status = BookingStatus.confirmed,
    required this.guestName,
    required this.guestEmail,
    required this.guestPhone,
    this.specialRequests,
    required this.createdAt,
  });

  BookingEntity copyWith({
    String? id,
    String? hotelId,
    String? hotelName,
    String? hotelImage,
    String? location,
    String? roomId,
    String? roomName,
    DateTime? checkIn,
    DateTime? checkOut,
    int? adults,
    int? children,
    int? nights,
    double? roomTotal,
    double? taxesAndFees,
    double? grandTotal,
    BookingStatus? status,
    String? guestName,
    String? guestEmail,
    String? guestPhone,
    String? specialRequests,
    DateTime? createdAt,
  }) {
    return BookingEntity(
      id: id ?? this.id,
      hotelId: hotelId ?? this.hotelId,
      hotelName: hotelName ?? this.hotelName,
      hotelImage: hotelImage ?? this.hotelImage,
      location: location ?? this.location,
      roomId: roomId ?? this.roomId,
      roomName: roomName ?? this.roomName,
      checkIn: checkIn ?? this.checkIn,
      checkOut: checkOut ?? this.checkOut,
      adults: adults ?? this.adults,
      children: children ?? this.children,
      nights: nights ?? this.nights,
      roomTotal: roomTotal ?? this.roomTotal,
      taxesAndFees: taxesAndFees ?? this.taxesAndFees,
      grandTotal: grandTotal ?? this.grandTotal,
      status: status ?? this.status,
      guestName: guestName ?? this.guestName,
      guestEmail: guestEmail ?? this.guestEmail,
      guestPhone: guestPhone ?? this.guestPhone,
      specialRequests: specialRequests ?? this.specialRequests,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        hotelId,
        hotelName,
        hotelImage,
        location,
        roomId,
        roomName,
        checkIn,
        checkOut,
        adults,
        children,
        nights,
        roomTotal,
        taxesAndFees,
        grandTotal,
        status,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        createdAt,
      ];
}
