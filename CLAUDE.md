# CLAUDE.md — ذاكرة مشروع TeamUp

> هذا الملف يُقرأ تلقائيًا في بداية أي جلسة Claude داخل هذا المجلد (نفس الملف الذي
> ينشئه الأمر `/init`). اقرأه بالكامل قبل أي تعديل — فيه قرارات وأخطاء
> مكلفة تم حلّها مسبقًا، وإعادة اكتشافها تضيّع وقتًا وتكسر أشياء تعمل.

الردود على صاحبة المشروع **بالعربية**. لهجتها خليجية وتفضّل الشرح المباشر
والأسباب الحقيقية بدون تجميل.

---

## ١. ما هو المشروع

**TeamUp** — منصة تجمع المطوّرين والمصمّمين حسب **المهارات**، لبناء فرق
هاكاثونات ومشاريع. عربي/إنجليزي بالكامل مع دعم RTL.

التصميم الأصلي جاء كنموذج ثابت (`TeamUp.html` — بروتوتايب بصيغة dc-template)،
وحُوِّل إلى موقع حقيقي بـ **React + Vite** مربوط بـ **Supabase**.

### قاعدة ذهبية: لا تغيّر التصميم

الواجهة **مطابقة حرفيًا** للنموذج الأصلي: نفس الألوان والمسافات والحركات
والزوايا. عند إضافة أي عنصر جديد، انسخ أنماط عنصر مشابه موجود بدل ابتكار شكل
جديد. لا تُدخِل مكتبة CSS ولا تعيد كتابة الأنماط.

---

## ٢. مشروع Supabase

| | |
|---|---|
| اسم المشروع | `TeamUp` |
| ref | `rkgkwbzklspgrbzrowhc` |
| URL | `https://rkgkwbzklspgrbzrowhc.supabase.co` |
| المنطقة | ap-southeast-1 |
| المفتاح العام | في `.env` (المفتاح `anon` عام وآمن في المتصفح) |

الحساب مربوط عبر **Supabase MCP** — تقدر تشغّل `apply_migration` و
`execute_sql` مباشرة. **لا تنشئ مشروعًا جديدًا** إلا إذا طلبت هي ذلك صراحة.

لتغيير المشروع من داخل الموقع: صفحة الإعدادات ← زر «تغيير مشروع Supabase»
(يُخزَّن في `localStorage` ويتجاوز `.env`).

---

## ٣. مخطط قاعدة البيانات (١١ جدول)

```
profiles            id(=auth.users) · name/name_en · role/role_en · bio/bio_en
                    experience/experience_en · open_to(both|hackathon|project)
                    avatar_seed · avatar_url · onboarded · is_demo · created_at
skills              name(PK) · category · category_ar          ← كتالوج المهارات
user_skills         user_id · skill · level(Beginner|Intermediate|Advanced)
projects            id · user_id · title · role · description/_en · technologies
requests            id · sender_id · receiver_id · type(hackathon|project)
                    message · status(pending|accepted|rejected)
conversations       id · user_a · user_b        (user_a < user_b دائمًا)
messages            id · conversation_id · sender_id · body · created_at
groups              id · name · description · owner_id · members_can_manage
group_members       group_id · user_id · status(pending|accepted|rejected)
                    invited_by · created_at
group_messages      id · group_id · sender_id · body · created_at
notification_prefs  user_id · interest · accepted · groups
notifications       id · user_id · type(interest|accepted|groups) · actor_id
                    group_id · body · read_at · created_at
```

**فهرس مهم:** `requests_one_per_pair` — طلب واحد فقط بين أي شخصين **بأي
اتجاه** (`least/greatest`). بدونه يظهر الزميل مرتين في «زملائي».

### الدوال (كلها SECURITY DEFINER)

