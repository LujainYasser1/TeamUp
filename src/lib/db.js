import { supabase as sb } from './supabase'

/** كل البيانات العامة — تعمل حتى بدون تسجيل دخول (وضع الضيف). */
export async function loadPublic() {
  const [profiles, userSkills, projects, catalogue] = await Promise.all([
    sb.from('profiles').select('*').order('created_at', { ascending: true }),
    sb.from('user_skills').select('*'),
    sb.from('projects').select('*').order('created_at', { ascending: true }),
    sb.from('skills').select('*'),
  ])
  const err = profiles.error || userSkills.error || projects.error || catalogue.error
  if (err) throw err
  return {
    profiles: profiles.data || [],
    userSkills: userSkills.data || [],
    projects: projects.data || [],
    catalogue: catalogue.data || [],
  }
}

/** البيانات الخاصة بالمستخدم المسجّل. */
export async function loadPrivate(uid) {
  const [requests, conversations, messages, groups, groupMembers, groupMessages, prefs, notifications] =
    await Promise.all([
      sb.from('requests').select('*').or(`sender_id.eq.${uid},receiver_id.eq.${uid}`)
        .order('created_at', { ascending: false }),
      sb.from('conversations').select('*'),
      sb.from('messages').select('*').order('created_at', { ascending: true }),
      sb.from('groups').select('*').order('created_at', { ascending: true }),
      sb.from('group_members').select('*'),
      sb.from('group_messages').select('*').order('created_at', { ascending: true }),
      sb.from('notification_prefs').select('*').eq('user_id', uid).maybeSingle(),
      sb.from('notifications').select('*').order('created_at', { ascending: false }).limit(60),
    ])
  return {
    requests: requests.data || [],
    conversations: conversations.data || [],
    messages: messages.data || [],
    groups: groups.data || [],
    groupMembers: groupMembers.data || [],
    groupMessages: groupMessages.data || [],
    prefs: prefs.data || { interest: true, accepted: true, groups: true },
    notifications: notifications.data || [],
  }
}

/** تعليم كل الإشعارات كمقروءة. */
export const markNotificationsRead = (uid) =>
  sb.from('notifications').update({ read_at: new Date().toISOString() })
    .eq('user_id', uid).is('read_at', null)

export const clearNotifications = (uid) =>
  sb.from('notifications').delete().eq('user_id', uid)

/* ------------------------------------------------------------------ كتابة */

export const upsertProfile = (uid, patch) =>
  sb.from('profiles').upsert({ id: uid, ...patch }).select().single()

export async function replaceSkills(uid, levels) {
  await sb.from('user_skills').delete().eq('user_id', uid)
  const rows = Object.entries(levels).map(([skill, level]) => ({ user_id: uid, skill, level }))
  if (!rows.length) return { error: null }
  return sb.from('user_skills').insert(rows)
}

export const addSkillToCatalogue = (name, category = 'Other', categoryAr = 'أخرى') =>
  sb.from('skills').upsert({ name, category, category_ar: categoryAr }, { onConflict: 'name' })

export const insertProject = (uid, p) =>
  sb.from('projects').insert({
    user_id: uid,
    title: p.title,
    role: p.role || '',
    description: p.description || '',
    technologies: p.technologies || '',
  }).select().single()

export const deleteProject = (id) => sb.from('projects').delete().eq('id', id)

/* الفهرس `requests_one_per_pair` يسمح بطلب واحد بين أي شخصين **بأي اتجاه**،
   بينما الـ upsert القديم كان يوحّد على (sender_id, receiver_id) فقط. النتيجة:
   لو رفضتِ طلب أحدهم ثم أردتِ أنتِ إرساله له، يفشل الإدراج بـ 23505 ويصير
   الطريق مسدودًا بينكما للأبد. فنبحث أولًا عن أي صف بالاتجاهين ونحدّثه. */
export const sendRequest = async (uid, receiverId, type, message) => {
  const { data: existing } = await sb
    .from('requests')
    .select('id')
    .or(
      `and(sender_id.eq.${uid},receiver_id.eq.${receiverId}),` +
      `and(sender_id.eq.${receiverId},receiver_id.eq.${uid})`
    )
    .maybeSingle()

  if (existing?.id) {
    return sb.from('requests')
      .update({ sender_id: uid, receiver_id: receiverId, type, message, status: 'pending' })
      .eq('id', existing.id)
      .select()
      .single()
  }
  return sb.from('requests')
    .insert({ sender_id: uid, receiver_id: receiverId, type, message, status: 'pending' })
    .select()
    .single()
}

