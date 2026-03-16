import 'package:amazon_cognito_identity_dart_2/cognito.dart';
import '../app_config.dart';

class AwsAuthService {
  final _userPool = CognitoUserPool(AppConfig.cognitoUserPoolId, AppConfig.cognitoClientId);
  
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
