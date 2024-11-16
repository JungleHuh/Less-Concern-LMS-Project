# Less-Concern-LMS-Project

자격증 시험 준비를 위한 학습 지원 시스템입니다. AI 기반의 문제 분석과 커뮤니티 기능을 통해 학습자들의 효율적인 학습을 지원합니다.

## 주요 기능

### 문제 분석 시스템
- 문제 이미지 업로드 및 텍스트 추출
- AI 기반 문제 분석 (Claude API 활용)
  - 핵심 개념 분석
  - 해결 방법 제시
  - 관련 개념 설명
  - 학습 포인트 제공

### 질문 게시판
- 시험 유형별, 과목별 질문 분류
- 이미지 첨부 기능
- 답변 등록 및 채택 기능
- 조회수 추적 기능

### 사용자 인증
- JWT 기반 사용자 인증
- 권한 기반 접근 제어

## 기술 스택

### Frontend
- React
- React Router Dom
- Axios
- ShadcN/ui
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- JWT 인증
- Cloudinary (이미지 저장)

### AI/ML
- Claude API (문제 분석)
- OmniParser (이미지 텍스트 추출)

## 설치 및 실행 방법

### 환경 변수 설정
```bash
# .env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLAUDE_API_KEY=your_claude_api_key
```

### 서버 실행
```bash
cd server
npm install
npm start
```

### 클라이언트 실행
```bash
cd client
npm install
npm run dev
```

## 프로젝트 구조

```
project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── public/
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── middleware/
└── python/
    └── OmniParser/
```

## 기능 확장 예정
- [ ] 실시간 알림 기능
- [ ] 학습 진도 관리
- [ ] 오답 노트 기능
- [ ] 통계 분석 대시보드
- [ ] 모바일 반응형 UI 개선

## 라이선스
MIT License
