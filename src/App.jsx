import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SB_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const SB_SERVICE = import.meta.env.VITE_SUPABASE_SERVICE_KEY || "";
const sb = SB_URL ? createClient(SB_URL, SB_ANON) : null;
const sbAdmin = SB_URL && SB_SERVICE ? createClient(SB_URL, SB_SERVICE) : null;

const T={bg:"#080808",card:"rgba(255,255,255,0.03)",cardH:"rgba(255,255,255,0.05)",b:"rgba(255,255,255,0.06)",acc:"#2563EB",accL:"#3B82F6",glow:"rgba(37,99,235,0.35)",sec:"#6B7280",ok:"#22C55E",ng:"#EF4444",go:"#F59E0B",pu:"#60A5FA",cy:"#22D3EE",tx:"#FFFFFF",txD:"#A1A1AA",stripe:"#2563EB",payRed:"#2563EB",payRedGlow:"rgba(37,99,235,0.45)"};

// Helper function for admin updates using direct REST API
const executeAdminUpdate = async (table, id, updates) => {
  if (!SB_URL) throw new Error("Supabase non configuré");
  const key = SB_SERVICE || SB_ANON;
  const body = { ...updates, updated_at: new Date().toISOString() };
  const response = await fetch(`${SB_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
  }
  return true;
};

const DAYS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const CONTACT="diamonds.saas@gmail.com";
const PRICE=149;
// Stripe: crée un Payment Link sur dashboard.stripe.com → remplace ci-dessous
const STRIPE_LINK="https://buy.stripe.com/3cIcN46cX8qZbkL2AE1wY07";

const css=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:Inter,sans-serif}
body{background:#0F0F0F;color:#fff;font-size:14px;min-height:100vh;-webkit-font-smoothing:antialiased}
@keyframes fup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp2{to{transform:rotate(360deg)}}
.fup{animation:fup .22s ease both}.fup1{animation:fup .22s .05s ease both}.fup2{animation:fup .22s .1s ease both}
/* NAV */
.nb{display:flex;align-items:center;gap:8px;padding:7px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:400;border:none;background:transparent;width:100%;color:#555;transition:color .1s,background .1s;text-align:left;font-family:inherit;letter-spacing:.01em}
.nb:hover{color:#fff;background:rgba(255,255,255,.05)}
.nb.on{color:#fff;font-weight:500;position:relative}
.nb.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:#2563EB;border-radius:0 2px 2px 0}
/* BUTTONS */
.btn{background:#2563EB;color:#fff;border:none;border-radius:8px;padding:12px 20px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;transition:background .15s,box-shadow .15s;position:relative;overflow:hidden}
.btn:hover{background:#1D4ED8;box-shadow:0 0 0 3px rgba(37,99,235,.25)}
.btn:active{transform:scale(.99)}
.btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}
.btng{background:transparent;color:#555;border:1px solid #222;border-radius:6px;padding:6px 12px;font-size:12px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-family:inherit;transition:all .12s}
.btng:hover{color:#fff;border-color:#333;background:#1a1a1a}
/* TAGS */
.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
/* TABLE ROWS */
.cr{display:grid;align-items:center;padding:10px 16px;border-bottom:1px solid #1a1a1a;transition:background .1s}
.cr:last-child{border-bottom:none}
.cr:hover{background:#151515}
/* RANGE */
input[type=range]{-webkit-appearance:none;width:100%;height:3px;border-radius:20px;background:#222;outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#2563EB;cursor:pointer}
/* INPUTS */
.inp{width:100%;padding:11px 14px;border-radius:8px;border:1px solid #222;background:#1a1a1a;color:#fff;font-size:14px;outline:none;font-family:inherit;transition:border .12s}
.inp:focus{border-color:#2563EB}
.inp::placeholder{color:#444}
select.inp option{background:#111;color:#fff}
/* CARDS */
.card{background:#151515;border-radius:12px;border:1px solid #1e1e1e}
.card:hover{border-color:#2a2a2a}
.glow{background:#151515;border-radius:12px;border:1px solid rgba(37,99,235,.3);box-shadow:0 0 20px rgba(37,99,235,.08)}
/* TOGGLE */
.tog{width:38px;height:20px;border-radius:10px;cursor:pointer;border:none;position:relative;flex-shrink:0;transition:background .2s}
.tog .kn{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:white;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.4)}
/* SC STAT CARDS */
.sc{background:#151515;border-radius:10px;border:1px solid #1e1e1e;padding:16px 18px}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:4px}
/* Mobile shell */
.app-scrim{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:25;backdrop-filter:blur(2px)}
.app-sidebar-m{transition:transform .22s ease}
@media (max-width:899px){
  .app-sidebar-m{transform:translateX(-100%)}
  .app-sidebar-m.open{transform:translateX(0);box-shadow:8px 0 40px rgba(0,0,0,.5)}
  .app-mob-bar{display:flex}
  .app-main-pad{padding:16px 14px calc(20px + env(safe-area-inset-bottom,0px))!important;margin-left:0!important}
  .admin-stat-grid{grid-template-columns:repeat(2,1fr)!important}
  .billing-card-actions{flex-direction:column!important;align-items:stretch!important}
  .billing-card-actions button{width:100%!important;justify-content:center!important}
}
@media (min-width:900px){
  .app-mob-bar{display:none}
  .members-layout{flex-direction:row!important;align-items:flex-start!important}
}
.pay-cta-saas{background:linear-gradient(180deg,#2563EB 0%,#1D4ED8 100%)!important;color:#fff!important;border:none!important;font-weight:800!important;letter-spacing:.02em;box-shadow:0 10px 40px rgba(37,99,235,.35),0 0 0 1px rgba(255,255,255,.08) inset}
.pay-cta-saas:hover{filter:brightness(1.12);box-shadow:0 12px 44px rgba(37,99,235,.45),0 0 0 1px rgba(255,255,255,.1) inset}
`;




/* ─── UTILS ─────────────────────────────── */
const calcPayout=(ag,c)=>{
  if(c&&c.disable_creator_payout) return {eligible:false,creator:0,agent:0,manager:0,director:0};
  const ok=(c.days_live||0)>=(ag?.min_days||20)&&(c.hours_live||0)>=(ag?.min_hours||40);
  if(!ok) return {eligible:false,creator:0,agent:0,manager:0,director:0};
  const b=(c.diamonds||0)*0.017;
  return {eligible:true,creator:Math.round(b*(ag?.pct_creator||55)/100),agent:Math.round(b*(ag?.pct_agent||10)/100),manager:Math.round(b*(ag?.pct_manager||5)/100),director:Math.round(b*(ag?.pct_director||3)/100)};
};
const billingOk=(ag)=>!ag||ag.is_offered||ag.billing_status==="actif";

/** Rôle affiché admin : agences mal enregistrées en "creator" (sans lien creators, ou 1er compte créé avec l'agence) */
const enrichProfilesForAdmin=(profiles,agencies,creatorsRows)=>{
  const linkedCreatorProfiles=new Set((creatorsRows||[]).map(c=>c.profile_id).filter(Boolean));
  // Trouver les owners d'agences par correspondance temporelle (2h window)
  const agencyOwnerIds=new Set();
  (agencies||[]).forEach(ag=>{
    const agT=new Date(ag.created_at).getTime();
    // Le profil créé en même temps que l'agence ET qui n'est pas un vrai créateur
    const candidates=(profiles||[]).filter(p=>{
      if(p.role==="admin") return false;
      const pT=new Date(p.created_at).getTime();
      return Math.abs(pT-agT)<1000*60*120 && !linkedCreatorProfiles.has(p.id);
    });
    // Prendre le plus proche temporellement
    if(candidates.length>0){
      candidates.sort((a,b)=>Math.abs(new Date(a.created_at)-agT)-Math.abs(new Date(b.created_at)-agT));
      agencyOwnerIds.add(candidates[0].id);
    }
  });
  return (profiles||[]).map(p=>{
    // Agency si: agency_id présent OU owner détecté par temps OU role déjà agency
    const isAgency=p.role!=="admin"&&(!!p.agency_id||agencyOwnerIds.has(p.id)||p.role==="agency");
    const displayRole=isAgency?"agency":p.role;
    return {...p,displayRole};
  });
};
const roleLabelFr=(r)=>({admin:"ADMIN",agency:"AGENCE",director:"DIRECTEUR",manager:"MANAGER",agent:"AGENT",creator:"CRÉATEUR"}[r]||String(r||"?").toUpperCase());

/* ─── SUPABASE ──────────────────────────── */
const getProfile=async(uid)=>{
  if(!sb) return null;
  const {data,error}=await sb.from("profiles").select("*").eq("id",uid).single();
  if(error||!data) return null;
  if(data.agency_id){const {data:ag}=await sb.from("agencies").select("*").eq("id",data.agency_id).single();data.agencies=ag||null;}
  // Si profile a un agency_id, c'est forcément une agence (fix role mal enregistré)
  if(data.agency_id && data.role !== "admin") {
    data.role = "agency";
  }
  return data;
};
const fetchTeam=async(agId,profileId,role)=>{
  if(!sb||!agId) return {creators:[],agents:[],managers:[],directors:[]};
  const [cr,ag,mg,dr]=await Promise.all([
    sb.from("creators").select("*").eq("agency_id",agId),
    sb.from("agents").select("*").eq("agency_id",agId),
    sb.from("managers").select("*").eq("agency_id",agId),
    sb.from("directors").select("*").eq("agency_id",agId),
  ]);
  let creators=cr.data||[];
  // If creator role, filter to only their own record
  if(role==="creator"&&profileId){
    creators=creators.filter(c=>c.profile_id===profileId);
    // If not linked yet, try to link by handle
    if(creators.length===0){
      const {data:prof}=await sb.from("profiles").select("tiktok_handle").eq("id",profileId).single();
      if(prof?.tiktok_handle){
        const handle=prof.tiktok_handle.replace("@","").toLowerCase();
        creators=(cr.data||[]).filter(c=>(c.pseudo||"").replace("@","").toLowerCase()===handle);
        // Auto-link
        if(creators.length>0) await sb.from("creators").update({profile_id:profileId}).eq("id",creators[0].id);
      }
    }
  }
  return {creators,agents:ag.data||[],managers:mg.data||[],directors:dr.data||[]};
};
const fetchAllAgencies=async()=>{if(!sb) return [];const {data}=await sb.from("agencies").select("*").order("created_at",{ascending:false});return data||[];};
const doCreateAgency=async(name,slug,color)=>{
  if(!sb) return {error:"Supabase non configuré"};
  const {data,error}=await sb.from("agencies").insert({name:name.trim(),slug:slug.trim().toUpperCase(),color:color||"#7F00FF",billing_status:"essai",is_offered:false,pct_director:3,pct_manager:5,pct_agent:10,pct_creator:55,min_days:20,min_hours:40,director_can_import:false,manager_can_import:false,accept_inter_agency:true}).select().single();
  if(error) return {error:error.message};
  return {data};
};
const genCode=async(agId,issuerId,issuerRole,targetRole)=>{
  if(!sb) return null;
  // Essaie via RPC
  const {data,error}=await sb.rpc("generate_invite_code",{p_agency_id:agId,p_issuer_id:issuerId,p_issuer_role:issuerRole,p_target_role:targetRole});
  if(!error&&data) return data;
  // Fallback: insertion directe sans passer par la fonction PL/pgSQL
  const slug=(await sb.from("agencies").select("slug").eq("id",agId).single())?.data?.slug||"AG";
  const code=(slug+"-"+targetRole+"-"+Math.random().toString(36).slice(-6)).toUpperCase();
  const {error:insErr}=await sb.from("invite_codes").insert({
    code,agency_id:agId,issuer_id:issuerId,target_role:targetRole,used:false,
    expires_at:new Date(Date.now()+30*24*3600*1000).toISOString()
  });
  return insErr?null:code;
};
const getMyCodes=async(issuerId)=>{if(!sb) return [];const {data}=await sb.from("invite_codes").select("*").eq("issuer_id",issuerId).eq("used",false).gt("expires_at",new Date().toISOString()).order("created_at",{ascending:false});return data||[];};
const getAgencyCodes=async(agId)=>{if(!sb) return [];const {data}=await sb.from("invite_codes").select("*").eq("agency_id",agId).eq("used",false).order("created_at",{ascending:false});return data||[];};
const fetchSchedule=async(profileId)=>{if(!sb) return [];const {data}=await sb.from("schedules").select("*").eq("creator_profile_id",profileId);return data||[];};
const saveScheduleSlot=async(slot)=>{
  if(!sb) return;
  if(slot.id){await sb.from("schedules").update({start_time:slot.start_time,end_time:slot.end_time,accept_inter_agency:slot.accept_inter_agency,notes:slot.notes}).eq("id",slot.id);}
  else{await sb.from("schedules").insert({creator_profile_id:slot.creator_profile_id,agency_id:slot.agency_id,day_of_week:slot.day_of_week,start_time:slot.start_time,end_time:slot.end_time,accept_inter_agency:slot.accept_inter_agency||false,notes:slot.notes||""});}
};
const deleteScheduleSlot=async(id)=>{if(sb) await sb.from("schedules").delete().eq("id",id);};
const fetchMatches=async(agId)=>{if(!sb) return [];const {data}=await sb.from("matches").select("*").or(`agency_a.eq.${agId},agency_b.eq.${agId}`).order("match_date",{ascending:true});return data||[];};
const fetchLiveEntries=async(profileId)=>{if(!sb) return [];const {data}=await sb.from("live_entries").select("*").eq("creator_profile_id",profileId).order("live_date",{ascending:false}).limit(30);return data||[];};
const addLiveEntry=async(entry)=>{if(!sb) return {error:"no sb"};const {data,error}=await sb.from("live_entries").insert(entry).select().single();return error?{error:error.message}:{data};};
const importBackstage=async(agId,importerId,rows)=>{if(!sb) return {error:"Supabase non configuré"};const {data,error}=await sb.rpc("import_backstage",{p_agency_id:agId,p_importer_id:importerId,p_data:rows});return error?{error:error.message}:data;};
const fetchAllProfiles=async()=>{if(!sb) return [];const {data}=await sb.from("profiles").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllCreators=async()=>{if(!sb) return [];const {data}=await sb.from("creators").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllAgents=async()=>{if(!sb) return [];const {data}=await sb.from("agents").select("*");return data||[];};
const fetchAllManagers=async()=>{if(!sb) return [];const {data}=await sb.from("managers").select("*");return data||[];};
const fetchAllDirectors=async()=>{if(!sb) return [];const {data}=await sb.from("directors").select("*");return data||[];};
const fetchAllMatches=async()=>{if(!sb) return [];const {data}=await sb.from("matches").select("*").order("match_date",{ascending:false});return data||[];};
const fetchAllSchedules=async()=>{if(!sb) return [];const {data}=await sb.from("schedules").select("*");return data||[];};
const fetchAllLiveEntries=async()=>{if(!sb) return [];const {data}=await sb.from("live_entries").select("*").order("live_date",{ascending:false}).limit(100);return data||[];};

/* ─── SHARED UI ─────────────────────────── */
const DiamondSVG=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 120 130" style={{overflow:"visible",display:"block"}}>
    <defs>
      {/* Palette bleu diamant */}
      <linearGradient id="dg0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFFFFF"/><stop offset="100%" stopColor="#DBEAFE"/></linearGradient>
      <linearGradient id="dg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#EFF6FF"/><stop offset="100%" stopColor="#93C5FD"/></linearGradient>
      <linearGradient id="dg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#BFDBFE"/><stop offset="100%" stopColor="#3B82F6"/></linearGradient>
      <linearGradient id="dg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#93C5FD"/><stop offset="100%" stopColor="#2563EB"/></linearGradient>
      <linearGradient id="dg4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#1D4ED8"/></linearGradient>
      <linearGradient id="dg5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#1E3A8A"/></linearGradient>
      <linearGradient id="dg6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2563EB"/><stop offset="100%" stopColor="#172554"/></linearGradient>
      <linearGradient id="dgW" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95"/><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/></linearGradient>
      <linearGradient id="dgGirdle" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#93C5FD"/><stop offset="30%" stopColor="#FFFFFF"/><stop offset="60%" stopColor="#BFDBFE"/><stop offset="100%" stopColor="#60A5FA"/>
      </linearGradient>
      <filter id="dfGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feColorMatrix in="b" values="0 0 0 0 0.14 0 0 0 0 0.39 0 0 0 0 0.92 0 0 0 0.65 0" result="colored"/>
        <feMerge><feMergeNode in="colored"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="dfSoft"><feGaussianBlur stdDeviation="1"/></filter>
    </defs>

    {/* ══ COURONNE ══ */}

    {/* Table — facette plate centrale (octogone) */}
    <polygon points="42,6 78,6 94,22 94,30 78,38 42,38 26,30 26,22"
      fill="url(#dg0)" stroke="rgba(191,219,254,0.8)" strokeWidth="0.7"/>

    {/* Facettes étoile (8 triangles depuis centre table vers bords table) */}
    <polygon points="60,22 42,6 60,6"   fill="url(#dg1)" opacity="0.85"/>
    <polygon points="60,22 78,6 60,6"   fill="url(#dg0)" opacity="0.6"/>
    <polygon points="60,22 94,22 78,6"  fill="url(#dg2)" opacity="0.8"/>
    <polygon points="60,22 94,30 94,22" fill="url(#dg3)" opacity="0.9"/>
    <polygon points="60,22 78,38 94,30" fill="url(#dg4)" opacity="0.85"/>
    <polygon points="60,22 60,38 78,38" fill="url(#dg3)" opacity="0.7"/>
    <polygon points="60,22 42,38 60,38" fill="url(#dg2)" opacity="0.8"/>
    <polygon points="60,22 26,30 42,38" fill="url(#dg3)" opacity="0.9"/>
    <polygon points="60,22 26,22 26,30" fill="url(#dg2)" opacity="0.75"/>
    <polygon points="60,22 42,6 26,22"  fill="url(#dg1)" opacity="0.7"/>

    {/* Facettes upper-girdle (couronne externe - 8 triangles vers girdle) */}
    <polygon points="42,6 26,22 10,28"  fill="url(#dg1)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.5"/>
    <polygon points="26,22 26,30 10,28" fill="url(#dg2)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.4"/>
    <polygon points="26,30 42,38 10,38" fill="url(#dg1)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.4"/>
    <polygon points="42,38 60,38 34,44" fill="url(#dg2)" stroke="rgba(96,165,250,0.3)" strokeWidth="0.4"/>
    <polygon points="60,38 78,38 86,44" fill="url(#dg3)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.4"/>
    <polygon points="78,38 94,30 110,38" fill="url(#dg3)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.4"/>
    <polygon points="94,30 94,22 110,28" fill="url(#dg4)" stroke="rgba(37,99,235,0.3)" strokeWidth="0.4"/>
    <polygon points="94,22 78,6 110,28" fill="url(#dg3)" stroke="rgba(59,130,246,0.4)" strokeWidth="0.5"/>
    <polygon points="42,6 10,28 26,22"  fill="url(#dg1)" stroke="rgba(147,197,253,0.4)" strokeWidth="0.4"/>

    {/* ══ GIRDLE — ligne lumineuse ══ */}
    <path d="M10,28 L34,44 L60,48 L86,44 L110,28 L110,38 L86,50 L60,54 L34,50 L10,38 Z"
      fill="none" stroke="url(#dgGirdle)" strokeWidth="1.4"/>
    <path d="M10,33 L34,47 L60,51 L86,47 L110,33"
      fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6"/>

    {/* ══ PAVILION ══ */}

    {/* Facettes main pavilion (8 grandes facettes vers culet) */}
    <polygon points="10,38 34,50 60,118"  fill="url(#dg2)" stroke="rgba(37,99,235,0.35)" strokeWidth="0.5"/>
    <polygon points="34,50 34,64 60,118"  fill="url(#dg3)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.4"/>
    <polygon points="34,64 60,54 60,118"  fill="url(#dg2)" stroke="rgba(96,165,250,0.3)" strokeWidth="0.4"/>
    <polygon points="60,54 86,64 60,118"  fill="url(#dg3)" stroke="rgba(147,197,253,0.3)" strokeWidth="0.4"/>
    <polygon points="86,64 86,50 60,118"  fill="url(#dg4)" stroke="rgba(59,130,246,0.3)" strokeWidth="0.4"/>
    <polygon points="86,50 110,38 60,118" fill="url(#dg5)" stroke="rgba(37,99,235,0.35)" strokeWidth="0.5"/>
    <polygon points="10,28 10,38 34,50 34,44" fill="url(#dg2)" stroke="rgba(96,165,250,0.3)" strokeWidth="0.4"/>
    <polygon points="110,28 110,38 86,50 86,44" fill="url(#dg5)" stroke="rgba(29,78,216,0.3)" strokeWidth="0.4"/>

    {/* Facettes lower-girdle pavilion */}
    <polygon points="10,38 34,44 34,50"  fill="url(#dg2)" stroke="rgba(96,165,250,0.25)" strokeWidth="0.3"/>
    <polygon points="34,44 60,48 34,50"  fill="url(#dg3)" stroke="rgba(96,165,250,0.25)" strokeWidth="0.3"/>
    <polygon points="60,48 86,44 86,50 60,54 34,50 60,48" fill="url(#dg3)" stroke="rgba(96,165,250,0.2)" strokeWidth="0.3"/>
    <polygon points="86,44 110,38 86,50" fill="url(#dg4)" stroke="rgba(59,130,246,0.25)" strokeWidth="0.3"/>

    {/* Lignes structurelles pavilion */}
    <line x1="10" y1="38" x2="60" y2="118" stroke="rgba(147,197,253,0.6)" strokeWidth="0.7"/>
    <line x1="34" y1="50" x2="60" y2="118" stroke="rgba(147,197,253,0.5)" strokeWidth="0.5"/>
    <line x1="34" y1="64" x2="60" y2="118" stroke="rgba(147,197,253,0.4)" strokeWidth="0.4"/>
    <line x1="60" y1="54" x2="60" y2="118" stroke="rgba(191,219,254,0.5)" strokeWidth="0.5"/>
    <line x1="86" y1="64" x2="60" y2="118" stroke="rgba(96,165,250,0.4)" strokeWidth="0.4"/>
    <line x1="86" y1="50" x2="60" y2="118" stroke="rgba(96,165,250,0.5)" strokeWidth="0.5"/>
    <line x1="110" y1="38" x2="60" y2="118" stroke="rgba(59,130,246,0.6)" strokeWidth="0.7"/>

    {/* ══ REFLETS ET ÉCLATS ══ */}

    {/* Reflet principal blanc sur table */}
    <polygon points="44,7 66,7 76,18 60,22 44,18 36,14" fill="url(#dgW)" opacity="0.9"/>

    {/* Éclat vif coin gauche */}
    <polygon points="28,23 38,17 42,24 32,28" fill="white" opacity="0.7"/>

    {/* Éclat secondaire droite */}
    <polygon points="80,10 88,16 84,21 77,16" fill="white" opacity="0.45"/>

    {/* Reflet bleu clair pavilion gauche */}
    <polygon points="12,40 28,48 20,72" fill="rgba(219,234,254,0.25)"/>

    {/* Reflet pavilion droit */}
    <polygon points="108,40 92,48 100,72" fill="rgba(147,197,253,0.2)"/>

    {/* Culet - point de lumière à la pointe */}
    <circle cx="60" cy="118" r="2.5" fill="rgba(147,197,253,0.9)" filter="url(#dfSoft)"/>
    <circle cx="60" cy="118" r="1" fill="white" opacity="0.95"/>

    {/* ══ CONTOUR GLOBAL avec glow bleu ══ */}
    <polygon
      points="42,6 78,6 94,22 110,28 110,38 86,50 60,54 34,50 10,38 10,28 26,22"
      fill="none" stroke="rgba(96,165,250,0.9)" strokeWidth="0.9"
      filter="url(#dfGlow)"/>
  </svg>
);

const Spk=()=>null;
const Brand=({big=false})=>(
  <div style={{display:"flex",alignItems:"center",gap:big?14:8}}>
    <div style={{position:"relative",width:big?60:28,height:big?60:28,flexShrink:0}}>
      <DiamondSVG size={big?60:28}/>
      {big&&<><Spk x={-7} y={-5} d={0}/><Spk x={57} y={-3} d={.4}/><Spk x={-4} y={52} d={.7}/><Spk x={58} y={50} d={.2}/></>}
    </div>
    <div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:big?32:14,color:T.tx,letterSpacing:"-0.025em",lineHeight:1}}><span style={{background:"linear-gradient(135deg,#DBEAFE,#60A5FA,#3B82F6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Diamond's</span></div>
      <div style={{fontSize:big?10:8.5,color:T.sec,fontWeight:500,marginTop:1,letterSpacing:".06em"}}>by Belive Academy</div>
    </div>
  </div>
);
const AV=({name="?",color=T.acc,size=30})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}28,${color}15)`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:700,fontSize:size*.36,flexShrink:0}}>
    {String(name).slice(0,2).toUpperCase()}
  </div>
);
const SC=({label,val,sub,accent})=>(
  <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:14,position:"relative",overflow:"hidden"}}>
    {accent&&<div style={{position:"absolute",top:0,right:0,width:70,height:70,background:`radial-gradient(${accent}18,transparent 70%)`,borderRadius:"0 12px 0 100%"}}/>}
    <div style={{fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{label}</div>
    <div style={{fontSize:accent?24:18,fontWeight:800,color:accent||T.tx,marginBottom:4}}>{val}</div>
    {sub&&<div style={{fontSize:11,color:T.sec}}>{sub}</div>}
  </div>
);
const Spin=()=><div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid white",animation:"sp2 .7s linear infinite"}}/>;
const Tog=({on,onChange,color=T.acc})=>(
  <button className="tog" style={{background:on?color:"rgba(255,255,255,.1)"}} onClick={()=>onChange(!on)}>
    <div className="kn" style={{left:on?"21px":"3px"}}/>
  </button>
);
const billingTag=(s,isOffered)=>{
  if(isOffered) return <span className="tag" style={{background:"rgba(37,99,235,0.15)",color:"#60A5FA",border:"1px solid rgba(37,99,235,0.25)"}}>♥ Offert</span>;
  const m={actif:{bg:"rgba(34,197,94,0.1)",c:"#22C55E",l:"Abonné"},impayé:{bg:"rgba(239,68,68,0.1)",c:"#EF4444",l:"Impayé"},essai:{bg:"rgba(239,68,68,0.1)",c:"#EF4444",l:"Non abonné"}};
  const v=m[s]||m.essai;
  return <span className="tag" style={{background:v.bg,color:v.c}}>{v.l}</span>;
};

/* ─── NAV ───────────────────────────────── */
const NAVS={
  admin:   [{id:"dash",l:"Vue globale"},{id:"agencies",l:"Agences"},{id:"billing",l:"Facturation"},{id:"invite_agencies",l:"Inviter agences"},{id:"members",l:"👥 Membres"},{id:"all_users",l:"Utilisateurs"},{id:"all_creators",l:"Créateurs"},{id:"all_staff",l:"Staff"},{id:"all_matches",l:"Matchs"},{id:"all_schedules",l:"Plannings"},{id:"all_lives",l:"Lives"},{id:"poster_templates",l:"Templates affiches"},{id:"coach",l:"Coach IA 🤖"}],
  agency:  [{id:"dash",l:"Dashboard"},{id:"team",l:"Mon équipe"},{id:"creators",l:"Créateurs"},{id:"import",l:"Import Backstage"},{id:"links",l:"Codes d'invitation"},{id:"matches",l:"Matchs"},{id:"settings",l:"Paramètres"},{id:"coach",l:"Coach IA 🤖"}],
  director:[{id:"dash",l:"Mon pôle"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"},{id:"settings",l:"Paramètres"}],
  manager: [{id:"dash",l:"Mon groupe"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"},{id:"settings",l:"Paramètres"}],
  agent:   [{id:"dash",l:"Dashboard"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mon code"},{id:"settings",l:"Paramètres"}],
  creator: [{id:"dash",l:"Mon espace"},{id:"planning",l:"Mon planning"},{id:"my_lives",l:"Mes lives"},{id:"matches",l:"Mes matchs"},{id:"coach",l:"Coach IA 🤖"},{id:"settings",l:"Mon profil"}],
};

/* ─── AUTH ──────────────────────────────── */
function useAuth(){
  const [user,setUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [loading,setLoading]=useState(true);
  const load=async(uid)=>{try{const p=await getProfile(uid);setProfile(p);}catch(e){console.error(e);}setLoading(false);};
  useEffect(()=>{
    if(!sb){setLoading(false);return;}
    sb.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);if(session?.user)load(session.user.id);else setLoading(false);});
    const {data:{subscription}}=sb.auth.onAuthStateChange((_,session)=>{setUser(session?.user??null);if(session?.user)load(session.user.id);else{setProfile(null);setLoading(false);}});
    return()=>subscription.unsubscribe();
  },[]);
  return{user,profile,loading,signIn:(e,p)=>sb?.auth.signInWithPassword({email:e,password:p}),signOut:()=>sb?.auth.signOut(),reload:()=>user&&load(user.id)};
}

/* ─── BLOCKED SCREEN ────────────────────── */
function BlockedScreen({agencyName}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,25,.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
      <div style={{textAlign:"center",maxWidth:420,padding:28}}>
        <div style={{fontSize:48,marginBottom:16}}>🔒</div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:8}}>Accès suspendu</h1>
        <p style={{fontSize:13.5,color:T.sec,marginBottom:20,lineHeight:1.7}}>
          L'abonnement de <strong style={{color:T.tx}}>{agencyName||"votre agence"}</strong> a expiré.<br/>
          Contactez votre administrateur pour régulariser.
        </p>
        <a href={`mailto:${CONTACT}`}><button className="btn" style={{fontSize:13,padding:"9px 20px"}}>Contacter Diamond's</button></a>
        <div style={{marginTop:12,fontSize:11.5,color:T.sec}}>{CONTACT}</div>
      </div>
    </div>
  );
}

/* ─── LOGIN ─────────────────────────────── */
function LoginPage(){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [code,setCode]=useState("");
  const [mode,setMode]=useState("login");
  const [step,setStep]=useState("auth"); // auth | payment | confirm
  const [err,setErr]=useState("");
  const [load,setLoad]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [forgotMode,setForgotMode]=useState(false);
  const [resetSent,setResetSent]=useState(false);

  const login=async()=>{
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    if(!email||!pw){setErr("Email et mot de passe requis");setLoad(false);return;}
    const {error}=await sb.auth.signInWithPassword({email,password:pw});
    if(error){
      const msg=error.message;
      if(msg.includes("Invalid login credentials")||msg.includes("invalid_credentials"))
        setErr("Email ou mot de passe incorrect");
      else if(msg.includes("Email not confirmed"))
        setErr("Compte non confirmé — contactez le support");
      else if(msg.includes("Too many requests"))
        setErr("Trop de tentatives, attendez quelques minutes");
      else setErr("Erreur de connexion : "+msg);
      setLoad(false);
    }
  };

  const checkCode=async()=>{
    if(!code.trim()){setErr("Code requis");return;}
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    const clean=code.trim().toUpperCase();
    const {data:cd,error}=await sb.from("invite_codes").select("*").eq("code",clean).single();
    if(error||!cd){setErr("Code invalide ou expiré");setLoad(false);return;}
    // Always register first — payment is optional (admin can offer access later)
    await doRegister(clean);
  };

  const doRegister=async(cleanCode)=>{
    setLoad(true);
    const {data,error}=await sb.auth.signUp({email,password:pw});
    if(error){setErr(error.message);setLoad(false);return;}
    const userId=data.user?.id;
    if(!userId){setErr("Erreur création compte");setLoad(false);return;}
    const isAgency=cleanCode.startsWith("AGENCE-");
    if(isAgency){
      // Create agency
      const agName="Mon Agence"; // L'agence configure son nom dans Paramètres
      const {data:ag,error:agErr}=await sb.from("agencies").insert({
        name:agName,
        slug:"AG"+Date.now().toString(36).toUpperCase().slice(-6),
        billing_status:"essai",is_offered:false,
        pct_director:3,pct_manager:5,pct_agent:10,pct_creator:55,
        min_days:20,min_hours:40,accept_inter_agency:true,
        director_can_import:false,manager_can_import:false,
        can_agent_delete_creator:false,can_manager_delete_agent:false,can_director_delete_all:true
      }).select().single();
      if(agErr){setErr("Erreur création agence: "+agErr.message);setLoad(false);return;}
      if(ag?.id){
        const {error:rpcErr}=await sb.rpc("set_agency_role",{p_user_id:userId,p_agency_id:ag.id});
        if(rpcErr){
          const {error:upErr}=await sb.from("profiles").update({role:"agency",agency_id:ag.id}).eq("id",userId);
          if(upErr){setErr("Erreur rôle agence: "+(rpcErr.message||upErr.message));setLoad(false);return;}
        }
      }
      const {error:invErr}=await sb.from("invite_codes").update({used:true}).eq("code",cleanCode);
      if(invErr) await sb.from("invite_codes").update({uses:1}).eq("code",cleanCode);
    } else {
      // For non-agency: upsert profile first then use code
      await sb.from("profiles").upsert({id:userId,email:email},{onConflict:"id"});
      const {error:cErr}=await sb.rpc("use_invite_code",{p_code:cleanCode,p_user_id:userId});
      if(cErr){
        // Fallback: marquer manuellement comme utilisé
        await sb.from("invite_codes").update({used:true,used_by:userId}).eq("code",cleanCode);
      }
    }
    setStep("confirm");setLoad(false);
  };

  const goStripe=()=>{
    const ref=(code||"").trim().toUpperCase();
    const url=`${STRIPE_LINK}?prefilled_email=${encodeURIComponent(email)}${ref?`&client_reference_id=${encodeURIComponent(ref)}`:""}`;
    window.location.href=url;
  };

  // Payment success check (Stripe redirects back with ?payment=success&code=XXXX)
  const params=new URLSearchParams(window.location.search);
  if(params.get("payment")==="success"&&params.get("code")&&step==="auth"){
    const c=params.get("code");
    if(c&&email&&pw) doRegister(c);
  }

  if(step==="confirm") return(
    <div style={{minHeight:"100vh",background:"#0F0F0F",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:56,height:56,borderRadius:16,background:"rgba(37,99,235,.15)",border:"1px solid rgba(37,99,235,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:24,color:"#2563EB"}}>✓</div>
        <h2 style={{fontSize:24,fontWeight:700,marginBottom:8,letterSpacing:"-.02em"}}>Compte créé !</h2>
        <p style={{color:"#555",marginBottom:24,lineHeight:1.6}}>Ton compte est prêt. Connecte-toi maintenant.</p>
        <button className="btn" style={{margin:"0 auto"}} onClick={()=>{setStep("auth");setMode("login");}}>Se connecter →</button>
      </div>
    </div>
  );

  if(step==="payment") return(
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 18px calc(28px + env(safe-area-inset-bottom, 12px))",boxSizing:"border-box"}}>
      <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,.12), transparent 55%)",pointerEvents:"none"}}/>
      <div style={{width:"100%",maxWidth:440,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><Brand big={true}/></div>
          <p style={{fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"-.02em"}}>Active ton espace agence</p>
          <p style={{fontSize:13,color:"#888",marginTop:6}}>Un paiement sécurisé · Accès immédiat après validation</p>
        </div>
        <div style={{background:"#0A0A0A",borderRadius:20,border:"1px solid rgba(255,255,255,.08)",padding:"26px 22px",marginBottom:14,boxShadow:"0 0 0 1px rgba(255,0,51,.06), 0 24px 80px rgba(0,0,0,.55)"}}>
          <div style={{marginBottom:18}}>
            <span style={{background:`linear-gradient(90deg,${T.acc},${T.accL})`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:800,color:"#fff",letterSpacing:".12em"}}>ABONNEMENT MENSUEL</span>
          </div>
          <div style={{marginBottom:16}}>
            <span style={{fontSize:56,fontWeight:900,color:"#fff",letterSpacing:"-.04em"}}>{PRICE}</span>
            <span style={{fontSize:22,color:"#666",fontWeight:500,marginLeft:4}}>€<span style={{fontSize:13}}>/mois</span></span>
          </div>
          <p style={{fontSize:13,color:"#777",marginBottom:22,lineHeight:1.55}}>Sans engagement · Résiliable · Paiement Stripe (comme SaaS House)</p>
          {[
            "Gestion illimitée de créateurs",
            "Matchs TikTok Live & affiches",
            "Import Backstage automatisé",
            "Coach IA & reversements diamants",
            "Support prioritaire Diamond's"
          ].map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <div style={{width:22,height:22,borderRadius:"50%",background:`${T.payRed}18`,border:`1px solid ${T.payRed}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:T.payRed}}/>
              </div>
              <span style={{fontSize:14,color:"#ccc"}}>{f}</span>
            </div>
          ))}
          <div style={{marginTop:22}}>
            <label style={{fontSize:11,fontWeight:600,color:"#666",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Email de paiement</label>
            <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@email.com" style={{marginBottom:14,background:"#111",borderColor:"#2a2a2a"}}/>
            <button type="button" className="btn pay-cta-saas" style={{width:"100%",fontSize:16,padding:"16px",borderRadius:12}} onClick={goStripe}>
              🔒 Payer {PRICE}€/mois
            </button>
            <div style={{textAlign:"center",fontSize:11,color:"#444",marginTop:14,letterSpacing:".04em"}}>
              SÉCURISÉ PAR STRIPE · CHIFFREMENT 256-BIT
            </div>
          </div>
        </div>
        <button type="button" className="btng" onClick={()=>setStep("auth")} style={{fontSize:12}}>← Retour</button>
        {code?.trim()&&<p style={{fontSize:12,color:"#555",marginTop:10,lineHeight:1.5}}>Après paiement, finalise avec le code <strong style={{color:"#888",fontFamily:"monospace"}}>{code.trim().toUpperCase()}</strong></p>}
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#0F0F0F",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      {/* Ambient */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:600,height:400,background:"radial-gradient(ellipse,rgba(37,99,235,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Brand big={true}/></div>
          <p style={{fontSize:15,color:"#555"}}>La plateforme des agences TikTok Live</p>
        </div>

        <div style={{background:"#151515",borderRadius:16,border:"1px solid #222",padding:28,marginBottom:12}}>
          {/* Tabs */}
          <div style={{display:"flex",background:"#111",borderRadius:10,padding:3,marginBottom:24}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"10px",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",border:"none",background:mode===m?"#2563EB":"transparent",color:mode===m?"#fff":"#555",fontFamily:"inherit",transition:"all .15s"}}>
                {m==="login"?"Connexion":"Inscription"}
              </button>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Email</label>
              <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():checkCode())} placeholder="vous@email.com"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Mot de passe</label>
              <div style={{position:"relative"}}>
                <input className="inp" type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():checkCode())} placeholder="••••••••" style={{paddingRight:42}}/>
                <button onClick={()=>setShowPw(s=>!s)} type="button" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:16,padding:0,fontFamily:"inherit"}}>
                  {showPw?"🙈":"👁"}
                </button>
              </div>
            </div>
            {mode==="register"&&(
              <div>
                <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".08em"}}>Code d'invitation</label>
                <input className="inp" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="NOVA-AGENT-XXXXXX · ou AGENCE-XXXXXX" style={{fontFamily:"monospace",letterSpacing:".06em"}}/>
              </div>
            )}

            {err&&<div style={{padding:"10px 12px",borderRadius:8,background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.15)",fontSize:13,color:"#EF4444"}}>⚠ {err}</div>}

            {mode==="login"&&(
              <div style={{textAlign:"right",marginTop:-8}}>
                <a href="mailto:diamonds.saas@gmail.com?subject=Reset mot de passe&body=Mon email de compte : " style={{fontSize:12,color:"#555",textDecoration:"none"}}>Mot de passe oublié ? Contactez-nous →</a>
              </div>
            )}

            <button className="btn" style={{width:"100%",padding:"13px",fontSize:15}} onClick={mode==="login"?login:checkCode} disabled={load}>
              {load?<><Spin/>{mode==="login"?"Connexion…":"Vérification…"}</>:(mode==="login"?"Se connecter →":"Continuer →")}
            </button>
          </div>
        </div>

        {mode==="register"&&(
          <div style={{background:"rgba(37,99,235,.05)",borderRadius:12,border:"1px solid rgba(37,99,235,.12)",padding:16,marginBottom:12}}>
            <p style={{fontSize:11,fontWeight:700,color:"#2563EB",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>✦ Ce que vous obtenez</p>
            {["Espace agence complet","Gestion créateurs & staff","Matchs TikTok Live & affiches","Suivi diamants & reversements"].map((f,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:i<3?6:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:"rgba(37,99,235,.12)",border:"1px solid rgba(37,99,235,.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><div style={{width:5,height:5,borderRadius:"50%",background:"#2563EB"}}/></div>
                <span style={{fontSize:13,color:"#888"}}>{f}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{textAlign:"center"}}>
          <p style={{fontSize:12,color:"#333"}}>Problème ? <a href={`mailto:${CONTACT}`} style={{color:"#2563EB",textDecoration:"none"}}>Contacter Diamond's</a></p>
          <p style={{fontSize:11,color:"#2a2a2a",marginTop:6,letterSpacing:".05em"}}>🔒 SÉCURISÉ · DONNÉES CHIFFRÉES</p>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN DASH ────────────────────────── */
function AdminDash({setTab}){
  const [agencies,setAgencies]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchAllAgencies().then(d=>{setAgencies(d);setLoading(false);});},[]);
  const paying=agencies.filter(a=>a.billing_status==="actif"&&!a.is_offered);
  const mrr=paying.length*PRICE;
  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Super Admin · Belive Academy</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Vue globale</h1>
      </div>
      <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub={`${PRICE}€/agence · hors offerts`} accent={T.acc}/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection"/>
        <SC label="Agences actives" val={paying.length} sub="Payantes" accent={T.ok}/>
        <SC label="Offerts ♥" val={agencies.filter(a=>a.is_offered).length} sub="Hors MRR" accent={T.cy}/>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement…</div>:
      agencies.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          <div style={{fontSize:16,fontWeight:700,color:T.tx,marginBottom:8}}>Aucune agence</div>
          <button className="btn" onClick={()=>setTab("agencies")}>+ Créer une agence</button>
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Agences</div>
          {agencies.map(ag=>(
            <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 90px 80px"}}>
              <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{ag.name[0]}</div>
              <div><div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div><div style={{fontSize:11,color:T.sec}}>/{ag.slug}</div></div>
              {billingTag(ag.billing_status,ag.is_offered)}
              <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.is_offered?"Offert ♥":ag.billing_status==="actif"?`${PRICE}€`:"0€"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN AGENCY DASH ─────────────────── */
function AdminAgencyDash({ag}){
  const [team,setTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchTeam(ag.id).then(d=>{setTeam(d);setLoading(false);});},[ag.id]);
  if(loading) return <div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement…</div>;
  const {creators,agents,managers,directors}=team;
  const ok=creators.filter(c=>calcPayout(ag,c).eligible).length;
  const tot=creators.length;
  const pct=tot>0?Math.round(ok/tot*100):0;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="Directeurs" val={directors.length} accent={T.acc}/>
        <SC label="Managers" val={managers.length}/>
        <SC label="Agents" val={agents.length}/>
        <SC label="Créateurs" val={`${ok}/${tot}`} sub={`${tot-ok} bloqué`} accent={ok===tot&&tot>0?T.ok:"#FF6D00"}/>
      </div>
      <div className="glow" style={{padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:40,fontWeight:900,color:T.acc,lineHeight:1}}>{ok}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:13,fontWeight:700,color:T.sec}}>/ {tot} éligibles</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:26,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div></div>
        </div>
        {tot>0&&<div style={{height:6,borderRadius:20,overflow:"hidden",display:"flex",gap:2}}><div style={{flex:ok,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/><div style={{flex:tot-ok,background:"rgba(244,67,54,.28)",borderRadius:20}}/></div>}
      </div>
      {creators.length>0&&(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Créateurs</div>
          {creators.map(c=>{const p=calcPayout(ag,c);return(
            <div key={c.id} className="cr" style={{gridTemplateColumns:"30px 1fr 90px 55px 55px 80px"}}>
              <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.acc} size={26}/>
              <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo}</div>
              <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(c.diamonds||0).toLocaleString()}</div>
              <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
              <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
              <span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"éligible":"bloqué"}</span>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN AGENCIES ────────────────────── */
function AdminAgencies(){
  const [agencies,setAgencies]=useState([]);
  const [sel,setSel]=useState(null);
  const [viewDash,setViewDash]=useState(null);
  const [viewTeam,setViewTeam]=useState(null);
  const [agTeam,setAgTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [showForm,setShowForm]=useState(false);
  const [name,setName]=useState("");
  const [slug,setSlug]=useState("");
  const [color,setColor]=useState("#7F00FF");
  const [creating,setCreating]=useState(false);
  const [err,setErr]=useState("");
  const [codes,setCodes]=useState({});
  const [genning,setGenning]=useState(null);
  const [copied,setCopied]=useState(null);
  const [busy,setBusy]=useState(null);
  const BASE="https://agency.beliveacademy.com/join";
  const COLORS={director:T.acc,manager:T.pu,agent:T.cy,creator:T.ok};

  const load=()=>fetchAllAgencies().then(setAgencies);
  useEffect(()=>{load();},[]);
  const loadCodes=async(agId)=>{const data=await getAgencyCodes(agId);setCodes(c=>({...c,[agId]:data}));};

  const doCreate=async()=>{
    if(!name.trim()||!slug.trim()){setErr("Nom et slug obligatoires");return;}
    setCreating(true);setErr("");
    const res=await doCreateAgency(name,slug,color);
    if(res.error){setErr(res.error);setCreating(false);return;}
    await load();setName("");setSlug("");setColor("#7F00FF");setShowForm(false);setCreating(false);
  };
  const doGenCode=async(ag,targetRole)=>{
    const key=ag.id+"-"+targetRole;setGenning(key);
    const {data:{user}}=await sb.auth.getUser();
    await genCode(ag.id,user.id,"admin",targetRole);
    await loadCodes(ag.id);setGenning(null);
  };
  const updateBilling=async(id,field,value)=>{
    setBusy(`${id}-${field}`);
    try{
      let updates = {};
      
      if(field==="is_offered"&&value===true) {
        updates = { is_offered: true, billing_status: 'actif' };
      }
      else if(field==="is_offered"&&value===false) {
        updates = { is_offered: false, billing_status: 'impayé' };
      }
      else if(field==="billing_status") {
        updates = { billing_status: value };
      }
      else {
        updates = { [field]: value };
      }
      
      console.log('updateBilling appelé avec:', { id, field, value, updates });
      
      // Execute admin update
      const result = await executeAdminUpdate('agencies', id, updates);
      
      console.log('Resultat de updateBilling:', result);
      
      await load();
    }catch(e){
      console.error('Erreur dans updateBilling:', e);
      const errorMsg="Mise à jour impossible : "+(e.message||e)+"\n\nSolution : Vérifiez la console pour plus de détails.";
      window.alert(errorMsg);
    }finally{
      setBusy(null);
    }
  };
  const cp=(k)=>{setCopied(k);setTimeout(()=>setCopied(null),2000);};

  if(viewTeam) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>{setViewTeam(null);setAgTeam({creators:[],agents:[],managers:[],directors:[]});}}>← Retour</button>
        <h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>Équipe — {viewTeam.name}</h1>
        {billingTag(viewTeam.billing_status,viewTeam.is_offered)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="Directeurs" val={agTeam.directors.length} accent={T.acc}/>
        <SC label="Managers" val={agTeam.managers.length}/>
        <SC label="Agents" val={agTeam.agents.length}/>
        <SC label="Créateurs" val={agTeam.creators.length} accent={T.ok}/>
      </div>
      {agTeam.creators.length>0&&(
        <div className="card" style={{overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Créateurs</div>
          {agTeam.creators.map(c=>(
            <div key={c.id} className="cr" style={{gridTemplateColumns:"1fr 90px 55px 55px 80px"}}>
              <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo||"—"}</div>
              <div style={{fontWeight:700,color:T.pu,fontSize:12}}>💎 {(c.diamonds||0).toLocaleString()}</div>
              <div style={{fontSize:12,color:T.sec}}>{c.days_live||0}j</div>
              <div style={{fontSize:12,color:T.sec}}>{c.hours_live||0}h</div>
              <span className="tag" style={{background:calcPayout(viewTeam,c).eligible?`${T.ok}18`:`${T.ng}18`,color:calcPayout(viewTeam,c).eligible?T.ok:T.ng}}>{calcPayout(viewTeam,c).eligible?"éligible":"bloqué"}</span>
            </div>
          ))}
        </div>
      )}
      {agTeam.agents.length>0&&(
        <div className="card" style={{overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Agents</div>
          {agTeam.agents.map(a=><div key={a.id} className="cr" style={{gridTemplateColumns:"1fr 1fr"}}><div style={{fontSize:12.5,color:T.tx}}>{a.name||"—"}</div><div style={{fontSize:11,color:T.sec}}>{a.email}</div></div>)}
        </div>
      )}
      {agTeam.managers.length>0&&(
        <div className="card" style={{overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Managers</div>
          {agTeam.managers.map(m=><div key={m.id} className="cr" style={{gridTemplateColumns:"1fr 1fr"}}><div style={{fontSize:12.5,color:T.tx}}>{m.name||"—"}</div><div style={{fontSize:11,color:T.sec}}>{m.email}</div></div>)}
        </div>
      )}
      {agTeam.directors.length>0&&(
        <div className="card" style={{overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Directeurs</div>
          {agTeam.directors.map(d=><div key={d.id} className="cr" style={{gridTemplateColumns:"1fr 1fr"}}><div style={{fontSize:12.5,color:T.tx}}>{d.name||"—"}</div><div style={{fontSize:11,color:T.sec}}>{d.email}</div></div>)}
        </div>
      )}
    </div>
  );

  if(viewDash) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>setViewDash(null)}>← Retour</button>
        <h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>Dashboard — {viewDash.name}</h1>
        {billingTag(viewDash.billing_status,viewDash.is_offered)}
      </div>
      <AdminAgencyDash ag={viewDash}/>
    </div>
  );

  if(sel) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>setSel(null)}>← Retour</button>
        <div style={{width:38,height:38,borderRadius:10,background:(sel.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:sel.color||T.acc,fontWeight:800,fontSize:16}}>{sel.name[0]}</div>
        <div><h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>{sel.name}</h1><div style={{fontSize:11.5,color:T.sec}}>Slug: {sel.slug}</div></div>
      </div>
      <div className="card" style={{padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:4}}>Générer des codes d'invitation</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Chaque code est <strong style={{color:T.tx}}>unique</strong> — jamais identique pour 2 personnes.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["director","manager","agent","creator"].map(r=>{const key=sel.id+"-"+r;return(
            <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}} onClick={()=>doGenCode(sel,r)} disabled={genning===key}>
              {genning===key?<Spin/>:"+"} Code {r}
            </button>
          );})}
        </div>
      </div>
      <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Codes actifs non utilisés</div>
      {(codes[sel.id]||[]).length===0?(
        <div style={{textAlign:"center",padding:"24px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12,fontSize:12}}>Aucun code · Génère des codes ci-dessus</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {(codes[sel.id]||[]).map(code=>(
            <div key={code.id} className="card" style={{padding:14,border:`1px solid ${COLORS[code.target_role]||T.acc}25`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>Invitation {code.target_role}</div>
                  <div style={{fontSize:10.5,color:T.sec}}>Expire le {new Date(code.expires_at).toLocaleDateString("fr-FR")}</div></div>
                <span className="tag" style={{background:`${COLORS[code.target_role]||T.acc}18`,color:COLORS[code.target_role]||T.acc}}>{code.target_role}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"7px 11px",border:`1px solid ${COLORS[code.target_role]||T.acc}20`,marginBottom:7}}>
                <code style={{flex:1,fontSize:13.5,fontWeight:900,fontFamily:"monospace",letterSpacing:".1em",color:COLORS[code.target_role]||T.acc}}>{code.code}</code>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5,borderColor:`${COLORS[code.target_role]||T.acc}30`,color:COLORS[code.target_role]||T.acc}} onClick={()=>cp(code.code)}>
                  {copied===code.code?"✓ Copié":"Copier"}
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"6px 10px",border:`1px solid ${T.b}`}}>
                <code style={{flex:1,fontSize:10,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{BASE}?c={code.code}</code>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${code.id}`)}>{copied===`u-${code.id}`?"✓":"Copier"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Agences</h1>
        <button className="btn" style={{fontSize:12}} onClick={()=>setShowForm(!showForm)}>+ Nouvelle agence</button>
      </div>
      {showForm&&(
        <div className="glow" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Créer une agence</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Nom *</label>
              <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Nova TikTok"/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Slug * — les codes seront SLUG-ROLE-XXXXXX</label>
              <input className="inp" value={slug} onChange={e=>setSlug(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} placeholder="NOVA" style={{fontFamily:"monospace",letterSpacing:".08em"}}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Couleur</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:38,height:34,borderRadius:8,border:`1px solid ${T.b}`,background:"transparent",cursor:"pointer",padding:2}}/>
                <div style={{width:34,height:34,borderRadius:10,background:color+"18",border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:800,fontSize:14}}>{name?name[0]:"?"}</div>
              </div>
            </div>
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={doCreate} disabled={creating}>{creating?<><Spin/>Création…</>:"Créer"}</button>
              <button className="btng" onClick={()=>{setShowForm(false);setErr("");}}>Annuler</button>
            </div>
          </div>
        </div>
      )}
      {agencies.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:8}}>Aucune agence</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {agencies.map(ag=>(
            <div key={ag.id} className="card" style={{padding:16,border:`1px solid ${T.b}`,background:"linear-gradient(165deg,rgba(255,255,255,.035) 0%,rgba(255,255,255,.01) 100%)"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <div style={{width:48,height:48,borderRadius:14,background:(ag.color||T.acc)+"22",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:900,fontSize:18,flexShrink:0,border:`1px solid ${(ag.color||T.acc)}35`}}>{ag.name[0]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,fontSize:15,color:T.tx,marginBottom:6}}>{ag.name}</div>
                  <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8,marginBottom:6}}>
                    {billingTag(ag.billing_status,ag.is_offered)}
                    <span style={{fontSize:11.5,color:T.sec}}>Slug {ag.slug} · reversement créa {ag.pct_creator||55}%</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    <button type="button" className="btng" style={{fontSize:12,padding:"8px 12px"}} onClick={()=>{setSel(ag);loadCodes(ag.id);}}>Codes</button>
                    <button type="button" className="btng" style={{fontSize:12,padding:"8px 12px"}} onClick={()=>setViewDash(ag)}>Dashboard</button>
                    <button type="button" className="btng" style={{fontSize:12,padding:"8px 12px",color:T.ok,borderColor:`${T.ok}40`}} onClick={()=>{setViewTeam(ag);fetchTeam(ag.id).then(setAgTeam);}}>👥 Équipe</button>
                  </div>
                </div>
              </div>
              <div className="billing-card-actions" style={{display:"flex",flexDirection:"column",gap:10}}>
                {!ag.is_offered&&ag.billing_status!=="actif"&&(
                  <button type="button" className="btn" style={{fontSize:14,padding:"12px 16px",width:"100%",background:`linear-gradient(135deg,${T.ok},#00E676)`,fontWeight:700}} disabled={!!busy} onClick={()=>updateBilling(ag.id,"billing_status","actif")}>
                    ✓ Activer l’abonnement ({PRICE}€/mois)
                  </button>
                )}
                {!ag.is_offered&&(
                  <button type="button" disabled={!!busy} onClick={()=>updateBilling(ag.id,"is_offered",true)} style={{
                    fontSize:12,padding:"8px 12px",width:"100%",borderRadius:8,border:`1px solid ${T.payRed}55`,
                    background:`linear-gradient(180deg,rgba(37,99,235,.2),rgba(37,99,235,.08))`,color:"#FFF",cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                    boxShadow:`0 0 16px ${T.payRedGlow}`
                  }}>
                    ♥ Offrir gratuitement
                  </button>
                )}
                {ag.is_offered&&(
                  <button type="button" className="btng" style={{fontSize:13,padding:"10px",width:"100%",justifyContent:"center",color:T.ng,borderColor:`${T.ng}40`}} disabled={!!busy} onClick={()=>updateBilling(ag.id,"is_offered",false)}>
                    Retirer l’offre (repasse en impayé)
                  </button>
                )}
                {!ag.is_offered&&ag.billing_status==="actif"&&(
                  <button type="button" style={{fontSize:12,padding:"8px",width:"100%",borderRadius:8,border:`1px solid ${T.ng}35`,background:`${T.ng}12`,color:T.ng,cursor:"pointer",fontFamily:"inherit"}} disabled={!!busy} onClick={()=>updateBilling(ag.id,"billing_status","impayé")}>
                    Marquer comme impayé
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN BILLING ─────────────────────── */
function AdminBilling(){
  const [agencies,setAgencies]=useState([]);
  const [busy,setBusy]=useState(null);
  useEffect(()=>{fetchAllAgencies().then(setAgencies);},[]);
  const refresh=()=>fetchAllAgencies().then(setAgencies);
  const update=async(id,field,val)=>{
    const key=`${id}-${field}-${val}`;
    setBusy(key);
    try{
      let updates = {};
      
      if(field==="is_offered"&&val===true) {
        updates = { is_offered: true, billing_status: 'actif' };
      }
      else if(field==="is_offered"&&val===false) {
        updates = { is_offered: false, billing_status: 'impayé' };
      }
      else if(field==="billing_status") {
        updates = { billing_status: val };
      }
      else {
        updates = { [field]: val };
      }
      
      // Execute admin update via RPC
      const result = await executeAdminUpdate('agencies', id, updates);
      
      if (!result) {
        throw new Error("Aucune agence mise à jour");
      }
      
      await refresh();
    }catch(e){
      const errorMsg="Mise à jour impossible : "+(e.message||e)+"\n\nSolution : Assurez-vous d'avoir exécuté le script SQL avec admin_update_agency_simple dans Supabase.";
      window.alert(errorMsg);
    }finally{
      setBusy(null);
    }
  };
  const paying=agencies.filter(a=>a.billing_status==="actif"&&!a.is_offered);
  const mrr=paying.length*PRICE;
  const offertCount=agencies.filter(a=>a.is_offered).length;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Facturation</h1>
      <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub="Hors offerts" accent={T.stripe}/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection"/>
        <SC label="Impayés" val={agencies.filter(a=>a.billing_status==="impayé"&&!a.is_offered).length} accent={T.ng}/>
        <SC label="Offerts ♥" val={offertCount} sub="Hors MRR" accent={T.cy}/>
      </div>
      <div style={{padding:"12px 16px",borderRadius:10,background:"rgba(37,99,235,.06)",border:"1px solid rgba(37,99,235,.15)",fontSize:13,color:T.tx,marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <span>Abonnement <strong style={{color:T.acc}}>{PRICE}€/mois</strong> par agence · Paiement via Stripe</span>
        <button type="button" className="btn pay-cta-saas" style={{fontSize:12,padding:"8px 16px"}} onClick={()=>{window.location.href=STRIPE_LINK;}}>Ouvrir le paiement Stripe →</button>
      </div>
      <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Toutes les agences</div>
      {agencies.length===0&&<div style={{padding:"28px 20px",textAlign:"center",color:T.sec,border:`1px dashed ${T.b}`,borderRadius:12}}>Aucune agence</div>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {agencies.map(ag=>(
          <div key={ag.id} className="card" style={{padding:16,border:`1px solid ${T.b}`,background:"linear-gradient(165deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.01) 100%)"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:(ag.color||T.acc)+"22",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:900,fontSize:17,flexShrink:0,border:`1px solid ${(ag.color||T.acc)}35`}}>{ag.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,color:T.tx,marginBottom:6}}>{ag.name}</div>
                <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:8}}>
                  {billingTag(ag.billing_status,ag.is_offered)}
                  <span style={{fontSize:12,color:T.sec}}>{ag.is_offered?"Accès offert":ag.billing_status==="actif"?`${PRICE}€ / mois`:"0€ facturé"}</span>
                </div>
              </div>
            </div>
            <div className="billing-card-actions" style={{display:"flex",flexDirection:"column",gap:10}}>
              {!ag.is_offered&&ag.billing_status!=="actif"&&(
                <button type="button" className="btn" style={{fontSize:14,padding:"12px 16px",width:"100%",background:`linear-gradient(135deg,${T.ok},#00E676)`,fontWeight:700}} disabled={!!busy} onClick={()=>update(ag.id,"billing_status","actif")}>
                  ✓ Activer l’abonnement ({PRICE}€/mois)
                </button>
              )}
              {!ag.is_offered&&(
                <button type="button" disabled={!!busy} onClick={()=>update(ag.id,"is_offered",true)} style={{
                  fontSize:10,padding:"4px 8px",width:"100%",borderRadius:8,border:`1px solid ${T.payRed}55`,background:`linear-gradient(180deg,rgba(37,99,235,.2),rgba(37,99,235,.08))`,color:"#FFF",cursor:"pointer",fontFamily:"inherit",fontWeight:600,
                  boxShadow:`0 0 16px ${T.payRedGlow}`
                }}>
                  ♥ Offrir
                </button>
              )}
              {ag.is_offered&&(
                <button type="button" className="btng" style={{fontSize:11,padding:"6px",width:"100%",justifyContent:"center",color:T.ng,borderColor:`${T.ng}40`}} disabled={!!busy} onClick={()=>update(ag.id,"is_offered",false)}>
                  Retirer l’offre
                </button>
              )}
              {!ag.is_offered&&ag.billing_status==="actif"&&(
                <button type="button" style={{fontSize:12,padding:"8px",width:"100%",borderRadius:8,border:`1px solid ${T.ng}35`,background:`${T.ng}12`,color:T.ng,cursor:"pointer",fontFamily:"inherit"}} disabled={!!busy} onClick={()=>update(ag.id,"billing_status","impayé")}>
                  Marquer comme impayé
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CODES PANEL ───────────────────────── */
function CodesPanel({profile}){
  const [codes,setCodes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [gen,setGen]=useState(null);
  const [copied,setCopied]=useState(null);
  const role=profile?.role;
  const ag=profile?.agencies;
  const BASE="https://agency.beliveacademy.com/join";
  const COLORS={director:T.acc,manager:T.pu,agent:T.cy,creator:T.ok};
  const targets={agency:["director","manager","agent","creator"],director:["manager","agent","creator"],manager:["agent","creator"],agent:["creator"]}[role]||[];

  useEffect(()=>{if(profile?.id) getMyCodes(profile.id).then(d=>{setCodes(d);setLoading(false);});},[profile?.id]);
  const doGen=async(r)=>{
    setGen(r);
    await genCode(ag?.id,profile?.id,role,r);
    const fresh=await getMyCodes(profile.id);
    setCodes(fresh);setGen(null);
  };
  const cp=(k)=>{setCopied(k);setTimeout(()=>setCopied(null),2000);};

  if(!targets.length) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucun lien disponible pour votre rôle.</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Codes d'invitation</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Chaque code est <strong style={{color:T.tx}}>unique et personnel</strong> — deux agents n'ont jamais le même code.</p>
      <div className="card" style={{padding:14,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Générer un nouveau code</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {targets.map(r=>(
            <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}} onClick={()=>doGen(r)} disabled={gen===r}>
              {gen===r?<Spin/>:"+"} Inviter un {r}
            </button>
          ))}
        </div>
      </div>
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement…</div>:
      codes.length===0?<div style={{textAlign:"center",padding:"24px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12}}>Aucun code actif · Génère un code ci-dessus</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {codes.map(code=>(
            <div key={code.id} className="card" style={{padding:14,border:`1px solid ${COLORS[code.target_role]||T.acc}25`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span className="tag" style={{background:`${COLORS[code.target_role]||T.acc}18`,color:COLORS[code.target_role]||T.acc}}>{code.target_role}</span>
                <div style={{fontSize:10.5,color:T.sec,flex:1}}>Expire le {new Date(code.expires_at).toLocaleDateString("fr-FR")}</div>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5,color:T.ng,borderColor:`${T.ng}30`}} onClick={async()=>{await sb?.from("invite_codes").delete().eq("id",code.id);const fresh=await getMyCodes(profile.id);setCodes(fresh);}}>✕ Supprimer</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"10px 14px",border:`1px solid ${COLORS[code.target_role]||T.acc}30`}}>
                <code style={{flex:1,fontSize:16,fontWeight:900,fontFamily:"monospace",letterSpacing:".12em",color:COLORS[code.target_role]||T.acc}}>{code.code}</code>
                <button className="btng" style={{padding:"5px 12px",fontSize:11,borderColor:`${COLORS[code.target_role]||T.acc}40`,color:COLORS[code.target_role]||T.acc}} onClick={()=>cp(code.code)}>
                  {copied===code.code?"✓ Copié !":"Copier"}
                </button>
              </div>
              <div style={{fontSize:11,color:T.sec,marginTop:8,textAlign:"center"}}>⚠️ Partage uniquement le code — le lien ne fonctionne pas</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PLANNING ──────────────────────────── */
function PlanningView({profile}){
  const [slots,setSlots]=useState([]);
  const [loading,setLoading]=useState(true);
  const [adding,setAdding]=useState(null);
  const [form,setForm]=useState({start_time:"18:00",end_time:"21:00",accept_inter_agency:false,notes:""});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{if(profile?.id) fetchSchedule(profile.id).then(d=>{setSlots(d);setLoading(false);});},[profile?.id]);

  const save=async()=>{
    setSaving(true);
    await saveScheduleSlot({...form,day_of_week:adding,creator_profile_id:profile.id,agency_id:profile.agency_id});
    const fresh=await fetchSchedule(profile.id);
    setSlots(fresh);setAdding(null);setSaving(false);
  };
  const del=async(id)=>{await deleteScheduleSlot(id);setSlots(s=>s.filter(x=>x.id!==id));};

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Mon planning live</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Indique tes dispo · Ton staff peut voir ce planning pour organiser tes matchs · Tu peux modifier à tout moment</p>
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement…</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {DAYS.map((day,i)=>{
            const daySlots=slots.filter(s=>s.day_of_week===i);
            return(
              <div key={i} className="card" style={{padding:14,border:`1px solid ${daySlots.length>0?T.acc+"40":T.b}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:daySlots.length>0||adding===i?10:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{day}</div>
                  <button className="btng" style={{fontSize:10.5}} onClick={()=>setAdding(adding===i?null:i)}>
                    {adding===i?"Annuler":"+ Créneau"}
                  </button>
                </div>
                {daySlots.map(slot=>(
                  <div key={slot.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:8,background:"rgba(127,0,255,.06)",marginBottom:5,border:"1px solid rgba(127,0,255,.15)"}}>
                    <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{slot.start_time?.slice(0,5)} → {slot.end_time?.slice(0,5)}</div>
                    <span className="tag" style={{background:slot.accept_inter_agency?`${T.cy}18`:"rgba(255,255,255,.06)",color:slot.accept_inter_agency?T.cy:T.sec}}>
                      {slot.accept_inter_agency?"Inter-agence":"Intra seulement"}
                    </span>
                    {slot.notes&&<span style={{fontSize:11,color:T.sec,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{slot.notes}</span>}
                    <button className="btng" style={{fontSize:10.5,color:T.ng,borderColor:T.ng+"30",padding:"2px 8px"}} onClick={()=>del(slot.id)}>✕</button>
                  </div>
                ))}
                {adding===i&&(
                  <div style={{padding:12,borderRadius:10,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.2)",marginTop:daySlots.length>0?10:0}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Début</label>
                        <input className="inp" type="time" value={form.start_time} onChange={e=>setForm(f=>({...f,start_time:e.target.value}))}/></div>
                      <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Fin</label>
                        <input className="inp" type="time" value={form.end_time} onChange={e=>setForm(f=>({...f,end_time:e.target.value}))}/></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <Tog on={form.accept_inter_agency} onChange={v=>setForm(f=>({...f,accept_inter_agency:v}))} color={T.cy}/>
                      <label style={{fontSize:12,color:T.tx}}>Accepter les matchs inter-agences</label>
                    </div>
                    <div style={{marginBottom:10}}><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Note (optionnel)</label>
                      <input className="inp" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Ex: dispo sauf urgence"/></div>
                    <button className="btn" style={{fontSize:12}} onClick={save} disabled={saving}>{saving?<Spin/>:"Enregistrer"}</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── MY LIVES ──────────────────────────── */
function MyLivesView({profile}){
  const [entries,setEntries]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({live_date:"",duration_minutes:60,viewers:0,diamonds:0,notes:""});
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  useEffect(()=>{if(profile?.id) fetchLiveEntries(profile.id).then(d=>{setEntries(d);setLoading(false);});},[profile?.id]);

  const save=async()=>{
    if(!form.live_date){setErr("Date obligatoire");return;}
    setSaving(true);setErr("");
    const res=await addLiveEntry({...form,creator_profile_id:profile.id,agency_id:profile.agency_id});
    if(res.error){setErr(res.error);setSaving(false);return;}
    const fresh=await fetchLiveEntries(profile.id);
    setEntries(fresh);setForm({live_date:"",duration_minutes:60,viewers:0,diamonds:0,notes:""});
    setShowForm(false);setSaving(false);
  };

  const totalD=entries.reduce((s,e)=>s+(e.diamonds||0),0);
  const totalH=Math.round(entries.reduce((s,e)=>s+(e.duration_minutes||0),0)/60*10)/10;

  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div><h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Mes lives</h1>
          <p style={{fontSize:12,color:T.sec,marginTop:2}}>Saisis tes lives manuellement · Connexion TikTok directe bientôt</p></div>
        <button className="btn" style={{fontSize:12}} onClick={()=>setShowForm(!showForm)}>+ Ajouter un live</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        <SC label="💎 Diamants" val={totalD.toLocaleString()} sub="Ce mois" accent={T.cy}/>
        <SC label="⏱ Heures" val={totalH+"h"} sub={entries.length+" lives"}/>
        <SC label="👁 Spectateurs" val={entries.reduce((s,e)=>s+(e.viewers||0),0).toLocaleString()} sub="Cumulés"/>
      </div>
      {showForm&&(
        <div className="glow" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Nouveau live</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Date *</label>
              <input className="inp" type="date" value={form.live_date} onChange={e=>setForm(f=>({...f,live_date:e.target.value}))}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Durée (minutes)</label>
              <input className="inp" type="number" value={form.duration_minutes} onChange={e=>setForm(f=>({...f,duration_minutes:+e.target.value}))} min={0}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>💎 Diamants reçus</label>
              <input className="inp" type="number" value={form.diamonds} onChange={e=>setForm(f=>({...f,diamonds:+e.target.value}))} min={0}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>👁 Spectateurs max</label>
              <input className="inp" type="number" value={form.viewers} onChange={e=>setForm(f=>({...f,viewers:+e.target.value}))} min={0}/></div>
          </div>
          <div style={{marginBottom:11}}><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Notes</label>
            <input className="inp" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Ex: super live, beaucoup de cadeaux"/></div>
          {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng,marginBottom:10}}>{err}</div>}
          <div style={{display:"flex",gap:8}}>
            <button className="btn" style={{fontSize:12}} onClick={save} disabled={saving}>{saving?<Spin/>:"Enregistrer"}</button>
            <button className="btng" onClick={()=>{setShowForm(false);setErr("");}}>Annuler</button>
          </div>
        </div>
      )}
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement…</div>:
      entries.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun live enregistré · Ajoute ton premier live ci-dessus
          <div style={{marginTop:10,fontSize:11,color:T.sec}}>Connexion TikTok directe bientôt ✨</div>
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Historique</div>
          {entries.map(e=>(
            <div key={e.id} className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 1fr"}}>
              <div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>{new Date(e.live_date).toLocaleDateString("fr-FR")}</div>
              <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(e.diamonds||0).toLocaleString()}</div>
              <div style={{fontSize:12,color:T.sec}}>{Math.round((e.duration_minutes||0)/60*10)/10}h</div>
              <div style={{fontSize:12,color:T.sec}}>👁 {(e.viewers||0).toLocaleString()}</div>
              <div style={{fontSize:11.5,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.notes||"—"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MATCHES ───────────────────────────── */
function MatchesView({profile,creators}){
  const [matches,setMatches]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [form,setForm]=useState({creator_a:"",creator_b:"",match_date:"",match_time:"20:00",is_inter_agency:false});
  const [saving,setSaving]=useState(false);
  const [autoResult,setAutoResult]=useState(null);
  const [poster,setPoster]=useState(null);
  const ag=profile?.agencies;
  const role=profile?.role;

  useEffect(()=>{
    if(ag?.id) fetchMatches(ag.id).then(d=>{setMatches(d);setLoading(false);});
    else setLoading(false);
  },[ag?.id]);

  const createMatch=async()=>{
    if(!form.creator_a||!form.match_date) return;
    setSaving(true);
    await sb.from("matches").insert({
      creator_a:form.creator_a,creator_b:form.creator_b||null,
      agency_a:ag?.id,agency_b:ag?.id,
      is_inter_agency:form.is_inter_agency,
      match_date:form.match_date,match_time:form.match_time,
      status:"pending",created_by:profile?.id,
    });
    const fresh=await fetchMatches(ag?.id);
    setMatches(fresh);setShowCreate(false);setSaving(false);
  };

  const autoMatch=()=>{
    if(!form.creator_a){return;}
    const crea=creators.find(c=>c.id===form.creator_a||c.profile_id===form.creator_a);
    if(!crea) return;
    const similar=creators.filter(c=>{
      const cId=c.id||c.profile_id;
      const aId=crea.id||crea.profile_id;
      if(cId===aId) return false;
      const diff=Math.abs((c.diamonds||0)-(crea.diamonds||0));
      return diff<=(crea.diamonds||1)*0.3;
    });
    if(similar.length>0){
      const pick=similar[Math.floor(Math.random()*similar.length)];
      setAutoResult(pick);
      setForm(f=>({...f,creator_b:pick.id||pick.profile_id}));
    } else {
      setAutoResult({pseudo:"Aucun adversaire trouvé dans ta tranche"});
    }
  };

  const statusColor={pending:T.go,confirmed:T.ok,done:T.cy,cancelled:T.ng};
  const statusLabel={pending:"En attente",confirmed:"Confirmé",done:"Terminé",cancelled:"Annulé"};
  const canCreate=["agency","director","manager","agent","admin"].includes(role);

  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div><h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Matchs TikTok Live</h1>
          <p style={{fontSize:12,color:T.sec,marginTop:2}}>Matchs intra et inter-agences · Matchmaking automatique par niveau de diamants</p></div>
        {canCreate&&<button className="btn" style={{fontSize:12}} onClick={()=>setShowCreate(!showCreate)}>+ Créer un match</button>}
      </div>

      {/* Matchmaking auto */}
      <div className="card" style={{padding:16,marginBottom:14,background:"rgba(0,229,255,.04)",border:"1px solid rgba(0,229,255,.2)"}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:4}}>🎯 Matchmaking automatique</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Diamond's trouve un adversaire de <strong style={{color:T.tx}}>même niveau</strong> (±30% de diamants) selon les disponibilités.</div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <select className="inp" style={{flex:1,minWidth:200}} value={form.creator_a} onChange={e=>setForm(f=>({...f,creator_a:e.target.value}))}>
            <option value="">Sélectionner un créateur…</option>
            {creators.map(c=><option key={c.id||c.profile_id} value={c.id||c.profile_id}>{c.pseudo} — 💎 {(c.diamonds||0).toLocaleString()}</option>)}
          </select>
          <button className="btn" style={{fontSize:12,padding:"8px 14px"}} onClick={autoMatch} disabled={!form.creator_a}>🔍 Trouver un adversaire</button>
        </div>
        {autoResult&&(
          <div style={{marginTop:10,padding:"10px 13px",borderRadius:9,background:"rgba(127,0,255,.08)",border:"1px solid rgba(127,0,255,.2)",fontSize:12.5,color:T.tx}}>
            {autoResult.diamonds?`✅ Adversaire trouvé : ${autoResult.pseudo} — 💎 ${(autoResult.diamonds||0).toLocaleString()}`:`⚠ ${autoResult.pseudo}`}
          </div>
        )}
        <div style={{marginTop:10,fontSize:11,color:T.sec}}>✨ Génère automatiquement une affiche de match avec @TikTok, date et heure</div>
      </div>

      {showCreate&&canCreate&&(
        <div className="glow" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Nouveau match</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Créateur A *</label>
              <select className="inp" value={form.creator_a} onChange={e=>setForm(f=>({...f,creator_a:e.target.value}))}>
                <option value="">Choisir…</option>
                {creators.map(c=><option key={c.id} value={c.id}>{c.pseudo} — 💎 {(c.diamonds||0).toLocaleString()}</option>)}
              </select></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Créateur B (optionnel si matchmaking auto)</label>
              <select className="inp" value={form.creator_b} onChange={e=>setForm(f=>({...f,creator_b:e.target.value}))}>
                <option value="">À définir…</option>
                {creators.filter(c=>(c.id||c.profile_id)!==form.creator_a).map(c=><option key={c.id} value={c.id}>{c.pseudo} — 💎 {(c.diamonds||0).toLocaleString()}</option>)}
              </select></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Date *</label>
                <input className="inp" type="date" value={form.match_date} onChange={e=>setForm(f=>({...f,match_date:e.target.value}))}/></div>
              <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Heure</label>
                <input className="inp" type="time" value={form.match_time} onChange={e=>setForm(f=>({...f,match_time:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <Tog on={form.is_inter_agency} onChange={v=>setForm(f=>({...f,is_inter_agency:v}))} color={T.cy}/>
              <label style={{fontSize:12,color:T.tx}}>Match inter-agences</label>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" style={{fontSize:12}} onClick={createMatch} disabled={saving||!form.creator_a||!form.match_date}>{saving?<Spin/>:"Créer le match"}</button>
              <button className="btng" onClick={()=>setShowCreate(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement…</div>:
      matches.filter(m=>m.status==="pending"&&!m.creator_b).length>0&&(
        <div className="card" style={{padding:16,marginBottom:14,background:"rgba(0,200,83,.04)",border:"1px solid rgba(0,200,83,.2)"}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>🔓 Matchs ouverts — postuler</div>
          {matches.filter(m=>m.status==="pending"&&!m.creator_b).map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,background:"rgba(255,255,255,.03)",marginBottom:7,border:`1px solid ${T.b}`}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>Match ouvert · {m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):"Date libre"}</div>
                <div style={{fontSize:11,color:T.sec}}>{m.match_time||"Heure libre"} · {m.is_inter_agency?"Inter-agences":"Intra-agence"}</div>
              </div>
              <button className="btn" style={{fontSize:11.5,padding:"5px 12px",background:`linear-gradient(135deg,${T.ok},#00E676)`}}>Postuler</button>
            </div>
          ))}
        </div>
      )}
      {matches.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun match programmé
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Matchs programmés</div>
          {matches.map(m=>(
            <div key={m.id} className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 80px"}}>
              <div style={{fontWeight:700,fontSize:12,color:T.tx}}>{m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):"—"}</div>
              <div>
                <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>Match {m.is_inter_agency?"inter":"intra"}-agence</div>
                <div style={{fontSize:10.5,color:T.sec}}>{m.match_time||"?"}</div>
              </div>
              <span className="tag" style={{background:m.is_inter_agency?`${T.cy}18`:`${T.pu}18`,color:m.is_inter_agency?T.cy:T.pu}}>
                {m.is_inter_agency?"Inter":"Intra"}
              </span>
              <span className="tag" style={{background:`${statusColor[m.status]||T.go}18`,color:statusColor[m.status]||T.go}}>
                {statusLabel[m.status]||"En attente"}
              </span>
              <button className="btng" style={{fontSize:10.5,color:"#2563EB",borderColor:"rgba(37,99,235,0.3)"}} onClick={()=>setPoster(m)}>🖼 Affiche</button>
            </div>
          ))}
        </div>
      )}
    {poster&&<MatchPoster matchData={poster} creators={creators} onClose={()=>setPoster(null)}/>}
    </div>
  );
}

/* ─── CREATORS VIEW ─────────────────────── */
function CreatorsView({profile,creators,agents,reload}){
  const ag=profile?.agencies;
  const role=profile?.role;
  const [tr,setTr]=useState(null);
  const [sel,setSel]=useState({});
  const [doing,setDoing]=useState(null);
  const [targetCreator,setTargetCreator]=useState(null);
  const canPhone=["admin","agency","director","manager","agent"].includes(role);
  const canName=["admin","agency"].includes(role);
  const canTransfer=["admin","agency"].includes(role);
  const canTogglePayout=role==="agency";
  // Delete permissions based on agency settings
  const canDeleteCreator=(role==="agency"||role==="admin")||(role==="agent"&&ag?.can_agent_delete_creator)||(role==="manager"&&ag?.can_manager_delete_agent)||(role==="director"&&ag?.can_director_delete_all);
  const canDeleteAgent=(role==="agency"||role==="admin")||(role==="manager"&&ag?.can_manager_delete_agent)||(role==="director"&&ag?.can_director_delete_all);
  const deleteCreator=async(creatorId)=>{
    if(!sb||!confirm("Supprimer ce créateur ? Cette action est irréversible.")) return;
    await sb.from("creators").delete().eq("id",creatorId);
    reload?.();
  };

  const doTransfer=async(creatorId)=>{
    const agentId=sel[creatorId];if(!agentId) return;
    setDoing(creatorId);
    if(sb) await sb.from("creators").update({agent_id:agentId}).eq("id",creatorId);
    setDoing(null);setTr(null);reload?.();
  };
  const togglePayout=async(profileId,current)=>{
    if(!sb) return;
    await sb.from("profiles").update({disable_creator_payout:!current}).eq("id",profileId);
    reload?.();
  };

  if(!ag) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Chargement…</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Créateurs</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <span className="tag" style={{background:`${T.ok}18`,color:T.ok}}>Pseudo = public</span>
        <span className="tag" style={{background:"rgba(127,0,255,.15)",color:T.acc}}>Nom réel = {canName?"visible":"masqué"}</span>
        <span className="tag" style={{background:`${T.go}18`,color:T.go}}>Téléphone = {canPhone?"visible":"masqué"}</span>
      </div>
      {creators.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun créateur · Invitez-en via vos liens
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}><div style={{minWidth:540}}>
            <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"110px ":""}90px 50px 50px 80px 80px${canTransfer?" 100px":""}`,background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div/><div>Créateur</div>{canName&&<div>Nom</div>}{canPhone&&<div>Téléphone</div>}<div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>{canTransfer&&<div>Actions</div>}
            </div>
            {creators.map(c=>{
              const p=calcPayout(ag,c);
              const myAgent=agents.find(a=>a.id===c.agent_id);
              return(
                <div key={c.id}>
                  <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"110px ":""}90px 50px 50px 80px 80px${canTransfer?" 100px":""}`}}>
                    <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.acc} size={26}/>
                    <div>
                      <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo}</div>
                      <div style={{fontSize:10,color:T.sec,display:"flex",alignItems:"center",gap:4}}>
                        {myAgent?.name||"Sans agent"}
                        {c.staff_as_creator&&<span className="tag" style={{background:`${T.pu}18`,color:T.pu,fontSize:8,padding:"1px 4px"}}>Staff+Créa</span>}
                        {c.disable_creator_payout&&<span className="tag" style={{background:`${T.ng}18`,color:T.ng,fontSize:8,padding:"1px 4px"}}>Rev. OFF</span>}
                      </div>
                    </div>
                    {canName&&<div style={{fontSize:12,fontWeight:600,color:T.tx}}>{c.first_name} {c.last_name}</div>}
                    {canPhone&&<div style={{fontSize:11,color:T.tx}}>{c.phone||"—"}</div>}
                    <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(c.diamonds||0).toLocaleString()}</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
                    <div><span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"éligible":"bloqué"}</span></div>
                    <div style={{fontWeight:700,fontSize:12.5,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}€`:"0€"}</div>
                    {canTransfer&&(
                      <div style={{display:"flex",gap:4}}>
                        <button className="btng" style={{fontSize:9.5,padding:"2px 6px"}} onClick={()=>setTr(tr===c.id?null:c.id)} title="Transférer">↔</button>
                        {canTogglePayout&&<button className="btng" style={{fontSize:9.5,padding:"2px 6px",color:c.disable_creator_payout?T.ok:T.ng}} onClick={()=>togglePayout(c.profile_id,c.disable_creator_payout)} title="Activer/désactiver reversement créateur">
                          {c.disable_creator_payout?"Rev ✓":"Rev ✕"}
                        </button>}
                        {canTogglePayout&&<button className="btng" style={{fontSize:9.5,padding:"2px 6px",color:"#2563EB",borderColor:"rgba(37,99,235,0.3)"}} onClick={()=>setTargetCreator(c)} title="Objectifs personnalisés">🎯</button>}
                      </div>
                    )}
                  </div>
                  {tr===c.id&&(
                    <div style={{padding:"10px 14px",background:"rgba(127,0,255,.06)",borderBottom:`1px solid ${T.b}`,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:12,color:T.sec,flexShrink:0}}>Transférer vers :</div>
                      <select className="inp" value={sel[c.id]||""} onChange={e=>setSel(s=>({...s,[c.id]:e.target.value}))} style={{flex:1}}>
                        <option value="">Choisir un agent…</option>
                        {agents.filter(a=>a.id!==c.agent_id).map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      <button className="btn" style={{fontSize:11.5,padding:"6px 12px"}} disabled={!sel[c.id]||doing===c.id} onClick={()=>doTransfer(c.id)}>
                        {doing===c.id?<Spin/>:"Confirmer"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div></div>
        </div>
      )}
    </div>
  );
}

/* ─── IMPORT BACKSTAGE ──────────────────── */
// Lit le XLSX officiel TikTok Backstage (colonnes françaises) via SheetJS
const parseBackstageXLSX = async (file) => {
  const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  // Cherche la ligne d-en-tete (contient le mot utilisateur)
  let headerIdx = raw.findIndex(r => r.some(c => {
    const s = String(c).toLowerCase();
    return s.includes("utilisateur") || s.includes("username");
  }));
  if (headerIdx < 0) headerIdx = 0;
  const headers = raw[headerIdx].map(h => String(h).trim().toLowerCase());
  const col = (fn) => headers.findIndex(fn);
  const iId       = col(h => h.includes("id") && h.includes("cr"));
  const iPseudo   = col(h => h.includes("utilisateur") || h.includes("username"));
  const iGroup    = col(h => h.includes("groupe") || h.includes("group"));
  const iAgent    = col(h => h === "agent" || h.startsWith("agent"));
  const iDiamonds = col(h => h.includes("diamant") || h.includes("diamond"));
  const iDays     = col(h => (h.includes("jours") || h.includes("days")) && h.includes("live"));
  const iHours    = col(h => (h.includes("dur") && h.includes("live")) || h.includes("hours"));
  const rows = [];
  for (let i = headerIdx + 1; i < raw.length; i++) {
    const r = raw[i];
    const tiktok_id = String(r[iId] ?? "").trim();
    const pseudo    = String(r[iPseudo] ?? "").trim();
    if (!pseudo && !tiktok_id) continue;
    const hoursRaw  = parseFloat(String(r[iHours] ?? "0").replace(",", ".")) || 0;
    rows.push({
      tiktok_id,
      pseudo,
      group_name:   String(r[iGroup]   ?? "").trim(),
      agent_email:  String(r[iAgent]   ?? "").trim(),
      diamonds:     Math.round(parseFloat(String(r[iDiamonds] ?? "0").replace(",", ".")) || 0),
      days_live:    Math.round(parseFloat(String(r[iDays]     ?? "0").replace(",", ".")) || 0),
      hours_live:   Math.round(hoursRaw * 10) / 10,
    });
  }
  return rows;
};

// Normalise un handle TikTok pour la comparaison
const normHandle = (h) => String(h || "").replace(/^@/, "").trim().toLowerCase();

function ImportView({profile,reload}){
  const [phase,setPhase]=useState("idle");
  const [prog,setProg]=useState(0);
  const [result,setRes]=useState(null);
  const [err,setErr]=useState("");
  const [preview,setPreview]=useState(null); // rows parsed before confirming
  const inputRef=useRef();
  const ag=profile?.agencies;
  const canImport=()=>{const r=profile?.role;if(r==="agency"||r==="admin") return true;if(r==="director"&&ag?.director_can_import) return true;if(r==="manager"&&ag?.manager_can_import) return true;return false;};

  const go=async(file)=>{
    if(!file) return;
    setErr("");setPreview(null);
    // Accepte XLSX ou CSV
    const isXlsx = file.name.match(/\.xlsx?$/i) || file.type.includes("spreadsheet");
    let rows=[];
    if(isXlsx){
      try{
        setPhase("parsing");
        rows = await parseBackstageXLSX(file);
      }catch(e){
        setErr("Erreur lecture XLSX : "+e.message);setPhase("idle");return;
      }
    } else {
      // Fallback CSV legacy
      const text = await file.text?.() ?? "";
      const lines = text.split(/\r?\n/).filter(Boolean);
      const dataLines = lines.length>1&&isNaN(lines[0].split("\t")[0])?lines.slice(1):lines;
      rows = dataLines.map(line=>{
        const p = line.split("\t");
        if(p.length<2) return null;
        return {tiktok_id:p[0]?.trim(), pseudo:p[1]?.trim(), diamonds:+(p[19]||0), days_live:+(p[20]||0), hours_live:+(p[21]||0)};
      }).filter(Boolean);
    }
    if(rows.length===0){setErr("Fichier vide ou format non reconnu. Utilise l'export XLSX officiel TikTok Backstage.");setPhase("idle");return;}
    setPreview(rows);
    setPhase("preview");
  };

  const doImport = async () => {
    if(!preview||preview.length===0||!sb||!ag?.id) return;
    setPhase("load");setProg(0);setErr("");
    let p=0;const iv=setInterval(()=>{p=Math.min(p+Math.random()*14+5,90);setProg(Math.round(p));},110);
    let updated=0;
    try{
      // 1. Upsert direct sans RPC pour eviter l'erreur updated_at
      for(const r of preview){
        const {data:existing}=await sb.from("creators")
          .select("id")
          .eq("agency_id",ag.id)
          .or("tiktok_id.eq."+r.tiktok_id+",pseudo.eq."+r.pseudo)
          .maybeSingle();
        if(existing?.id){
          await sb.from("creators").update({
            diamonds:r.diamonds, days_live:r.days_live, hours_live:r.hours_live,
          }).eq("id",existing.id);
        } else {
          await sb.from("creators").insert({
            agency_id:ag.id, tiktok_id:r.tiktok_id, pseudo:r.pseudo,
            diamonds:r.diamonds, days_live:r.days_live, hours_live:r.hours_live,
          });
        }
        updated++;
      }
      // 2. Mise a jour last_import sur l'agence
      const expDate=new Date();expDate.setMonth(expDate.getMonth()+1);expDate.setDate(15);
      await sb.from("agencies").update({
        last_import_date:new Date().toISOString(),
        last_import_count:updated,
        last_import_expiry:expDate.toISOString(),
      }).eq("id",ag.id);
      clearInterval(iv);setProg(80);
      // 3. Linking @TikTok -> profils inscrits (createurs ET staff)
      const [{data:creatorsData},{data:profilesData}]=await Promise.all([
        sb.from("creators").select("id,tiktok_id,pseudo,profile_id").eq("agency_id",ag.id),
        sb.from("profiles").select("id,tiktok_handle,role").eq("agency_id",ag.id),
      ]);
      if(creatorsData&&profilesData){
        for(const prof of profilesData){
          if(!prof.tiktok_handle) continue;
          const handle=normHandle(prof.tiktok_handle);
          const creatorRow=creatorsData.find(c=>normHandle(c.pseudo)===handle||normHandle(c.tiktok_id)===handle);
          if(creatorRow&&creatorRow.profile_id!==prof.id){
            await sb.from("creators").update({profile_id:prof.id}).eq("id",creatorRow.id);
          }
          if(["director","manager","agent"].includes(prof.role)){
            const imp=preview.find(r=>normHandle(r.pseudo)===handle||normHandle(r.tiktok_id)===handle);
            if(imp&&creatorRow){
              await sb.from("creators").update({
                diamonds:imp.diamonds, days_live:imp.days_live, hours_live:imp.hours_live, profile_id:prof.id,
              }).eq("id",creatorRow.id);
            }
          }
        }
      }
    }catch(e){
      clearInterval(iv);setErr("Erreur import : "+e.message);setPhase("idle");return;
    }
    setProg(100);
    setTimeout(()=>{setRes({updated});setPhase("done");reload?.();},300);
  };

  const expiry=()=>{const d=new Date();d.setMonth(d.getMonth()+1);d.setDate(15);return d.toLocaleDateString("fr-FR");};
  if(!canImport()) return <div style={{padding:"20px 16px",borderRadius:13,background:"rgba(244,67,54,.08)",border:"1px solid rgba(244,67,54,.2)",fontSize:13.5,color:T.ng}}>⛔ Permission refusée.</div>;

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Import Backstage</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Export XLSX officiel TikTok · Données <strong style={{color:T.tx}}>remplacées</strong> à chaque import · Matching automatique des @</p>
      {ag?.last_import_date&&<div className="card" style={{padding:13,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx}}>Dernier import : {new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</div>
        <div style={{fontSize:11.5,color:T.sec,marginTop:2}}>{ag.last_import_count} créateurs · Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong></div>
      </div>}

      {/* Info box */}
      <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(37,99,235,.07)",border:"1px solid rgba(37,99,235,.18)",marginBottom:14,fontSize:12,color:"#93C5FD",lineHeight:1.6}}>
        💡 <strong>Comment faire :</strong> Va sur TikTok Backstage → Gérer les créateurs → <em>Exporter</em> → télécharge le fichier <strong>.xlsx</strong> et dépose-le ici. Le système relie automatiquement chaque @ à ton staff et tes créateurs.
      </div>

      {err&&<div style={{padding:"8px 11px",borderRadius:9,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:12,color:T.ng,marginBottom:12}}>{err}</div>}

      {(phase==="idle"||phase==="parsing")&&<div
        onClick={()=>inputRef.current?.click()}
        onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)go(f);}}
        onDragOver={e=>e.preventDefault()}
        style={{border:`2px dashed ${T.b}`,borderRadius:16,padding:"36px 28px",textAlign:"center",cursor:phase==="parsing"?"default":"pointer",transition:"border-color .2s",opacity:phase==="parsing"?0.6:1}}
        onMouseEnter={e=>{if(phase==="idle")e.currentTarget.style.borderColor=T.acc;}} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}} onChange={e=>go(e.target.files[0])}/>
        <div style={{fontSize:34,marginBottom:10}}>{phase==="parsing"?"⏳":"📊"}</div>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>{phase==="parsing"?"Lecture du fichier…":"Dépose l'export TikTok Backstage ici"}</div>
        <div style={{fontSize:11.5,color:T.sec,marginBottom:12}}>Fichier <strong style={{color:T.tx}}>.xlsx</strong> officiel TikTok · Glisse ou clique pour choisir</div>
        {phase==="idle"&&<button className="btn" style={{fontSize:12}} onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>Choisir le fichier XLSX</button>}
      </div>}

      {phase==="preview"&&preview&&(
        <div>
          <div className="card" style={{padding:16,marginBottom:14,background:"rgba(37,99,235,.06)",border:"1px solid rgba(37,99,235,.2)"}}>
            <div style={{fontWeight:700,fontSize:14,color:T.tx,marginBottom:4}}>✅ {preview.length} créateurs détectés</div>
            <div style={{fontSize:12,color:T.sec,marginBottom:14}}>Vérifie l'aperçu ci-dessous puis confirme l'import. Les données diamants, jours et heures seront mises à jour pour chaque @ trouvé dans ton agence.</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn" style={{fontSize:13}} onClick={doImport}>Confirmer l'import →</button>
              <button className="btng" onClick={()=>{setPhase("idle");setPreview(null);}}>Annuler</button>
            </div>
          </div>
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Aperçu (5 premiers)</div>
            <div className="cr" style={{gridTemplateColumns:"140px 80px 50px 60px",background:"rgba(255,255,255,.02)",fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>@ TikTok</div><div>💎 Diamants</div><div>Jours</div><div>Heures</div>
            </div>
            {preview.slice(0,5).map((r,i)=>(
              <div key={i} className="cr" style={{gridTemplateColumns:"140px 80px 50px 60px"}}>
                <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>@{r.pseudo}</div>
                <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(r.diamonds||0).toLocaleString()}</div>
                <div style={{fontSize:12,color:T.sec}}>{r.days_live}j</div>
                <div style={{fontSize:12,color:T.sec}}>{r.hours_live}h</div>
              </div>
            ))}
            {preview.length>5&&<div style={{padding:"8px 14px",fontSize:11,color:T.sec}}>… et {preview.length-5} autres créateurs</div>}
          </div>
        </div>
      )}

      {phase==="load"&&<div className="card" style={{padding:"36px 28px",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(37,99,235,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto 13px"}}/>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>Import en cours…</div>
        <div style={{fontSize:11.5,color:T.sec,marginBottom:13}}>Mise à jour des stats + matching des @</div>
        <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:20,overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${prog}%`,background:`linear-gradient(90deg,${T.acc},${T.cy})`,transition:"width .1s"}}/></div>
        <div style={{marginTop:6,fontSize:11,color:T.sec}}>{prog}%</div>
      </div>}

      {phase==="done"&&<div className="card" style={{padding:24,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:10}}>✅</div>
        <div style={{fontSize:18,fontWeight:800,color:T.tx,marginBottom:4}}>Import réussi !</div>
        <div style={{fontSize:12.5,color:T.sec,marginBottom:6}}><strong style={{color:T.tx}}>{result?.updated??(preview?.length??"?")} créateurs</strong> mis à jour</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:16}}>Valide jusqu'au <strong style={{color:T.ok}}>{expiry()}</strong> · @ reliés automatiquement à vos profils</div>
        <button className="btng" onClick={()=>{setPhase("idle");setRes(null);setPreview(null);}}>Importer un autre fichier</button>
      </div>}
    </div>
  );
}

/* ─── SETTINGS ──────────────────────────── */
function SettingsView({profile,reload}){
  const role=profile?.role;
  const ag=profile?.agencies;
  const isAgencyOrAdmin=role==="agency"||role==="admin";
  const isStaff=["director","manager","agent"].includes(role);
  const avatarRef=useRef();

  // @ TikTok
  const [tiktokHandle,setTiktokHandle]=useState((profile?.tiktok_handle||"").replace(/^@/,""));
  const [savingHandle,setSavingHandle]=useState(false);
  const [savedHandle,setSavedHandle]=useState(false);
  const saveHandle=async()=>{
    if(!sb||!profile?.id) return;
    setSavingHandle(true);
    const handleVal=tiktokHandle.trim()?"@"+tiktokHandle.trim().replace(/^@/,""):"";
    await sb.from("profiles").update({tiktok_handle:handleVal||null}).eq("id",profile.id);
    setSavingHandle(false);setSavedHandle(true);setTimeout(()=>setSavedHandle(false),2500);reload?.();
  };

  // Photo de profil
  const [avatarPreview,setAvatarPreview]=useState(profile?.tiktok_avatar_url||null);
  const [avatarUrl,setAvatarUrl]=useState(profile?.tiktok_avatar_url||"");
  const [savingAvatar,setSavingAvatar]=useState(false);
  const [avatarMsg,setAvatarMsg]=useState("");
  const onAvatarFile=async(file)=>{
    if(!file) return;
    if(file.size>5*1024*1024){setAvatarMsg("❌ Image trop lourde (max 5 Mo)");return;}
    setSavingAvatar(true);setAvatarMsg("");
    // Stocker en base64 dans le profil directement
    const reader=new FileReader();
    reader.onload=async(e)=>{
      const b64=e.target.result;
      setAvatarPreview(b64);
      await sb.from("profiles").update({tiktok_avatar_url:b64}).eq("id",profile.id);
      setSavingAvatar(false);setAvatarMsg("✓ Photo enregistrée");setTimeout(()=>setAvatarMsg(""),3000);reload?.();
    };
    reader.readAsDataURL(file);
  };
  const saveAvatarUrl=async()=>{
    if(!avatarUrl.trim()){setAvatarMsg("❌ URL requise");return;}
    setSavingAvatar(true);setAvatarMsg("");
    setAvatarPreview(avatarUrl.trim());
    await sb.from("profiles").update({tiktok_avatar_url:avatarUrl.trim()}).eq("id",profile.id);
    setSavingAvatar(false);setAvatarMsg("✓ Photo enregistrée");setTimeout(()=>setAvatarMsg(""),3000);reload?.();
  };

  // Email
  const [newEmail,setNewEmail]=useState("");
  const [savingEmail,setSavingEmail]=useState(false);
  const [emailMsg,setEmailMsg]=useState("");
  const changeEmail=async()=>{
    if(!sb||!newEmail.trim()){setEmailMsg("❌ Email requis");return;}
    setSavingEmail(true);setEmailMsg("");
    const {error}=await sb.auth.updateUser({email:newEmail.trim()});
    setSavingEmail(false);
    if(error) setEmailMsg("❌ "+error.message);
    else{setEmailMsg("✓ Email mis à jour");setNewEmail("");setTimeout(()=>setEmailMsg(""),3000);}
  };

  // Mot de passe
  const [newPw,setNewPw]=useState("");
  const [confirmPw,setConfirmPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [savingPw,setSavingPw]=useState(false);
  const [pwMsg,setPwMsg]=useState("");
  const changePw=async()=>{
    if(!newPw.trim()||newPw.length<6){setPwMsg("❌ Minimum 6 caractères");return;}
    if(newPw!==confirmPw){setPwMsg("❌ Les mots de passe ne correspondent pas");return;}
    setSavingPw(true);setPwMsg("");
    const {error}=await sb.auth.updateUser({password:newPw});
    setSavingPw(false);
    if(error) setPwMsg("❌ "+error.message);
    else{setPwMsg("✓ Mot de passe modifié");setNewPw("");setConfirmPw("");setTimeout(()=>setPwMsg(""),3000);}
  };

  // Paramètres agence
  const [agName,setAgName]=useState(ag?.name||"");
  const [pcts,setPcts]=useState({director:ag?.pct_director||3,manager:ag?.pct_manager||5,agent:ag?.pct_agent||10,creator:ag?.pct_creator||55});
  const [minD,setMinD]=useState(ag?.min_days||20);
  const [minH,setMinH]=useState(ag?.min_hours||40);
  const [perms,setPerms]=useState({dir:ag?.director_can_import||false,mgr:ag?.manager_can_import||false,inter:ag?.accept_inter_agency!==false,coachEnabled:ag?.coach_enabled!==false,agentDel:ag?.can_agent_delete_creator||false,mgrDel:ag?.can_manager_delete_agent||false,dirDel:ag?.can_director_delete_all!==false});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const ROLES=[{k:"creator",l:"Part créateur",c:T.ok},{k:"agent",l:"Commission agent",c:T.cy},{k:"manager",l:"Commission manager",c:T.pu},{k:"director",l:"Commission directeur",c:T.acc}];
  const total=Object.values(pcts).reduce((s,v)=>s+v,0);
  const saveAgency=async()=>{
    if(!sb) return;setSaving(true);
    if(ag?.id){
      const payload={name:agName.trim()||ag.name,pct_director:pcts.director,pct_manager:pcts.manager,pct_agent:pcts.agent,pct_creator:pcts.creator,min_days:minD,min_hours:minH,director_can_import:perms.dir,manager_can_import:perms.mgr,accept_inter_agency:perms.inter,coach_enabled:perms.coachEnabled,can_agent_delete_creator:perms.agentDel,can_manager_delete_agent:perms.mgrDel,can_director_delete_all:perms.dirDel};
      const {error:saveErr}=await sb.from("agencies").update(payload).eq("id",ag.id);
      if(saveErr){try{await executeAdminUpdate("agencies",ag.id,payload);}catch(e2){console.error(e2);}}
    }
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);reload?.();
  };

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>{isAgencyOrAdmin?"Paramètres":"Mon profil"}</h1>

      {/* ── Photo de profil ── */}
      <div className="card" style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Photo de profil</div>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#222",border:"2px solid #333",overflow:"hidden",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {avatarPreview
              ?<img src={avatarPreview} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={()=>setAvatarPreview(null)}/>
              :<span style={{fontSize:28,color:"#444"}}>👤</span>}
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:12,color:T.sec,marginBottom:8}}>Photo affichée sur tes affiches de match TikTok Live</p>
            <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>onAvatarFile(e.target.files[0])}/>
            <button className="btn" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>avatarRef.current?.click()} disabled={savingAvatar}>
              {savingAvatar?<Spin/>:"📷"} Uploader une photo
            </button>
          </div>
        </div>
        <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>Ou colle l'URL de ta photo TikTok</div>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://p16-sign.tiktokcdn.com/..." style={{flex:1,fontSize:12}}/>
          <button className="btn" style={{fontSize:12,padding:"9px 14px",flexShrink:0}} onClick={saveAvatarUrl} disabled={savingAvatar||!avatarUrl.trim()}>OK</button>
        </div>
        {avatarMsg&&<div style={{marginTop:8,fontSize:12,color:avatarMsg.startsWith("✓")?T.ok:T.ng}}>{avatarMsg}</div>}
        <p style={{fontSize:11,color:"#444",marginTop:6}}>💡 Sur TikTok : va sur ton profil → appuie longuement sur ta photo → "Copier le lien"</p>
      </div>

      {/* ── @ TikTok ── */}
      <div className="card" style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Mon @ TikTok</div>
        <div style={{position:"relative",marginBottom:8}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.sec,fontSize:14,pointerEvents:"none"}}>@</span>
          <input className="inp" value={tiktokHandle} onChange={e=>setTiktokHandle(e.target.value.replace(/^@/,""))} placeholder="tonpseudo" style={{paddingLeft:28}}/>
        </div>
        <p style={{fontSize:11,color:"#555",marginBottom:10}}>Identique à ton @ TikTok exact · Apparaît sur les affiches de match</p>
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}>
          {savedHandle&&<span style={{fontSize:12,color:T.ok}}>✓ Enregistré</span>}
          <button className="btn" style={{fontSize:13,padding:"9px 18px"}} onClick={saveHandle} disabled={savingHandle}>{savingHandle?<Spin/>:"✓"} Sauvegarder</button>
        </div>
      </div>

      {/* ── Modifier email ── */}
      <div className="card" style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:4}}>Modifier mon email</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Email actuel : <strong style={{color:T.tx}}>{profile?.email}</strong></div>
        <input className="inp" type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="nouvel@email.com" style={{marginBottom:10}}/>
        {emailMsg&&<div style={{padding:"8px 10px",borderRadius:8,background:emailMsg.startsWith("✓")?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${emailMsg.startsWith("✓")?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,fontSize:12,color:emailMsg.startsWith("✓")?T.ok:T.ng,marginBottom:10}}>{emailMsg}</div>}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button className="btn" style={{fontSize:13,padding:"9px 18px"}} onClick={changeEmail} disabled={savingEmail||!newEmail.trim()}>{savingEmail?<Spin/>:"✓"} Mettre à jour</button>
        </div>
      </div>

      {/* ── Modifier mot de passe ── */}
      <div className="card" style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Modifier mon mot de passe</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:10}}>
          <div style={{position:"relative"}}>
            <input className="inp" type={showPw?"text":"password"} value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Nouveau mot de passe (min. 6 caractères)" style={{paddingRight:42}}/>
            <button onClick={()=>setShowPw(s=>!s)} type="button" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:15}}>{showPw?"🙈":"👁"}</button>
          </div>
          <input className="inp" type={showPw?"text":"password"} value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Confirmer le mot de passe"/>
        </div>
        {pwMsg&&<div style={{padding:"8px 10px",borderRadius:8,background:pwMsg.startsWith("✓")?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${pwMsg.startsWith("✓")?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,fontSize:12,color:pwMsg.startsWith("✓")?T.ok:T.ng,marginBottom:10}}>{pwMsg}</div>}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button className="btn" style={{fontSize:13,padding:"9px 18px"}} onClick={changePw} disabled={savingPw||!newPw.trim()}>{savingPw?<Spin/>:"🔑"} Changer le mot de passe</button>
        </div>
      </div>

      {/* ── Info agence lecture seule — staff ── */}
      {isStaff&&ag&&(
        <div className="card" style={{padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Mon agence</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{l:"Agence",v:ag.name,c:T.tx},{l:"Mon rôle",v:roleLabelFr(role),c:T.acc},{l:"Part créateur",v:(ag.pct_creator||55)+"%",c:T.ok},{l:"Objectif mensuel",v:(ag.min_days||20)+"j · "+(ag.min_hours||40)+"h",c:T.tx}].map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:T.sec}}>{item.l}</span>
                <span style={{color:item.c,fontWeight:600}}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Paramètres agence — agency/admin uniquement ── */}
      {isAgencyOrAdmin&&(<>
        <div className="card" style={{padding:18,marginBottom:12}}>
          <div style={{fontWeight:600,fontSize:13,color:T.tx,marginBottom:12}}>Informations de l'agence</div>
          <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".07em"}}>Nom de l'agence</label>
          <input className="inp" value={agName} onChange={e=>setAgName(e.target.value)} placeholder="Nom de votre agence"/>
          <p style={{fontSize:11,color:"#555",marginTop:4}}>Visible par tout votre staff et vos créateurs</p>
        </div>
        <div className="card" style={{padding:20,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Répartition des revenus</div>
          <div style={{borderRadius:8,overflow:"hidden",height:28,display:"flex",marginBottom:12}}>
            {ROLES.map(r=><div key={r.k} style={{width:`${pcts[r.k]}%`,background:r.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:"white",overflow:"hidden",whiteSpace:"nowrap",transition:"width .25s"}}>{pcts[r.k]>5?`${pcts[r.k]}%`:""}</div>)}
            <div style={{flex:1,background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:T.sec}}>Agence {100-total}%</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {ROLES.map(r=>(
              <div key={r.k}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><label style={{fontSize:12,fontWeight:600,color:T.tx}}>{r.l}</label><span style={{fontSize:13,fontWeight:800,color:r.c}}>{pcts[r.k]}%</span></div>
                <input type="range" min={0} max={100} step={1} value={pcts[r.k]} style={{accentColor:r.c}} onChange={e=>setPcts(p=>({...p,[r.k]:+e.target.value}))}/>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{padding:18,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Conditions minimales</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><label style={{fontSize:12,fontWeight:600,color:T.tx}}>Jours min.</label><span style={{fontSize:13,fontWeight:800,color:"#FF6D00"}}>{minD}j</span></div>
              <input type="range" min={0} max={31} step={1} value={minD} style={{accentColor:"#FF6D00"}} onChange={e=>setMinD(+e.target.value)}/>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><label style={{fontSize:12,fontWeight:600,color:T.tx}}>Heures min.</label><span style={{fontSize:13,fontWeight:800,color:T.go}}>{minH}h</span></div>
              <input type="range" min={0} max={100} step={1} value={minH} style={{accentColor:T.go}} onChange={e=>setMinH(+e.target.value)}/>
            </div>
          </div>
        </div>
        <div className="card" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Permissions & Matchs</div>
          {[{k:"dir",l:"Directeurs peuvent importer",c:T.acc},{k:"mgr",l:"Managers peuvent importer",c:T.pu},{k:"inter",l:"Matchs inter-agences acceptés",c:"#00C853"},{k:"coachEnabled",l:"Coach IA activé pour tout le monde",c:"#2563EB"},{k:"agentDel",l:"Agents peuvent supprimer des créateurs",c:"#FF9800"},{k:"mgrDel",l:"Managers peuvent supprimer agents & créateurs",c:T.pu},{k:"dirDel",l:"Directeurs peuvent tout supprimer",c:T.acc}].map(p=>(
            <div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:perms[p.k]?`${p.c}08`:"rgba(255,255,255,.02)",border:`1px solid ${perms[p.k]?p.c+"25":T.b}`,marginBottom:7}}>
              <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{p.l}</div>
              <Tog on={perms[p.k]} onChange={v=>setPerms(t=>({...t,[p.k]:v}))} color={p.c}/>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:4}}>Agences bloquées pour les matchs</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Ces agences ne pourront pas proposer de matchs à vos créateurs.</div>
          <BlockedAgenciesPanel profile={profile}/>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}>
          {saved&&<span style={{fontSize:12,color:T.ok}}>✓ Enregistré</span>}
          <button className="btn" onClick={saveAgency} disabled={saving}>{saving?<Spin/>:"✓"} Enregistrer paramètres agence</button>
        </div>
      </>)}
    </div>
  );
}

/* ─── DASH VIEW ─────────────────────────── */
function DashView({profile,creators,agents,managers,directors}){
  const ag=profile?.agencies;
  const role=profile?.role;
  if(role==="creator"){
    const c=creators[0];
    if(!c) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucune donnée · Contactez votre agent.</div>;
    const p=calcPayout(ag,c);
    const dp=Math.min(100,Math.round((c.days_live||0)/(ag?.min_days||20)*100));
    const hp=Math.min(100,Math.round((c.hours_live||0)/(ag?.min_hours||40)*100));
    return(
      <div className="fup">
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:10}}>Bonjour, {c.pseudo} 👋</h1>
        <RemindersPanel matches={[]} schedules={[]}/>
        <div className="glow" style={{padding:24,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Tes diamants ce mois</div>
          <div style={{fontSize:52,fontWeight:900,color:T.cy,lineHeight:1,marginBottom:4}}>💎 {(c.diamonds||0).toLocaleString()}</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:16}}>diamants accumulés en live</div>
          <div style={{display:"inline-flex",padding:"12px 24px",borderRadius:12,background:p.eligible?"rgba(127,0,255,.1)":"rgba(244,67,54,.08)",border:`1px solid ${p.eligible?"rgba(127,0,255,.25)":"rgba(244,67,54,.2)"}`}}>
            <div><div style={{fontSize:11,color:T.sec,marginBottom:2}}>Ce que tu reçois</div><div style={{fontSize:26,fontWeight:900,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}€`:"0€"}</div></div>
          </div>
        </div>
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:13}}>{p.eligible?"✅ Tu es éligible !":"❌ Conditions non atteintes"}</div>
          {[{l:"Jours de live",cur:c.days_live||0,max:ag?.min_days||20,pct:dp,c:dp>=100?T.ok:T.go},{l:"Heures de live",cur:c.hours_live||0,max:ag?.min_hours||40,pct:hp,c:hp>=100?T.ok:T.go}].map((item,i)=>(
            <div key={i} style={{marginBottom:i===0?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12.5,fontWeight:600,color:T.tx}}>{item.l}</span><span style={{fontWeight:700,color:item.c}}>{item.cur} / {item.max}</span></div>
              <div style={{height:4,borderRadius:20,background:"rgba(255,255,255,.08)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${item.pct}%`,background:item.c}}/></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if(!ag) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucune agence liée · Contactez l'administrateur.</div>;
  const okBoth=creators.filter(c=>calcPayout(ag,c).eligible).length;
  const total=creators.length;
  const pct=total>0?Math.round(okBoth/total*100):0;
  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{{agency:"Fondateur · Agence",director:"Directeur",manager:"Manager",agent:"Agent"}[role]}</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>{ag.name}</h1>
      </div>
      {ag.last_import_date&&<div style={{padding:"9px 12px",borderRadius:10,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",fontSize:12,color:T.tx,marginBottom:12}}>
        💾 Import du <strong>{new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</strong> · Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong>
      </div>}
      <div className="glow" style={{padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:44,fontWeight:900,color:T.acc,lineHeight:1}}>{okBoth}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:15,fontWeight:700,color:T.sec}}>/ {total}</div><div style={{fontSize:11,color:T.sec}}>créateurs éligibles</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:28,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div></div>
        </div>
        {total>0&&<div style={{height:7,borderRadius:20,overflow:"hidden",display:"flex",gap:2,marginBottom:10}}><div style={{flex:okBoth,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/><div style={{flex:total-okBoth,background:"rgba(244,67,54,.28)",borderRadius:20}}/></div>}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{l:`Crea ${ag.pct_creator||55}%`,c:T.ok},{l:`Agt ${ag.pct_agent||10}%`,c:T.cy},{l:`Mgr ${ag.pct_manager||5}%`,c:T.pu},{l:`Dir ${ag.pct_director||3}%`,c:T.acc}].map((x,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:x.c}}/><span style={{fontSize:11,color:T.sec}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        <SC label="Directeurs" val={directors.length} accent={T.acc}/>
        <SC label="Managers" val={managers.length}/>
        <SC label="Agents" val={agents.length}/>
        <SC label="Créateurs" val={`${okBoth}/${total}`} sub={`${total-okBoth} bloqué`} accent={okBoth===total&&total>0?T.ok:"#FF6D00"}/>
      </div>
    </div>
  );
}

/* ─── TEAM VIEW ─────────────────────────── */
function TeamView({agents,managers,directors}){
  const [tab,setTab]=useState("agents");
  const lists={agents,managers,directors};
  const colors={agents:T.cy,managers:T.pu,directors:T.acc};
  const items=lists[tab]||[];
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Mon équipe</h1>
      <div style={{display:"flex",gap:5,background:"rgba(255,255,255,.04)",padding:4,borderRadius:10,width:"fit-content",marginBottom:14,border:`1px solid ${T.b}`}}>
        {["directors","managers","agents"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:tab===t?T.acc:"transparent",color:tab===t?"white":T.sec,fontFamily:"Inter,sans-serif",transition:"all .18s"}}>
            {{directors:"Directeurs",managers:"Managers",agents:"Agents"}[t]}
          </button>
        ))}
      </div>
      {items.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>Aucun {tab.slice(0,-1)} · Invitez-en via vos liens</div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map(p=>(
            <div key={p.id} className="card" style={{padding:14,display:"flex",alignItems:"center",gap:12}}>
              <AV name={(p.name||"?").split(" ").map(x=>x[0]).join("")} color={colors[tab]} size={38}/>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13.5,color:T.tx}}>{p.name}</div><div style={{fontSize:11.5,color:T.sec}}>{p.email}</div></div>
              {p.phone&&<div style={{fontSize:11.5,color:T.sec}}>{p.phone}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/* ─── MATCH POSTER ──────────────────────── */
const POSTER_TEMPLATES=[
  {id:"gold",   label:"Gold Crown",   c1:"#0A0700",c2:"#1C1200",acc:"#D4A017",txt:"#FFE066"},
  {id:"purple", label:"Purple Reign", c1:"#06000F",c2:"#180040",acc:"#3B82F6",txt:"#93C5FD"},
  {id:"space",  label:"Neon Space",   c1:"#000510",c2:"#001530",acc:"#00E5FF",txt:"#40F4FF"},
  {id:"rose",   label:"Rose Queen",   c1:"#120008",c2:"#2A0018",acc:"#FF69B4",txt:"#FFB3C1"},
  {id:"fire",   label:"Fire",         c1:"#0F0000",c2:"#280800",acc:"#FF4500",txt:"#FF8C42"},
  {id:"emerald",label:"Emerald",      c1:"#000F05",c2:"#001A0A",acc:"#00C853",txt:"#69F0AE"},
];

function PosterBG({id,acc,c1,c2}){
  if(id==="gold") return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${c1},${c2},${c1})`}}>
      <div style={{position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",opacity:.12}}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          <ellipse cx="150" cy="150" rx="130" ry="110" fill={acc}/>
          <ellipse cx="80" cy="80" rx="50" ry="40" fill={acc} opacity=".5"/>
          <ellipse cx="220" cy="200" rx="60" ry="50" fill={acc} opacity=".4"/>
        </svg>
      </div>
      {/* Lion silhouette */}
      <div style={{position:"absolute",bottom:"28%",left:"50%",transform:"translateX(-50%)",opacity:.18}}>
        <svg width="280" height="200" viewBox="0 0 280 200">
          <ellipse cx="140" cy="110" rx="90" ry="80" fill={acc}/>
          <ellipse cx="140" cy="60" rx="65" ry="55" fill={acc}/>
          <ellipse cx="100" cy="35" rx="18" ry="22" fill={acc}/>
          <ellipse cx="180" cy="35" rx="18" ry="22" fill={acc}/>
          <circle cx="140" cy="65" rx="45" r="45" fill={c2}/>
          <ellipse cx="140" cy="62" rx="32" ry="28" fill={acc} opacity=".8"/>
        </svg>
      </div>
    </div>
  );
  if(id==="purple") return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${c1},${c2},${c1})`}}>
      <div style={{position:"absolute",inset:0,opacity:.15}}>
        <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          {[...Array(40)].map((_,i)=><circle key={i} cx={Math.sin(i*37)*180+200} cy={i*18} r={Math.random()*2+1} fill="white" opacity={Math.random()*0.8+0.2}/>)}
          <circle cx="200" cy="200" r="80" fill={acc} opacity=".25"/>
          <ellipse cx="200" cy="210" rx="120" ry="40" fill="none" stroke={acc} strokeWidth="2" opacity=".4"/>
        </svg>
      </div>
    </div>
  );
  if(id==="space") return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${c1},${c2},${c1})`}}>
      <div style={{position:"absolute",inset:0,opacity:.2}}>
        <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          {[...Array(60)].map((_,i)=><circle key={i} cx={(i*67)%400} cy={(i*113)%700} r={i%5===0?2.5:1} fill="white" opacity={i%3===0?0.9:0.4}/>)}
          <ellipse cx="200" cy="300" rx="150" ry="100" fill={acc} opacity=".08"/>
          <path d="M50 350 Q200 200 350 350" fill="none" stroke={acc} strokeWidth="1" opacity=".3"/>
          <path d="M0 400 Q200 250 400 400" fill="none" stroke={acc} strokeWidth="1" opacity=".2"/>
        </svg>
      </div>
    </div>
  );
  if(id==="rose") return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${c1},${c2},${c1})`}}>
      <div style={{position:"absolute",inset:0,opacity:.2}}>
        <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          {/* Rose petals */}
          {[0,60,120,180,240,300].map((a,i)=>(
            <ellipse key={i} cx={200+Math.cos(a*Math.PI/180)*40} cy={200+Math.sin(a*Math.PI/180)*40} rx="35" ry="55" fill={acc} opacity=".6" transform={`rotate(${a} ${200+Math.cos(a*Math.PI/180)*40} ${200+Math.sin(a*Math.PI/180)*40})`}/>
          ))}
          <circle cx="200" cy="200" r="25" fill="#FFB3C1" opacity=".8"/>
          {[0,60,120,180,240,300].map((a,i)=>(
            <ellipse key={i+6} cx={200+Math.cos(a*Math.PI/180)*130} cy={450+Math.sin(a*Math.PI/180)*40} rx="25" ry="40" fill={acc} opacity=".35" transform={`rotate(${a} ${200+Math.cos(a*Math.PI/180)*130} ${450+Math.sin(a*Math.PI/180)*40})`}/>
          ))}
          <path d="M150 320 Q200 280 250 320" fill="none" stroke="#2E7D32" strokeWidth="3" opacity=".5"/>
          <path d="M100 380 Q150 340 180 370" fill="none" stroke="#2E7D32" strokeWidth="2" opacity=".4"/>
        </svg>
      </div>
    </div>
  );
  if(id==="fire") return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${c1},${c2} 40%,#3D0800 70%,${c1})`}}>
      <div style={{position:"absolute",inset:0,opacity:.25}}>
        <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          <path d="M200 600 Q180 500 200 420 Q150 480 160 380 Q120 450 140 350 Q100 420 130 300 Q80 380 120 260 Q160 140 200 80 Q240 140 280 260 Q320 380 270 300 Q300 420 260 350 Q280 450 240 380 Q250 480 220 420 Q240 500 200 600Z" fill="#FF4500" opacity=".6"/>
          <path d="M200 580 Q185 500 200 440 Q165 490 175 400 Q145 460 165 370 Q135 430 160 320 Q185 200 200 120 Q215 200 240 320 Q265 430 235 370 Q255 460 225 400 Q235 490 215 440 Q230 500 200 580Z" fill="#FF6B00" opacity=".5"/>
          <ellipse cx="200" cy="580" rx="80" ry="20" fill="#FF4500" opacity=".3"/>
        </svg>
      </div>
    </div>
  );
  // emerald
  return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${c1},${c2},${c1})`}}>
      <div style={{position:"absolute",inset:0,opacity:.18}}>
        <svg width="100%" height="100%" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
          <path d="M50 100 Q150 50 200 120 Q250 50 350 100 Q400 200 350 300 Q300 380 200 400 Q100 380 50 300 Q0 200 50 100Z" fill={acc} opacity=".4"/>
          <path d="M80 200 Q180 120 200 200 Q220 120 320 200 Q360 280 300 350 Q250 400 200 410 Q150 400 100 350 Q40 280 80 200Z" fill={acc} opacity=".3"/>
          {[0,1,2,3,4].map(i=><path key={i} d={`M${80+i*60} ${150+i*80} Q${120+i*50} ${100+i*70} ${160+i*40} ${150+i*80}`} fill="none" stroke={acc} strokeWidth="1.5" opacity=".4"/>)}
        </svg>
      </div>
    </div>
  );
}

function PosterPreview({tmpl,cA,cB,matchDate,matchTime,isInter,mini=false}){
  const date=matchDate?new Date(matchDate).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"}):"??/??";
  const time=matchTime||"20:00";
  const pA=(cA?.pseudo||"@NOM1").slice(0,11);
  const pB=(cB?.pseudo||"@NOM2").slice(0,11);
  const av=mini?48:100;
  const vs=mini?32:64;
  const f=(n)=>mini?Math.round(n*0.44):n;

  return(
    <div style={{position:"relative",width:"100%",aspectRatio:"9/16",overflow:"hidden",borderRadius:mini?10:16,fontFamily:"'Arial Black',Arial,sans-serif"}}>
      <PosterBG id={tmpl.id} acc={tmpl.acc} c1={tmpl.c1} c2={tmpl.c2}/>
      {/* Radial glow center */}
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 42%,${tmpl.acc}22 0%,transparent 65%)`}}/>

      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:mini?"8px 10px":"24px 28px"}}>
        {/* TOP */}
        <div style={{width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:f(10)}}>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${tmpl.acc}99)`}}/>
            <span style={{fontSize:f(9),fontWeight:700,color:tmpl.acc,letterSpacing:2,fontFamily:"Arial,sans-serif"}}>DIAMOND'S</span>
            <div style={{flex:1,height:1,background:`linear-gradient(90deg,${tmpl.acc}99,transparent)`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{padding:`${f(3)}px ${f(9)}px`,border:`1px solid ${tmpl.acc}`,borderRadius:4,fontSize:f(8),fontWeight:700,color:tmpl.txt,background:`${tmpl.acc}20`,letterSpacing:1}}>LIVE</div>
            <div style={{fontSize:f(14),fontWeight:900,color:tmpl.txt,letterSpacing:3,textShadow:`0 0 20px ${tmpl.acc}`}}>BATTLE</div>
            <div style={{padding:`${f(3)}px ${f(9)}px`,border:`1px solid ${tmpl.acc}`,borderRadius:4,fontSize:f(8),fontWeight:700,color:tmpl.txt,background:`${tmpl.acc}20`,letterSpacing:1}}>LIVE</div>
          </div>
          <div style={{textAlign:"center",fontSize:f(40),fontWeight:900,color:tmpl.txt,letterSpacing:4,lineHeight:1,textShadow:`0 0 30px ${tmpl.acc},0 2px 6px #000`,marginTop:f(4)}}>LIVE</div>
        </div>

        {/* MIDDLE - avatars */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:f(14),width:"100%"}}>
          <div style={{flex:1,textAlign:"center"}}>
            {cA?.tiktok_avatar_url
              ?<img src={cA.tiktok_avatar_url} alt="" style={{width:f(av),height:f(av),borderRadius:"50%",objectFit:"cover",border:`${mini?2:3}px solid ${tmpl.acc}`,boxShadow:`0 0 ${f(20)}px ${tmpl.acc}80`,display:"block",margin:`0 auto ${f(6)}px`}}/>
              :<div style={{width:f(av),height:f(av),borderRadius:"50%",border:`${mini?2:3}px solid ${tmpl.acc}`,background:`${tmpl.acc}18`,display:"flex",alignItems:"center",justifyContent:"center",margin:`0 auto ${f(6)}px`,fontSize:f(34),fontWeight:900,color:tmpl.txt,boxShadow:`0 0 ${f(20)}px ${tmpl.acc}70`}}>{pA.replace("@","")[0]?.toUpperCase()||"?"}</div>
            }
            <div style={{fontSize:f(10),fontWeight:700,color:tmpl.txt,fontFamily:"Arial,sans-serif",textShadow:"0 1px 6px #000"}}>{pA}</div>
          </div>
          <div style={{width:f(vs),height:f(vs),borderRadius:"50%",border:`${mini?1.5:2.5}px solid ${tmpl.acc}`,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:f(15),fontWeight:900,color:tmpl.acc,flexShrink:0,boxShadow:`0 0 ${f(18)}px ${tmpl.acc}80`,textShadow:`0 0 12px ${tmpl.acc}`}}>VS</div>
          <div style={{flex:1,textAlign:"center"}}>
            {cB?.tiktok_avatar_url
              ?<img src={cB.tiktok_avatar_url} alt="" style={{width:f(av),height:f(av),borderRadius:"50%",objectFit:"cover",border:`${mini?2:3}px solid ${tmpl.acc}`,boxShadow:`0 0 ${f(20)}px ${tmpl.acc}80`,display:"block",margin:`0 auto ${f(6)}px`}}/>
              :<div style={{width:f(av),height:f(av),borderRadius:"50%",border:`${mini?2:3}px solid ${tmpl.acc}`,background:`${tmpl.acc}18`,display:"flex",alignItems:"center",justifyContent:"center",margin:`0 auto ${f(6)}px`,fontSize:f(34),fontWeight:900,color:tmpl.txt,boxShadow:`0 0 ${f(20)}px ${tmpl.acc}70`}}>{pB.replace("@","")[0]?.toUpperCase()||"?"}</div>
            }
            <div style={{fontSize:f(10),fontWeight:700,color:tmpl.txt,fontFamily:"Arial,sans-serif",textShadow:"0 1px 6px #000"}}>{pB}</div>
          </div>
        </div>

        {/* BOTTOM - date */}
        <div style={{width:"100%"}}>
          <div style={{border:`${mini?1:2}px solid ${tmpl.acc}99`,borderRadius:f(12),background:`${tmpl.acc}18`,backdropFilter:"blur(4px)",padding:`${f(10)}px ${f(16)}px`,textAlign:"center",boxShadow:`0 0 ${f(20)}px ${tmpl.acc}30`}}>
            <div style={{fontSize:f(7),letterSpacing:3,color:`${tmpl.acc}cc`,fontFamily:"Arial,sans-serif",marginBottom:f(3)}}>RENDEZ-VOUS</div>
            <div style={{fontSize:f(20),fontWeight:900,color:tmpl.txt,textShadow:`0 0 15px ${tmpl.acc}`,lineHeight:1.1}}>LE {date} · {time}</div>
          </div>
          <div style={{textAlign:"center",marginTop:f(6),fontSize:f(7),color:`${tmpl.acc}50`,letterSpacing:2,fontFamily:"Arial,sans-serif"}}>DIAMOND'S BY BELIVE ACADEMY</div>
        </div>
      </div>
    </div>
  );
}

