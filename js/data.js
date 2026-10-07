/* =====================================================================
   DATA สำรอง (fallback)
   - ข้อมูลจริงอยู่ใน Supabase แก้ผ่าน Supabase Studio > Table Editor
   - ไฟล์นี้ใช้เฉพาะตอนโหลด Supabase ไม่ได้ (เช่น ออฟไลน์) และอาจไม่ตรงกับข้อมูลล่าสุด
   - รูปภาพ: ใส่ path ไฟล์ (เช่น "images/p1-1.jpg") หรือ URL ใน cover / images / photo
   ===================================================================== */
const SHOW_SAMPLE_NOTICE = false;

let SITE = {
  instagram: "",          // เช่น "ochit.team"
  email: "",              // อีเมลกลางของทีม
  facebook: ""            // ลิงก์เพจ (ถ้ามี)
};

let CATEGORIES = {
  education:   { label:"การศึกษา",      icon:"📚", color:"#1DABB3" },
  environment: { label:"สิ่งแวดล้อม",    icon:"🌱", color:"#6DD35A" },
  disaster:    { label:"ช่วยภัยพิบัติ",   icon:"🆘", color:"#F28C6B" },
  elderly:     { label:"ผู้สูงอายุ",      icon:"👵", color:"#F4AAB4" },
  community:   { label:"ชุมชน",         icon:"🏘️", color:"#3BB37C" },
  career:      { label:"สร้างอาชีพ",     icon:"🌿", color:"#3BB37C" },
  school:      { label:"พัฒนาโรงเรียน",  icon:"🎨", color:"#1DABB3" }
};

/* region: north | northeast | central | south (ใช้จัดกลุ่มใน Impact Map)
   ฟิลด์ที่เว้นว่างได้ (จะไม่แสดงบนเว็บ): problem, reflection, hours, beneficiaries, members */
