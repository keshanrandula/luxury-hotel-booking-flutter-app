import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_data_source.dart';
import '../datasources/auth_remote_data_source.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<UserEntity> login(String email, String password) async {
    final (user, token) = await remoteDataSource.login(email, password);
    await localDataSource.saveSession(user, token);
    return user;
  }

  @override
  Future<UserEntity> register(String name, String email, String password) async {
    final (user, token) = await remoteDataSource.register(name, email, password);
    await localDataSource.saveSession(user, token);
    return user;
  }

  @override
  Future<void> logout() async {
    try {
      await remoteDataSource.logout();
    } catch (_) {}
    await localDataSource.clearSession();
  }

  @override
  Future<UserEntity?> getCurrentUser() async {
    return localDataSource.getUser();
  }

  @override
  bool isAuthenticated() {
    final token = localDataSource.getToken();
    return token != null && token.isNotEmpty;
  }
}
