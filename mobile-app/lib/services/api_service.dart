import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const _apiUrl = 'https://11ghprcjk7.execute-api.ap-south-1.amazonaws.com/process';

  Future<Map<String, dynamic>> generateDocument({
    required String s3Key,
    required String docType,
    required String idToken,
  }) async {
    final response = await http.post(
      Uri.parse(_apiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken,
      },
      body: jsonEncode({
        's3_key': s3Key,
        'doc_type': docType,
      }),
    );

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
