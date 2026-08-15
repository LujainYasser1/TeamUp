-- ============================================================================
--  TeamUp — مخطط قاعدة البيانات الكامل
--  شغّل هذا الملف مرة واحدة في: Supabase → SQL Editor → New query → Run
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- الملفات الشخصية
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  role        text not null default '',
  bio         text not null default '',
  experience  text not null default '',
  open_to     text not null default 'both' check (open_to in ('both','hackathon','project')),
  avatar_seed int  not null default 0,
  onboarded   boolean not null default false,
  is_demo     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------- كتالوج المهارات
create table if not exists public.skills (
  name      text primary key,
  category  text not null default 'Other'
);

-- ---------------------------------------------------------------- مهارات المستخدم
create table if not exists public.user_skills (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  skill    text not null,
  level    text not null default 'Intermediate' check (level in ('Beginner','Intermediate','Advanced')),
  primary key (user_id, skill)
);
create index if not exists user_skills_skill_idx on public.user_skills(skill);

-- ---------------------------------------------------------------- المشاريع السابقة
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  role          text not null default '',
  description   text not null default '',
  technologies  text not null default '',
  created_at    timestamptz not null default now()
);
create index if not exists projects_user_idx on public.projects(user_id);

-- ---------------------------------------------------------------- طلبات التعاون
create table if not exists public.requests (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  receiver_id  uuid not null references public.profiles(id) on delete cascade,
  type         text not null default 'project' check (type in ('hackathon','project')),
  message      text not null default '',
  status       text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at   timestamptz not null default now(),
  constraint requests_not_self check (sender_id <> receiver_id),
  constraint requests_unique_pair unique (sender_id, receiver_id)
);
create index if not exists requests_receiver_idx on public.requests(receiver_id);
create index if not exists requests_sender_idx   on public.requests(sender_id);

-- طلب واحد فقط بين أي شخصين، بأي اتجاه — يمنع تكرار الزميل في «زملائي»
create unique index if not exists requests_one_per_pair
  on public.requests (least(sender_id, receiver_id), greatest(sender_id, receiver_id));

-- ---------------------------------------------------------------- المحادثات الخاصة
create table if not exists public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_a      uuid not null references public.profiles(id) on delete cascade,
  user_b      uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  constraint conversations_ordered check (user_a < user_b),
  constraint conversations_unique unique (user_a, user_b)
);

create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.conversations(id) on delete cascade,
  sender_id        uuid not null references public.profiles(id) on delete cascade,
  body             text not null,
  created_at       timestamptz not null default now()
);
create index if not exists messages_conv_idx on public.messages(conversation_id, created_at);

