import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Root from './generated/Root'
import Setup from './screens/Setup'
import { STR, CATEGORIES, SKILL_EXAMPLES } from './lib/strings'
import { supabase as sb, isConfigured, clearCredentials, isolatedTab } from './lib/supabase'
import * as db from './lib/db'
import {
  clock, relative, memberSince, members as memberCountLabel, pendingInvites,
  membersAvailable, chats, toArabicDigits,
} from './lib/time'

const AVATAR = [
  'linear-gradient(140deg,#14503f,#227a62)',
  'linear-gradient(140deg,#5d3f76,#9270b4)',
  'linear-gradient(140deg,#0f3d31,#6fbfa5)',
  'linear-gradient(140deg,#77519a,#c3a9d8)',
  'linear-gradient(140deg,#227a62,#6fbfa5)',
]
const initials = (n) =>
  (n || '').trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '؟'

/* الدوائر في التصميم تستخدم خاصية background، فنمرّر الصورة كخلفية —
   بهذا تظهر الصورة الحقيقية في كل مكان بدون تغيير أي شكل. */
const avatarBg = (p) =>
  p?.avatarUrl
    ? `url("${p.avatarUrl}") center/cover no-repeat`
    : AVATAR[(p?.avatarSeed || 0) % AVATAR.length]
const avatarText = (p) => (p?.avatarUrl ? '' : initials(p?.name))

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const EMPTY_NP = { title: '', role: '', description: '', technologies: '' }

/** ترتيب نتائج البحث: اللي يبدأ بالحروف المكتوبة أولًا، ثم اللي يحتويها. */
function rankSkills(pool, q) {
  const needle = q.trim().toLowerCase()
  if (!needle) return [...pool].sort((a, b) => a.localeCompare(b))
  const starts = [], contains = []
  for (const name of pool) {
    const low = name.toLowerCase()
    if (low.startsWith(needle)) starts.push(name)
    else if (low.includes(needle)) contains.push(name)
  }
  starts.sort((a, b) => a.localeCompare(b))
  contains.sort((a, b) => a.localeCompare(b))
  return [...starts, ...contains]
}

/** أمثلة تُعرض قبل أي بحث — مو كل الكتالوج. */
function exampleSkills(pool, n) {
  const picked = SKILL_EXAMPLES.filter((s) => pool.includes(s))
  for (const s of pool) {
    if (picked.length >= n) break
    if (!picked.includes(s)) picked.push(s)
  }
  return picked.slice(0, n)
}

export default function App() {
  if (!isConfigured) return <Setup />
  return <TeamUp />
}

