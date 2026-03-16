import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/aws_auth_service.dart';

final authServiceProvider = Provider((ref) => AwsAuthService());

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthState {
  final AuthStatus status;
  final String? errorMessage;

  AuthState({
    this.status = AuthStatus.unauthenticated,
    this.errorMessage,
  });

  AuthState copyWith({
    AuthStatus? status,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AuthState(
      status: status ?? this.status,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }
}

class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() => AuthState();

  Future<void> login(String email, String password) async {
    state = state.copyWith(status: AuthStatus.loading, clearError: true);
    
    try {
      final authService = ref.read(authServiceProvider);
      final token = await authService.login(email, password);
      
      if (token != null) {
        state = state.copyWith(status: AuthStatus.authenticated, clearError: true);
      } else {
        state = state.copyWith(
          status: AuthStatus.error, 
          errorMessage: 'Authentication failed: No token received.'
        );
      }
    } catch (e) {
      String msg;
      if (e.toString().contains('UserNotFoundException')) {
          msg = 'User not found. Please sign up first.';
      } else if (e.toString().contains('NotAuthorizedException')) {
          msg = 'Incorrect username or password.';
      } else {
          msg = e.toString().replaceAll('Exception: ', '');
      }
      state = state.copyWith(status: AuthStatus.error, errorMessage: msg);
    }
  }

  Future<void> signUp(String email, String password) async {
    state = state.copyWith(status: AuthStatus.loading, clearError: true);

    try {
      final authService = ref.read(authServiceProvider);
      await authService.signUp(email, password);
      await login(email, password);
    } catch (e) {
      String msg;
      if (e.toString().contains('UserNotFoundException')) {
          msg = 'User not found. Please sign up first.';
      } else if (e.toString().contains('NotAuthorizedException')) {
          msg = 'Incorrect username or password.';
      } else {
          msg = e.toString().replaceAll('Exception: ', '');
      }
      state = state.copyWith(status: AuthStatus.error, errorMessage: msg);
    }
  }

  Future<void> logout() async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      final authService = ref.read(authServiceProvider);
      await authService.logout();
    } finally {
      state = AuthState(); // Reset back to unauthenticated
    }
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
