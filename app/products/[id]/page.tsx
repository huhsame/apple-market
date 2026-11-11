import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DeleteButton from "@/app/products/DeleteButton";
import { AppleMark } from "@/components/Logo";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, timeAgo } from "@/lib/format";
import { getProduct } from "@/lib/products";

export const metadata = { title: "판매글 · 사과마켓" };

// 주소의 [id]는 요청 때 정해지므로(cacheComponents), 읽는 부분을 Suspense로 감쌉니다.
export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/products/[id]">["params"] }) {
  const { id } = await params;
  const [product, me] = await Promise.all([getProduct(id), getCurrentUser()]);
  if (!product) notFound();

  const isMine = me?.id === product.seller_id;
  const edited = product.updated_at !== product.created_at;

  return (
    <article className="mx-auto w-full max-w-2xl px-5 py-10">
      {/* 사진 자리 (다음 단계에서 이미지 업로드) */}
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-soft text-neutral-300">
        <AppleMark className="h-16 w-16" />
      </div>

      {/* 글쓴이 */}
      <div className="flex items-center justify-between border-b border-line py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-sm font-bold text-white">
            {product.seller?.nickname.slice(0, 1) ?? "?"}
          </div>
          <span className="font-semibold">{product.seller?.nickname ?? "알 수 없음"}</span>
        </div>
        {/* 내 글일 때만 수정/삭제 버튼 */}
        {isMine && (
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="inline-flex h-10 items-center rounded-full bg-foreground px-4 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              수정
            </Link>
            <DeleteButton id={product.id} />
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="py-6">
        <h1 className="text-2xl font-bold tracking-tight">{product.title}</h1>
        <p className="mt-1 text-xs text-muted">
          {timeAgo(product.created_at)}
          {edited && " · 수정됨"}
        </p>
        <p className="mt-4 text-xl font-extrabold">{formatPrice(product.price)}</p>
        {/* whitespace-pre-wrap: 입력한 줄바꿈을 그대로 보여주기 */}
        <p className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed">
          {product.description || <span className="text-muted">설명이 없어요.</span>}
        </p>
      </div>

      <Link href="/" className="text-sm font-medium text-muted underline underline-offset-4 hover:text-foreground">
        ← 목록으로
      </Link>
    </article>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      <div className="aspect-[4/3] rounded-3xl bg-soft" />
      <div className="mt-6 h-6 w-1/2 rounded bg-soft" />
      <div className="mt-3 h-5 w-1/4 rounded bg-soft" />
      <div className="mt-6 h-24 rounded bg-soft" />
    </div>
  );
}