function TeamUp() {
  /* ----------------------------------------------------------- الحالة */
  const [lang, setLang] = useState(() => localStorage.getItem('teamup.lang') || 'ar')
  const [screen, setScreen] = useState('login')
  const [booted, setBooted] = useState(false)
  const [session, setSession] = useState(null)
  const [guest, setGuest] = useState(false)

  const [pub, setPub] = useState({ profiles: [], userSkills: [], projects: [], catalogue: [] })
  const [priv, setPriv] = useState({
    requests: [], conversations: [], messages: [],
    groups: [], groupMembers: [], groupMessages: [],
    prefs: { interest: true, accepted: true, groups: true },
    notifications: [],
  })

  // واجهة
  const [collab, setCollab] = useState('all')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState([])
  const [browseAll, setBrowseAll] = useState(false)
  const [step, setStep] = useState(1)
  const [signName, setSignName] = useState('')
  const [signEmail, setSignEmail] = useState(() => localStorage.getItem('teamup.email') || '')
  const [signPass, setSignPass] = useState('')
  const [viewId, setViewId] = useState(null)
  const [from, setFrom] = useState('discover')
  const [reqTab, setReqTab] = useState('received')
  const [saved, setSaved] = useState(false)
  const [modalFor, setModalFor] = useState(null)
  const [modalType, setModalType] = useState('project')
  const [reqMsg, setReqMsg] = useState('')
  const [activeConv, setActiveConv] = useState(null)
  const [draft, setDraft] = useState('')
  const [menuFor, setMenuFor] = useState(null)
  const [openGroupId, setOpenGroupId] = useState(null)
  const [groupDraft, setGroupDraft] = useState('')
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [ng, setNg] = useState({ name: '', desc: '', members: [], editId: null })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [logoutAsk, setLogoutAsk] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [meSkillQuery, setMeSkillQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [remember, setRemember] = useState(() => localStorage.getItem('teamup.remember') !== '0')
  const [gate, setGate] = useState(null)      // 'action' | 'search' | null
  const [guestSearches, setGuestSearches] = useState(0)

  const GUEST_SEARCHES = 3

  // مسوّدة الملف الشخصي (تُحفظ عند الضغط على «حفظ»)
  const [meName, setMeName] = useState('')
  const [meRole, setMeRole] = useState('')
  const [meBio, setMeBio] = useState('')
  const [meExp, setMeExp] = useState('')
  const [meOpenTo, setMeOpenTo] = useState('both')
  const [skillLevels, setSkillLevels] = useState({})
  const [pendingProjects, setPendingProjects] = useState([])
  const [np, setNp] = useState(EMPTY_NP)

  const toastTimer = useRef(null)
  const ar = lang === 'ar'
  const L = STR[lang]
  const uid = session?.user?.id || null

  const toast = useCallback((msg) => {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600)
  }, [])

  useEffect(() => {
    localStorage.setItem('teamup.lang', lang)
    document.documentElement.lang = lang
    document.title = lang === 'ar'
      ? 'TeamUp — المهارة المناسبة والفريق المناسب'
      : 'TeamUp — The right skill, the right team'
  }, [lang])

  /* ----------------------------------------------------------- الجلسة */
  useEffect(() => {
    let alive = true
    sb.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session || null)
      setBooted(true)
    })
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s || null))
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [])

  /* ----------------------------------------------------------- تحميل البيانات */
  /* التوكن الجديد لحظة التسجيل أحيانًا يسبق ساعة الخادم بجزء من الثانية، فترجع
     أول قراءة بخطأ "JWT issued at future". نعيد المحاولة بصمت بدل ما نطلع
     رسالة إنجليزية مربكة على وجه من سجّل للتو. */
  const refreshPublic = useCallback(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        setPub(await db.loadPublic())
        return
      } catch (e) {
        const msg = e?.message || ''
        const retriable = /issued at future|jwt|expired/i.test(msg)
        if (!retriable || attempt === 2) {
          if (!retriable) toast(msg || (ar ? 'خطأ في تحميل البيانات' : 'Could not load data'))
          return
        }
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, ar])

  const refreshPrivate = useCallback(async () => {
    if (!uid) return
    try { setPriv(await db.loadPrivate(uid)) } catch (e) { console.warn(e) }
  }, [uid])

  useEffect(() => { refreshPublic() }, [refreshPublic])
  useEffect(() => { refreshPrivate() }, [refreshPrivate])

  /* ----------------------------------------------------------- Realtime */
  useEffect(() => {
    if (!uid) return
    const ch = sb
      .channel('teamup-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, refreshPrivate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_messages' }, refreshPrivate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'requests' }, refreshPrivate)
      /* بدونها كانت دعوة المجموعة ما توصل إلا بعد تحديث الصفحة */
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, refreshPrivate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, refreshPrivate)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, refreshPrivate)
      .subscribe()
    return () => { sb.removeChannel(ch) }
  }, [uid, refreshPrivate])

  /* فتح صفحة الإشعارات يعلّمها كمقروءة تلقائيًا */
  const markedRef = useRef(null)
  useEffect(() => {
    if (screen !== 'notifications' || !uid) return
    const unread = priv.notifications.filter((n) => !n.read_at)
    if (!unread.length) return
    if (markedRef.current === unread[0].id) return
    markedRef.current = unread[0].id
    db.markNotificationsRead(uid).then(refreshPrivate)
  }, [screen, uid, priv.notifications, refreshPrivate])

  /* الأعضاء الجدد ما كانوا يظهرون إلا بعد إعادة تحميل الصفحة */
  useEffect(() => {
    if (screen !== 'discover') return
    refreshPublic()
  }, [screen, refreshPublic])

  /* ----------------------------------------------------------- بعد الدخول */
  const myProfile = useMemo(
    () => (uid ? pub.profiles.find((p) => p.id === uid) || null : null),
    [uid, pub.profiles]
  )

  // مزامنة مسوّدة الملف الشخصي مع ما في قاعدة البيانات
  const syncedFor = useRef(null)
  useEffect(() => {
    if (!myProfile || syncedFor.current === myProfile.id) return
    syncedFor.current = myProfile.id
    setMeName(myProfile.name || '')
    setMeRole(myProfile.role || '')
    setMeBio(myProfile.bio || '')
    setMeExp(myProfile.experience || '')
    setMeOpenTo(myProfile.open_to || 'both')
    const mine = {}
    pub.userSkills.filter((s) => s.user_id === myProfile.id).forEach((s) => { mine[s.skill] = s.level })
    setSkillLevels(mine)
  }, [myProfile, pub.userSkills])

  // انتقال تلقائي بعد تسجيل الدخول
  const routedFor = useRef(null)
  useEffect(() => {
    if (!booted) return
    if (!session) { routedFor.current = null; return }
    if (routedFor.current === session.user.id) return
    if (!myProfile) return
    routedFor.current = session.user.id
    setGuest(false)
    if (myProfile.onboarded) {
      setScreen('discover')
      setStep(1)
    } else {
      setScreen('onboarding')
      /* لا نرجّع الخطوة للخلف أبدًا: لو الملف وصل متأخرًا (بسبب إعادة محاولة
         التوكن) وكانت المستخدمة قد تقدّمت أصلًا، كان هذا يبتلع أول ضغطة
         «التالي» في الخطوة ٢ ويرجّعها مكانها. */
      setStep((s) => (s > 2 ? s : 2))
    }
  }, [booted, session, myProfile])

  /* تنبيه لطيف: من ما عنده مهارات لا يظهر في نتائج المطابقة إطلاقًا */
  const nudgedFor = useRef(null)
  useEffect(() => {
    if (!uid || !myProfile || screen !== 'discover') return
    if (nudgedFor.current === uid) return
    if (Object.keys(skillLevels).length > 0) return
    nudgedFor.current = uid
    toast(
      ar
        ? 'أضف مهاراتك من «ملفي» — بدونها ما تظهر في نتائج بحث الآخرين.'
        : 'Add your skills in “My Profile” — without them you will not show up in other people’s searches.'
    )
  }, [uid, myProfile, screen, skillLevels, ar, toast])

  /* ----------------------------------------------------------- نماذج البيانات */
  const skillsByUser = useMemo(() => {
    const m = new Map()
    for (const r of pub.userSkills) {
      if (!m.has(r.user_id)) m.set(r.user_id, [])
      m.get(r.user_id).push([r.skill, r.level])
    }
    return m
  }, [pub.userSkills])

  const projectsByUser = useMemo(() => {
    const m = new Map()
    for (const r of pub.projects) {
      if (!m.has(r.user_id)) m.set(r.user_id, [])
      m.get(r.user_id).push(r)
    }
    return m
  }, [pub.projects])

  const asPerson = useCallback(
    (row) => ({
      id: row.id,
      name: (ar ? row.name : row.name_en || row.name) || (ar ? 'عضو' : 'Member'),
      role: (ar ? row.role : row.role_en || row.role) || '',
      bio: (ar ? row.bio : row.bio_en || row.bio) || '',
      exp: (ar ? row.experience : row.experience_en || row.experience) || '',
      openTo: row.open_to || 'both',
      avatarSeed: row.avatar_seed || 0,
      avatarUrl: row.avatar_url || null,
      createdAt: row.created_at,
      skills: skillsByUser.get(row.id) || [],
      projects: (projectsByUser.get(row.id) || []).map((p) => ({
        ...p,
        description: (ar ? p.description : p.description_en || p.description) || '',
      })),
    }),
    [ar, skillsByUser, projectsByUser]
  )

  const everyone = useMemo(() => pub.profiles.map(asPerson), [pub.profiles, asPerson])
  const byId = useMemo(() => new Map(everyone.map((p) => [p.id, p])), [everyone])

  // الشخص الحالي كما يظهر في بطاقته (يستخدم المسوّدة الحيّة)
  const mePerson = useMemo(() => {
    const base = uid ? byId.get(uid) : null
    return {
      id: uid,
      name: meName || base?.name || (ar ? 'أنت' : 'You'),
      role: meRole || base?.role || '',
      bio: meBio || base?.bio || '',
      exp: meExp || base?.exp || '',
      openTo: meOpenTo,
      avatarSeed: base?.avatarSeed ?? 0,
      avatarUrl: base?.avatarUrl || null,
      createdAt: base?.createdAt,
      skills: Object.entries(skillLevels),
      projects: base?.projects || pendingProjects,
    }
  }, [uid, byId, meName, meRole, meBio, meExp, meOpenTo, skillLevels, pendingProjects, ar])

  const others = useMemo(() => everyone.filter((p) => p.id !== uid), [everyone, uid])

  const mySkills = useMemo(() => Object.keys(skillLevels), [skillLevels])

  const knownSkills = useMemo(() => {
    const set = new Set(CATEGORIES.flatMap((c) => c.skills))
    pub.catalogue.forEach((c) => set.add(c.name))
    return [...set]
  }, [pub.catalogue])

  const catalogueGroupsSrc = useMemo(() => {
    const groups = CATEGORIES.map((c) => ({ key: c.key, ar: c.ar, skills: [...c.skills] }))
    const known = new Set(groups.flatMap((g) => g.skills))
    const extra = pub.catalogue.filter((c) => !known.has(c.name))
    const byCat = new Map()
    for (const c of extra) {
      const k = c.category || 'Other'
      if (!byCat.has(k)) byCat.set(k, { key: k, ar: c.category_ar || 'أخرى', skills: [] })
      byCat.get(k).skills.push(c.name)
    }
    for (const g of groups) {
      const hit = byCat.get(g.key)
      if (hit) { g.skills.push(...hit.skills); byCat.delete(g.key) }
    }
    return [...groups, ...byCat.values()]
  }, [pub.catalogue])

  /* ----------------------------------------------------------- الطلبات */
  const requests = useMemo(
    () =>
      priv.requests.map((r) => ({
        id: r.id,
        personId: r.sender_id === uid ? r.receiver_id : r.sender_id,
        dir: r.sender_id === uid ? 'out' : 'in',
        status: r.status,
        msg: r.message,
        type: r.type,
        time: relative(r.created_at, ar),
      })),
    [priv.requests, uid, ar]
  )

  const convs = useMemo(() => {
    const out = []
    for (const c of priv.conversations) {
      const other = c.user_a === uid ? c.user_b : c.user_a
      const msgs = priv.messages
        .filter((m) => m.conversation_id === c.id)
        .map((m) => ({ mine: m.sender_id === uid, text: m.body, time: clock(m.created_at) }))
      out.push({ id: c.id, personId: other, msgs })
    }
    return out
  }, [priv.conversations, priv.messages, uid])

  const groupsModel = useMemo(
    () =>
      priv.groups.map((g) => {
        const rows = priv.groupMembers.filter((m) => m.group_id === g.id)
        const mine = rows.find((m) => m.user_id === uid)
        const isOwner = g.owner_id === uid
        return {
          id: g.id,
          name: g.name,
          desc: g.description,
          ownerId: g.owner_id,
          isOwner,
          membersCanManage: !!g.members_can_manage,
          /* من يقدر يعدّل ويضيف ويحذف: المالك، أو العضو إذا سمح المالك */
          canManage: isOwner || (!!g.members_can_manage && mine?.status === 'accepted'),
          /* حالتي أنا في هذه المجموعة: مالك / عضو مقبول / دعوة قيد الانتظار */
          myStatus: isOwner ? 'owner' : mine?.status || null,
          invitedBy: mine?.invited_by || g.owner_id,
          rows,
          /* الأعضاء المقبولون فقط يظهرون كأعضاء فعليين */
          members: rows
            .filter((m) => m.user_id !== uid && m.status === 'accepted')
            .map((m) => m.user_id),
          /* المدعوّون الذين لم يردّوا بعد */
          pendingMembers: rows
            .filter((m) => m.user_id !== uid && m.status === 'pending')
            .map((m) => m.user_id),
          /* كل من له صلة بالمجموعة — لعرض بطاقة الدعوة كاملة */
          allMembers: rows
            .filter((m) => m.status !== 'rejected')
            .map((m) => m.user_id),
          msgs: priv.groupMessages
            .filter((m) => m.group_id === g.id)
            .map((m) => ({ from: m.sender_id, text: m.body, time: clock(m.created_at) })),
        }
      }),
    [priv.groups, priv.groupMembers, priv.groupMessages, uid]
  )

  /** المجموعات التي أنا عضو فيها فعلًا، والدعوات التي تنتظر ردّي. */
  const myGroups = useMemo(
    () => groupsModel.filter((g) => g.myStatus === 'owner' || g.myStatus === 'accepted'),
    [groupsModel]
  )
  const groupInvitesModel = useMemo(
    () => groupsModel.filter((g) => g.myStatus === 'pending'),
    [groupsModel]
  )

  const respondInvite = useCallback(
    async (groupId, accept) => {
      const { error } = await db.respondToInvite(groupId, uid, accept ? 'accepted' : 'rejected')
      if (error) return toast(error.message)
      await refreshPrivate()
      toast(
        accept
          ? ar ? 'انضممت إلى المجموعة.' : 'You joined the group.'
          : ar ? 'رُفضت الدعوة.' : 'Invitation declined.'
      )
    },
    [uid, refreshPrivate, toast, ar]
  )

  /* ----------------------------------------------------------- مساعدات */
  /* أي إجراء يحتاج حسابًا يفتح نافذة التسجيل بدل رسالة عابرة */
  const needAccount = useCallback(() => setGate('action'), [])

  const personById = useCallback(
    (id) => (id === uid ? mePerson : byId.get(id) || null),
    [uid, mePerson, byId]
  )

  const matchOf = useCallback(
    (p) => {
      if (!picked.length) return { pct: 0, matched: 0, req: 0 }
      const names = p.skills.map((s) => s[0])
      const matched = picked.filter((s) => names.includes(s)).length
      return { pct: Math.round((matched / picked.length) * 100), matched, req: picked.length }
    },
    [picked]
  )

  /** أي علاقة قائمة مع شخص — بأي اتجاه. القبول في اتجاه واحد يكفي للطرفين. */
  const relationWith = useCallback(
    (personId) => {
      const all = requests.filter((r) => r.personId === personId)
      return (
        all.find((r) => r.status === 'accepted') ||
        all.find((r) => r.status === 'pending') ||
        all[0] ||
        null
      )
    },
    [requests]
  )

  const decorate = useCallback(
    (p, i) => {
      const m = matchOf(p)
      const openLabels = { both: L.openBoth, hackathon: L.openHackathon, project: L.openProject }
      const ring = m.pct === 100 ? '#227a62' : m.pct >= 50 ? '#77519a' : '#9aa8a2'
      return {
        ...p,
        initials: avatarText(p),
        color: avatarBg(p),
        openToLabel: openLabels[p.openTo],
        delay: (i % 9) * 55 + 'ms',
        interestTags: (p.openTo === 'both' ? ['hackathon', 'project'] : [p.openTo]).map((k) =>
          k === 'hackathon'
            ? { label: L.hackathons, bg: '#efe7f6', fg: '#5d3f76', dot: '#77519a' }
            : { label: L.projects, bg: '#e3f1ec', fg: '#0f3d31', dot: '#227a62' }
        ),
        pct: m.pct,
        pctLabel: m.pct + '%',
        ring,
        cardBorder: m.pct === 100 ? '#6fbfa5' : '#e6e8e4',
        matchNote: picked.length
          ? ar
            ? `تمت مطابقة ${m.matched} من ${m.req} من المهارات المطلوبة`
            : `${m.matched} of ${m.req} required skills matched`
          : ar
            ? 'اختر مهارات لحساب نسبة التطابق'
            : 'Pick skills to compute a match',
        openToBg: p.openTo === 'hackathon' ? '#efe7f6' : p.openTo === 'project' ? '#e3f1ec' : '#f0f1ee',
        openToFg: p.openTo === 'hackathon' ? '#5d3f76' : p.openTo === 'project' ? '#0f3d31' : '#3b4a45',
        /* المهارات المطابِقة أولًا — قبل كانت البطاقة تقول ١٠٠٪ وما تعرض
           المهارة اللي طابقت لأنها خارج أول أربع مهارات. */
        topSkills: [...p.skills]
          .sort((a, b) => (picked.includes(b[0]) ? 1 : 0) - (picked.includes(a[0]) ? 1 : 0))
          .slice(0, 4)
          .map(([name]) => {
            const on = picked.includes(name)
            return { name, bg: '#fff', fg: on ? '#0f3d31' : '#3b4a45', border: on ? '#6fbfa5' : '#e6e8e4' }
          }),
        open: () => {
          if (!uid) return needAccount()
          setFrom(screen); setViewId(p.id); setScreen('profile')
        },
        /* زر البطاقة يعكس حالة العلاقة: طلب جديد / قيد الانتظار / فتح المحادثة —
           عشان ما يُرسل طلب ثانٍ لشخص أصلًا بينكما تعاون مقبول. */
        ctaShort: (() => {
          const rel = relationWith(p.id)
          if (rel?.status === 'accepted') return L.openChat
          if (rel?.status === 'pending') return L.pendingCta
          return L.sendShort
        })(),
        request: () => {
          if (!uid) return needAccount()
          const rel = relationWith(p.id)
          if (rel?.status === 'accepted') return openChatWith(p.id)
          if (rel?.status === 'pending') return toast(L.pendingCta)
          setModalFor(p.id); setModalType('project'); setReqMsg('')
        },
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchOf, L, picked, ar, screen, uid, needAccount, relationWith]
  )

  /* ----------------------------------------------------------- الإجراءات */
  const doSignIn = async () => {
    if (busy) return
    if (!signEmail.trim() || !signPass) return toast(ar ? 'أدخل البريد وكلمة المرور.' : 'Enter email and password.')
    setBusy(true)
    const { error } = await sb.auth.signInWithPassword({ email: signEmail.trim(), password: signPass })
    setBusy(false)
    if (error) return toast(translateAuthError(error.message, ar))
    /* «تذكّرني»: نحفظ البريد فقط. كلمة المرور تبقى عند مدير كلمات المرور في
       المتصفح — لا نخزّنها نحن أبدًا. */
    if (remember) localStorage.setItem('teamup.email', signEmail.trim())
    else localStorage.removeItem('teamup.email')
    setSignPass('')
    await refreshPublic()
  }

  const doSignUp = async () => {
    if (busy) return
    if (!signName.trim()) return toast(ar ? 'اكتب اسمك الكامل.' : 'Enter your full name.')
    if (!signEmail.trim()) return toast(ar ? 'اكتب بريدك الإلكتروني.' : 'Enter your email.')
    if (signPass.length < 8) return toast(ar ? 'كلمة المرور ٨ أحرف على الأقل.' : 'Password must be at least 8 characters.')
    setBusy(true)
    const { data, error } = await sb.auth.signUp({
      email: signEmail.trim(),
      password: signPass,
      options: { data: { name: signName.trim() } },
    })
    setBusy(false)
    if (error) return toast(translateAuthError(error.message, ar))
    if (!data.session) {
      toast(ar ? 'أرسلنا رابط تأكيد إلى بريدك — أكّده ثم سجّل الدخول.' : 'Check your email to confirm, then sign in.')
      setScreen('signin')
      return
    }
    setMeName(signName.trim())
    await refreshPublic()
    setStep(2)
  }

  const finishOnboarding = async () => {
    if (!uid) { setScreen('signin'); return }
    if (!meName.trim()) { setStep(2); return toast(L.needName) }
    if (!meRole.trim()) { setStep(2); return toast(L.needRole) }
    if (mySkills.length === 0) { setStep(3); return toast(L.needSkills) }
    setBusy(true)
    await db.upsertProfile(uid, {
      name: meName.trim(),
      role: meRole.trim(),
      bio: meBio.trim(),
      experience: meExp.trim(),
      open_to: meOpenTo,
      onboarded: true,
    })
    await db.replaceSkills(uid, skillLevels)
    for (const p of pendingProjects) if (p.title?.trim()) await db.insertProject(uid, p)
    for (const name of mySkills) if (!knownSkills.includes(name)) await db.addSkillToCatalogue(name)
    setPendingProjects([])
    await refreshPublic()
    setBusy(false)
    setScreen('discover')
    setStep(1)
    toast(L.toastSaved)
  }

  /** حفظ حقول الملف الشخصي وحدها (يُستدعى بين خطوات الإعداد). */
  const saveProfileFields = async () => {
    if (!uid) return
    await db.upsertProfile(uid, {
      name: meName.trim(),
      role: meRole.trim(),
      bio: meBio.trim(),
      experience: meExp.trim(),
      open_to: meOpenTo,
    })
    await refreshPublic()
  }

  /** حفظ المهارات وحدها (يُستدعى بين خطوات الإعداد). */
  const saveMySkills = async () => {
    if (!uid) return
    for (const name of Object.keys(skillLevels)) {
      if (!knownSkills.includes(name)) await db.addSkillToCatalogue(name)
    }
    await db.replaceSkills(uid, skillLevels)
    await refreshPublic()
  }

  const saveProfile = async () => {
    if (!uid) return needAccount()
    setBusy(true)
    await db.upsertProfile(uid, {
      name: meName.trim(),
      role: meRole.trim(),
      bio: meBio.trim(),
      experience: meExp.trim(),
      open_to: meOpenTo,
      onboarded: true,
    })
    await db.replaceSkills(uid, skillLevels)
    for (const name of mySkills) if (!knownSkills.includes(name)) await db.addSkillToCatalogue(name)
    await refreshPublic()
    setBusy(false)
    setSaved(true)
    toast(L.toastSaved)
  }

  const submitRequest = async () => {
    if (!uid) return needAccount()
    const msg = reqMsg.trim() || (ar ? 'أبحث عن شخص للتعاون على مشروع قريب.' : 'Looking for someone to collaborate on an upcoming project.')
    const { error } = await db.sendRequest(uid, modalFor, modalType, msg)
    if (error) {
      /* طلب موجود مسبقًا بين الطرفين (بأي اتجاه) */
      if (error.code === '23505') {
        setModalFor(null)
        return toast(ar ? 'فيه طلب قائم بينكما أصلًا.' : 'A request already exists between you two.')
      }
      return toast(error.message)
    }
    setModalFor(null); setReqMsg(''); setReqTab('sent')
    await refreshPrivate()
    toast(L.toastSent)
  }

  const doAccept = async (id, personId) => {
    const { error } = await db.acceptRequest(id)
    if (error) return toast(error.message)
    await refreshPrivate()
    setScreen('messages')
    setActiveConv(personId)
    toast(L.toastAccepted)
  }

  const doReject = async (id) => {
    const { error } = await db.rejectRequest(id)
    if (error) return toast(error.message)
    await refreshPrivate()
    toast(L.toastRejected)
  }

  const openChatWith = async (personId) => {
    setScreen('messages')
    setActiveConv(personId)
    if (!convs.some((c) => c.personId === personId)) {
      const { error } = await db.conversationWith(personId)
      if (!error) await refreshPrivate()
    }
  }

  const doSendMessage = async () => {
    const text = draft.trim()
    if (!text || !activeConv) return
    const conv = convs.find((c) => c.personId === activeConv)
    if (!conv) return
    setDraft('')
    const { error } = await db.sendMessage(conv.id, uid, text)
    if (error) toast(error.message)
    await refreshPrivate()
  }

  const doSendGroupMessage = async () => {
    const text = groupDraft.trim()
    if (!text || !openGroupId) return
    setGroupDraft('')
    const { error } = await db.sendGroupMessage(openGroupId, uid, text)
    if (error) toast(error.message)
    await refreshPrivate()
  }

  const doCreateGroup = async () => {
    if (!uid) return needAccount()
    const name = ng.name.trim()
    if (!name) return toast(ar ? 'اكتب اسم المجموعة.' : 'Enter a group name.')
    if (ng.editId) {
      const current = groupsModel.find((g) => g.id === ng.editId)
      await db.updateGroup(ng.editId, name, ng.desc, ng.members, uid, current?.rows || [])
      if (current?.isOwner && !!ng.allowManage !== !!current.membersCanManage) {
        const { error } = await db.setGroupPermission(ng.editId, !!ng.allowManage)
        if (error) return toast(error.message)
      }
    } else {
      const { data, error } = await db.createGroup(uid, name, ng.desc || (ar ? 'بلا وصف بعد.' : 'No description yet.'), ng.members)
      if (error) return toast(error.message)
      if (ng.allowManage && data?.id) await db.setGroupPermission(data.id, true)
      toast(ar ? 'أُنشئت المجموعة.' : 'Group created.')
    }
    setNewGroupOpen(false)
    setNg({ name: '', desc: '', members: [], editId: null })
    await refreshPrivate()
  }

  /* ---- Storage: الصورة الشخصية ---- */
  const uploadAvatar = async (file) => {
    if (!uid) return needAccount()
    if (!file) return
    if (!/^image\//.test(file.type)) return toast(ar ? 'اختر ملف صورة.' : 'Pick an image file.')
    if (file.size > 3 * 1024 * 1024) return toast(ar ? 'حجم الصورة أكبر من ٣ ميجابايت.' : 'Image is larger than 3 MB.')
    setBusy(true)
    const { error } = await db.uploadAvatar(uid, file)
    setBusy(false)
    if (error) return toast(error.message)
    await refreshPublic()
    toast(ar ? 'تم تحديث الصورة.' : 'Photo updated.')
  }

  const clearAvatar = async () => {
    if (!uid) return needAccount()
    setBusy(true)
    const { error } = await db.removeAvatar(uid)
    setBusy(false)
    if (error) return toast(error.message)
    await refreshPublic()
    toast(ar ? 'أُزيلت الصورة.' : 'Photo removed.')
  }

  /* ---- Edge Function: حذف الحساب نهائيًا ---- */
  const deleteAccount = async () => {
    if (!uid) return needAccount()
    const sure = window.confirm(
      ar
        ? 'حذف الحساب نهائي: يُمسح ملفك ومهاراتك ومشاريعك وطلباتك ورسائلك ومجموعاتك ولا يمكن التراجع. متأكدة؟'
        : 'Deleting your account is permanent: your profile, skills, projects, requests, messages and groups are removed. Continue?'
    )
    if (!sure) return
    setBusy(true)
    const { error } = await db.deleteAccount()
    setBusy(false)
    if (error) return toast(error.message)
    toast(ar ? 'حُذف الحساب.' : 'Account deleted.')
    await doLogout()
  }

  /* يمسح كل أثر للمستخدم السابق — وإلا ظهر اسمه في وضع الضيف */
  const clearIdentity = useCallback(() => {
    setMeName(''); setMeRole(''); setMeBio(''); setMeExp('')
    setMeOpenTo('both'); setSkillLevels({}); setPendingProjects([])
    setSignName(''); setSignPass('')
    setSignEmail(localStorage.getItem('teamup.email') || '')
    setPicked([]); setQuery(''); setBrowseAll(false)
    setViewId(null); setActiveConv(null); setOpenGroupId(null)
    setGuestSearches(0); setGate(null)
    syncedFor.current = null
    routedFor.current = null
    nudgedFor.current = null
  }, [])

  const doLogout = async () => {
    await sb.auth.signOut()
    setLogoutAsk(false)
    setSession(null)
    setGuest(false)
    setActiveConv(null)
    setScreen('login')
    setPriv({ requests: [], conversations: [], messages: [], groups: [], groupMembers: [], groupMessages: [], prefs: { interest: true, accepted: true, groups: true }, notifications: [] })
    clearIdentity()
  }

  const addSkillNamed = (raw) => {
    const name = (raw || '').trim()
    if (!name) return
    const match = knownSkills.find((k) => k.toLowerCase() === name.toLowerCase())
    const skill = match || name
    if (mySkills.some((k) => k.toLowerCase() === skill.toLowerCase())) return
    setSkillLevels((prev) => ({ ...prev, [skill]: 'Intermediate' }))
  }

  /* ----------------------------------------------------------- V */
  const V = useMemo(() => {
    const isApp = !['login', 'signin', 'onboarding'].includes(screen)

    const STEPS = [L.stepAccount, L.stepProfile, L.mySkills, L.projects]
    const steps = STEPS.map((label, i) => {
      const n = i + 1, done = step > n, active = step === n
      return {
        label, line: i > 0, mark: done ? '✓' : String(n),
        fg: active ? '#0b2f26' : done ? '#227a62' : '#9aa8a2',
        dotBg: active ? '#0f3d31' : done ? '#e3f1ec' : '#eeefec',
        dotFg: active ? '#fff' : done ? '#0f3d31' : '#6b7a74',
      }
    })
    const stepCopy = [
      [L.stepAccountTitle, L.stepAccountSub],
      [L.onbTitle, L.onbSubtitle],
      [L.stepSkillsTitle, L.stepSkillsSub],
      [L.stepProjectsTitle, L.stepProjectsSub],
    ][step - 1]

    const skillQuery = query.trim()
    const meQ = meSkillQuery.trim()
    const mePool = knownSkills.filter((n) => !mySkills.includes(n))
    /* بلا بحث: نعرض أمثلة قليلة بس. مع البحث: اللي يبدأ بالحروف أولًا
       (تكتبين "ba" فيطلع Backend قبل Database) ثم اللي يحتويها. */
    const meSuggestions = meQ ? rankSkills(mePool, meQ).slice(0, 16) : exampleSkills(mePool, 10)

    const ICONS = {
      discover: ['M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 1 0 0-19', 'm15.8 8.2-2 5.6-5.6 2 2-5.6z'],
      requests: ['M21 12h-5l-1.5 3h-5L8 12H3', 'M5.5 5h13l2.5 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5z'],
      messages: ['M20 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z', ''],
      me: ['M12 4.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 1 0 0-7.6', 'M4.5 20a7.5 7.5 0 0 1 15 0'],
      squad: ['M4 6.5h16v11H4z', 'M8 6.5V4.5h8v2M4 12h16'],
      settings: ['M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9', 'M15 5.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 1 0 0-3.8M9 14.6a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 1 0 0-3.8'],
      team: ['M9 4.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 1 0 0-6.8M2.8 19.5a6.2 6.2 0 0 1 12.4 0', 'M16.5 5.2a3.4 3.4 0 0 1 0 6.5M17.5 14a6.2 6.2 0 0 1 3.7 5.5'],
      notifications: ['M18 15.5V10a6 6 0 1 0-12 0v5.5L4.5 18h15z', 'M10 20.5a2.2 2.2 0 0 0 4 0'],
    }
    const pendingIn = requests.filter((r) => r.dir === 'in' && r.status === 'pending').length
    const unreadNotifs = priv.notifications.filter((n) => !n.read_at).length
    const nav = [
      ['discover', L.navHome], ['team', L.navTeam], ['squad', L.squadTitle],
      ['requests', L.navRequests], ['messages', L.navMessages],
      ['notifications', L.notifTitle], ['settings', L.settings],
    ].map(([key, label]) => {
      const active = screen === key || (key === 'discover' && ['results', 'profile'].includes(screen))
      return {
        label, active,
        bg: active ? '#0f3d31' : 'transparent',
        fg: active ? '#ffffff' : '#6b7a74',
        p1: ICONS[key][0], p2: ICONS[key][1],
        badge:
          key === 'requests' && pendingIn ? String(pendingIn)
          : key === 'squad' && groupInvitesModel.length ? String(groupInvitesModel.length)
          : key === 'notifications' && unreadNotifs ? String(unreadNotifs)
          : '',
        go: () => (uid || key === 'discover' ? setScreen(key) : needAccount()),
      }
    })

    const catSkills = (name) => {
      const on = picked.includes(name)
      return {
        name, on,
        bg: '#fff', fg: on ? '#0f3d31' : '#3b4a45', border: on ? '#227a62' : '#e6e8e4',
        toggle: () => setPicked((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name])),
      }
    }

    const q = query.trim().toLowerCase()
    const filtered = others.filter((p) => {
      if (collab !== 'all' && p.openTo !== collab && p.openTo !== 'both') return false
      if (!q) return true
      return (p.name + p.role + p.skills.map((s) => s[0]).join(' ')).toLowerCase().includes(q)
    })
    const people = filtered.map((p, i) => decorate(p, i))
    const ranked = [...people].sort((a, b) => b.pct - a.pct)
    const exact = ranked.filter((p) => p.pct === 100)
    const partial = ranked.filter((p) => p.pct > 0 && p.pct < 100)
    const resultGroups = []
    if (exact.length) resultGroups.push({ label: L.exact, count: exact.length, people: exact })
    if (partial.length) resultGroups.push({ label: L.partial, count: partial.length, people: partial })

    const viewedRaw = personById(viewId) || others[0] || mePerson
    const isMe = !!uid && viewedRaw?.id === uid
    const v = decorate(viewedRaw || mePerson, 0)
    const rel = viewedRaw ? relationWith(viewedRaw.id) : null
    const levelStyle = {
      Advanced: ['#e3f1ec', '#0f3d31'],
      Intermediate: ['#efe7f6', '#5d3f76'],
      Beginner: ['#f0f1ee', '#6b7a74'],
    }
    const openToLabel = { both: L.openBoth, hackathon: L.openHackathon, project: L.openProject }
    const viewed = {
      ...v,
      experience: viewedRaw?.exp || '',
      memberSince: memberSince(viewedRaw?.createdAt, ar),
      openToLabel: openToLabel[viewedRaw?.openTo || 'both'],
      ctaLabel: rel && rel.status === 'accepted' ? L.openChat : rel && rel.status === 'pending' ? L.pendingCta : L.sendRequest,
      skills: (viewedRaw?.skills || []).map(([name, level]) => ({
        name,
        levelLabel: L['level' + level],
        levelBg: (levelStyle[level] || levelStyle.Intermediate)[0],
        levelFg: (levelStyle[level] || levelStyle.Intermediate)[1],
      })),
      projects: viewedRaw?.projects || [],
      interests:
        viewedRaw?.openTo === 'both'
          ? [{ label: L.hackathons, dot: '#77519a' }, { label: L.projects, dot: '#227a62' }]
          : viewedRaw?.openTo === 'hackathon'
            ? [{ label: L.hackathons, dot: '#77519a' }]
            : [{ label: L.projects, dot: '#227a62' }],
    }

    /* الزميل الواحد قد يكون بينكما طلبان (واحد أرسلتِه وواحد استقبلتِه)،
       فنوحّدهم حسب الشخص حتى لا يتكرر في «زملائي». */
    const teamMates = [
      ...new Map(
        requests
          .filter((r) => r.status === 'accepted')
          .map((r) => [r.personId, r])
      ).values(),
    ]
      .map((r) => ({ r, p: personById(r.personId) }))
      .filter((x) => x.p)
      .map(({ r, p }, i) => ({
        ...decorate(p, i),
        since: ar ? `تعاون مقبول · ${r.time}` : `Accepted · ${r.time}`,
        chat: () => openChatWith(p.id),
      }))

    const memberChip = (id) => {
      const p = personById(id)
      if (!p) return null
      return {
        initials: avatarText(p),
        color: p.avatarUrl
          ? avatarBg(p)
          : id === uid
            ? 'linear-gradient(140deg,#0b2f26,#5d3f76)'
            : AVATAR[(p.avatarSeed || 0) % AVATAR.length],
      }
    }
    const groups = myGroups.map((g, i) => {
      const waiting = g.pendingMembers.length
      return {
        id: g.id,
        name: g.name,
        desc: g.desc,
        delay: (i % 6) * 55 + 'ms',
        members: [uid, ...g.members].map(memberChip).filter(Boolean),
        count:
          memberCountLabel(g.members.length + 1, ar) +
          (waiting ? ' · ' + pendingInvites(waiting, ar) : ''),
        menuOpen: menuFor === g.id,
        toggleMenu: () => setMenuFor(menuFor === g.id ? null : g.id),
        roleLabel: g.isOwner ? L.ownerBadge : L.memberBadge,
        canManage: g.canManage,
        isOwner: g.isOwner,
        canLeave: !g.isOwner,
        manage: () => {
          setMenuFor(null)
          setNewGroupOpen(true)
          setNg({
            name: g.name,
            desc: g.desc,
            members: [...g.members, ...g.pendingMembers],
            editId: g.id,
            isOwner: g.isOwner,
            allowManage: g.membersCanManage,
          })
        },
        remove: async () => {
          setMenuFor(null)
          const { error } = await db.deleteGroup(g.id)
          if (error) return toast(error.message)
          await refreshPrivate()
          toast(ar ? 'حُذفت المجموعة.' : 'Group deleted.')
        },
        leave: async () => {
          setMenuFor(null)
          const { error } = await db.leaveGroup(g.id, uid)
          if (error) return toast(error.message)
          if (openGroupId === g.id) setOpenGroupId(null)
          await refreshPrivate()
          toast(ar ? 'غادرت المجموعة.' : 'You left the group.')
        },
        openChat: () => { setOpenGroupId(g.id); setMenuFor(null) },
      }
    })

    /* بطاقات دعوات المجموعات — نفس شكل بطاقة المجموعة مع قبول/رفض */
    const groupInvites = groupInvitesModel.map((g, i) => {
      const inviter = personById(g.invitedBy)
      return {
        id: g.id,
        name: g.name,
        desc: g.desc || (ar ? 'بلا وصف.' : 'No description.'),
        delay: (i % 6) * 55 + 'ms',
        members: g.allMembers.map(memberChip).filter(Boolean),
        count: memberCountLabel(g.allMembers.length, ar),
        invitedBy: inviter
          ? ar ? `دعاك ${inviter.name}` : `${inviter.name} invited you`
          : ar ? 'دعوة مجموعة' : 'Group invitation',
        accept: () => respondInvite(g.id, true),
        reject: () => respondInvite(g.id, false),
      }
    })

    const activeGroupRaw = groupsModel.find((g) => g.id === openGroupId) || null
    const activeGroupInfo = activeGroupRaw
      ? { name: activeGroupRaw.name, count: memberCountLabel(activeGroupRaw.members.length + 1, ar) }
      : { name: '', count: '' }
    const groupMessages = activeGroupRaw
      ? activeGroupRaw.msgs.map((m) => {
          const mine = m.from === uid
          const p = personById(m.from)
          return {
            who: mine ? (ar ? 'أنت' : 'You') : p ? p.name : '',
            text: m.text, time: m.time,
            align: mine ? 'flex-end' : 'flex-start',
            bg: mine ? '#0f3d31' : '#f2f3f0',
            fg: mine ? '#fff' : '#16211d',
            nameFg: mine ? 'rgba(255,255,255,.7)' : '#77519a',
            timeFg: mine ? 'rgba(255,255,255,.65)' : '#9aa8a2',
          }
        })
      : []

    const statusStyle = {
      pending: ['#fdf4e3', '#b7791f', L.statusPending],
      accepted: ['#e3f1ec', '#227a62', L.statusAccepted],
      rejected: ['#fbeeee', '#a53f3f', L.statusRejected],
    }
    const visibleRequests = requests
      .filter((r) => (reqTab === 'received' ? r.dir === 'in' : r.dir === 'out'))
      .map((r) => {
        const p = personById(r.personId)
        const st = statusStyle[r.status]
        return {
          name: p?.name || '—', role: p?.role || '',
          initials: avatarText(p), color: avatarBg(p),
          message: r.msg,
          meta: (r.dir === 'in' ? L.receivedAt : L.sentAt) + ' · ' + r.time + ' · ' + (r.type === 'hackathon' ? L.hackathons : L.projects),
          statusBg: st[0], statusFg: st[1], statusLabel: st[2],
          actionable: r.dir === 'in' && r.status === 'pending',
          chatOpen: r.status === 'accepted',
          accept: () => doAccept(r.id, r.personId),
          reject: () => doReject(r.id),
          openChat: () => openChatWith(r.personId),
        }
      })

    const conversations = convs.map((c) => {
      const p = personById(c.personId)
      const last = c.msgs[c.msgs.length - 1]
      const on = activeConv === c.personId
      return {
        name: p?.name || '—', initials: avatarText(p),
        color: avatarBg(p),
        preview: last ? last.text : '—', time: last ? last.time : '',
        bg: on ? '#f1f8f5' : 'transparent',
        mark: on ? '#227a62' : 'transparent',
        open: () => { setActiveConv(c.personId); setDraft('') },
      }
    })
    const activeC = activeConv ? convs.find((c) => c.personId === activeConv) : null
    const activeP = activeC ? personById(activeC.personId) : null
    const activeConvInfo = activeP
      ? { name: activeP.name, role: activeP.role, initials: avatarText(activeP), color: avatarBg(activeP) }
      : { name: '', role: '', initials: '', color: '#e6e8e4' }
    const activeMessages = activeC
      ? activeC.msgs.map((m) => ({
          text: m.text, time: m.time,
          align: m.mine ? 'flex-end' : 'flex-start',
          bg: m.mine ? '#0f3d31' : '#f2f3f0',
          fg: m.mine ? '#fff' : '#16211d',
          timeFg: m.mine ? 'rgba(255,255,255,.65)' : '#9aa8a2',
        }))
      : []

    const openToOptions = [['both', L.openBoth], ['hackathon', L.openHackathon], ['project', L.openProject]].map(([key, label]) => {
      const on = meOpenTo === key
      return {
        label, on,
        bg: on ? '#0f3d31' : '#fff', fg: on ? '#fff' : '#3b4a45', border: on ? '#0f3d31' : '#e6e8e4',
        pick: () => { setMeOpenTo(key); setSaved(false) },
      }
    })

    const modalP = modalFor ? personById(modalFor) : null
    const levelled = mySkills.map((name) => ({
      name,
      remove: () => setSkillLevels((prev) => { const n = { ...prev }; delete n[name]; return n }),
      levels: LEVELS.map((k) => {
        const on = (skillLevels[name] || 'Intermediate') === k
        return {
          label: L['level' + k],
          bg: on ? '#fff' : 'transparent',
          fg: on ? '#0b2f26' : '#6b7a74',
          pick: () => setSkillLevels((prev) => ({ ...prev, [name]: k })),
        }
      }),
    }))

    const myProjectsView = (uid && byId.get(uid)?.projects?.length ? byId.get(uid).projects : pendingProjects).map((pr, i) => ({
      ...pr,
      remove: async () => {
        if (pr.id) { await db.deleteProject(pr.id); await refreshPublic() }
        else setPendingProjects((prev) => prev.filter((_, j) => j !== i))
      },
    }))

    return {
      L, dir: ar ? 'rtl' : 'ltr',
      isAuth: screen === 'login', isSignin: screen === 'signin',
      isOnboarding: screen === 'onboarding', isApp,

      steps, stepTitle: stepCopy[0], stepSubtitle: stepCopy[1],
      atAccount: step === 1, atProfile: step === 2, atSkills: step === 3, atProjects: step === 4,
      stepCounter: ar ? `الخطوة ${toArabicDigits(step)} من ٤` : `Step ${step} of 4`,
      nextLabel: step === 4 ? L.finishSetup : L.next,
      backStepLabel: step === 1 ? L.cancel : L.back,
      bioCount: `${meBio.length}/400`,

      signName, signEmail, signPass,
      editSignName: (e) => { setSignName(e.target.value); setMeName(e.target.value) },
      editSignEmail: (e) => setSignEmail(e.target.value),
      editSignPass: (e) => setSignPass(e.target.value),
      doLogin: doSignIn,
      loginLabel: busy ? L.working : L.login,
      remember,
      rememberBox: remember ? '#0f3d31' : '#fff',
      rememberBorder: remember ? '#0f3d31' : '#c9cfcb',
      rememberMark: remember ? '✓' : '',
      toggleRemember: () => {
        const next = !remember
        setRemember(next)
        localStorage.setItem('teamup.remember', next ? '1' : '0')
        if (!next) localStorage.removeItem('teamup.email')
      },
      busy,
      /* Enter في أي حقل من حقول الدخول/التسجيل يُكمل الخطوة */
      authKey: (e) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        if (screen === 'signin') doSignIn()
        else if (screen === 'onboarding' && step === 1) doSignUp()
      },
      goLanding: () => setScreen('login'),
      stepBack: () => (step === 1 ? setScreen('signin') : setStep(step - 1)),
      /* نحفظ بعد كل خطوة، مو في النهاية فقط — عشان لو أغلق أحد الصفحة
         في منتصف الإعداد ما تضيع بياناته (وأهمها المهارات). */
      /* الأساسيات إلزامية: الاسم والتخصص ومهارة واحدة على الأقل.
         المشاريع (الخطوة ٤) اختيارية بالكامل. */
      stepNext: async () => {
        if (step === 1) return doSignUp()
        if (step === 2) {
          if (!meName.trim()) return toast(L.needName)
          if (!meRole.trim()) return toast(L.needRole)
          await saveProfileFields()
        }
        if (step === 3) {
          if (mySkills.length === 0) return toast(L.needSkills)
          await saveMySkills()
        }
        if (step === 4) return finishOnboarding()
        setStep(step + 1)
      },
      /* الزر معطّل بصريًا لين تكتمل الأساسيات */
      stepBlocked:
        (step === 2 && (!meName.trim() || !meRole.trim())) ||
        (step === 3 && mySkills.length === 0),

      addableSkills: knownSkills.filter((n) => !mySkills.includes(n)).slice(0, 20).map((name) => ({
        name, addToMe: () => addSkillNamed(name),
      })),
      levelledSkills: levelled,
      noSkillsPicked: mySkills.length === 0,
      meSkillQuery,
      editMeSkillQuery: (e) => setMeSkillQuery(e.target.value),
      meSkillKey: (e) => { if (e.key === 'Enter') { addSkillNamed(meSkillQuery); setMeSkillQuery('') } },
      addMeSkill: () => { addSkillNamed(meSkillQuery); setMeSkillQuery('') },
      canAddMeSkill: !!meQ && !knownSkills.concat(mySkills).some((k) => k.toLowerCase() === meQ.toLowerCase()),
      meSuggestions: meSuggestions.map((name) => ({
        name, addToMe: () => { addSkillNamed(name); setMeSkillQuery('') },
      })),
      hasMeSuggestions: meSuggestions.length > 0,
      /* بلا بحث: «هذي أمثلة، اكتبي للبحث». مع بحث بلا نتيجة: «اضغطي إضافة». */
      meSkillHint: !meQ ? L.skillExamplesHint : (meSuggestions.length === 0 ? L.skillNoMatch : ''),

      myProjects: myProjectsView,
      np,
      editNpTitle: (e) => setNp({ ...np, title: e.target.value }),
      editNpRole: (e) => setNp({ ...np, role: e.target.value }),
      editNpDesc: (e) => setNp({ ...np, description: e.target.value }),
      editNpTech: (e) => setNp({ ...np, technologies: e.target.value }),
      addProject: async () => {
        if (!np.title.trim()) return
        if (uid && byId.get(uid)?.onboarded !== false && screen !== 'onboarding') {
          await db.insertProject(uid, np); await refreshPublic()
        } else {
          setPendingProjects((prev) => [...prev, np])
        }
        setNp(EMPTY_NP)
      },

      onDiscover: screen === 'discover', onResults: screen === 'results', onProfile: screen === 'profile',
      onRequests: screen === 'requests', onMessages: screen === 'messages', onTeam: screen === 'team',
      onSquad: screen === 'squad', onMe: screen === 'me', onSettings: screen === 'settings',
      onNotifications: screen === 'notifications',

      groups, hasGroups: groups.length > 0,
      noGroups: groups.length === 0 && groupInvites.length === 0,
      groupInvites, hasGroupInvites: groupInvites.length > 0,
      groupChatOpen: !!activeGroupRaw, activeGroup: activeGroupInfo, groupMessages, groupDraft,
      groupPlaceholder: activeGroupRaw ? (ar ? `اكتب إلى ${activeGroupRaw.name}…` : `Message ${activeGroupRaw.name}…`) : '',
      editGroupDraft: (e) => setGroupDraft(e.target.value),
      groupDraftKey: (e) => { if (e.key === 'Enter') doSendGroupMessage() },
      sendGroupMessage: doSendGroupMessage,
      closeGroupChat: () => setOpenGroupId(null),
      openNewGroup: () => { if (!uid) return needAccount(); setNewGroupOpen(true); setNg({ name: '', desc: '', members: [], editId: null, isOwner: true, allowManage: false }); setMenuFor(null) },
      closeNewGroup: () => setNewGroupOpen(false),
      newGroupOpen, ng,
      groupEditorTitle: ng.editId ? L.editGroup : L.newGroup,
      groupEditorCta: ng.editId ? L.saveGroup : L.createGroup,
      /* مفتاح الصلاحية يظهر للمالك فقط */
      showAllowManage: !ng.editId || ng.isOwner,
      allowManage: !!ng.allowManage,
      allowTrack: ng.allowManage ? '#0f3d31' : '#eeefec',
      allowTrackBorder: ng.allowManage ? '#0f3d31' : '#e6e8e4',
      allowJustify: ng.allowManage ? 'flex-end' : 'flex-start',
      toggleAllowManage: () => setNg((prev) => ({ ...prev, allowManage: !prev.allowManage })),
      editNgName: (e) => setNg({ ...ng, name: e.target.value }),
      editNgDesc: (e) => setNg({ ...ng, desc: e.target.value }),
      groupCandidates: teamMates.map((t) => {
        const on = ng.members.includes(t.id)
        return {
          name: t.name,
          bg: on ? '#0f3d31' : '#fff', fg: on ? '#fff' : '#3b4a45', border: on ? '#0f3d31' : '#e6e8e4',
          toggle: () => setNg((prev) => ({ ...prev, members: on ? prev.members.filter((x) => x !== t.id) : [...prev.members, t.id] })),
        }
      }),
      createGroup: doCreateGroup,

      team: teamMates, hasTeam: teamMates.length > 0, noTeam: teamMates.length === 0,
      teamSubtitle: ar
        ? `${memberCountLabel(teamMates.length, ar)} قبلتم التعاون معًا. المحادثة مفتوحة مع كل واحد منهم — ابدأ من حيث توقفتم.`
        : `${teamMates.length} ${teamMates.length === 1 ? 'person' : 'people'} you have agreed to collaborate with. A private chat is open with each of them — pick up where you left off.`,

      /* ---- مركز الإشعارات ---- */
      notifications: priv.notifications.map((n) => {
        const actor = n.actor_id ? personById(n.actor_id) : null
        const group = priv.groups.find((g) => g.id === n.group_id) || null
        const who = actor?.name || (ar ? 'عضو' : 'Someone')
        const gname = group ? `«${group.name}»` : (ar ? 'إحدى مجموعاتك' : 'one of your squads')
        /* صياغة عربية محايدة للجنس — التطبيق ما يعرف جنس العضو */
        let text
        if (n.type === 'interest') {
          text = ar ? `طلب تعاون جديد من ${who}` : `${who} sent you a collaboration request`
        } else if (n.type === 'accepted') {
          text = ar ? `قُبِل طلبك من ${who} — المحادثة مفتوحة الآن` : `${who} accepted your request — the chat is open now`
        } else if (group && n.body) {
          text = ar ? `رسالة جديدة من ${who} في ${gname}` : `${who} posted in ${gname}`
        } else {
          text = ar ? `دعوة إلى ${gname} من ${who}` : `${who} invited you to ${gname}`
        }
        const tone = n.type === 'interest' ? '#77519a' : n.type === 'accepted' ? '#227a62' : '#5d3f76'
        return {
          text,
          body: n.body || '',
          hasBody: !!n.body,
          time: relative(n.created_at, ar),
          unread: !n.read_at,
          bg: n.read_at ? '#fff' : '#f8f4fb',
          border: n.read_at ? '#e6e8e4' : '#c3a9d8',
          dot: n.read_at ? 'transparent' : tone,
          initials: avatarText(actor),
          color: avatarBg(actor),
          /* الضغط ينقلك لمكان الحدث */
          open: () => {
            if (n.type === 'interest') { setReqTab('received'); setScreen('requests') }
            else if (n.type === 'accepted') { if (actor) openChatWith(actor.id); else setScreen('messages') }
            else if (n.group_id) { setScreen('squad'); setOpenGroupId(n.group_id) }
            else setScreen('squad')
          },
        }
      }),
      hasNotifications: priv.notifications.length > 0,
      noNotifications: priv.notifications.length === 0,
      unreadCount: unreadNotifs
        ? `${toArabicDigits(unreadNotifs)} ${unreadNotifs === 1 ? L.notifUnreadOne : L.notifUnreadMany}`
        : '',
      hasUnread: unreadNotifs > 0,
      markNotifsRead: async () => {
        if (!uid) return needAccount()
        await db.markNotificationsRead(uid)
        await refreshPrivate()
      },
      clearNotifs: async () => {
        if (!uid) return needAccount()
        await db.clearNotifications(uid)
        await refreshPrivate()
      },

      notifToggles: [
        ['interest', L.notifInterest, L.notifInterestHint],
        ['accepted', L.notifAccepted, L.notifAcceptedHint],
        ['groups', L.notifGroups, L.notifGroupsHint],
      ].map(([key, label, hint]) => {
        const on = priv.prefs[key] !== false
        return {
          label, hint, on,
          track: on ? '#0f3d31' : '#eeefec',
          trackBorder: on ? '#0f3d31' : '#e6e8e4',
          justify: on ? 'flex-end' : 'flex-start',
          toggle: async () => {
            if (!uid) return needAccount()
            const next = { ...priv.prefs, [key]: !on }
            setPriv((p) => ({ ...p, prefs: next }))
            await db.savePrefs(uid, { interest: next.interest, accepted: next.accepted, groups: next.groups })
          },
        }
      }),
      changePassword: async () => {
        const email = session?.user?.email
        if (!email) return needAccount()
        /* لما يُفتح الموقع بالنقر المزدوج (file://) يكون الأصل "null"، فلا
           نمرّر redirectTo أصلًا ونترك Supabase يستخدم رابط الموقع المعتمد. */
        const origin = window.location.origin
        const opts = origin && origin !== 'null' ? { redirectTo: origin } : undefined
        const { error } = await sb.auth.resetPasswordForEmail(email, opts)
        if (error) return toast(translateAuthError(error.message, ar))
        toast(ar ? 'أُرسل رابط تغيير كلمة المرور إلى بريدك.' : 'A password reset link was sent to your email.')
      },
      deleteAccount,

      isGuest: guest, nav,
      sidebarOpen, sidebarClosed: !sidebarOpen,
      sidebarShift: !sidebarOpen ? (ar ? 'translateX(258px)' : 'translateX(-258px)') : 'translateX(0)',
      mainOffset: !sidebarOpen ? '0px' : '258px',
      toggleSidebar: () => setSidebarOpen((v) => !v),

      meName: uid ? meName : L.guestBadge,
      meRole: uid ? meRole : '',
      meBio, meExp,
      meInitials: uid ? avatarText(mePerson) : '',
      meAvatarBg: uid ? avatarBg(mePerson) : 'linear-gradient(140deg,#9aa8a2,#c3a9d8)',
      hasAvatar: !!mePerson.avatarUrl,
      uploadAvatar: (e) => { const f = e.target.files?.[0]; e.target.value = ''; uploadAvatar(f) },
      clearAvatar,
      myEmail: session?.user?.email || (ar ? 'وضع الضيف' : 'Guest mode'),
      saved, query, arrow: ar ? '←' : '→',
      arBg: ar ? '#fff' : 'transparent', arFg: ar ? '#0b2f26' : '#6b7a74',
      enBg: ar ? 'transparent' : '#fff', enFg: ar ? '#6b7a74' : '#0b2f26',

      collabTabs: [['all', L.all, '#16211d'], ['hackathon', L.tabHackathon, '#77519a'], ['project', L.tabProject, '#227a62']].map(([key, label, tone]) => {
        const on = collab === key
        return {
          label, bg: on ? '#fff' : 'transparent', fg: on ? '#0b2f26' : '#6b7a74',
          pillBg: on ? tone : '#fff', pillFg: on ? '#fff' : '#3b4a45', border: on ? tone : '#e6e8e4',
          pick: () => setCollab(key),
        }
      }),
      flatCatalogue: knownSkills.map(catSkills),
      reqTabs: [['received', L.received], ['sent', L.sent]].map(([key, label]) => {
        const on = reqTab === key
        return { label, bg: on ? '#fff' : 'transparent', fg: on ? '#0b2f26' : '#6b7a74', pick: () => setReqTab(key) }
      }),
      queryKey: (e) => { if (e.key === 'Enter') addPickedFromQuery() },
      addCustomSkill: () => addPickedFromQuery(),
      canAddSkill: !!skillQuery && !knownSkills.some((k) => k.toLowerCase() === skillQuery.toLowerCase()),
      addSkillLabel: ar ? `إضافة «${skillQuery}»` : `Add “${skillQuery}”`,
      /* بلا بحث نعرض أمثلة من كل تصنيف بدل ما تنزل كل المهارات دفعة وحدة؛
         أول ما تكتبين حرفين يظهر كل اللي يطابقها من قاعدة البيانات. */
      catalogueGroups: skillQuery
        /* أثناء البحث: قائمة واحدة مرتّبة — اللي يبدأ بالحروف أولًا مهما كان
           تصنيفه، عشان «ba» تعطي Backend في الأول مو Vector Databases. */
        ? (() => {
            const hits = rankSkills(knownSkills, skillQuery)
            return hits.length ? [{ label: L.searchResults, skills: hits.map(catSkills) }] : []
          })()
        : catalogueGroupsSrc
            .map((c) => ({
              label: ar ? c.ar : c.key,
              skills: [...new Set(c.skills)]
                .filter((n) => SKILL_EXAMPLES.includes(n))
                .sort((x, y) => x.localeCompare(y))
                .map(catSkills),
            }))
            .filter((c) => c.skills.length),
      skillListHint: skillQuery ? '' : L.skillExamplesHint,
      skillNoMatch: !!skillQuery && !knownSkills.some((n) => n.toLowerCase().includes(skillQuery.toLowerCase())),
      skillNoMatchText: L.skillNoMatch,
      mySkills: mySkills.map((name) => ({ name, remove: () => setSkillLevels((prev) => { const n = { ...prev }; delete n[name]; return n }) })),
      mySkillsCount: ar
        ? `${toArabicDigits(mySkills.length)} ${mySkills.length === 1 ? 'مهارة مضافة' : 'مهارات مضافة'}`
        : `${mySkills.length} ${mySkills.length === 1 ? 'skill' : 'skills'} added`,
      pickedSkills: picked.map((name) => ({ name, toggle: () => setPicked((prev) => prev.filter((x) => x !== name)) })),
      hasPicked: picked.length > 0,
      filterSummary: picked.length
        ? ar ? `تصفية حسب ${picked.length} من المهارات` : `Filtering by ${picked.length} skills`
        : ar ? 'لم تُحدَّد مهارات — يظهر جميع الأعضاء.' : 'No skills selected — showing everyone.',
      discoverSubtitle: ar
        ? `مرحبًا ${meName || (ar ? 'بك' : '')} — هؤلاء كل الأعضاء المتاحين. استخدم الفلاتر لتضييق النتائج.`
        : `Hi ${meName} — here is everyone available. Use the filters to narrow it down.`,
      memberCount: membersAvailable(people.length, ar),
      matchedCount: ar
        ? `تمت مطابقة ${toArabicDigits(exact.length + partial.length)} من الأشخاص`
        : `${exact.length + partial.length} people matched`,
      people,
      /* البحث بالاسم وحده كافٍ لعرض النتائج — بدون ما يضطر أحد يختار مهارة أولًا. */
      pickFirst: !picked.length && !browseAll && !q,
      showPeople: (picked.length > 0 || browseAll || !!q) && people.length > 0,
      noPeople: (picked.length > 0 || browseAll || !!q) && people.length === 0,
      browseEveryone: () => setBrowseAll(true),
      memberCountShown: picked.length > 0 || browseAll || !!q,
      resultGroups, noResults: resultGroups.length === 0,

      viewed, viewedIsMe: isMe, viewedIsOther: !isMe,
      /* لا نعرض عنوان قسم فاضي في ملف ناقص */
      viewedHasProjects: (viewedRaw?.projects || []).length > 0,
      viewedHasExperience: !!(viewedRaw?.exp || '').trim(),
      viewedHasSkills: (viewedRaw?.skills || []).length > 0,
      backLabel: isMe ? (ar ? 'العودة إلى ملفي' : 'Back to My Profile') : L.backToDiscover,
      visibleRequests, noRequests: visibleRequests.length === 0,
      conversations, hasConversations: convs.length > 0, noConversations: convs.length === 0,
      activeConv: activeConvInfo, activeMessages, draft,
      hasActiveConv: !!activeC, noActiveConv: !activeC,
      closeConv: () => { setActiveConv(null); setDraft('') },
      convCount: chats(convs.length, ar),
      composePlaceholder: ar ? `راسل ${activeConvInfo.name}…` : `Message ${activeConvInfo.name}…`,
      openToOptions,

      modalOpen: !!modalP,
      modalTitle: modalP ? (ar ? `تواصل مع ${modalP.name}` : `Reach out to ${modalP.name}`) : '',
      modalPlaceholder: modalP ? (ar ? `مرحبًا ${modalP.name}، أبحث عن شخص…` : `Hi ${modalP.name}, I'm looking for someone to…`) : '',
      modalTypes: [['hackathon', L.tabHackathon, '#77519a'], ['project', L.tabProject, '#227a62']].map(([key, label, tone]) => {
        const on = modalType === key
        return { label, bg: on ? tone : '#fff', fg: on ? '#fff' : '#3b4a45', border: on ? tone : '#e6e8e4', pick: () => setModalType(key) }
      }),
      reqMsg, toast: toastMsg,

      /* نافذة «سجّل دخول أو أنشئ حساب» للضيف */
      gateOpen: !!gate,
      gateTitle: gate === 'search' ? L.gateSearchTitle : L.gateTitle,
      gateBody: gate === 'search' ? L.gateSearchBody : L.gateBody,
      gateLater: L.gateLater,
      closeGate: () => setGate(null),
      gateSignin: () => { setGate(null); setGuest(false); setScreen('signin') },
      gateSignup: () => { setGate(null); setGuest(false); setScreen('onboarding'); setStep(1) },
      guestBannerText:
        guestSearches >= GUEST_SEARCHES
          ? (ar ? 'انتهت عمليات البحث المجانية.' : 'Your free searches are used up.')
          : (ar
              ? `${L.guestBanner} بقي لك ${toArabicDigits(GUEST_SEARCHES - guestSearches)} من ${toArabicDigits(GUEST_SEARCHES)} عمليات بحث.`
              : `${L.guestBanner} ${GUEST_SEARCHES - guestSearches} of ${GUEST_SEARCHES} searches left.`),

      setAr: () => setLang('ar'),
      setEn: () => setLang('en'),
      toggleLang: () => setLang(ar ? 'en' : 'ar'),
      langThumb: ar ? 'translateX(128px)' : 'translateX(0)',
      langThumbAr: ar ? 'translateX(0)' : 'translateX(64px)',
      arPillBg: ar ? '#fff' : 'transparent', arPillFg: ar ? '#0b2f26' : '#6b7a74',
      arPillShadow: ar ? '0 2px 8px rgba(11,47,38,.08)' : 'none',
      enPillBg: ar ? 'transparent' : '#fff', enPillFg: ar ? '#6b7a74' : '#0b2f26',
      enPillShadow: ar ? 'none' : '0 2px 8px rgba(11,47,38,.08)',

      login: () => setScreen('signin'),
      guest: () => { clearIdentity(); setGuest(true); setBrowseAll(true); setScreen('discover') },
      logoutAsk,
      askLogout: () => setLogoutAsk(true),
      cancelLogout: () => setLogoutAsk(false),
      logout: doLogout,
      startOnboarding: (e) => { if (e?.preventDefault) e.preventDefault(); setScreen('onboarding'); setStep(1) },
      backToAuth: () => setScreen('login'),
      finishOnboarding,
      goDiscover: () => setScreen('discover'),
      goRequests: () => (uid ? setScreen('requests') : needAccount()),
      goMe: () => (uid ? setScreen('me') : needAccount()),
      viewMyProfile: () => { if (!uid) return needAccount(); setFrom('me'); setViewId(uid); setScreen('profile') },
      goBackFromProfile: () => setScreen(from === 'me' ? 'me' : from || 'discover'),
      runSearch: () => {
        if (!uid) {
          if (guestSearches >= GUEST_SEARCHES) return setGate('search')
          setGuestSearches((n) => n + 1)
        }
        setScreen('results')
      },
      clearSkills: () => { setPicked([]); setBrowseAll(false) },
      editQuery: (e) => setQuery(e.target.value),
      editName: (e) => { setMeName(e.target.value); setSaved(false) },
      editRole: (e) => { setMeRole(e.target.value); setSaved(false) },
      editBio: (e) => { setMeBio(e.target.value); setSaved(false) },
      editExp: (e) => { setMeExp(e.target.value); setSaved(false) },
      saveProfile,
      editDraft: (e) => setDraft(e.target.value),
      draftKey: (e) => { if (e.key === 'Enter') doSendMessage() },
      sendMessage: doSendMessage,
      openRequestModal: () => {
        if (!uid) return needAccount()
        if (rel && rel.status === 'accepted') return openChatWith(viewedRaw.id)
        if (!rel || rel.status !== 'pending') { setModalFor(viewedRaw.id); setModalType('project'); setReqMsg('') }
      },
      closeModal: () => setModalFor(null),
      editReqMsg: (e) => setReqMsg(e.target.value),
      sendRequest: submitRequest,
    }

    function addPickedFromQuery() {
      const name = query.trim()
      if (!name) return
      const match = knownSkills.find((k) => k.toLowerCase() === name.toLowerCase())
      const skill = match || name
      setQuery('')
      setPicked((prev) => (prev.includes(skill) ? prev : [...prev, skill]))
      if (!match && uid) db.addSkillToCatalogue(skill).then(refreshPublic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lang, screen, step, guest, uid, session, ar, L,
    collab, query, picked, browseAll, signName, signEmail, signPass,
    viewId, from, reqTab, saved, modalFor, modalType, reqMsg,
    activeConv, draft, menuFor, openGroupId, groupDraft, newGroupOpen, ng,
    sidebarOpen, logoutAsk, toastMsg, meSkillQuery, busy, remember, gate, guestSearches, clearIdentity,
    meName, meRole, meBio, meExp, meOpenTo, skillLevels, pendingProjects, np,
    others, byId, mePerson, requests, convs, groupsModel, myGroups, groupInvitesModel, respondInvite, priv.prefs,
    knownSkills, catalogueGroupsSrc, mySkills, decorate, personById, relationWith,
  ])

  if (!booted) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f5f2', color: '#6b7a74' }}>
        …
      </div>
    )
  }

  return (
    <>
      <Root V={V} />
      {isolatedTab ? <TabBadge ar={ar} /> : null}
      {screen === 'settings' ? <ConnectionBadge ar={ar} /> : null}
    </>
  )
}

