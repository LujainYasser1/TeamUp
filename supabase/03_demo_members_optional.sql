-- ============================================================================
--  TeamUp — أعضاء تجريبيون (اختياري تمامًا)
--
--  شغّليه فقط إذا بغيتِ الموقع يطلع فيه أعضاء جاهزين للتجربة.
--  كل الحسابات كلمة مرورها: teamup123   (مثال: sara@teamup.demo)
--
--  لحذفهم لاحقًا:
--    delete from auth.users where email like '%@teamup.demo';
-- ============================================================================

-- ---------------------------------------------------------------- دالة إنشاء حساب تجريبي
create or replace function public.demo_user(p_email text, p_password text default 'teamup123')
returns uuid
language plpgsql
security definer set search_path = public, auth, extensions
as $$
declare uid uuid;
begin
  select id into uid from auth.users where email = p_email;
  if uid is not null then return uid; end if;

  uid := gen_random_uuid();
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
    p_email, extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, now(), now()
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), uid, uid::text,
          jsonb_build_object('sub', uid::text, 'email', p_email, 'email_verified', true),
          'email', now(), now(), now());

  return uid;
end;
$$;

-- ---------------------------------------------------------------- الأعضاء التجريبيون
do $$
declare
  uid uuid;
  rec record;
begin
  for rec in
    select * from (values
      ('sara@teamup.demo','سارة أحمد','Sara Ahmed','مطوّرة خلفية','Backend Developer','both',0,
       'مطوّرة خلفية مهتمة ببناء تطبيقات قابلة للتوسع ومشاريع تقنية تعاونية.',
       'Backend developer interested in building scalable applications and collaborative technology projects.',
       '٣ سنوات في بناء واجهات REST وخدمات كثيفة البيانات للشركات الناشئة.',
       '3 years building REST APIs and data-heavy services for startups.'),
      ('omar@teamup.demo','عمر خالد','Omar Khalid','مهندس متكامل','Full-Stack Engineer','hackathon',1,
       'أستمتع بإطلاق منتجات متكاملة بسرعة، خصوصًا في الهاكاثونات.',
       'I enjoy shipping end-to-end products fast, especially during hackathons.',
       'فزت بهاكاثونين إقليميين؛ ٤ سنوات عمل متكامل.',
       'Won two regional hackathons; 4 years of full-stack work.'),
      ('layla@teamup.demo','ليلى حسن','Layla Hassan','مصممة تجربة مستخدم','UI/UX Designer','project',2,
       'مصممة منتجات تبرمج بما يكفي ليكون التسليم سلسًا.',
       'Product designer who codes enough to make handoff painless.',
       '٥ سنوات في تصميم منتجات الجوال والويب.',
       '5 years designing consumer mobile and web products.'),
      ('yousef@teamup.demo','يوسف ناصر','Yousef Nasser','مهندس تعلّم آلة','Machine Learning Engineer','both',3,
       'مهندس تعلّم آلة تطبيقي يركّز على نماذج عملية قابلة للنشر.',
       'Applied ML engineer focused on practical, deployable models.',
       '٣ سنوات في الرؤية الحاسوبية والتنبؤ.',
       '3 years in computer vision and forecasting.'),
      ('noura@teamup.demo','نورة العتيبي','Noura Al-Otaibi','مطوّرة واجهات','Frontend Developer','both',4,
       'مطوّرة واجهات تهتم بسهولة الوصول والواجهات النظيفة.',
       'Frontend developer who cares about accessibility and clean interfaces.',
       'سنتان في بناء أنظمة تصميم بـ React.',
       '2 years building design systems in React.'),
      ('faisal@teamup.demo','فيصل الحربي','Faisal Al-Harbi','مهندس عمليات','DevOps Engineer','project',5,
       'أجعل عمليات النشر مملّة — بأفضل معنى ممكن.',
       'I make deployments boring — in the best possible way.',
       '٦ سنوات في تشغيل بنية إنتاجية على AWS.',
       '6 years running production infrastructure on AWS.'),
      ('rana@teamup.demo','رنا عزيز','Rana Aziz','مطوّرة متكاملة','Full-Stack Developer','both',6,
       'مرتاحة في كل طبقات التطوير، وحاليًا متعمقة في Next.js و Postgres.',
       'Comfortable across the stack, currently deep in Next.js and Postgres.',
       'سنتان عمل حر على منتجات الويب.',
       '2 years freelancing on web products.'),
      ('bilal@teamup.demo','بلال رحمن','Bilal Rahman','مطوّر خلفية','Backend Developer','both',7,
       'مطوّر خلفية بايثون يحب الواجهات النظيفة والاختبارات الجيدة.',
       'Python backend developer who likes clean APIs and good tests.',
       'سنتان في بناء أدوات داخلية بـ FastAPI.',
       '2 years building internal tools with FastAPI.'),
      ('maryam@teamup.demo','مريم صالح','Maryam Saleh','مطوّرة تطبيقات جوال','Mobile Developer','hackathon',8,
       'مطوّرة Flutter تبني تجارب سلسة متعددة المنصات.',
       'Flutter developer building smooth cross-platform experiences.',
       '٣ سنوات في نشر التطبيقات على المتاجر.',
       '3 years shipping apps to the App Store and Play Store.')
    ) as t(email, name, name_en, role, role_en, open_to, seed, bio, bio_en, exp, exp_en)
  loop
    uid := public.demo_user(rec.email);
    insert into public.profiles (id, name, name_en, role, role_en, bio, bio_en, experience, experience_en, open_to, avatar_seed, onboarded, is_demo)
    values (uid, rec.name, rec.name_en, rec.role, rec.role_en, rec.bio, rec.bio_en, rec.exp, rec.exp_en, rec.open_to, rec.seed, true, true)
    on conflict (id) do update set
      name = excluded.name, name_en = excluded.name_en, role = excluded.role, role_en = excluded.role_en,
      bio = excluded.bio, bio_en = excluded.bio_en, experience = excluded.experience,
      experience_en = excluded.experience_en, open_to = excluded.open_to,
      avatar_seed = excluded.avatar_seed, onboarded = true, is_demo = true;
  end loop;