| الدالة | الوظيفة |
|---|---|
| `handle_new_user()` | trigger على `auth.users` — ينشئ profile + notification_prefs |
| `accept_request(req_id)` | يقبل الطلب ويفتح محادثة ويعيد `conversation_id` |
| `conversation_with(other)` | يجلب/ينشئ محادثة بعد قبول التعاون |
| `is_group_member(gid,uid)` | عضو **مقبول** أو مالك → يفتح الدردشة |
| `is_group_participant(gid,uid)` | مدعو **أو** عضو → يرى الاسم والوصف والأعضاء |
| `can_manage_group(gid,uid)` | مالك، أو عضو مقبول إذا `members_can_manage` |
| `set_group_permission(gid,allow)` | المالك وحده يبدّل صلاحية الأعضاء |
| `is_conversation_member(cid,uid)` | طرف في المحادثة |
| `notify(user,type,actor,group,body)` | **قلب نظام الإشعارات** — يتحقق من `notification_prefs` أولًا فيسكت إذا كان المفتاح مطفأ، ثم يُدرج الصف. لا يُشعر الشخص بفعل نفسه |

### تريجرات الإشعارات (في `05_notifications.sql`)
`trg_request_notify` (طلب جديد / قُبِل طلبك) · `trg_group_member_notify` (دعوة
مجموعة) · `trg_group_message_notify` (رسالة في مجموعة → لكل عضو مقبول عدا المرسِل).

### Realtime
مفعّل على: `messages` · `group_messages` · `requests` · `group_members` ·
`groups` · `notifications`

> `group_members` و `groups` أُضيفا لاحقًا — بدونهما دعوة المجموعة ما توصل
> للمدعو إلا بعد تحديث الصفحة.

### Storage
bucket `avatars` (عام للقراءة، ٣MB، صور فقط). المسار `avatars/<user_id>/…`
والسياسات تمنع أي شخص من الكتابة خارج مجلده. **هذا هو الدلو الوحيد المستخدم
للصور الشخصية.**

> كان فيه دلو ثانٍ اسمه `site` غير مستخدم (٠ ملفات) وسياسته `ALL` لأي مستخدم
> مسجَّل على دلو عام بلا حد حجم ولا نوع — أي شخص يسجّل يقدر يرفع أي ملف على
> النطاق. أُزيلت سياستاه فصار غير قابل للكتابة. **حذف الدلو نفسه من SQL ممنوع**
> (`storage.protect_delete`) ويُحذف من اللوحة: Storage ← site ← Delete bucket.
> لا تُعِد إنشاءه.

### Edge Functions
`delete-account` — حذف الحساب نهائيًا. `verify_jwt=false` **عن قصد**: الدالة
تتحقق من الـ JWT بنفسها عبر `admin.auth.getUser(token)`، وتمرير OPTIONS
مطلوب لـ CORS لأن الموقع يُفتح أحيانًا من `file://` (الأصل `null`).

---

## ٤. أخطاء مكلفة تم حلّها — لا تكررها

### ٤.١ سياسات RLS وحدها لا تكفي — لازم GRANT
أكبر خطأ في المشروع. الجداول أُنشئت بـ RLS صحيحة لكن بدون صلاحيات على
الجداول نفسها، فكان التسجيل ينجح (لأنه يمر بدالة SECURITY DEFINER) بينما
**كل قراءة وكتابة بعده ترجع `permission denied`** بصمت.

```sql
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to anon, authenticated;
alter default privileges in schema public grant ... ;   -- للجداول القادمة
```

**عند إضافة أي جدول جديد:** تأكد من الـ GRANT، مو بس السياسة.

### ٤.١.١ `revoke ... from anon, authenticated` وحده لا يفعل شيئًا
بوستجرس يمنح `EXECUTE` على كل دالة جديدة إلى **`PUBLIC`** افتراضيًا، ودورا
`anon` و `authenticated` يرثان منه. فمنعهما وحدهما يترك الدالة مكشوفة على
`/rest/v1/rpc/<name>`. صار هذا فعلًا مع `notify()` — كان أي مستخدم مسجَّل
يقدر يزرع إشعارًا كاذبًا لأي شخص.

```sql
revoke execute on function public.notify(...) from public, anon, authenticated;
```

**لكن انتبه:** لا تمنع الدوال التي تناديها الواجهة (`accept_request`,
`conversation_with`, `set_group_permission`) ولا التي تستخدمها سياسات RLS
(`is_group_member`, `is_group_participant`, `is_conversation_member`,
`can_manage_group`) — منعها يكسر السياسات نفسها.

