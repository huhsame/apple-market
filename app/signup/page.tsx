import Link from "next/link";
import { AuthCard } from "@/components/AuthUI";
import SignupForm from "./SignupForm";

export const metadata = { title: "회원가입 · 사과마켓" };

// ※ 이미 로그인한 사용자는 proxy.ts에서 홈으로 보냅니다.
export default function SignupPage() {
  return (
    <AuthCard
      title="사과마켓 시작하기"
      subtitle="1분이면 가입 끝. 가까운 이웃과 거래해 보세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            로그인
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
