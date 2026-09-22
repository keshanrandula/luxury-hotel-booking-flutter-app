import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../domain/entities/review_entity.dart';

class ReviewCard extends StatelessWidget {
  final ReviewEntity review;

  const ReviewCard({super.key, required this.review});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundImage: review.userAvatar.isNotEmpty ? NetworkImage(review.userAvatar) : null,
                backgroundColor: AppColors.accentGold.withOpacity(0.2),
                child: review.userAvatar.isEmpty
                    ? Text(
                        review.userName[0],
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.accentGold),
                      )
                    : null,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      review.date,
                      style: TextStyle(
                        fontSize: 11,
                        color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 14, color: AppColors.starRating),
                    const SizedBox(width: 3),
                    Text(
                      review.rating.toStringAsFixed(1),
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.accentGold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Expanded(
            child: Text(
              review.comment,
              style: TextStyle(
                fontSize: 12.5,
                height: 1.4,
                color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
              ),
              maxLines: review.photos.isNotEmpty ? 2 : 4,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (review.photos.isNotEmpty) ...[
            const SizedBox(height: 8),
            SizedBox(
              height: 38,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: review.photos.length,
                separatorBuilder: (_, __) => const SizedBox(width: 6),
                itemBuilder: (context, pIdx) {
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      review.photos[pIdx],
                      width: 38,
                      height: 38,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                    ),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }
}
