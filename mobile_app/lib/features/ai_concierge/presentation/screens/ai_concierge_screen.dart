import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../booking/presentation/bloc/hotel_bloc.dart';
import '../../../booking/presentation/screens/hotel_detail_screen.dart';
import '../../data/ai_service.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  final DateTime timestamp;
  final List<String> suggestions;
  final List<AiRecommendedHotel> hotels;

  ChatMessage({
    required this.text,
    required this.isUser,
    required this.timestamp,
    this.suggestions = const [],
    this.hotels = const [],
  });
}

class AiConciergeScreen extends StatefulWidget {
  const AiConciergeScreen({super.key});

  static const String routeName = '/ai-concierge';

  @override
  State<AiConciergeScreen> createState() => _AiConciergeScreenState();
}

class _AiConciergeScreenState extends State<AiConciergeScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late final AiService _aiService;

  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  final List<String> _initialPrompts = [
    '🏖️ Best Beachfront Sanctuaries',
    '🗺️ 3-Day Luxury Itinerary',
    '🍽️ Gourmet Menus & Dining',
    '☕ Misty Tea Estate Chalets',
    '💎 Exclusive VIP Member Deals',
  ];

  @override
  void initState() {
    super.initState();
    _aiService = AiService(apiClient: ApiClient(useMock: false));

    // Initial greeting from AI Concierge
    _messages.add(
      ChatMessage(
        text: "✨ **Greetings, Valued Traveler.**\n\nI am your **VIP Luxury Concierge**. I can curate bespoke itineraries, recommend handpicked oceanfront and highland sanctuaries, arrange private dining, and answer any inquiries about our world-class properties.\n\nHow may I curate your escape today?",
        isUser: false,
        timestamp: DateTime.now(),
        suggestions: _initialPrompts,
      ),
    );
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage(String userText) async {
    final query = userText.trim();
    if (query.isEmpty || _isLoading) return;

    _textController.clear();

    setState(() {
      _messages.add(
        ChatMessage(
          text: query,
          isUser: true,
          timestamp: DateTime.now(),
        ),
      );
      _isLoading = true;
    });

    _scrollToBottom();

    final response = await _aiService.sendMessage(query);

    if (!mounted) return;

    setState(() {
      _isLoading = false;
      _messages.add(
        ChatMessage(
          text: response.message,
          isUser: false,
          timestamp: DateTime.now(),
          suggestions: response.suggestions,
          hotels: response.recommendedHotels,
        ),
      );
    });

    _scrollToBottom();
  }

  void _openHotelDetails(String hotelId) {
    final hotels = context.read<HotelBloc>().state.hotels;
    final match = hotels.where((h) => h.id == hotelId).toList();
    if (match.isNotEmpty) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => HotelDetailScreen(hotel: match.first),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: AppColors.goldGradient,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accentGold.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Luxe Concierge AI',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: -0.3),
                ),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Colors.greenAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Online • 24/7 VIP Assistant',
                      style: TextStyle(
                        fontSize: 10,
                        color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, size: 20),
            tooltip: 'Clear Conversation',
            onPressed: () {
              setState(() {
                _messages.clear();
                _messages.add(
                  ChatMessage(
                    text: "✨ Conversation cleared. How may I assist your luxury travel plans today?",
                    isUser: false,
                    timestamp: DateTime.now(),
                    suggestions: _initialPrompts,
                  ),
                );
              });
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Messages View
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                itemCount: _messages.length + (_isLoading ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _messages.length && _isLoading) {
                    return _buildTypingIndicator(isDark);
                  }

                  final msg = _messages[index];
                  return _buildMessageItem(msg, isDark);
                },
              ),
            ),

            // Input Bar
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              decoration: BoxDecoration(
                color: isDark ? AppColors.surfaceDark : Colors.white,
                border: Border(
                  top: BorderSide(
                    color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    width: 1,
                  ),
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.bgDark : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isDark ? AppColors.borderDark : Colors.grey.shade300,
                        ),
                      ),
                      child: TextField(
                        controller: _textController,
                        style: TextStyle(
                          fontSize: 14,
                          color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                        ),
                        textInputAction: TextInputAction.send,
                        onSubmitted: _sendMessage,
                        decoration: InputDecoration(
                          hintText: 'Ask for villas, itineraries, food menus...',
                          hintStyle: TextStyle(
                            fontSize: 13,
                            color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: BoxDecoration(
                      gradient: AppColors.goldGradient,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accentGold.withOpacity(0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 18),
                      onPressed: () => _sendMessage(_textController.text),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageItem(ChatMessage msg, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: msg.isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: msg.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (!msg.isUser) ...[
                CircleAvatar(
                  radius: 16,
                  backgroundColor: AppColors.accentGold.withOpacity(0.15),
                  child: const Icon(Icons.auto_awesome, size: 16, color: AppColors.accentGold),
                ),
                const SizedBox(width: 8),
              ],
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: msg.isUser
                        ? AppColors.accentGold
                        : (isDark ? AppColors.surfaceDark : Colors.grey.shade100),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(16),
                      topRight: const Radius.circular(16),
                      bottomLeft: Radius.circular(msg.isUser ? 16 : 4),
                      bottomRight: Radius.circular(msg.isUser ? 4 : 16),
                    ),
                    border: Border.all(
                      color: msg.isUser
                          ? AppColors.accentGold
                          : (isDark ? AppColors.borderDark : Colors.grey.shade200),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: SelectableText(
                    msg.text,
                    style: TextStyle(
                      fontSize: 13.5,
                      height: 1.5,
                      color: msg.isUser
                          ? Colors.white
                          : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Recommended Hotels Cards
          if (msg.hotels.isNotEmpty) ...[
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.only(left: 40),
              child: SizedBox(
                height: 160,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: msg.hotels.length,
                  itemBuilder: (context, index) {
                    final hotel = msg.hotels[index];
                    return _buildHotelMiniCard(hotel, isDark);
                  },
                ),
              ),
            ),
          ],

          // Quick Suggestion Chips
          if (msg.suggestions.isNotEmpty) ...[
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.only(left: 40),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: msg.suggestions.map((suggestion) {
                  return ActionChip(
                    label: Text(
                      suggestion,
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.accentGold),
                    ),
                    backgroundColor: isDark ? AppColors.surfaceDark : Colors.white,
                    side: BorderSide(color: AppColors.accentGold.withOpacity(0.4)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    onPressed: () => _sendMessage(suggestion),
                  );
                }).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildHotelMiniCard(AiRecommendedHotel hotel, bool isDark) {
    return GestureDetector(
      onTap: () => _openHotelDetails(hotel.id),
      child: Container(
        width: 220,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.accentGold.withOpacity(0.3)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(13)),
              child: Image.network(
                hotel.image.isNotEmpty
                    ? hotel.image
                    : 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
                height: 75,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(height: 75, color: AppColors.secondaryNavy),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    hotel.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '\$${hotel.pricePerNight.toInt()} / night',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: AppColors.accentGold,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star_rounded, size: 12, color: AppColors.starRating),
                          Text(
                            hotel.rating.toStringAsFixed(1),
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Container(
                    width: double.infinity,
                    alignment: Alignment.center,
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.accentGold.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Text(
                      'View Sanctuary →',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w700,
                        color: AppColors.accentGold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator(bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.accentGold.withOpacity(0.15),
            child: const Icon(Icons.auto_awesome, size: 16, color: AppColors.accentGold),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isDark ? AppColors.surfaceDark : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? AppColors.borderDark : Colors.grey.shade200),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.accentGold),
                ),
                SizedBox(width: 8),
                Text(
                  'Curating VIP recommendations...',
                  style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic, color: AppColors.accentGold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
