import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class SearchFilterBar extends StatelessWidget {
  final String selectedCategory;
  final Function(String) onCategorySelected;
  final Function(String) onSearchSubmitted;
  final TextEditingController searchController;

  const SearchFilterBar({
    super.key,
    required this.selectedCategory,
    required this.onCategorySelected,
    required this.onSearchSubmitted,
    required this.searchController,
  });

  static const List<String> categories = [
    'All',
    'Luxury',
    'Beachfront',
    'Mountain',
    'Boutique',
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Search TextField
        Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isDark ? AppColors.borderDark : AppColors.borderLight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: TextField(
            controller: searchController,
            onSubmitted: onSearchSubmitted,
            textInputAction: TextInputAction.search,
            style: TextStyle(
              color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
              fontSize: 14,
            ),
            decoration: InputDecoration(
              hintText: 'Search Maldives, Bali, Swiss Alps...',
              prefixIcon: const Icon(Icons.search_rounded, color: AppColors.accentGold, size: 22),
              suffixIcon: searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 18),
                      onPressed: () {
                        searchController.clear();
                        onSearchSubmitted('');
                      },
                    )
                  : null,
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Category Pills
        SizedBox(
          height: 42,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final cat = categories[index];
              final isSelected = cat.toLowerCase() == selectedCategory.toLowerCase();

              return GestureDetector(
                onTap: () => onCategorySelected(cat),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.accentGold
                        : (isDark ? AppColors.surfaceDark : Colors.white),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.accentGold
                          : (isDark ? AppColors.borderDark : AppColors.borderLight),
                    ),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: AppColors.accentGold.withOpacity(0.35),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ]
                        : null,
                  ),
                  child: Text(
                    cat,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected
                          ? Colors.white
                          : (isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
