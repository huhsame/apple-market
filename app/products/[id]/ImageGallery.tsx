"use client";

// 상세 페이지의 사진 보기: 큰 사진 1장 + 아래 작은 사진들(누르면 큰 사진이 바뀜)
// "지금 몇 번째 사진인지" 기억해야 해서 클라이언트 컴포넌트(useState)입니다.
import Image from "next/image";
import { useState } from "react";
import { AppleMark } from "@/components/Logo";

export default function ImageGallery({ urls, alt }: { urls: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  // 사진이 없는 글
  if (urls.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-soft text-neutral-300">
        <AppleMark className="h-16 w-16" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-soft">
        <Image
          src={urls[index]}
          alt={`${alt} 사진 ${index + 1}`}
          fill
          sizes="(min-width: 672px) 640px, 100vw"
          className="object-contain"
        />
        {urls.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-medium text-white">
            {index + 1} / {urls.length}
          </span>
        )}
      </div>

      {urls.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}번째 사진 보기`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-soft transition ${
                i === index ? "ring-2 ring-foreground" : "opacity-50 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
