import 'package:amazon_cognito_identity_dart_2/cognito.dart';

class AwsAuthService {
  // Extracted from legacy_web_reference index.html & app.js
  static const _userPoolId = 'ap-south-1_72jrSgVgi';
  static const _clientId = '73o39h36c36r253ijh5sstnj7e';
  // IdentityPoolId is ap-south-1:572e2fdb-95bc-4675-ba7d-aec010896169 but we only need UserPool for direct login right now to get idToken as per legacy implementation.
  
  final _userPool = CognitoUserPool(_userPoolId, _clientId);
  
  CognitoUser? _cognitoUser;
  CognitoUserSession? _session;

  Future<String?> login(String email, String password) async {
    _cognitoUser = CognitoUser(email, _userPool);
    final authDetails = AuthenticationDetails(
      username: email,
      password: password,
    );

    try {
      _session = await _cognitoUser!.authenticateUser(authDetails);
      return _session?.getIdToken().getJwtToken();
    } catch (e) {
      if (e is CognitoClientException) {
        throw Exception(e.message ?? 'AWS Cognito Authentication Failed');
      } else if (e is CognitoUserException) {
        throw Exception(e.message ?? 'AWS Cognito User Error');
      }
      throw Exception(e.toString());
    }
  }

  Future<bool> signUp(String email, String password) async {
    try {
      final signUpResult = await _userPool.signUp(
        email,
        password,
      );
      // Cognito returns userConfirmed boolean. If false, needs verification via email (which requires another flow).
      return signUpResult.userConfirmed ?? false;
    } catch (e) {
      if (e is CognitoClientException) {
        throw Exception(e.message ?? 'AWS Cognito Sign Up Failed');
      } else if (e is CognitoUserException) {
        throw Exception(e.message ?? 'AWS Cognito User Error');
      }
      throw Exception(e.toString());
    }
  }

  Future<void> logout() async {
    if (_cognitoUser != null) {
      await _cognitoUser!.signOut();
      _session = null;
      _cognitoUser = null;
    }
  }

  String? getIdToken() {
    return _session?.getIdToken().getJwtToken();
  }
}