### ٤.٢ دالة STABLE لا ترى الصف الجديد في `INSERT … RETURNING`
سياسة قراءة `groups` كانت `using (is_group_member(id, auth.uid()))`. الدالة
`STABLE` تعمل على لقطة ما قبل العبارة، فلا ترى الصف الجاري إدراجه، فيفشل
إنشاء المجموعة بـ `new row violates row-level security policy` — رسالة
مضلّلة تمامًا (تبدو وكأنها مشكلة في `WITH CHECK`).

**القاعدة:** ابدأ السياسة بمقارنة مباشرة على عمود من نفس الصف:

```sql
using (owner_id = auth.uid() or public.is_group_participant(id, auth.uid()))
```

### ٤.٣ حدود بيئة التطوير
- الحاوية السحابية **لا تصل إلى `*.supabase.co`** (يرجع 000). لا تحاول اختبار
  الاتصال الحقيقي من هنا.
- الاختبار البصري: أنشئ `test/mock-supabase.js` + `vite.test.config.js`
  (plugin يعيد توجيه أي `import … supabase` إلى الـ mock) ثم Playwright على
  `/opt/pw-browsers/chromium`. **احذف مجلد `test/` وملف الإعداد قبل التغليف.**
- الاختبار الحقيقي ضد قاعدة البيانات: `execute_sql` مع
  `set_config('request.jwt.claims', …)` + `set local role authenticated`
  داخل **DO block واحد** (المتغيرات لا تبقى بين عبارات منفصلة)، وأنهِ بـ
  `raise exception 'ROLLBACK_PROBE'` حتى لا تتلوث البيانات.
- `delete from storage.buckets` ممنوع — يجب استخدام Storage API.

### ٤.٤ Claude in Chrome
التبويب الذي يفتحه المساعد **يمنع المستخدمة من الكتابة فيه**. إذا احتجت
تدخّلها (تسجيل دخول مثلًا) **أغلق التبويب أولًا** ثم اطلب منها تفتح تبويبًا
من عندها. ولا تضغط زر تسجيل دخول بكلمة مرور نيابة عنها.

---

## ٥. بنية الواجهة

```
src/
├─ App.jsx              كل المنطق: الحالة + الاستعلامات + كائن V
├─ index.css            الأنماط العامة والحركات وبديهيات الاستخدام
├─ components/PasswordField.jsx   حقل كلمة المرور مع زر العين
├─ screens/
│  ├─ Setup.jsx         شاشة ربط Supabase (تظهر إذا ما فيه إعدادات)
│  └─ AuthGate.jsx      نافذة «سجّل دخول أو أنشئ حساب» للضيف
├─ lib/
│  ├─ supabase.js       العميل + تبديل المشروع + جلسة مستقلة لكل تبويب
│  ├─ db.js             كل استعلامات قاعدة البيانات في مكان واحد
│  ├─ strings.js        كل النصوص عربي/إنجليزي  (STR.ar / STR.en)
│  ├─ style.js          __css("a:b;c:d") → كائن أنماط React
│  └─ time.js           تواريخ نسبية + جمع عربي صحيح
└─ generated/           الواجهة — مولّدة أصلًا ثم عُدِّلت يدويًا
```

### نمط `V` — مهم جدًا
`App.jsx` يبني كائنًا واحدًا اسمه `V` فيه **كل** ما تحتاجه الواجهة: نصوص
جاهزة، ألوان محسوبة، ودوال. وملفات `generated/` تقرأ منه فقط
(`{V.people}`, `{V.L.navHome}`, `onClick={V.runSearch}`).

**لإضافة أي ميزة:** أضف القيم في `V` داخل `App.jsx`، ثم اربطها في
`generated/*.jsx`. لا تضع منطقًا داخل ملفات `generated/`.

### مساعد `__css`
التصميم الأصلي مكتوب بأنماط CSS نصية داخل السمات. `__css()` يحوّلها إلى
كائن React مع تخزين مؤقت. هذا ما يحفظ التطابق البصري ١٠٠٪ — **أبقِ عليه**.

### تأثيرات hover
`generated/hover.css` فيه أصناف `hv1…hv18` مولّدة من `style-hover` بالأصل،
وكلها `!important` لأنها تتغلب على الأنماط السطرية.

