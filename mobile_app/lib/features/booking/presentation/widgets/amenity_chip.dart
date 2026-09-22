import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class AmenityChip extends StatelessWidget {
  final String label;

  const AmenityChip({super.key, required this.label});

  IconData _getIconForAmenity(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('pool')) return Icons.pool_rounded;
    if (lower.contains('spa')) return Icons.spa_rounded;
    if (lower.contains('butler') || lower.contains('concierge')) return Icons.room_service_rounded;
    if (lower.contains('dining') || lower.contains('restaurant') || lower.contains('chef')) return Icons.restaurant_rounded;
    if (lower.contains('wifi')) return Icons.wifi_rounded;
    if (lower.contains('yacht') || lower.contains('boat')) return Icons.directions_boat_rounded;
    if (lower.contains('ski')) return Icons.downhill_skiing_rounded;
    if (lower.contains('view') || lower.contains('balcony')) return Icons.balcony_rounded;
    if (lower.contains('bath') || lower.contains('shower')) return Icons.bathtub_rounded;
    if (lower.contains('fire')) return Icons.fireplace_rounded;
    return Icons.verified_rounded;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getIconForAmenity(label),
            size: 16,
            color: AppColors.accentGold,
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
            ),
          ),
        ],
      ),
    );
  }
}
