import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthUI";
import LoginForm from "./LoginForm";

export const metadata = { title: "로그인 · 사과마켓" };

// ※ 이미 로그인한 사용자는 proxy.ts에서 홈으로 보냅니다.
export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthCard
      title="다시 만나서 반가워요"
      subtitle="이메일로 로그인하고 동네 거래를 시작하세요."
      footer={
        <>
          아직 회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-foreground underline underline-offset-4"
          >
            회원가입
          </Link>
        </>
      }
    >
      <Suspense fallback={<LoginForm />}>
        <LoginFormWithError searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

// 주소의 ?error=auth (인증 링크 실패)를 읽어서 폼에 넘겨줍니다.
async function LoginFormWithError({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const { error } = await searchParams;
  const initialError =
    error === "auth" ? "인증 링크가 만료되었거나 올바르지 않아요." : undefined;
  return <LoginForm initialError={initialError} />;
}
