-- 사과마켓 회원 프로필 (auth.users 1:1)
-- ※ 가계부와 같은 DB를 쓰므로 사과마켓 테이블은 market_ 접두어로 구분합니다.
-- (이미 Supabase에 적용됨. 기록/학습용 사본)
create table public.market_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique check (char_length(nickname) between 2 and 12),
  created_at timestamptz not null default now()
);

alter table public.market_profiles enable row level security;

-- 닉네임은 중고거래 특성상 누구나 볼 수 있음
create policy "market_profiles: anyone can read"
  on public.market_profiles for select
  to anon, authenticated
  using (true);

-- 본인 프로필만 수정
create policy "market_profiles: owner can update"
  on public.market_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 회원가입 시 프로필 자동 생성 (signUp options.data.nickname 사용)
create or replace function public.handle_new_market_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.market_profiles (id, nickname)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''),
      'user_' || substr(new.id::text, 1, 6)
    )
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_market_user() from public, anon, authenticated;

create trigger on_auth_user_created_market
  after insert on auth.users
  for each row execute function public.handle_new_market_user();
