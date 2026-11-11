"use client";

// 삭제는 되돌릴 수 없으니 한 번 더 물어봅니다. (confirm은 브라우저 기능이라 클라이언트 컴포넌트)
import { deleteProduct } from "@/app/products/actions";

export default function DeleteButton({ id }: { id: number }) {
  return (
    <form
      action={deleteProduct.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("이 판매글을 삭제할까요? 되돌릴 수 없어요.")) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="h-10 rounded-full border border-line px-4 text-sm font-medium transition hover:border-foreground"
      >
        삭제
      </button>
    </form>
  );
}
