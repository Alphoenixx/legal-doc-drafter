import 'package:flutter/material.dart';

/// Centralized color constants for the Legal Doc Drafter app.
/// Replaces all hardcoded Color(...) values scattered across files.
class AppColors {
  AppColors._(); // prevent instantiation

  // Backgrounds
  static const Color bgBase = Color(0xFF0B0F14);
  static const Color bgSurface = Color(0xFF111820);
  static const Color bgElevated = Color(0xFF1A2332);
  static const Color bgInput = Color(0xFF0D1219);

  // Accent / Brand
  static const Color accent = Color(0xFF2DD4BF);
  static const Color accentSecondary = Color(0xFF06B6D4);

  // Text
  static const Color textPrimary = Color(0xFFF0F4F8);
  static const Color textSecondary = Colors.grey;

  // Utility
  static Color accentDim(double opacity) => accent.withValues(alpha: opacity);
  static Color greyDim(double opacity) => Colors.grey.withValues(alpha: opacity);
}
