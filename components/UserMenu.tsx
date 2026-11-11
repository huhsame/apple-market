// 서버 컴포넌트: 서버에서 로그인 여부를 확인해 메뉴를 바꿔 보여줍니다.
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function UserMenu() {
  const me = await getCurrentUser();

  if (!me) {
    return (
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/login"
          className="rounded-full px-4 py-2 font-medium transition hover:bg-soft"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-foreground px-4 py-2 font-medium text-white transition hover:bg-neutral-700"
        >
          회원가입
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-3 text-sm">
      <span className="hidden text-muted sm:inline">
        <b className="font-semibold text-foreground">{me.nickname}</b> 님
      </span>
      <Link
        href="/products/new"
        className="rounded-full bg-foreground px-4 py-2 font-medium text-white transition hover:bg-neutral-700"
      >
        판매하기
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="rounded-full border border-line px-4 py-2 font-medium transition hover:border-foreground"
        >
          로그아웃
        </button>
      </form>
    </nav>
  );
}
