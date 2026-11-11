"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/auth/actions";
import { Alert, Field, SubmitButton } from "@/components/AuthUI";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  // 인증 메일 발송 완료 화면
  if (state?.message) {
    return (
      <div className="space-y-6">
        <Alert tone="success">{state.message}</Alert>
        <Link
          href="/login"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-line text-[15px] font-semibold transition hover:border-foreground"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="이메일"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="apple@example.com"
        defaultValue={state?.fields?.email}
        required
      />
      <Field
        label="닉네임"
        name="nickname"
        type="text"
        autoComplete="nickname"
        placeholder="동네에서 불릴 이름"
        hint="2~12자, 다른 회원과 겹칠 수 없어요."
        minLength={2}
        maxLength={12}
        defaultValue={state?.fields?.nickname}
        required
      />
      <Field
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="6자 이상"
        minLength={6}
        required
      />
      <Field
        label="비밀번호 확인"
        name="passwordConfirm"
        type="password"
        autoComplete="new-password"
        placeholder="한 번 더 입력"
        minLength={6}
        required
      />

      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <div className="pt-2">
        <SubmitButton pending={pending}>가입하기</SubmitButton>
      </div>
    </form>
  );
}
