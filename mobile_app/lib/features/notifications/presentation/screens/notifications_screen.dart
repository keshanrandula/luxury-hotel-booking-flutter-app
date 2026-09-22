import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/services/notification_service.dart';
import '../../../../core/utils/date_formatter.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  static const String routeName = '/notifications';

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final allNotifications = NotificationService.instance.notifications;

    final filteredList = allNotifications.where((n) {
      if (_selectedFilter == 'all') return true;
      return n.type == _selectedFilter;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Notifications & Alerts',
          style: TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
        actions: [
          if (allNotifications.isNotEmpty) ...[
            IconButton(
              icon: const Icon(Icons.done_all_rounded, size: 20, color: AppColors.accentGold),
              tooltip: 'Mark all as read',
              onPressed: () {
                setState(() {
                  NotificationService.instance.markAllAsRead();
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('All notifications marked as read')),
                );
              },
            ),
            PopupMenuButton<String>(
              icon: const Icon(Icons.more_vert_rounded, size: 20),
              onSelected: (val) {
                if (val == 'clear') {
                  setState(() {
                    NotificationService.instance.clearAll();
                  });
                }
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'clear',
                  child: Row(
                    children: [
                      Icon(Icons.delete_sweep_outlined, size: 18, color: AppColors.error),
                      SizedBox(width: 8),
                      Text('Clear all notifications', style: TextStyle(color: AppColors.error, fontSize: 13)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs Bar
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              children: [
                _buildFilterChip('all', 'All', allNotifications.length, isDark),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'booking_confirmed',
                  'Bookings 🛎️',
                  allNotifications.where((n) => n.type == 'booking_confirmed').length,
                  isDark,
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'checkin_reminder',
                  'Check-In ⏰',
                  allNotifications.where((n) => n.type == 'checkin_reminder').length,
                  isDark,
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'promo_deal',
                  'Offers 🏷️',
                  allNotifications.where((n) => n.type == 'promo_deal').length,
                  isDark,
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'system_alert',
                  'VIP 👑',
                  allNotifications.where((n) => n.type == 'system_alert').length,
                  isDark,
                ),
              ],
            ),
          ),

          // Notification List
          Expanded(
            child: filteredList.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(22),
                          decoration: BoxDecoration(
                            color: AppColors.accentGold.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.notifications_none_rounded, size: 48, color: AppColors.accentGold),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No alerts found',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'You are all caught up with luxury concierge updates',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 6, 16, 24),
                    itemCount: filteredList.length,
                    itemBuilder: (context, index) {
                      final item = filteredList[index];
                      return Dismissible(
                        key: Key(item.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          margin: const EdgeInsets.only(bottom: 12),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.85),
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: const Icon(Icons.delete_outline_rounded, color: Colors.white, size: 24),
                        ),
                        onDismissed: (_) {
                          NotificationService.instance.deleteNotification(item.id);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Notification removed'), duration: Duration(seconds: 2)),
                          );
                        },
                        child: _buildNotificationCard(item, isDark),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String id, String label, int count, bool isDark) {
    final isSelected = _selectedFilter == id;
    return GestureDetector(
      onTap: () => setState(() => _selectedFilter = id),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
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
              ? [BoxShadow(color: AppColors.accentGold.withOpacity(0.25), blurRadius: 6, offset: const Offset(0, 2))]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                color: isSelected
                    ? Colors.white
                    : (isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight),
              ),
            ),
            if (count > 0) ...[
              const SizedBox(width: 5),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                decoration: BoxDecoration(
                  color: isSelected ? Colors.white.withOpacity(0.25) : AppColors.accentGold.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$count',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: isSelected ? Colors.white : AppColors.accentGold,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationCard(NotificationItem item, bool isDark) {
    final iconData = _getIconForType(item.type);
    final iconColor = _getColorForType(item.type);

    return GestureDetector(
      onTap: () {
        if (!item.isRead) {
          setState(() {
            NotificationService.instance.markAsRead(item.id);
          });
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: item.isRead
              ? (isDark ? AppColors.surfaceDark : Colors.white)
              : (isDark ? const Color(0xFF18233C) : const Color(0xFFFFFBEB)),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: item.isRead
                ? (isDark ? AppColors.borderDark : AppColors.borderLight)
                : AppColors.accentGold.withOpacity(0.45),
            width: item.isRead ? 1 : 1.3,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: iconColor.withOpacity(0.14),
                shape: BoxShape.circle,
              ),
              child: Icon(iconData, size: 20, color: iconColor),
            ),
            const SizedBox(width: 13),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          item.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: isDark ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
                          ),
                        ),
                      ),
                      if (!item.isRead)
                        Container(
                          width: 8,
                          height: 8,
                          margin: const EdgeInsets.only(left: 6),
                          decoration: const BoxDecoration(
                            color: AppColors.accentGold,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.body,
                    style: TextStyle(
                      fontSize: 12.5,
                      height: 1.4,
                      color: isDark ? AppColors.textSecondaryDark : AppColors.textSecondaryLight,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormatter.time(item.timestamp),
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? AppColors.textMutedDark : AppColors.textMutedLight,
                        ),
                      ),
                      _buildActionPill(item, isDark),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionPill(NotificationItem item, bool isDark) {
    if (item.data != null && item.data!['promoCode'] != null) {
      final code = item.data!['promoCode'];
      return InkWell(
        onTap: () {
          Clipboard.setData(ClipboardData(text: code.toString()));
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Promo Code "$code" copied to clipboard!'),
              backgroundColor: AppColors.success,
            ),
          );
        },
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: AppColors.accentGold.withOpacity(0.12),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.accentGold.withOpacity(0.3)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.copy_rounded, size: 11, color: AppColors.accentGold),
              const SizedBox(width: 4),
              Text(
                'Copy Code: $code',
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  color: AppColors.accentGold,
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (item.type == 'checkin_reminder') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: AppColors.info.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'VIP Butler Alert',
          style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.info),
        ),
      );
    }

    if (item.type == 'booking_confirmed') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: AppColors.success.withOpacity(0.12),
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'Itinerary Ready',
          style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: AppColors.success),
        ),
      );
    }

    return const SizedBox.shrink();
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'booking_confirmed':
        return Icons.check_circle_rounded;
      case 'checkin_reminder':
        return Icons.access_time_filled_rounded;
      case 'promo_deal':
        return Icons.local_offer_rounded;
      default:
        return Icons.auto_awesome_rounded;
    }
  }

  Color _getColorForType(String type) {
    switch (type) {
      case 'booking_confirmed':
        return AppColors.success;
      case 'checkin_reminder':
        return AppColors.info;
      case 'promo_deal':
        return AppColors.accentGold;
      default:
        return Colors.purple;
    }
  }
}
