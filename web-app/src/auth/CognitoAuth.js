import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import APP_CONFIG from '../config';

let userPool = null;

function isConfigured() {
  return APP_CONFIG?.aws?.cognito?.userPoolId && APP_CONFIG?.aws?.cognito?.clientId;
}

function getPool() {
  if (!isConfigured()) return null;
  if (!userPool) {
    userPool = new CognitoUserPool({
      UserPoolId: APP_CONFIG.aws.cognito.userPoolId,
      ClientId: APP_CONFIG.aws.cognito.clientId,
    });
  }
  return userPool;
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    const pool = getPool();
    if (!pool) return reject(new Error('Cognito is not configured.'));
    const user = new CognitoUser({ Username: email, Pool: pool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes) => {
        // Handle new password required challenge
        delete userAttributes.email_verified;
        delete userAttributes.email;
        user.completeNewPasswordChallenge(password, userAttributes, {
          onSuccess: (session) => resolve(session),
          onFailure: (err) => reject(err),
        });
      },
    });
  });
}

export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    const pool = getPool();
    if (!pool) return reject(new Error('Cognito is not configured.'));
    pool.signUp(email, password, [], null, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function confirmSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const pool = getPool();
    if (!pool) return reject(new Error('Cognito is not configured.'));
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmRegistration(code, true, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export function signOut() {
  const pool = getPool();
  if (!pool) return;
  const user = pool.getCurrentUser();
  if (user) user.signOut();
}

export function getCurrentSession() {
  return new Promise((resolve, reject) => {
    const pool = getPool();
    if (!pool) return reject(new Error('Cognito is not configured.'));
    const user = pool.getCurrentUser();
    if (!user) return reject(new Error('No user'));
    user.getSession((err, session) => {
      if (err) return reject(err);
      resolve(session);
    });
  });
}

export function getIdToken() {
  return getCurrentSession().then(s => s.getIdToken().getJwtToken());
}
