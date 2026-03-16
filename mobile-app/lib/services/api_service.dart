import 'dart:convert';
import 'package:http/http.dart' as http;
import '../app_config.dart';

class ApiService {
  static const _apiUrl = AppConfig.apiProcessUrl;
  static const _timeout = Duration(seconds: 30);

  Future<Map<String, dynamic>> generateDocument({
    required String s3Key,
    required String docType,
    required String idToken,
  }) async {
    final http.Response response;
    try {
      response = await http.post(
        Uri.parse(_apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken,
        },
        body: jsonEncode({
          's3_key': s3Key,
          'doc_type': docType,
        }),
      ).timeout(_timeout);
    } on Exception catch (e) {
      if (e.toString().contains('TimeoutException')) {
        throw Exception('Request timed out. Please check your connection and try again.');
      }
      rethrow;
    }

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      String errorMessage = 'Unknown Error';
      try {
        final errorData = jsonDecode(response.body);
        errorMessage = errorData['error'] ?? response.reasonPhrase ?? 'Failed to generate document';
      } catch (_) {
        errorMessage = response.reasonPhrase ?? 'Failed to generate document';
      }
      throw Exception('Backend Error: $errorMessage');
    }
  }
}
