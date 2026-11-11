// 목록에 보이는 판매글 카드 한 장
// 대표 사진(첫 번째)이 있으면 보여주고, 없으면 사과 마크를 보여줍니다.
import Image from "next/image";
import Link from "next/link";
import { AppleMark } from "@/components/Logo";
import { formatPrice, timeAgo } from "@/lib/format";
import { imageUrl } from "@/lib/images";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-soft text-neutral-300 transition group-hover:bg-line">
        {cover ? (
          // fill: 부모 박스를 꽉 채우기 / sizes: 화면 폭별로 알맞은 크기의 이미지를 받게 해줘요
          <Image
            src={imageUrl(cover)}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <AppleMark className="h-10 w-10" />
        )}
        {product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-foreground/70 px-2 py-0.5 text-[11px] font-medium text-white">
            {product.images.length}장
          </span>
        )}
      </div>
      <h3 className="mt-3 line-clamp-1 text-[15px] font-medium">{product.title}</h3>
      <p className="mt-1 text-[15px] font-bold">{formatPrice(product.price)}</p>
      <p className="mt-1 text-xs text-muted">
        {product.seller?.nickname ?? "알 수 없음"} · {timeAgo(product.created_at)}
      </p>
    </Link>
  );
}

// 불러오는 동안 보여줄 회색 카드
export function ProductCardSkeleton() {
  return (
    <div>
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-soft text-neutral-300">
        <AppleMark className="h-10 w-10" />
      </div>
      <div className="mt-3 h-4 w-3/4 rounded bg-soft" />
      <div className="mt-2 h-4 w-1/3 rounded bg-soft" />
    </div>
  );
}
