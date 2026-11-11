// 브라우저에서 사진을 줄이고 Supabase Storage에 바로 올리는 함수 (클라이언트 전용)
//
// 왜 서버 액션으로 파일을 보내지 않나요?
// - 서버 액션은 기본 1MB, Vercel은 요청 하나에 약 4.5MB까지만 받아요.
// - 휴대폰 사진은 한 장에 3~10MB라 여러 장이면 바로 넘칩니다.
// → 브라우저가 Storage에 직접 올리고, 서버 액션에는 "파일 경로"만 보냅니다.
//   (누가 어디에 올릴 수 있는지는 Storage RLS 정책이 막아줘요)
import { IMAGE_BUCKET } from "@/lib/images";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 1600; // 긴 변 최대 1600px

// 큰 사진을 1600px 이하 JPEG로 줄입니다. (용량 ↓, 업로드·로딩 속도 ↑)
async function resizeImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    // 휴대폰 사진의 회전 정보(EXIF)도 반영해서 읽어요.
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`"${file.name}"은(는) 읽을 수 없는 사진 형식이에요. JPG·PNG로 올려 주세요.`);
  }

  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  // 보이지 않는 캔버스에 작게 그린 뒤 JPEG로 저장
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // 투명 PNG가 검게 나오지 않도록 흰 배경
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("사진을 변환하지 못했어요."))),
      "image/jpeg",
      0.85,
    ),
  );
}

// 사진 한 장을 올리고, DB에 저장할 경로를 돌려줍니다.
// 경로 첫 폴더를 내 user id로 해야 Storage 정책을 통과해요.
export async function uploadProductImage(file: File, userId: string): Promise<string> {
  const blob = await resizeImage(file);
  const path = `${userId}/${crypto.randomUUID()}.jpg`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: "image/jpeg" });

  if (error) throw new Error("사진을 올리지 못했어요. 다시 시도해 주세요.");
  return path;
}
