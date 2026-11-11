import Link from "next/link";

// 심플한 사과 마크 + 워드마크
export function AppleMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 7.2c-1.2-1.1-2.7-1.6-4.2-1.3C5 6.4 3.5 9 3.9 12.4c.5 4.3 3.3 8.4 5.8 8.4.9 0 1.5-.5 2.3-.5s1.4.5 2.3.5c2.5 0 5.3-4.1 5.8-8.4.4-3.4-1.1-6-3.9-6.5-1.5-.3-3 .2-4.2 1.3Z"
        fill="currentColor"
      />
      <path
        d="M12.4 6.6c.1-2 1.3-3.5 3.3-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="사과마켓 홈">
      <AppleMark />
      <span className="text-lg font-extrabold tracking-tight">사과마켓</span>
    </Link>
  );
}