### ⚠️ `convert.py` (في مجلد العمل، خارج المشروع)
هو المحوّل الذي أنتج `generated/` من النموذج الأصلي.
**لا تعِد تشغيله** — ملفات `generated/` عُدِّلت يدويًا بعد التوليد (زر العين،
دعوات المجموعات، أدوار الأعضاء، الصورة الشخصية، شارة الضيف…) وإعادة التوليد
تمسح كل ذلك.

---

## ٦. قواعد سلوك المنتج (متفق عليها مع المستخدمة)

### وضع الضيف
- **٣ عمليات بحث** فقط، والشريط العلوي يعدّ المتبقي.
- بعدها، وأي إجراء آخر (فتح ملف، محادثة، طلب، مجموعات، إعدادات، أي عنصر
  تنقّل عدا «الرئيسية») → تفتح نافذة `AuthGate`.
- تسجيل الخروج يستدعي `clearIdentity()` — يمسح كل أثر للمستخدم السابق،
  وإلا ظهر اسمه في وضع الضيف.

### الإعداد الأولي
- **مطلوب:** الاسم · التخصص التقني · مهارة واحدة على الأقل.
  زر «التالي» معطّل (`V.stepBlocked`) حتى تكتمل.
- **اختياري:** النبذة · الخبرة · المشاريع.
- **الحفظ بعد كل خطوة** لا في النهاية فقط — لأن المستخدمات كنّ يغادرن في
  المنتصف فتضيع المهارات ويصرن غير قابلات للاكتشاف.
- خطوة المهارات: **لا تُعرض كل المهارات** — أمثلة قليلة فقط، وأول ما تكتب
  حرفين يظهر المطابِق من الكتالوج (اللي **يبدأ** بالحروف أولًا: `ba` → Backend
  قبل Database)، وإذا ما فيه مطابق يظهر زر «إضافة» ليضيفها للكتالوج ولملفها.
  المنطق في `rankSkills` و `exampleSkills` و `SKILL_EXAMPLES`.

### طلبات التعاون
زر البطاقة يعكس حالة العلاقة **بالاتجاهين**: إرسال الطلب / قيد الانتظار /
فتح المحادثة. القبول في اتجاه واحد يكفي للطرفين.

### المجموعات
- إضافة عضو = **دعوة** بحالة `pending`. لا يدخل الدردشة حتى يقبل.
- المدعو يرى الاسم والوصف وصور الأعضاء قبل القرار، وله زرّا انضمام/رفض في
  صفحة «فِرقي»، مع شارة عدد على عنصر التنقّل.
- الأدوار: مالك (إدارة + حذف) · عضو (مغادرة فقط) · عضو مسموح له (إدارة +
  مغادرة). حذف المجموعة وتبديل الصلاحية **للمالك وحده** — محميّ في قاعدة
  البيانات لا في الواجهة فقط، والأعضاء يملكون `UPDATE` على
  `(name, description)` فقط عبر GRANT على مستوى الأعمدة.

### أخرى
- «تذكّرني»: يحفظ **البريد فقط**. كلمة المرور تُترك لمدير كلمات مرور المتصفح
  عبر `autoComplete` — لا تُخزَّن أبدًا في الكود.
- جلسة مستقلة لكل تبويب: `?tab=2` في الرابط → `sessionStorage` +
  `storageKey` خاص، وتظهر شارة بنفسجية. للتجربة بحسابين معًا.

---

## ٧. البناء والتسليم

```bash
npm install
npm run dev                                    # تطوير
npx vite build --config vite.single.config.js  # ملف HTML واحد
```

ثم **أدرج الأيقونة يدويًا** (خطوة سهلة النسيان):

```python
import base64
p = 'dist-single/index.html'
s = open(p, encoding='utf-8').read()
d = 'data:image/svg+xml;base64,' + base64.b64encode(open('dist-single/logo.svg','rb').read()).decode()
open(p, 'w', encoding='utf-8').write(s.replace('href="/logo.svg"', 'href="' + d + '"'))
```

الناتج `dist-single/index.html` ملف واحد ~٥٣٠KB يعمل بالنقر المزدوج من
`file://` بدون خادم — وهذه هي الطريقة التي تستخدمها فعليًا.

