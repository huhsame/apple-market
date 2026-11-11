<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🍎 사과마켓 — 에이전트 작업 규칙

당근마켓 같은 동네 중고거래 웹사이트. **사용자가 개발 공부용으로 차근차근 한 단계씩** 만드는 프로젝트입니다.

## 1. 학습 프로젝트 진행 방식

- **요청한 단계만 구현**합니다. 다음 단계 기능(상품, 채팅 등)을 미리 만들거나 "겸사겸사" 추가하지 마세요.
- 한 번에 너무 많이 바꾸지 말고, 사용자가 **흐름을 따라올 수 있는 크기**로 작업합니다.
- 코드에는 **한국어 주석**으로 "이 코드가 왜 필요한지"를 짧게 남깁니다.
- 작업이 끝나면 무엇을 왜 바꿨는지, 어떤 파일을 보면 공부가 되는지 한국어로 설명합니다.
- 단계가 끝나면 `README.md`의 **진행 단계 체크리스트**를 갱신하고, 커밋도 단계 단위로 나눕니다.
- 복잡한 추상화·라이브러리 추가보다 **읽기 쉬운 기본 방식**을 우선합니다. 새 패키지가 필요하면 이유를 설명합니다.
- 디자인은 **모던한 화이트 & 블랙** (Tailwind, Pretendard). 색을 추가하지 마세요.

## 2. Supabase — ⚠️ 가계부와 같은 DB를 재활용 중

- Supabase 프로젝트 `letdzrbayptvdzowigdy` 는 사용자가 먼저 만든 **가계부 앱(MONEY FLOW, `huhsame/money-flow`)과 공유**합니다.
- **가계부 데이터를 절대 건드리지 마세요.** `public.transactions` 테이블은 가계부 것입니다. 수정·삭제·구조 변경 금지.
- 사과마켓 테이블/함수/트리거는 **`market_` 접두어**로 만듭니다. (예: `market_profiles`, `market_products`)
- 모든 새 테이블은 **RLS를 켜고 정책을 작성**합니다. 변경 후 Supabase 보안 advisor로 점검합니다.
- **`auth.users`(로그인 계정)는 두 앱이 공유**합니다. `auth.users`에 거는 트리거는 다른 앱 가입에도 실행되므로 실패하지 않게(기본값 처리) 작성합니다.
- DB 구조 변경은 Supabase에 적용한 뒤 **SQL 사본을 `supabase/migrations/`에 저장**합니다. (`YYYYMMDDHHMMSS_설명.sql`)
- 데이터 삭제, `drop`, 대량 `update` 같은 **되돌릴 수 없는 SQL은 실행 전에 사용자에게 확인**합니다.
- 테스트로 만든 계정·데이터는 작업 후 사용자에게 정리 여부를 묻습니다.
- 현재 Supabase 설정: **이메일 인증 꺼짐**(가입 즉시 로그인). 켤 경우 Supabase의 Site URL / Redirect URLs에 배포 주소를 추가해야 합니다.

## 3. 배포

- GitHub: `huhsame/apple-market` (public) · Vercel: https://apple-market-vert.vercel.app
- **`main`에 push하면 Vercel이 자동 배포**합니다. push 전에 `npm run lint` / `npm run build` 로 확인합니다.
- 환경변수를 추가하면 `.env.local`뿐 아니라 **Vercel 환경변수에도 등록**해야 합니다. `.env.local`은 커밋하지 않습니다.

## 4. 기술 메모 (이 프로젝트에서 이미 겪은 것)

- Next.js 16: `middleware.ts` → **`proxy.ts`** (세션 갱신 + 로그인 사용자의 /login·/signup 접근 차단)
- `cacheComponents: true` 상태: 쿠키·로그인 정보를 읽는 컴포넌트는 **`<Suspense>`로 감싸고**, 서버 Supabase 클라이언트는 `connection()`을 먼저 호출합니다. (`lib/supabase/server.ts`)
- 서버에서 로그인 사용자 확인은 `lib/auth.ts`의 `getCurrentUser()`를 사용합니다.
- Windows 환경: Node는 `C:\Program Files\nodejs`, Vercel CLI는 `%APPDATA%\npm` — Bash PATH에 없으므로 PowerShell에서 PATH를 추가해 실행합니다.
