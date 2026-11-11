"use client";

// 판매글 쓰기/수정에서 같이 쓰는 폼
// action만 바꿔 끼우면 등록(createProduct)도, 수정(updateProduct)도 됩니다.
import Link from "next/link";
import { useActionState } from "react";
import type { ProductFormState } from "@/app/products/actions";
import { Alert, Field, SubmitButton } from "@/components/AuthUI";

type Props = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  cancelHref: string;
  // 수정할 때 처음에 채워둘 값
  initial?: { title: string; price: number; description: string };
};

export default function ProductForm({ action, submitLabel, cancelHref, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);

  // 검사에 실패하면 서버가 돌려준 값으로 다시 채워서, 입력한 내용이 날아가지 않게
  const values = state?.fields ?? {
    title: initial?.title,
    price: initial ? String(initial.price) : undefined,
    description: initial?.description,
  };

  return (
    // key: 서버가 새 값을 돌려주면 폼을 다시 그려서 defaultValue를 반영
    <form key={JSON.stringify(values)} action={formAction} className="space-y-5">
      <Field
        label="제목"
        name="title"
        placeholder="예) 아이폰 15 프로 팝니다"
        maxLength={40}
        defaultValue={values.title}
        required
      />
      <Field
        label="가격 (원)"
        name="price"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="0을 입력하면 나눔이에요"
        hint="숫자만 입력해 주세요. 0원 = 나눔"
        defaultValue={values.price}
        required
      />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold">자세한 설명</span>
        <textarea
          name="description"
          rows={8}
          maxLength={2000}
          placeholder="물건 상태, 사용 기간, 거래 장소 등을 적어 주세요."
          defaultValue={values.description}
          className="w-full resize-y rounded-xl border border-line bg-white px-4 py-3 text-[15px] leading-relaxed outline-none transition placeholder:text-neutral-400 focus:border-foreground focus:ring-1 focus:ring-foreground"
        />
      </label>

      {state?.error && <Alert tone="error">{state.error}</Alert>}

      <div className="flex gap-3 pt-2">
        <Link
          href={cancelHref}
          className="flex h-12 w-28 shrink-0 items-center justify-center rounded-xl border border-line text-[15px] font-semibold transition hover:border-foreground"
        >
          취소
        </Link>
        <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