function MatchPoster({matchData,creators,onClose}){
  const cA=creators.find(c=>c.id===matchData.creator_a||c.profile_id===matchData.creator_a);
  const cB=creators.find(c=>c.id===matchData.creator_b||c.profile_id===matchData.creator_b);
  const [sel,setSel]=useState("gold");
  const tmpl=POSTER_TEMPLATES.find(t=>t.id===sel)||POSTER_TEMPLATES[0];

  const download=()=>{
    const el=document.getElementById("poster-full");
    if(!el) return;
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload=()=>{
      window.html2canvas(el,{scale:2,useCORS:false,allowTaint:true,backgroundColor:null}).then(c=>{
        const a=document.createElement("a");
        a.download=`match-${(cA?.pseudo||"A").replace("@","")}-vs-${(cB?.pseudo||"B").replace("@","")}.png`;
        a.href=c.toDataURL("image/png");a.click();
      }).catch(()=>alert("Clic droit sur l'aperçu → Enregistrer l'image sous"));
    };
    document.head.appendChild(s);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.97)",zIndex:300,backdropFilter:"blur(12px)",overflowY:"auto"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:880,margin:"16px auto",padding:"0 14px",display:"flex",gap:18,alignItems:"flex-start"}}>
        {/* Grid */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{marginBottom:14}}>
            <h2 style={{fontSize:17,fontWeight:700,color:"#FFF",marginBottom:3}}>Choisir un template</h2>
            <p style={{fontSize:12,color:"#555"}}>{!cA?.tiktok_avatar_url||!cB?.tiktok_avatar_url?"💡 Ajoutez des photos TikTok dans les profils créateurs":"✓ Photos des créateurs chargées"}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {POSTER_TEMPLATES.map(t=>(
              <div key={t.id} onClick={()=>setSel(t.id)} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",outline:`2px solid ${sel===t.id?t.acc:"transparent"}`,transition:"all .18s",transform:sel===t.id?"scale(1.03)":"scale(1)",boxShadow:sel===t.id?`0 0 18px ${t.acc}55`:"none"}}>
                <PosterPreview tmpl={t} cA={cA} cB={cB} matchDate={matchData.match_date} matchTime={matchData.match_time} isInter={matchData.is_inter_agency} mini={true}/>
                <div style={{background:"#111",padding:"5px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:9,fontWeight:700,color:sel===t.id?t.acc:"#555",letterSpacing:".05em",textTransform:"uppercase"}}>{t.label}</span>
                  {sel===t.id&&<span style={{fontSize:10,color:t.acc}}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Preview */}
        <div style={{width:200,flexShrink:0,position:"sticky",top:16}}>
          <h2 style={{fontSize:14,fontWeight:700,color:"#FFF",marginBottom:3}}>Aperçu</h2>
          <p style={{fontSize:11,color:"#444",marginBottom:10}}>{cA?.pseudo||"@nom1"} vs {cB?.pseudo||"@nom2"}</p>
          <div id="poster-full" style={{borderRadius:12,overflow:"hidden",marginBottom:10}}>
            <PosterPreview tmpl={tmpl} cA={cA} cB={cB} matchDate={matchData.match_date} matchTime={matchData.match_time} isInter={matchData.is_inter_agency} mini={true}/>
          </div>
          <button className="btn" style={{width:"100%",justifyContent:"center",fontSize:13,padding:"10px",marginBottom:7}} onClick={download}>⬇ Télécharger</button>
          <button className="btng" style={{width:"100%",justifyContent:"center"}} onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}



/* ─── REMINDERS PANEL ───────────────────── */
function RemindersPanel({matches,schedules}){
  const today=new Date();
  const upcoming=matches.filter(m=>{
    if(!m.match_date||m.status==="done"||m.status==="cancelled") return false;
    const d=new Date(m.match_date);
    const diff=(d-today)/(1000*60*60*24);
    return diff>=0&&diff<=7;
  });
  if(upcoming.length===0&&schedules.length===0) return null;
  return(
    <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(255,179,0,.08)",border:"1px solid rgba(255,179,0,.2)",marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:12.5,color:T.go,marginBottom:8}}>🔔 Rappels</div>
      {upcoming.map(m=>(
        <div key={m.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:12,color:T.tx}}>
          <span style={{fontSize:14}}>⚔️</span>
          <span>Match le <strong>{new Date(m.match_date).toLocaleDateString("fr-FR")}</strong> à <strong>{m.match_time||"?"}</strong></span>
          <span className="tag" style={{background:`${T.go}18`,color:T.go,fontSize:10}}>Dans {Math.ceil((new Date(m.match_date)-today)/(1000*60*60*24))}j</span>
        </div>
      ))}
      {schedules.length>0&&(
        <div style={{fontSize:11.5,color:T.sec,marginTop:4}}>📅 Tu as {schedules.length} créneaux de live programmés cette semaine</div>
      )}
    </div>
  );
}

/* ─── BLOCKED AGENCIES SETTINGS ─────────── */
function BlockedAgenciesPanel({profile}){
  const [allAgencies,setAllAgencies]=useState([]);
  const [blocked,setBlocked]=useState([]);
  const [saving,setSaving]=useState(false);
  const ag=profile?.agencies;

  useEffect(()=>{
    if(!ag?.id) return;
    fetchAllAgencies().then(d=>setAllAgencies(d.filter(a=>a.id!==ag.id)));
    sb?.from("agencies").select("blocked_agency_ids").eq("id",ag.id).single().then(({data})=>{
      setBlocked(data?.blocked_agency_ids||[]);
    });
  },[ag?.id]);

  const [savedOk,setSavedOk]=useState(false);
  const toggle=(id)=>setBlocked(b=>b.includes(id)?b.filter(x=>x!==id):[...b,id]);
  const save=async()=>{
    if(!ag?.id) return;setSaving(true);
    try{
      await executeAdminUpdate("agencies",ag.id,{blocked_agency_ids:blocked});
    }catch(e){
      await sb?.from("agencies").update({blocked_agency_ids:blocked}).eq("id",ag.id);
    }
    setSaving(false);setSavedOk(true);setTimeout(()=>setSavedOk(false),2500);
  };

  if(allAgencies.length===0) return(
    <div style={{fontSize:12,color:T.sec}}>Aucune autre agence inscrite sur Diamond's pour le moment.</div>
  );
  return(
    <div>
      <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Agences avec lesquelles vous <strong style={{color:T.ng}}>refusez</strong> les matchs :</div>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
        {allAgencies.map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 12px",borderRadius:9,background:blocked.includes(a.id)?`${T.ng}08`:"rgba(255,255,255,.02)",border:`1px solid ${blocked.includes(a.id)?T.ng+"30":T.b}`,cursor:"pointer",transition:"all .18s"}}
            onClick={()=>setBlocked(prev=>prev.includes(a.id)?prev.filter(x=>x!==a.id):[...prev,a.id])}>
            <div style={{width:30,height:30,borderRadius:8,background:(a.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:a.color||T.acc,fontWeight:800,fontSize:13,flexShrink:0}}>{(a.name||"?")[0]}</div>
            <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{a.name}</div>
            <div style={{width:38,height:20,borderRadius:10,background:blocked.includes(a.id)?T.ng:"rgba(255,255,255,.15)",position:"relative",flexShrink:0,transition:"background .2s",pointerEvents:"none"}}>
              <div style={{position:"absolute",top:2,left:blocked.includes(a.id)?"21px":"3px",width:16,height:16,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.4)"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}><button className="btn" style={{fontSize:12}} onClick={save} disabled={saving}>{saving?<Spin/>:"Enregistrer les blocages"}</button>{savedOk&&<span style={{fontSize:12,color:T.ok}}>✓ Enregistré</span>}</div>
    </div>
  );
}


/* ─── ADMIN INVITE AGENCIES ─────────────── */
function AdminInviteAgencies(){
  const [codes,setCodes]=useState([]);
  const [generating,setGenerating]=useState(false);
  const [copied,setCopied]=useState(null);

  const loadCodes=async()=>{
    if(!sb) return;
    const {data}=await sb.from("invite_codes").select("*").eq("target_role","agency").order("created_at",{ascending:false});
    setCodes(data||[]);
  };
  useEffect(()=>{loadCodes();},[]);

  const generateCode=async()=>{
    if(!sb) return;
    setGenerating(true);
    const code=`AGENCE-${Math.random().toString(36).slice(-6).toUpperCase()}`;
    await sb.from("invite_codes").insert([{code,target_role:"agency"}]);
    await loadCodes();
    setGenerating(false);
  };
  const cp=(c)=>{navigator.clipboard.writeText(c);setCopied(c);setTimeout(()=>setCopied(null),2000);};
  const del=async(id)=>{if(!sb||!confirm("Supprimer ce code ?")) return;await sb.from("invite_codes").delete().eq("id",id);loadCodes();};

  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Inviter des agences</h1>
        <p style={{fontSize:13,color:T.sec}}>Générez des codes pour que les agences puissent s'inscrire sur Diamond's</p>
      </div>
      <div className="card" style={{padding:20,marginBottom:16}}>
        <div style={{fontWeight:600,fontSize:13,color:T.tx,marginBottom:8}}>Nouveau code agence</div>
        <p style={{fontSize:12,color:T.sec,marginBottom:14}}>L'agence utilise ce code lors de son inscription pour accéder à l'espace agence.</p>
        <button className="btn" onClick={generateCode} disabled={generating}>
          {generating?<><Spin/>Génération…</>:"+ Générer un code"}
        </button>
      </div>
      {codes.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:"1px solid rgba(255,255,255,0.06)",borderRadius:12}}>
          Aucun code généré
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{codes.length} code{codes.length>1?"s":""}</div>
          {codes.map(c=>(
            <div key={c.id} className="card" style={{padding:14,display:"flex",alignItems:"center",gap:12}}>
              <code style={{flex:1,fontSize:14,fontWeight:700,fontFamily:"monospace",letterSpacing:".08em",color:T.acc}}>{c.code}</code>
              <div style={{fontSize:11,color:T.sec}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</div>
              <button className="btng" onClick={()=>cp(c.code)}>{copied===c.code?"✓ Copié":"Copier"}</button>
              <button className="btng" style={{color:T.ng}} onClick={()=>del(c.id)}>Suppr.</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN ALL USERS ────────────────────── */
function AdminAllUsersView(){
  const [profiles,setProfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  useEffect(()=>{
    Promise.all([fetchAllProfiles(),fetchAllAgencies(),fetchAllCreators()]).then(([p,a,c])=>{
      setProfiles(enrichProfilesForAdmin(p,a,c));setLoading(false);
    });
  },[]);
  const filtered=profiles.filter(p=>{
    const s=!search||p.email?.toLowerCase().includes(search.toLowerCase())||p.tiktok_handle?.toLowerCase().includes(search.toLowerCase())||p.role?.toLowerCase().includes(search.toLowerCase())||p.displayRole?.toLowerCase().includes(search.toLowerCase());
    const f=filter==="all"||p.displayRole===filter;
    return s&&f;
  });
  const roleC={admin:T.acc,agency:"#38BDF8",director:"#818CF8",manager:"#34D399",agent:"#60A5FA",creator:"#F472B6"};
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Utilisateurs</h1>
        <p style={{fontSize:13,color:T.sec}}>Tous les inscrits sur Diamond's</p>
      </div>
      <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total" val={profiles.length} accent={T.acc}/>
        <SC label="Agences" val={profiles.filter(p=>p.displayRole==="agency").length}/>
        <SC label="Staff" val={profiles.filter(p=>["director","manager","agent"].includes(p.displayRole)).length}/>
        <SC label="Créateurs" val={profiles.filter(p=>p.displayRole==="creator").length}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <input className="inp" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:130}}>
          <option value="all">Tous</option>
          <option value="agency">Agence</option>
          <option value="director">Directeur</option>
          <option value="manager">Manager</option>
          <option value="agent">Agent</option>
          <option value="creator">Créateur</option>
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:11,fontWeight:600,color:T.sec}}>{filtered.length} utilisateur{filtered.length>1?"s":""}</div>
        {filtered.map(p=>(
          <div key={p.id} className="cr" style={{gridTemplateColumns:"1fr 120px 90px 80px"}}>
            <div><div style={{fontWeight:500,fontSize:12.5,color:T.tx}}>{p.email}</div>
              {p.tiktok_handle&&<div style={{fontSize:11,color:T.sec}}>@{p.tiktok_handle}</div>}</div>
            <div style={{fontSize:11,color:T.sec}}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
            <span className="tag" style={{background:`${roleC[p.displayRole]||T.sec}15`,color:roleC[p.displayRole]||T.sec}}>{roleLabelFr(p.displayRole)}</span>
            <div style={{fontSize:11,color:p.tiktok_handle?T.ok:T.ng}}>{p.tiktok_handle?"✓ TikTok":"— TikTok"}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ─── ADMIN ALL CREATORS ─────────────────── */
function AdminAllCreatorsView(){
  const [creators,setCreators]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("diamonds");
  useEffect(()=>{fetchAllCreators().then(d=>{setCreators(d);setLoading(false);});},[]);
  const filtered=creators.filter(c=>!search||c.pseudo?.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>{
    if(sortBy==="diamonds") return (b.diamonds||0)-(a.diamonds||0);
    if(sortBy==="days") return (b.days_live||0)-(a.days_live||0);
    return new Date(b.created_at)-new Date(a.created_at);
  });
  const totalD=creators.reduce((s,c)=>s+(c.diamonds||0),0);
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Créateurs</h1>
        <p style={{fontSize:13,color:T.sec}}>Tous les créateurs TikTok sur la plateforme</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total" val={creators.length} accent={T.acc}/>
        <SC label="💎 Diamants cumulés" val={totalD.toLocaleString()} accent={T.acc}/>
        <SC label="Moyenne diamants" val={creators.length?Math.round(totalD/creators.length).toLocaleString():"0"}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <input className="inp" placeholder="Rechercher par pseudo…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        <select className="inp" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:140}}>
          <option value="diamonds">Tri : Diamants</option>
          <option value="days">Tri : Jours live</option>
          <option value="date">Tri : Date</option>
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}><div style={{minWidth:500}}>
          <div className="cr" style={{gridTemplateColumns:"1fr 90px 55px 55px 80px",background:"rgba(255,255,255,0.02)",fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em"}}>
            <div>Pseudo</div><div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div>
          </div>
          {filtered.map(c=>(
            <div key={c.id} className="cr" style={{gridTemplateColumns:"1fr 90px 55px 55px 80px"}}>
              <div style={{fontWeight:500,fontSize:12.5,color:T.tx}}>{c.pseudo||"—"}</div>
              <div style={{fontWeight:700,color:T.acc,fontSize:12}}>{(c.diamonds||0).toLocaleString()}</div>
              <div style={{fontSize:12,color:(c.days_live||0)>=20?T.ok:T.txD}}>{c.days_live||0}j</div>
              <div style={{fontSize:12,color:(c.hours_live||0)>=40?T.ok:T.txD}}>{c.hours_live||0}h</div>
              <span className="tag" style={{background:c.diamonds>0?`${T.ok}15`:"rgba(255,255,255,0.05)",color:c.diamonds>0?T.ok:T.sec}}>Actif</span>
            </div>
          ))}
        </div></div>
      </div>}
    </div>
  );
}

/* ─── ADMIN ALL STAFF ────────────────────── */
function AdminAllStaffView(){
  const [all,setAll]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  useEffect(()=>{
    Promise.all([fetchAllAgents(),fetchAllManagers(),fetchAllDirectors()]).then(([ag,mg,dr])=>{
      setAll([...ag.map(x=>({...x,type:"agent"})),...mg.map(x=>({...x,type:"manager"})),...dr.map(x=>({...x,type:"director"}))]);
      setLoading(false);
    });
  },[]);
  const filtered=all.filter(s=>{
    const m=!search||s.name?.toLowerCase().includes(search.toLowerCase())||s.email?.toLowerCase().includes(search.toLowerCase());
    const f=filter==="all"||s.type===filter;
    return m&&f;
  });
  const tC={agent:"#60A5FA",manager:"#34D399",director:"#818CF8"};
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Staff</h1>
        <p style={{fontSize:13,color:T.sec}}>Agents, managers et directeurs</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        <SC label="Agents" val={all.filter(s=>s.type==="agent").length} accent="#60A5FA"/>
        <SC label="Managers" val={all.filter(s=>s.type==="manager").length} accent="#34D399"/>
        <SC label="Directeurs" val={all.filter(s=>s.type==="director").length} accent="#818CF8"/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <input className="inp" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:130}}>
          <option value="all">Tous</option>
          <option value="agent">Agents</option>
          <option value="manager">Managers</option>
          <option value="director">Directeurs</option>
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      <div className="card" style={{overflow:"hidden"}}>
        {filtered.map(s=>(
          <div key={s.id} className="cr" style={{gridTemplateColumns:"36px 1fr 100px 90px"}}>
            <AV name={(s.name||"?").slice(0,2)} color={tC[s.type]||T.acc} size={28}/>
            <div><div style={{fontWeight:500,fontSize:12.5,color:T.tx}}>{s.name||"—"}</div><div style={{fontSize:11,color:T.sec}}>{s.email}</div></div>
            <div style={{fontSize:11,color:T.sec}}>{s.phone||"—"}</div>
            <span className="tag" style={{background:`${tC[s.type]}15`,color:tC[s.type]}}>{s.type}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ─── ADMIN ALL MATCHES ──────────────────── */
function AdminAllMatchesView(){
  const [matches,setMatches]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchAllMatches().then(d=>{setMatches(d);setLoading(false);});},[]);
  const sC={pending:T.go,confirmed:T.ok,done:T.sec,cancelled:T.ng};
  const sL={pending:"En attente",confirmed:"Confirmé",done:"Terminé",cancelled:"Annulé"};
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Tous les matchs</h1>
        <p style={{fontSize:13,color:T.sec}}>Vue globale des matchs TikTok Live</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total" val={matches.length} accent={T.acc}/>
        <SC label="En attente" val={matches.filter(m=>m.status==="pending").length} accent={T.go}/>
        <SC label="Confirmés" val={matches.filter(m=>m.status==="confirmed").length} accent={T.ok}/>
        <SC label="Inter-agences" val={matches.filter(m=>m.is_inter_agency).length}/>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      matches.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:"1px solid rgba(255,255,255,0.06)",borderRadius:12}}>Aucun match</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 85px",background:"rgba(255,255,255,0.02)",fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em"}}>
          <div>Date</div><div>Match</div><div>Heure</div><div>Type</div><div>Statut</div>
        </div>
        {matches.map(m=>(
          <div key={m.id} className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 85px"}}>
            <div style={{fontWeight:500,fontSize:12,color:T.tx}}>{m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):"—"}</div>
            <div style={{fontSize:12,color:T.txD}}>Match {m.is_inter_agency?"inter":"intra"}-agence</div>
            <div style={{fontSize:12,color:T.sec}}>{m.match_time||"—"}</div>
            <span className="tag" style={{background:m.is_inter_agency?`${T.acc}15`:"rgba(255,255,255,0.05)",color:m.is_inter_agency?T.acc:T.sec}}>{m.is_inter_agency?"Inter":"Intra"}</span>
            <span className="tag" style={{background:`${sC[m.status]||T.go}15`,color:sC[m.status]||T.go}}>{sL[m.status]||"—"}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ─── ADMIN ALL SCHEDULES ────────────────── */
function AdminAllSchedulesView(){
  const [schedules,setSchedules]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchAllSchedules().then(d=>{setSchedules(d);setLoading(false);});},[]);
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Plannings</h1>
        <p style={{fontSize:13,color:T.sec}}>Tous les créneaux live déclarés</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total créneaux" val={schedules.length} accent={T.acc}/>
        <SC label="Inter-agences" val={schedules.filter(s=>s.accept_inter_agency).length} accent={T.acc}/>
        {DAYS.slice(0,2).map((d,i)=><SC key={i} label={d} val={schedules.filter(s=>s.day_of_week===i).length}/>)}
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      schedules.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:"1px solid rgba(255,255,255,0.06)",borderRadius:12}}>Aucun planning</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div className="cr" style={{gridTemplateColumns:"80px 120px 1fr 80px",background:"rgba(255,255,255,0.02)",fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em"}}>
          <div>Jour</div><div>Horaires</div><div>Notes</div><div>Type</div>
        </div>
        {schedules.map(s=>(
          <div key={s.id} className="cr" style={{gridTemplateColumns:"80px 120px 1fr 80px"}}>
            <div style={{fontWeight:500,fontSize:12,color:T.tx}}>{DAYS[s.day_of_week]||"—"}</div>
            <div style={{fontSize:12,color:T.txD}}>{s.start_time?.slice(0,5)||"—"} → {s.end_time?.slice(0,5)||"—"}</div>
            <div style={{fontSize:11,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.notes||"—"}</div>
            <span className="tag" style={{background:s.accept_inter_agency?`${T.acc}15`:"rgba(255,255,255,0.05)",color:s.accept_inter_agency?T.acc:T.sec}}>{s.accept_inter_agency?"Inter":"Intra"}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ─── ADMIN ALL LIVES ────────────────────── */
function AdminAllLivesView(){
  const [lives,setLives]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sortBy,setSortBy]=useState("diamonds");
  useEffect(()=>{fetchAllLiveEntries().then(d=>{setLives(d);setLoading(false);});},[]);
  const sorted=[...lives].sort((a,b)=>{
    if(sortBy==="diamonds") return (b.diamonds||0)-(a.diamonds||0);
    if(sortBy==="viewers") return (b.viewers||0)-(a.viewers||0);
    if(sortBy==="duration") return (b.duration_minutes||0)-(a.duration_minutes||0);
    return new Date(b.live_date)-new Date(a.live_date);
  });
  const totalD=lives.reduce((s,l)=>s+(l.diamonds||0),0);
  const totalV=lives.reduce((s,l)=>s+(l.viewers||0),0);
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Lives</h1>
        <p style={{fontSize:13,color:T.sec}}>Tous les lives enregistrés manuellement</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total" val={lives.length} accent={T.acc}/>
        <SC label="💎 Diamants" val={totalD.toLocaleString()} accent={T.acc}/>
        <SC label="👁 Spectateurs" val={totalV.toLocaleString()}/>
        <SC label="Durée moy." val={lives.length?`${Math.round(lives.reduce((s,l)=>s+(l.duration_minutes||0),0)/lives.length)}min`:"—"}/>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
        <select className="inp" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:150}}>
          <option value="date">Tri : Date</option>
          <option value="diamonds">Tri : Diamants</option>
          <option value="viewers">Tri : Spectateurs</option>
          <option value="duration">Tri : Durée</option>
        </select>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}><Spin/></div>:
      lives.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:"1px solid rgba(255,255,255,0.06)",borderRadius:12}}>Aucun live</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 1fr",background:"rgba(255,255,255,0.02)",fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em"}}>
          <div>Date</div><div>💎 Diamants</div><div>Durée</div><div>👁 Spectat.</div><div>Notes</div>
        </div>
        {sorted.map(l=>(
          <div key={l.id} className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 1fr"}}>
            <div style={{fontWeight:500,fontSize:12,color:T.tx}}>{new Date(l.live_date).toLocaleDateString("fr-FR")}</div>
            <div style={{fontWeight:700,color:T.acc,fontSize:12}}>{(l.diamonds||0).toLocaleString()}</div>
            <div style={{fontSize:12,color:T.txD}}>{Math.round((l.duration_minutes||0)/60*10)/10}h</div>
            <div style={{fontSize:12,color:T.txD}}>{(l.viewers||0).toLocaleString()}</div>
            <div style={{fontSize:11,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.notes||"—"}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}


/* ─── ADMIN POSTER TEMPLATES ────────────── */
function AdminPosterTemplatesView(){
  const demoA={pseudo:"@créateur_A",tiktok_avatar_url:null};
  const demoB={pseudo:"@créateur_B",tiktok_avatar_url:null};
  const today=new Date().toISOString().split("T")[0];
  const LABELS={gold:"Fond sombre doré",purple:"Nuit violette",space:"Espace cyan",rose:"Roses & fleurs",fire:"Flammes rouges",emerald:"Forêt émeraude"};
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Templates d'affiches</h1>
        <p style={{fontSize:13,color:T.sec}}>Cliquez sur "Affiche 🖼" dans un match pour choisir un template et télécharger</p>
      </div>
      <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(37,99,235,0.08)",border:"1px solid rgba(37,99,235,0.2)",fontSize:12,color:"#60A5FA",marginBottom:20}}>
        💡 Les vraies photos TikTok des créateurs s'affichent automatiquement si elles sont uploadées dans leur profil
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {POSTER_TEMPLATES.map(tmpl=>(
          <div key={tmpl.id} style={{borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.08)"}}>
            <PosterPreview tmpl={tmpl} cA={demoA} cB={demoB} matchDate={today} matchTime="20:00" isInter={false} mini={true}/>
            <div style={{background:"#111",padding:"8px 10px",textAlign:"center"}}>
              <div style={{fontSize:10,fontWeight:700,color:tmpl.acc,letterSpacing:".05em",textTransform:"uppercase"}}>{tmpl.label}</div>
              <div style={{fontSize:10,color:"#555",marginTop:2}}>{LABELS[tmpl.id]||""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── COACH IA ──────────────────────────── */
const GROQ_KEY = import.meta.env.VITE_GROQ_KEY||"";
const TIKTOK_RATE = 0.017; // ~0.017€ par diamant (taux TikTok officiel)

function diamondsToEuros(diamonds) {
  // TikTok paie ~0.017€ par diamant au créateur (net, après commission TikTok ~50%)
  return (diamonds * TIKTOK_RATE).toFixed(2);
}

function CoachView({profile,creators,ag}){
  const role=profile?.role;
  const isAgencyOrAdminInit=role==="agency"||role==="admin";
  const [messages,setMessages]=useState([
    {role:"assistant",content:isAgencyOrAdminInit?"Bonjour 👋 Je suis Diamond Coach Pro, ton assistant IA pour gérer et développer ton agence TikTok Live ! Recrutement, staff, stratégie, revenus, matchs… pose-moi toutes tes questions !":"Bonjour 👋 Je suis Diamond Coach, ton expert TikTok Live 2026 ! Diamants, viewers, PK Battles, stratégies… je suis là pour booster tes performances. Que veux-tu savoir ?"}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef();
  
  // Find creator data for context
  const myCreator=creators?.[0];
  const minDays=myCreator?.custom_min_days||ag?.min_days||20;
  const minHours=myCreator?.custom_min_hours||ag?.min_hours||40;
  const days=myCreator?.days_live||0;
  const hours=myCreator?.hours_live||0;
  const diamonds=myCreator?.diamonds||0;

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  // Prompt différent selon le rôle
  const isAgencyOrAdmin = isAgencyOrAdminInit;
  const SYSTEM_PROMPT = isAgencyOrAdmin ? `Tu es Diamond Coach Pro, l'assistant IA expert en gestion d'agence TikTok LIVE de Diamond's by Belive Academy.
Tu conseilles les fondateurs d'agence sur tous les aspects : recrutement, gestion du staff, stratégie, revenus, créateurs.

━━━ CONTEXTE AGENCE ━━━
Tu peux parler librement de : gestion de créateurs, recrutement, reversements, organisation du staff (agents/managers/directeurs), stratégie de croissance d'agence, matchs TikTok Live, import Backstage, objectifs mensuels.
Taux TikTok : 0.017€/diamant (net TikTok au créateur avant reversement agence).

━━━ EXPERTISE AGENCE TIKTOK LIVE 2026 ━━━
- Recrutement créateurs : cibler les profils avec 10k+ followers, régularité de live, engagement > 3%
- Structure agence optimale : 1 manager pour 3-5 agents, 1 agent pour 8-12 créateurs
- Objectifs standards : 20 jours de live / 40h minimum par créateur par mois
- Revenus : créateurs = 55%, agent = 10%, manager = 5%, directeur = 3%, agence = reste
- Matchs TikTok Live : boostent visibilité des créateurs de 30-50% et génèrent plus de diamants
- Import Backstage mensuel essentiel pour suivre les performances précises
- Peak hours France : 19h-22h semaine, 14h-18h weekend
- Stratégie de rétention : bonus créateurs performants, coaching personnalisé, objectifs progressifs
- Partenariats inter-agences : matchs PK avec agences amies pour booster tout le monde

Style : professionnel mais dynamique, emojis, conseils actionnables et chiffrés, max 4 paragraphes.`
  : `Tu es Diamond Coach, l'assistant IA expert TikTok LIVE de Diamond's by Belive Academy.
Tu as accès aux dernières informations TikTok Live 2026 et tu te mets à jour en permanence.

━━━ RÈGLES ABSOLUES ━━━
• JAMAIS mention agences / reversements agence / commissions agence / organisation interne
• Argent = uniquement taux TikTok officiel 2026 : ~0.017€/diamant versé directement par TikTok au créateur
• Toujours préciser "TikTok te verse directement X€"
• Rester 100% sur l'univers TikTok Live

━━━ STATS DU CRÉATEUR ━━━
Jours live : ${days}/${minDays} · Heures : ${hours}h/${minHours}h · Diamants : ${diamonds.toLocaleString()} 💎 ≈ ${diamondsToEuros(diamonds)}€
${days<minDays?"⚠️ "+(minDays-days)+" jours manquants pour l'objectif":"✅ Objectif jours atteint"}
${hours<minHours?"⚠️ "+(minHours-hours)+"h manquantes pour l'objectif":"✅ Objectif heures atteint"}

━━━ CONVERSIONS DIAMANTS → EUROS ━━━
100💎=1.70€ · 1k💎=17€ · 10k💎=170€ · 100k💎=1700€ · 1M💎=17 000€

━━━ TIKTOK LIVE 2026 ━━━
- 3 premières minutes cruciales · Régularité > durée · PK Battles boostent la visibilité
- Peak hours France : 19h-22h semaine · 14h-18h weekend
- Cadeaux populaires : Rose 1💎 · Drama Queen 1000💎 · Lion 29999💎 · Universe 34999💎
- Paliers : Bronze → Silver → Gold → Platinum → Diamond

Style : français dynamique, motivant, emojis, max 3 paragraphes, TOUJOURS un conseil actionnable.`;



  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    const newMessages=[...messages,userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    if(!GROQ_KEY){
      setMessages(m=>[...m,{role:"assistant",content:"⚠️ Clé Groq manquante.\nVercel → Settings → Environment Variables → ajoute VITE_GROQ_KEY avec ta clé Groq (gsk_...) → Redeploy.\n\nGroq est 100% gratuit sur groq.com"}]);
      setLoading(false);return;
    }
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+GROQ_KEY
        },
        body:JSON.stringify({
          model:"llama-3.3-70b-versatile",
          max_tokens:1000,
          messages:[
            {role:"system",content:SYSTEM_PROMPT},
            ...newMessages.map(m=>({role:m.role,content:m.content}))
          ]
        })
      });
      const data=await res.json();
      if(data.error){
        setMessages(m=>[...m,{role:"assistant",content:"⚠️ Erreur Groq: "+data.error.message}]);
      } else {
        const reply=data.choices?.[0]?.message?.content||"Désolé, réessaie !";
        setMessages(m=>[...m,{role:"assistant",content:reply}]);
      }
    }catch(e){
      setMessages(m=>[...m,{role:"assistant",content:"⚠️ Erreur réseau: "+e.message}]);
    }
    setLoading(false);
  };

  const suggestions=isAgencyOrAdmin?[
    "Comment recruter de bons créateurs ?",
    "Quelle structure de staff est optimale ?",
    "Comment booster les revenus de mon agence ?",
    "Stratégies pour les matchs TikTok Live ?",
    "Comment motiver mes créateurs ?",
  ]:[
    "Comment augmenter mes diamants ?",
    `J'ai ${diamonds} 💎, combien ça fait en euros ?`,
    "Meilleurs horaires pour un live ?",
    "Comment gagner un PK Battle ?",
    "Conseils pour mon objectif ce mois ?",
  ];

  // coach_enabled check : seulement pour les non-agences/non-admin
  if(ag&&ag.coach_enabled===false&&role!=="agency"&&role!=="admin") return(
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:40,marginBottom:16}}>🤖</div>
      <h2 style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:8}}>Coach IA désactivé</h2>
      <p style={{fontSize:14,color:"#555"}}>Votre agence n'a pas encore activé le Coach IA.<br/>Contactez votre responsable.</p>
    </div>
  );

  return(
    <div className="fup" style={{height:"calc(100vh - 80px)",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:16,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
          <div style={{width:40,height:40,borderRadius:12,background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🤖</div>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,color:"#fff",letterSpacing:"-.02em"}}>Coach IA TikTok Live</h1>
            <p style={{fontSize:12,color:"#555"}}>Propulsé par Groq (gratuit) · Spécialisé TikTok Live</p>
          </div>
        </div>
        {/* Creator stats banner */}
        {myCreator&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>
            <div style={{background:"#151515",border:"1px solid #1e1e1e",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Jours live</div>
              <div style={{fontSize:16,fontWeight:700,color:days>=minDays?"#22C55E":"#2563EB"}}>{days}<span style={{fontSize:11,color:"#444"}}>/{minDays}</span></div>
            </div>
            <div style={{background:"#151515",border:"1px solid #1e1e1e",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Heures live</div>
              <div style={{fontSize:16,fontWeight:700,color:hours>=minHours?"#22C55E":"#2563EB"}}>{hours}h<span style={{fontSize:11,color:"#444"}}>/{minHours}h</span></div>
            </div>
            <div style={{background:"#151515",border:"1px solid #1e1e1e",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>💎 Diamants</div>
              <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{diamonds>=1000?(diamonds/1000).toFixed(1)+"k":diamonds}</div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,marginBottom:12,paddingRight:4}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:8,background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginRight:8,marginTop:2}}>🤖</div>}
            <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?"#2563EB":"#1a1a1a",border:m.role==="user"?"none":"1px solid #222",fontSize:13.5,lineHeight:1.65,color:"#fff",whiteSpace:"pre-wrap"}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(37,99,235,0.15)",border:"1px solid rgba(37,99,235,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{padding:"10px 14px",background:"#1a1a1a",border:"1px solid #222",borderRadius:"12px 12px 12px 2px",display:"flex",gap:6,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#2563EB",animation:`sp2 1s ${i*0.15}s ease-in-out infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Suggestions */}
      {messages.length<=1&&(
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10,flexShrink:0}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>setInput(s)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #222",background:"#151515",color:"#888",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all .12s"}}
              onMouseEnter={e=>{e.target.style.borderColor="#2563EB";e.target.style.color="#fff";}}
              onMouseLeave={e=>{e.target.style.borderColor="#222";e.target.style.color="#888";}}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{display:"flex",gap:8,flexShrink:0}}>
        <input className="inp" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="Pose ta question sur TikTok Live…" style={{flex:1,fontSize:14}}/>
        <button className="btn" onClick={send} disabled={loading||!input.trim()} style={{padding:"11px 18px",flexShrink:0}}>
          {loading?<Spin/>:"→"}
        </button>
      </div>
    </div>
  );
}

/* ─── INDIVIDUAL CREATOR TARGETS ────────── */
function CreatorTargetsModal({creator,ag,onClose,onSave}){
  const [days,setDays]=useState(creator?.custom_min_days||ag?.min_days||20);
  const [hours,setHours]=useState(creator?.custom_min_hours||ag?.min_hours||40);
  const [saving,setSaving]=useState(false);

  const save=async()=>{
    if(!sb||!creator?.id) return;
    setSaving(true);
    await sb.from("creators").update({custom_min_days:days,custom_min_hours:hours}).eq("id",creator.id);
    setSaving(false);
    onSave?.();
    onClose();
  };
  const reset=async()=>{
    if(!sb||!creator?.id) return;
    setSaving(true);
    await sb.from("creators").update({custom_min_days:null,custom_min_hours:null}).eq("id",creator.id);
    setSaving(false);
    onSave?.();
    onClose();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#151515",border:"1px solid #222",borderRadius:16,padding:28,width:"100%",maxWidth:380}}>
        <h2 style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:4,letterSpacing:"-.02em"}}>Objectifs personnalisés</h2>
        <p style={{fontSize:13,color:"#555",marginBottom:20}}>Pour <strong style={{color:"#2563EB"}}>{creator?.pseudo||"ce créateur"}</strong></p>

        <div style={{background:"rgba(37,99,235,0.06)",border:"1px solid rgba(37,99,235,0.12)",borderRadius:10,padding:"10px 14px",marginBottom:20,fontSize:12,color:"#666"}}>
          Objectifs généraux : {ag?.min_days||20}j / {ag?.min_hours||40}h · Si non défini ici, les objectifs généraux s'appliquent
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:24}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:".06em"}}>Jours de live minimum</label>
              <span style={{fontSize:16,fontWeight:700,color:"#2563EB"}}>{days}j</span>
            </div>
            <input type="range" min={1} max={31} step={1} value={days} onChange={e=>setDays(+e.target.value)}/>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <label style={{fontSize:12,fontWeight:600,color:"#888",textTransform:"uppercase",letterSpacing:".06em"}}>Heures de live minimum</label>
              <span style={{fontSize:16,fontWeight:700,color:"#2563EB"}}>{hours}h</span>
            </div>
            <input type="range" min={1} max={200} step={1} value={hours} onChange={e=>setHours(+e.target.value)}/>
          </div>
        </div>

        <div style={{display:"flex",gap:8}}>
          <button className="btn" style={{flex:1,justifyContent:"center"}} onClick={save} disabled={saving}>
            {saving?<Spin/>:"Enregistrer"}
          </button>
          <button className="btng" onClick={reset} disabled={saving} title="Revenir aux objectifs généraux">
            Réinitialiser
          </button>
          <button className="btng" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}


/* ─── ADMIN MEMBERS VIEW ────────────────── */
function AdminMembersView(){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [newPw,setNewPw]=useState("");
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");
  const [showPw,setShowPw]=useState(false);

  useEffect(()=>{
    const load=async()=>{
      const [profiles,agencies,creators]=await Promise.all([
        fetchAllProfiles(),
        fetchAllAgencies(),
        fetchAllCreators()
      ]);
      setUsers(enrichProfilesForAdmin(profiles,agencies,creators));
      setLoading(false);
    };
    load();
  },[]);

  const filtered=users.filter(u=>{
    if(!search) return true;
    const s=search.toLowerCase();
    return (u.email||"").toLowerCase().includes(s)||
           (u.tiktok_handle||"").toLowerCase().includes(s)||
           (u.role||"").toLowerCase().includes(s)||
           (u.displayRole||"").toLowerCase().includes(s)||
           roleLabelFr(u.displayRole).toLowerCase().includes(s);
  });

  const roleColor={admin:"#2563EB",agency:"#3B82F6",director:"#818CF8",manager:"#34D399",agent:"#60A5FA",creator:"#F472B6"};

  const changePassword=async()=>{
    if(!selected||!newPw.trim()){setMsg("Remplis tous les champs");return;}
    if(newPw.length<6){setMsg("Minimum 6 caractères");return;}
    setSaving(true);setMsg("");
    try{
      // Use Supabase Admin REST API with service role key
      const SUPA_URL=import.meta.env.VITE_SUPABASE_URL;
      const SUPA_KEY=import.meta.env.VITE_SUPABASE_SERVICE_KEY||import.meta.env.VITE_SUPABASE_ANON_KEY;
      const res=await fetch(`${SUPA_URL}/auth/v1/admin/users/${selected.id}`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "apikey":SUPA_KEY,
          "Authorization":`Bearer ${SUPA_KEY}`
        },
        body:JSON.stringify({password:newPw})
      });
      const data=await res.json();
      if(res.ok){
        setMsg("✓ Mot de passe modifié pour "+selected.email);
        setNewPw("");
        setTimeout(()=>{setSelected(null);setMsg("");},2000);
      } else {
        // Fallback to RPC
        const {data:rpcData,error:rpcErr}=await sb.rpc("admin_change_password",{p_user_id:selected.id,p_new_password:newPw});
        if(rpcErr||rpcData?.success===false){
          setMsg("❌ "+(rpcData?.error||rpcErr?.message||data?.message||"Erreur"));
        } else {
          setMsg("✓ Mot de passe modifié pour "+selected.email);
          setNewPw("");
          setTimeout(()=>{setSelected(null);setMsg("");},2000);
        }
      }
    }catch(e){setMsg("❌ Erreur: "+e.message);}
    setSaving(false);
  };

  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:4,letterSpacing:"-.02em"}}>Gestion des membres</h1>
        <p style={{fontSize:13,color:"#555"}}>Recherche par email ou @ TikTok · Réinitialise les mots de passe</p>
      </div>

      {/* Stats */}
      <div className="admin-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total membres" val={users.length} accent="#2563EB"/>
        <SC label="Agences" val={users.filter(u=>u.displayRole==="agency").length}/>
        <SC label="Staff" val={users.filter(u=>["director","manager","agent"].includes(u.displayRole)).length}/>
        <SC label="Créateurs" val={users.filter(u=>u.displayRole==="creator").length}/>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14}}>
        <input className="inp" placeholder="🔍  Rechercher par email, @TikTok, rôle..." value={search} onChange={e=>setSearch(e.target.value)} style={{fontSize:14,padding:"12px 14px"}}/>
        {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:16}}>✕</button>}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16,alignItems:"stretch"}} className="members-layout">

        {/* Users list */}
        <div style={{flex:1,minWidth:0,width:"100%"}}>
          {loading?<div style={{textAlign:"center",padding:30,color:"#555"}}><Spin/></div>:
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:"1px solid #1e1e1e",fontSize:11,fontWeight:600,color:"#555",textTransform:"uppercase",letterSpacing:".06em"}}>
              {filtered.length} membre{filtered.length>1?"s":""}
            </div>
            {filtered.length===0&&<div style={{padding:"30px 20px",textAlign:"center",color:"#555",fontSize:13}}>Aucun résultat</div>}
            {filtered.map(u=>(
              <div key={u.id} onClick={()=>{setSelected(u);setNewPw("");setMsg("");}}
                style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderBottom:"1px solid #1a1a1a",cursor:"pointer",background:selected?.id===u.id?"rgba(37,99,235,0.08)":"transparent",transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=selected?.id===u.id?"rgba(37,99,235,0.08)":"#191919"}
                onMouseLeave={e=>e.currentTarget.style.background=selected?.id===u.id?"rgba(37,99,235,0.08)":"transparent"}>
                <div style={{width:36,height:36,borderRadius:10,background:`${roleColor[u.displayRole]||"#555"}18`,border:`1px solid ${roleColor[u.displayRole]||"#555"}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:roleColor[u.displayRole]||"#555",fontWeight:700,flexShrink:0}}>
                  {(u.tiktok_handle||u.email||"?").replace("@","")[0]?.toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                  <div style={{fontSize:11,color:"#555",marginTop:1}}>{u.tiktok_handle||"Pas de @ TikTok"}</div>
                </div>
                <span style={{fontSize:10,fontWeight:600,color:roleColor[u.displayRole]||"#555",background:`${roleColor[u.displayRole]||"#555"}15`,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:".04em",flexShrink:0}}>{roleLabelFr(u.displayRole)}</span>
              </div>
            ))}
          </div>}
        </div>

        {/* Password reset panel */}
        {selected&&(
          <div style={{width:"100%",maxWidth:380,flexShrink:0}}>
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>Modifier le mot de passe</div>
                <button onClick={()=>{setSelected(null);setMsg("");}} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:16}}>✕</button>
              </div>

              {/* User info */}
              <div style={{background:"#111",borderRadius:8,padding:"10px 12px",marginBottom:16}}>
                <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.email}</div>
                <div style={{fontSize:11,color:"#555"}}>{selected.tiktok_handle||"Pas de @ TikTok"} · <span style={{color:roleColor[selected.displayRole]||"#555"}}>{roleLabelFr(selected.displayRole)}</span></div>
              </div>

              {/* New password */}
              <div style={{marginBottom:12}}>
                <label style={{fontSize:11,fontWeight:600,color:"#555",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:".06em"}}>Nouveau mot de passe</label>
                <div style={{position:"relative"}}>
                  <input className="inp" type={showPw?"text":"password"} value={newPw} onChange={e=>setNewPw(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&changePassword()}
                    placeholder="Min. 6 caractères" style={{paddingRight:40}}/>
                  <button onClick={()=>setShowPw(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:15}}>
                    {showPw?"🙈":"👁"}
                  </button>
                </div>
              </div>

              {msg&&<div style={{padding:"8px 10px",borderRadius:8,background:msg.startsWith("✓")?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${msg.startsWith("✓")?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,fontSize:12,color:msg.startsWith("✓")?"#22C55E":"#EF4444",marginBottom:12}}>{msg}</div>}

              <button className="btn" style={{width:"100%",justifyContent:"center",padding:"11px",fontSize:13}} onClick={changePassword} disabled={saving||!newPw.trim()}>
                {saving?<><Spin/>Modification…</>:"🔑 Changer le mot de passe"}
              </button>

              <div style={{marginTop:10,fontSize:11,color:"#333",textAlign:"center",lineHeight:1.5}}>
                Si ça échoue → Supabase Dashboard<br/>→ Authentication → Users → cet utilisateur
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── APP ROOT ──────────────────────────── */
export default function App(){
  const auth=useAuth();
  const [tab,setTab]=useState("dash");
  const [team,setTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [loadT,setLT]=useState(false);
  const [navOpen,setNavOpen]=useState(false);
  const [isNarrow,setIsNarrow]=useState(typeof window!=="undefined"?window.matchMedia("(max-width:899px)").matches:false);
  const role=auth.profile?.role;
  const agencyId=auth.profile?.agency_id;
  const ag=auth.profile?.agencies;

  useEffect(()=>{if(agencyId){setLT(true);fetchTeam(agencyId,auth.profile?.id,role).then(d=>{setTeam(d);setLT(false);})};},[agencyId]);
  useEffect(()=>{setTab("dash");},[role]);
  useEffect(()=>{
    const mq=window.matchMedia("(max-width:899px)");
    const fn=()=>{setIsNarrow(mq.matches);if(!mq.matches)setNavOpen(false);};
    mq.addEventListener("change",fn);
    fn();
    return ()=>mq.removeEventListener("change",fn);
  },[]);
  useEffect(()=>{setNavOpen(false);},[tab]);

  const reload=()=>{auth.reload();if(agencyId) fetchTeam(agencyId,auth.profile?.id,role).then(setTeam);};

  if(auth.loading) return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Brand big={true}/></div>
          <div style={{width:28,height:28,borderRadius:"50%",border:"3px solid rgba(127,0,255,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto"}}/></div>
      </div>
    </>
  );

  if(!auth.user) return <><style>{css}</style><LoginPage/></>;

  // Gate: @TikTok obligatoire sauf admin/agency
  const needsHandle = role && !["admin","agency"].includes(role) && !auth.profile?.agency_id && !auth.profile.tiktok_handle;
  if(needsHandle && tab!=="settings") {
    return(
      <>
        <style>{css}</style>
        <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{width:"100%",maxWidth:440}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Brand big={true}/></div>
            </div>
            <div style={{background:"#151515",borderRadius:16,border:"1px solid #222",padding:28}}>
              <div style={{fontSize:28,marginBottom:16}}>📱</div>
              <h1 style={{fontSize:24,fontWeight:700,marginBottom:8,letterSpacing:"-.02em"}}>Complète ton profil</h1>
              <p style={{fontSize:14,color:"#555",marginBottom:24,lineHeight:1.65}}>Ajoute ton <strong style={{color:"#fff"}}>@ TikTok</strong> et ta <strong style={{color:"#fff"}}>photo de profil</strong> pour accéder à Diamond's.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
                {["@ TikTok exact (identique à ton compte)","Ta photo de profil TikTok","Apparaîtront sur tes affiches de match"].map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"#2563EB",flexShrink:0}}/>
                    <span style={{fontSize:13,color:"#888"}}>{f}</span>
                  </div>
                ))}
              </div>
              <button className="btn" style={{width:"100%",padding:"13px",fontSize:14}} onClick={()=>setTab("settings")}>Compléter mon profil →</button>
            </div>
            <div style={{textAlign:"right",marginTop:10}}>
              <button className="btng" onClick={auth.signOut} style={{fontSize:11}}>Se déconnecter</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isBlocked=role!=="admin"&&role!=="agency"&&!auth.profile?.agency_id&&ag&&ag.billing_status==="impayé"&&!ag.is_offered;
  const needsPayment=(role==="agency"||!!auth.profile?.agency_id)&&ag&&ag.billing_status==="impayé"&&!ag.is_offered;
  const nav=NAVS[role]||NAVS["admin"];
  const views={
    dash:    ()=>role==="admin"?<AdminDash setTab={setTab}/>:<DashView profile={auth.profile} creators={team.creators} agents={team.agents} managers={team.managers} directors={team.directors}/>,
    agencies:()=><AdminAgencies/>,
    billing: ()=><AdminBilling/>,
    team:    ()=><TeamView agents={team.agents} managers={team.managers} directors={team.directors}/>,
    creators:()=><CreatorsView profile={auth.profile} creators={team.creators} agents={team.agents} reload={reload}/>,
    import:  ()=><ImportView profile={auth.profile} reload={reload}/>,
    links:   ()=><CodesPanel profile={auth.profile}/>,
    settings:()=><SettingsView profile={auth.profile} reload={reload}/>,
    matches: ()=><MatchesView profile={auth.profile} creators={team.creators} agents={team.agents}/>,
    planning:()=><PlanningView profile={auth.profile}/>,
    my_lives:()=><MyLivesView profile={auth.profile}/>,
    coach:   ()=><CoachView profile={auth.profile} creators={team.creators} ag={auth.profile?.agencies}/>,
    // Admin coach aussi accessible
    invite_agencies:()=><AdminInviteAgencies/>,
    members:()=><AdminMembersView/>,
    all_users:()=><AdminAllUsersView/>,
    all_creators:()=><AdminAllCreatorsView/>,
    all_staff:()=><AdminAllStaffView/>,
    all_matches:()=><AdminAllMatchesView/>,
    all_schedules:()=><AdminAllSchedulesView/>,
    all_lives:()=><AdminAllLivesView/>,
    poster_templates:()=><AdminPosterTemplatesView/>,
  };
  const View=views[tab]||views.dash;

  // Payment wall for agency in trial (même esprit conversion que SaaS House : fond noir, CTA rouge, même onglet)
  if(needsPayment) return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 18px calc(28px + env(safe-area-inset-bottom, 12px))",fontFamily:"Inter,sans-serif",boxSizing:"border-box"}}>
        <div style={{position:"fixed",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,.12), transparent 55%)",pointerEvents:"none"}}/>
        <div style={{width:"100%",maxWidth:440,position:"relative",zIndex:1}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><Brand big={true}/></div>
            <p style={{fontSize:17,fontWeight:800,color:"#fff",letterSpacing:"-.02em"}}>Débloque ton agence TikTok</p>
            <p style={{fontSize:13,color:"#888",marginTop:8,lineHeight:1.5}}>Un paiement sécurisé · Accès complet Diamond's</p>
          </div>
          <div style={{background:"#0A0A0A",borderRadius:20,border:"1px solid rgba(255,255,255,.08)",overflow:"hidden",marginBottom:14,boxShadow:"0 0 0 1px rgba(255,0,51,.06), 0 24px 80px rgba(0,0,0,.55)"}}>
            <div style={{padding:"22px 24px 26px"}}>
              <div style={{marginBottom:16}}>
                <span style={{background:`linear-gradient(90deg,${T.acc},${T.accL})`,borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:800,color:"#fff",letterSpacing:".12em"}}>ABONNEMENT MENSUEL</span>
              </div>
              <div style={{marginBottom:14}}>
                <span style={{fontSize:58,fontWeight:900,color:"#fff",letterSpacing:"-.04em",lineHeight:1}}>{PRICE}</span>
                <span style={{fontSize:22,color:"#666",fontWeight:500,marginLeft:4}}>€<span style={{fontSize:13}}>/mois</span></span>
              </div>
              <p style={{fontSize:13,color:"#777",marginBottom:22,lineHeight:1.55}}>Sans engagement · Paiement Stripe (flux plein écran, comme SaaS House)</p>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
                {[
                  "Gestion illimitée créateurs & staff",
                  "Matchs TikTok Live & affiches",
                  "Import Backstage & Coach IA",
                  "Reversements diamants & support",
                ].map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:`${T.payRed}18`,border:`1px solid ${T.payRed}50`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:T.payRed}}/>
                    </div>
                    <span style={{fontSize:13,color:"#bbb"}}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#111",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8,border:"1px solid #222"}}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#555" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span style={{fontSize:13,color:"#888"}}>{auth.profile?.email}</span>
              </div>
              <button type="button" className="btn pay-cta-saas" style={{width:"100%",padding:"16px",fontSize:16,borderRadius:12,justifyContent:"center",display:"flex",alignItems:"center",gap:8}} onClick={()=>{
                const u=`${STRIPE_LINK}?prefilled_email=${encodeURIComponent(auth.profile?.email||"")}${ag?.id?`&client_reference_id=${encodeURIComponent(ag.id)}`:""}`;
                window.location.href=u;
              }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Payer {PRICE}€/mois
              </button>
              <div style={{textAlign:"center",marginTop:14,fontSize:11,color:"#444",letterSpacing:".04em"}}>
                SÉCURISÉ PAR STRIPE · CHIFFREMENT 256-BIT
              </div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <button type="button" onClick={auth.reload} style={{background:"none",border:"none",color:"#777",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
              Déjà payé ? Actualiser →
            </button>
            <button type="button" onClick={auth.signOut} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Se déconnecter</button>
          </div>
        </div>
      </div>
    </>
  );

  return(
    <>
      <style>{css}</style>
      {isBlocked&&<BlockedScreen agencyName={ag?.name}/>}
      <div style={{minHeight:"100vh",background:"#0F0F0F",display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif"}}>
        {isNarrow&&(
          <header className="app-mob-bar" style={{alignItems:"center",gap:10,padding:"10px 14px",borderBottom:"1px solid #1a1a1a",background:"#0a0a0a",position:"sticky",top:0,zIndex:12}}>
            <button type="button" onClick={()=>setNavOpen(true)} className="btng" style={{padding:"8px 12px",fontSize:18}} aria-label="Ouvrir le menu">☰</button>
            <div style={{fontWeight:800,fontSize:14,color:"#fff",letterSpacing:"-.02em"}}>Diamond's</div>
          </header>
        )}
        <div style={{display:"flex",flex:1,minHeight:0,position:"relative"}}>
          {isNarrow&&navOpen&&<div className="app-scrim" onClick={()=>setNavOpen(false)}/>}
          <aside className={`app-sidebar-m${navOpen?" open":""}`} style={{width:220,flexShrink:0,background:"#111",borderRight:"1px solid #1a1a1a",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:isNarrow?30:10}}>
            <div style={{padding:"18px 16px 14px",borderBottom:"1px solid #1a1a1a",cursor:"pointer"}} onClick={()=>{setTab("dash");setNavOpen(false);}}>
              <Brand/>
            </div>
            <div style={{padding:"10px 10px",flex:1,overflowY:"auto"}}>
              <div style={{fontSize:10,fontWeight:600,color:"#444",textTransform:"uppercase",letterSpacing:".09em",padding:"8px 12px 4px",marginBottom:2}}>Navigation</div>
              {nav.map(n=><button key={n.id} type="button" className={`nb${tab===n.id?" on":""}`} onClick={()=>{setTab(n.id);setNavOpen(false);}}>{n.l}</button>)}
            </div>
            <div style={{padding:"12px 14px",borderTop:"1px solid #1a1a1a"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:"#191919",marginBottom:8}}>
                <AV name={(auth.profile?.tiktok_handle||auth.profile?.email||"?").replace("@","")[0]?.toUpperCase()||"?"} color="#2563EB" size={30}/>
                <div style={{overflow:"hidden",minWidth:0,flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#FFF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{auth.profile?.tiktok_handle||auth.profile?.email}</div>
                  <div style={{fontSize:10,color:"#525252",textTransform:"capitalize"}}>{role}</div>
                </div>
              </div>
              <button type="button" onClick={auth.signOut} style={{width:"100%",padding:"7px",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",background:"transparent",color:"#525252",fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"all .15s",textAlign:"center"}}
                onMouseEnter={e=>{e.target.style.color="#EF4444";e.target.style.borderColor="rgba(239,68,68,0.2)"}}
                onMouseLeave={e=>{e.target.style.color="#525252";e.target.style.borderColor="rgba(255,255,255,0.06)"}}>
                Déconnexion
              </button>
            </div>
          </aside>
          <main className="app-main-pad" style={{flex:1,overflowY:"auto",padding:"28px 32px",background:"#0F0F0F",marginLeft:isNarrow?0:220,minHeight:isNarrow?"calc(100vh - 52px)":"100vh",width:"100%"}}>
            {loadT?<div style={{textAlign:"center",padding:40,color:T.sec}}>Chargement…</div>:<View/>}
          </main>
        </div>
      </div>
    </>
  );
}
