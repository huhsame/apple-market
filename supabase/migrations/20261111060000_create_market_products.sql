-- 사과마켓 판매글 (2단계: 판매글 CRUD, 사진은 아직 없음)
-- (이미 Supabase에 적용됨. 기록/학습용 사본)
create table public.market_products (
  -- 주소에 쓰기 좋은 숫자 id (/products/12)
  id bigint generated always as identity primary key,
  -- 글쓴이. 기본값 auth.uid() = 지금 로그인한 사람
  -- market_profiles를 참조해서 목록에서 닉네임을 같이 가져올 수 있어요.
  seller_id uuid not null default auth.uid() references public.market_profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 40),
  -- 0원 = 나눔
  price integer not null check (price between 0 and 100000000),
  description text not null default '' check (char_length(description) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 외래키·정렬 컬럼에 인덱스 (Supabase advisor 권장)
create index market_products_seller_id_idx on public.market_products (seller_id);
create index market_products_created_at_idx on public.market_products (created_at desc);

alter table public.market_products enable row level security;

-- 판매글은 로그인 안 해도 누구나 볼 수 있음
create policy "market_products: anyone can read"
  on public.market_products for select
  to anon, authenticated
  using (true);

-- 쓰기/수정/삭제는 글쓴이 본인만
create policy "market_products: owner can insert"
  on public.market_products for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "market_products: owner can update"
  on public.market_products for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "market_products: owner can delete"
  on public.market_products for delete
  to authenticated
  using ((select auth.uid()) = seller_id);
