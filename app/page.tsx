import Link from "next/link";
import { Suspense } from "react";
import { AppleMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            우리 동네 중고거래
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-6xl">
            필요 없는 물건은
            <br />
            이웃에게, 사과마켓.
          </h1>
          <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
            가까운 이웃과 믿을 수 있는 거래. 사고 팔고, 나누는 일을 더 간단하게.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Suspense fallback={<div className="h-12 w-64 rounded-full bg-soft" />}>
              <HeroActions />
            </Suspense>
          </div>
        </div>
      </section>

      {/* 다음 단계에서 상품 목록이 들어갈 자리 */}
      <section className="mx-auto w-full max-w-5xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">최근 올라온 물건</h2>
          <span className="text-sm text-muted">준비 중</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-soft text-neutral-300">
                <AppleMark className="h-10 w-10" />
              </div>
              <div className="mt-3 h-4 w-3/4 rounded bg-soft" />
              <div className="mt-2 h-4 w-1/3 rounded bg-soft" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// 로그인 여부에 따라 버튼이 달라지는 부분
async function HeroActions() {
  const me = await getCurrentUser();

  if (me) {
    return (
      <span className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-white">
        {me.nickname} 님, 환영해요! 상품 기능은 곧 열려요
      </span>
    );
  }

  return (
    <>
      <Link
        href="/signup"
        className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-[15px] font-semibold text-white transition hover:bg-neutral-700"
      >
        지금 시작하기
      </Link>
      <Link
        href="/login"
        className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[15px] font-semibold transition hover:border-foreground"
      >
        로그인
      </Link>
    </>
  );
}
