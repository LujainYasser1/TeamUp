-- ============================================================================
--  TeamUp — Storage: الصور الشخصية
--  شغّله في: Supabase → SQL Editor → New query → Run
-- ============================================================================

-- رابط الصورة يُحفظ في الملف الشخصي
alter table public.profiles add column if not exists avatar_url text;

-- مساحة تخزين عامة للقراءة، بحد ٣ ميجابايت وصور فقط
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 3145728,
        array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update set
  public = true,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];

-- الصور يشوفها الجميع (تظهر في الاستكشاف وحتى في وضع الضيف)
drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');

-- كل شخص يرفع ويعدّل ويحذف داخل مجلد باسم معرّفه فقط:  avatars/<user_id>/…
drop policy if exists avatars_own_write on storage.objects;
create policy avatars_own_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_own_update on storage.objects;
create policy avatars_own_update on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_own_delete on storage.objects;
create policy avatars_own_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
