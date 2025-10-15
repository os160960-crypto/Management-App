import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Google 로그인
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    return { success: false, error: error.message };
  }
};

// Facebook 로그인
export const signInWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Facebook 로그인 오류:', error);
    return { success: false, error: error.message };
  }
};

// Apple 로그인
export const signInWithApple = async () => {
  try {
    const provider = new OAuthProvider('apple.com');
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Apple 로그인 오류:', error);
    return { success: false, error: error.message };
  }
};

// 전화번호 로그인 - reCAPTCHA 설정
export const setupRecaptcha = (containerId) => {
  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA 해결됨
      }
    });
    return window.recaptchaVerifier;
  } catch (error) {
    console.error('reCAPTCHA 설정 오류:', error);
    throw error;
  }
};

// 전화번호로 인증 코드 전송
export const sendPhoneVerification = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return { success: true };
  } catch (error) {
    console.error('전화번호 인증 오류:', error);
    return { success: false, error: error.message };
  }
};

// 인증 코드로 로그인
export const verifyPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    await createUserDocument(result.user);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('코드 확인 오류:', error);
    return { success: false, error: error.message };
  }
};

// 이메일/비밀번호 회원가입
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await createUserDocument(result.user, { displayName });
    return { success: true, user: result.user };
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, error: error.message };
  }
};

// 이메일/비밀번호 로그인
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('로그인 오류:', error);
    return { success: false, error: error.message };
  }
};

// 로그아웃
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return { success: false, error: error.message };
  }
};

// 사용자 문서 생성 (Firestore)
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName: displayName || additionalData.displayName || '사용자',
        photoURL: photoURL || '',
        createdAt,
        workspaces: [], // 사용자가 속한 워크스페이스 목록
        ...additionalData
      });
    } catch (error) {
      console.error('사용자 문서 생성 오류:', error);
    }
  }
};

// 인증 상태 관찰
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

