import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';

class AiRecommendedHotel {
  final String id;
  final String name;
  final String tagline;
  final String location;
  final String city;
  final double pricePerNight;
  final double rating;
  final String category;
  final String image;

  AiRecommendedHotel({
    required this.id,
    required this.name,
    required this.tagline,
    required this.location,
    required this.city,
    required this.pricePerNight,
    required this.rating,
    required this.category,
    required this.image,
  });

  factory AiRecommendedHotel.fromJson(Map<String, dynamic> json) {
    return AiRecommendedHotel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: json['name'] as String? ?? 'Luxury Sanctuary',
      tagline: json['tagline'] as String? ?? '',
      location: json['location'] as String? ?? '',
      city: json['city'] as String? ?? '',
      pricePerNight: (json['pricePerNight'] as num?)?.toDouble() ?? 500.0,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.95,
      category: json['category'] as String? ?? 'Luxury',
      image: json['image'] as String? ?? '',
    );
  }
}

class AiChatResponse {
  final bool success;
  final String message;
  final List<String> suggestions;
  final List<AiRecommendedHotel> recommendedHotels;

  AiChatResponse({
    required this.success,
    required this.message,
    required this.suggestions,
    required this.recommendedHotels,
  });

  factory AiChatResponse.fromJson(Map<String, dynamic> json) {
    final rawRecs = json['recommendedHotels'] as List? ?? [];
    final rawSuggestions = json['suggestions'] as List? ?? [];

    return AiChatResponse(
      success: json['success'] as bool? ?? true,
      message: json['message'] as String? ?? '',
      suggestions: rawSuggestions.map((e) => e.toString()).toList(),
      recommendedHotels: rawRecs.map((e) => AiRecommendedHotel.fromJson(Map<String, dynamic>.from(e as Map))).toList(),
    );
  }
}

class AiService {
  final ApiClient apiClient;

  AiService({required this.apiClient});

  Future<AiChatResponse> sendMessage(String message) async {
    try {
      final response = await apiClient.post(
        ApiEndpoints.aiChat,
        data: {'message': message},
      );

      return AiChatResponse.fromJson(Map<String, dynamic>.from(response.data as Map));
    } catch (e) {
      return AiChatResponse(
        success: false,
        message: "I am having trouble connecting to the luxury concierge service right now. Please try again shortly.",
        suggestions: ['Best Beachfront Villas', '3-Day Luxury Itinerary', 'Dining & Spa Options'],
        recommendedHotels: [],
      );
    }
  }
}
