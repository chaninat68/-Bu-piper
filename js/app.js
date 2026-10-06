/* =====================================================================
   APP — ไม่จำเป็นต้องแก้ส่วนนี้
   ===================================================================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const TH_MONTH = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
const fmtDate = d => { if(!d) return ""; const x=new Date(d+"T00:00:00"); return `${x.getDate()} ${TH_MONTH[x.getMonth()]} ${x.getFullYear()+543}`; };
const fmtRange = p => p.end && p.end!==p.start ? `${fmtDate(p.start)} – ${fmtDate(p.end)}` : fmtDate(p.start);
const nf = n => Number(n).toLocaleString("en-US");
const memberBy = s => TEAM.find(m => m.slug===s);
const projectBy = s => PROJECTS.find(p => p.slug===s);
const PALETTE = ["#0A9BB0","#1DABB3","#3BB37C","#55C46A","#6DD35A","#E98A9A","#F2A7B0"];
const colorFor = s => PALETTE[[...s].reduce((a,c)=>a+c.charCodeAt(0),0)%PALETTE.length];
const initials = n => n.replace(/[^A-Za-z]/g,"").slice(0,2).toUpperCase() || n.slice(0,2);
const pinSvg = '<svg width="16" height="18" viewBox="0 0 24 28" fill="currentColor"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 28 12 28s12-7.6 12-16.3C24 5.2 18.6 0 12 0zm0 16a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6z"/></svg>';
const catOf = p => CATEGORIES[p.category] || {label:p.category, icon:"💗", color:"#1DABB3"};
const projectsOf = slug => PROJECTS.filter(p => p.members?.some(m => m.slug===slug));
const hoursOf = slug => projectsOf(slug).reduce((a,p)=>{const m=p.members.find(x=>x.slug===slug);return a+(m.hours ?? 0)},0);

function cover(p, cls){
  const c = catOf(p);
  const bg = `linear-gradient(135deg, ${c.color}33, ${c.color}88)`;
  return `<div class="${cls}" style="background:${bg}">${p.cover?`<img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">`:`<span aria-hidden="true">${c.icon}</span>`}`;
}

/* ---------- render ---------- */
function renderStats(){
  const t = {
    projects: PROJECTS.length,
    hours: PROJECTS.reduce((a,p)=>a+(+p.hours||0),0),
    people: PROJECTS.reduce((a,p)=>a+(+p.beneficiaries||0),0),
    provinces: new Set(PROJECTS.map(p=>p.province).filter(Boolean)).size,
    orgs: new Set(PROJECTS.flatMap(p=>[p.org,...(p.partners||[])]).filter(Boolean)).size
  };
  const items = [[t.projects,"โครงการ"],[t.hours,"ชั่วโมงจิตอาสา"],[t.people,"ผู้ได้รับประโยชน์"],[t.provinces,"จังหวัด"],[t.orgs,"หน่วยงานที่ร่วมงาน"]];
  const shown = items.filter(([n])=>n>0);
  $("#statsWrap").style.setProperty("--n", shown.length);
  $("#statsWrap").innerHTML = shown.map(([n,l])=>`<div class="stat"><b data-n="${n}">0</b><span>${l}</span></div>`).join("");
  $("#heroChips").innerHTML = `<span class="chip">👥 ${TEAM.length} สมาชิก</span><span class="chip">📍 ${t.provinces} จังหวัด</span>${t.hours?`<span class="chip">⏱ ${nf(t.hours)} ชั่วโมง</span>`:`<span class="chip">🌿 ${t.projects} โครงการ</span>`}`;
}
function countUp(){
  document.querySelectorAll("[data-n]").forEach(el=>{
    const end=+el.dataset.n, t0=performance.now(), dur=1400;
    const step=now=>{const k=Math.min(1,(now-t0)/dur);el.textContent=nf(Math.round(end*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step)};
    requestAnimationFrame(step);
  });
}
function renderRegions(){
  const R = {north:"ภาคเหนือ · North",northeast:"ภาคอีสาน · Northeast",central:"ภาคกลาง & ตะวันตก · Central & West",south:"ภาคใต้ · South"};
  $("#regions").innerHTML = Object.entries(R).map(([k,label])=>{
    const ps = PROJECTS.filter(p=>p.region===k);
    return `<div class="region reveal"><h3>${label}</h3>${ps.length?ps.map(p=>`<div class="pin" role="button" tabindex="0" data-open="${p.slug}">${pinSvg}<div>${esc(p.province)}<small>${esc(p.location)}</small></div></div>`).join(""):`<div class="empty">ยังไม่มีโครงการ</div>`}</div>`;
  }).join("");
}
let activeCat = "all";
function renderFilters(){
  const used = [...new Set(PROJECTS.map(p=>p.category))];
  $("#filters").innerHTML = [`<button class="filter ${activeCat==="all"?"on":""}" data-cat="all">ทั้งหมด (${PROJECTS.length})</button>`]
    .concat(used.map(c=>`<button class="filter ${activeCat===c?"on":""}" data-cat="${c}">${catOf({category:c}).icon} ${esc(catOf({category:c}).label)}</button>`)).join("");
}
function renderProjects(highlight){
  const list = [...PROJECTS].sort((a,b)=>b.start.localeCompare(a.start)).filter(p=>activeCat==="all"||p.category===activeCat);
  $("#grid").innerHTML = list.map(p=>{
    const c=catOf(p); const mine = highlight ? p.members?.some(m=>m.slug===highlight) : null;
    return `<button class="card reveal in ${highlight?(mine?"hl":"dim"):""}" data-open="${p.slug}">
      ${cover(p,"thumb")}<span class="cat">${c.icon} ${esc(c.label)}</span>${p.sample?'<span class="sample">ตัวอย่าง</span>':""}</div>
      <div class="body">
        <div class="loc">${pinSvg}${esc(p.province)} · ${fmtRange(p)}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="meta">${p.highlight?`<span><b>${esc(p.highlight.value)}</b> ${esc(p.highlight.label)}</span>`:""}${p.hours?`<span><b>${nf(p.hours)}</b> ชม.</span>`:""}${p.beneficiaries?`<span><b>${nf(p.beneficiaries)}</b> คน</span>`:""}${p.members?.length?`<span><b>${p.members.length}</b> สมาชิก</span>`:""}</div>
      </div></button>`;
  }).join("");
}
function polaroid(m){
  return `<button class="pola reveal" data-member="${m.slug}">
    <div class="frame"><div class="ph" style="background:${colorFor(m.slug)}">${m.photo?`<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`:initials(m.name)}</div><div class="sig">${esc(m.name)}</div></div>
    ${m.tier==="cofounder"?`<div class="role">${esc(m.role)}</div>`:""}</button>`;
}
function renderTeam(){
  const cf = TEAM.filter(m=>m.tier==="cofounder");
  $("#leaders").innerHTML = cf.filter(m=>LEADERS.includes(m.slug)).map(polaroid).join("");
  $("#cofounders").innerHTML = cf.filter(m=>!LEADERS.includes(m.slug)).map(polaroid).join("");
  $("#members").innerHTML = TEAM.filter(m=>m.tier==="member").map(polaroid).join("");
}
function renderRecs(){
  const I={letter:"✉️",certificate:"🏅",news:"📰",award:"🏆"};
  if(!RECOGNITIONS.length){ $("#recognition").remove(); document.querySelector('.menu a[href="#recognition"]')?.parentElement.remove(); return; }
  $("#recs").innerHTML = RECOGNITIONS.map(r=>{
    const p=projectBy(r.project);
    const tag = r.url?"a":"div";
    return `<${tag} class="rec reveal" ${r.url?`href="${esc(r.url)}" target="_blank" rel="noopener"`:""}><div class="ic">${I[r.type]||"📄"}</div><div><h3>${esc(r.title)}</h3><small>${esc(r.issuer)} · ${fmtDate(r.date)}${p?`<br>โครงการ: ${esc(p.title)}`:""}</small></div></${tag}>`;
  }).join("");
}
function renderContact(){
  const out=[];
  if(SITE.instagram) out.push(`<a href="https://instagram.com/${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram · @${esc(SITE.instagram)}</a>`);
  if(SITE.facebook) out.push(`<a href="${esc(SITE.facebook)}" target="_blank" rel="noopener">Facebook</a>`);
  if(SITE.email) out.push(`<a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>`);
  $("#contactLinks").innerHTML = out.join("") || `<span style="opacity:.6">[ใส่ Instagram / อีเมล ในส่วน SITE]</span>`;
}

/* ---------- modals (sync with ?project= / ?member=) ---------- */
const modal=$("#modal"), sheet=$("#sheet");
const closeBtn = `<button class="close" data-close aria-label="ปิด"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`;
function showProject(slug){
  const p=projectBy(slug); if(!p) return false; const c=catOf(p);
  const imgs = p.images?.length ? p.images.map(s=>`<img src="${esc(s)}" alt="" loading="lazy" data-lb>`).join("")
    : Array.from({length:4},(_,i)=>`<div class="ph">รูปที่ ${i+1}</div>`).join("");
  sheet.innerHTML = `${closeBtn}${cover(p,"cover")}</div><div class="in">
    <div class="loc">${pinSvg}${esc(p.location)}, ${esc(p.province)}</div>
    <h2>${esc(p.title)}</h2>
    ${p.titleEn?`<div class="en-title">${esc(p.titleEn)}</div>`:""}
    ${p.tagline?`<p class="tagline">${esc(p.tagline)}</p>`:""}
    <dl class="facts">
      <div><dt>วันที่</dt><dd>${fmtRange(p)}</dd></div>
      <div><dt>หมวด</dt><dd>${c.icon} ${esc(c.label)}</dd></div>
      <div><dt>หน่วยงาน</dt><dd>${esc(p.org)}</dd></div>
      ${p.hours?`<div><dt>ชั่วโมงจิตอาสา</dt><dd>${nf(p.hours)} ชั่วโมง</dd></div>`:""}
      ${p.partners?.length?`<div class="full"><dt>ร่วมกับ</dt><dd>${p.partners.map(esc).join(" · ")}</dd></div>`:""}
    </dl>
    <div class="big">
      ${p.highlight?`<div><b>${esc(p.highlight.value)}</b><span>${esc(p.highlight.label)}</span></div>`:""}
      ${p.beneficiaries?`<div><b>${nf(p.beneficiaries)}</b><span>ผู้ได้รับประโยชน์</span></div>`:""}
      ${p.members?.length?`<div><b>${p.members.length}</b><span>สมาชิกที่ร่วม</span></div>`:""}
    </div>
    ${p.problem?`<h4>ปัญหาที่พบ</h4><p>${esc(p.problem)}</p>`:""}
    ${p.did?`<h4>สิ่งที่เราทำ</h4><p>${esc(p.did)}</p>`:""}
    ${p.activities?.length?`<h4>กิจกรรมที่ได้ร่วมกันทำ</h4><div class="acts">${p.activities.map(a=>`<div class="act">${a.img?`<img src="${esc(a.img)}" alt="${esc(a.th)}" loading="lazy" data-lb>`:a.icon?`<div class="act-ic" aria-hidden="true">${a.icon}</div>`:""}<div class="act-b"><span class="no">${esc(a.no)}</span><div><b>${esc(a.th)}</b><small>${esc(a.en)}${a.brand?` · ${esc(a.brand)}`:""}</small></div></div></div>`).join("")}</div>`:""}
    ${p.before&&p.after?`<h4>Before / After</h4><div class="gal" style="grid-template-columns:1fr 1fr"><img src="${esc(p.before)}" alt="ก่อน" data-lb><img src="${esc(p.after)}" alt="หลัง" data-lb></div>`:""}
    <h4>Gallery</h4><div class="gal">${imgs}</div>
    ${p.members?.length?`<h4>ใครทำอะไร</h4><div class="roles">${p.members.map(x=>{const m=memberBy(x.slug); if(!m) return ""; return `<button data-member="${m.slug}"><span class="av" style="background:${colorFor(m.slug)}">${m.photo?`<img src="${esc(m.photo)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:initials(m.name)}</span><span><b>${esc(m.name)}</b> — ${esc(x.role)}</span></button>`}).join("")}</div>`:""}
    ${p.reflection?`<h4>สิ่งที่เราได้เรียนรู้</h4><div class="quote">${esc(p.reflection)}</div>`:""}
  </div>`;
  return true;
}
function showMember(slug){
  const m=memberBy(slug); if(!m) return false;
  const ps=projectsOf(slug); const h=hoursOf(slug);
  const link = location.href.split(/[?#]/)[0]+"?member="+slug;
  sheet.innerHTML = `${closeBtn}<div class="mhead"><div class="ph" style="background:${colorFor(slug)}">${m.photo?`<img src="${esc(m.photo)}" alt="">`:initials(m.name)}</div>
    <div><div class="sig">${esc(m.name)}</div><div style="font-weight:600">${esc(m.role||"Member")}</div>${m.fullName?`<div style="color:var(--ink-2)">${esc(m.fullName)}${m.grade?" · "+esc(m.grade):""}</div>`:""}</div></div>
    <div class="in">
      ${m.duties?.length?`<h4>หน้าที่</h4><ul style="padding-left:20px;color:var(--ink-2)">${m.duties.map(d=>`<li>${esc(d)}</li>`).join("")}</ul>`:""}
      <div class="big"><div><b>${ps.length}</b><span>โครงการที่ร่วม</span></div>${h?`<div><b>${nf(h)}</b><span>ชั่วโมงจิตอาสา</span></div>`:""}</div>
      <h4>โครงการและบทบาท</h4>
      ${ps.length?`<ul class="plist">${ps.map(p=>`<li data-open="${p.slug}"><span><b>${esc(p.title)}</b><br><small>${esc(p.members.find(x=>x.slug===slug).role)}</small></span><small>${fmtDate(p.start)}</small></li>`).join("")}</ul>`:`<p>ยังไม่มีโครงการที่บันทึกไว้</p>`}
      ${m.quote?`<h4>แรงบันดาลใจ</h4><div class="quote">${esc(m.quote)}</div>`:""}
      <div class="copylink"><button class="btn btn-primary" data-copy="${esc(link)}">🔗 คัดลอกลิงก์ส่วนตัว</button><button class="btn btn-ghost" data-highlight="${slug}">ไฮไลต์ผลงานในหน้า</button></div>
    </div>`;
  return true;
}
function syncFromURL(){
  const q=new URLSearchParams(location.search);
  const ok = q.get("project") ? showProject(q.get("project")) : q.get("member") ? showMember(q.get("member")) : false;
  modal.classList.toggle("open", ok); document.body.style.overflow = ok ? "hidden" : "";
  if(ok) modal.scrollTop=0;
  renderProjects(q.get("member") || null);
}
function go(key,val){
  const u=new URL(location.href); u.searchParams.delete("project"); u.searchParams.delete("member");
  if(key) u.searchParams.set(key,val);
  try{ history.pushState({}, "", u); }catch(e){}
  syncFromURL();
}

/* ---------- events ---------- */
document.addEventListener("click", e=>{
  const t=e.target.closest("[data-open],[data-member],[data-close],[data-cat],[data-copy],[data-highlight],[data-lb]");
  if(!t){ if(e.target===modal) go(); return; }
  if(t.dataset.open) go("project",t.dataset.open);
  else if(t.dataset.member) go("member",t.dataset.member);
  else if("close" in t.dataset) go();
  else if(t.dataset.cat){ activeCat=t.dataset.cat; renderFilters(); renderProjects(new URLSearchParams(location.search).get("member")); }
  else if(t.dataset.copy){ navigator.clipboard?.writeText(t.dataset.copy).then(()=>{t.textContent="✓ คัดลอกแล้ว"}).catch(()=>prompt("คัดลอกลิงก์นี้:",t.dataset.copy)); }
  else if(t.dataset.highlight){ modal.classList.remove("open"); document.body.style.overflow=""; document.getElementById("projects").scrollIntoView(); }
  else if("lb" in t.dataset){ $("#lbImg").src=t.src; $("#lb").classList.add("open"); }
});
document.addEventListener("keydown", e=>{
  if(e.key==="Escape"){ if($("#lb").classList.contains("open")) $("#lb").classList.remove("open"); else if(modal.classList.contains("open")) go(); }
  if(e.key==="Enter" && e.target.matches(".pin")) e.target.click();
});
$("#lb").addEventListener("click",()=>$("#lb").classList.remove("open"));
window.addEventListener("popstate", syncFromURL);
$("#burger").addEventListener("click",()=>$("#menu").classList.toggle("open"));
$("#menu").addEventListener("click",e=>{ if(e.target.tagName==="A") $("#menu").classList.remove("open"); });
$("#printBtn").addEventListener("click",e=>{e.preventDefault();window.print();});

/* ---------- init ---------- */
const LOGO=$("#logoSrc").src; document.querySelectorAll("[data-logo]").forEach(i=>i.src=LOGO); $("#favicon").href=LOGO;
if(!SHOW_SAMPLE_NOTICE) $("#notice").remove();
$("#yr").textContent = new Date().getFullYear();

(async () => {
  /* โหลดข้อมูลจาก Supabase ถ้าโหลดไม่ได้จะใช้ข้อมูลสำรองใน data.js */
  try { await loadFromSupabase(); }
  catch(err){ console.warn("Supabase ไม่พร้อม ใช้ข้อมูลสำรองจาก data.js", err); }

  renderStats(); renderRegions(); renderFilters(); renderTeam(); renderRecs(); renderContact(); syncFromURL();

  const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target);} }),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  const so = new IntersectionObserver(es=>{ if(es[0].isIntersecting){ countUp(); so.disconnect(); } },{threshold:.4});
  so.observe($("#impact"));
})();
