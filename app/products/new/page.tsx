import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createProduct } from "@/app/products/actions";
import ProductForm from "@/app/products/ProductForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "판매글 쓰기 · 사과마켓" };

export default function NewProductPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">판매글 쓰기</h1>
      <p className="mt-2 text-sm text-muted">이웃에게 팔 물건을 사진과 함께 소개해 주세요.</p>
      <div className="mt-10">
        {/* 로그인 확인(쿠키)은 요청 때만 알 수 있어서 Suspense로 감쌉니다. */}
        <Suspense fallback={<div className="h-96 rounded-2xl bg-soft" />}>
          <LoggedInForm />
        </Suspense>
      </div>
    </div>
  );
}

async function LoggedInForm() {
  const me = await getCurrentUser();
  // 로그인 안 했으면 로그인 페이지로
  if (!me) redirect("/login");

  return (
    <ProductForm action={createProduct} submitLabel="등록하기" cancelHref="/" userId={me.id} />
  );
}
