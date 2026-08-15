-- ============================================================================
--  TeamUp — نظام الإشعارات (مطلوب)
--  شغّله بعد 01_schema.sql في: Supabase → SQL Editor → New query → Run
--
--  هذا الملف هو ما يجعل مفاتيح الإشعارات في صفحة الإعدادات تعمل فعليًا:
--  التريجرات تكتب صفًا في public.notifications، ودالة notify() تتحقق أولًا
--  من تفضيلات المستلِم في notification_prefs فتسكت إذا كان المفتاح مطفأ.
--  قابل لإعادة التشغيل بالكامل.
-- ============================================================================

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       text not null check (type in ('interest','accepted','groups')),
  actor_id   uuid references auth.users(id) on delete set null,
  group_id   uuid references public.groups(id) on delete cascade,
  body       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_time
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists notifications_read   on public.notifications;
drop policy if exists notifications_update on public.notifications;
drop policy if exists notifications_delete on public.notifications;

-- كل شخص يرى إشعاراته فقط. لا سياسة INSERT عمدًا:
-- الإدراج من التريجرات (SECURITY DEFINER) وحدها.
create policy notifications_read on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy notifications_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notifications_delete on public.notifications for delete to authenticated
  using (user_id = auth.uid());

-- الدرس المكلف: السياسة وحدها ما تكفي — لازم GRANT
grant select, update, delete on public.notifications to authenticated;

-- ---------------------------------------------------------------- الدالة المركزية
create or replace function public.notify(
  p_user uuid, p_type text, p_actor uuid, p_group uuid, p_body text
) returns void
language plpgsql security definer set search_path = public as $$
declare allowed boolean;
begin
  if p_user is null or p_user = p_actor then return; end if;

  select case p_type
           when 'interest' then np.interest
           when 'accepted' then np.accepted
           when 'groups'   then np.groups
         end
    into allowed
    from public.notification_prefs np
   where np.user_id = p_user;

  -- لا صف تفضيلات = مفعّل افتراضيًا
  if allowed is false then return; end if;

  insert into public.notifications (user_id, type, actor_id, group_id, body)
  values (p_user, p_type, p_actor, p_group, left(coalesce(p_body, ''), 160));
end $$;

-- ⚠️ لازم `from public` — بوستجرس يمنح EXECUTE إلى PUBLIC افتراضيًا و
-- anon/authenticated يرثونه، فالمنع منهما وحدهما لا يفعل شيئًا وتبقى الدالة
-- قابلة للاستدعاء عبر /rest/v1/rpc/notify ويقدر أي مسجَّل يزرع إشعارًا كاذبًا.
revoke execute on function public.notify(uuid, text, uuid, uuid, text) from public, anon, authenticated;

-- ---------------------------------------------------------------- طلبات التعاون
create or replace function public.on_request_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' then
    perform public.notify(new.receiver_id, 'interest', new.sender_id, null, new.message);
  elsif TG_OP = 'UPDATE' then
    if new.status = 'accepted' and old.status is distinct from 'accepted' then
      perform public.notify(new.sender_id, 'accepted', new.receiver_id, null, null);
    elsif new.status = 'pending' and old.status is distinct from 'pending' then
      -- إعادة إرسال بعد رفض (sendRequest يحدّث الصف وقد يقلب الاتجاه)
      perform public.notify(new.receiver_id, 'interest', new.sender_id, null, new.message);
    end if;
  end if;
  return null;
end $$;

drop trigger if exists trg_request_notify on public.requests;
create trigger trg_request_notify after insert or update on public.requests
  for each row execute function public.on_request_change();

-- ---------------------------------------------------------------- دعوات المجموعات
create or replace function public.on_group_member_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if TG_OP = 'INSERT' and new.status = 'pending' then
    perform public.notify(new.user_id, 'groups', new.invited_by, new.group_id, null);
  end if;
  return null;
end $$;

drop trigger if exists trg_group_member_notify on public.group_members;
create trigger trg_group_member_notify after insert on public.group_members
  for each row execute function public.on_group_member_change();

-- ---------------------------------------------------------------- رسائل المجموعات
create or replace function public.on_group_message_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare m record;
begin
  for m in
    select gm.user_id from public.group_members gm
     where gm.group_id = new.group_id
       and gm.status = 'accepted'
       and gm.user_id <> new.sender_id
  loop
    perform public.notify(m.user_id, 'groups', new.sender_id, new.group_id, new.body);
  end loop;
  return null;
end $$;

drop trigger if exists trg_group_message_notify on public.group_messages;
create trigger trg_group_message_notify after insert on public.group_messages
  for each row execute function public.on_group_message_insert();

-- ---------------------------------------------------------------- إغلاق الدوال
-- دوال التريجرات ما يصح تُستدعى عبر REST. لاحظ `from public` (اقرأ الملاحظة أعلاه).
revoke execute on function public.on_request_change()       from public, anon, authenticated;
revoke execute on function public.on_group_member_change()  from public, anon, authenticated;
revoke execute on function public.on_group_message_insert() from public, anon, authenticated;

-- ---------------------------------------------------------------- Realtime
do $$
begin
  begin execute 'alter publication supabase_realtime add table public.notifications';
  exception when duplicate_object then null; end;
end $$;
