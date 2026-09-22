import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary Luxury Palette
  static const Color primaryNavy = Color(0xFF0F172A);
  static const Color secondaryNavy = Color(0xFF1E293B);
  static const Color accentGold = Color(0xFFD97706);
  static const Color accentGoldLight = Color(0xFFFBBF24);
  static const Color luxuryGold = Color(0xFFC5A880);

  // Backgrounds & Surfaces
  static const Color bgLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color cardLight = Color(0xFFFFFFFF);

  static const Color bgDark = Color(0xFF090D16);
  static const Color surfaceDark = Color(0xFF131B2E);
  static const Color cardDark = Color(0xFF1E293B);

  // Text Colors
  static const Color textPrimaryLight = Color(0xFF0F172A);
  static const Color textSecondaryLight = Color(0xFF64748B);
  static const Color textMutedLight = Color(0xFF94A3B8);

  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFF94A3B8);
  static const Color textMutedDark = Color(0xFF64748B);

  // Functional Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
  static const Color starRating = Color(0xFFFFB800);

  // Borders & Dividers
  static const Color borderLight = Color(0xFFE2E8F0);
  static const Color borderDark = Color(0xFF2A364F);

  // Gradients
  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFD97706), Color(0xFFFBBF24)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient darkCardGradient = LinearGradient(
    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroOverlayGradient = LinearGradient(
    colors: [Colors.transparent, Color(0xCC090D16), Color(0xFF090D16)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    stops: [0.3, 0.75, 1.0],
  );
}
