import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/document_generation_provider.dart';

class StorageHelper {
  static const String _draftsKey = 'drafted_documents';
  static const String _queueKey = 'staging_queue';

  static Future<void> saveDrafts(List<DraftedDocument> drafts) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = drafts.map((d) => d.toJson()).toList();
    await prefs.setString(_draftsKey, jsonEncode(jsonList));
  }

  static Future<List<DraftedDocument>> loadDrafts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_draftsKey);
      if (jsonString == null) return [];
      
      final List<dynamic> jsonList = jsonDecode(jsonString);
      return jsonList.map((j) => DraftedDocument.fromJson(j)).toList();
    } catch (e) {
      return [];
    }
  }

  static Future<void> saveQueue(List<Map<String, dynamic>> queue) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_queueKey, jsonEncode(queue));
  }

  static Future<List<Map<String, dynamic>>> loadQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_queueKey);
      if (jsonString == null) return [];
      
      final List<dynamic> jsonList = jsonDecode(jsonString);
      return jsonList.cast<Map<String, dynamic>>();
    } catch (e) {
      return [];
    }
  }
}
