import React, { useState, useEffect } from 'react';
import './Auth.css';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signUpWithEmail,
  signInWithEmail,
  setupRecaptcha,
  sendPhoneVerification,
  verifyPhoneCode
} from '../firebase/authService';

function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState('social'); // 'social', 'email', 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authMethod === 'phone') {
      setupRecaptcha('recaptcha-container');
    }
  }, [authMethod]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithGoogle();
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithFacebook();
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');
    const result = await signInWithApple();
    if (result.success) {
      onAuthSuccess(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isSignUp) {
      if (!displayName.trim()) {
        setError('이름을 입력해주세요.');
        setLoading(false);
        return;
      }
      const result = await signUpWithEmail(email, password, displayName);
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(getErrorMessage(result.error));
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(getErrorMessage(result.error));
      }
    }
    setLoading(false);
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!showVerificationInput) {
      // 전화번호 형식 확인 (국가 코드 포함)
      if (!phoneNumber.startsWith('+')) {
        setError('전화번호는 +82로 시작해야 합니다. (예: +821012345678)');
        setLoading(false);
        return;
      }
      
      const result = await sendPhoneVerification(phoneNumber);
      if (result.success) {
        setShowVerificationInput(true);
      } else {
        setError(getErrorMessage(result.error));
      }
    } else {
      const result = await verifyPhoneCode(verificationCode);
      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError('인증 코드가 올바르지 않습니다.');
      }
    }
    setLoading(false);
  };

  const getErrorMessage = (error) => {
    if (error.includes('email-already-in-use')) return '이미 사용중인 이메일입니다.';
    if (error.includes('weak-password')) return '비밀번호는 최소 6자 이상이어야 합니다.';
    if (error.includes('invalid-email')) return '유효하지 않은 이메일 주소입니다.';
    if (error.includes('user-not-found')) return '등록되지 않은 이메일입니다.';
    if (error.includes('wrong-password')) return '비밀번호가 올바르지 않습니다.';
    if (error.includes('popup-closed-by-user')) return '로그인이 취소되었습니다.';
    if (error.includes('account-exists-with-different-credential')) 
      return '이미 다른 방법으로 등록된 계정입니다.';
    return error;
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>📋 Todo Together</h1>
          <p>{isSignUp ? '새 계정 만들기' : '로그인'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-method-tabs">
          <button
            className={`method-tab ${authMethod === 'social' ? 'active' : ''}`}
            onClick={() => setAuthMethod('social')}
          >
            소셜 로그인
          </button>
          <button
            className={`method-tab ${authMethod === 'email' ? 'active' : ''}`}
            onClick={() => setAuthMethod('email')}
          >
            이메일
          </button>
          <button
            className={`method-tab ${authMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setAuthMethod('phone')}
          >
            전화번호
          </button>
        </div>

        <div className="auth-content">
          {authMethod === 'social' && (
            <div className="social-buttons">
              <button
                className="social-btn google-btn"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 계속하기
              </button>
              <button
                className="social-btn facebook-btn"
                onClick={handleFacebookSignIn}
                disabled={loading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook으로 계속하기
              </button>
              <button
                className="social-btn apple-btn"
                onClick={handleAppleSignIn}
                disabled={loading}
              >
                <svg className="social-icon" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple로 계속하기
              </button>
            </div>
          )}

          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} className="auth-form">
              {isSignUp && (
                <input
                  type="text"
                  placeholder="이름"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-input"
                  required
                />
              )}
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
              <input
                type="password"
                placeholder="비밀번호 (최소 6자)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
                minLength={6}
              />
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '처리중...' : (isSignUp ? '회원가입' : '로그인')}
              </button>
            </form>
          )}

          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneAuth} className="auth-form">
              <input
                type="tel"
                placeholder="전화번호 (+821012345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="auth-input"
                required
                disabled={showVerificationInput}
              />
              {showVerificationInput && (
                <input
                  type="text"
                  placeholder="인증 코드 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="auth-input"
                  required
                />
              )}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '처리중...' : (showVerificationInput ? '인증 완료' : '인증 코드 전송')}
              </button>
              <div id="recaptcha-container"></div>
            </form>
          )}
        </div>

        <div className="auth-footer">
          <button
            className="toggle-auth-mode"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;

