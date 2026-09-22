import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/constants/app_colors.dart';

class AppTextStyles {
  AppTextStyles._();

  // Headings
  static TextStyle displayLarge(bool isDark) => GoogleFonts.outfit(
        fontSize: 32,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  static TextStyle displayMedium(bool isDark) => GoogleFonts.outfit(
        fontSize: 26,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.3,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  static TextStyle displaySmall(bool isDark) => GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  // Titles
  static TextStyle titleLarge(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  static TextStyle titleMedium(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  // Body
  static TextStyle bodyLarge(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  static TextStyle bodyMedium(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
      );

  static TextStyle bodySmall(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 11,
        fontWeight: FontWeight.w400,
        color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
      );

  // Labels & Badges
  static TextStyle labelBold(bool isDark) => GoogleFonts.plusJakartaSans(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.5,
        color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
      );

  static TextStyle priceTag(bool isDark) => GoogleFonts.outfit(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.accentGold,
      );
}
