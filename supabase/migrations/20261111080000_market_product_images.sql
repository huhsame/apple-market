-- 사과마켓 3단계: 판매글 사진 (여러 장)
-- (이미 Supabase에 적용됨. 기록/학습용 사본)

-- 1) 판매글에 사진 경로 목록 컬럼 추가
--    예: {"<user_id>/a1b2.jpg", "<user_id>/c3d4.jpg"}  첫 번째가 대표 사진
--    사진 파일은 Storage에 있고, DB에는 "어디에 있는지(경로)"만 저장합니다.
alter table public.market_products
  add column images text[] not null default '{}'
  check (cardinality(images) <= 10);  -- 최대 10장

-- 2) 사진 파일을 담을 Storage 버킷
--    public = true: 주소만 알면 누구나 사진을 볼 수 있음 (판매글은 공개니까)
--    파일 하나 최대 5MB, 이미지 형식만 허용
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('market-product-images', 'market-product-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp']);

-- 3) 업로드/삭제 권한 (RLS)
--    파일 경로 첫 폴더가 내 user id 인 곳에만 올리고 지울 수 있어요.
--    예) 내 id가 abc 면 "abc/사진.jpg" 는 OK, "xyz/사진.jpg" 는 거부
create policy "market-product-images: upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'market-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "market-product-images: delete own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'market-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
-- ※ 공개 버킷이라 사진을 "보는" 데는 select 정책이 필요 없어요.
--   그런데 Storage는 파일을 지울 때(remove) select 권한도 함께 확인합니다.
--   그래서 "내 폴더 파일만" 조회할 수 있게 열어 줍니다. (모두에게 열면 전체 파일 목록이 노출됨)
--   (처음엔 이 정책이 없어서, 수정/삭제 때 사진 파일이 안 지워지는 문제가 있었어요)
create policy "market-product-images: read own files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'market-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
