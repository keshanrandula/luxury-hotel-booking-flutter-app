import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;

  AuthBloc({required this.authRepository}) : super(const AuthState()) {
    on<CheckAuthStatusEvent>(_onCheckAuthStatus);
    on<LoginEvent>(_onLogin);
    on<RegisterEvent>(_onRegister);
    on<GuestLoginEvent>(_onGuestLogin);
    on<LogoutEvent>(_onLogout);
  }

  Future<void> _onCheckAuthStatus(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final user = await authRepository.getCurrentUser();
      if (user != null) {
        emit(state.copyWith(
          status: AuthStatus.authenticated,
          user: user,
          isGuest: false,
        ));
      } else {
        emit(state.copyWith(status: AuthStatus.unauthenticated));
      }
    } catch (_) {
      emit(state.copyWith(status: AuthStatus.unauthenticated));
    }
  }

  Future<void> _onLogin(
    LoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading, errorMessage: null));
    try {
      final user = await authRepository.login(
        event.email,
        event.password,
        phone: event.phone,
        country: event.country,
      );
      emit(state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        isGuest: false,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceAll('Exception: ', '').replaceAll('ServerException: ', ''),
      ));
    }
  }

  Future<void> _onRegister(
    RegisterEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading, errorMessage: null));
    try {
      final user = await authRepository.register(
        event.name,
        event.email,
        event.password,
        phone: event.phone,
        country: event.country,
      );
      emit(state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        isGuest: false,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: e.toString().replaceAll('Exception: ', '').replaceAll('ServerException: ', ''),
      ));
    }
  }

  Future<void> _onGuestLogin(
    GuestLoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    const guestUser = UserEntity(
      id: 'usr_guest',
      name: 'Guest Traveler',
      email: 'guest@luxurystays.io',
      tier: 'VIP Explorer',
      points: 2500,
    );
    emit(state.copyWith(
      status: AuthStatus.authenticated,
      user: guestUser,
      isGuest: true,
    ));
  }

  Future<void> _onLogout(
    LogoutEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await authRepository.logout();
    emit(const AuthState(status: AuthStatus.unauthenticated));
  }
}
