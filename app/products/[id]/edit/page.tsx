import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { updateProduct } from "@/app/products/actions";
import ProductForm from "@/app/products/ProductForm";
import { getCurrentUser } from "@/lib/auth";
import { getProduct } from "@/lib/products";

export const metadata = { title: "판매글 수정 · 사과마켓" };

export default function EditProductPage({ params }: PageProps<"/products/[id]/edit">) {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">판매글 수정</h1>
      <div className="mt-10">
        <Suspense fallback={<div className="h-96 rounded-2xl bg-soft" />}>
          <EditForm params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditForm({ params }: { params: PageProps<"/products/[id]/edit">["params"] }) {
  const { id } = await params;
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const product = await getProduct(id);
  if (!product) notFound();
  // 남의 글이면 수정 화면 대신 상세 페이지로
  if (product.seller_id !== me.id) redirect(`/products/${product.id}`);

  return (
    <ProductForm
      // 어떤 글을 고칠지(id)를 서버 액션에 미리 묶어 둡니다.
      action={updateProduct.bind(null, product.id)}
      submitLabel="수정 완료"
      cancelHref={`/products/${product.id}`}
      userId={me.id}
      initial={{
        title: product.title,
        price: product.price,
        description: product.description,
        images: product.images,
      }}
    />
  );
}
