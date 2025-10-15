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
                <span className="social-icon">🔍</span>
                Google로 계속하기
              </button>
              <button
                className="social-btn facebook-btn"
                onClick={handleFacebookSignIn}
                disabled={loading}
              >
                <span className="social-icon">📘</span>
                Facebook으로 계속하기
              </button>
              <button
                className="social-btn apple-btn"
                onClick={handleAppleSignIn}
                disabled={loading}
              >
                <span className="social-icon">🍎</span>
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

