/* =====================================================================
   SUPABASE — โหลดข้อมูลจากฐานข้อมูล (อ่านอย่างเดียว)
   - publishable key ใช้ฝั่งหน้าเว็บได้ สิทธิ์ถูกจำกัดด้วย RLS ให้ select ได้อย่างเดียว
   - แปลงข้อมูลให้อยู่ในรูปแบบเดียวกับ data.js เพื่อให้ app.js ใช้ต่อได้เลย
   ===================================================================== */
const SUPABASE_URL = "https://wpjzzywwbfsyltliulqg.supabase.co";
const SUPABASE_KEY = "sb_publishable_yYu9TC6heWGO3O4RB_2BNg_SUow2fvW";

async function sbGet(path){
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers:{ apikey:SUPABASE_KEY } });
  if(!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

async function loadFromSupabase(){
  const [settings, cats, projects, team, recs] = await Promise.all([
    sbGet("site_settings?select=key,value"),
    sbGet("categories?select=*&order=sort_order"),
    sbGet("projects?select=*,project_activities(*),project_images(*),project_members(*)" +
          "&order=start_date.desc&project_activities.order=sort_order&project_images.order=sort_order"),
    sbGet("team_members?select=*&order=sort_order"),
    sbGet("recognitions?select=*&order=sort_order")
  ]);

  SITE = Object.fromEntries(settings.map(s => [s.key, s.value]));

  CATEGORIES = Object.fromEntries(cats.map(c => [c.key, { label:c.label, icon:c.icon, color:c.color }]));

  PROJECTS = projects.map(p => ({
    slug:p.slug, title:p.title, titleEn:p.title_en, tagline:p.tagline,
    category:p.category, start:p.start_date, end:p.end_date,
    location:p.location, province:p.province, region:p.region,
    org:p.org, partners:p.partners || [],
    summary:p.summary, problem:p.problem, did:p.did,
    activities:(p.project_activities || []).map(a => ({ no:a.no, th:a.th, en:a.en, brand:a.brand, img:a.img, icon:a.icon })),
    hours:p.hours, beneficiaries:p.beneficiaries,
    highlight:p.highlight_value ? { value:p.highlight_value, label:p.highlight_label } : null,
    cover:p.cover, before:p.before_img, after:p.after_img,
    images:(p.project_images || []).map(i => i.path),
    members:(p.project_members || []).map(m => ({ slug:m.member_slug, role:m.role, hours:m.hours })),
    reflection:p.reflection
  }));

  TEAM = team.map(m => ({
    slug:m.slug, name:m.name, tier:m.tier, role:m.role,
    duties:m.duties || [], photo:m.photo, quote:m.quote
  }));
  LEADERS = team.filter(m => m.is_leader).map(m => m.slug);

  RECOGNITIONS = recs.map(r => ({
    title:r.title, issuer:r.issuer, date:r.date, type:r.type, project:r.project_slug, url:r.url
  }));
}
