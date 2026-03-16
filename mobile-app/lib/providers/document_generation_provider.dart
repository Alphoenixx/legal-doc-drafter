import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import 'auth_provider.dart';
import '../main.dart';

final apiServiceProvider = Provider((ref) => ApiService());

enum GenerationStatus { idle, generating, success, error }

class DraftedDocument {
  final String title;
  final String summary;
  final String pdfUrl;
  final String latexCode;
  
  DraftedDocument({
    required this.title,
    required this.summary,
    required this.pdfUrl,
    required this.latexCode,
  });
}

class DocumentGenerationState {
  final GenerationStatus status;
  final String? errorMessage;
  final DraftedDocument? result;

  DocumentGenerationState({
    this.status = GenerationStatus.idle,
    this.errorMessage,
    this.result,
  });

  DocumentGenerationState copyWith({
    GenerationStatus? status,
    String? errorMessage,
    DraftedDocument? result,
  }) {
    return DocumentGenerationState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      result: result ?? this.result,
    );
  }
}

class DocumentGenerationNotifier extends Notifier<DocumentGenerationState> {
  @override
  DocumentGenerationState build() => DocumentGenerationState();

  Future<void> generateDocument(String s3Key, String docType) async {
    final authState = ref.read(authProvider);
    if (authState.status != AuthStatus.authenticated) {
      state = state.copyWith(status: GenerationStatus.error, errorMessage: 'User is not authenticated.');
      return;
    }

    // Get the live JWT token from the authenticated Cognito session
    final authService = ref.read(authServiceProvider);
    final idToken = authService.getIdToken();
    
    if (idToken == null || idToken.isEmpty) {
      state = state.copyWith(status: GenerationStatus.error, errorMessage: 'User session is invalid. Missing token.');
      return;
    }
    
    state = state.copyWith(status: GenerationStatus.generating, errorMessage: null, result: null);

    try {
      final apiService = ref.read(apiServiceProvider);
      
      // Live API call — mirrors legacy app.js fetch(API_GATEWAY_URL, { method: "POST", ... })
      final data = await apiService.generateDocument(s3Key: s3Key, docType: docType, idToken: idToken);

      final pdfUrl = (data['pdf_url'] as String?) ?? '';
      if (pdfUrl.isEmpty) {
        throw Exception('Backend Error: Missing pdf_url in response');
      }

      final doc = DraftedDocument(
        title: docType.toUpperCase(),
        summary: 'AI-generated $docType document',
        pdfUrl: pdfUrl,
        latexCode: data['latex'] ?? '',
      );

      // Add to global drafted list provider
      ref.read(draftedDocumentsProvider.notifier).add(doc);
      ref.read(unseenDraftsProvider.notifier).state++;

      state = state.copyWith(status: GenerationStatus.success, result: doc);
    } catch (e) {
      String errMsg = e.toString().replaceAll('Exception: ', '');
      // Match legacy app.js token limit error handling
      if (errMsg.toLowerCase().contains('token') || errMsg.toLowerCase().contains('limit') || errMsg.toLowerCase().contains('too large')) {
        errMsg = 'Token Limit Reached: The document exceeds the maximum word limit allowed by the Gemini AI engine. Please upload a shorter document.';
      }
      state = state.copyWith(status: GenerationStatus.error, errorMessage: errMsg);
    }
  }

  void reset() {
    state = DocumentGenerationState();
  }
}

final documentGenerationProvider = NotifierProvider<DocumentGenerationNotifier, DocumentGenerationState>(DocumentGenerationNotifier.new);

// Manage history list
class DraftedDocumentsNotifier extends Notifier<List<DraftedDocument>> {
  @override
  List<DraftedDocument> build() => [];
  
  void add(DraftedDocument doc) {
    state = [doc, ...state]; // prepending latest
  }
}

final draftedDocumentsProvider = NotifierProvider<DraftedDocumentsNotifier, List<DraftedDocument>>(DraftedDocumentsNotifier.new);
