-- 사과마켓 샘플 판매글 10개 (화면 확인용 데이터, 사진 포함)
-- ※ 구조 변경이 아니라 "데이터"라서 migrations가 아닌 seed 폴더에 둡니다.
--
-- 글쓴이: 샘플 판매자 '사과농부' 계정
-- 사진: Storage 버킷 market-product-images 의 '<사과농부 id>/...jpg' 파일
--   (사진 파일은 사과농부로 로그인해서 미리 올려 두었어요. 이 SQL은 DB에 "경로"만 넣습니다.
--    파일이 지워졌다면 이 SQL만 다시 실행해서는 사진이 나오지 않아요.)
-- created_at을 조금씩 과거로 돌려서 "3시간 전", "2일 전"처럼 다양하게 보이게 합니다.
--
-- 사진 출처: Unsplash (Unsplash License — 무료, 출처 표기 의무 없음)
--   아이패드  https://unsplash.com/photos/feXbDPB8dmQ , https://unsplash.com/photos/ADilxPQeWcI
--   식탁      https://unsplash.com/photos/bcaFHquzu3M , https://unsplash.com/photos/d9iSRHiHNdk
--   청소기    https://unsplash.com/photos/yy-msv5-LFo
--   아기 옷   https://unsplash.com/photos/fdPlZXc-ZwU , https://unsplash.com/photos/02FoZhgcCDg
--   스위치    https://unsplash.com/photos/jqpRECmiNEU , https://unsplash.com/photos/-nQrR76hryg
--   캠핑 의자 https://unsplash.com/photos/WpERcAqCmt0 , https://unsplash.com/photos/vosixxYJhkU
--   전자레인지 https://unsplash.com/photos/sp3n1iD0qmQ , https://unsplash.com/photos/0b19HoqaZCw
--   몬스테라  https://unsplash.com/photos/zoQ2Ax9a_5w , https://unsplash.com/photos/bwsTJMnhcwE
--   책        https://unsplash.com/photos/b53HdbIUOhM
--   자전거    https://unsplash.com/photos/6DTGGRoW5WI , https://unsplash.com/photos/DQlsy191YxM
insert into public.market_products (seller_id, title, price, description, images, created_at, updated_at)
select p.id, s.title, s.price, s.description,
       -- 파일 이름 앞에 "<사과농부 id>/" 폴더를 붙여서 경로로 만들기
       array(select p.id::text || '/' || f from unnest(s.files) as f),
       now() - s.ago, now() - s.ago
from public.market_profiles p
cross join (values
  ('아이패드 에어 5세대 64GB 스페이스그레이', 520000,
   E'작년 여름에 사서 필름 붙이고 케이스 끼워서 썼어요.\n찍힘이나 기스 없고 배터리 효율 92%입니다.\n충전기, 박스 다 있어요.',
   array['ec183447-846f-448b-ba9e-c1f10b486f48.jpg', '2226c3a3-fbae-4dca-a081-d89cf5f7f179.jpg'], interval '25 minutes'),
  ('원목 2인 식탁 + 의자 2개', 80000,
   E'이사 가면서 내놓습니다.\n사용감은 조금 있지만 흔들림 없이 튼튼해요.\n직접 가져가셔야 해요. (엘리베이터 있음)',
   array['544fad66-bc4e-43bd-9796-761b34a3a3b4.jpg', '4ecdfaa1-735d-4b52-8d0c-e89c8164ce26.jpg'], interval '2 hours'),
  ('무선청소기 팝니다', 230000,
   E'흡입력 아직 짱짱해요.\n헤드 3종, 거치대 같이 드립니다.',
   array['85957f24-ad69-41f6-a071-0012bf0b2c0e.jpg'], interval '5 hours'),
  ('아기 옷 한 박스 나눔 (6~12개월)', 0,
   E'아이가 커서 못 입게 된 옷들이에요.\n깨끗하게 세탁해 두었습니다. 필요하신 분 편하게 가져가세요!',
   array['79b2f2e9-8c44-4337-b533-75770fb28688.jpg', '65b4279d-b812-470e-909a-d37a2ac58ef6.jpg'], interval '9 hours'),
  ('닌텐도 스위치 + 게임 2개', 330000,
   E'마리오카트, 동물의 숲 포함입니다.\n조이콘 쏠림 없어요.',
   array['222ead60-7df3-4e37-8383-c73cf67015f6.jpg', '36b85fb5-171e-4ef7-ad08-37e077c7f4cb.jpg'], interval '1 day'),
  ('캠핑 의자 2개 (거의 새것)', 35000,
   E'두 번 사용했어요. 가방 포함.',
   array['2ff02c4e-828c-409a-8b41-ebab36dda36a.jpg', '9a7a339d-2704-4e41-a56d-d0806a348c48.jpg'], interval '1 day 6 hours'),
  ('전자레인지 20L', 30000,
   E'정상 작동합니다. 회전판 깨끗해요.',
   array['6ba13ac7-bb49-4f1c-8cfe-bc50ef676bb3.jpg', '6c3249f8-c118-43bc-8725-062df2f1dba6.jpg'], interval '2 days'),
  ('화분 몬스테라 중형', 15000,
   E'잎 7장, 잘 자라고 있어요.\n화분째로 드립니다.',
   array['3b4a10e9-4611-44a8-90fe-9c4d3ff2d37d.jpg', 'cf5aa13c-06a4-444d-aefe-c06ab476ec82.jpg'], interval '3 days'),
  ('책 정리합니다 — 소설 10권 일괄', 10000,
   E'소설책 위주예요.\n낱권 판매는 안 해요.',
   array['045165e4-161c-4c6d-984c-64d3fac1cca8.jpg'], interval '5 days'),
  ('도시형 자전거', 120000,
   E'출퇴근용으로 1년 탔어요.\n체인 교체한 지 얼마 안 됐고 자물쇠 같이 드려요.',
   array['e779346f-05ed-49aa-ad33-398a2a57fd78.jpg', 'c5befc49-51c0-40ae-b1d4-b806291e8915.jpg'], interval '8 days')
) as s(title, price, description, files, ago)
where p.nickname = '사과농부';
