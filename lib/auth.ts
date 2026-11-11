// 현재 로그인한 사용자 + 닉네임을 가져오는 도우미 (서버 전용)
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = { id: string; email: string; nickname: string };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  // getUser()는 Supabase 서버에 토큰을 검증받으므로 안전합니다.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("market_profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    nickname: profile?.nickname ?? user.email ?? "회원",
  };
}
