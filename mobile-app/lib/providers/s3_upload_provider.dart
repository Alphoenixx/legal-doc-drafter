import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/aws_s3_service.dart';
import 'auth_provider.dart';

final s3ServiceProvider = Provider((ref) => AwsS3Service());

enum S3UploadStatus { idle, uploading, success, error }

class S3UploadState {
  final S3UploadStatus status;
  final String? s3Key;
  final String? errorMessage;
  final String? uploadingFileName;

  S3UploadState({
    this.status = S3UploadStatus.idle,
    this.s3Key,
    this.errorMessage,
    this.uploadingFileName,
  });

  S3UploadState copyWith({
    S3UploadStatus? status,
    String? s3Key,
    String? errorMessage,
    String? uploadingFileName,
  }) {
    return S3UploadState(
      status: status ?? this.status,
      s3Key: s3Key ?? this.s3Key,
      errorMessage: errorMessage ?? this.errorMessage,
      uploadingFileName: uploadingFileName ?? this.uploadingFileName,
    );
  }
}

class S3UploadNotifier extends Notifier<S3UploadState> {
  @override
  S3UploadState build() => S3UploadState();

  Future<void> uploadFile(String fileName, List<int> bytes) async {
    final authState = ref.read(authProvider);
    if (authState.status != AuthStatus.authenticated) {
      state = state.copyWith(status: S3UploadStatus.error, errorMessage: 'User is not authenticated.');
      return;
    }

    final authService = ref.read(authServiceProvider);
    final idToken = authService.getIdToken();
    
    if (idToken == null || idToken.isEmpty) {
      state = state.copyWith(status: S3UploadStatus.error, errorMessage: 'User session is invalid. Missing token.');
      return;
    }

    state = state.copyWith(status: S3UploadStatus.uploading, uploadingFileName: fileName, errorMessage: null);

    try {
      final s3Service = ref.read(s3ServiceProvider);
      final key = await s3Service.uploadFile(fileName, bytes, idToken);
      
      state = state.copyWith(status: S3UploadStatus.success, s3Key: key);
    } catch (e) {
      state = state.copyWith(status: S3UploadStatus.error, errorMessage: 'Failed to upload to S3: $e');
    }
  }

  void reset() {
    state = S3UploadState();
  }
}

final s3UploadProvider = NotifierProvider<S3UploadNotifier, S3UploadState>(S3UploadNotifier.new);