let PROJECTS = [
  {
    slug:"community-career",
    title:"อาสาแบ่งปัน สร้างสรรค์อาชีพ",
    titleEn:"Volunteering for Community Career Development",
    tagline:"จากธรรมชาติ…สู่อนาคตที่ยั่งยืน · Pure Nature, Better Future",
    category:"career", start:"2026-06-27",
    location:"โรงเรียนบ้านวังกระแจะ ต.วังกระแจะ อ.ไทรโยค", province:"กาญจนบุรี", region:"central",
    org:"โรงเรียนบ้านวังกระแจะ",
    partners:["The Wastebusters","Brentwood College School","โรงเรียนสาธิตมหาวิทยาลัยศรีนครินทรวิโรฒ ปทุมวัน","RIS","St Andrews International School Bangkok"],
    summary:"เวิร์กช็อปสอนน้อง ๆ ทำผลิตภัณฑ์จากสารสกัดธรรมชาติ 4 ชนิด เพื่อต่อยอดเป็นอาชีพในชุมชน",
    problem:"",
    did:"ทีมทดลองพัฒนาสูตรผลิตภัณฑ์จากวัตถุดิบธรรมชาติใกล้ตัว ได้แก่ เปลือกส้มโอ ใบมะยงชิด ใบกัญชาแมว ใบมะม่วง และสาหร่ายทะเลคาเวียร์ แล้วนำไปจัดเวิร์กช็อปที่โรงเรียนบ้านวังกระแจะ ให้นักเรียนได้ลงมือผสมและบรรจุผลิตภัณฑ์ด้วยตัวเองทีละขั้นตอน เพื่อเป็นทักษะที่นำไปต่อยอดเป็นอาชีพได้",
    activities:[
      {no:"01", th:"แชมพูสารสกัดเปลือกส้มโอและใบมะยงชิด", en:"Pomelo Peel & Mayongchit Leaf Shampoo", brand:"OChid", img:"images/projects/community-career/act-01.webp"},
      {no:"02", th:"สเปรย์กันยุงสารสกัดใบกัญชาแมว",       en:"Catnip Mosquito Repellent Spray",       brand:"NEPPY", img:"images/projects/community-career/act-02.webp"},
      {no:"03", th:"ยาหม่องสมานแผลสารสกัดใบมะม่วง",        en:"Mangiferin Soothing Balm",              brand:"MangiBalm", img:"images/projects/community-career/act-03.webp"},
      {no:"04", th:"สบู่เหลวสารสกัดสาหร่ายทะเลคาเวียร์",     en:"Green Caviar Extracts Liquid Soap",     brand:"CAVI CARE", img:"images/projects/community-career/act-04.webp"}
    ],
    hours:0, beneficiaries:0,
    highlight:{ value:"4", label:"ผลิตภัณฑ์จากธรรมชาติที่สอนทำ" },
    cover:"images/projects/community-career/cover.webp",
    images:["images/projects/community-career/01.webp","images/projects/community-career/02.webp","images/projects/community-career/03.webp","images/projects/community-career/04.webp","images/projects/community-career/05.webp","images/projects/community-career/06.webp","images/projects/community-career/07.webp","images/projects/community-career/08.webp"],
    members:[],
    reflection:""
  },
  {
    slug:"paint-for-kids",
    title:"Volunteer to Paint, Do Good for Kids",
    titleEn:"Ochit × Home Paint Outlet",
    tagline:"ปรับภูมิทัศน์โรงเรียน และบริจาคอุปกรณ์กีฬา อุปกรณ์การเรียน และอุปกรณ์ทำความสะอาด",
    category:"school", start:"2026-08-15",
    location:"โรงเรียนวัดท้ายเกาะ", province:"ปทุมธานี", region:"central",
    org:"โรงเรียนวัดท้ายเกาะ",
    partners:["โฮมเพ้นท์ เอาท์เล็ท ศูนย์สีราคาขายส่ง (Home Paint Outlet)"],
    summary:"ทีม Ochit ร่วมกับโฮมเพ้นท์ เอาท์เล็ท ทาสีลานกีฬาและเสาอาคารเรียนใหม่ พร้อมบริจาคอุปกรณ์ให้โรงเรียน",
    problem:"",
    did:"ทีม Ochit ร่วมกับโฮมเพ้นท์ เอาท์เล็ท ลงพื้นที่โรงเรียนวัดท้ายเกาะ ขูดลอกสีเก่าและทาสีเสาใต้ถุนอาคารเรียน ทาสีลานกีฬาอเนกประสงค์ใหม่ทั้งลาน พร้อมบริจาคอุปกรณ์กีฬา อุปกรณ์การเรียน และอุปกรณ์ทำความสะอาดให้โรงเรียน",
    activities:[
      {no:"01", th:"ทาสีปรับภูมิทัศน์โรงเรียน", en:"School Painting", img:"images/projects/paint-for-kids/act-01.jpg"},
      {no:"02", th:"บริจาคอุปกรณ์กีฬา",        en:"Sport Equipments", img:"images/projects/paint-for-kids/act-02.jpg"},
      {no:"03", th:"บริจาคอุปกรณ์การเรียน",     en:"School Supply", img:"images/projects/paint-for-kids/act-03.jpg"},
      {no:"04", th:"บริจาคอุปกรณ์ทำความสะอาด", en:"Cleaning Supply", img:"images/projects/paint-for-kids/act-04.jpg"}
    ],
    hours:0, beneficiaries:0,
    highlight:{ value:"4", label:"ด้านที่ช่วยเหลือโรงเรียน" },
    cover:"images/projects/paint-for-kids/cover.jpg",
    images:["images/projects/paint-for-kids/01.webp","images/projects/paint-for-kids/02.webp","images/projects/paint-for-kids/03.webp","images/projects/paint-for-kids/04.webp","images/projects/paint-for-kids/05.webp","images/projects/paint-for-kids/06.webp","images/projects/paint-for-kids/07.webp","images/projects/paint-for-kids/08.webp","images/projects/paint-for-kids/09.webp","images/projects/paint-for-kids/10.webp","images/projects/paint-for-kids/11.webp"],
    members:[],
    reflection:""
  }
];