/** شارة صغيرة تبيّن أن هذا التبويب له جلسة مستقلة (وضع التجربة بحسابين). */
function TabBadge({ ar }) {
  return (
    <div
      style={{
        position: 'fixed', insetBlockStart: 10, insetInlineStart: 12, zIndex: 95,
        padding: '5px 12px', borderRadius: 999, background: '#efe7f6',
        border: '1px solid #c3a9d8', color: '#5d3f76', fontSize: 11.5, fontWeight: 700,
        pointerEvents: 'none',
      }}
    >
      {ar ? 'جلسة مستقلة لهذا التبويب' : 'Independent session in this tab'}
    </div>
  )
}

function ConnectionBadge({ ar }) {
  const label = ar ? 'تغيير مشروع Supabase' : 'Change Supabase project'
  return (
    <button
      onClick={clearCredentials}
      title={label}
      style={{
        position: 'fixed', insetBlockEnd: 18, insetInlineEnd: 18, zIndex: 90,
        padding: '9px 16px', borderRadius: 999, border: '1px solid #e6e8e4',
        background: '#fff', color: '#6b7a74', fontSize: 12.5, fontWeight: 700,
        cursor: 'pointer', boxShadow: '0 6px 18px rgba(11,47,38,.10)',
      }}
    >
      {label}
    </button>
  )
}

function translateAuthError(msg, ar) {
  if (!ar) return msg
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'البريد أو كلمة المرور غير صحيحة.'
  if (m.includes('already registered') || m.includes('already been registered')) return 'هذا البريد مسجّل من قبل — سجّل الدخول.'
  if (m.includes('password should be at least')) return 'كلمة المرور قصيرة جدًا.'
  if (m.includes('email not confirmed')) return 'لم يتم تأكيد البريد بعد — راجع بريدك.'
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'صيغة البريد الإلكتروني غير صحيحة.'
  if (m.includes('rate limit')) return 'محاولات كثيرة — انتظر قليلًا.'
  return msg
}
