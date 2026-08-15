import React, { useState } from 'react'
import { __css as s } from '../lib/style'
import { saveCredentials, credentials } from '../lib/supabase'
import logo from '../assets/logo.svg'

const T = {
  ar: {
    eyebrow: 'ربط قاعدة البيانات',
    title: 'اربط الموقع بمشروع Supabase',
    sub: 'الصقي رابط مشروعك والمفتاح العام. تُحفظ في متصفحك فقط، وتقدرين تغيّرينها متى ما بغيتِ.',
    url: 'Project URL — رابط المشروع',
    key: 'Anon / Publishable key — المفتاح العام',
    save: 'حفظ والاتصال',
    where: 'وين ألاقيها؟',
    steps: [
      'افتحي supabase.com وسجّلي الدخول بالحساب اللي فيه المشروع.',
      'اختاري المشروع، ثم من القائمة الجانبية: Project Settings ⚙️ ← API Keys.',
      'انسخي Project URL والصقيه في الحقل الأول.',
      'انسخي مفتاح anon public (أو Publishable key) والصقيه في الحقل الثاني.',
      'قبلها بخطوة: شغّلي ملفَّي 01_schema.sql و 02_seed.sql في SQL Editor.',
    ],
    safe: 'المفتاح العام مخصّص للمتصفح وآمن — لا تستخدمي أبدًا مفتاح service_role هنا.',
    bad: 'الرابط لازم يبدأ بـ https:// وينتهي بـ .supabase.co',
    lang: 'English',
  },
  en: {
    eyebrow: 'Database connection',
    title: 'Connect this site to your Supabase project',
    sub: 'Paste your project URL and public key. They are stored in your browser only, and you can change them any time.',
    url: 'Project URL',
    key: 'Anon / Publishable key',
    save: 'Save and connect',
    where: 'Where do I find these?',
    steps: [
      'Open supabase.com and sign in with the account that holds the project.',
      'Open the project, then in the sidebar: Project Settings ⚙️ → API Keys.',
      'Copy the Project URL into the first field.',
      'Copy the anon public (or Publishable) key into the second field.',
      'Before that: run 01_schema.sql and 02_seed.sql in the SQL Editor.',
    ],
    safe: 'The public key is meant for browsers and is safe. Never paste a service_role key here.',
    bad: 'The URL must start with https:// and end with .supabase.co',
    lang: 'العربية',
  },
}

export default function Setup() {
  const [lang, setLang] = useState('ar')
  const [url, setUrl] = useState(credentials.url || '')
  const [key, setKey] = useState(credentials.key || '')
  const [err, setErr] = useState('')
  const L = T[lang]
  const ar = lang === 'ar'

  const submit = () => {
    const u = url.trim().replace(/\/+$/, '')
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(u)) return setErr(L.bad)
    if (key.trim().length < 20) return setErr(L.bad)
    saveCredentials(u, key)
  }

  const field = 'width:100%;padding:14px 18px;border:1px solid #e6e8e4;border-radius:16px;background:#fff;font-size:14.5px;direction:ltr;text-align:left'

  return (
    <div
      dir={ar ? 'rtl' : 'ltr'}
      style={s(
        "min-height:100vh;display:grid;place-items:center;padding:56px 24px;background:radial-gradient(760px 460px at 8% 0%, rgba(146,112,180,.13), transparent 60%), radial-gradient(700px 420px at 96% 12%, rgba(34,122,98,.11), transparent 58%), linear-gradient(180deg,#fbfaf8,#f6f5f2);color:#16211d;font-family:'IBM Plex Sans Arabic','Plus Jakarta Sans',system-ui,sans-serif;font-size:15.5px;line-height:1.6"
      )}
    >
      <div style={s('width:100%;max-width:560px;background:#fff;border:1px solid #e6e8e4;border-radius:28px;box-shadow:0 18px 48px rgba(11,47,38,.12);padding:36px;display:flex;flex-direction:column;gap:20px;animation:tu-rise .5s cubic-bezier(.2,.8,.2,1) both')}>
        <div style={s('display:flex;align-items:center;justify-content:space-between;gap:12px')}>
          <div style={s('display:inline-flex;align-items:center;gap:10px;direction:ltr')}>
            <img src={logo} alt="TeamUp" width="32" height="32" style={s('width:32px;height:32px;flex:none')} />
            <span style={s("font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:19px;letter-spacing:-.03em;color:#0b2f26")}>TeamUp</span>
          </div>
          <button
            onClick={() => setLang(ar ? 'en' : 'ar')}
            style={s('border:1px solid #e6e8e4;background:#fff;padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;color:#3b4a45;cursor:pointer;white-space:nowrap')}
          >
            {L.lang}
          </button>
        </div>

        <div>
          <span style={s('font-size:12.5px;font-weight:700;color:#77519a')}>{L.eyebrow}</span>
          <h1 style={s('margin:6px 0 6px;font-size:26px;font-weight:700;letter-spacing:-.02em')}>{L.title}</h1>
          <p style={s('margin:0;color:#6b7a74;font-size:14.5px')}>{L.sub}</p>
        </div>

        <div style={s('display:flex;flex-direction:column;gap:7px')}>
          <label style={s('font-size:13.5px;font-weight:600;color:#3b4a45')}>{L.url}</label>
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setErr('') }}
            placeholder="https://xxxxxxxxxxxx.supabase.co"
            style={s(field)}
          />
        </div>

        <div style={s('display:flex;flex-direction:column;gap:7px')}>
          <label style={s('font-size:13.5px;font-weight:600;color:#3b4a45')}>{L.key}</label>
          <textarea
            value={key}
            onChange={(e) => { setKey(e.target.value); setErr('') }}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            style={s(field + ';min-height:92px;resize:vertical;font-size:12.5px;line-height:1.5')}
          />
        </div>

        {err ? (
          <div style={s('padding:11px 14px;border-radius:14px;background:#fbeeee;color:#a53f3f;font-size:13.5px;font-weight:600')}>{err}</div>
        ) : null}

        <button
          onClick={submit}
          className="hv2"
          style={s('padding:15px 24px;border:0;border-radius:999px;background:#0f3d31;color:#fff;font-weight:700;font-size:16px;cursor:pointer')}
        >
          {L.save}
        </button>

        <div style={s('padding:16px 18px;border:1px dashed #c3a9d8;border-radius:18px;background:#f8f4fb')}>
          <div style={s('font-size:14px;font-weight:700;color:#5d3f76;margin-bottom:8px')}>{L.where}</div>
          <ol style={s('margin:0;padding-inline-start:20px;color:#3b4a45;font-size:13.5px;line-height:1.9')}>
            {L.steps.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
          <p style={s('margin:12px 0 0;font-size:12.5px;color:#6b7a74')}>{L.safe}</p>
        </div>
      </div>
    </div>
  )
}