/* ⚠️ ชื่ออ่านจากลายมือ — กรุณายืนยันการสะกด / Fang สองคนแยก slug ไว้แล้ว */
let TEAM = [
  {slug:"bhu",    name:"Bhu",    tier:"cofounder", photo:"images/team/bhu.webp", role:"Co-founder & President",        duties:["วางทิศทางทีมและตัดสินใจภาพรวม","เป็นตัวแทนติดต่อหน่วยงาน"]},
  {slug:"piper",  name:"Piper",  tier:"cofounder", photo:"images/team/piper.webp", role:"Co-founder & Vice President",   duties:["ช่วยประธานและประสานงานภายในทีม","ดูแลตารางงาน"]},
  {slug:"wanda",  name:"Wanda",  tier:"cofounder", photo:"images/team/wanda.webp", role:"Co-founder & Advisor",          duties:["ให้คำปรึกษาการวางแผนโครงการ","ตรวจความเหมาะสมของกิจกรรม"]},
  {slug:"nippon", name:"Nippon", tier:"cofounder", photo:"images/team/nippon.webp", role:"Co-founder & Communications",   duties:["ประชาสัมพันธ์และดูแลโซเชียลมีเดีย","ถ่ายภาพและทำสื่อ"]},
  {slug:"prem",   name:"Prem",   tier:"cofounder", photo:"images/team/prem.webp", role:"Co-founder & Treasurer",        duties:["ดูแลงบประมาณและรายรับรายจ่าย","สรุปบัญชีโครงการ"]},
  {slug:"fong",   name:"Fong",   tier:"cofounder", photo:"images/team/fong.webp", role:"Co-founder & Educator",         duties:["ออกแบบเนื้อหาให้ความรู้","จัดกิจกรรมสอนหรือเวิร์กช็อป"]},
  {slug:"us",     name:"U.S.",   tier:"cofounder", photo:"images/team/us.webp", role:"Co-founder & Field Operations", duties:["วางแผนและควบคุมงานภาคสนาม","ดูแลการเดินทางและความปลอดภัย"]},
  {slug:"prom",   name:"Prom",   tier:"cofounder", photo:"images/team/prom.webp", role:"Co-founder & Supply",           duties:["จัดหาและรับบริจาค","จัดเก็บและกระจายสิ่งของ"]},
  {slug:"khaw-wan",name:"Khaw-wan",tier:"member", photo:"images/team/khaw-wan.jpg"},
  {slug:"krish",  name:"Krish",  tier:"member", photo:"images/team/krish.jpg"},
  {slug:"jj",     name:"J.J.",   tier:"member", photo:"images/team/jj.jpg"},
  {slug:"jeda",   name:"JEDA",   tier:"member", photo:"images/team/jeda.jpg"},
  {slug:"captain",name:"Captain",tier:"member", photo:"images/team/captain.jpg"},
  {slug:"cj",     name:"CJ",     tier:"member", photo:"images/team/cj.jpg"},
  {slug:"nine",   name:"Nine",   tier:"member", photo:"images/team/nine.jpg"},
  {slug:"hero",   name:"Hero",   tier:"member", photo:"images/team/hero.jpg"},
  {slug:"fang-m", name:"Fang",   tier:"member"},
  {slug:"hana",   name:"Hana",   tier:"member"},
  {slug:"prim",   name:"Prim",   tier:"member", photo:"images/team/prim.jpg"}
];
/* คนที่อยู่แถวบนสุดของ Co-founder */
let LEADERS = ["bhu","piper"];
/* ฟิลด์เพิ่มเติมของสมาชิก (ไม่บังคับ): photo, fullName, grade, quote */

let RECOGNITIONS = [
  /* {title:"หนังสือขอบคุณ", issuer:"ชื่อหน่วยงาน", date:"2026-07-01", type:"letter|certificate|news|award", project:"community-career", url:""} */
];