export const acceptRequest = (id) => sb.rpc('accept_request', { req_id: id })
export const rejectRequest = (id) => sb.from('requests').update({ status: 'rejected' }).eq('id', id)
export const conversationWith = (other) => sb.rpc('conversation_with', { other })

export const sendMessage = (conversationId, uid, body) =>
  sb.from('messages').insert({ conversation_id: conversationId, sender_id: uid, body }).select().single()

export async function createGroup(uid, name, description, memberIds) {
  const { data, error } = await sb.from('groups')
    .insert({ name, description, owner_id: uid }).select().single()
  if (error) return { error }
  const rows = [
    { group_id: data.id, user_id: uid, status: 'accepted' },
    // المدعوّون يبقون «قيد الانتظار» لين يقبلون الدعوة بأنفسهم
    ...memberIds.filter((id) => id !== uid).map((id) => ({
      group_id: data.id, user_id: id, status: 'pending', invited_by: uid,
    })),
  ]
  const { error: memberError } = await sb.from('group_members').insert(rows)
  if (memberError) return { error: memberError }
  return { data }
}

export async function updateGroup(id, name, description, memberIds, uid, existing = []) {
  await sb.from('groups').update({ name, description }).eq('id', id)

  const keep = new Set(memberIds.filter((m) => m !== uid))
  const current = new Map(existing.map((m) => [m.user_id, m.status]))

  // احذف من أُزيل فقط — حتى لا تُلغى دعوات أو عضويات قائمة
  const removed = [...current.keys()].filter((m) => m !== uid && !keep.has(m))
  for (const m of removed) {
    await sb.from('group_members').delete().eq('group_id', id).eq('user_id', m)
  }

  const added = [...keep].filter((m) => !current.has(m))
  if (added.length) {
    await sb.from('group_members').insert(
      added.map((m) => ({ group_id: id, user_id: m, status: 'pending', invited_by: uid }))
    )
  }
}

/** قبول أو رفض دعوة مجموعة. */
export const respondToInvite = (groupId, uid, status) =>
  sb.from('group_members').update({ status }).eq('group_id', groupId).eq('user_id', uid)

export const deleteGroup = (id) => sb.from('groups').delete().eq('id', id)

export const sendGroupMessage = (groupId, uid, body) =>
  sb.from('group_messages').insert({ group_id: groupId, sender_id: uid, body }).select().single()

export const savePrefs = (uid, prefs) =>
  sb.from('notification_prefs').upsert({ user_id: uid, ...prefs })

/** المالك وحده يغيّر صلاحية الأعضاء في الإدارة. */
export const setGroupPermission = (groupId, allow) =>
  sb.rpc('set_group_permission', { gid: groupId, allow })

/** مغادرة المجموعة (حذف عضويتي أنا فقط). */
export const leaveGroup = (groupId, uid) =>
  sb.from('group_members').delete().eq('group_id', groupId).eq('user_id', uid)

/* ---------------------------------------------------- Storage: الصورة الشخصية */

/** يرفع الصورة إلى avatars/<uid>/<اسم> ويعيد رابطها العام. */
export async function uploadAvatar(uid, file) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${uid}/avatar-${Date.now()}.${ext}`
  const { error } = await sb.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' })
  if (error) return { error }

  const { data } = sb.storage.from('avatars').getPublicUrl(path)
  const url = data.publicUrl

  const { error: pErr } = await sb.from('profiles').update({ avatar_url: url }).eq('id', uid)
  if (pErr) return { error: pErr }

  // ننظّف الصور القديمة حتى لا تتراكم
  const { data: files } = await sb.storage.from('avatars').list(uid)
  const stale = (files || []).map((f) => `${uid}/${f.name}`).filter((p) => p !== path)
  if (stale.length) await sb.storage.from('avatars').remove(stale)

  return { url }
}

export async function removeAvatar(uid) {
  const { data: files } = await sb.storage.from('avatars').list(uid)
  if (files?.length) await sb.storage.from('avatars').remove(files.map((f) => `${uid}/${f.name}`))
  return sb.from('profiles').update({ avatar_url: null }).eq('id', uid)
}

/* ------------------------------------------ Edge Function: حذف الحساب نهائيًا */

/** يستدعي دالة الحافة delete-account — الحذف الفعلي يحتاج مفتاحًا سرّيًا لا يوضع في المتصفح. */
export async function deleteAccount() {
  const { data: { session } } = await sb.auth.getSession()
  if (!session) return { error: { message: 'not signed in' } }
  const { data, error } = await sb.functions.invoke('delete-account', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  if (error) return { error }
  return { data }
}