end $$;

-- ---------------------------------------------------------------- المهارات لكل عضو
do $$
declare rec record; uid uuid;
begin
  for rec in
    select * from (values
      ('sara@teamup.demo','Backend','Advanced'),('sara@teamup.demo','FastAPI','Advanced'),
      ('sara@teamup.demo','PostgreSQL','Advanced'),('sara@teamup.demo','Python','Advanced'),
      ('sara@teamup.demo','Docker','Intermediate'),
      ('omar@teamup.demo','React','Advanced'),('omar@teamup.demo','Node.js','Advanced'),
      ('omar@teamup.demo','TypeScript','Advanced'),('omar@teamup.demo','PostgreSQL','Intermediate'),
      ('omar@teamup.demo','Backend','Intermediate'),
      ('layla@teamup.demo','UI/UX','Advanced'),('layla@teamup.demo','Figma','Advanced'),
      ('layla@teamup.demo','Prototyping','Advanced'),('layla@teamup.demo','User Research','Intermediate'),
      ('yousef@teamup.demo','Machine Learning','Advanced'),('yousef@teamup.demo','Python','Advanced'),
      ('yousef@teamup.demo','Pandas','Advanced'),('yousef@teamup.demo','Computer Vision','Intermediate'),
      ('yousef@teamup.demo','FastAPI','Intermediate'),
      ('noura@teamup.demo','React','Advanced'),('noura@teamup.demo','Frontend','Advanced'),
      ('noura@teamup.demo','Tailwind CSS','Advanced'),('noura@teamup.demo','TypeScript','Intermediate'),
      ('noura@teamup.demo','UI/UX','Intermediate'),
      ('faisal@teamup.demo','Docker','Advanced'),('faisal@teamup.demo','Kubernetes','Advanced'),
      ('faisal@teamup.demo','AWS','Advanced'),('faisal@teamup.demo','CI/CD','Advanced'),
      ('faisal@teamup.demo','Linux','Advanced'),
      ('rana@teamup.demo','Next.js','Advanced'),('rana@teamup.demo','React','Advanced'),
      ('rana@teamup.demo','PostgreSQL','Intermediate'),('rana@teamup.demo','Backend','Intermediate'),
      ('rana@teamup.demo','FastAPI','Beginner'),
      ('bilal@teamup.demo','FastAPI','Advanced'),('bilal@teamup.demo','Python','Advanced'),
      ('bilal@teamup.demo','PostgreSQL','Intermediate'),('bilal@teamup.demo','Docker','Beginner'),
      ('maryam@teamup.demo','Flutter','Advanced'),('maryam@teamup.demo','Firebase','Advanced'),
      ('maryam@teamup.demo','UI/UX','Intermediate'),('maryam@teamup.demo','Backend','Beginner')
    ) as t(email, skill, level)
  loop
    select id into uid from auth.users where email = rec.email;
    if uid is not null then
      insert into public.user_skills (user_id, skill, level) values (uid, rec.skill, rec.level)
      on conflict (user_id, skill) do update set level = excluded.level;
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------- المشاريع السابقة
do $$
declare rec record; uid uuid;
begin
  for rec in
    select * from (values
      ('sara@teamup.demo','Clinic Booking API','Lead Backend','منصة مواعيد تخدم ١٢ ألف حجز شهريًا.','Appointment platform serving 12k monthly bookings.','FastAPI, PostgreSQL, Redis'),
      ('sara@teamup.demo','Open Datasets Portal','Backend Engineer','كتالوج بيانات عام مع بحث وإصدارات.','Public data catalogue with search and versioning.','Python, PostgreSQL'),
      ('omar@teamup.demo','HackBoard','Full-Stack','لوحة نتائج لحظية استخدمها ٣٠٠ مشارك.','Live scoreboard used by 300 hackathon participants.','Next.js, Node.js'),
      ('layla@teamup.demo','Wellness App Redesign','Product Designer','رفعت معدل البقاء ٢٢٪ بعد إعادة تصميم كاملة.','Raised retention by 22% after a full redesign.','Figma, Prototyping'),
      ('yousef@teamup.demo','Retail Demand Forecasting','ML Engineer','خفّض نفاد المخزون ١٨٪ لسلسلة بقالة.','Reduced stockouts by 18% for a grocery chain.','Python, Pandas'),
      ('noura@teamup.demo','Component Library','Frontend Lead','مكتبة مكونات متاحة استُخدمت في أربعة منتجات.','Accessible component library used across four products.','React, TypeScript'),
      ('faisal@teamup.demo','Zero-Downtime Migration','DevOps Lead','نقل نظام متجانس إلى حاويات بدون توقف.','Moved a monolith to containers with no downtime.','Docker, Kubernetes'),
      ('rana@teamup.demo','Freelance CRM','Full-Stack','نظام فوترة ومتابعة عملاء للمستقلين.','Invoicing and client tracker for solo freelancers.','Next.js, PostgreSQL'),
      ('bilal@teamup.demo','Inventory Service','Backend Developer','واجهة مخزون مستودعات مع سجل تدقيق.','Warehouse inventory API with audit history.','FastAPI, PostgreSQL'),
      ('maryam@teamup.demo','Campus Navigator','Mobile Developer','تطبيق تنقل داخلي لحرم جامعي.','Indoor navigation app for a university campus.','Flutter, Firebase')
    ) as t(email, title, role, description, description_en, technologies)
  loop
    select id into uid from auth.users where email = rec.email;
    if uid is not null and not exists (select 1 from public.projects p where p.user_id = uid and p.title = rec.title) then
      insert into public.projects (user_id, title, role, description, description_en, technologies)
      values (uid, rec.title, rec.role, rec.description, rec.description_en, rec.technologies);
    end if;
  end loop;
end $$;
