"use client";

// 판매글 쓰기/수정에서 같이 쓰는 폼
// action만 바꿔 끼우면 등록(createProduct)도, 수정(updateProduct)도 됩니다.
import Link from "next/link";
import { startTransition, useActionState, useState, type ChangeEvent, type FormEvent } from "react";
import type { ProductFormState } from "@/app/products/actions";
import { Alert, Field, SubmitButton } from "@/components/AuthUI";
import { imageUrl, MAX_IMAGES } from "@/lib/images";
import { uploadProductImage } from "@/lib/upload-image";

type Props = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  cancelHref: string;
  userId: string; // 사진을 "내 폴더"에 올리기 위해 필요
  // 수정할 때 처음에 채워둘 값
  initial?: { title: string; price: number; description: string; images: string[] };
};

// 화면에 보이는 사진 한 장
// - 이미 Storage에 있는 사진: path 있음
// - 방금 고른 사진(아직 안 올림): file 있음, preview는 브라우저 임시 주소(blob:)
type Photo = { key: string; preview: string; path?: string; file?: File };

export default function ProductForm({ action, submitLabel, cancelHref, userId, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [photos, setPhotos] = useState<Photo[]>(() =>
    (initial?.images ?? []).map((path) => ({ key: path, path, preview: imageUrl(path) })),
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  // 검사에 실패하면 서버가 돌려준 값으로 다시 채워서, 입력한 내용이 날아가지 않게
  const values = state?.fields ?? {
    title: initial?.title,
    price: initial ? String(initial.price) : undefined,
    description: initial?.description,
  };

  // 사진 고르기 → 미리보기 목록에 추가 (아직 업로드는 안 함)
  function handlePick(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const room = MAX_IMAGES - photos.length;
    if (picked.length > room) {
      setUploadError(`사진은 ${MAX_IMAGES}장까지 올릴 수 있어요.`);
    } else {
      setUploadError(undefined);
    }
    const added = picked.slice(0, room).map((file) => ({
      key: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file), // 내 컴퓨터 파일을 바로 보여주는 임시 주소
    }));
    setPhotos((prev) => [...prev, ...added]);
    e.target.value = ""; // 같은 파일을 다시 고를 수 있게 비우기
  }

  function handleRemove(key: string) {
    setPhotos((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target?.file) URL.revokeObjectURL(target.preview); // 임시 주소 메모리 정리
      return prev.filter((p) => p.key !== key);
    });
  }

  // 제출: ① 새 사진을 Storage에 올리고 ② 경로들을 폼 데이터에 넣어 ③ 서버 액션 호출
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploading(true);
    setUploadError(undefined);

    try {
      const uploaded = await Promise.all(
        photos.map(async (photo) =>
          photo.path ? photo : { ...photo, path: await uploadProductImage(photo.file!, userId) },
        ),
      );
      // 올린 사진은 "이미 있는 사진"으로 바꿔 둡니다. (서버 검사에 걸려 다시 제출해도 또 올리지 않게)
      setPhotos(uploaded);
      uploaded.forEach((photo) => formData.append("images", photo.path!));

      // useActionState의 formAction은 transition 안에서 불러야 pending이 제대로 바뀌어요.
      startTransition(() => formAction(formData));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "사진을 올리지 못했어요.");
    } finally {
      setUploading(false);
    }
  }

  const error = uploadError ?? state?.error;

  return (
    // key: 서버가 새 값을 돌려주면 폼을 다시 그려서 defaultValue를 반영
    <form key={JSON.stringify(values)} onSubmit={handleSubmit} className="space-y-5">
      {/* 사진 */}
      <div>
        <span className="mb-2 block text-sm font-semibold">
          사진 <span className="font-normal text-muted">({photos.length}/{MAX_IMAGES})</span>
        </span>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {photos.length < MAX_IMAGES && (
            // label로 감싸면 박스를 눌렀을 때 숨겨진 파일 선택창이 열려요.
            <label className="flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-muted transition hover:border-foreground hover:text-foreground">
              <span className="text-2xl leading-none">+</span>
              <span className="text-xs">사진 추가</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePick}
                className="sr-only"
              />
            </label>
          )}
          {photos.map((photo, i) => (
            <div key={photo.key} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-soft">
              {/* 미리보기는 blob: 임시 주소라 next/image 대신 일반 img를 씁니다. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-foreground py-0.5 text-center text-[11px] font-semibold text-white">
                  대표 사진
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(photo.key)}
                aria-label="사진 빼기"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <span className="mt-1.5 block text-xs text-muted">첫 번째 사진이 목록에 보이는 대표 사진이에요.</span>
      </div>

      <Field
        label="제목"
        name="title"
        placeholder="예) 아이폰 15 프로 팝니다"
        minLength={2}
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

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex gap-3 pt-2">
        <Link
          href={cancelHref}
          className="flex h-12 w-28 shrink-0 items-center justify-center rounded-xl border border-line text-[15px] font-semibold transition hover:border-foreground"
        >
          취소
        </Link>
        <SubmitButton pending={pending || uploading}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
