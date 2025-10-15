# 📋 Todo Together - 협업 할 일 관리 앱

실시간으로 팀원들과 함께 사용할 수 있는 모던 Todo 앱입니다!

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)

## ✨ 주요 기능

### 🔐 다양한 로그인 방식
- **Google** 계정으로 로그인
- **Facebook** 계정으로 로그인
- **Apple** 계정으로 로그인
- **전화번호**로 로그인
- **이메일/비밀번호**로 회원가입 및 로그인

### 👥 워크스페이스 (팀 협업)
- 여러 워크스페이스 생성 가능
- **초대 코드**로 팀원 초대
- 워크스페이스별 멤버 관리
- 실시간으로 팀원의 변경사항 반영

### ✅ 할 일 관리
- 할 일 추가/수정/삭제
- 마감일 설정 (캘린더 UI)
- 완료 체크
- 팀원에게 할 일 할당 가능
- **실시간 동기화** - 팀원이 추가/수정/삭제하면 즉시 반영!

### 🎨 모던한 UI/UX
- 다크 테마
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 부드러운 애니메이션
- 직관적인 인터페이스

## 🚀 시작하기

### 1. 저장소 클론 및 패키지 설치

```bash
cd project.1
npm install
```

### 2. Firebase 설정

Firebase 프로젝트를 설정해야 합니다. 자세한 내용은 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)를 참조하세요.

**간단 요약:**
1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트 생성
2. Authentication 설정 (Google, Facebook, Apple, 전화번호 활성화)
3. Firestore Database 생성
4. 웹 앱 추가 후 설정값 복사
5. `src/firebase/config.js`에 설정값 붙여넣기

### 3. 앱 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`이 자동으로 열립니다.

## 📱 사용 방법

### 1단계: 로그인 또는 회원가입
- 원하는 로그인 방식 선택 (소셜 로그인, 이메일, 전화번호)
- 간편하게 로그인/회원가입

### 2단계: 워크스페이스 만들기 또는 참여하기
- **새 워크스페이스 만들기**: 팀/프로젝트 이름으로 생성
- **초대 코드로 참여**: 팀원이 공유한 초대 코드 입력

### 3단계: 할 일 관리
- 할 일 추가: 제목, 설명, 마감일 입력
- 담당자 지정: 팀원에게 할 일 할당
- 완료 체크: 완료된 할 일 체크
- 삭제: 불필요한 할 일 삭제

### 4단계: 팀원 초대
- 햄버거 메뉴(☰) → "워크스페이스 설정"
- "팀원 초대하기" → "초대 코드 보기"
- 초대 코드를 팀원에게 공유

## 🏗️ 기술 스택

- **Frontend**: React 18
- **Backend**: Firebase
  - Authentication (인증)
  - Firestore Database (실시간 데이터베이스)
- **Styling**: Custom CSS (다크 테마)
- **상태 관리**: React Hooks (useState, useEffect)

## 📂 프로젝트 구조

```
src/
├── components/
│   ├── Auth.jsx                 # 로그인/회원가입 UI
│   ├── Auth.css
│   ├── WorkspaceSelector.jsx    # 워크스페이스 선택
│   ├── WorkspaceSelector.css
│   ├── WorkspaceManager.jsx     # 워크스페이스 관리
│   ├── WorkspaceManager.css
│   ├── CustomCalendar.jsx       # 캘린더 컴포넌트
│   ├── CustomCalendar.css
│   ├── TodoInput.jsx            # 할 일 입력
│   ├── TodoList.jsx             # 할 일 목록
│   └── TodoItem.jsx             # 할 일 아이템
│
├── firebase/
│   ├── config.js                # Firebase 설정
│   ├── authService.js           # 인증 서비스
│   ├── workspaceService.js      # 워크스페이스 서비스
│   └── todoService.js           # Todo 서비스
│
├── App.js                       # 메인 앱 컴포넌트
├── App.css                      # 메인 스타일
└── index.js                     # 진입점
```

## 🔒 보안

- Firebase Authentication을 통한 안전한 사용자 인증
- Firestore Security Rules로 데이터 보호
- 워크스페이스 멤버만 해당 워크스페이스의 Todo에 접근 가능

## 🌟 주요 특징

### 실시간 동기화
팀원이 할 일을 추가하거나 완료하면 **즉시** 모든 팀원의 화면에 반영됩니다!

### 다중 워크스페이스
개인용, 회사용, 프로젝트별로 여러 워크스페이스를 만들어 관리할 수 있습니다.

### 초대 시스템
간단한 **6자리 초대 코드**로 팀원을 쉽게 초대할 수 있습니다.

### 담당자 할당
할 일을 특정 팀원에게 할당하여 책임을 명확히 할 수 있습니다.

## 🎯 향후 계획

- [ ] 할 일 카테고리/태그 기능
- [ ] 알림 기능 (할 일 마감일 알림)
- [ ] 파일 첨부 기능
- [ ] 댓글 기능
- [ ] 진행률 대시보드
- [ ] 다크/라이트 테마 토글

## 🐛 문제 해결

문제가 발생하면 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)의 "문제 해결" 섹션을 참조하세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 문의

문제나 제안사항이 있으시면 이슈를 생성해주세요!

---

Made with ❤️ for better team collaboration

