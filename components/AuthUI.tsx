// 로그인/회원가입 폼에서 같이 쓰는 작은 UI 조각들
import type { InputHTMLAttributes, ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-10">{children}</div>
        {footer && (
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
        )}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none transition placeholder:text-neutral-400 focus:border-foreground focus:ring-1 focus:ring-foreground"
      />
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-xl bg-foreground text-[15px] font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "잠시만요…" : children}
    </button>
  );
}

export function Alert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={
        tone === "error"
          ? "rounded-xl border border-foreground px-4 py-3 text-sm font-medium"
          : "rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-white"
      }
    >
      {children}
    </p>
  );
}
