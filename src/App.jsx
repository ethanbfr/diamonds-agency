import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SB_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const sb = SB_URL ? createClient(SB_URL, SB_ANON) : null;

const T={
  bg:"#0A0015",
  bgGradient:"linear-gradient(135deg, #0A0015 0%, #1A0033 25%, #2D0052 50%, #1A0033 75%, #0A0015 100%)",
  card:"rgba(139, 92, 246, 0.08)",
  cardGlass:"rgba(139, 92, 246, 0.12)",
  cardGlassHover:"rgba(139, 92, 246, 0.18)",
  b:"rgba(139, 92, 246, 0.2)",
  acc:"#8B5CF6",
  accLight:"#A78BFA",
  accGlow:"rgba(139, 92, 246, 0.6)",
  cy:"#00D4FF",
  cyLight:"#5EEADF",
  cyGlow:"rgba(0, 212, 255, 0.5)",
  sec:"#A78BFA",
  ok:"#00D4FF",
  okGlow:"rgba(0, 212, 255, 0.4)",
  ng:"#FF4757",
  ngGlow:"rgba(255, 71, 87, 0.4)",
  go:"#FFA502",
  goGlow:"rgba(255, 165, 2, 0.4)",
  pu:"#C4B5FD",
  puGlow:"rgba(196, 181, 253, 0.5)",
  tx:"#FFFFFF",
  txDim:"#C4B5FD",
  stripe:"#8B5CF6",
  neon:"#00FFFF",
  neonPink:"#FF00FF",
  neonGreen:"#00FF88",
  neonPurple:"#8B5CF6"
};
const DAYS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const CONTACT="diamonds.saas@gmail.com";
const PRICE=149;

const css=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,sans-serif;background:${T.bgGradient};color:${T.tx};font-size:13px;overflow-x:hidden}

/* Futuristic animations 2030 */
@keyframes spk{0%,100%{transform:translate(0,0) scale(1);opacity:.9}35%{transform:translate(4px,-6px) scale(1.3);opacity:.4}70%{transform:translate(-3px,-2px) scale(.8);opacity:.3}}
@keyframes fup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fupScale{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes sp2{to{transform:rotate(360deg)}}
@keyframes neonGlow{0%,100%{box-shadow:0 0 20px ${T.accGlow},0 0 40px ${T.neonPurple}}50%{box-shadow:0 0 30px ${T.accGlow},0 0 60px ${T.neonPurple},0 0 80px ${T.neon}}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes cyberLine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px ${T.accGlow}}50%{box-shadow:0 0 40px ${T.accGlow},0 0 60px ${T.neon}}}

.fup{animation:fupScale .4s cubic-bezier(0.4, 0, 0.2, 1) both}.fup1{animation:fupScale .4s .1s cubic-bezier(0.4, 0, 0.2, 1) both}.fup2{animation:fupScale .4s .2s cubic-bezier(0.4, 0, 0.2, 1) both}.fup3{animation:fupScale .4s .3s cubic-bezier(0.4, 0, 0.2, 1) both}

/* Futuristic navigation */
.nb{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;cursor:pointer;font-size:12px;font-weight:600;border:none;background:transparent;width:100%;color:${T.txDim};transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);text-align:left;font-family:Inter,sans-serif;position:relative;overflow:hidden}
.nb::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, ${T.accGlow}, transparent);transform:translateX(-100%);transition:transform .6s}
.nb:hover::before{transform:translateX(100%)}
.nb:hover{background:${T.cardGlassHover};color:${T.tx};transform:translateX(6px)}.nb.on{background:linear-gradient(135deg, ${T.accGlow}, ${T.accLight});color:#fff;position:relative;transform:translateX(8px)}
.nb.on::before{content:'';position:absolute;left:0;top:25%;bottom:25%;width:3px;background:${T.neon};border-radius:0 3px 3px 0;box-shadow:0 0 15px ${T.neon}}

/* Futuristic buttons */
.btn{background:linear-gradient(135deg,${T.acc},${T.accLight});color:#fff;border:none;border-radius:12px;padding:12px 20px;font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:8px;font-family:Inter,sans-serif;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);position:relative;overflow:hidden;text-transform:uppercase;letterSpacing:"0.05em"}
.btn::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg, transparent, rgba(255,255,255,0.3), transparent);transform:translateX(-100%);transition:transform .6s}
.btn:hover::before{transform:translateX(100%)}
.btn:hover{box-shadow:0 8px 32px ${T.accGlow},0 0 20px ${T.neonPurple};transform:translateY(-2px) scale(1.02);animation:neonGlow 2s ease-in-out infinite}.btn:disabled{opacity:.5;cursor:not-allowed;transform:none;animation:none}

.btng{background:transparent;color:${T.txDim};border:1px solid ${T.b};border-radius:10px;padding:8px 14px;font-size:11px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:Inter,sans-serif;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);text-transform:uppercase}
.btng:hover{background:${T.cardGlassHover};color:${T.tx};border-color:${T.acc};transform:translateY(-1px);box-shadow:0 4px 16px ${T.accGlow}}

/* Futuristic tags */
.tag{display:inline-flex;align-items:center;padding:6px 12px;border-radius:20px;font-size:10px;font-weight:700;backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);text-transform:uppercase;letterSpacing:"0.05em"}

/* Futuristic cards */
.cr{display:grid;align-items:center;padding:14px 18px;border-bottom:1px solid ${T.b};transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);position:relative}
.cr::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, transparent, ${T.accGlow}, transparent);opacity:0;transition:opacity .3s}
.cr:hover::before{opacity:0.3}
.cr:last-child{border-bottom:none}.cr:hover{background:${T.cardGlassHover};transform:translateX(6px)}

/* Futuristic inputs */
input[type=range]{-webkit-appearance:none;width:100%;height:6px;border-radius:20px;background:${T.cardGlass};outline:none;position:relative}
input[type=range]::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(90deg, ${T.acc}, ${T.cy});border-radius:20px;opacity:0.5}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg, ${T.acc}, ${T.accLight});cursor:pointer;box-shadow:0 2px 8px ${T.accGlow};transition:all .3s}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);box-shadow:0 4px 16px ${T.accGlow},0 0 20px ${T.neon}}

.inp{width:100%;padding:14px 18px;border-radius:12px;border:1px solid ${T.b};background:${T.cardGlass};color:${T.tx};font-size:12.5px;outline:none;font-family:Inter,sans-serif;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);backdrop-filter:blur(20px)}
.inp:focus{border-color:${T.acc};box-shadow:0 0 0 3px ${T.accGlow},0 0 20px ${T.neonPurple};background:${T.cardGlassHover}}.inp::placeholder{color:${T.txDim}}
select.inp option{background:${T.bg};color:${T.tx}}

/* Futuristic cards with glassmorphism */
.card{background:${T.cardGlass};border-radius:16px;border:1px solid ${T.b};backdrop-filter:blur(20px);position:relative;overflow:hidden;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);animation:fadeIn .5s ease-out}
.card::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg, rgba(139,92,246,0.1), transparent);opacity:0.5;pointer-events:none}
.card:hover{transform:translateY(-4px);box-shadow:0 12px 40px ${T.accGlow},0 0 30px ${T.neonPurple};border-color:${T.acc}40}
.glow{background:${T.cardGlassHover};border-radius:16px;border:1px solid ${T.acc};backdrop-filter:blur(20px);box-shadow:0 8px 32px ${T.accGlow},0 0 20px ${T.neonPurple};position:relative;overflow:hidden;animation:glowPulse 3s ease-in-out infinite}
.glow::before{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg, ${T.accGlow}, transparent);opacity:0.3;pointer-events:none}

