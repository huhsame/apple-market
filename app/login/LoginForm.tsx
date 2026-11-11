"use client";

import { useActionState } from "react";
import { login } from "@/app/auth/actions";
import { Alert, Field, SubmitButton } from "@/components/AuthUI";

export default function LoginForm({ initialError }: { initialError?: string }) {
  // state: 서버 액션이 돌려준 값, pending: 처리 중 여부
  const [state, formAction, pending] = useActionState(login, undefined);
  const error = state?.error ?? initialError;

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
        label="비밀번호"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="비밀번호"
        required
      />

      {error && <Alert tone="error">{error}</Alert>}

      <div className="pt-2">
        <SubmitButton pending={pending}>로그인</SubmitButton>
      </div>
    </form>
  );
}
