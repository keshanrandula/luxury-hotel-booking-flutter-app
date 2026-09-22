import 'package:intl/intl.dart';

enum CurrencyMode { usd, lkr }

class CurrencyFormatter {
  CurrencyFormatter._();

  static const double _usdToLkrRate = 300.0;

  static String format(num amountUSD, {CurrencyMode mode = CurrencyMode.usd}) {
    if (mode == CurrencyMode.lkr) {
      final lkrAmount = (amountUSD * _usdToLkrRate).round();
      return 'Rs ${NumberFormat('#,##0').format(lkrAmount)}';
    }
    return '\$${NumberFormat('#,##0').format(amountUSD)}';
  }

  static String formatPerNight(num amountUSD, {CurrencyMode mode = CurrencyMode.usd}) {
    return '${format(amountUSD, mode: mode)} / night';
  }
}
