// 목록에 보이는 판매글 카드 한 장
// 사진 기능은 아직 없어서, 사진 자리에 사과 마크를 보여줍니다.
import Link from "next/link";
import { AppleMark } from "@/components/Logo";
import { formatPrice, timeAgo } from "@/lib/format";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-soft text-neutral-300 transition group-hover:bg-line">
        <AppleMark className="h-10 w-10" />
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
