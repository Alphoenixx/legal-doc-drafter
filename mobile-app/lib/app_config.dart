/// Central configuration for the Flutter app.
///
/// New deployments should only need to edit this file.
/// Do NOT commit secrets here.
class AppConfig {
  // --- AWS region and S3 ---
  static const awsRegion = 'ap-south-1';
  static const s3BucketName = 'doc-parser-app-as';

  // --- Cognito (User Pool + App Client) ---
  static const cognitoUserPoolId = 'ap-south-1_72jrSgVgi';
  static const cognitoClientId = '73o39h36c36r253ijh5sstnj7e';

  // --- Cognito Identity Pool (temporary AWS creds for S3) ---
  static const cognitoIdentityPoolId = 'ap-south-1:572e2fdb-95bc-4675-ba7d-aec010896169';

  // --- Backend API (API Gateway) ---
  static const apiProcessUrl = 'https://11ghprcjk7.execute-api.ap-south-1.amazonaws.com/process';
}