/* Futuristic toggle */
.tog{width:48px;height:26px;border-radius:13px;cursor:pointer;border:none;position:relative;flex-shrink:0;transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);background:${T.cardGlass}}
.tog .kn{position:absolute;top:3px;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg, #fff, #f0f0f0);transition:all .3s cubic-bezier(0.4, 0, 0.2, 1);box-shadow:0 2px 8px rgba(0,0,0,0.3)}
.tog.on{background:linear-gradient(135deg, ${T.acc}, ${T.accLight});box-shadow:0 0 20px ${T.accGlow}}
.tog.on .kn{left:22px;transform:scale(1.1);box-shadow:0 0 15px ${T.neon}}

/* Scrollbar styling */
::-webkit-scrollbar{width:8px}
::-webkit-scrollbar-track{background:${T.cardGlass}}
::-webkit-scrollbar-thumb{background:${T.b};border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:${T.acc}}

/* Selection styling */
::selection{background:${T.accGlow};color:#fff}

/* Focus styles */
:focus-visible{outline:2px solid ${T.acc};outline-offset:2px}
`;

/*  UTILS  */
const calcPayout=(ag,c)=>{
  if(c&&c.disable_creator_payout) return {eligible:false,creator:0,agent:0,manager:0,director:0};
  const ok=(c.days_live||0)>=(ag?.min_days||20)&&(c.hours_live||0)>=(ag?.min_hours||40);
  if(!ok) return {eligible:false,creator:0,agent:0,manager:0,director:0};
  const b=(c.diamonds||0)*0.017;
  return {eligible:true,creator:Math.round(b*(ag?.pct_creator||55)/100),agent:Math.round(b*(ag?.pct_agent||10)/100),manager:Math.round(b*(ag?.pct_manager||5)/100),director:Math.round(b*(ag?.pct_director||3)/100)};
};
const billingOk=(ag)=>!ag||ag.is_offered||ag.billing_status==="actif";

/*  SUPABASE  */
const getProfile=async(uid)=>{
  if(!sb) return null;
  const {data,error}=await sb.from("profiles").select("*").eq("id",uid).single();
  if(error||!data) return null;
  if(data.agency_id){const {data:ag}=await sb.from("agencies").select("*").eq("id",data.agency_id).single();data.agencies=ag||null;}
  return data;
};
const fetchTeam=async(agId)=>{
  if(!sb||!agId) return {creators:[],agents:[],managers:[],directors:[]};
  const [cr,ag,mg,dr]=await Promise.all([
    sb.from("creators").select("*").eq("agency_id",agId),
    sb.from("agents").select("*").eq("agency_id",agId),
    sb.from("managers").select("*").eq("agency_id",agId),
    sb.from("directors").select("*").eq("agency_id",agId),
  ]);
  return {creators:cr.data||[],agents:ag.data||[],managers:mg.data||[],directors:dr.data||[]};
};
const fetchAllAgencies=async()=>{if(!sb) return [];const {data}=await sb.from("agencies").select("*").order("created_at",{ascending:false});return data||[];};
const doCreateAgency=async(name,slug,color)=>{
  if(!sb) return {error:"Supabase non configur"};
  const {data,error}=await sb.from("agencies").insert({name:name.trim(),slug:slug.trim().toUpperCase(),color:color||"#7F00FF",billing_status:"essai",is_offered:false,pct_director:3,pct_manager:5,pct_agent:10,pct_creator:55,min_days:20,min_hours:40,director_can_import:false,manager_can_import:false,accept_inter_agency:true}).select().single();
  if(error) return {error:error.message};
  return {data};
};
const genCode=async(agId,issuerId,issuerRole,targetRole)=>{
  if(!sb) return null;
  const {data,error}=await sb.rpc("generate_invite_code",{p_agency_id:agId,p_issuer_id:issuerId,p_issuer_role:issuerRole,p_target_role:targetRole});
  return error?null:data;
};
const getMyCodes=async(issuerId)=>{if(!sb) return [];const {data}=await sb.from("invite_codes").select("*").eq("issuer_id",issuerId).eq("used",false).order("created_at",{ascending:false});return data||[];};
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
const importBackstage=async(agId,importerId,rows)=>{if(!sb) return {error:"Supabase non configur"};const {data,error}=await sb.rpc("import_backstage",{p_agency_id:agId,p_importer_id:importerId,p_data:rows});return error?{error:error.message}:data;};

/* ---- GLOBAL ADMIN FUNCTIONS ---- */
const fetchAllProfiles=async()=>{if(!sb) return [];const {data}=await sb.from("profiles").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllCreators=async()=>{if(!sb) return [];const {data}=await sb.from("creators").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllAgents=async()=>{if(!sb) return [];const {data}=await sb.from("agents").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllManagers=async()=>{if(!sb) return [];const {data}=await sb.from("managers").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllDirectors=async()=>{if(!sb) return [];const {data}=await sb.from("directors").select("*").order("created_at",{ascending:false});return data||[];};
const fetchAllMatches=async()=>{if(!sb) return [];const {data}=await sb.from("matches").select("*").order("match_date",{ascending:false});return data||[];};
const fetchAllSchedules=async()=>{if(!sb) return [];const {data}=await sb.from("schedules").select("*").order("day_of_week","start_time");return data||[];};
const fetchAllLiveEntries=async()=>{if(!sb) return [];const {data}=await sb.from("live_entries").select("*").order("live_date",{ascending:false}).limit(100);return data||[];};

/*  SHARED UI  */
const DiamondSVG=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 40 40">
    <defs>
      <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={T.neon}/>
        <stop offset="25%" stopColor={T.acc}/>
        <stop offset="50%" stopColor={T.accLight}/>
        <stop offset="75%" stopColor={T.cy}/>
        <stop offset="100%" stopColor={T.neonPurple}/>
      </linearGradient>
      <linearGradient id="dg2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,.8)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
      <filter id="neonGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <polygon 
      points="20,2 37,15 20,38 3,15" 
      fill="url(#dg)" 
      filter="url(#neonGlow)"
      style={{filter:"drop-shadow(0 0 12px rgba(139,92,246,0.8))"}}
    />
    <polygon 
      points="20,2 37,15 20,15 3,15" 
      fill="url(#dg2)" 
      opacity=".8"
    />
    <line x1="3" y1="15" x2="37" y2="15" stroke={T.neon} strokeWidth="1" opacity="0.6"/>
    <line x1="20" y1="2" x2="20" y2="15" stroke={T.cy} strokeWidth="0.8" opacity="0.7"/>
    <circle cx="20" cy="20" r="2" fill={T.neon} opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);
const Spk=({x,y,d})=>(
  <div style={{position:"absolute",left:x,top:y,animation:`spk ${5+d}s ${d}s ease-in-out infinite`,pointerEvents:"none"}}>
    <svg width="7" height="7" viewBox="0 0 8 8"><path d="M4 0L5 3 8 4 5 5 4 8 3 5 0 4 3 3Z" fill="rgba(180,130,255,.9)"/></svg>
  </div>
);
const Brand=({big=false})=>(
  <div style={{display:"flex",alignItems:"center",gap:big?20:12,position:"relative"}}>
    <div style={{position:"relative",width:big?80:36,height:big?80:36,flexShrink:0}}>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg, ${T.accGlow}, ${T.cyGlow})`,borderRadius:"50%",filter:"blur(25px)",opacity:0.7,animation:"pulse 3s ease-in-out infinite"}}/>
      <div style={{position:"relative",width:"100%",height:"100%",background:`linear-gradient(135deg, ${T.cardGlassHover}, ${T.cardGlass})`,borderRadius:"50%",border:`2px solid ${T.acc}`,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(20px)"}}>
        <DiamondSVG size={big?65:30}/>
      </div>
      {big&&<><Spk x={-12} y={-8} d={0}/><Spk x={75} y={-6} d={.4}/><Spk x={-10} y={68} d={.7}/><Spk x={78} y={66} d={.2}/></>}
    </div>
    <div>
      <div style={{fontFamily:"Space Grotesk,sans-serif",fontWeight:900,fontSize:big?40:18,letterSpacing:"-0.03em",lineHeight:1}}>
        <span style={{color:T.tx,background:`linear-gradient(135deg, ${T.tx}, ${T.accLight}, ${T.cy})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textShadow:`0 0 30px ${T.accGlow}`}}>Diamond</span>
        <span style={{color:T.cy,filter:`drop-shadow(0 0 15px ${T.cyGlow})`}}>&apos;s</span>
      </div>
      <div style={{fontSize:big?12:9,color:T.txDim,marginTop:2,letterSpacing:".08em",fontWeight:600,textTransform:"uppercase"}}>by Belive Academy</div>
    </div>
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
const AV=({name,color=T.acc,size=32})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:color,fontWeight:800,fontSize:size/2.5,flexShrink:0}}>
    {String(name).slice(0,2).toUpperCase()}
  </div>
);
const Tog=({on,onChange,color=T.acc})=>(
  <button className="tog" style={{background:on?color:"rgba(255,255,255,.1)"}} onClick={()=>onChange(!on)}>
    <div className="kn" style={{left:on?"21px":"3px"}}/>
  </button>
);
const billingTag=(s,isOffered)=>{
  if(isOffered) return <span className="tag" style={{background:`${T.cy}18`,color:T.cy}}>Offert </span>;
  const m={actif:{bg:`${T.ok}18`,c:T.ok,l:"Abonn"},impay:{bg:`${T.ng}18`,c:T.ng,l:"Impay"},essai:{bg:`${T.go}18`,c:T.go,l:"Essai"}};
  const v=m[s]||m.essai;
  return <span className="tag" style={{background:v.bg,color:v.c}}>{v.l}</span>;
};

/*  NAV  */
const NAVS={
  admin:   [{id:"dash",l:"Vue globale"},{id:"agencies",l:"Agences"},{id:"billing",l:"Facturation"},{id:"all_users",l:"Tous les utilisateurs"},{id:"all_creators",l:"Tous crateurs"},{id:"all_staff",l:"Tout staff"},{id:"all_matches",l:"Tous matchs"},{id:"all_schedules",l:"Tous plannings"},{id:"all_lives",l:"Tous lives"}],
  agency:  [{id:"dash",l:"Dashboard"},{id:"team",l:"Mon quipe"},{id:"creators",l:"Crateurs"},{id:"import",l:"Import Backstage"},{id:"links",l:"Liens d'invitation"},{id:"matches",l:"Matchs"},{id:"settings",l:"Paramtres"}],
  director:[{id:"dash",l:"Mon ple"},{id:"creators",l:"Mes crateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"}],
  manager: [{id:"dash",l:"Mon groupe"},{id:"creators",l:"Mes crateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"}],
  agent:   [{id:"dash",l:"Dashboard"},{id:"creators",l:"Mes crateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mon lien"}],
  creator: [{id:"dash",l:"Mon espace"},{id:"planning",l:"Mon planning"},{id:"my_lives",l:"Mes lives"},{id:"matches",l:"Mes matchs"}],
};

/*  AUTH  */
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

/*  BLOCKED SCREEN  */
function BlockedScreen({agencyName}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(10,5,25,.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
      <div style={{textAlign:"center",maxWidth:420,padding:28}}>
        <div style={{fontSize:48,marginBottom:16}}></div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:8}}>Accs suspendu</h1>
        <p style={{fontSize:13.5,color:T.sec,marginBottom:20,lineHeight:1.7}}>
          L'abonnement de <strong style={{color:T.tx}}>{agencyName||"votre agence"}</strong> a expir.<br/>
          Contactez votre administrateur pour rgulariser.
        </p>
        <a href={`mailto:${CONTACT}`}><button className="btn" style={{fontSize:13,padding:"9px 20px"}}>Contacter Diamond's</button></a>
        <div style={{marginTop:12,fontSize:11.5,color:T.sec}}>{CONTACT}</div>
      </div>
    </div>
  );
}

/*  LOGIN  */
function LoginPage(){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [code,setCode]=useState("");
  const [handle,setHandle]=useState("");
  const [avatar,setAvatar]=useState(null);
  const [mode,setMode]=useState("login");
  const [err,setErr]=useState("");
  const [load,setLoad]=useState(false);

  const login=async()=>{
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configur");setLoad(false);return;}
    const {error}=await sb.auth.signInWithPassword({email,password:pw});
    if(error){setErr(error.message);setLoad(false);}
  };
  const register=async()=>{
    if(!code.trim()){setErr("Code d'invitation requis");return;}
    // Vrifier le rle depuis le code d'invitation
    const codeData = await sb.from("invite_codes").select("*").eq("code",code.trim().toUpperCase()).single();
    const targetRole = codeData?.data?.target_role;
    
    // @ TikTok obligatoire pour tout le monde SAUF admin et agences
    if(targetRole !== "admin" && targetRole !== "agency" && (!handle.trim() || !handle.startsWith("@"))){setErr("@ TikTok obligatoire - doit commencer par @");return;}
    if(targetRole !== "admin" && targetRole !== "agency" && handle.length < 3){setErr("@ TikTok trop court (minimum 3 caractres)");return;}
    
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configur");setLoad(false);return;}
    const {data,error}=await sb.auth.signUp({email,password:pw});
    if(error){setErr(error.message);setLoad(false);return;}
    const {error:cErr}=await sb.rpc("use_invite_code",{p_code:code.trim().toUpperCase(),p_user_id:data.user?.id});
    if(cErr){setErr("Code invalide ou expir");setLoad(false);return;}
    // Save TikTok handle (POUR tout le monde SAUF admin et agences)
    if(targetRole !== "admin" && targetRole !== "agency" && handle.trim()) {
      await sb.from("profiles").update({tiktok_handle:handle.trim()}).eq("id",data.user?.id);
    }
    // Upload avatar if provided
    if(avatar&&sb){
      const ext=avatar.name.split(".").pop();
      const path=`avatars/${data.user?.id}.${ext}`;
      await sb.storage.from("avatars").upload(path,avatar,{upsert:true});
      const {data:urlData}=sb.storage.from("avatars").getPublicUrl(path);
      if(urlData?.publicUrl) await sb.from("profiles").update({tiktok_avatar_url:urlData.publicUrl}).eq("id",data.user?.id);
    }
    setMode("confirm");setLoad(false);
  };

  if(mode==="confirm") return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,rgba(127,0,255,.15) 0%,transparent 55%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",maxWidth:360,padding:20}} className="fup">
        <div style={{fontSize:40,marginBottom:14}}></div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:8}}>Compte cr !</h1>
        <p style={{fontSize:13,color:T.sec,marginBottom:20}}>Vrifie ta bote mail pour confirmer, puis connecte-toi.</p>
        <button className="btn" style={{fontSize:13,padding:"9px 20px"}} onClick={()=>setMode("login")}>Se connecter</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,rgba(127,0,255,.15) 0%,transparent 55%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:24}} className="fup">
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Brand big={true}/></div>
          <div style={{fontSize:12.5,color:T.sec,marginTop:10}}>La plateforme des agences TikTok Live</div>
        </div>
        <div className="card fup1" style={{padding:22,marginBottom:10}}>
          <div style={{display:"flex",gap:4,marginBottom:18,background:"rgba(255,255,255,.04)",padding:4,borderRadius:10}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:mode===m?T.acc:"transparent",color:mode===m?"white":T.sec,fontFamily:"Inter,sans-serif",transition:"all .18s"}}>
                {m==="login"?"Connexion":"Inscription"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Email</label>
              <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():register())} placeholder="vous@email.com"/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>@ TikTok * <span style={{color:T.acc}}>(OBLIGATOIRE)</span></label>
              <input className="inp" value={handle} onChange={e=>setHandle(e.target.value.replace(/^@/,""))} placeholder="@votre_pseudo_tiktok" style={{fontFamily:"monospace",borderColor:!handle.trim()?T.ng:T.b}}/>
              <div style={{fontSize:11,color:!handle.trim()?T.ng:T.sec,marginTop:3}}>Doit tre EXACTEMENT identique  votre pseudo TikTok (avec @)</div>
            </div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Mot de passe</label>
              <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():register())} placeholder=""/></div>
            {mode==="register"&&(
              <>
                <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Photo de profil (mme que TikTok)</label>
                  <input className="inp" type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} style={{fontSize:11.5}}/>
                </div>
                <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Code d'invitation</label>
                  <input className="inp" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="NOVA-AGENT-XXXXXX" style={{fontFamily:"monospace",letterSpacing:".08em"}}/>
                  <div style={{fontSize:11,color:T.sec,marginTop:4}}>Code fourni par votre agence</div>
                </div>
              </>
            )}
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <button className="btn" style={{width:"100%",justifyContent:"center",padding:"9px",marginTop:4}} onClick={mode==="login"?login:register} disabled={load}>
              {load?<><Spin/>{mode==="login"?"Connexion":"Inscription"}</>:(mode==="login"?"Se connecter":"Crer mon compte")}
            </button>
          </div>
        </div>
        <div style={{textAlign:"center",fontSize:11.5,color:T.sec}}>
          Problme ? <a href={`mailto:${CONTACT}`} style={{color:T.acc,textDecoration:"none"}}>{CONTACT}</a>
        </div>
      </div>
    </div>
  );
}

/*  ADMIN DASH  */
function AdminDash({setTab}){
  const [agencies,setAgencies]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchAllAgencies().then(d=>{setAgencies(d);setLoading(false);});},[]);
  const paying=agencies.filter(a=>a.billing_status==="actif"&&!a.is_offered);
  const mrr=paying.length*PRICE;
  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Super Admin  Belive Academy</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Vue globale</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+""} sub={`${PRICE}/agence  hors offerts`} accent={T.acc}/>
        <SC label="ARR estim" val={mrr*12+""} sub="Projection"/>
        <SC label="Agences actives" val={paying.length} sub="Payantes" accent={T.ok}/>
        <SC label="Offerts " val={agencies.filter(a=>a.is_offered).length} sub="Hors MRR" accent={T.cy}/>
      </div>
      {loading?<div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement</div>:
      agencies.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          <div style={{fontSize:16,fontWeight:700,color:T.tx,marginBottom:8}}>Aucune agence</div>
          <button className="btn" onClick={()=>setTab("agencies")}>+ Crer une agence</button>
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Agences</div>
          {agencies.map(ag=>(
            <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 90px 80px"}}>
              <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{ag.name[0]}</div>
              <div><div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div><div style={{fontSize:11,color:T.sec}}>/{ag.slug}</div></div>
              {billingTag(ag.billing_status,ag.is_offered)}
              <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.is_offered?"Offert ":ag.billing_status==="actif"?`${PRICE}`:"0"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*  ADMIN AGENCY DASH  */
function AdminAgencyDash({ag}){
  const [team,setTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{fetchTeam(ag.id).then(d=>{setTeam(d);setLoading(false);});},[ag.id]);
  if(loading) return <div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement</div>;
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
        <SC label="Crateurs" val={`${ok}/${tot}`} sub={`${tot-ok} bloqu`} accent={ok===tot&&tot>0?T.ok:"#FF6D00"}/>
      </div>
      <div className="glow" style={{padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:40,fontWeight:900,color:T.acc,lineHeight:1}}>{ok}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:13,fontWeight:700,color:T.sec}}>/ {tot} ligibles</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:26,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div></div>
        </div>
        {tot>0&&<div style={{height:6,borderRadius:20,overflow:"hidden",display:"flex",gap:2}}><div style={{flex:ok,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/><div style={{flex:tot-ok,background:"rgba(244,67,54,.28)",borderRadius:20}}/></div>}
      </div>
      {creators.length>0&&(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Crateurs</div>
          {creators.map(c=>{const p=calcPayout(ag,c);return(
            <div key={c.id} className="cr" style={{gridTemplateColumns:"30px 1fr 90px 55px 55px 80px"}}>
              <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.acc} size={26}/>
              <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo}</div>
              <div style={{fontWeight:700,color:T.cy,fontSize:12}}> {(c.diamonds||0).toLocaleString()}</div>
              <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
              <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
              <span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"ligible":"bloqu"}</span>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}

/*  ADMIN AGENCIES  */
function AdminAgencies(){
  const [agencies,setAgencies]=useState([]);
  const [sel,setSel]=useState(null);
  const [viewDash,setViewDash]=useState(null);
  const [showForm,setShowForm]=useState(false);
  const [name,setName]=useState("");
  const [slug,setSlug]=useState("");
  const [color,setColor]=useState("#7F00FF");
  const [creating,setCreating]=useState(false);
  const [err,setErr]=useState("");
  const [codes,setCodes]=useState({});
  const [genning,setGenning]=useState(null);
  const [copied,setCopied]=useState(null);
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
  const updateBilling=async(id,field,value)=>{if(!sb) return;await sb.from("agencies").update({[field]:value}).eq("id",id);load();};
  const cp=(k)=>{setCopied(k);setTimeout(()=>setCopied(null),2000);};

  if(viewDash) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>setViewDash(null)}> Retour</button>
        <h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>Dashboard  {viewDash.name}</h1>
        {billingTag(viewDash.billing_status,viewDash.is_offered)}
      </div>
      <AdminAgencyDash ag={viewDash}/>
    </div>
  );

  if(sel) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>setSel(null)}> Retour</button>
        <div style={{width:38,height:38,borderRadius:10,background:(sel.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:sel.color||T.acc,fontWeight:800,fontSize:16}}>{sel.name[0]}</div>
        <div><h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>{sel.name}</h1><div style={{fontSize:11.5,color:T.sec}}>Slug: {sel.slug}</div></div>
      </div>
      <div className="card" style={{padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:4}}>Gnrer des codes d'invitation</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Chaque code est <strong style={{color:T.tx}}>unique</strong>  jamais identique pour 2 personnes.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["director","manager","agent","creator"].map(r=>{const key=sel.id+"-"+r;return(
            <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}} onClick={()=>doGenCode(sel,r)} disabled={genning===key}>
              {genning===key?<Spin/>:"+"} Code {r}
            </button>
          );})}
        </div>
      </div>
      <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Codes actifs non utiliss</div>
      {(codes[sel.id]||[]).length===0?(
        <div style={{textAlign:"center",padding:"24px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12,fontSize:12}}>Aucun code  Gnre des codes ci-dessus</div>
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
                  {copied===code.code?" Copi":"Copier"}
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"6px 10px",border:`1px solid ${T.b}`}}>
                <code style={{flex:1,fontSize:10,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{BASE}?c={code.code}</code>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${code.id}`)}>{copied===`u-${code.id}`?"":"Copier"}</button>
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
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Crer une agence</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Nom *</label>
              <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Nova TikTok"/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Slug *  les codes seront SLUG-ROLE-XXXXXX</label>
              <input className="inp" value={slug} onChange={e=>setSlug(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} placeholder="NOVA" style={{fontFamily:"monospace",letterSpacing:".08em"}}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Couleur</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:38,height:34,borderRadius:8,border:`1px solid ${T.b}`,background:"transparent",cursor:"pointer",padding:2}}/>
                <div style={{width:34,height:34,borderRadius:10,background:color+"18",border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:800,fontSize:14}}>{name?name[0]:"?"}</div>
              </div>
            </div>
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={doCreate} disabled={creating}>{creating?<><Spin/>Cration</>:"Crer"}</button>
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
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {agencies.map(ag=>(
            <div key={ag.id} className="card" style={{padding:16,display:"flex",alignItems:"center",gap:12,transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(127,0,255,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
              <div style={{width:44,height:44,borderRadius:13,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:18,flexShrink:0}}>{ag.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.tx,display:"flex",alignItems:"center",gap:7,marginBottom:3}}>{ag.name}{billingTag(ag.billing_status,ag.is_offered)}</div>
                <div style={{fontSize:11.5,color:T.sec}}>Slug: {ag.slug}  Crea {ag.pct_creator||55}%  Agt {ag.pct_agent||10}%</div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <button className="btng" style={{fontSize:10.5}} onClick={()=>{setSel(ag);loadCodes(ag.id);}}>Codes</button>
                <button className="btng" style={{fontSize:10.5}} onClick={()=>setViewDash(ag)}>Dashboard</button>
                {!ag.is_offered&&ag.billing_status!=="actif"&&<button className="btn" style={{fontSize:10.5,padding:"4px 9px",background:`linear-gradient(135deg,${T.ok},#00E676)`}} onClick={()=>updateBilling(ag.id,"billing_status","actif")}>Activer</button>}
                {!ag.is_offered&&<button style={{padding:"4px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.cy}30`,background:`${T.cy}10`,color:T.cy,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>updateBilling(ag.id,"is_offered",true)}>Offrir </button>}
                {ag.is_offered&&<button className="btng" style={{fontSize:10.5,color:T.ng}} onClick={()=>updateBilling(ag.id,"is_offered",false)}>Retirer</button>}
                {ag.billing_status==="actif"&&!ag.is_offered&&<button style={{padding:"4px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.ng}30`,background:`${T.ng}10`,color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>updateBilling(ag.id,"billing_status","impay")}>Impay</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*  ADMIN GLOBAL USERS  */
function AdminAllUsersView(){
  const [profiles,setProfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  
  useEffect(()=>{
    const load=async()=>{
      const data=await fetchAllProfiles();
      setProfiles(data);
      setLoading(false);
    };
    load();
  },[]);
  
  const filtered=profiles.filter(p=>{
    const matchesSearch=!search || 
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.tiktok_handle?.toLowerCase().includes(search.toLowerCase()) ||
      p.role?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter=filter==="all" || p.role===filter;
    return matchesSearch && matchesFilter;
  });
  
  const roleColors={admin:T.acc,agency:T.cy,director:T.pu,manager:T.go,agent:T.ok,creator:T.ng};
  const stats={
    total:profiles.length,
    admin:profiles.filter(p=>p.role==="admin").length,
    agency:profiles.filter(p=>p.role==="agency").length,
    director:profiles.filter(p=>p.role==="director").length,
    manager:profiles.filter(p=>p.role==="manager").length,
    agent:profiles.filter(p=>p.role==="agent").length,
    creator:profiles.filter(p=>p.role==="creator").length,
    withTikTok:profiles.filter(p=>p.tiktok_handle).length,
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tous les utilisateurs</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les inscrits sur Diamond's</div>
      </div>
      
      {/* Statistiques */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total utilisateurs" val={stats.total} sub="Inscrits" accent={T.acc}/>
        <SC label="Avec @ TikTok" val={stats.withTikTok} sub={`${Math.round(stats.withTikTok/stats.total*100)}%`} accent={T.cy}/>
        <SC label="Staff total" val={stats.admin+stats.agency+stats.director+stats.manager+stats.agent} sub="Non crateurs" accent={T.pu}/>
        <SC label="Crateurs" val={stats.creator} sub={`${Math.round(stats.creator/stats.total*100)}%`} accent={T.ok}/>
      </div>
      
      {/* Filtres */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par email, @ TikTok, rle..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:150}}>
          <option value="all">Tous les rles</option>
          <option value="admin">Admin</option>
          <option value="agency">Agence</option>
          <option value="director">Directeur</option>
          <option value="manager">Manager</option>
          <option value="agent">Agent</option>
          <option value="creator">Crateur</option>
        </select>
      </div>
      
      {/* Liste des utilisateurs */}
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {filtered.length} utilisateur{filtered.length>1?"s":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:800}}>
            <div className="cr" style={{gridTemplateColumns:"60px 1fr 120px 120px 120px 100px 80px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Date</div><div>Utilisateur</div><div>@ TikTok</div><div>Email</div><div>Rle</div><div>Agence</div><div>Actions</div>
            </div>
            {filtered.map(p=>(
              <div key={p.id} className="cr" style={{gridTemplateColumns:"60px 1fr 120px 120px 120px 100px 80px"}}>
                <div style={{fontSize:11,color:T.sec}}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:12.5,color:T.tx,marginBottom:2}}>
                    {p.first_name} {p.last_name}
                  </div>
                  <div style={{fontSize:11,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {p.email}
                  </div>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:p.tiktok_handle?T.ok:T.ng}}>
                  {p.tiktok_handle||<span style={{color:T.ng}}>Non dfini</span>}
                </div>
                <div style={{fontSize:11,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {p.email}
                </div>
                <span className="tag" style={{background:`${roleColors[p.role]}18`,color:roleColors[p.role]}}>
                  {p.role}
                </span>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Ajouter nom de l'agence */}
                </div>
                <button className="btng" style={{fontSize:9.5,padding:"2px 6px"}}>Voir</button>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN ALL CREATORS ---- */
function AdminAllCreatorsView(){
  const [creators,setCreators]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("created_at");
  
  useEffect(()=>{
    const load=async()=>{
      const data=await fetchAllCreators();
      setCreators(data);
      setLoading(false);
    };
    load();
  },[]);
  
  const filtered=creators.filter(c=>{
    const matchesSearch=!search || 
      c.pseudo?.toLowerCase().includes(search.toLowerCase()) ||
      c.tiktok_id?.toLowerCase().includes(search.toLowerCase()) ||
      (c.first_name+" "+c.last_name).toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  }).sort((a,b)=>{
    if(sortBy==="diamonds") return (b.diamonds||0)-(a.diamonds||0);
    if(sortBy==="days_live") return (b.days_live||0)-(a.days_live||0);
    if(sortBy==="hours_live") return (b.hours_live||0)-(a.hours_live||0);
    return new Date(b.created_at)-new Date(a.created_at);
  });
  
  const stats={
    total:creators.length,
    totalDiamonds:creators.reduce((sum,c)=>sum+(c.diamonds||0),0),
    avgDays:Math.round(creators.reduce((sum,c)=>sum+(c.days_live||0),0)/creators.length)||0,
    avgHours:Math.round(creators.reduce((sum,c)=>sum+(c.hours_live||0),0)/creators.length)||0,
    withTikTok:creators.filter(c=>c.tiktok_id).length,
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tous les crateurs</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les crateurs TikTok</div>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total crateurs" val={stats.total} sub="Inscrits" accent={T.cy}/>
        <SC label="Total diamants" val={stats.totalDiamonds.toLocaleString()} sub="Cumuls" accent={T.acc}/>
        <SC label="Moyenne jours" val={stats.avgDays} sub="Days live" accent={T.ok}/>
        <SC label="Moyenne heures" val={stats.avgHours} sub="Hours live" accent={T.go}/>
      </div>
      
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par pseudo, TikTok ID, nom..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:150}}>
          <option value="created_at">Date d'inscription</option>
          <option value="diamonds">Diamants</option>
          <option value="days_live">Jours live</option>
          <option value="hours_live">Heures live</option>
        </select>
      </div>
      
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {filtered.length} crateur{filtered.length>1?"s":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:1000}}>
            <div className="cr" style={{gridTemplateColumns:"60px 80px 1fr 100px 80px 80px 100px 100px 120px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Date</div><div>Avatar</div><div>Crateur</div><div>@ TikTok</div><div>Diamants</div><div>Jours</div><div>Heures</div><div>Agent</div><div>Agence</div><div>Statut</div>
            </div>
            {filtered.map(c=>(
              <div key={c.id} className="cr" style={{gridTemplateColumns:"60px 80px 1fr 100px 80px 80px 100px 100px 120px"}}>
                <div style={{fontSize:11,color:T.sec}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.cy} size={32}/>
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:12.5,color:T.tx,marginBottom:2}}>
                    @{c.pseudo}
                  </div>
                  <div style={{fontSize:11,color:T.sec}}>
                    {c.first_name} {c.last_name}
                  </div>
                </div>
                <div style={{fontSize:12,fontWeight:600,color:c.tiktok_id?T.ok:T.ng}}>
                  {c.tiktok_id||<span style={{color:T.ng}}>Non dfini</span>}
                </div>
                <div style={{fontWeight:700,color:T.cy,fontSize:12}}>
                  {(c.diamonds||0).toLocaleString()}
                </div>
                <div style={{fontSize:12,color:(c.days_live||0)>=20?T.ok:T.ng}}>
                  {c.days_live||0}j
                </div>
                <div style={{fontSize:12,color:(c.hours_live||0)>=40?T.ok:T.ng}}>
                  {c.hours_live||0}h
                </div>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Agent name */}
                </div>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Agency name */}
                </div>
                <span className="tag" style={{background:`${T.ok}18`,color:T.ok}}>
                  Actif
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN ALL STAFF ---- */
function AdminAllStaffView(){
  const [agents,setAgents]=useState([]);
  const [managers,setManagers]=useState([]);
  const [directors,setDirectors]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("all");
  
  useEffect(()=>{
    const load=async()=>{
      const [agData,mgrData,dirData]=await Promise.all([
        fetchAllAgents(),
        fetchAllManagers(),
        fetchAllDirectors()
      ]);
      setAgents(agData);
      setManagers(mgrData);
      setDirectors(dirData);
      setLoading(false);
    };
    load();
  },[]);
  
  const allStaff=[
    ...agents.map(a=>({...a,type:"agent",color:T.cy})),
    ...managers.map(m=>({...m,type:"manager",color:T.pu})),
    ...directors.map(d=>({...d,type:"director",color:T.acc}))
  ].filter(s=>{
    const matchesSearch=!search || 
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.type?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter=filter==="all" || s.type===filter;
    return matchesSearch && matchesFilter;
  });
  
  const stats={
    total:allStaff.length,
    agents:agents.length,
    managers:managers.length,
    directors:directors.length,
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tout le staff</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les staff Diamond's</div>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total staff" val={stats.total} sub="Membres" accent={T.acc}/>
        <SC label="Agents" val={stats.agents} sub="Staff commercial" accent={T.cy}/>
        <SC label="Managers" val={stats.managers} sub="Gestionnaires" accent={T.pu}/>
        <SC label="Directeurs" val={stats.directors} sub="Ples" accent={T.go}/>
      </div>
      
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par nom, email, rle..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:150}}>
          <option value="all">Tous les rles</option>
          <option value="agent">Agents</option>
          <option value="manager">Managers</option>
          <option value="director">Directeurs</option>
        </select>
      </div>
      
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {allStaff.length} staff{allStaff.length>1?"s":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:800}}>
            <div className="cr" style={{gridTemplateColumns:"60px 80px 1fr 120px 120px 100px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Date</div><div>Avatar</div><div>Staff</div><div>Email</div><div>Tlphone</div><div>Rle</div>
            </div>
            {allStaff.map(s=>(
              <div key={s.id} className="cr" style={{gridTemplateColumns:"60px 80px 1fr 120px 120px 100px"}}>
                <div style={{fontSize:11,color:T.sec}}>{new Date(s.created_at).toLocaleDateString("fr-FR")}</div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <AV name={s.name?.slice(0,2)||"??"} color={s.color} size={32}/>
                </div>
                <div>
                  <div style={{fontWeight:600,fontSize:12.5,color:T.tx,marginBottom:2}}>
                    {s.name}
                  </div>
                  <div style={{fontSize:11,color:T.sec}}>
                    {/* TODO: Agency name */}
                  </div>
                </div>
                <div style={{fontSize:12,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {s.email}
                </div>
                <div style={{fontSize:12,color:T.sec}}>
                  {s.phone||"Non dfini"}
                </div>
                <span className="tag" style={{background:`${s.color}18`,color:s.color}}>
                  {s.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN ALL MATCHES ---- */
function AdminAllMatchesView(){
  const [matches,setMatches]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [filter,setFilter]="all";
  
  useEffect(()=>{
    const load=async()=>{
      const data=await fetchAllMatches();
      setMatches(data);
      setLoading(false);
    };
    load();
  },[]);
  
  const filtered=matches.filter(m=>{
    const matchesSearch=!search || 
      m.match_date?.toLowerCase().includes(search.toLowerCase()) ||
      m.match_time?.toLowerCase().includes(search.toLowerCase()) ||
      m.status?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter=filter==="all" || m.status===filter;
    return matchesSearch && matchesFilter;
  });
  
  const statusColor={pending:T.go,confirmed:T.ok,done:T.cy,cancelled:T.ng};
  const statusLabel={pending:"En attente",confirmed:"Confirm",done:"Termin",cancelled:"Annul"};
  const stats={
    total:matches.length,
    pending:matches.filter(m=>m.status==="pending").length,
    confirmed:matches.filter(m=>m.status==="confirmed").length,
    done:matches.filter(m=>m.status==="done").length,
    cancelled:matches.filter(m=>m.status==="cancelled").length,
    inter:matches.filter(m=>m.is_inter_agency).length,
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tous les matchs</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les matchs TikTok</div>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total matchs" val={stats.total} sub="Programms" accent={T.acc}/>
        <SC label="En attente" val={stats.pending} sub={`${Math.round(stats.pending/stats.total*100)}%`} accent={T.go}/>
        <SC label="Confirms" val={stats.confirmed} sub="Prts" accent={T.ok}/>
        <SC label="Inter-agences" val={stats.inter} sub={`${Math.round(stats.inter/stats.total*100)}%`} accent={T.cy}/>
      </div>
      
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par date, heure, statut..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:150}}>
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirm</option>
          <option value="done">Termin</option>
          <option value="cancelled">Annul</option>
        </select>
      </div>
      
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {filtered.length} match{filtered.length>1?"s":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:900}}>
            <div className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 80px 120px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Date</div><div>Match</div><div>Heure</div><div>Type</div><div>Statut</div><div>Crateurs</div>
            </div>
            {filtered.map(m=>(
              <div key={m.id} className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 80px 120px"}}>
                <div style={{fontSize:12,fontWeight:700,color:T.tx}}>{m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):"-"}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>Match {m.is_inter_agency?"inter":"intra"}-agence</div>
                  <div style={{fontSize:10.5,color:T.sec}}>{m.match_time||"?"}</div>
                </div>
                <div style={{fontSize:12,color:T.sec}}>{m.match_time||"-"}</div>
                <span className="tag" style={{background:m.is_inter_agency?`${T.cy}18`:`${T.pu}18`,color:m.is_inter_agency?T.cy:T.pu}}>
                  {m.is_inter_agency?"Inter":"Intra"}
                </span>
                <span className="tag" style={{background:`${statusColor[m.status]||T.go}18`,color:statusColor[m.status]||T.go}}>
                  {statusLabel[m.status]||"En attente"}
                </span>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Creator names */}
                  Creator A vs Creator B
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN ALL SCHEDULES ---- */
function AdminAllSchedulesView(){
  const [schedules,setSchedules]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]="";
  const [filter,setFilter]="all";
  
  useEffect(()=>{
    const load=async()=>{
      const data=await fetchAllSchedules();
      setSchedules(data);
      setLoading(false);
    };
    load();
  },[]);
  
  const filtered=schedules.filter(s=>{
    const matchesSearch=!search || 
      s.notes?.toLowerCase().includes(search.toLowerCase()) ||
      s.start_time?.toLowerCase().includes(search.toLowerCase()) ||
      s.end_time?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter=filter==="all" || s.day_of_week===filter;
    return matchesSearch && matchesFilter;
  });
  
  const stats={
    total:schedules.length,
    inter:schedules.filter(s=>s.accept_inter_agency).length,
    byDay:DAYS.map((_,i)=>schedules.filter(s=>s.day_of_week===i).length),
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tous les plannings</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les plannings crateurs</div>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total crneaux" val={stats.total} sub="Programms" accent={T.acc}/>
        <SC label="Inter-agences" val={stats.inter} sub="Ouverts" accent={T.cy}/>
        <SC label="Lundi" val={stats.byDay[0]} sub="Crneaux" accent={T.ok}/>
        <SC label="Samedi" val={stats.byDay[5]} sub="Crneaux" accent={T.go}/>
      </div>
      
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par notes, horaires..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={filter} onChange={e=>setFilter(e.target.value)} style={{width:150}}>
          <option value="all">Tous les jours</option>
          {DAYS.map((day,i)=><option key={i} value={i}>{day}</option>)}
        </select>
      </div>
      
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {filtered.length} crneau{filtered.length>1?"x":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:800}}>
            <div className="cr" style={{gridTemplateColumns:"80px 120px 1fr 100px 100px 80px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Jour</div><div>Horaires</div><div>Notes</div><div>Crateur</div><div>Agence</div><div>Type</div>
            </div>
            {filtered.map(s=>(
              <div key={s.id} className="cr" style={{gridTemplateColumns:"80px 120px 1fr 100px 100px 80px"}}>
                <div style={{fontSize:12,fontWeight:600,color:T.tx}}>{DAYS[s.day_of_week]||"-"}</div>
                <div style={{fontSize:12,color:T.sec}}>{s.start_time||"-"} - {s.end_time||"-"}</div>
                <div style={{fontSize:12,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.notes||"-"}</div>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Creator name */}
                  Creator
                </div>
                <div style={{fontSize:11,color:T.sec}}>
                  {/* TODO: Agency name */}
                  Agency
                </div>
                <span className="tag" style={{background:s.accept_inter_agency?`${T.cy}18`:`${T.pu}18`,color:s.accept_inter_agency?T.cy:T.pu}}>
                  {s.accept_inter_agency?"Inter":"Intra"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN ALL LIVES ---- */
function AdminAllLivesView(){
  const [lives,setLives]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]="";
  const [sortBy,setSortBy]="live_date";
  
  useEffect(()=>{
    const load=async()=>{
      const data=await fetchAllLiveEntries();
      setLives(data);
      setLoading(false);
    };
    load();
  },[]);
  
  const filtered=lives.filter(l=>{
    const matchesSearch=!search || 
      l.notes?.toLowerCase().includes(search.toLowerCase()) ||
      (l.diamonds||0).toString().includes(search) ||
      (l.viewers||0).toString().includes(search);
    return matchesSearch;
  }).sort((a,b)=>{
    if(sortBy==="diamonds") return (b.diamonds||0)-(a.diamonds||0);
    if(sortBy==="viewers") return (b.viewers||0)-(a.viewers||0);
    if(sortBy==="duration") return (b.duration_minutes||0)-(a.duration_minutes||0);
    return new Date(b.live_date)-new Date(a.live_date);
  });
  
  const stats={
    total:lives.length,
    totalDiamonds:lives.reduce((sum,l)=>sum+(l.diamonds||0),0),
    totalViewers:lives.reduce((sum,l)=>sum+(l.viewers||0),0),
    avgDuration:lives.length>0?Math.round(lives.reduce((sum,l)=>sum+(l.duration_minutes||0),0)/lives.length):0,
  };
  
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:24,fontWeight:800,color:T.tx,marginBottom:8}}>Tous les lives</h1>
        <div style={{fontSize:13,color:T.sec}}>Vue globale de tous les lives enregistrs</div>
      </div>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <SC label="Total lives" val={stats.total} sub="Enregistrs" accent={T.acc}/>
        <SC label="Total diamants" val={stats.totalDiamonds.toLocaleString()} sub="Cumuls" accent={T.cy}/>
        <SC label="Total spectateurs" val={stats.totalViewers.toLocaleString()} sub="Cumuls" accent={T.ok}/>
        <SC label="Dure moyenne" val={`${stats.avgDuration}min`} sub="Par live" accent={T.go}/>
      </div>
      
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <input 
          className="inp" 
          placeholder="Rechercher par notes, diamants, spectateurs..." 
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{flex:1,minWidth:300,maxWidth:500}}
        />
        <select className="inp" value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{width:150}}>
          <option value="live_date">Date</option>
          <option value="diamonds">Diamants</option>
          <option value="viewers">Spectateurs</option>
          <option value="duration">Dure</option>
        </select>
      </div>
      
      {loading?<div style={{textAlign:"center",padding:40,color:T.sec}}><Spin/> Chargement...</div>:
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>
          {filtered.length} live{filtered.length>1?"s":""} {search && `(recherche: "${search}")`}
        </div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:900}}>
            <div className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 80px 1fr",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div>Date</div><div>Diamants</div><div>Dure</div><div>Spectateurs</div><div>Revenus</div><div>Notes</div>
            </div>
            {filtered.map(l=>(
              <div key={l.id} className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 80px 1fr"}}>
                <div style={{fontWeight:700,fontSize:12,color:T.tx}}>{new Date(l.live_date).toLocaleDateString("fr-FR")}</div>
                <div style={{fontWeight:700,color:T.cy,fontSize:12}}>{"\ud83d\udc8e"} {(l.diamonds||0).toLocaleString()}</div>
                <div style={{fontSize:12,color:T.sec}}>{Math.round((l.duration_minutes||0)/60*10)/10}h</div>
                <div style={{fontSize:12,color:T.sec}}>{"\ud83d\udc41"} {(l.viewers||0).toLocaleString()}</div>
                <div style={{fontWeight:700,fontSize:12.5,color:T.acc}}>{((l.diamonds||0)*0.017*0.55).toFixed(0)}{"\u20ac"}</div>
                <div style={{fontSize:11.5,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.notes||"-"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}

/* ---- ADMIN BILLING ---- */
function AdminBilling(){
  const [agencies,setAgencies]=useState([]);
  useEffect(()=>{fetchAllAgencies().then(setAgencies);},[]);
  const update=async(id,field,val)=>{if(!sb) return;await sb.from("agencies").update({[field]:val}).eq("id",id);fetchAllAgencies().then(setAgencies);};
  const paying=agencies.filter(a=>a.billing_status==="actif"&&!a.is_offered);
  const mrr=paying.length*PRICE;
  const offertCount=agencies.filter(a=>a.is_offered).length;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Facturation</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+""} sub="Hors offerts" accent={T.stripe}/>
        <SC label="ARR estim" val={mrr*12+""} sub="Projection"/>
        <SC label="Impays" val={agencies.filter(a=>a.billing_status==="impay"&&!a.is_offered).length} accent={T.ng}/>
        <SC label="Offerts " val={offertCount} sub="Hors MRR" accent={T.cy}/>
      </div>
      <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.15)",fontSize:12.5,color:T.tx,marginBottom:14}}>
        Abonnement unique <strong style={{color:T.acc}}>{PRICE}/mois</strong> par agence  Accs illimit  toutes les fonctionnalits
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Toutes les agences</div>
        {agencies.length===0&&<div style={{padding:"28px 20px",textAlign:"center",color:T.sec}}>Aucune agence</div>}
        {agencies.map(ag=>(
          <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 90px 80px 200px"}}>
            <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{ag.name[0]}</div>
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div>
            {billingTag(ag.billing_status,ag.is_offered)}
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.is_offered?"Offert ":ag.billing_status==="actif"?`${PRICE}`:"0"}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {!ag.is_offered&&ag.billing_status!=="actif"&&<button className="btn" style={{fontSize:10.5,padding:"3px 8px",background:`linear-gradient(135deg,${T.ok},#00E676)`}} onClick={()=>update(ag.id,"billing_status","actif")}>Activer</button>}
              {!ag.is_offered&&ag.billing_status==="actif"&&<button style={{padding:"3px 8px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.ng}30`,background:`${T.ng}10`,color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"billing_status","impay")}>Impay</button>}
              {!ag.is_offered&&<button style={{padding:"3px 8px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.cy}30`,background:`${T.cy}10`,color:T.cy,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"is_offered",true)}>Offrir </button>}
              {ag.is_offered&&<button className="btng" style={{fontSize:10.5}} onClick={()=>update(ag.id,"is_offered",false)}>Retirer</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*  CODES PANEL  */
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

  if(!targets.length) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucun lien disponible pour votre rle.</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Liens d'invitation</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Chaque code est <strong style={{color:T.tx}}>unique et personnel</strong>  deux agents n'ont jamais le mme code.</p>
      <div className="card" style={{padding:14,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Gnrer un nouveau code</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {targets.map(r=>(
            <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}} onClick={()=>doGen(r)} disabled={gen===r}>
              {gen===r?<Spin/>:"+"} Inviter un {r}
            </button>
          ))}
        </div>
      </div>
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement</div>:
      codes.length===0?<div style={{textAlign:"center",padding:"24px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12}}>Aucun code actif  Gnre un code ci-dessus</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {codes.map(code=>(
            <div key={code.id} className="card" style={{padding:14,border:`1px solid ${COLORS[code.target_role]||T.acc}25`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>Invitation {code.target_role}</div>
                  <div style={{fontSize:10.5,color:T.sec}}>Expire le {new Date(code.expires_at).toLocaleDateString("fr-FR")}</div></div>
                <span className="tag" style={{background:`${COLORS[code.target_role]||T.acc}18`,color:COLORS[code.target_role]||T.acc}}>{code.target_role}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"7px 11px",border:`1px solid ${COLORS[code.target_role]||T.acc}20`,marginBottom:7}}>
                <code style={{flex:1,fontSize:13.5,fontWeight:900,fontFamily:"monospace",letterSpacing:".1em",color:COLORS[code.target_role]||T.acc}}>{code.code}</code>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5,borderColor:`${COLORS[code.target_role]||T.acc}30`,color:COLORS[code.target_role]||T.acc}} onClick={()=>cp(code.code)}>
                  {copied===code.code?" Copi":"Copier"}
                </button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.04)",borderRadius:8,padding:"6px 10px",border:`1px solid ${T.b}`}}>
                <code style={{flex:1,fontSize:10,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{BASE}?c={code.code}</code>
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${code.id}`)}>{copied===`u-${code.id}`?"":"Copier"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*  PLANNING  */
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
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Indique tes dispo  Ton staff peut voir ce planning pour organiser tes matchs  Tu peux modifier  tout moment</p>
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {DAYS.map((day,i)=>{
            const daySlots=slots.filter(s=>s.day_of_week===i);
            return(
              <div key={i} className="card" style={{padding:14,border:`1px solid ${daySlots.length>0?T.acc+"40":T.b}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:daySlots.length>0||adding===i?10:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{day}</div>
                  <button className="btng" style={{fontSize:10.5}} onClick={()=>setAdding(adding===i?null:i)}>
                    {adding===i?"Annuler":"+ Crneau"}
                  </button>
                </div>
                {daySlots.map(slot=>(
                  <div key={slot.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",borderRadius:8,background:"rgba(127,0,255,.06)",marginBottom:5,border:"1px solid rgba(127,0,255,.15)"}}>
                    <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{slot.start_time?.slice(0,5)}  {slot.end_time?.slice(0,5)}</div>
                    <span className="tag" style={{background:slot.accept_inter_agency?`${T.cy}18`:"rgba(255,255,255,.06)",color:slot.accept_inter_agency?T.cy:T.sec}}>
                      {slot.accept_inter_agency?"Inter-agence":"Intra seulement"}
                    </span>
                    {slot.notes&&<span style={{fontSize:11,color:T.sec,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{slot.notes}</span>}
                    <button className="btng" style={{fontSize:10.5,color:T.ng,borderColor:T.ng+"30",padding:"2px 8px"}} onClick={()=>del(slot.id)}></button>
                  </div>
                ))}
                {adding===i&&(
                  <div style={{padding:12,borderRadius:10,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.2)",marginTop:daySlots.length>0?10:0}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                      <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Dbut</label>
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

/*  MY LIVES  */
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
          <p style={{fontSize:12,color:T.sec,marginTop:2}}>Saisis tes lives manuellement  Connexion TikTok directe bientt</p></div>
        <button className="btn" style={{fontSize:12}} onClick={()=>setShowForm(!showForm)}>+ Ajouter un live</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
        <SC label=" Diamants" val={totalD.toLocaleString()} sub="Ce mois" accent={T.cy}/>
        <SC label=" Heures" val={totalH+"h"} sub={entries.length+" lives"}/>
        <SC label=" Spectateurs" val={entries.reduce((s,e)=>s+(e.viewers||0),0).toLocaleString()} sub="Cumuls"/>
      </div>
      {showForm&&(
        <div className="glow" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Nouveau live</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:11}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Date *</label>
              <input className="inp" type="date" value={form.live_date} onChange={e=>setForm(f=>({...f,live_date:e.target.value}))}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Dure (minutes)</label>
              <input className="inp" type="number" value={form.duration_minutes} onChange={e=>setForm(f=>({...f,duration_minutes:+e.target.value}))} min={0}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}> Diamants reus</label>
              <input className="inp" type="number" value={form.diamonds} onChange={e=>setForm(f=>({...f,diamonds:+e.target.value}))} min={0}/></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}> Spectateurs max</label>
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
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement</div>:
      entries.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun live enregistr  Ajoute ton premier live ci-dessus
          <div style={{marginTop:10,fontSize:11,color:T.sec}}>Connexion TikTok directe bientt </div>
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Historique</div>
          {entries.map(e=>(
            <div key={e.id} className="cr" style={{gridTemplateColumns:"90px 90px 80px 80px 1fr"}}>
              <div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>{new Date(e.live_date).toLocaleDateString("fr-FR")}</div>
              <div style={{fontWeight:700,color:T.cy,fontSize:12}}> {(e.diamonds||0).toLocaleString()}</div>
              <div style={{fontSize:12,color:T.sec}}>{Math.round((e.duration_minutes||0)/60*10)/10}h</div>
              <div style={{fontSize:12,color:T.sec}}> {(e.viewers||0).toLocaleString()}</div>
              <div style={{fontSize:11.5,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.notes||""}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*  MATCHES  */
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
      setAutoResult({pseudo:"Aucun adversaire trouv dans ta tranche"});
    }
  };

  const statusColor={pending:T.go,confirmed:T.ok,done:T.cy,cancelled:T.ng};
  const statusLabel={pending:"En attente",confirmed:"Confirm",done:"Termin",cancelled:"Annul"};
  const canCreate=["agency","director","manager","agent"].includes(role);

  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div><h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Matchs TikTok Live</h1>
          <p style={{fontSize:12,color:T.sec,marginTop:2}}>Matchs intra et inter-agences  Matchmaking automatique par niveau de diamants</p></div>
        {canCreate&&<button className="btn" style={{fontSize:12}} onClick={()=>setShowCreate(!showCreate)}>+ Crer un match</button>}
      </div>

      {/* Matchmaking auto */}
      <div className="card" style={{padding:16,marginBottom:14,background:"rgba(0,229,255,.04)",border:"1px solid rgba(0,229,255,.2)"}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:4}}> Matchmaking automatique</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Diamond's trouve un adversaire de <strong style={{color:T.tx}}>mme niveau</strong> (30% de diamants) selon les disponibilits.</div>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <select className="inp" style={{flex:1,minWidth:200}} value={form.creator_a} onChange={e=>setForm(f=>({...f,creator_a:e.target.value}))}>
            <option value="">Slectionner un crateur</option>
            {creators.map(c=><option key={c.id||c.profile_id} value={c.id||c.profile_id}>{c.pseudo}   {(c.diamonds||0).toLocaleString()}</option>)}
          </select>
          <button className="btn" style={{fontSize:12,padding:"8px 14px"}} onClick={autoMatch} disabled={!form.creator_a}> Trouver un adversaire</button>
        </div>
        {autoResult&&(
          <div style={{marginTop:10,padding:"10px 13px",borderRadius:9,background:"rgba(127,0,255,.08)",border:"1px solid rgba(127,0,255,.2)",fontSize:12.5,color:T.tx}}>
            {autoResult.diamonds?` Adversaire trouv : ${autoResult.pseudo}   ${(autoResult.diamonds||0).toLocaleString()}`:` ${autoResult.pseudo}`}
          </div>
        )}
        <div style={{marginTop:10,fontSize:11,color:T.sec}}> Gnre automatiquement une affiche de match avec @TikTok, date et heure</div>
      </div>

      {showCreate&&canCreate&&(
        <div className="glow" style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Nouveau match</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Crateur A *</label>
              <select className="inp" value={form.creator_a} onChange={e=>setForm(f=>({...f,creator_a:e.target.value}))}>
                <option value="">Choisir</option>
                {creators.map(c=><option key={c.id} value={c.id}>{c.pseudo}   {(c.diamonds||0).toLocaleString()}</option>)}
              </select></div>
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Crateur B (optionnel si matchmaking auto)</label>
              <select className="inp" value={form.creator_b} onChange={e=>setForm(f=>({...f,creator_b:e.target.value}))}>
                <option value=""> dfinir</option>
                {creators.filter(c=>(c.id||c.profile_id)!==form.creator_a).map(c=><option key={c.id} value={c.id}>{c.pseudo}   {(c.diamonds||0).toLocaleString()}</option>)}
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
              <button className="btn" style={{fontSize:12}} onClick={createMatch} disabled={saving||!form.creator_a||!form.match_date}>{saving?<Spin/>:"Crer le match"}</button>
              <button className="btng" onClick={()=>setShowCreate(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement</div>:
      matches.filter(m=>m.status==="pending"&&!m.creator_b).length>0&&(
        <div className="card" style={{padding:16,marginBottom:14,background:"rgba(0,200,83,.04)",border:"1px solid rgba(0,200,83,.2)"}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}> Matchs ouverts  postuler</div>
          {matches.filter(m=>m.status==="pending"&&!m.creator_b).map(m=>(
            <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,background:"rgba(255,255,255,.03)",marginBottom:7,border:`1px solid ${T.b}`}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>Match ouvert  {m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):"Date libre"}</div>
                <div style={{fontSize:11,color:T.sec}}>{m.match_time||"Heure libre"}  {m.is_inter_agency?"Inter-agences":"Intra-agence"}</div>
              </div>
              <button className="btn" style={{fontSize:11.5,padding:"5px 12px",background:`linear-gradient(135deg,${T.ok},#00E676)`}}>Postuler</button>
            </div>
          ))}
        </div>
      )}
      {matches.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun match programm
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Matchs programms</div>
          {matches.map(m=>(
            <div key={m.id} className="cr" style={{gridTemplateColumns:"100px 1fr 80px 90px 80px"}}>
              <div style={{fontWeight:700,fontSize:12,color:T.tx}}>{m.match_date?new Date(m.match_date).toLocaleDateString("fr-FR"):""}</div>
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
              <button className="btng" style={{fontSize:10.5}} onClick={()=>setPoster(m)}>Affiche </button>
            </div>
          ))}
        </div>
      )}
      {poster&&<MatchPoster matchData={poster} creators={creators} onClose={()=>setPoster(null)}/>}
    </div>
  );
}

/*  CREATORS VIEW  */
function CreatorsView({profile,creators,agents,reload}){
  const ag=profile?.agencies;
  const role=profile?.role;
  const [tr,setTr]=useState(null);
  const [sel,setSel]=useState({});
  const [doing,setDoing]=useState(null);
  const canPhone=["admin","agency","director","manager","agent"].includes(role);
  const canName=["admin","agency"].includes(role);
  const canTransfer=["admin","agency"].includes(role);
  const canTogglePayout=role==="agency";

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

  if(!ag) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Chargement</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Crateurs</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <span className="tag" style={{background:`${T.ok}18`,color:T.ok}}>Pseudo = public</span>
        <span className="tag" style={{background:"rgba(127,0,255,.15)",color:T.acc}}>Nom rel = {canName?"visible":"masqu"}</span>
        <span className="tag" style={{background:`${T.go}18`,color:T.go}}>Tlphone = {canPhone?"visible":"masqu"}</span>
      </div>
      {creators.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun crateur  Invitez-en via vos liens
        </div>
      ):(
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}><div style={{minWidth:540}}>
            <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"110px ":""}90px 50px 50px 80px 80px${canTransfer?" 100px":""}`,background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div/><div>Crateur</div>{canName&&<div>Nom</div>}{canPhone&&<div>Tlphone</div>}<div> Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>{canTransfer&&<div>Actions</div>}
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
                        {c.staff_as_creator&&<span className="tag" style={{background:`${T.pu}18`,color:T.pu,fontSize:8,padding:"1px 4px"}}>Staff+Cra</span>}
                        {c.disable_creator_payout&&<span className="tag" style={{background:`${T.ng}18`,color:T.ng,fontSize:8,padding:"1px 4px"}}>Rev. OFF</span>}
                      </div>
                    </div>
                    {canName&&<div style={{fontSize:12,fontWeight:600,color:T.tx}}>{c.first_name} {c.last_name}</div>}
                    {canPhone&&<div style={{fontSize:11,color:T.tx}}>{c.phone||""}</div>}
                    <div style={{fontWeight:700,color:T.cy,fontSize:12}}> {(c.diamonds||0).toLocaleString()}</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
                    <div><span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"ligible":"bloqu"}</span></div>
                    <div style={{fontWeight:700,fontSize:12.5,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}`:"0"}</div>
                    {canTransfer&&(
                      <div style={{display:"flex",gap:4}}>
                        <button className="btng" style={{fontSize:9.5,padding:"2px 6px"}} onClick={()=>setTr(tr===c.id?null:c.id)} title="Transfrer"></button>
                        {canTogglePayout&&<button className="btng" style={{fontSize:9.5,padding:"2px 6px",color:c.disable_creator_payout?T.ok:T.ng}} onClick={()=>togglePayout(c.profile_id,c.disable_creator_payout)} title="Activer/dsactiver reversement crateur">
                          {c.disable_creator_payout?"Rev ":"Rev "}
                        </button>}
                      </div>
                    )}
                  </div>
                  {tr===c.id&&(
                    <div style={{padding:"10px 14px",background:"rgba(127,0,255,.06)",borderBottom:`1px solid ${T.b}`,display:"flex",alignItems:"center",gap:10}}>
                      <div style={{fontSize:12,color:T.sec,flexShrink:0}}>Transfrer vers :</div>
                      <select className="inp" value={sel[c.id]||""} onChange={e=>setSel(s=>({...s,[c.id]:e.target.value}))} style={{flex:1}}>
                        <option value="">Choisir un agent</option>
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

/*  IMPORT BACKSTAGE  */
function ImportView({profile,reload}){
  const [phase,setPhase]=useState("idle");
  const [prog,setProg]=useState(0);
  const [result,setRes]=useState(null);
  const [err,setErr]=useState("");
  const inputRef=useRef();
  const ag=profile?.agencies;
  const canImport=()=>{const r=profile?.role;if(r==="agency"||r==="admin") return true;if(r==="director"&&ag?.director_can_import) return true;if(r==="manager"&&ag?.manager_can_import) return true;return false;};
  const go=async(file)=>{
    setPhase("load");setProg(0);setErr("");
    const text=await file?.text?.()??"";;
    const rows=text.split("\n").slice(1).filter(Boolean).map(line=>{
      const [tiktok_id,pseudo,diamonds,days_live,hours_live]=line.split(",");
      return {tiktok_id:tiktok_id?.trim(),pseudo:pseudo?.trim(),diamonds:+(diamonds||0),days_live:+(days_live||0),hours_live:+(hours_live||0)};
    }).filter(r=>r.tiktok_id);
    let p=0;const iv=setInterval(()=>{p=Math.min(p+Math.random()*14+5,90);setProg(Math.round(p));},110);
    const res=await importBackstage(ag?.id,profile?.id,rows.length?rows:[]);
    clearInterval(iv);setProg(100);
    setTimeout(()=>{if(res?.error){setErr(res.error);setPhase("idle");}else{setRes(res);setPhase("done");reload?.();}},300);
  };
  const expiry=()=>{const d=new Date();d.setMonth(d.getMonth()+1);d.setDate(15);return d.toLocaleDateString("fr-FR");};
  if(!canImport()) return <div style={{padding:"20px 16px",borderRadius:13,background:"rgba(244,67,54,.08)",border:"1px solid rgba(244,67,54,.2)",fontSize:13.5,color:T.ng}}> Permission refuse.</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Import Backstage</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Donnes <strong style={{color:T.tx}}>remplaces</strong>  chaque import  Valides jusqu'au 15 du mois suivant</p>
      {ag?.last_import_date&&<div className="card" style={{padding:13,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx}}>Dernier import : {new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</div>
        <div style={{fontSize:11.5,color:T.sec,marginTop:2}}>{ag.last_import_count} crateurs  Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong></div>
      </div>}
      {err&&<div style={{padding:"8px 11px",borderRadius:9,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:12,color:T.ng,marginBottom:12}}>{err}</div>}
      {phase==="idle"&&<div onClick={()=>inputRef.current?.click()} style={{border:`2px dashed ${T.b}`,borderRadius:16,padding:"36px 28px",textAlign:"center",cursor:"pointer",transition:"border-color .2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=T.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
        <input ref={inputRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>go(e.target.files[0])}/>
        <div style={{fontSize:30,marginBottom:10}}></div>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>Glissez l'export Backstage ici</div>
        <div style={{fontSize:11.5,color:T.sec,marginBottom:14}}>CSV : tiktok_id, pseudo, diamonds, days_live, hours_live</div>
        <button className="btn" style={{fontSize:12}} onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>Choisir un fichier</button>
      </div>}
      {phase==="load"&&<div className="card" style={{padding:"36px 28px",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(127,0,255,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto 13px"}}/>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:13}}>Remplacement</div>
        <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:20,overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${prog}%`,background:`linear-gradient(90deg,${T.acc},${T.cy})`,transition:"width .1s"}}/></div>
        <div style={{marginTop:6,fontSize:11,color:T.sec}}>{prog}%</div>
      </div>}
      {phase==="done"&&<div className="card" style={{padding:24,textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:10}}></div>
        <div style={{fontSize:18,fontWeight:800,color:T.tx,marginBottom:4}}>Import russi !</div>
        <div style={{fontSize:12.5,color:T.sec,marginBottom:14}}><strong style={{color:T.tx}}>{result?.updated??"?"} crateurs</strong> mis  jour  Valide jusqu'au <strong style={{color:T.ok}}>{expiry()}</strong></div>
        <button className="btng" onClick={()=>{setPhase("idle");setRes(null);}}>Importer un autre fichier</button>
      </div>}
    </div>
  );
}

/*  SETTINGS  */
function SettingsView({profile,reload}){
  const ag=profile?.agencies;
  const [pcts,setPcts]=useState({director:ag?.pct_director||3,manager:ag?.pct_manager||5,agent:ag?.pct_agent||10,creator:ag?.pct_creator||55});
  const [minD,setMinD]=useState(ag?.min_days||20);
  const [minH,setMinH]=useState(ag?.min_hours||40);
  const [perms,setPerms]=useState({dir:ag?.director_can_import||false,mgr:ag?.manager_can_import||false,inter:ag?.accept_inter_agency!==false});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const ROLES=[{k:"creator",l:"Part crateur",c:T.ok},{k:"agent",l:"Commission agent",c:T.cy},{k:"manager",l:"Commission manager",c:T.pu},{k:"director",l:"Commission directeur",c:T.acc}];
  const total=Object.values(pcts).reduce((s,v)=>s+v,0);
  const save=async()=>{
    if(!sb||!ag?.id) return;setSaving(true);
    await sb.from("agencies").update({pct_director:pcts.director,pct_manager:pcts.manager,pct_agent:pcts.agent,pct_creator:pcts.creator,min_days:minD,min_hours:minH,director_can_import:perms.dir,manager_can_import:perms.mgr,accept_inter_agency:perms.inter}).eq("id",ag.id);
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);reload?.();
  };
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Paramtres agence</h1>
      <div className="card" style={{padding:20,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Rpartition des revenus</div>
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
        {[{k:"dir",l:"Directeurs peuvent importer",c:T.acc},{k:"mgr",l:"Managers peuvent importer",c:T.pu},{k:"inter",l:"Accepter les matchs inter-agences",c:T.cy}].map(p=>(
          <div key={p.k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:perms[p.k]?`${p.c}08`:"rgba(255,255,255,.02)",border:`1px solid ${perms[p.k]?p.c+"25":T.b}`,marginBottom:7}}>
            <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{p.l}</div>
            <Tog on={perms[p.k]} onChange={v=>setPerms(t=>({...t,[p.k]:v}))} color={p.c}/>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:18,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:4}}>Agences bloques pour les matchs</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Ces agences ne pourront pas proposer de matchs  vos crateurs.</div>
        <BlockedAgenciesPanel profile={profile}/>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}>
        {saved&&<span style={{fontSize:12,color:T.ok}}> Enregistr</span>}
        <button className="btn" onClick={save} disabled={saving}>{saving?<Spin/>:""} Enregistrer</button>
      </div>
    </div>
  );
}

/*  DASH VIEW  */
function DashView({profile,creators,agents,managers,directors}){
  const ag=profile?.agencies;
  const role=profile?.role;
  if(role==="creator"){
    const c=creators[0];
    if(!c) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucune donne  Contactez votre agent.</div>;
    const p=calcPayout(ag,c);
    const dp=Math.min(100,Math.round((c.days_live||0)/(ag?.min_days||20)*100));
    const hp=Math.min(100,Math.round((c.hours_live||0)/(ag?.min_hours||40)*100));
    return(
      <div className="fup">
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:10}}>Bonjour, {c.pseudo} </h1>
        <RemindersPanel matches={[]} schedules={[]}/>
        <div className="glow" style={{padding:24,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Tes diamants ce mois</div>
          <div style={{fontSize:52,fontWeight:900,color:T.cy,lineHeight:1,marginBottom:4}}> {(c.diamonds||0).toLocaleString()}</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:16}}>diamants accumuls en live</div>
          <div style={{display:"inline-flex",padding:"12px 24px",borderRadius:12,background:p.eligible?"rgba(127,0,255,.1)":"rgba(244,67,54,.08)",border:`1px solid ${p.eligible?"rgba(127,0,255,.25)":"rgba(244,67,54,.2)"}`}}>
            <div><div style={{fontSize:11,color:T.sec,marginBottom:2}}>Ce que tu reois</div><div style={{fontSize:26,fontWeight:900,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}`:"0"}</div></div>
          </div>
        </div>
        <div className="card" style={{padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:13}}>{p.eligible?" Tu es ligible !":" Conditions non atteintes"}</div>
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
  if(!ag) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucune agence lie  Contactez l'administrateur.</div>;
  const okBoth=creators.filter(c=>calcPayout(ag,c).eligible).length;
  const total=creators.length;
  const pct=total>0?Math.round(okBoth/total*100):0;
  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{{agency:"Fondateur  Agence",director:"Directeur",manager:"Manager",agent:"Agent"}[role]}</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>{ag.name}</h1>
      </div>
      {ag.last_import_date&&<div style={{padding:"9px 12px",borderRadius:10,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",fontSize:12,color:T.tx,marginBottom:12}}>
         Import du <strong>{new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</strong>  Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong>
      </div>}
      <div className="glow" style={{padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:44,fontWeight:900,color:T.acc,lineHeight:1}}>{okBoth}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:15,fontWeight:700,color:T.sec}}>/ {total}</div><div style={{fontSize:11,color:T.sec}}>crateurs ligibles</div></div>
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
        <SC label="Crateurs" val={`${okBoth}/${total}`} sub={`${total-okBoth} bloqu`} accent={okBoth===total&&total>0?T.ok:"#FF6D00"}/>
      </div>
    </div>
  );
}

/*  TEAM VIEW  */
function TeamView({agents,managers,directors}){
  const [tab,setTab]=useState("agents");
  const lists={agents,managers,directors};
  const colors={agents:T.cy,managers:T.pu,directors:T.acc};
  const items=lists[tab]||[];
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Mon quipe</h1>
      <div style={{display:"flex",gap:5,background:"rgba(255,255,255,.04)",padding:4,borderRadius:10,width:"fit-content",marginBottom:14,border:`1px solid ${T.b}`}}>
        {["directors","managers","agents"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:tab===t?T.acc:"transparent",color:tab===t?"white":T.sec,fontFamily:"Inter,sans-serif",transition:"all .18s"}}>
            {{directors:"Directeurs",managers:"Managers",agents:"Agents"}[t]}
          </button>
        ))}
      </div>
      {items.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>Aucun {tab.slice(0,-1)}  Invitez-en via vos liens</div>
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


/*  REMINDERS PANEL  */
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
      <div style={{fontWeight:700,fontSize:12.5,color:T.go,marginBottom:8}}> Rappels</div>
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
function BlockedAgenciesPanel({profile}){
  const [allAgencies,setAllAgencies]=useState([]);
  const [blocked,setBlocked]=useState([]);
  const [saving,setSaving]=useState(false);
  const ag=profile?.agencies;

  useEffect(()=>{
    fetchAllAgencies().then(d=>setAllAgencies(d.filter(a=>a.id!==ag?.id)));
    if(ag?.blocked_agency_ids) setBlocked(ag.blocked_agency_ids);
  },[ag?.id]);

  const toggle=(id)=>setBlocked(b=>b.includes(id)?b.filter(x=>x!==id):[...b,id]);
  const save=async()=>{
    if(!sb||!ag?.id) return;setSaving(true);
    await sb.from("agencies").update({blocked_agency_ids:blocked}).eq("id",ag.id);
    setSaving(false);
  };

  if(allAgencies.length===0) return(
    <div style={{fontSize:12,color:T.sec}}>Aucune autre agence inscrite sur Diamond's pour le moment.</div>
  );
  return(
    <div>
      <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Agences avec lesquelles vous <strong style={{color:T.ng}}>refusez</strong> les matchs :</div>
      <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
        {allAgencies.map(a=>(
          <div key={a.id} onClick={()=>toggle(a.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 12px",borderRadius:9,background:blocked.includes(a.id)?`${T.ng}08`:"rgba(255,255,255,.02)",border:`1px solid ${blocked.includes(a.id)?T.ng+"30":T.b}`,cursor:"pointer",transition:"all .18s"}}>
            <div style={{width:30,height:30,borderRadius:8,background:(a.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:a.color||T.acc,fontWeight:800,fontSize:13,flexShrink:0}}>{a.name[0]}</div>
            <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{a.name}</div>
            <Tog on={blocked.includes(a.id)} onChange={()=>toggle(a.id)} color={T.ng}/>
          </div>
        ))}
      </div>
      <button className="btn" style={{fontSize:12}} onClick={save} disabled={saving}>{saving?<Spin/>:"Enregistrer les blocages"}</button>
    </div>
  );
}

/* ---- APP ROOT ---- */
export default function App(){
  const auth=useAuth();
  const [tab,setTab]=useState("dash");
  const [team,setTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [loadT,setLT]=useState(false);
  const role=auth.profile?.role;
  const agencyId=auth.profile?.agency_id;
  const ag=auth.profile?.agencies;

  useEffect(()=>{if(agencyId){setLT(true);fetchTeam(agencyId).then(d=>{setTeam(d);setLT(false);})};},[agencyId]);
  useEffect(()=>{setTab("dash");},[role]);

  const reload=()=>{auth.reload();if(agencyId) fetchTeam(agencyId).then(setTeam);};

  if(auth.loading) return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Brand big={true}/></div>
          <div style={{width:28,height:28,borderRadius:"50%",border:"3px solid rgba(127,0,255,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto"}}/></div>
      </div>
    </>
  );

  if(!auth.user) return <><style>{css}</style><LoginPage/></>;

  const isBlocked=role!=="admin"&&ag&&!billingOk(ag);
  const nav=NAVS[role]||NAVS["admin"];
  const views={
    dash:    ()=>role==="admin"?<AdminDash setTab={setTab}/>:<DashView profile={auth.profile} creators={team.creators} agents={team.agents} managers={team.managers} directors={team.directors}/>,
    agencies:()=><AdminAgencies/>,
    billing: ()=><AdminBilling/>,
    all_users:()=><AdminAllUsersView/>,
    all_creators:()=><AdminAllCreatorsView/>,
    all_staff:()=><AdminAllStaffView/>,
    team:    ()=><TeamView agents={team.agents} managers={team.managers} directors={team.directors}/>,
    creators:()=><CreatorsView profile={auth.profile} creators={team.creators} agents={team.agents} reload={reload}/>,
    import:  ()=><ImportView profile={auth.profile} reload={reload}/>,
    links:   ()=><CodesPanel profile={auth.profile}/>,
    settings:()=><SettingsView profile={auth.profile} reload={reload}/>,
    matches: ()=><MatchesView profile={auth.profile} creators={team.creators} agents={team.agents}/>,
    planning:()=><PlanningView profile={auth.profile}/>,
    my_lives:()=><MyLivesView profile={auth.profile}/>,
    all_matches:()=><AdminAllMatchesView/>,
    all_schedules:()=><AdminAllSchedulesView/>,
    all_lives:()=><AdminAllLivesView/>,
  };
  const View=views[tab]||views.dash;

  return(
    <>
      <style>{css}</style>
      {isBlocked&&<BlockedScreen agencyName={ag?.name}/>}
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",fontFamily:"Inter,sans-serif"}}>
        <div style={{width:195,flexShrink:0,background:T.card,borderRight:`1px solid ${T.b}`,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 10px 16px",cursor:"pointer"}} onClick={()=>setTab("dash")}><Brand/></div>
          <div style={{padding:"0 8px",flex:1,overflowY:"auto"}}>
            {nav.map(n=><button key={n.id} className={`nb${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>{n.l}</button>)}
          </div>
          <div style={{padding:"9px 10px",borderTop:`1px solid ${T.b}`,display:"flex",alignItems:"center",gap:8}}>
            <AV name={(auth.profile?.email||"?")[0].toUpperCase()} color={T.acc} size={28}/>
            <div style={{overflow:"hidden",minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:600,color:T.tx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{auth.profile?.email}</div>
              <div style={{fontSize:9.5,color:T.sec}}>{role}</div>
            </div>
          </div>
          <button onClick={auth.signOut} style={{margin:"0 8px 10px",padding:"7px 10px",borderRadius:9,border:`1px solid ${T.b}`,background:"transparent",color:T.sec,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"color .18s"}}
            onMouseEnter={e=>e.currentTarget.style.color=T.ng} onMouseLeave={e=>e.currentTarget.style.color=T.sec}>Déconnexion</button>
        </div>
        <main style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
          {loadT?<div style={{textAlign:"center",padding:40,color:T.sec}}>Chargement…</div>:<View/>}
        </main>
      </div>
    </>
  );
}

