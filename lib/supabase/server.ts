// 서버(서버 컴포넌트, 서버 액션, 라우트 핸들러)에서 쓰는 Supabase 클라이언트
// 요청마다 새로 만들어야 합니다. (전역 변수에 저장해서 재사용 X)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

export async function createClient() {
  // 로그인 정보는 요청마다 다르므로 "요청 시점에 실행"하도록 알려줍니다.
  // (Next 16 Cache Components: 없으면 미리 렌더링하다 Date.now() 경고가 납니다)
  await connection();
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없어서 에러가 납니다.
            // proxy.ts가 세션을 갱신해 주므로 무시해도 괜찮아요.
          }
        },
      },
    },
  );
}