**التسليم:** `SendUserFile` ثم `device_commit_files` إلى
`C:\Users\wooow\Desktop\TeamUp\` باسم `TeamUp-الموقع.html` و
`TeamUp-website.zip`. أرسل الاثنين معًا بعد كل تعديل.

---

## ٨. ملفات SQL

| الملف | متى |
|---|---|
| `supabase/01_schema.sql` | مرة واحدة — جداول + RLS + **GRANTs** + دوال + Realtime |
| `supabase/02_skills.sql` | مطلوب — كتالوج ١٨٢ مهارة في ١٣ تصنيفًا |
| `supabase/03_demo_members_optional.sql` | اختياري — ٩ أعضاء تجريبيين (`teamup123`) |
| `supabase/04_storage_and_avatars.sql` | Storage + `avatar_url` + سياساتها |
| `supabase/05_notifications.sql` | مطلوب — جدول الإشعارات + `notify()` + التريجرات |
| `supabase/functions/delete-account/` | Edge Function |

**أي تعديل تطبّقه عبر `apply_migration` طبّقه أيضًا على هذه الملفات** حتى
تبقى قابلة لإعادة التشغيل على مشروع جديد.

---

## ٨.٥ أخطاء أُصلحت في جولة الفحص الشامل (١٥ أغسطس ٢٠٢٦)

لا تُعِد إدخالها:

1. **أول «التالي» في الخطوة ٢ كان يُبتلع** — الـ effect الذي يوجّه بعد الدخول
   كان ينفّذ `setStep(2)` متأخرًا فيلغي `setStep(3)`. الحل: `setStep(s => s > 2 ? s : 2)`
   حتى لا يرجّع الخطوة للخلف أبدًا.
2. **`JWT issued at future`** — التوكن لحظة التسجيل يسبق ساعة الخادم بجزء من
   الثانية. `refreshPublic` صار يعيد المحاولة ٣ مرات بصمت.
3. **من يرفض طلبك ما كان يقدر يرسل لك** — الفهرس `requests_one_per_pair` بالاتجاهين
   بينما الـ upsert كان على `(sender_id, receiver_id)` فقط. الآن `sendRequest`
   يبحث عن أي صف بالاتجاهين ويحدّثه.
4. **المشاريع** — تُضاف وتُحذف الآن من «ملفي» (كان النص يعِد بذلك ولا وجود له).
5. **«زملائي»** — أُضيف زر «رسالة مباشرة» (`p.chat` كان معرّفًا وغير مربوط).
6. جمع عربي وأرقام هندية: `membersAvailable` و `chats` في `time.js`.
7. `Squadlly` → `My Squads` · عنوان الصفحة وزر تغيير المشروع صارا ثنائيي اللغة.
8. عناوين الأقسام الفاضية (مشاريع/خبرة) تختفي بدل ما تظهر بلا محتوى.
9. `changePassword` يتحقق من الخطأ، ويتجاهل `redirectTo` إذا كان الأصل `null`
   (يحدث عند فتح الموقع من `file://`).

10. **الإشعارات** — كانت المفاتيح تُحفظ بلا أي أثر. الآن فيه نظام كامل داخل
    الموقع: صفحة «الإشعارات» في التنقّل مع شارة غير المقروء، والتريجرات في
    `05_notifications.sql` تكتب الصفوف، و`notify()` تحترم المفاتيح.
    الضغط على الإشعار ينقلك لمكان الحدث، وفتح الصفحة يعلّمها مقروءة تلقائيًا.

**ملاحظة عن الإشعارات:** هي **داخل الموقع فقط** (in-app). لا إيميل ولا push —
البريد يحتاج Edge Function + مزوّد بريد (Resend/SendGrid)، والـ push ما يشتغل
أصلًا من `file://`.

## ٩. حالة معروفة

- **تأكيد البريد**: لا يمكن تغييره عبر MCP. إذا اشتكت أن التسجيل يطلب
  تأكيدًا: Authentication → Sign In / Providers → Email → Confirm email = Off.
- الموقع غير منشور على الإنترنت بعد؛ تستخدمه كملف محلي. خيارات النشر
  مشروحة في `README.md`.
