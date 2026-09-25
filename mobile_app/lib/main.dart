import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'config/routes/app_router.dart';
import 'config/theme/app_theme.dart';
import 'core/constants/app_constants.dart';
import 'core/local_storage/hive_service.dart';
import 'core/network/api_client.dart';
import 'core/services/notification_service.dart';
import 'features/auth/data/datasources/auth_local_data_source.dart';
import 'features/auth/data/datasources/auth_remote_data_source.dart';
import 'features/auth/data/repositories/auth_repository_impl.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/bloc/auth_event.dart';
import 'features/booking/data/datasources/booking_local_data_source.dart';
import 'features/booking/data/datasources/booking_remote_data_source.dart';
import 'features/booking/data/datasources/hotel_local_data_source.dart';
import 'features/booking/data/datasources/hotel_remote_data_source.dart';
import 'features/booking/data/repositories/booking_repository_impl.dart';
import 'features/booking/data/repositories/hotel_repository_impl.dart';
import 'features/booking/presentation/bloc/booking_bloc.dart';
import 'features/booking/presentation/bloc/booking_event.dart';
import 'features/booking/presentation/bloc/hotel_bloc.dart';
import 'features/booking/presentation/bloc/hotel_event.dart';
import 'features/booking/presentation/screens/main_navigation_shell.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Local Hive Storage
  await HiveService.instance.init();

  // Initialize Notification Service (FCM & local streams)
  await NotificationService.instance.init();

  runApp(const LuxeHotelApp());
}

class LuxeHotelApp extends StatefulWidget {
  const LuxeHotelApp({super.key});

  @override
  State<LuxeHotelApp> createState() => _LuxeHotelAppState();
}

class _LuxeHotelAppState extends State<LuxeHotelApp> {
  late bool _isDarkMode;

  // Singletons & Services
  late final ApiClient _apiClient;
  late final AuthRepositoryImpl _authRepository;
  late final HotelRepositoryImpl _hotelRepository;
  late final BookingRepositoryImpl _bookingRepository;

  @override
  void initState() {
    super.initState();
    _isDarkMode = HiveService.instance.isDarkMode();

    _apiClient = ApiClient(useMock: false);

    final hive = HiveService.instance;
    final authRemote = AuthRemoteDataSourceImpl(apiClient: _apiClient);
    final authLocal = AuthLocalDataSourceImpl(hiveService: hive);
    _authRepository = AuthRepositoryImpl(remoteDataSource: authRemote, localDataSource: authLocal);

    final hotelRemote = HotelRemoteDataSourceImpl(apiClient: _apiClient);
    final hotelLocal = HotelLocalDataSourceImpl(hiveService: hive);
    _hotelRepository = HotelRepositoryImpl(remoteDataSource: hotelRemote, localDataSource: hotelLocal);

    final bookingRemote = BookingRemoteDataSourceImpl(apiClient: _apiClient);
    final bookingLocal = BookingLocalDataSourceImpl(hiveService: hive);
    _bookingRepository = BookingRepositoryImpl(localDataSource: bookingLocal, remoteDataSource: bookingRemote);
  }

  void _updateTheme(bool isDark) {
    setState(() {
      _isDarkMode = isDark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => AuthBloc(authRepository: _authRepository)..add(CheckAuthStatusEvent()),
        ),
        BlocProvider<HotelBloc>(
          create: (_) => HotelBloc(hotelRepository: _hotelRepository)..add(const LoadHotelsEvent()),
        ),
        BlocProvider<BookingBloc>(
          create: (_) => BookingBloc(bookingRepository: _bookingRepository)..add(LoadUserBookingsEvent()),
        ),
      ],
      child: MaterialApp(
        scrollBehavior: const MaterialScrollBehavior().copyWith(
          dragDevices: {
            PointerDeviceKind.touch,
            PointerDeviceKind.mouse,
            PointerDeviceKind.trackpad,
            PointerDeviceKind.stylus,
          },
        ),
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
        onGenerateRoute: (settings) => AppRouter.generateRoute(settings, onThemeToggle: _updateTheme),
        home: MainNavigationShell(onThemeToggle: _updateTheme),
      ),
    );
  }
}
