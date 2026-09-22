import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/network/api_client.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<(UserModel, String)> login(String email, String password);
  Future<(UserModel, String)> register(String name, String email, String password);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<(UserModel, String)> login(String email, String password) async {
    final response = await apiClient.post(
      ApiEndpoints.login,
      data: {'email': email, 'password': password},
    );

    final data = response.data as Map<String, dynamic>;
    final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
    final token = data['token'] as String;
    return (user, token);
  }

  @override
  Future<(UserModel, String)> register(String name, String email, String password) async {
    final response = await apiClient.post(
      ApiEndpoints.register,
      data: {'name': name, 'email': email, 'password': password},
    );

    final data = response.data as Map<String, dynamic>;
    final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
    final token = data['token'] as String;
    return (user, token);
  }

  @override
  Future<void> logout() async {
    await apiClient.post(ApiEndpoints.logout);
  }
}
