import 'package:dio/dio.dart';
import '../constants/api_endpoints.dart';
import '../local_storage/hive_service.dart';
import 'error_interceptor.dart';
import 'mock_interceptor.dart';

class ApiClient {
  late final Dio _dio;

  ApiClient({bool useMock = false}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: ApiEndpoints.connectTimeout,
        receiveTimeout: ApiEndpoints.receiveTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Auth Token Interceptor
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final token = HiveService.instance.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
      ),
    );

    // Mock Interceptor for seamless offline / offline-first execution
    if (useMock) {
      _dio.interceptors.add(MockInterceptor());
    }

    // Error Interceptor
    _dio.interceptors.add(ErrorInterceptor());
  }

  Dio get dio => _dio;

  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.get(path, queryParameters: queryParameters, options: options);
  }

  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.post(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.delete(path, data: data, queryParameters: queryParameters, options: options);
  }
}
