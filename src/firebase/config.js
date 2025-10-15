import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAXm8_DOgphTYZqrLRcH8tckHtmPdAV9gw",
  authDomain: "todo-together-bb867.firebaseapp.com",
  projectId: "todo-together-bb867",
  storageBucket: "todo-together-bb867.firebasestorage.app",
  messagingSenderId: "76783518427",
  appId: "1:76783518427:web:a74a49603a425ca4df02fe",
  measurementId: "G-8F1GBR9HJK"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

