# Firebase 설정 가이드 🔥

이 Todo 앱을 실행하려면 Firebase 프로젝트를 설정해야 합니다.

## 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "todo-together")
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

## 2단계: 웹 앱 추가

1. Firebase 콘솔에서 프로젝트 선택
2. 프로젝트 개요 옆의 톱니바퀴 아이콘 → "프로젝트 설정" 클릭
3. 아래로 스크롤하여 "내 앱" 섹션에서 웹 아이콘(`</>`) 클릭
4. 앱 닉네임 입력 (예: "Todo Web App")
5. "Firebase Hosting 설정" 체크박스는 선택사항
6. "앱 등록" 클릭
7. **Firebase 설정 객체 복사** (다음 단계에서 필요)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 3단계: Firebase 설정 파일 업데이트

1. 복사한 설정값을 `src/firebase/config.js` 파일에 붙여넣기
2. 기존의 `YOUR_API_KEY` 등을 실제 값으로 교체

```javascript
// src/firebase/config.js
const firebaseConfig = {
  apiKey: "실제_API_KEY",
  authDomain: "실제_AUTH_DOMAIN",
  projectId: "실제_PROJECT_ID",
  storageBucket: "실제_STORAGE_BUCKET",
  messagingSenderId: "실제_SENDER_ID",
  appId: "실제_APP_ID"
};
```

## 4단계: Authentication 설정

1. Firebase 콘솔 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭 선택
4. 다음 로그인 방법들을 **활성화**:

### ✅ Google
- "Google" 클릭
- "사용 설정" 토글 ON
- 프로젝트 지원 이메일 선택
- "저장" 클릭

### ✅ Facebook
- "Facebook" 클릭
- "사용 설정" 토글 ON
- Facebook 개발자 센터에서 앱 만들기:
  1. [Facebook for Developers](https://developers.facebook.com/) 접속
  2. 앱 만들기
  3. 앱 ID와 앱 시크릿 복사
- Firebase에 앱 ID와 시크릿 입력
- OAuth 리디렉션 URI 복사하여 Facebook 앱 설정에 추가
- "저장" 클릭

### ✅ Apple
- "Apple" 클릭
- "사용 설정" 토글 ON
- Apple Developer 계정 필요
- 서비스 ID 등록 필요
- "저장" 클릭

### ✅ 전화번호
- "전화" 클릭
- "사용 설정" 토글 ON
- "저장" 클릭

### ✅ 이메일/비밀번호
- "이메일/비밀번호" 클릭
- "사용 설정" 토글 ON
- "저장" 클릭

## 5단계: Firestore Database 설정

1. Firebase 콘솔 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. "프로덕션 모드에서 시작" 또는 "테스트 모드에서 시작" 선택
   - **개발 중에는 테스트 모드 권장**
4. 위치 선택 (asia-northeast3 - 서울 권장)
5. "사용 설정" 클릭

### 보안 규칙 설정 (테스트용)

"규칙" 탭에서 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 인증된 경우에만 접근 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 워크스페이스는 멤버만 접근 가능
    match /workspaces/{workspaceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
    }
    
    // Todo는 해당 워크스페이스 멤버만 접근 가능
    match /todos/{todoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ 프로덕션 배포 시에는 더 엄격한 보안 규칙 필요!**

## 6단계: Firestore 인덱스 생성

Todo 쿼리를 위한 복합 인덱스가 필요합니다:

1. Firestore Database → "색인" 탭
2. "복합" 탭 선택
3. 다음 인덱스 추가:

**인덱스 1:**
- 컬렉션 ID: `todos`
- 필드:
  - `workspaceId` (오름차순)
  - `createdAt` (내림차순)

**인덱스 2 (담당자별 필터용):**
- 컬렉션 ID: `todos`
- 필드:
  - `workspaceId` (오름차순)
  - `assignedTo` (오름차순)
  - `createdAt` (내림차순)

또는 앱 실행 중 콘솔에서 인덱스 생성 링크가 나오면 클릭하여 자동 생성 가능!

## 7단계: 앱 실행

모든 설정이 완료되면:

```bash
npm start
```

## 문제 해결

### 로그인 오류
- Firebase Console에서 해당 로그인 방법이 활성화되어 있는지 확인
- 도메인이 승인된 도메인 목록에 있는지 확인 (Authentication → Settings → Authorized domains)

### Firestore 오류
- 보안 규칙이 올바르게 설정되어 있는지 확인
- 필요한 인덱스가 생성되어 있는지 확인

### 전화번호 인증 오류
- reCAPTCHA가 올바르게 설정되어 있는지 확인
- 전화번호 형식이 +82로 시작하는지 확인

## 데이터베이스 구조

앱은 다음과 같은 Firestore 구조를 사용합니다:

```
firestore/
├── users/
│   └── {userId}/
│       ├── uid
│       ├── email
│       ├── displayName
│       ├── photoURL
│       ├── createdAt
│       └── workspaces: []
│
├── workspaces/
│   └── {workspaceId}/
│       ├── id
│       ├── name
│       ├── ownerId
│       ├── members: []
│       ├── inviteCode
│       └── createdAt
│
└── todos/
    └── {todoId}/
        ├── id
        ├── workspaceId
        ├── text
        ├── completed
        ├── dueDate
        ├── assignedTo
        ├── createdBy
        ├── createdAt
        └── updatedAt
```

## 추가 기능 (선택사항)

### Firebase Hosting 배포
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 도움말

더 자세한 내용은 [Firebase 공식 문서](https://firebase.google.com/docs)를 참고하세요.

