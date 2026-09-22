import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../error/exceptions.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    debugPrint('Dio Error: [${err.response?.statusCode}] ${err.message}');

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        throw NetworkException('Connection timeout. Please check your network.');
      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        final responseData = err.response?.data;
        String message = 'Unexpected error occurred';

        if (responseData is Map && responseData.containsKey('message')) {
          message = responseData['message'].toString();
        }

        if (statusCode == 401) {
          throw AuthException(message);
        } else {
          throw ServerException(message, statusCode: statusCode);
        }
      case DioExceptionType.connectionError:
        throw NetworkException('Network connection failed');
      default:
        throw ServerException(err.message ?? 'Unknown network error');
    }
  }
}
