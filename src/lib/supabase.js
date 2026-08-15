import { createClient } from '@supabase/supabase-js'

/**
 * بيانات الاتصال بمشروع Supabase.
 *
 * لها مصدران، والأولوية للأول:
 *   1) ما تحفظينه من داخل الموقع نفسه (شاشة «ربط Supabase») — يُخزَّن في المتصفح.
 *      هذا يخليك تغيّرين الحساب/المشروع في أي وقت بدون تعديل أي ملف.
 *   2) ملف .env في مجلد المشروع:
 *        VITE_SUPABASE_URL       = https://xxxxxxxx.supabase.co
 *        VITE_SUPABASE_ANON_KEY  = eyJhbGciOi...        (المفتاح العام anon/publishable)
 */

const LS_KEY = 'teamup.supabase'

function fromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const v = JSON.parse(raw)
    return v && v.url && v.key ? v : null
  } catch {
    return null
  }
}

const stored = typeof window !== 'undefined' ? fromStorage() : null

export const credentials = {
  url: (stored?.url || import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, ''),
  key: (stored?.key || import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim(),
  source: stored ? 'browser' : import.meta.env.VITE_SUPABASE_URL ? 'env' : 'none',
}

export const isConfigured = Boolean(credentials.url && credentials.key)

/**
 * جلسة مستقلة لكل تبويب — للتجربة بحسابين في نفس المتصفح.
 *
 * المتصفح يشارك localStorage بين كل تبويبات الموقع نفسه، فتسجيل الدخول في
 * تبويب يبدّل الجلسة في التبويبات الأخرى. إذا فتحتِ الرابط ومعه ?tab=2
 * (أو أي قيمة) صارت الجلسة محفوظة في sessionStorage الخاص بذلك التبويب
 * وحده، فتقدرين تدخلين بحسابين مختلفين جنبًا إلى جنب.
 */
const tabId =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('tab')
    : null

export const isolatedTab = !!tabId

export const supabase = isConfigured
  ? createClient(credentials.url, credentials.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        ...(tabId
          ? { storageKey: `teamup-auth-tab-${tabId}`, storage: window.sessionStorage }
          : {}),
      },
    })
  : null

/** حفظ حساب/مشروع Supabase جديد ثم إعادة تحميل الصفحة. */
export function saveCredentials(url, key) {
  localStorage.setItem(
    LS_KEY,
    JSON.stringify({ url: String(url).trim().replace(/\/+$/, ''), key: String(key).trim() })
  )
  location.reload()
}

/** الرجوع إلى ما في ملف .env (أو إلى شاشة الربط إن لم يوجد). */
export function clearCredentials() {
  localStorage.removeItem(LS_KEY)
  location.reload()
}