-- ---------------------------------------------------------------- المجموعات
create table if not exists public.groups (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text not null default '',
  owner_id            uuid not null references public.profiles(id) on delete cascade,
  -- هل يقدر الأعضاء يعدّلون ويضيفون ويحذفون؟ يتحكم فيها المالك وحده
  members_can_manage  boolean not null default false,
  created_at          timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id    uuid not null references public.groups(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  -- المدعو لا يصير عضوًا إلا بعد قبوله الدعوة
  status      text not null default 'accepted' check (status in ('pending','accepted','rejected')),
  invited_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.group_messages (
  id          uuid primary key default gen_random_uuid(),
  group_id    uuid not null references public.groups(id) on delete cascade,
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists group_messages_idx on public.group_messages(group_id, created_at);

-- ---------------------------------------------------------------- إعدادات الإشعارات
create table if not exists public.notification_prefs (
  user_id   uuid primary key references public.profiles(id) on delete cascade,
  interest  boolean not null default true,
  accepted  boolean not null default true,
  groups    boolean not null default true
);

-- ============================================================================
--  دوال مساعدة
-- ============================================================================

-- إنشاء ملف شخصي تلقائيًا عند تسجيل أي مستخدم جديد
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  insert into public.notification_prefs (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- عضوية المجموعة (SECURITY DEFINER حتى لا تتكرر سياسات RLS بشكل لانهائي)
-- عضو فعلي (قَبِل الدعوة أو هو المالك) — هذا وحده يفتح دردشة المجموعة
create or replace function public.is_group_member(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
           select 1 from public.group_members gm
           where gm.group_id = gid and gm.user_id = uid and gm.status = 'accepted'
         )
      or exists (select 1 from public.groups g where g.id = gid and g.owner_id = uid);
$$;

-- طرف في المجموعة (مدعو أو عضو) — يكفي لرؤية اسم المجموعة ووصفها وأعضائها
-- قبل أن يقرر القبول أو الرفض
create or replace function public.is_group_participant(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
           select 1 from public.group_members gm
           where gm.group_id = gid and gm.user_id = uid and gm.status in ('pending','accepted')
         )
      or exists (select 1 from public.groups g where g.id = gid and g.owner_id = uid);
$$;

create or replace function public.is_conversation_member(cid uuid, uid uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.conversations c
                 where c.id = cid and (c.user_a = uid or c.user_b = uid));
$$;

-- من يملك حق إدارة المجموعة: المالك دائمًا، والعضو المقبول إذا سمح المالك
create or replace function public.can_manage_group(gid uuid, uid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.groups g
    where g.id = gid
      and (
        g.owner_id = uid
        or (g.members_can_manage and exists (
              select 1 from public.group_members gm
              where gm.group_id = gid and gm.user_id = uid and gm.status = 'accepted'
            ))
      )
  );
$$;

-- تغيير صلاحية الأعضاء: المالك فقط
create or replace function public.set_group_permission(gid uuid, allow boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.groups g where g.id = gid and g.owner_id = auth.uid()) then
    raise exception 'only the group owner can change this';
  end if;
  update public.groups set members_can_manage = allow where id = gid;
end;
$$;

-- قبول طلب تعاون: يغيّر الحالة ويفتح محادثة خاصة، ويعيد معرّف المحادثة
create or replace function public.accept_request(req_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  r public.requests%rowtype;
  a uuid; b uuid; cid uuid;
begin
  select * into r from public.requests where id = req_id;
  if not found then raise exception 'request not found'; end if;
  if r.receiver_id <> auth.uid() then raise exception 'not allowed'; end if;

  update public.requests set status = 'accepted' where id = req_id;

  a := least(r.sender_id, r.receiver_id);
  b := greatest(r.sender_id, r.receiver_id);

  select id into cid from public.conversations where user_a = a and user_b = b;
  if cid is null then
    insert into public.conversations (user_a, user_b) values (a, b) returning id into cid;
  end if;
  return cid;
end;
$$;

-- المحادثة المفتوحة مع شخص معيّن (تُنشأ إن لم توجد ولديكما طلب مقبول)
create or replace function public.conversation_with(other uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare a uuid; b uuid; cid uuid; ok boolean;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  a := least(auth.uid(), other);
  b := greatest(auth.uid(), other);
  select id into cid from public.conversations where user_a = a and user_b = b;
  if cid is not null then return cid; end if;

  select exists (
    select 1 from public.requests
    where status = 'accepted'
      and ((sender_id = auth.uid() and receiver_id = other)
        or (sender_id = other and receiver_id = auth.uid()))
  ) into ok;
  if not ok then raise exception 'no accepted collaboration with this user'; end if;

  insert into public.conversations (user_a, user_b) values (a, b) returning id into cid;
  return cid;
end;
$$;

-- ============================================================================
--  RLS — أمان مستوى الصف
-- ============================================================================
alter table public.profiles           enable row level security;
alter table public.skills             enable row level security;
alter table public.user_skills        enable row level security;
alter table public.projects           enable row level security;
alter table public.requests           enable row level security;
alter table public.conversations      enable row level security;
alter table public.messages           enable row level security;
alter table public.groups             enable row level security;
alter table public.group_members      enable row level security;
alter table public.group_messages     enable row level security;
alter table public.notification_prefs enable row level security;

-- الملفات الشخصية: يقرأها الجميع (وضع الضيف)، ويعدّلها صاحبها فقط
drop policy if exists profiles_read   on public.profiles;
drop policy if exists profiles_insert on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_read   on public.profiles for select using (true);
create policy profiles_insert on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- كتالوج المهارات
drop policy if exists skills_read   on public.skills;
drop policy if exists skills_insert on public.skills;
create policy skills_read   on public.skills for select using (true);
create policy skills_insert on public.skills for insert to authenticated with check (true);

-- مهارات المستخدمين: قراءة للجميع (المطابقة)، كتابة لصاحبها
drop policy if exists user_skills_read on public.user_skills;
drop policy if exists user_skills_all  on public.user_skills;
create policy user_skills_read on public.user_skills for select using (true);
create policy user_skills_all  on public.user_skills for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- المشاريع
drop policy if exists projects_read on public.projects;
drop policy if exists projects_all  on public.projects;
create policy projects_read on public.projects for select using (true);
create policy projects_all  on public.projects for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- الطلبات: يراها طرفاها فقط
drop policy if exists requests_read   on public.requests;
drop policy if exists requests_insert on public.requests;
drop policy if exists requests_update on public.requests;
drop policy if exists requests_delete on public.requests;
create policy requests_read   on public.requests for select to authenticated
  using (auth.uid() in (sender_id, receiver_id));
create policy requests_insert on public.requests for insert to authenticated
  with check (auth.uid() = sender_id);
create policy requests_update on public.requests for update to authenticated
  using (auth.uid() in (sender_id, receiver_id)) with check (auth.uid() in (sender_id, receiver_id));
create policy requests_delete on public.requests for delete to authenticated
  using (auth.uid() = sender_id);

-- المحادثات والرسائل
drop policy if exists conversations_read on public.conversations;
create policy conversations_read on public.conversations for select to authenticated
  using (auth.uid() in (user_a, user_b));

drop policy if exists messages_read   on public.messages;
drop policy if exists messages_insert on public.messages;
create policy messages_read on public.messages for select to authenticated
  using (public.is_conversation_member(conversation_id, auth.uid()));
create policy messages_insert on public.messages for insert to authenticated
  with check (auth.uid() = sender_id and public.is_conversation_member(conversation_id, auth.uid()));

-- المجموعات
drop policy if exists groups_read   on public.groups;
drop policy if exists groups_insert on public.groups;
drop policy if exists groups_update on public.groups;
drop policy if exists groups_delete on public.groups;
-- ملاحظة مهمة: نبدأ بمقارنة مباشرة على عمود المالك.
-- is_group_member دالة STABLE لا ترى الصف الجديد أثناء نفس عبارة
-- INSERT ... RETURNING، فلو اعتمدنا عليها وحدها لفشل إنشاء المجموعة برسالة
-- "new row violates row-level security policy".
create policy groups_read   on public.groups for select to authenticated
  using (owner_id = auth.uid() or public.is_group_participant(id, auth.uid()));
create policy groups_insert on public.groups for insert to authenticated
  with check (auth.uid() = owner_id);
-- التعديل: المالك، أو العضو إذا سمح المالك. والأعمدة محصورة بالاسم والوصف عبر GRANT أدناه.
create policy groups_update on public.groups for update to authenticated
  using (public.can_manage_group(id, auth.uid()))
  with check (public.can_manage_group(id, auth.uid()));
create policy groups_delete on public.groups for delete to authenticated
  using (auth.uid() = owner_id);

drop policy if exists group_members_read   on public.group_members;
drop policy if exists group_members_insert on public.group_members;
drop policy if exists group_members_delete on public.group_members;
create policy group_members_read on public.group_members for select to authenticated
  using (user_id = auth.uid() or public.is_group_participant(group_id, auth.uid()));

-- المدعو يقبل أو يرفض دعوته الخاصة فقط
drop policy if exists group_members_update on public.group_members;
create policy group_members_update on public.group_members for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy group_members_insert on public.group_members for insert to authenticated
  with check (public.can_manage_group(group_id, auth.uid()));
-- الحذف: المدير، أو العضو يغادر بنفسه
create policy group_members_delete on public.group_members for delete to authenticated
  using (user_id = auth.uid() or public.can_manage_group(group_id, auth.uid()));

drop policy if exists group_messages_read   on public.group_messages;
drop policy if exists group_messages_insert on public.group_messages;
create policy group_messages_read on public.group_messages for select to authenticated
  using (public.is_group_member(group_id, auth.uid()));
create policy group_messages_insert on public.group_messages for insert to authenticated
  with check (auth.uid() = sender_id and public.is_group_member(group_id, auth.uid()));

-- إعدادات الإشعارات
drop policy if exists notif_all on public.notification_prefs;
create policy notif_all on public.notification_prefs for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
--  الصلاحيات — مهم جدًا
--  سياسات RLS وحدها لا تكفي: الأدوار anon / authenticated تحتاج صلاحيات
--  على الجداول نفسها، وإلا يرجع الخطأ "permission denied for table ...".
-- ============================================================================
grant usage on schema public to anon, authenticated, service_role;

grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

-- وأي جدول أو دالة تُنشأ لاحقًا تأخذ نفس الصلاحيات تلقائيًا
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant execute on functions to anon, authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;

-- الأعضاء يعدّلون الاسم والوصف فقط — لا المالك ولا صلاحية الإدارة
revoke update on public.groups from authenticated;
grant update (name, description) on public.groups to authenticated;

-- ============================================================================
--  Realtime — المحادثات اللحظية
-- ============================================================================
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.messages';       exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.group_messages'; exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.requests';       exception when duplicate_object then null; end;
  -- بدون هذين الجدولين ما توصل دعوة المجموعة إلا بعد تحديث الصفحة
  begin execute 'alter publication supabase_realtime add table public.group_members';  exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table public.groups';         exception when duplicate_object then null; end;
end $$;

-- دالة الـ trigger ما لها داعي تكون قابلة للاستدعاء عبر REST.
-- ⚠️ `from public` ضرورية: بوستجرس يمنح EXECUTE إلى PUBLIC افتراضيًا،
-- و anon/authenticated يرثونه، فالمنع منهما وحدهما لا يغيّر شيئًا.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
