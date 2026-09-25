import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class CheckAuthStatusEvent extends AuthEvent {}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;
  final String? phone;
  final String? country;

  const LoginEvent({
    required this.email,
    required this.password,
    this.phone,
    this.country,
  });

  @override
  List<Object?> get props => [email, password, phone, country];
}

class RegisterEvent extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final String? phone;
  final String? country;

  const RegisterEvent({
    required this.name,
    required this.email,
    required this.password,
    this.phone,
    this.country,
  });

  @override
  List<Object?> get props => [name, email, password, phone, country];
}

class GuestLoginEvent extends AuthEvent {}

class LogoutEvent extends AuthEvent {}
