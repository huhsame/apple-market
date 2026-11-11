"use server";

// 서버 액션: 폼 제출 시 서버에서 실행되는 함수들
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState =
  | {
      error?: string;
      message?: string;
      fields?: { email?: string; nickname?: string };
    }
  | undefined;

// Supabase 에러 코드를 한국어 메시지로 바꿔줍니다.
function toKoreanError(code?: string, fallback?: string) {
  switch (code) {
    case "invalid_credentials":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "email_not_confirmed":
      return "이메일 인증을 먼저 완료해 주세요. 메일함을 확인해 보세요.";
    case "user_already_exists":
    case "email_exists":
      return "이미 가입된 이메일이에요.";
    case "weak_password":
      return "비밀번호가 너무 약해요. 더 길고 복잡하게 만들어 주세요.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
    case "email_address_invalid":
      return "사용할 수 없는 이메일 주소예요.";
    default:
      return fallback ?? "알 수 없는 오류가 발생했어요.";
  }
}

/* ---------------- 로그인 ---------------- */
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요.", fields: { email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: toKoreanError(error.code, error.message), fields: { email } };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

/* ---------------- 회원가입 ---------------- */
export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const nickname = String(formData.get("nickname") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const fields = { email, nickname };

  // 1) 입력값 검사
  if (!email || !nickname || !password) {
    return { error: "모든 항목을 입력해 주세요.", fields };
  }
  if (nickname.length < 2 || nickname.length > 12) {
    return { error: "닉네임은 2~12자로 입력해 주세요.", fields };
  }
  if (password.length < 6) {
    return { error: "비밀번호는 6자 이상이어야 해요.", fields };
  }
  if (password !== passwordConfirm) {
    return { error: "비밀번호가 서로 달라요.", fields };
  }

  const supabase = await createClient();

  // 2) 닉네임 중복 확인
  const { data: taken } = await supabase
    .from("market_profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();
  if (taken) {
    return { error: "이미 사용 중인 닉네임이에요.", fields };
  }

  // 3) 가입 요청 (nickname은 트리거가 market_profiles에 저장)
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: toKoreanError(error.code, error.message), fields };
  }

  // 이메일 인증이 켜져 있으면 이미 가입된 이메일도 에러 없이 identities가 빈 배열로 옵니다.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "이미 가입된 이메일이에요.", fields };
  }

  // 4) 이메일 인증이 필요한 경우 → 세션이 없음
  if (!data.session) {
    return {
      message: `${email} 로 인증 메일을 보냈어요. 메일의 링크를 누르면 가입이 완료됩니다.`,
    };
  }

  // 이메일 인증이 꺼져 있으면 바로 로그인 상태
  revalidatePath("/", "layout");
  redirect("/");
}

/* ---------------- 로그아웃 ---------------- */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
