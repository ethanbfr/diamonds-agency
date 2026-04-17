import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SB_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const sb = SB_URL ? createClient(SB_URL, SB_ANON) : null;

const T={bg:"#080808",card:"rgba(255,255,255,0.03)",cardH:"rgba(255,255,255,0.05)",b:"rgba(255,255,255,0.06)",acc:"#9333EA",accL:"#A855F7",glow:"rgba(147,51,234,0.4)",sec:"#6B7280",ok:"#22C55E",ng:"#EF4444",go:"#F59E0B",pu:"#A855F7",tx:"#FFFFFF",txD:"#A1A1AA",stripe:"#9333EA"};
const DAYS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const CONTACT="diamonds.saas@gmail.com";
const PRICE=149;

const css=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-family:Inter,sans-serif;background:#080808;color:#FFFFFF;font-size:13px;min-height:100vh}

@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp2{to{transform:rotate(360deg)}}
@keyframes shine{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(200%) skewX(-15deg)}}

.fup{animation:fup .25s ease both}
.fup1{animation:fup .25s .05s ease both}
.fup2{animation:fup .25s .1s ease both}

.nb{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:400;border:none;background:transparent;width:100%;color:#6B7280;transition:color .15s,background .15s;text-align:left;font-family:Inter,sans-serif;letter-spacing:.01em}
.nb:hover{color:#FFFFFF;background:rgba(255,255,255,0.04)}
.nb.on{color:#FFFFFF;background:transparent;font-weight:500;position:relative}
.nb.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:#9333EA;border-radius:0 2px 2px 0}

.btn{background:#9333EA;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:Inter,sans-serif;transition:all .2s;position:relative;overflow:hidden;letter-spacing:.02em}
.btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);transform:skewX(-15deg);transition:left .5s}
.btn:hover::after{left:160%}
.btn:hover{background:#7C3AED;box-shadow:0 4px 20px rgba(147,51,234,0.35)}
.btn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}

.btng{background:transparent;color:#6B7280;border:1px solid rgba(255,255,255,0.1);border-radius:7px;padding:5px 11px;font-size:11px;font-weight:400;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-family:Inter,sans-serif;transition:all .15s;letter-spacing:.01em}
.btng:hover{color:#FFFFFF;border-color:rgba(255,255,255,0.2)}

.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}

.cr{display:grid;align-items:center;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.04);transition:background .1s}
.cr:last-child{border-bottom:none}
.cr:hover{background:rgba(255,255,255,0.02)}

input[type=range]{-webkit-appearance:none;width:100%;height:3px;border-radius:20px;background:rgba(255,255,255,0.1);outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#9333EA;cursor:pointer}

.inp{width:100%;padding:9px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);color:#FFFFFF;font-size:12.5px;outline:none;font-family:Inter,sans-serif;transition:border .15s}
.inp:focus{border-color:rgba(147,51,234,0.5);background:rgba(255,255,255,0.04)}
.inp::placeholder{color:#4B5563}
select.inp option{background:#111111;color:#FFFFFF}

.card{background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06)}
.card:hover{border-color:rgba(255,255,255,0.1)}
.glow{background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(147,51,234,0.3);box-shadow:0 0 0 1px rgba(147,51,234,0.1)}

.tog{width:38px;height:20px;border-radius:10px;cursor:pointer;border:none;position:relative;flex-shrink:0;transition:background .2s}
.tog .kn{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:white;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.5)}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(147,51,234,0.3);border-radius:3px}
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

/* ─── SUPABASE ──────────────────────────── */
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
  if(!sb) return {error:"Supabase non configuré"};
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
  <svg width={size} height={size} viewBox="0 0 44 44" style={{overflow:"visible"}}>
    <defs>
      <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5D0FE"/>
        <stop offset="30%" stopColor="#C084FC"/>
        <stop offset="65%" stopColor="#8B30D4"/>
        <stop offset="100%" stopColor="#E879F9"/>
      </linearGradient>
      <linearGradient id="dg2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.92)"/>
        <stop offset="100%" stopColor="rgba(168,85,247,0.1)"/>
      </linearGradient>
      <linearGradient id="dg3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6B21A8"/>
        <stop offset="100%" stopColor="#9333EA"/>
      </linearGradient>
    </defs>
    <polygon points="22,2 41,16 22,42 3,16" fill="url(#dg)" stroke="#D8B4FE" strokeWidth="0.8" style={{filter:"drop-shadow(0 0 16px rgba(168,85,247,0.95))"}}/>
    <polygon points="22,2 41,16 22,16 3,16" fill="url(#dg2)" opacity=".85"/>
    <polygon points="22,16 41,16 22,42" fill="url(#dg3)" opacity=".45"/>
    <line x1="3" y1="16" x2="41" y2="16" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2"/>
    <line x1="22" y1="2" x2="22" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
    <circle cx="22" cy="2" r="2" fill="white" opacity="0.95"/>
    <circle cx="41" cy="16" r="1.5" fill="#E879F9" opacity="0.85"/>
    <circle cx="3" cy="16" r="1.5" fill="#E879F9" opacity="0.85"/>
  </svg>
);
const Spk=({x,y,d})=>(
  <div style={{position:"absolute",left:x,top:y,animation:`spk ${5+d}s ${d}s ease-in-out infinite`,pointerEvents:"none"}}>
    <svg width="7" height="7" viewBox="0 0 8 8"><path d="M4 0L5 3 8 4 5 5 4 8 3 5 0 4 3 3Z" fill="rgba(180,130,255,.9)"/></svg>
  </div>
);
const Brand=({big=false})=>(
  <div style={{display:"flex",alignItems:"center",gap:big?14:8}}>
    <div style={{position:"relative",width:big?60:28,height:big?60:28,flexShrink:0}}>
      <DiamondSVG size={big?60:28}/>
      {big&&<><Spk x={-7} y={-5} d={0}/><Spk x={57} y={-3} d={.4}/><Spk x={-4} y={52} d={.7}/><Spk x={58} y={50} d={.2}/></>}
    </div>
    <div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:big?32:14,color:T.tx,letterSpacing:"-0.025em",lineHeight:1}}><span style={{background:"linear-gradient(135deg,#F5D0FE,#C084FC,#A855F7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Diamond's</span></div>
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
  if(isOffered) return <span className="tag" style={{background:`${T.cy}18`,color:T.cy}}>Offert ♥</span>;
  const m={actif:{bg:`${T.ok}18`,c:T.ok,l:"Abonné"},impayé:{bg:`${T.ng}18`,c:T.ng,l:"Impayé"},essai:{bg:`${T.go}18`,c:T.go,l:"Essai"}};
  const v=m[s]||m.essai;
  return <span className="tag" style={{background:v.bg,color:v.c}}>{v.l}</span>;
};

/* ─── NAV ───────────────────────────────── */
const NAVS={
  admin:   [{id:"dash",l:"Vue globale"},{id:"agencies",l:"Agences"},{id:"billing",l:"Facturation"},{id:"invite_agencies",l:"Inviter agences"},{id:"all_users",l:"Utilisateurs"},{id:"all_creators",l:"Créateurs"},{id:"all_staff",l:"Staff"},{id:"all_matches",l:"Matchs"},{id:"all_schedules",l:"Plannings"},{id:"all_lives",l:"Lives"},{id:"poster_templates",l:"Templates affiches"}],
  agency:  [{id:"dash",l:"Dashboard"},{id:"team",l:"Mon équipe"},{id:"creators",l:"Créateurs"},{id:"import",l:"Import Backstage"},{id:"links",l:"Liens d'invitation"},{id:"matches",l:"Matchs"},{id:"settings",l:"Paramètres"}],
  director:[{id:"dash",l:"Mon pôle"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"}],
  manager: [{id:"dash",l:"Mon groupe"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mes liens"}],
  agent:   [{id:"dash",l:"Dashboard"},{id:"creators",l:"Mes créateurs"},{id:"matches",l:"Matchs"},{id:"links",l:"Mon lien"}],
  creator: [{id:"dash",l:"Mon espace"},{id:"planning",l:"Mon planning"},{id:"my_lives",l:"Mes lives"},{id:"matches",l:"Mes matchs"}],
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
  const [handle,setHandle]=useState("");
  const [avatar,setAvatar]=useState(null);
  const [mode,setMode]=useState("login");
  const [err,setErr]=useState("");
  const [load,setLoad]=useState(false);

  const login=async()=>{
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    const {error}=await sb.auth.signInWithPassword({email,password:pw});
    if(error){setErr(error.message);setLoad(false);}
  };
  const register=async()=>{
    if(!code.trim()){setErr("Code d'invitation requis");return;}
    setErr("");setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    // Check if it's an agency code (starts with AGENCE-)
    const cleanCode=code.trim().toUpperCase();
    const isAgencyCode=cleanCode.startsWith("AGENCE-");
    if(isAgencyCode){
      // Agency registration flow
      const {data:codeData}=await sb.from("invite_codes").select("*").eq("code",cleanCode).single();
      if(!codeData){setErr("Code agence invalide");setLoad(false);return;}
      const {data,error}=await sb.auth.signUp({email,password:pw});
      if(error){setErr(error.message);setLoad(false);return;}
      if(data.user){
        // Create agency
        const {data:agData,error:agError}=await sb.from("agencies").insert({
          name:email.split("@")[0],slug:cleanCode.split("-")[1]||"AG",
          billing_status:"essai",is_offered:false,
          pct_director:3,pct_manager:5,pct_agent:10,pct_creator:55,
          min_days:20,min_hours:40,accept_inter_agency:true
        }).select().single();
        if(agError||!agData){setErr("Erreur création agence: "+(agError?.message||"données invalides"));setLoad(false);return;}
        // Set profile as agency role - permanent, code deletion won't affect this
        const {error:profError}=await sb.from("profiles").update({role:"agency",agency_id:agData.id}).eq("id",data.user.id);
        if(profError){setErr("Erreur profil: "+profError.message);setLoad(false);return;}
        // Mark code used but profile role is permanent in profiles table
        await sb.from("invite_codes").update({uses:1}).eq("code",cleanCode);
      }
      setMode("confirm");setLoad(false);return;
    }
    // Regular member registration
    const {data,error}=await sb.auth.signUp({email,password:pw});
    if(error){setErr(error.message);setLoad(false);return;}
    const {error:cErr}=await sb.rpc("use_invite_code",{p_code:cleanCode,p_user_id:data.user?.id});
    if(cErr){setErr("Code invalide ou expiré");setLoad(false);return;}
    // Save TikTok handle
    if(handle.trim()) await sb.from("profiles").update({tiktok_handle:"@"+handle.trim()}).eq("id",data.user?.id);
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
    <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",maxWidth:360,padding:20}} className="fup">
        <div style={{fontSize:40,marginBottom:14}}>✅</div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:8}}>Compte créé !</h1>
        <p style={{fontSize:13,color:T.sec,marginBottom:20}}>Vérifie ta boîte mail pour confirmer, puis connecte-toi.</p>
        <button className="btn" style={{fontSize:13,padding:"9px 20px"}} onClick={()=>setMode("login")}>Se connecter</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
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
            <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Mot de passe</label>
              <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():register())} placeholder="••••••••"/></div>
            {mode==="register"&&(
              <>
                <div><label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Code d'invitation</label>
                  <input className="inp" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="NOVA-AGENT-XXXXXX" style={{fontFamily:"monospace",letterSpacing:".08em"}}/>
                  <div style={{fontSize:11,color:T.sec,marginTop:4}}>Code fourni par votre agence</div>
                </div>
              </>
            )}
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <button className="btn" style={{width:"100%",justifyContent:"center",padding:"9px",marginTop:4}} onClick={mode==="login"?login:register} disabled={load}>
              {load?<><Spin/>{mode==="login"?"Connexion…":"Inscription…"}</>:(mode==="login"?"Se connecter":"Créer mon compte")}
            </button>
          </div>
        </div>
        <div style={{textAlign:"center",fontSize:11.5,color:T.sec}}>
          Problème ? <a href={`mailto:${CONTACT}`} style={{color:T.acc,textDecoration:"none"}}>{CONTACT}</a>
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
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
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
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {agencies.map(ag=>(
            <div key={ag.id} className="card" style={{padding:16,display:"flex",alignItems:"center",gap:12,transition:"border-color .2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(127,0,255,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
              <div style={{width:44,height:44,borderRadius:13,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:18,flexShrink:0}}>{ag.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.tx,display:"flex",alignItems:"center",gap:7,marginBottom:3}}>{ag.name}{billingTag(ag.billing_status,ag.is_offered)}</div>
                <div style={{fontSize:11.5,color:T.sec}}>Slug: {ag.slug} · Crea {ag.pct_creator||55}% · Agt {ag.pct_agent||10}%</div>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <button className="btng" style={{fontSize:10.5}} onClick={()=>{setSel(ag);loadCodes(ag.id);}}>Codes</button>
                <button className="btng" style={{fontSize:10.5}} onClick={()=>setViewDash(ag)}>Dashboard</button>
                {!ag.is_offered&&ag.billing_status!=="actif"&&<button className="btn" style={{fontSize:10.5,padding:"4px 9px",background:`linear-gradient(135deg,${T.ok},#00E676)`}} onClick={()=>updateBilling(ag.id,"billing_status","actif")}>Activer</button>}
                {!ag.is_offered&&<button style={{padding:"4px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.cy}30`,background:`${T.cy}10`,color:T.cy,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>updateBilling(ag.id,"is_offered",true)}>Offrir ♥</button>}
                {ag.is_offered&&<button className="btng" style={{fontSize:10.5,color:T.ng}} onClick={()=>updateBilling(ag.id,"is_offered",false)}>Retirer</button>}
                {ag.billing_status==="actif"&&!ag.is_offered&&<button style={{padding:"4px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.ng}30`,background:`${T.ng}10`,color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>updateBilling(ag.id,"billing_status","impayé")}>Impayé</button>}
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
  useEffect(()=>{fetchAllAgencies().then(setAgencies);},[]);
  const update=async(id,field,val)=>{if(!sb) return;await sb.from("agencies").update({[field]:val}).eq("id",id);fetchAllAgencies().then(setAgencies);};
  const paying=agencies.filter(a=>a.billing_status==="actif"&&!a.is_offered);
  const mrr=paying.length*PRICE;
  const offertCount=agencies.filter(a=>a.is_offered).length;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Facturation</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub="Hors offerts" accent={T.stripe}/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection"/>
        <SC label="Impayés" val={agencies.filter(a=>a.billing_status==="impayé"&&!a.is_offered).length} accent={T.ng}/>
        <SC label="Offerts ♥" val={offertCount} sub="Hors MRR" accent={T.cy}/>
      </div>
      <div style={{padding:"10px 14px",borderRadius:11,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.15)",fontSize:12.5,color:T.tx,marginBottom:14}}>
        Abonnement unique <strong style={{color:T.acc}}>{PRICE}€/mois</strong> par agence · Accès illimité à toutes les fonctionnalités
      </div>
      <div className="card" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Toutes les agences</div>
        {agencies.length===0&&<div style={{padding:"28px 20px",textAlign:"center",color:T.sec}}>Aucune agence</div>}
        {agencies.map(ag=>(
          <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 90px 80px 200px"}}>
            <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{ag.name[0]}</div>
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div>
            {billingTag(ag.billing_status,ag.is_offered)}
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.is_offered?"Offert ♥":ag.billing_status==="actif"?`${PRICE}€`:"0€"}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {!ag.is_offered&&ag.billing_status!=="actif"&&<button className="btn" style={{fontSize:10.5,padding:"3px 8px",background:`linear-gradient(135deg,${T.ok},#00E676)`}} onClick={()=>update(ag.id,"billing_status","actif")}>Activer</button>}
              {!ag.is_offered&&ag.billing_status==="actif"&&<button style={{padding:"3px 8px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.ng}30`,background:`${T.ng}10`,color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"billing_status","impayé")}>Impayé</button>}
              {!ag.is_offered&&<button style={{padding:"3px 8px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.cy}30`,background:`${T.cy}10`,color:T.cy,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"is_offered",true)}>Offrir ♥</button>}
              {ag.is_offered&&<button className="btng" style={{fontSize:10.5}} onClick={()=>update(ag.id,"is_offered",false)}>Retirer</button>}
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
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Liens d'invitation</h1>
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
  const canCreate=["agency","director","manager","agent"].includes(role);

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
              <button className="btng" style={{fontSize:10.5}} onClick={()=>setPoster(m)}>Affiche 🖼</button>
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
  if(!canImport()) return <div style={{padding:"20px 16px",borderRadius:13,background:"rgba(244,67,54,.08)",border:"1px solid rgba(244,67,54,.2)",fontSize:13.5,color:T.ng}}>⛔ Permission refusée.</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Import Backstage</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Données <strong style={{color:T.tx}}>remplacées</strong> à chaque import · Valides jusqu'au 15 du mois suivant</p>
      {ag?.last_import_date&&<div className="card" style={{padding:13,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx}}>Dernier import : {new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</div>
        <div style={{fontSize:11.5,color:T.sec,marginTop:2}}>{ag.last_import_count} créateurs · Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong></div>
      </div>}
      {err&&<div style={{padding:"8px 11px",borderRadius:9,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:12,color:T.ng,marginBottom:12}}>{err}</div>}
      {phase==="idle"&&<div onClick={()=>inputRef.current?.click()} style={{border:`2px dashed ${T.b}`,borderRadius:16,padding:"36px 28px",textAlign:"center",cursor:"pointer",transition:"border-color .2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=T.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
        <input ref={inputRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>go(e.target.files[0])}/>
        <div style={{fontSize:30,marginBottom:10}}>📁</div>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>Glissez l'export Backstage ici</div>
        <div style={{fontSize:11.5,color:T.sec,marginBottom:14}}>CSV : tiktok_id, pseudo, diamonds, days_live, hours_live</div>
        <button className="btn" style={{fontSize:12}} onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>Choisir un fichier</button>
      </div>}
      {phase==="load"&&<div className="card" style={{padding:"36px 28px",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(127,0,255,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto 13px"}}/>
        <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:13}}>Remplacement…</div>
        <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:20,overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${prog}%`,background:`linear-gradient(90deg,${T.acc},${T.cy})`,transition:"width .1s"}}/></div>
        <div style={{marginTop:6,fontSize:11,color:T.sec}}>{prog}%</div>
      </div>}
      {phase==="done"&&<div className="card" style={{padding:24,textAlign:"center"}}>
        <div style={{fontSize:24,marginBottom:10}}>✅</div>
        <div style={{fontSize:18,fontWeight:800,color:T.tx,marginBottom:4}}>Import réussi !</div>
        <div style={{fontSize:12.5,color:T.sec,marginBottom:14}}><strong style={{color:T.tx}}>{result?.updated??"?"} créateurs</strong> mis à jour · Valide jusqu'au <strong style={{color:T.ok}}>{expiry()}</strong></div>
        <button className="btng" onClick={()=>{setPhase("idle");setRes(null);}}>Importer un autre fichier</button>
      </div>}
    </div>
  );
}

/* ─── SETTINGS ──────────────────────────── */
function SettingsView({profile,reload}){
  const ag=profile?.agencies;
  const [pcts,setPcts]=useState({director:ag?.pct_director||3,manager:ag?.pct_manager||5,agent:ag?.pct_agent||10,creator:ag?.pct_creator||55});
  const [minD,setMinD]=useState(ag?.min_days||20);
  const [minH,setMinH]=useState(ag?.min_hours||40);
  const [perms,setPerms]=useState({dir:ag?.director_can_import||false,mgr:ag?.manager_can_import||false,inter:ag?.accept_inter_agency!==false});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const ROLES=[{k:"creator",l:"Part créateur",c:T.ok},{k:"agent",l:"Commission agent",c:T.cy},{k:"manager",l:"Commission manager",c:T.pu},{k:"director",l:"Commission directeur",c:T.acc}];
  const total=Object.values(pcts).reduce((s,v)=>s+v,0);
  const save=async()=>{
    if(!sb||!ag?.id) return;setSaving(true);
    await sb.from("agencies").update({pct_director:pcts.director,pct_manager:pcts.manager,pct_agent:pcts.agent,pct_creator:pcts.creator,min_days:minD,min_hours:minH,director_can_import:perms.dir,manager_can_import:perms.mgr,accept_inter_agency:perms.inter}).eq("id",ag.id);
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);reload?.();
  };
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Paramètres agence</h1>
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
        {[{k:"dir",l:"Directeurs peuvent importer",c:T.acc},{k:"mgr",l:"Managers peuvent importer",c:T.pu},{k:"inter",l:"Accepter les matchs inter-agences",c:T.cy}].map(p=>(
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
        <button className="btn" onClick={save} disabled={saving}>{saving?<Spin/>:"✓"} Enregistrer</button>
      </div>
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
const POSTER_BG = {
  lion:    "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=85",
  galaxy:  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=85",
  roses:   "https://images.unsplash.com/photo-1490750967868-88df5691cc8f?w=800&q=85",
  fire:    "https://images.unsplash.com/photo-1486551937199-baf066a6485b?w=800&q=85",
  marble:  "https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800&q=85",
  jungle:  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=85",
};

const POSTER_TEMPLATES = [
  {id:"lion",   label:"Lion King",    accent:"#D4A017", text:"#FFE066", overlay:"rgba(10,5,0,.55)"},
  {id:"galaxy", label:"Galaxy",       accent:"#A855F7", text:"#E879F9", overlay:"rgba(10,0,30,.55)"},
  {id:"roses",  label:"Rose Queen",   accent:"#FF69B4", text:"#FFB3C1", overlay:"rgba(40,0,20,.55)"},
  {id:"fire",   label:"Fire",         accent:"#FF4500", text:"#FF8C42", overlay:"rgba(30,5,0,.55)"},
  {id:"marble", label:"Black Marble", accent:"#CCCCCC", text:"#FFFFFF", overlay:"rgba(0,0,0,.58)"},
  {id:"jungle", label:"Jungle",       accent:"#00C853", text:"#69F0AE", overlay:"rgba(0,10,3,.55)"},
];

function PosterCanvas({tmpl,cA,cB,matchDate,matchTime,isInter}){
  const canvasRef=useRef();
  const date=matchDate?new Date(matchDate).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"}):"??/??";
  const time=matchTime||"20:00";

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=540,H=960;
    canvas.width=W;canvas.height=H;

    const draw=()=>{
      // Background image
      const bg=new Image();
      bg.crossOrigin="anonymous";
      bg.src=POSTER_BG[tmpl.id];
      bg.onload=()=>{
        // Draw bg image cover
        const ratio=Math.max(W/bg.width,H/bg.height);
        const bw=bg.width*ratio,bh=bg.height*ratio;
        ctx.drawImage(bg,(W-bw)/2,(H-bh)/2,bw,bh);
        // Dark overlay
        ctx.fillStyle=tmpl.overlay;
        ctx.fillRect(0,0,W,H);
        // Gradient bottom
        const grad=ctx.createLinearGradient(0,H*0.45,0,H);
        grad.addColorStop(0,"transparent");
        grad.addColorStop(1,"rgba(0,0,0,0.92)");
        ctx.fillStyle=grad;
        ctx.fillRect(0,0,W,H);

        drawContent(ctx,W,H);
      };
      bg.onerror=()=>{
        ctx.fillStyle="#0A0A0A";
        ctx.fillRect(0,0,W,H);
        drawContent(ctx,W,H);
      };
    };

    const roundRect=(ctx,x,y,w,h,r)=>{
      ctx.beginPath();
      ctx.moveTo(x+r,y);
      ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
      ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
      ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
      ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
      ctx.closePath();
    };

    const drawAvatar=(ctx,x,y,r,img,initials)=>{
      ctx.save();
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();
      if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,x-r,y-r,r*2,r*2);}
      else{
        ctx.fillStyle="rgba(0,0,0,0.5)";ctx.fillRect(x-r,y-r,r*2,r*2);
        ctx.fillStyle=tmpl.text;ctx.font=`bold ${r*0.9}px Arial Black,Arial`;
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText((initials||"?")[0].toUpperCase(),x,y+2);
      }
      ctx.restore();
      // Ring
      ctx.strokeStyle=tmpl.accent;ctx.lineWidth=4;
      ctx.shadowColor=tmpl.accent;ctx.shadowBlur=20;
      ctx.beginPath();ctx.arc(x,y,r+2,0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;
    };

    const drawContent=(ctx,W,H)=>{
      // TOP LINE deco
      ctx.strokeStyle=tmpl.accent;ctx.lineWidth=1;ctx.globalAlpha=0.5;
      ctx.beginPath();ctx.moveTo(40,55);ctx.lineTo(W/2-40,55);ctx.stroke();
      ctx.beginPath();ctx.moveTo(W/2+40,55);ctx.lineTo(W-40,55);ctx.stroke();
      ctx.globalAlpha=1;

      // LIVE badges
      const liveStyle=()=>{
        ctx.fillStyle=`${tmpl.accent}22`;
        ctx.strokeStyle=tmpl.accent;ctx.lineWidth=1.5;
      };
      liveStyle();
      roundRect(ctx,30,68,80,28,5);ctx.fill();ctx.stroke();
      ctx.fillStyle=tmpl.text;ctx.font="bold 13px Arial";ctx.textAlign="center";
      ctx.fillText("LIVE",70,87);
      liveStyle();
      roundRect(ctx,W-110,68,80,28,5);ctx.fill();ctx.stroke();
      ctx.fillStyle=tmpl.text;ctx.fillText("LIVE",W-70,87);

      // TITLE
      ctx.fillStyle=tmpl.text;
      ctx.font="bold 58px Arial Black,Arial";ctx.textAlign="center";
      ctx.shadowColor=tmpl.accent;ctx.shadowBlur=25;
      ctx.fillText("LIVE",W/2,175);ctx.shadowBlur=0;
      ctx.fillStyle=`${tmpl.accent}99`;
      ctx.font="15px Arial";ctx.letterSpacing="8px";
      ctx.fillText("B A T T L E  M A T C H",W/2,205);

      // divider
      ctx.strokeStyle=`${tmpl.accent}55`;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(60,225);ctx.lineTo(W-60,225);ctx.stroke();

      // AVATARS
      const drawAv=(url,initials,x,y)=>{
        if(url){
          const img=new Image();img.crossOrigin="anonymous";
          img.onload=()=>{drawAvatar(ctx,x,y,95,img,initials);};
          img.onerror=()=>{drawAvatar(ctx,x,y,95,null,initials);};
          img.src=url;
        } else {
          drawAvatar(ctx,x,y,95,null,initials);
        }
      };
      drawAv(cA?.tiktok_avatar_url,(cA?.pseudo||"A").replace("@",""),W/4,390);
      drawAv(cB?.tiktok_avatar_url,(cB?.pseudo||"B").replace("@",""),W*3/4,390);

      // VS circle
      ctx.fillStyle="rgba(0,0,0,0.8)";ctx.strokeStyle=tmpl.accent;ctx.lineWidth=3;
      ctx.shadowColor=tmpl.accent;ctx.shadowBlur=15;
      ctx.beginPath();ctx.arc(W/2,390,46,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.shadowBlur=0;
      ctx.fillStyle=tmpl.accent;ctx.font="bold 28px Arial Black,Arial";ctx.textAlign="center";
      ctx.fillText("VS",W/2,400);

      // @pseudo
      ctx.fillStyle=tmpl.accent;ctx.font="bold 20px Arial";ctx.textAlign="center";
      ctx.fillText(cA?.pseudo||"@nom1",W/4,510);
      ctx.fillText(cB?.pseudo||"@nom2",W*3/4,510);

      // DATE BOX
      ctx.fillStyle=`${tmpl.accent}18`;ctx.strokeStyle=tmpl.accent;ctx.lineWidth=2;
      roundRect(ctx,60,560,W-120,130,16);ctx.fill();ctx.stroke();
      ctx.fillStyle=`${tmpl.accent}88`;ctx.font="12px Arial";ctx.letterSpacing="4px";
      ctx.fillText("R E N D E Z - V O U S",W/2,595);
      ctx.fillStyle=tmpl.text;ctx.font="bold 42px Arial Black,Arial";ctx.letterSpacing="2px";
      ctx.shadowColor=tmpl.accent;ctx.shadowBlur=12;
      ctx.fillText(`LE ${date}`,W/2,650);ctx.shadowBlur=0;
      ctx.fillStyle=tmpl.accent;ctx.font="bold 26px Arial";ctx.letterSpacing="1px";
      ctx.fillText(time,W/2,685);

      // TYPE badge
      if(isInter){
        ctx.fillStyle=`${tmpl.accent}22`;ctx.strokeStyle=`${tmpl.accent}66`;ctx.lineWidth=1;
        roundRect(ctx,W/2-80,715,160,26,13);ctx.fill();ctx.stroke();
        ctx.fillStyle=`${tmpl.accent}cc`;ctx.font="10px Arial";ctx.letterSpacing="2px";
        ctx.fillText("INTER-AGENCES",W/2,732);
      }

      // Bottom branding
      ctx.fillStyle=`${tmpl.accent}44`;ctx.font="11px Arial";ctx.letterSpacing="3px";
      ctx.fillText("DIAMOND'S BY BELIVE ACADEMY",W/2,900);
    };

    draw();
  },[tmpl,cA,cB,matchDate,matchTime]);

  return <canvas ref={canvasRef} style={{width:"100%",borderRadius:10,display:"block"}}/>;
}

function MatchPoster({matchData,creators,onClose}){
  const cA=creators.find(c=>c.id===matchData.creator_a||c.profile_id===matchData.creator_a);
  const cB=creators.find(c=>c.id===matchData.creator_b||c.profile_id===matchData.creator_b);
  const [selected,setSelected]=useState("lion");
  const canvasRef=useRef();
  const tmpl=POSTER_TEMPLATES.find(t=>t.id===selected)||POSTER_TEMPLATES[0];

  const download=()=>{
    // Find the canvas element
    const canvas=document.querySelector("#poster-dl canvas");
    if(!canvas) return;
    const a=document.createElement("a");
    a.download=`match-${cA?.pseudo||"A"}-vs-${cB?.pseudo||"B"}-${selected}.png`;
    a.href=canvas.toDataURL("image/png");
    a.click();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.96)",zIndex:300,display:"flex",backdropFilter:"blur(8px)",overflowY:"auto"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{margin:"auto",width:"100%",maxWidth:860,padding:20,display:"flex",gap:20,alignItems:"flex-start"}}>

        {/* LEFT — template grid */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:700,fontSize:16,color:"#FFF",marginBottom:4}}>Choisir un template</div>
          <div style={{fontSize:12,color:"#666",marginBottom:14}}>Les vraies photos des créateurs s'affichent automatiquement si uploadées</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            {POSTER_TEMPLATES.map(t=>(
              <div key={t.id} onClick={()=>setSelected(t.id)} style={{cursor:"pointer",borderRadius:10,overflow:"hidden",border:`2px solid ${selected===t.id?t.accent:"rgba(255,255,255,0.08)"}`,transition:"all .2s",transform:selected===t.id?"scale(1.04)":"scale(1)",boxShadow:selected===t.id?`0 0 20px ${t.accent}50`:"none"}}>
                <div style={{position:"relative",paddingBottom:"120%",overflow:"hidden",background:"#111"}}>
                  <img src={POSTER_BG[t.id]} crossOrigin="anonymous" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.55}} alt=""/>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${t.overlay} 0%,rgba(0,0,0,.85) 100%)`}}/>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,width:"100%",justifyContent:"center",marginBottom:8}}>
                      <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${t.accent}`,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:t.text}}>{(cA?.pseudo||"A").replace("@","")[0]?.toUpperCase()||"A"}</div>
                      <div style={{fontSize:11,fontWeight:900,color:t.accent,padding:"3px 7px",border:`1px solid ${t.accent}`,borderRadius:"50%",background:"rgba(0,0,0,.7)"}}>VS</div>
                      <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${t.accent}`,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:t.text}}>{(cB?.pseudo||"B").replace("@","")[0]?.toUpperCase()||"B"}</div>
                    </div>
                    <div style={{width:"100%",border:`1px solid ${t.accent}`,borderRadius:6,background:"rgba(0,0,0,.6)",padding:"5px",textAlign:"center"}}>
                      <div style={{fontSize:9,fontWeight:900,color:t.text}}>LE {matchData.match_date?new Date(matchData.match_date).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"}):"??/??"} · {matchData.match_time||"20:00"}</div>
                    </div>
                  </div>
                </div>
                <div style={{background:"#0D0D0D",padding:"6px 8px",textAlign:"center",fontSize:9,fontWeight:700,color:selected===t.id?t.accent:"#666",letterSpacing:".06em",textTransform:"uppercase"}}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — canvas preview + download */}
        <div style={{width:200,flexShrink:0,position:"sticky",top:20}}>
          <div style={{fontWeight:700,fontSize:15,color:"#FFF",marginBottom:4}}>Aperçu HD</div>
          <div style={{fontSize:11,color:"#555",marginBottom:10}}>{cA?.pseudo||"Créateur A"} vs {cB?.pseudo||"Créateur B"}</div>
          {(!cA?.tiktok_avatar_url||!cB?.tiktok_avatar_url)&&(
            <div style={{padding:"8px 10px",borderRadius:8,background:"rgba(147,51,234,0.1)",border:"1px solid rgba(147,51,234,0.2)",fontSize:11,color:"#A78BFA",marginBottom:10}}>
              💡 Ajoutez des photos TikTok dans les profils pour qu'elles apparaissent sur l'affiche
            </div>
          )}
          <div id="poster-dl" style={{borderRadius:10,overflow:"hidden",marginBottom:12}}>
            <PosterCanvas tmpl={tmpl} cA={cA} cB={cB} matchDate={matchData.match_date} matchTime={matchData.match_time} isInter={matchData.is_inter_agency}/>
          </div>
          <button className="btn" style={{width:"100%",justifyContent:"center",fontSize:13,padding:"10px",marginBottom:8}} onClick={download}>
            ⬇ Télécharger PNG
          </button>
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
  useEffect(()=>{fetchAllProfiles().then(d=>{setProfiles(d);setLoading(false);});},[]);
  const filtered=profiles.filter(p=>{
    const s=!search||p.email?.toLowerCase().includes(search.toLowerCase())||p.tiktok_handle?.toLowerCase().includes(search.toLowerCase())||p.role?.toLowerCase().includes(search.toLowerCase());
    const f=filter==="all"||p.role===filter;
    return s&&f;
  });
  const roleC={admin:T.acc,agency:T.acc,director:"#818CF8",manager:"#34D399",agent:"#60A5FA",creator:"#F472B6"};
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Utilisateurs</h1>
        <p style={{fontSize:13,color:T.sec}}>Tous les inscrits sur Diamond's</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
        <SC label="Total" val={profiles.length} accent={T.acc}/>
        <SC label="Agences" val={profiles.filter(p=>p.role==="agency").length}/>
        <SC label="Staff" val={profiles.filter(p=>["director","manager","agent"].includes(p.role)).length}/>
        <SC label="Créateurs" val={profiles.filter(p=>p.role==="creator").length}/>
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
            <span className="tag" style={{background:`${roleC[p.role]||T.sec}15`,color:roleC[p.role]||T.sec}}>{p.role}</span>
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
  const demoA={pseudo:"@créateur_A",tiktok_avatar_url:null,diamonds:15000};
  const demoB={pseudo:"@créateur_B",tiktok_avatar_url:null,diamonds:12500};
  const demoMatch={match_date:new Date().toISOString().split("T")[0],match_time:"20:00",is_inter_agency:false};
  const [selected,setSelected]=useState(null);
  return(
    <div className="fup">
      <div style={{marginBottom:20}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.tx,marginBottom:4}}>Templates d'affiches</h1>
        <p style={{fontSize:13,color:T.sec}}>Aperçu des 6 templates disponibles lors de la génération d'un match</p>
      </div>
      <div style={{padding:"10px 14px",borderRadius:10,background:"rgba(147,51,234,0.08)",border:"1px solid rgba(147,51,234,0.2)",fontSize:12,color:"#A78BFA",marginBottom:20}}>
        💡 Ces templates s'affichent automatiquement quand vous cliquez sur <strong style={{color:"#FFFFFF"}}>"Affiche 🖼"</strong> sur un match. Les créateurs avec une photo de profil verront leur vraie photo sur l'affiche.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {POSTER_TEMPLATES.map(tmpl=>(
          <div key={tmpl.id} onClick={()=>setSelected(selected===tmpl.id?null:tmpl.id)} style={{cursor:"pointer"}}>
            <div style={{position:"relative",paddingBottom:"120%",overflow:"hidden",background:"#111",borderRadius:10,border:`2px solid ${selected===tmpl.id?tmpl.accent:"rgba(255,255,255,0.08)"}`}}>
              <img src={POSTER_BG[tmpl.id]} crossOrigin="anonymous" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.55}} alt=""/>
              <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${tmpl.overlay} 0%,rgba(0,0,0,.85) 100%)`}}/>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:8}}>
                <div style={{display:"flex",alignItems:"center",gap:6,width:"100%",justifyContent:"center",marginBottom:8}}>
                  <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${tmpl.accent}`,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:tmpl.text}}>{(demoA?.pseudo||"A").replace("@","")[0]?.toUpperCase()||"A"}</div>
                  <div style={{fontSize:11,fontWeight:900,color:tmpl.accent,padding:"3px 7px",border:`1px solid ${tmpl.accent}`,borderRadius:"50%",background:"rgba(0,0,0,.7)"}}>VS</div>
                  <div style={{width:34,height:34,borderRadius:"50%",border:`2px solid ${tmpl.accent}`,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:tmpl.text}}>{(demoB?.pseudo||"B").replace("@","")[0]?.toUpperCase()||"B"}</div>
                </div>
                <div style={{width:"100%",border:`1px solid ${tmpl.accent}`,borderRadius:6,background:"rgba(0,0,0,.6)",padding:"5px",textAlign:"center"}}>
                  <div style={{fontSize:9,fontWeight:900,color:tmpl.text}}>LE {demoMatch.match_date?new Date(demoMatch.match_date).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit"}):"??/??"} · {demoMatch.match_time||"20:00"}</div>
                </div>
              </div>
            </div>
            <div style={{background:"#0D0D0D",padding:"6px 8px",textAlign:"center",fontSize:9,fontWeight:700,color:selected===tmpl.id?tmpl.accent:"#666",letterSpacing:".06em",textTransform:"uppercase"}}>{tmpl.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── APP ROOT ──────────────────────────── */
export default function App(){
  const auth=useAuth();
  const [tab,setTab]=useState("dash");
  const [team,setTeam]=useState({creators:[],agents:[],managers:[],directors:[]});
  const [loadT,setLoadT]=useState(false);
  const role=auth.profile?.role;
  const agencyId=auth.profile?.agency_id;
  const ag=auth.profile?.agencies;

  useEffect(()=>{if(agencyId){setLoadT(true);fetchTeam(agencyId).then(d=>{setTeam(d);setLoadT(false);})};},[agencyId]);
  useEffect(()=>{setTab("dash");},[role]);

  const reload=()=>{auth.reload();if(agencyId) fetchTeam(agencyId).then(setTeam);};

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

  const isBlocked=role!=="admin"&&ag&&!billingOk(ag);
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
    invite_agencies:()=><AdminInviteAgencies/>,
    all_users:()=><AdminAllUsersView/>,
    all_creators:()=><AdminAllCreatorsView/>,
    all_staff:()=><AdminAllStaffView/>,
    all_matches:()=><AdminAllMatchesView/>,
    all_schedules:()=><AdminAllSchedulesView/>,
    all_lives:()=><AdminAllLivesView/>,
    poster_templates:()=><AdminPosterTemplatesView/>,
  };
  const View=views[tab]||views.dash;

  return(
    <>
      <style>{css}</style>
      {isBlocked&&<BlockedScreen agencyName={ag?.name}/>}
      <div style={{minHeight:"100vh",background:"#080808",display:"flex",fontFamily:"Inter,sans-serif"}}>
        <div style={{width:195,flexShrink:0,background:"#0D0D0D",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column"}}>
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
