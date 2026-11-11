// 판매글 사진 관련 상수와 도우미 (서버/브라우저 둘 다에서 사용)

// Supabase Storage 버킷 이름 (supabase/migrations/..._market_product_images.sql)
export const IMAGE_BUCKET = "market-product-images";

// 판매글 하나에 올릴 수 있는 사진 수 (DB check 제약과 같은 값)
export const MAX_IMAGES = 10;

// DB에 저장된 경로("<user_id>/abc.jpg") → 브라우저에서 볼 수 있는 주소
// 공개(public) 버킷이라 정해진 규칙대로 주소를 만들면 됩니다.
export function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}
