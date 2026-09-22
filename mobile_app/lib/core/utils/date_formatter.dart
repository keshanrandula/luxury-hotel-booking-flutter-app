import 'package:intl/intl.dart';

class DateFormatter {
  DateFormatter._();

  static final DateFormat _shortDate = DateFormat('MMM d');
  static final DateFormat _mediumDate = DateFormat('MMM d, yyyy');
  static final DateFormat _fullDate = DateFormat('EEEE, MMMM d, yyyy');
  static final DateFormat _time = DateFormat('h:mm a');

  static String short(DateTime date) => _shortDate.format(date);
  static String medium(DateTime date) => _mediumDate.format(date);
  static String full(DateTime date) => _fullDate.format(date);
  static String time(DateTime date) => _time.format(date);

  static String dateRange(DateTime checkIn, DateTime checkOut) {
    if (checkIn.year == checkOut.year) {
      if (checkIn.month == checkOut.month) {
        return '${DateFormat('MMM d').format(checkIn)} - ${DateFormat('d, yyyy').format(checkOut)}';
      }
      return '${DateFormat('MMM d').format(checkIn)} - ${DateFormat('MMM d, yyyy').format(checkOut)}';
    }
    return '${_mediumDate.format(checkIn)} - ${_mediumDate.format(checkOut)}';
  }

  static int calculateNights(DateTime checkIn, DateTime checkOut) {
    final difference = checkOut.difference(checkIn).inDays;
    return difference > 0 ? difference : 1;
  }
}
