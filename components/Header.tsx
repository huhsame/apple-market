import { Suspense } from "react";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";

// 헤더 틀(로고)은 바로 보여주고,
// 로그인 정보가 필요한 메뉴만 <Suspense>로 감싸서 나중에 채웁니다.
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Logo />
        <Suspense fallback={<div className="h-9 w-36 rounded-full bg-soft" />}>
          <UserMenu />
        </Suspense>
      </div>
    </header>
  );
}
