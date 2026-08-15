// TeamUp — حذف الحساب نهائيًا  (Supabase Edge Function)
//
// ليش Edge Function وليس دالة قاعدة بيانات؟
// حذف مستخدم من auth.users يحتاج مفتاح service_role، وهذا المفتاح سرّي
// ولا يجوز أبدًا وضعه في كود المتصفح — أي شخص يقدر يفتح الكود ويشوفه.
// الـ Edge Function تشتغل على سيرفر Supabase حيث يبقى المفتاح مخفيًا،
// وتتحقق أولًا من هوية صاحب الطلب قبل أن تحذف أي شيء.
//
// النشر:
//   supabase functions deploy delete-account --no-verify-jwt
//
// ملاحظة: --no-verify-jwt لأن الدالة تتحقق من الجلسة بنفسها (السطر أدناه)،
// وحتى يمر طلب OPTIONS الخاص بـ CORS من المتصفح.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405)

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (!token) return json({ error: 'not signed in' }, 401)

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )

  // ١) نتحقق من الجلسة — لا نثق بأي معرّف يرسله المتصفح
  const { data: userData, error: userErr } = await admin.auth.getUser(token)
  const user = userData?.user
  if (userErr || !user) return json({ error: 'invalid session' }, 401)

  // ٢) نحذف صوره الشخصية من التخزين
  try {
    const { data: files } = await admin.storage.from('avatars').list(user.id)
    if (files?.length) {
      await admin.storage
        .from('avatars')
        .remove(files.map((f: { name: string }) => `${user.id}/${f.name}`))
    }
  } catch (_) {
    // التخزين ليس حرجًا — نكمل الحذف على أي حال
  }

  // ٣) نحذف المستخدم. بقية بياناته تُحذف تلقائيًا عبر ON DELETE CASCADE
  //    (الملف الشخصي، المهارات، المشاريع، الطلبات، الرسائل، المجموعات…)
  const { error: delErr } = await admin.auth.admin.deleteUser(user.id)
  if (delErr) return json({ error: delErr.message }, 400)

  return json({ ok: true, deleted: user.id })
})
