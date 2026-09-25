import '../entities/user_entity.dart';

abstract class AuthRepository {
  Future<UserEntity> login(
    String email,
    String password, {
    String? phone,
    String? country,
  });
  Future<UserEntity> register(
    String name,
    String email,
    String password, {
    String? phone,
    String? country,
  });
  Future<void> logout();
  Future<UserEntity?> getCurrentUser();
  bool isAuthenticated();
}
