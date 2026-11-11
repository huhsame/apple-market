# 🍎 사과마켓

우리 동네 중고거래 웹사이트 (개발 공부용, 단계별 진행)

🔗 **배포 주소: https://apple-market-vert.vercel.app** (Vercel, `main` 브랜치에 push하면 자동 배포)

- **Next.js 16** (App Router, Server Actions, `proxy.ts`)
- **Supabase** (Auth + Postgres) — 가계부(MONEY FLOW)와 **같은 프로젝트**를 사용
- **Tailwind CSS v4** · 화이트 & 블랙 디자인 · Pretendard 폰트

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000 접속. 환경변수는 `.env.local` (예시: `.env.example`).

## 진행 단계

- [x] **1단계: 회원가입 / 로그인 / 로그아웃**
- [ ] 2단계: 상품 등록 / 목록
- [ ] 3단계: 상품 상세 / 이미지 업로드
- [ ] …

## 폴더 구조 (1단계)

```
app/
  page.tsx               홈
  login/                 로그인 페이지 + 폼(클라이언트 컴포넌트)
  signup/                회원가입 페이지 + 폼
  auth/actions.ts        서버 액션: login / signup / logout
  auth/callback/route.ts 이메일 인증 링크가 돌아오는 곳
components/
  Header.tsx, UserMenu.tsx, Logo.tsx, AuthUI.tsx
lib/
  auth.ts                현재 로그인 사용자 + 닉네임 가져오기
  supabase/client.ts     브라우저용 Supabase 클라이언트
  supabase/server.ts     서버용 Supabase 클라이언트
  supabase/proxy.ts      요청마다 세션 갱신 + 로그인 사용자 /login 접근 차단
proxy.ts                 (Next 16에서 middleware.ts → proxy.ts로 이름 변경)
supabase/migrations/     DB 변경 기록 (SQL)
```

## DB

가계부와 DB를 같이 쓰므로 사과마켓 테이블은 **`market_` 접두어**로 구분합니다.

| 테이블 | 설명 |
| --- | --- |
| `market_profiles` | 회원 닉네임. 가입 시 트리거(`handle_new_market_user`)가 자동 생성 |

> ⚠️ 로그인 계정(`auth.users`)은 같은 Supabase 프로젝트를 쓰는 모든 앱이 공유합니다.

## 동작 흐름

1. **회원가입**: 폼 → `signup` 서버 액션 → 입력 검사 & 닉네임 중복 확인 → `supabase.auth.signUp()` → 트리거가 `market_profiles`에 닉네임 저장
2. **로그인**: `signInWithPassword()` → 세션이 쿠키에 저장
3. **로그인 유지**: `proxy.ts`가 매 요청마다 토큰 갱신
4. **로그아웃**: `signOut()` → 쿠키 삭제

## 배포 메모

나중에 가계부와 다른 주소로 배포할 때, Supabase 대시보드 → Authentication → URL Configuration 의
**Redirect URLs**에 새 도메인의 `/auth/callback` 을 추가하세요. (이메일 인증을 켤 경우 필요)
