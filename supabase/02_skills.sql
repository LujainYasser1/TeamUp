-- ============================================================================
--  TeamUp - كتالوج المهارات (مطلوب)
--  شغّله بعد 01_schema.sql في: Supabase - SQL Editor - New query - Run
--  ١٨٢ مهارة في ١٣ تصنيفًا: ذكاء اصطناعي ووكلاء، تعلّم آلة، بيانات، شبكات وأمن،
--  خلفيات، واجهات، جوال، قواعد بيانات، عمليات وسحابة، تصميم، ألعاب، تقنيات ناشئة.
--  قابل لإعادة التشغيل: on conflict يحدّث التصنيف بدل ما يفشل.
-- ============================================================================
insert into public.skills (name, category, category_ar)
select n, 'AI & Agents', 'الذكاء الاصطناعي والوكلاء' from unnest(array['Artificial Intelligence','AI Agents','Multi-Agent Systems','LLMs','Prompt Engineering','RAG','LangChain','LlamaIndex','OpenAI API','Claude API','Hugging Face','Fine-tuning','Vector Databases','Embeddings','MCP','Generative AI','NLP','Speech Recognition','Chatbots','AI Ethics']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Machine Learning', 'تعلّم الآلة' from unnest(array['Machine Learning','Deep Learning','PyTorch','TensorFlow','Keras','scikit-learn','Computer Vision','Reinforcement Learning','MLOps','Model Deployment','Neural Networks']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Data', 'البيانات والتحليل' from unnest(array['Data Analysis','Data Engineering','Data Visualization','Pandas','NumPy','Spark','ETL','Power BI','Tableau','Statistics','R','Excel','Big Data','Airflow']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Networks & Security', 'الشبكات والأمن السيبراني' from unnest(array['Networking','Computer Networks','TCP/IP','DNS','HTTP','Cybersecurity','Network Security','Penetration Testing','Ethical Hacking','Cryptography','Firewalls','VPN','Wireshark','Nmap','OWASP','Incident Response','CCNA']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Backend', 'الواجهات الخلفية' from unnest(array['Backend','Node.js','Python','FastAPI','Django','Flask','Go','Java','Spring Boot','C#','.NET','PHP','Laravel','Ruby on Rails','Rust','C++','Express.js','NestJS','REST API','GraphQL','gRPC','Microservices','WebSockets']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Frontend', 'الواجهات الأمامية' from unnest(array['Frontend','HTML','CSS','JavaScript','TypeScript','React','Next.js','Vue','Angular','Svelte','Tailwind CSS','Bootstrap','SASS','Redux','Vite','Three.js','WebGL','Accessibility','Responsive Design']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Mobile', 'تطبيقات الجوال' from unnest(array['Flutter','Dart','React Native','Swift','SwiftUI','Kotlin','Android','iOS']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Database', 'قواعد البيانات' from unnest(array['SQL','NoSQL','PostgreSQL','MySQL','SQLite','MongoDB','Redis','Firebase','Supabase','Elasticsearch','Prisma','Oracle','Neo4j','Database Design']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'DevOps & Cloud', 'العمليات والسحابة' from unnest(array['Docker','Kubernetes','AWS','Azure','Google Cloud','CI/CD','GitHub Actions','Jenkins','Terraform','Ansible','Linux','Bash','Nginx','Git','Monitoring','Kafka','Serverless']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Design & Product', 'التصميم والمنتج' from unnest(array['UI/UX','Figma','Prototyping','User Research','Design Systems','Wireframing','Adobe XD','Photoshop','Illustrator','After Effects','Motion Design','Branding','Product Management','Agile','Scrum','User Testing']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Game & 3D', 'الألعاب والتصميم ثلاثي الأبعاد' from unnest(array['Unity','Unreal Engine','Game Design','Blender','3D Modeling','AR/VR','Animation']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Emerging Tech', 'تقنيات ناشئة' from unnest(array['Blockchain','Smart Contracts','Solidity','Web3','IoT','Embedded Systems','Arduino','Raspberry Pi','Robotics','Quantum Computing','Digital Twins']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

insert into public.skills (name, category, category_ar)
select n, 'Other', 'مهارات عامة' from unnest(array['Technical Writing','Team Leadership','Presentation','Research','Problem Solving']) n
on conflict (name) do update set category=excluded.category, category_ar=excluded.category_ar;

