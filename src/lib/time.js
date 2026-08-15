const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export const toArabicDigits = (v) => String(v).replace(/\d/g, (d) => AR_DIGITS[+d])

/** "10:24" */
export function clock(iso) {
  const d = iso ? new Date(iso) : new Date()
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

/** "قبل ٢ س" / "2h ago" */
export function relative(iso, ar) {
  if (!iso) return ''
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.floor(diff / 60000)
  if (min < 1) return ar ? 'الآن' : 'just now'
  if (min < 60) return ar ? `قبل ${toArabicDigits(min)} د` : `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return ar ? `قبل ${toArabicDigits(hr)} س` : `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day === 1) return ar ? 'أمس' : 'Yesterday'
  if (day < 30) return ar ? `قبل ${toArabicDigits(day)} ي` : `${day}d ago`
  const mo = Math.floor(day / 30)
  return ar ? `قبل ${toArabicDigits(mo)} شهر` : `${mo}mo ago`
}

/** "عضو منذ ٢٠٢٤" / "Member since 2024" */
export function memberSince(iso, ar) {
  const y = iso ? new Date(iso).getFullYear() : new Date().getFullYear()
  return ar ? `عضو منذ ${toArabicDigits(y)}` : `Member since ${y}`
}

/** جمع عربي صحيح: عضو واحد / عضوان / ٣ أعضاء / ١١ عضوًا */
export function plural(n, ar, forms) {
  if (!ar) return `${n} ${n === 1 ? forms.enOne : forms.enMany}`
  if (n === 1) return forms.one
  if (n === 2) return forms.two
  if (n >= 3 && n <= 10) return `${toArabicDigits(n)} ${forms.few}`
  return `${toArabicDigits(n)} ${forms.many}`
}

export const members = (n, ar) =>
  plural(n, ar, { one: 'عضو واحد', two: 'عضوان', few: 'أعضاء', many: 'عضوًا', enOne: 'member', enMany: 'members' })

/** "٤ أعضاء متاحين" / "4 members available" */
export const membersAvailable = (n, ar) =>
  ar
    ? plural(n, ar, { one: 'عضو واحد متاح', two: 'عضوان متاحان', few: 'أعضاء متاحين', many: 'عضوًا متاحًا' })
    : `${n} ${n === 1 ? 'member' : 'members'} available`

/** "٣ محادثات" / "3 chats" */
export const chats = (n, ar) =>
  plural(n, ar, { one: 'محادثة واحدة', two: 'محادثتان', few: 'محادثات', many: 'محادثة', enOne: 'chat', enMany: 'chats' })

export const pendingInvites = (n, ar) =>
  plural(n, ar, { one: 'دعوة واحدة بانتظار القبول', two: 'دعوتان بانتظار القبول', few: 'دعوات بانتظار القبول', many: 'دعوة بانتظار القبول', enOne: 'pending invite', enMany: 'pending invites' })
