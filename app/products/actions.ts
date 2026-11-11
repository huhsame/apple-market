"use server";

// 판매글 등록 / 수정 / 삭제 서버 액션
// ※ 서버 액션은 누구나 POST로 직접 부를 수 있어서, 매번 로그인을 확인합니다.
//    (본인 글인지는 DB의 RLS 정책이 한 번 더 막아줘요)
// ※ 사진 파일은 브라우저가 Storage에 먼저 올리고, 여기로는 "경로"만 옵니다. (lib/upload-image.ts)
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { IMAGE_BUCKET, MAX_IMAGES } from "@/lib/images";
import { createClient } from "@/lib/supabase/server";

export type ProductFormState =
  | {
      error?: string;
      fields?: { title?: string; price?: string; description?: string };
    }
  | undefined;

// 폼 값 꺼내서 검사. 문제가 있으면 error, 없으면 저장할 값
function readForm(formData: FormData, userId: string) {
  const title = String(formData.get("title") ?? "").trim();
  const priceText = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  // 사진 경로들 (폼에 images 라는 이름으로 여러 개가 들어와요. 순서 = 화면 순서)
  const images = formData.getAll("images").map(String);
  const fields = { title, price: priceText, description };

  if (title.length < 2 || title.length > 40) {
    return { error: "제목은 2~40자로 입력해 주세요.", fields };
  }
  if (!/^\d+$/.test(priceText)) {
    return { error: "가격은 숫자로만 입력해 주세요. (나눔은 0)", fields };
  }
  const price = Number(priceText);
  if (price > 100_000_000) {
    return { error: "가격은 1억 원 이하로 입력해 주세요.", fields };
  }
  if (description.length > 2000) {
    return { error: "설명은 2000자 이하로 입력해 주세요.", fields };
  }
  if (images.length > MAX_IMAGES) {
    return { error: `사진은 ${MAX_IMAGES}장까지 올릴 수 있어요.`, fields };
  }
  // 남의 폴더 경로나 이상한 값을 끼워 넣지 못하게, "내id/이름.jpg" 모양만 허용
  const pathPattern = new RegExp(`^${userId}/[\\w-]+\\.(jpg|jpeg|png|webp)$`);
  if (!images.every((path) => pathPattern.test(path))) {
    return { error: "사진 정보가 올바르지 않아요. 다시 올려 주세요.", fields };
  }

  return { values: { title, price, description, images }, fields };
}

// Storage에서 사진 파일 지우기 (실패해도 글 저장/삭제는 계속 진행)
async function removeImages(paths: string[]) {
  if (paths.length === 0) return;
  const supabase = await createClient();
  await supabase.storage.from(IMAGE_BUCKET).remove(paths);
}

/* ---------------- 등록 (Create) ---------------- */
export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const { error, values, fields } = readForm(formData, me.id);
  if (error || !values) return { error, fields };

  const supabase = await createClient();
  // seller_id는 DB 기본값(auth.uid())이 채워줍니다.
  const { data, error: dbError } = await supabase
    .from("market_products")
    .insert(values)
    .select("id")
    .single();

  if (dbError) return { error: "저장하지 못했어요. 다시 시도해 주세요.", fields };

  revalidatePath("/");
  redirect(`/products/${data.id}`);
}

/* ---------------- 수정 (Update) ---------------- */
// id는 폼에서 받지 않고 .bind(null, id)로 미리 묶어서 넘겨받아요.
export async function updateProduct(
  id: number,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const { error, values, fields } = readForm(formData, me.id);
  if (error || !values) return { error, fields };

  const supabase = await createClient();

  // 수정 전 사진 목록 (빠진 사진 파일을 지우기 위해)
  const { data: before } = await supabase
    .from("market_products")
    .select("images")
    .eq("id", id)
    .eq("seller_id", me.id)
    .maybeSingle();

  const { data, error: dbError } = await supabase
    .from("market_products")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("seller_id", me.id) // 내 글만
    .select("id");

  if (dbError) return { error: "저장하지 못했어요. 다시 시도해 주세요.", fields };
  // RLS에 막히면 에러 대신 "바뀐 행 0개"가 돌아옵니다.
  if (!data || data.length === 0) {
    return { error: "내가 쓴 글만 수정할 수 있어요.", fields };
  }

  // 수정하면서 뺀 사진은 Storage에서도 지워요.
  const removed = ((before?.images ?? []) as string[]).filter(
    (path) => !values.images.includes(path),
  );
  await removeImages(removed);

  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  redirect(`/products/${id}`);
}

/* ---------------- 삭제 (Delete) ---------------- */
export async function deleteProduct(id: number) {
  const me = await getCurrentUser();
  if (!me) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("market_products")
    .delete()
    .eq("id", id)
    .eq("seller_id", me.id) // 내 글만
    .select("images");

  // 지워진 글의 사진 파일도 정리
  await removeImages(((data?.[0]?.images ?? []) as string[]));

  revalidatePath("/");
  redirect("/");
}
