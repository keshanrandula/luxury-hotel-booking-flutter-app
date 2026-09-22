import '../../../../core/local_storage/hive_service.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> saveSession(UserModel user, String token);
  UserModel? getUser();
  String? getToken();
  Future<void> clearSession();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final HiveService hiveService;

  AuthLocalDataSourceImpl({required this.hiveService});

  @override
  Future<void> saveSession(UserModel user, String token) async {
    await hiveService.saveToken(token);
    await hiveService.saveUserData(user.toJson());
  }

  @override
  UserModel? getUser() {
    final data = hiveService.getUserData();
    if (data == null) return null;
    return UserModel.fromJson(data);
  }

  @override
  String? getToken() {
    return hiveService.getToken();
  }

  @override
  Future<void> clearSession() async {
    await hiveService.clearAuth();
  }
}
