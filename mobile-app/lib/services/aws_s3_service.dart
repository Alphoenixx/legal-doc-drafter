import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import 'package:minio/minio.dart';
import 'dart:typed_data';
import '../app_config.dart';

class AwsS3Service {
  static const _bucketName = AppConfig.s3BucketName;
  static const _region = AppConfig.awsRegion;
  static const _identityPoolId = AppConfig.cognitoIdentityPoolId;

  /// Uploads a file byte array to S3 using the Minio client.
  /// Exchanges the Cognito [idToken] for temporary IAM credentials via the Identity Pool,
  /// then uses Minio's built-in SigV4 signing (exactly like the legacy JS SDK's s3.upload()).
  Future<String> uploadFile(String fileName, List<int> fileBytes, String idToken) async {
    final safeName = fileName.replaceAll(RegExp(r'\s+'), '_');
    final uniqueId = '${DateTime.now().millisecondsSinceEpoch}_${(DateTime.now().microsecondsSinceEpoch % 10000)}';
    final key = 'uploads/${uniqueId}_$safeName';

    // 1. Get Temporary AWS Credentials using the Identity Pool
    final credentials = CognitoCredentials(
      _identityPoolId,
      CognitoUserPool(AppConfig.cognitoUserPoolId, AppConfig.cognitoClientId),
    );
    await credentials.getAwsCredentials(idToken);

    if (credentials.accessKeyId == null || credentials.secretAccessKey == null) {
      throw Exception('Failed to retrieve AWS Credentials from Identity Pool');
    }

    // 2. Create a Minio client with the temporary credentials
    //    This handles ALL SigV4 signing internally, just like the JS SDK's s3.upload()
    final minio = Minio(
      endPoint: 's3.$_region.amazonaws.com',
      accessKey: credentials.accessKeyId!,
      secretKey: credentials.secretAccessKey!,
      sessionToken: credentials.sessionToken,
      region: _region,
      useSSL: true,
    );

    // 3. Upload the file using putObject — SigV4 is handled automatically
    try {
      final stream = Stream<Uint8List>.value(Uint8List.fromList(fileBytes));
      await minio.putObject(
        _bucketName,
        key,
        stream,
        size: fileBytes.length,
      );
    } catch (e) {
      print('--- S3 UPLOAD ERROR ---');
      print(e.toString());
      throw Exception('S3 Upload Failed: $e');
    }

    return key;
  }
}
