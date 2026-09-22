import 'package:flutter_test/flutter_test.dart';
import 'package:hotel_booking_app/core/utils/currency_formatter.dart';
import 'package:hotel_booking_app/core/utils/date_formatter.dart';
import 'package:hotel_booking_app/core/utils/validators.dart';
import 'package:hotel_booking_app/features/booking/data/models/hotel_model.dart';

void main() {
  group('Utils Tests', () {
    test('CurrencyFormatter formats amounts in USD and LKR', () {
      expect(CurrencyFormatter.format(320), '\$320');
      expect(CurrencyFormatter.format(320, mode: CurrencyMode.lkr), 'Rs 96,000');
      expect(CurrencyFormatter.formatPerNight(240), '\$240 / night');
      expect(CurrencyFormatter.formatPerNight(240, mode: CurrencyMode.lkr), 'Rs 72,000 / night');
    });

    test('DateFormatter calculates nights correctly', () {
      final checkIn = DateTime(2026, 6, 1);
      final checkOut = DateTime(2026, 6, 5);
      expect(DateFormatter.calculateNights(checkIn, checkOut), 4);
    });

    test('Validators correctly validate email and passwords', () {
      expect(Validators.validateEmail('invalid'), isNotNull);
      expect(Validators.validateEmail('user@domain.com'), isNull);

      expect(Validators.validatePassword('123'), isNotNull);
      expect(Validators.validatePassword('secret123'), isNull);
    });
  });

  group('Model Serialization Tests', () {
    test('HotelModel serializes and deserializes properly', () {
      final json = {
        'id': 'sl-001',
        'name': 'Amanwella Beach Haven',
        'tagline': 'Oceanfront Sanctuary',
        'location': 'Tangalle, Southern Province',
        'city': 'Tangalle',
        'country': 'Sri Lanka',
        'rating': 4.95,
        'reviewCount': 142,
        'pricePerNight': 320.0,
        'category': 'Beachfront',
        'images': ['https://example.com/amanwella.jpg'],
        'description': 'A beautiful beach stay in Tangalle',
        'amenities': ['Private Pool', 'Ocean Front'],
        'rooms': [],
        'reviews': [],
        'isFeatured': true,
      };

      final model = HotelModel.fromJson(json);
      expect(model.id, 'sl-001');
      expect(model.pricePerNight, 320.0);
      expect(model.city, 'Tangalle');
    });
  });
}
