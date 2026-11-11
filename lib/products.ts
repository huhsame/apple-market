// 판매글을 읽어오는 함수들 (서버 전용)
// 쓰기(등록/수정/삭제)는 app/products/actions.ts 의 서버 액션에 있어요.
import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: number;
  seller_id: string;
  title: string;
  price: number;
  description: string;
  created_at: string;
  updated_at: string;
  // market_profiles 와 조인해서 가져온 글쓴이 닉네임
  seller: { nickname: string } | null;
};

// "seller:market_profiles(nickname)" = seller_id 외래키를 따라가서 닉네임을 seller라는 이름으로 가져오기
const PRODUCT_COLUMNS =
  "id, seller_id, title, price, description, created_at, updated_at, seller:market_profiles(nickname)";

// 최신 글부터 목록
export async function getProducts(limit = 40): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("market_products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Product[];
}

// 글 하나. 없으면 null
export async function getProduct(id: string): Promise<Product | null> {
  // 주소에 숫자가 아닌 값이 오면 DB에 묻지 않고 바로 "없음"
  if (!/^\d+$/.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("market_products")
    .select(PRODUCT_COLUMNS)
    .eq("id", Number(id))
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as unknown as Product | null;
}
