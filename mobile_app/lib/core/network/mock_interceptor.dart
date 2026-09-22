import 'package:dio/dio.dart';
import '../constants/api_endpoints.dart';

class MockInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final path = options.path;

    if (path.contains(ApiEndpoints.getHotels) || path.contains(ApiEndpoints.getFeaturedHotels)) {
      return handler.resolve(Response(
        requestOptions: options,
        data: _sriLankanHotels,
        statusCode: 200,
      ));
    }

    super.onRequest(options, handler);
  }

  static final List<Map<String, dynamic>> _sriLankanHotels = [
    {
      'id': 'sl-001',
      'name': 'Amanwella Beach Haven',
      'tagline': 'Oceanfront Sanctuary with Private Plunge Pools',
      'location': 'Tangalle, Southern Province',
      'city': 'Tangalle',
      'country': 'Sri Lanka',
      'rating': 4.95,
      'reviewCount': 142,
      'pricePerNight': 320.0,
      'originalPrice': 380.0,
      'discountPercent': 15,
      'category': 'Beachfront',
      'images': [
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      ],
      'description': 'Nestled amidst a mature coconut grove, Amanwella boasts contemporary suites facing a crescent-shaped bay of golden sand.',
      'amenities': ['Private Ocean Pool', 'High-speed Wi-Fi', 'Ocean Front', 'Artisan Breakfast', 'Spa & Wellness'],
      'rooms': [
        {
          'id': 'rm-sl-01',
          'name': 'Ocean Plunge Pool Suite',
          'bedType': '1 King Bed',
          'maxGuests': 2,
          'sizeSqM': 100,
          'pricePerNight': 320.0,
          'imageUrl': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
          'features': ['Private Plunge Pool', 'Ocean View Terrace', 'Terrazzo Soaking Tub'],
        }
      ],
      'reviews': [
        {
          'id': 'rev-mock-01',
          'userName': 'Eleanor Vance',
          'userAvatar': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          'rating': 5.0,
          'date': '2 days ago',
          'comment': 'Heaven on earth! The private plunge pool looking out onto the ocean is pure bliss.',
          'photos': [
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          'id': 'rev-mock-02',
          'userName': 'Alexander Wright',
          'userAvatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          'rating': 4.9,
          'date': '1 week ago',
          'comment': 'Attentive concierge and world-class breakfast. Highly recommended for luxury travelers.',
          'photos': []
        }
      ],
      'isFeatured': true,
      'latitude': 6.0244,
      'longitude': 80.7941,
    },
    {
      'id': 'sl-002',
      'name': '98 Acres Luxury Resort',
      'tagline': "Panoramic Tea Estate & Little Adam's Peak View",
      'location': 'Ella, Badulla District',
      'city': 'Ella',
      'country': 'Sri Lanka',
      'rating': 4.91,
      'reviewCount': 318,
      'pricePerNight': 240.0,
      'originalPrice': 290.0,
      'discountPercent': 17,
      'category': 'Hill Country',
      'images': [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      ],
      'description': "An awe-inspiring eco-resort perched on scenic 98-acre tea estate in Ella, crafted from natural and sustainable timber and stone.",
      'amenities': ['Mountain View Spa', 'Organic Dining', 'Tea Trails', 'Helipad'],
      'rooms': [
        {
          'id': 'rm-sl-02',
          'name': 'Greenland Chalet',
          'bedType': '1 King Bed',
          'maxGuests': 3,
          'sizeSqM': 85,
          'pricePerNight': 240.0,
          'imageUrl': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
          'features': ['Balcony with Ella Gap View', 'Open-air Shower'],
        }
      ],
      'reviews': [],
      'isFeatured': true,
      'latitude': 6.8667,
      'longitude': 81.0466,
    },
    {
      'id': 'sl-003',
      'name': 'The Dutch Fort Villa',
      'tagline': '18th Century Colonial Architecture Restored',
      'location': 'Galle Fort, Galle',
      'city': 'Galle Fort',
      'country': 'Sri Lanka',
      'rating': 4.88,
      'reviewCount': 94,
      'pricePerNight': 185.0,
      'originalPrice': 220.0,
      'discountPercent': 16,
      'category': 'Villas',
      'images': [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      ],
      'description': 'Located within the UNESCO World Heritage Galle Fort, featuring antique four-poster beds, tranquil courtyard, and private chef.',
      'amenities': ['Butler Service', 'Courtyard Garden', 'Cocktail Lounge', 'Bicycle Hire'],
      'rooms': [
        {
          'id': 'rm-sl-03',
          'name': 'Heritage Master Suite',
          'bedType': '1 Four-Poster King Bed',
          'maxGuests': 2,
          'sizeSqM': 95,
          'pricePerNight': 185.0,
          'imageUrl': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
          'features': ['Colonial Verandah', 'Antique Furnishings'],
        }
      ],
      'reviews': [],
      'isFeatured': true,
      'latitude': 6.0270,
      'longitude': 80.2170,
    },
    {
      'id': 'sl-004',
      'name': 'Mirissa Palms Boutique',
      'tagline': 'Steps away from Whale Watching & Secret Beach',
      'location': 'Mirissa, Weligama Bay',
      'city': 'Mirissa',
      'country': 'Sri Lanka',
      'rating': 4.82,
      'reviewCount': 120,
      'pricePerNight': 135.0,
      'originalPrice': 160.0,
      'discountPercent': 15,
      'category': 'Boutique',
      'images': [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      ],
      'description': 'Bohemian luxury boutique with direct beach path, sunset rooftop lounge, and surf lesson packages.',
      'amenities': ['Surf Shack', 'Rooftop Yoga', 'Cocktail Bar', 'AC Rooms'],
      'rooms': [
        {
          'id': 'rm-sl-04',
          'name': 'Palm View Deluxe',
          'bedType': '1 Queen Bed',
          'maxGuests': 2,
          'sizeSqM': 60,
          'pricePerNight': 135.0,
          'imageUrl': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
          'features': ['Private Balcony', 'Tropical Garden View'],
        }
      ],
      'reviews': [],
      'isFeatured': false,
      'latitude': 5.9483,
      'longitude': 80.4716,
    },
    {
      'id': 'sl-005',
      'name': 'Ceylon Tea Trails Bungalow',
      'tagline': 'Colonial Charm among Misty Highlands',
      'location': 'Hatton, Central Highlands',
      'city': 'Hatton',
      'country': 'Sri Lanka',
      'rating': 4.98,
      'reviewCount': 210,
      'pricePerNight': 410.0,
      'originalPrice': 490.0,
      'discountPercent': 16,
      'category': 'Hill Country',
      'images': [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      ],
      'description': "World's first tea bungalow resort in Sri Lanka at an elevation of 4,000 feet, offering refined all-inclusive planter-style hospitality.",
      'amenities': ['Tea Tasting', 'Tennis Court', 'Fireplace Lounge', 'Private Butler'],
      'rooms': [
        {
          'id': 'rm-sl-05',
          'name': 'Planter Master Suite',
          'bedType': '1 King Bed',
          'maxGuests': 2,
          'sizeSqM': 115,
          'pricePerNight': 410.0,
          'imageUrl': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
          'features': ['Fireplace', 'Private Garden View', 'Butler Service'],
        }
      ],
      'reviews': [],
      'isFeatured': true,
      'latitude': 6.8917,
      'longitude': 80.5967,
    },
  ];
}
