import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/local_storage/hive_service.dart';
import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_event.dart';
import '../../../auth/presentation/bloc/auth_state.dart';

class ProfileScreen extends StatefulWidget {
  final Function(bool) onThemeToggle;

  const ProfileScreen({super.key, required this.onThemeToggle});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late bool _isDark;

  @override
  void initState() {
    super.initState();
    _isDark = HiveService.instance.isDarkMode();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkTheme = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'VIP Concierge & Profile',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.3,
            color: isDarkTheme ? AppColors.textPrimaryDark : AppColors.textPrimaryLight,
          ),
        ),
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          final user = authState.user;
          final isGuest = authState.isGuest;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Member Card
                Container(
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    gradient: isDarkTheme ? AppColors.darkCardGradient : const LinearGradient(
                      colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundImage: user?.avatarUrl != null ? NetworkImage(user!.avatarUrl!) : null,
                            backgroundColor: AppColors.accentGold.withOpacity(0.3),
                            child: user?.avatarUrl == null
                                ? Text(
                                    user?.name.isNotEmpty == true ? user!.name[0] : 'G',
                                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                                  )
                                : null,
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  user?.name ?? 'Guest Traveler',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  user?.email ?? 'guest@luxurystays.io',
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.7),
                                    fontSize: 12.5,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      const Divider(color: Colors.white24),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'MEMBERSHIP TIER',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.6),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                user?.tier ?? 'Silver Prestige',
                                style: const TextStyle(
                                  color: AppColors.accentGoldLight,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                'LUXURY POINTS',
                                style: TextStyle(
                                  color: Colors.white.withOpacity(0.6),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 1.0,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${user?.points ?? 2500} pts',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Settings List
                _buildSettingsSection(
                  title: 'Preferences',
                  isDark: isDarkTheme,
                  children: [
                    SwitchListTile(
                      title: const Text('Dark Mode Aesthetics', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                      subtitle: const Text('Toggle between sleek dark and light luxury', style: TextStyle(fontSize: 12)),
                      value: _isDark,
                      activeColor: AppColors.accentGold,
                      onChanged: (val) {
                        setState(() => _isDark = val);
                        HiveService.instance.setDarkMode(val);
                        widget.onThemeToggle(val);
                      },
                    ),
                    _buildTile(
                      icon: Icons.currency_exchange_rounded,
                      title: 'Preferred Currency',
                      subtitle: 'USD (\$)',
                    ),
                    _buildTile(
                      icon: Icons.language_rounded,
                      title: 'Language',
                      subtitle: 'English (US)',
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                _buildSettingsSection(
                  title: 'VIP Concierge & Support',
                  isDark: isDarkTheme,
                  children: [
                    _buildTile(
                      icon: Icons.support_agent_rounded,
                      title: '24/7 Dedicated Butler Concierge',
                      subtitle: 'Direct private line',
                      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                    ),
                    _buildTile(
                      icon: Icons.security_rounded,
                      title: 'Privacy & Security Policy',
                      subtitle: 'End-to-end itinerary encryption',
                      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Logout Button
                OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  foregroundColor: AppColors.error,
                  side: const BorderSide(color: AppColors.error),
                ).let(
                  (style) => SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        foregroundColor: AppColors.error,
                        side: const BorderSide(color: AppColors.error),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () {
                        context.read<AuthBloc>().add(LogoutEvent());
                      },
                      icon: const Icon(Icons.logout_rounded, size: 18),
                      label: Text(
                        isGuest ? 'Exit Guest Mode' : 'Sign Out',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSettingsSection({
    required String title,
    required bool isDark,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 14, 18, 6),
            child: Text(
              title.toUpperCase(),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.accentGold,
                letterSpacing: 1.0,
              ),
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _buildTile({
    required IconData icon,
    required String title,
    required String subtitle,
    Widget? trailing,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.accentGold, size: 22),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: trailing,
    );
  }
}

extension ObjectExt<T> on T {
  R let<R>(R Function(T) op) => op(this);
}
