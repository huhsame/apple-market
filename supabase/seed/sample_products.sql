-- 사과마켓 샘플 판매글 10개 (화면 확인용 데이터)
-- ※ 구조 변경이 아니라 "데이터"라서 migrations가 아닌 seed 폴더에 둡니다.
-- 글쓴이: 닉네임 '허세임' 계정 (먼저 회원가입이 되어 있어야 해요)
-- created_at을 조금씩 과거로 돌려서 "3시간 전", "2일 전"처럼 다양하게 보이게 합니다.
insert into public.market_products (seller_id, title, price, description, created_at, updated_at)
select p.id, s.title, s.price, s.description, now() - s.ago, now() - s.ago
from public.market_profiles p
cross join (values
  ('아이패드 에어 5세대 64GB 스페이스그레이', 520000,
   E'작년 여름에 사서 필름 붙이고 케이스 끼워서 썼어요.\n찍힘이나 기스 없고 배터리 효율 92%입니다.\n충전기, 박스 다 있어요.', interval '25 minutes'),
  ('원목 2인 식탁 + 의자 2개', 80000,
   E'이사 가면서 내놓습니다.\n사용감은 조금 있지만 흔들림 없이 튼튼해요.\n직접 가져가셔야 해요. (엘리베이터 있음)', interval '2 hours'),
  ('다이슨 무선청소기 V10', 230000,
   E'흡입력 아직 짱짱해요.\n헤드 3종, 거치대 같이 드립니다.', interval '5 hours'),
  ('아기 옷 한 박스 나눔 (6~12개월)', 0,
   E'아이가 커서 못 입게 된 옷들이에요.\n깨끗하게 세탁해 두었습니다. 필요하신 분 편하게 가져가세요!', interval '9 hours'),
  ('닌텐도 스위치 OLED 화이트 + 게임 2개', 330000,
   E'마리오카트, 동물의 숲 포함입니다.\n조이콘 쏠림 없어요.', interval '1 day'),
  ('캠핑 의자 2개 (거의 새것)', 35000,
   E'두 번 사용했어요. 가방 포함.', interval '1 day 6 hours'),
  ('전자레인지 20L', 30000,
   E'정상 작동합니다. 회전판 깨끗해요.', interval '2 days'),
  ('화분 몬스테라 중형', 15000,
   E'잎 7장, 잘 자라고 있어요.\n화분째로 드립니다.', interval '3 days'),
  ('책 정리합니다 — 소설 10권 일괄', 10000,
   E'한강, 김영하, 정세랑 작가 책 위주예요.\n낱권 판매는 안 해요.', interval '5 days'),
  ('자전거 하이브리드 27단', 120000,
   E'출퇴근용으로 1년 탔어요.\n체인 교체한 지 얼마 안 됐고 자물쇠 같이 드려요.', interval '8 days')
) as s(title, price, description, ago)
where p.nickname = '허세임';
