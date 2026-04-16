import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SB_URL  = import.meta.env.VITE_SUPABASE_URL  || "";
const SB_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const sb = SB_URL ? createClient(SB_URL, SB_ANON) : null;

/* ─── TOKENS ─────────────────────────────────────── */
const T = {
  bg:"#0F0A1E",card:"#1A1035",b:"#2D1F5E",acc:"#7F00FF",cy:"#00E5FF",
  sec:"#7B6FA0",ok:"#00C853",ng:"#F44336",go:"#FFB300",pu:"#8E44AD",tx:"#F0EAFF",
};

/* ─── CSS ─────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Inter,sans-serif;background:${T.bg};color:${T.tx};font-size:13px}
@keyframes spk{0%,100%{transform:translate(0,0) scale(1);opacity:.9}35%{transform:translate(4px,-6px) scale(1.3);opacity:.4}70%{transform:translate(-3px,-2px) scale(.8);opacity:.3}}
@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp2{to{transform:rotate(360deg)}}
.fup{animation:fup .3s ease both}.fup1{animation:fup .3s .06s ease both}.fup2{animation:fup .3s .12s ease both}
.nb{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:500;border:none;background:transparent;width:100%;color:${T.sec};transition:all .18s;text-align:left;font-family:Inter,sans-serif}
.nb:hover{background:rgba(127,0,255,.1);color:${T.acc}}
.nb.on{background:rgba(127,0,255,.15);color:${T.acc};position:relative}
.nb.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:${T.acc};border-radius:0 2px 2px 0}
.btn{background:linear-gradient(135deg,${T.acc},#B060FF);color:#fff;border:none;border-radius:9px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:Inter,sans-serif;transition:all .2s}
.btn:hover{box-shadow:0 4px 18px rgba(127,0,255,.4);transform:translateY(-1px)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btng{background:transparent;color:${T.sec};border:1px solid ${T.b};border-radius:8px;padding:4px 10px;font-size:11px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-family:Inter,sans-serif;transition:all .18s}
.btng:hover{background:rgba(127,0,255,.1);color:${T.acc};border-color:rgba(127,0,255,.3)}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600}
.cr{display:grid;align-items:center;padding:9px 14px;border-bottom:1px solid ${T.b};transition:background .15s}
.cr:last-child{border-bottom:none}.cr:hover{background:rgba(127,0,255,.04)}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:20px;background:rgba(255,255,255,.1);outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${T.acc};cursor:pointer}
.inp{width:100%;padding:8px 11px;border-radius:8px;border:1px solid ${T.b};background:rgba(255,255,255,.04);color:${T.tx};font-size:12.5px;outline:none;font-family:Inter,sans-serif;transition:border .18s}
.inp:focus{border-color:${T.acc};box-shadow:0 0 0 3px rgba(127,0,255,.1)}
.inp::placeholder{color:${T.sec}}
select.inp option{background:#1A1035;color:#F0EAFF}
`;

/* ─── HELPERS ─────────────────────────────────────── */
const calcPayout = (ag, c) => {
  const ok = (c.days_live||0)>=(ag?.min_days||20) && (c.hours_live||0)>=(ag?.min_hours||40);
  if(!ok) return {eligible:false,creator:0,agent:0,manager:0,director:0};
  const b = (c.diamonds||0)*0.017;
  return {eligible:true,creator:Math.round(b*(ag?.pct_creator||55)/100),agent:Math.round(b*(ag?.pct_agent||10)/100),manager:Math.round(b*(ag?.pct_manager||5)/100),director:Math.round(b*(ag?.pct_director||3)/100)};
};

/* ─── SUPABASE CALLS ─────────────────────────────── */
const getProfile = async (uid) => {
  if(!sb) return null;
  const {data,error} = await sb.from("profiles").select("*").eq("id",uid).single();
  if(error||!data) return null;
  if(data.agency_id){
    const {data:ag} = await sb.from("agencies").select("*").eq("id",data.agency_id).single();
    data.agencies = ag||null;
  }
  return data;
};

const fetchTeam = async (agencyId) => {
  if(!sb||!agencyId) return {creators:[],agents:[],managers:[],directors:[]};
  const [cr,ag,mg,dr] = await Promise.all([
    sb.from("creators").select("*").eq("agency_id",agencyId),
    sb.from("agents").select("*").eq("agency_id",agencyId),
    sb.from("managers").select("*").eq("agency_id",agencyId),
    sb.from("directors").select("*").eq("agency_id",agencyId),
  ]);
  return {creators:cr.data||[],agents:ag.data||[],managers:mg.data||[],directors:dr.data||[]};
};

const fetchAllAgencies = async () => {
  if(!sb) return [];
  const {data} = await sb.from("agencies").select("*").order("created_at",{ascending:false});
  return data||[];
};

const createAgency = async (name,slug,color) => {
  if(!sb) return {error:"Supabase non configuré"};
  const {data,error} = await sb.from("agencies").insert({
    name:name.trim(), slug:slug.trim().toUpperCase(), color:color||"#7F00FF",
    billing_status:"essai", pct_director:3, pct_manager:5, pct_agent:10, pct_creator:55,
    min_days:20, min_hours:40, director_can_import:false, manager_can_import:false
  }).select().single();
  if(error) return {error:error.message};
  return {data};
};

const genCode = async (agencyId,issuerId,issuerRole,targetRole) => {
  if(!sb) return null;
  const {data,error} = await sb.rpc("generate_invite_code",{
    p_agency_id:agencyId, p_issuer_id:issuerId,
    p_issuer_role:issuerRole, p_target_role:targetRole
  });
  return error ? null : data;
};

const getMyCodes = async (issuerId) => {
  if(!sb) return [];
  const {data} = await sb.from("invite_codes").select("*").eq("issuer_id",issuerId).eq("used",false).order("created_at",{ascending:false});
  return data||[];
};

const transferCreator = async (creatorId,newAgentId) => {
  if(!sb) return false;
  const {error} = await sb.from("creators").update({agent_id:newAgentId}).eq("id",creatorId);
  return !error;
};

const importBackstage = async (agencyId,importerId,rows) => {
  if(!sb) return {error:"Supabase non configuré"};
  const {data,error} = await sb.rpc("import_backstage",{p_agency_id:agencyId,p_importer_id:importerId,p_data:rows});
  return error?{error:error.message}:data;
};

/* ─── SHARED UI ──────────────────────────────────── */
const DiamondSVG = ({size=40}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <defs>
      <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C080FF"/><stop offset="55%" stopColor="#7F00FF"/><stop offset="100%" stopColor="#00E5FF"/>
      </linearGradient>
      <linearGradient id="dg2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,.6)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <polygon points="20,2 37,15 20,38 3,15" fill="url(#dg)" style={{filter:"drop-shadow(0 0 8px rgba(127,0,255,.5))"}}/>
    <polygon points="20,2 37,15 20,15 3,15" fill="url(#dg2)" opacity=".6"/>
    <line x1="3" y1="15" x2="37" y2="15" stroke="rgba(255,255,255,.2)" strokeWidth=".8"/>
    <line x1="20" y1="2" x2="20" y2="15" stroke="rgba(255,255,255,.15)" strokeWidth=".6"/>
  </svg>
);

const Spk = ({x,y,d}) => (
  <div style={{position:"absolute",left:x,top:y,animation:`spk ${5+d}s ${d}s ease-in-out infinite`,pointerEvents:"none"}}>
    <svg width="7" height="7" viewBox="0 0 8 8"><path d="M4 0L5 3 8 4 5 5 4 8 3 5 0 4 3 3Z" fill="rgba(180,130,255,.9)"/></svg>
  </div>
);

const Brand = ({big=false}) => (
  <div style={{display:"flex",alignItems:"center",gap:big?14:8}}>
    <div style={{position:"relative",width:big?60:28,height:big?60:28,flexShrink:0}}>
      <DiamondSVG size={big?60:28}/>
      {big&&<><Spk x={-7} y={-5} d={0}/><Spk x={57} y={-3} d={.4}/><Spk x={-4} y={52} d={.7}/><Spk x={58} y={50} d={.2}/></>}
    </div>
    <div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:big?32:14,color:T.tx,letterSpacing:"-0.025em",lineHeight:1}}>
        Diamond<span style={{color:T.cy}}>'</span>s
      </div>
      <div style={{fontSize:big?10:8.5,color:T.sec,fontWeight:500,marginTop:1,letterSpacing:".06em"}}>by Belive Academy</div>
    </div>
  </div>
);

const AV = ({name="?",color=T.acc,size=30}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}28,${color}15)`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:700,fontSize:size*.36,flexShrink:0}}>
    {String(name).slice(0,2).toUpperCase()}
  </div>
);

const SC = ({label,val,sub,accent}) => (
  <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:14,position:"relative",overflow:"hidden"}}>
    {accent&&<div style={{position:"absolute",top:0,right:0,width:70,height:70,background:`radial-gradient(${accent}18,transparent 70%)`,borderRadius:"0 12px 0 100%"}}/>}
    <div style={{fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{label}</div>
    <div style={{fontSize:accent?24:18,fontWeight:800,color:accent||T.tx,marginBottom:4}}>{val}</div>
    {sub&&<div style={{fontSize:11,color:T.sec}}>{sub}</div>}
  </div>
);

const Spin = () => <div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid white",animation:"sp2 .7s linear infinite"}}/>;

const NAVS = {
  admin:    [{id:"dash",l:"Vue globale"},{id:"agencies",l:"Agences"},{id:"billing",l:"Facturation"}],
  agency:   [{id:"dash",l:"Dashboard"},{id:"team",l:"Mon équipe"},{id:"creators",l:"Créateurs"},{id:"import",l:"Import Backstage"},{id:"links",l:"Liens d'invitation"},{id:"settings",l:"Paramètres"}],
  director: [{id:"dash",l:"Mon pôle"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mes liens"}],
  manager:  [{id:"dash",l:"Mon groupe"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mes liens"}],
  agent:    [{id:"dash",l:"Dashboard"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mon lien"}],
  creator:  [{id:"dash",l:"Mon espace"}],
};

/* ─── AUTH ───────────────────────────────────────── */
function useAuth(){
  const [user,setUser]       = useState(null);
  const [profile,setProfile] = useState(null);
  const [loading,setLoading] = useState(true);

  const load = async (uid) => {
    try {
      const p = await getProfile(uid);
      setProfile(p);
    } catch(e){ console.error(e); }
    setLoading(false);
  };

  useEffect(()=>{
    if(!sb){setLoading(false);return;}
    sb.auth.getSession().then(({data:{session}})=>{
      setUser(session?.user??null);
      if(session?.user) load(session.user.id);
      else setLoading(false);
    });
    const {data:{subscription}} = sb.auth.onAuthStateChange((_,session)=>{
      setUser(session?.user??null);
      if(session?.user) load(session.user.id);
      else {setProfile(null);setLoading(false);}
    });
    return ()=>subscription.unsubscribe();
  },[]);

  return {
    user, profile, loading,
    signIn:  (e,p) => sb?.auth.signInWithPassword({email:e,password:p}),
    signOut: ()    => sb?.auth.signOut(),
    reload:  ()    => user && load(user.id),
  };
}

/* ─── LOGIN ──────────────────────────────────────── */
function LoginPage(){
  const [email,setEmail] = useState("");
  const [pw,setPw]       = useState("");
  const [code,setCode]   = useState("");
  const [mode,setMode]   = useState("login");
  const [err,setErr]     = useState("");
  const [load,setLoad]   = useState(false);

  const login = async () => {
    setErr(""); setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    const {error} = await sb.auth.signInWithPassword({email,password:pw});
    if(error){setErr(error.message);setLoad(false);}
  };

  const register = async () => {
    if(!code.trim()){setErr("Entrez votre code d'invitation");return;}
    setErr(""); setLoad(true);
    if(!sb){setErr("Supabase non configuré");setLoad(false);return;}
    const {data,error} = await sb.auth.signUp({email,password:pw});
    if(error){setErr(error.message);setLoad(false);return;}
    const {error:codeErr} = await sb.rpc("use_invite_code",{p_code:code.trim().toUpperCase(),p_user_id:data.user?.id});
    if(codeErr){setErr("Code invalide ou expiré");setLoad(false);return;}
    setMode("confirm"); setLoad(false);
  };

  if(mode==="confirm") return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,rgba(127,0,255,.15) 0%,transparent 55%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{textAlign:"center",maxWidth:360}} className="fup">
        <div style={{fontSize:40,marginBottom:14}}>✅</div>
        <h1 style={{fontSize:22,fontWeight:800,color:T.tx,marginBottom:8}}>Compte créé !</h1>
        <p style={{fontSize:13,color:T.sec,marginBottom:20}}>Vérifie ta boîte mail pour confirmer, puis connecte-toi.</p>
        <button className="btn" style={{fontSize:13,padding:"9px 20px"}} onClick={()=>setMode("login")}>Se connecter</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,rgba(127,0,255,.15) 0%,transparent 55%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:24}} className="fup">
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Brand big={true}/></div>
          <div style={{fontSize:12.5,color:T.sec,marginTop:10}}>La plateforme des agences TikTok Live</div>
        </div>
        <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.b}`,padding:22,marginBottom:10}} className="fup1">
          <div style={{display:"flex",gap:4,marginBottom:18,background:"rgba(255,255,255,.04)",padding:4,borderRadius:10}}>
            {["login","register"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"7px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:mode===m?T.acc:"transparent",color:mode===m?"white":T.sec,fontFamily:"Inter,sans-serif",transition:"all .18s"}}>
                {m==="login"?"Connexion":"Inscription"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Email</label>
              <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():register())} placeholder="vous@email.com"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Mot de passe</label>
              <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="login"?login():register())} placeholder="••••••••"/>
            </div>
            {mode==="register"&&(
              <div>
                <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Code d'invitation</label>
                <input className="inp" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="NOVA-AGENT-XXXXXX" style={{fontFamily:"monospace",letterSpacing:".08em"}}/>
                <div style={{fontSize:11,color:T.sec,marginTop:4}}>Demandez ce code à votre directeur ou manager</div>
              </div>
            )}
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <button className="btn" style={{width:"100%",justifyContent:"center",padding:"9px",marginTop:4}} onClick={mode==="login"?login:register} disabled={load}>
              {load?<><Spin/>{mode==="login"?"Connexion…":"Inscription…"}</>:(mode==="login"?"Se connecter":"Créer mon compte")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN DASH ─────────────────────────────────── */
function AdminDash({setTab}){
  const [agencies,setAgencies] = useState([]);
  const [loading,setLoading]   = useState(true);

  useEffect(()=>{
    fetchAllAgencies().then(d=>{setAgencies(d);setLoading(false);});
  },[]);

  const mrr = agencies.filter(a=>a.billing_status==="actif").length*99;
  const offert = agencies.filter(a=>a.billing_status==="offert").length;

  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Super Admin · Belive Academy</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Vue globale</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub="99€/agence actif" accent={T.acc}/>
        <SC label="Agences" val={agencies.length} sub="Total"/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection"/>
        <SC label="Actives" val={agencies.filter(a=>a.billing_status==="actif").length} sub="Abonnées" accent={T.ok}/>
      </div>
      {loading?(
        <div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement…</div>
      ):agencies.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          <div style={{fontSize:16,fontWeight:700,color:T.tx,marginBottom:8}}>Aucune agence pour l'instant</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:16}}>Crée ta première agence pour commencer.</div>
          <button className="btn" onClick={()=>setTab("agencies")}>+ Créer une agence</button>
        </div>
      ):(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Agences</div>
          {agencies.map((ag,i)=>(
            <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 80px 80px"}}>
              <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{(ag.name||"?")[0]}</div>
              <div><div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div><div style={{fontSize:11,color:T.sec}}>Slug: {ag.slug}</div></div>
              <span className="tag" style={{background:ag.billing_status==="actif"?`${T.ok}18`:ag.billing_status==="impayé"?`${T.ng}18`:ag.billing_status==="offert"?`${T.cy}18`:`${T.go}18`,color:ag.billing_status==="actif"?T.ok:ag.billing_status==="impayé"?T.ng:ag.billing_status==="offert"?T.cy:T.go}}>
                {ag.billing_status==="actif"?"Abonné":ag.billing_status==="impayé"?"Impayé":ag.billing_status==="offert"?"Offert ♥":"Essai"}
              </span>
              <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.billing_status==="actif"?"99€":"0€"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN AGENCIES ─────────────────────────────── */
function AdminAgencies(){
  const [agencies,setAgencies] = useState([]);
  const [sel,setSel]           = useState(null);
  const [showForm,setShowForm] = useState(false);
  const [viewDash,setViewDash] = useState(null);
  const [name,setName]         = useState("");
  const [slug,setSlug]         = useState("");
  const [color,setColor]       = useState("#7F00FF");
  const [creating,setCreating] = useState(false);
  const [err,setErr]           = useState("");
  const [codes,setCodes]       = useState({});
  const [genning,setGenning]   = useState(null);
  const [copied,setCopied]     = useState(null);
  const BASE = "https://agency.beliveacademy.com/join";
  const COLORS = {director:T.acc,manager:T.pu,agent:T.cy,creator:T.ok};

  const load = () => fetchAllAgencies().then(setAgencies);
  useEffect(()=>{load();},[]);

  // Charger les codes existants pour une agence
  const loadCodes = async (agId) => {
    if(!sb) return;
    const {data} = await sb.from("invite_codes").select("*").eq("agency_id",agId).eq("used",false).order("created_at",{ascending:false});
    setCodes(c=>({...c,[agId]:data||[]}));
  };

  const doCreate = async () => {
    if(!name.trim()||!slug.trim()){setErr("Nom et slug obligatoires");return;}
    setCreating(true); setErr("");
    const res = await createAgency(name,slug,color);
    if(res.error){setErr(res.error);setCreating(false);return;}
    await load();
    setName(""); setSlug(""); setColor("#7F00FF");
    setShowForm(false); setCreating(false);
  };

  const doGenCode = async (ag,targetRole) => {
    const key = ag.id+"-"+targetRole;
    setGenning(key);
    // Utiliser l'ID admin comme issuer
    const {data:{user}} = await sb.auth.getUser();
    await genCode(ag.id, user.id, "admin", targetRole);
    await loadCodes(ag.id);
    setGenning(null);
  };

  const cp = (k) => {setCopied(k);setTimeout(()=>setCopied(null),2000);};

  if(viewDash) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>setViewDash(null)}>← Retour</button>
        <h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>Dashboard — {viewDash.name}</h1>
        <span className="tag" style={{background:viewDash.billing_status==="offert"?`${T.cy}18`:`${T.ok}18`,color:viewDash.billing_status==="offert"?T.cy:T.ok}}>
          {viewDash.billing_status==="offert"?"Offert ♥":"Abonné"}
        </span>
      </div>
      <AdminAgencyDash ag={viewDash}/>
    </div>
  );

  if(sel) return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
        <button className="btng" onClick={()=>{setSel(null);}}>← Retour</button>
        <div style={{width:38,height:38,borderRadius:10,background:(sel.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:sel.color||T.acc,fontWeight:800,fontSize:16}}>{sel.name[0]}</div>
        <div>
          <h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>{sel.name}</h1>
          <div style={{fontSize:11.5,color:T.sec}}>Slug: {sel.slug} · Crea {sel.pct_creator||55}% · Agent {sel.pct_agent||10}%</div>
        </div>
      </div>

      {/* Générer des codes */}
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:16,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:4}}>Générer des codes d'invitation</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Chaque code généré est <strong style={{color:T.tx}}>unique</strong> — jamais le même pour deux personnes différentes.</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["director","manager","agent","creator"].map(r=>{
            const key = sel.id+"-"+r;
            return(
              <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}}
                onClick={()=>doGenCode(sel,r)} disabled={genning===key}>
                {genning===key?<Spin/>:"+"} Code {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Codes actifs */}
      <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Codes actifs (non utilisés)</div>
      {(codes[sel.id]||[]).length===0?(
        <div style={{textAlign:"center",padding:"24px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12,fontSize:12}}>
          Aucun code actif · Génère des codes ci-dessus pour inviter des membres
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {(codes[sel.id]||[]).map(code=>(
            <div key={code.id} style={{background:T.card,borderRadius:11,border:`1px solid ${COLORS[code.target_role]||T.acc}25`,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>Invitation {code.target_role}</div>
                  <div style={{fontSize:10.5,color:T.sec}}>Expire le {new Date(code.expires_at).toLocaleDateString("fr-FR")}</div>
                </div>
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
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${code.id}`)}>
                  {copied===`u-${code.id}`?"✓":"Copier"}
                </button>
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
        <div style={{background:T.card,borderRadius:12,border:`1px solid rgba(127,0,255,.3)`,padding:18,marginBottom:14}} className="fup">
          <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:14}}>Créer une nouvelle agence</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Nom de l'agence *</label>
              <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Nova TikTok"/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Slug unique * (utilisé dans les codes)</label>
              <input className="inp" value={slug} onChange={e=>setSlug(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))} placeholder="NOVA" style={{fontFamily:"monospace",letterSpacing:".08em"}}/>
              <div style={{fontSize:11,color:T.sec,marginTop:3}}>Ex: NOVA → les codes seront NOVA-AGENT-XXXXXX</div>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Couleur</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={color} onChange={e=>setColor(e.target.value)} style={{width:38,height:34,borderRadius:8,border:`1px solid ${T.b}`,background:"transparent",cursor:"pointer",padding:2}}/>
                <div style={{width:34,height:34,borderRadius:10,background:color+"18",border:`1px solid ${color}40`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:800,fontSize:14}}>{name?name[0]:"?"}</div>
                <span style={{fontSize:11.5,color:T.sec}}>Couleur de l'agence</span>
              </div>
            </div>
            {err&&<div style={{padding:"7px 10px",borderRadius:8,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <div style={{display:"flex",gap:8}}>
              <button className="btn" onClick={doCreate} disabled={creating}>{creating?<><Spin/>Création…</>:"Créer l'agence"}</button>
              <button className="btng" onClick={()=>{setShowForm(false);setErr("");}}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {agencies.length===0?(
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:8}}>Aucune agence</div>
          <div style={{fontSize:12,color:T.sec}}>Clique sur "+ Nouvelle agence" pour commencer.</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {agencies.map(ag=>(
            <div key={ag.id}
              style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:16,cursor:"pointer",transition:"border-color .2s",display:"flex",alignItems:"center",gap:12}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(127,0,255,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
              <div style={{width:44,height:44,borderRadius:13,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:18,flexShrink:0}}>{ag.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,color:T.tx}}>{ag.name}</div>
                <div style={{fontSize:11.5,color:T.sec}}>Slug: {ag.slug} · Crea {ag.pct_creator||55}% · Agent {ag.pct_agent||10}% · Manager {ag.pct_manager||5}% · Dir {ag.pct_director||3}%</div>
              </div>
              <div style={{flexShrink:0,textAlign:"right"}}>
                <span className="tag" style={{background:ag.billing_status==="actif"?`${T.ok}18`:ag.billing_status==="impayé"?`${T.ng}18`:ag.billing_status==="offert"?`${T.cy}18`:`${T.go}18`,color:ag.billing_status==="actif"?T.ok:ag.billing_status==="impayé"?T.ng:ag.billing_status==="offert"?T.cy:T.go,display:"block",marginBottom:4}}>
                  {ag.billing_status==="actif"?"Abonné":ag.billing_status==="impayé"?"Impayé":ag.billing_status==="offert"?"Offert ♥":"Essai"}
                </span>
                <div style={{display:"flex",flexDirection:"column",gap:5}}><button className="btn" style={{fontSize:10.5,padding:"4px 10px"}} onClick={e=>{e.stopPropagation();setSel(ag);loadCodes(ag.id);}}>Codes →</button><button className="btng" style={{fontSize:10.5}} onClick={e=>{e.stopPropagation();setViewDash(ag);}}>Dashboard →</button></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN BILLING ──────────────────────────────── */
function AdminBilling(){
  const [agencies,setAgencies] = useState([]);
  useEffect(()=>{fetchAllAgencies().then(setAgencies);},[]);

  const update = async (id,status) => {
    if(!sb) return;
    await sb.from("agencies").update({billing_status:status}).eq("id",id);
    fetchAllAgencies().then(setAgencies);
  };

  const mrr = agencies.filter(a=>a.billing_status==="actif").length*99;
  const offert = agencies.filter(a=>a.billing_status==="offert").length;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Facturation</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub="Abonnements actifs" accent="#635BFF"/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection"/>
        <SC label="Impayés" val={agencies.filter(a=>a.billing_status==="impayé").length} sub="" accent={T.ng}/>
        <SC label="En essai" val={agencies.filter(a=>a.billing_status==="essai").length} sub="À convertir" accent={T.go}/>
        <SC label="Offerts ♥" val={offertCount} sub="Hors MRR" accent={T.cy}/>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Toutes les agences</div>
        {agencies.length===0&&<div style={{padding:"28px 20px",textAlign:"center",color:T.sec}}>Aucune agence</div>}
        {agencies.map((ag,i)=>(
          <div key={ag.id} className="cr" style={{gridTemplateColumns:"38px 1fr 80px 80px 130px"}}>
            <div style={{width:32,height:32,borderRadius:9,background:(ag.color||T.acc)+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color||T.acc,fontWeight:800,fontSize:13}}>{ag.name[0]}</div>
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div>
            <span className="tag" style={{background:ag.billing_status==="actif"?`${T.ok}18`:ag.billing_status==="impayé"?`${T.ng}18`:ag.billing_status==="offert"?`${T.cy}18`:`${T.go}18`,color:ag.billing_status==="actif"?T.ok:ag.billing_status==="impayé"?T.ng:ag.billing_status==="offert"?T.cy:T.go}}>
              {ag.billing_status==="actif"?"Abonné":ag.billing_status==="impayé"?"Impayé":ag.billing_status==="offert"?"Offert ♥":"Essai"}
            </span>
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.billing_status==="actif"?"99€":"0€"}</div>
            <div style={{display:"flex",gap:6}}>
              {ag.billing_status!=="actif"&&ag.billing_status!=="offert"&&<button className="btn" style={{fontSize:10.5,padding:"3px 9px",background:`linear-gradient(135deg,${T.ok},#00E676)`}} onClick={()=>update(ag.id,"actif")}>Activer</button>}
              {ag.billing_status==="actif"&&<button style={{padding:"3px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.ng}30`,background:`${T.ng}10`,color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"impayé")}>Impayé</button>}
              {ag.billing_status==="impayé"&&<button className="btn" style={{fontSize:10.5,padding:"3px 9px"}} onClick={()=>update(ag.id,"essai")}>Essai</button>}
              {ag.billing_status!=="offert"&&<button style={{padding:"3px 9px",borderRadius:7,fontSize:10.5,border:`1px solid ${T.cy}30`,background:`${T.cy}10`,color:T.cy,cursor:"pointer",fontFamily:"Inter,sans-serif"}} onClick={()=>update(ag.id,"offert")}>Offrir ♥</button>}
              {ag.billing_status==="offert"&&<button className="btng" style={{fontSize:10.5}} onClick={()=>update(ag.id,"essai")}>Retirer</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── ADMIN AGENCY DASH ──────────────────────────── */
/* Vue complète d'une agence depuis l'espace admin */
function AdminAgencyDash({ag}){
  const [team,setTeam] = useState({creators:[],agents:[],managers:[],directors:[]});
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    fetchTeam(ag.id).then(d=>{setTeam(d);setLoading(false);});
  },[ag.id]);

  if(loading) return <div style={{textAlign:"center",padding:30,color:T.sec}}>Chargement…</div>;

  const {creators,agents,managers,directors} = team;
  const okBoth = creators.filter(c=>calcPayout(ag,c).eligible).length;
  const total  = creators.length;
  const pct    = total>0?Math.round(okBoth/total*100):0;

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="Directeurs" val={directors.length} sub="" accent={T.acc}/>
        <SC label="Managers"   val={managers.length}  sub=""/>
        <SC label="Agents"     val={agents.length}    sub=""/>
        <SC label="Créateurs"  val={`${okBoth}/${total}`} sub={`${total-okBoth} bloqué`} accent={okBoth===total&&total>0?T.ok:"#FF6D00"}/>
      </div>
      <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(127,0,255,.3)",padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:10}}>
          <div style={{fontSize:40,fontWeight:900,color:T.acc,lineHeight:1}}>{okBoth}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:13,fontWeight:700,color:T.sec}}>/ {total} éligibles</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:26,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div></div>
        </div>
        {total>0&&<div style={{height:6,borderRadius:20,overflow:"hidden",display:"flex",gap:2}}><div style={{flex:okBoth,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/><div style={{flex:total-okBoth,background:"rgba(244,67,54,.28)",borderRadius:20}}/></div>}
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:10}}>
          {[{l:`Crea ${ag.pct_creator||55}%`,c:T.ok},{l:`Agt ${ag.pct_agent||10}%`,c:T.cy},{l:`Mgr ${ag.pct_manager||5}%`,c:T.pu},{l:`Dir ${ag.pct_director||3}%`,c:T.acc}].map((x,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:x.c}}/><span style={{fontSize:11,color:T.sec}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      {creators.length>0&&(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
          <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Créateurs</div>
          <div style={{overflowX:"auto"}}><div style={{minWidth:480}}>
            <div className="cr" style={{gridTemplateColumns:"30px 1fr 90px 50px 50px 75px 75px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div/><div>Pseudo</div><div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>
            </div>
            {creators.map(c=>{
              const p=calcPayout(ag,c);
              return(
                <div key={c.id} className="cr" style={{gridTemplateColumns:"30px 1fr 90px 50px 50px 75px 75px"}}>
                  <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.acc} size={26}/>
                  <div><div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo}</div><div style={{fontSize:10,color:T.sec}}>{agents.find(a=>a.id===c.agent_id)?.name||"—"}</div></div>
                  <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(c.diamonds||0).toLocaleString()}</div>
                  <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
                  <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
                  <div><span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"éligible":"bloqué"}</span></div>
                  <div style={{fontWeight:700,fontSize:12,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}€`:"0€"}</div>
                </div>
              );
            })}
          </div></div>
        </div>
      )}
    </div>
  );
}

/* ─── CODES PANEL ────────────────────────────────── */
function CodesPanel({profile,agents}){
  const [codes,setCodes]     = useState([]);
  const [loading,setLoading] = useState(true);
  const [gen,setGen]         = useState(null);
  const [copied,setCopied]   = useState(null);
  const role = profile?.role;
  const ag   = profile?.agencies;
  const BASE = "https://agency.beliveacademy.com/join";
  const COLORS = {director:T.acc,manager:T.pu,agent:T.cy,creator:T.ok};
  const targets = {agency:["director","manager","agent","creator"],director:["manager","agent","creator"],manager:["agent","creator"],agent:["creator"]}[role]||[];

  useEffect(()=>{
    if(profile?.id) getMyCodes(profile.id).then(d=>{setCodes(d);setLoading(false);});
  },[profile?.id]);

  const doGen = async (r) => {
    setGen(r);
    await genCode(ag?.id, profile?.id, role, r);
    const fresh = await getMyCodes(profile.id);
    setCodes(fresh); setGen(null);
  };
  const cp = (k) => {setCopied(k);setTimeout(()=>setCopied(null),2000);};

  if(!targets.length) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucun lien disponible.</div>;

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Liens d'invitation</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Chaque code est <strong style={{color:T.tx}}>unique et personnel</strong> — deux agents dans la même agence n'ont jamais le même code.</p>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:14,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Générer un nouveau code</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {targets.map(r=>(
            <button key={r} className="btn" style={{fontSize:11.5,padding:"6px 12px",background:`linear-gradient(135deg,${COLORS[r]},${COLORS[r]}BB)`}}
              onClick={()=>doGen(r)} disabled={gen===r}>
              {gen===r?<Spin/>:"+"} Inviter un {r}
            </button>
          ))}
        </div>
      </div>
      {loading?<div style={{textAlign:"center",padding:20,color:T.sec}}>Chargement…</div>:
      codes.length===0?<div style={{textAlign:"center",padding:"24px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:12}}>Aucun code actif · Génère un code ci-dessus</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {codes.map(code=>(
            <div key={code.id} style={{background:T.card,borderRadius:11,border:`1px solid ${COLORS[code.target_role]||T.acc}25`,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:12.5,color:T.tx}}>Invitation {code.target_role}</div>
                  <div style={{fontSize:10.5,color:T.sec}}>Expire le {new Date(code.expires_at).toLocaleDateString("fr-FR")}</div>
                </div>
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
                <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${code.id}`)}>
                  {copied===`u-${code.id}`?"✓":"Copier"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── CREATORS VIEW ──────────────────────────────── */
function CreatorsView({profile,creators,agents,reload}){
  const ag = profile?.agencies;
  const role = profile?.role;
  const [tr,setTr]       = useState(null);
  const [sel,setSel]     = useState({});
  const [doing,setDoing] = useState(null);
  const canPhone   = ["admin","agency","director","manager","agent"].includes(role);
  const canName    = ["admin","agency"].includes(role);
  const canTransfer= ["admin","agency"].includes(role);

  const doTransfer = async (creatorId) => {
    const agentId = sel[creatorId];
    if(!agentId) return;
    setDoing(creatorId);
    await transferCreator(creatorId,agentId);
    setDoing(null); setTr(null); reload?.();
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
          Aucun créateur · Invitez-en via vos liens ou importez des données Backstage
        </div>
      ):(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}><div style={{minWidth:520}}>
            <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"110px ":""}90px 55px 55px 80px 80px${canTransfer?" 90px":""}`,background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div/><div>Créateur</div>{canName&&<div>Nom</div>}{canPhone&&<div>Téléphone</div>}<div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>{canTransfer&&<div>Action</div>}
            </div>
            {creators.map(c=>{
              const p = calcPayout(ag,c);
              const myAgent = agents.find(a=>a.id===c.agent_id);
              return(
                <div key={c.id}>
                  <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"110px ":""}90px 55px 55px 80px 80px${canTransfer?" 90px":""}`}}>
                    <AV name={(c.pseudo||"??").replace("@","").slice(0,2)} color={T.acc} size={26}/>
                    <div><div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.pseudo}</div><div style={{fontSize:10,color:T.sec}}>{myAgent?.name||"Sans agent"}</div></div>
                    {canName&&<div style={{fontSize:12,fontWeight:600,color:T.tx}}>{c.first_name} {c.last_name}</div>}
                    {canPhone&&<div style={{fontSize:11,color:T.tx}}>{c.phone||"—"}</div>}
                    <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {(c.diamonds||0).toLocaleString()}</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.days_live||0)>=(ag.min_days||20)?T.ok:T.ng}}>{c.days_live||0}j</div>
                    <div style={{fontWeight:600,fontSize:12,color:(c.hours_live||0)>=(ag.min_hours||40)?T.ok:T.ng}}>{c.hours_live||0}h</div>
                    <div><span className="tag" style={{background:p.eligible?`${T.ok}18`:`${T.ng}18`,color:p.eligible?T.ok:T.ng}}>{p.eligible?"éligible":"bloqué"}</span></div>
                    <div style={{fontWeight:700,fontSize:12.5,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}€`:"0€"}</div>
                    {canTransfer&&<button className="btng" style={{fontSize:10.5}} onClick={()=>setTr(tr===c.id?null:c.id)}>{tr===c.id?"Annuler":"Transférer"}</button>}
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

/* ─── IMPORT BACKSTAGE ───────────────────────────── */
function ImportView({profile,reload}){
  const [phase,setPhase] = useState("idle");
  const [prog,setProg]   = useState(0);
  const [result,setRes]  = useState(null);
  const [err,setErr]     = useState("");
  const inputRef = useRef();
  const ag = profile?.agencies;

  const canImport = ()=>{
    const r = profile?.role;
    if(r==="agency"||r==="admin") return true;
    if(r==="director"&&ag?.director_can_import) return true;
    if(r==="manager"&&ag?.manager_can_import) return true;
    return false;
  };

  const go = async (file) => {
    setPhase("load"); setProg(0); setErr("");
    const text = await file?.text?.()??"";;
    const rows = text.split("\n").slice(1).filter(Boolean).map(line=>{
      const [tiktok_id,pseudo,diamonds,days_live,hours_live] = line.split(",");
      return {tiktok_id:tiktok_id?.trim(),pseudo:pseudo?.trim(),diamonds:+(diamonds||0),days_live:+(days_live||0),hours_live:+(hours_live||0)};
    }).filter(r=>r.tiktok_id);
    let p=0;
    const iv = setInterval(()=>{p=Math.min(p+Math.random()*14+5,90);setProg(Math.round(p));},110);
    const res = await importBackstage(ag?.id,profile?.id,rows.length?rows:[]);
    clearInterval(iv); setProg(100);
    setTimeout(()=>{if(res?.error){setErr(res.error);setPhase("idle");}else{setRes(res);setPhase("done");reload?.();}},300);
  };

  const expiry = ()=>{const d=new Date();d.setMonth(d.getMonth()+1);d.setDate(15);return d.toLocaleDateString("fr-FR");};

  if(!canImport()) return(
    <div style={{padding:"20px 16px",borderRadius:13,background:"rgba(244,67,54,.08)",border:"1px solid rgba(244,67,54,.2)",fontSize:13.5,color:T.ng}}>
      ⛔ Vous n'avez pas la permission d'importer. Contactez le fondateur de l'agence.
    </div>
  );

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Import Backstage</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:14}}>Données <strong style={{color:T.tx}}>remplacées</strong> à chaque import · Valides jusqu'au 15 du mois suivant</p>
      {ag?.last_import_date&&(
        <div style={{background:T.card,borderRadius:11,border:"1px solid rgba(0,200,83,.2)",padding:13,marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx}}>Dernier import : {new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</div>
          <div style={{fontSize:11.5,color:T.sec,marginTop:2}}>{ag.last_import_count} créateurs · Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong></div>
        </div>
      )}
      <div style={{padding:"9px 12px",borderRadius:10,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.15)",fontSize:11.5,color:T.sec,marginBottom:14,lineHeight:1.7}}>
        <strong style={{color:T.tx}}>Règle :</strong> Import du 30 avril → données du 7 avril supprimées. Expiry auto : <strong style={{color:T.tx}}>{expiry()}</strong>
      </div>
      {err&&<div style={{padding:"8px 11px",borderRadius:9,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:12,color:T.ng,marginBottom:12}}>{err}</div>}
      {phase==="idle"&&(
        <div onClick={()=>inputRef.current?.click()} style={{border:`2px dashed ${T.b}`,borderRadius:16,padding:"36px 28px",textAlign:"center",cursor:"pointer",transition:"border-color .2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=T.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
          <input ref={inputRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>go(e.target.files[0])}/>
          <div style={{fontSize:30,marginBottom:10}}>📁</div>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>Glissez l'export Backstage ici</div>
          <div style={{fontSize:11.5,color:T.sec,marginBottom:14}}>CSV : tiktok_id, pseudo, diamonds, days_live, hours_live</div>
          <button className="btn" style={{fontSize:12}} onClick={e=>{e.stopPropagation();inputRef.current?.click();}}>Choisir un fichier</button>
          <div style={{marginTop:9,fontSize:10.5,color:T.sec}}>⚠ Remplace toutes les données actuelles</div>
        </div>
      )}
      {phase==="load"&&(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:"36px 28px",textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",border:"3px solid rgba(127,0,255,.2)",borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto 13px"}}/>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:13}}>Remplacement des données…</div>
          <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:20,overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${prog}%`,background:`linear-gradient(90deg,${T.acc},${T.cy})`,transition:"width .1s"}}/></div>
          <div style={{marginTop:6,fontSize:11,color:T.sec}}>{prog}%</div>
        </div>
      )}
      {phase==="done"&&(
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:24,textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:10}}>✅</div>
          <div style={{fontSize:18,fontWeight:800,color:T.tx,marginBottom:4}}>Import réussi !</div>
          <div style={{fontSize:12.5,color:T.sec,marginBottom:14}}><strong style={{color:T.tx}}>{result?.updated??"?"} créateurs</strong> mis à jour · Valide jusqu'au <strong style={{color:T.ok}}>{expiry()}</strong></div>
          <button className="btng" onClick={()=>{setPhase("idle");setRes(null);}}>Importer un autre fichier</button>
        </div>
      )}
    </div>
  );
}

/* ─── SETTINGS ───────────────────────────────────── */
function SettingsView({profile,reload}){
  const ag = profile?.agencies;
  const [pcts,setPcts]   = useState({director:ag?.pct_director||3,manager:ag?.pct_manager||5,agent:ag?.pct_agent||10,creator:ag?.pct_creator||55});
  const [minD,setMinD]   = useState(ag?.min_days||20);
  const [minH,setMinH]   = useState(ag?.min_hours||40);
  const [perms,setPerms] = useState({dir:ag?.director_can_import||false,mgr:ag?.manager_can_import||false});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]  =useState(false);
  const total = Object.values(pcts).reduce((s,v)=>s+v,0);
  const ROLES = [{k:"creator",l:"Part créateur",c:T.ok},{k:"agent",l:"Commission agent",c:T.cy},{k:"manager",l:"Commission manager",c:T.pu},{k:"director",l:"Commission directeur",c:T.acc}];

  const save = async () => {
    if(!sb||!ag?.id) return;
    setSaving(true);
    await sb.from("agencies").update({pct_director:pcts.director,pct_manager:pcts.manager,pct_agent:pcts.agent,pct_creator:pcts.creator,min_days:minD,min_hours:minH,director_can_import:perms.dir,manager_can_import:perms.mgr}).eq("id",ag.id);
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),2500);reload?.();
  };

  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Paramètres agence</h1>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:20,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Répartition des revenus (0–100%)</div>
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
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:18,marginBottom:12}}>
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
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:18,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Permissions Import Backstage</div>
        {[{k:"dir",l:"Autoriser les directeurs à importer",c:T.acc},{k:"mgr",l:"Autoriser les managers à importer",c:T.pu}].map(p=>(
          <div key={p.k} onClick={()=>setPerms(t=>({...t,[p.k]:!t[p.k]}))} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:perms[p.k]?`${p.c}08`:"rgba(255,255,255,.02)",border:`1px solid ${perms[p.k]?p.c+"25":T.b}`,marginBottom:7,cursor:"pointer",transition:"all .2s"}}>
            <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{p.l}</div>
            <div style={{width:38,height:20,borderRadius:10,background:perms[p.k]?p.c:"rgba(255,255,255,.1)",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:perms[p.k]?"21px":"3px",width:14,height:14,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:10}}>
        {saved&&<span style={{fontSize:12,color:T.ok}}>✓ Enregistré</span>}
        <button className="btn" onClick={save} disabled={saving}>{saving?<Spin/>:"✓"} Enregistrer</button>
      </div>
    </div>
  );
}

/* ─── DASH VIEW ──────────────────────────────────── */
function DashView({profile,creators,agents,managers,directors}){
  const ag = profile?.agencies;
  const role = profile?.role;

  if(role==="creator"){
    const c = creators[0];
    if(!c) return <div style={{textAlign:"center",padding:40,color:T.sec}}>Aucune donnée · Contactez votre agent.</div>;
    const p = calcPayout(ag,c);
    const dp = Math.min(100,Math.round((c.days_live||0)/(ag?.min_days||20)*100));
    const hp = Math.min(100,Math.round((c.hours_live||0)/(ag?.min_hours||40)*100));
    return(
      <div className="fup">
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Bonjour, {c.pseudo} 👋</h1>
        <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(127,0,255,.3)",padding:24,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Tes diamants ce mois</div>
          <div style={{fontSize:52,fontWeight:900,color:T.cy,lineHeight:1,marginBottom:4}}>💎 {(c.diamonds||0).toLocaleString()}</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:16}}>diamants accumulés en live</div>
          <div style={{display:"inline-flex",padding:"12px 24px",borderRadius:12,background:p.eligible?"rgba(127,0,255,.1)":"rgba(244,67,54,.08)",border:`1px solid ${p.eligible?"rgba(127,0,255,.25)":"rgba(244,67,54,.2)"}`}}>
            <div><div style={{fontSize:11,color:T.sec,marginBottom:2}}>Ce que tu reçois</div><div style={{fontSize:26,fontWeight:900,color:p.eligible?T.acc:T.sec}}>{p.eligible?`${p.creator}€`:"0€"}</div></div>
          </div>
        </div>
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:18}}>
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

  if(!ag) return(
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:8}}>Bienvenue sur Diamond's</div>
      <div style={{fontSize:12,color:T.sec}}>Aucune agence liée à votre compte. Contactez l'administrateur.</div>
    </div>
  );

  const okBoth = creators.filter(c=>calcPayout(ag,c).eligible).length;
  const total  = creators.length;
  const pct    = total>0?Math.round(okBoth/total*100):0;
  const rLabel = {agency:"Fondateur · Agence",director:"Directeur",manager:"Manager",agent:"Agent"}[role];

  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>{rLabel}</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>{ag.name}</h1>
      </div>
      {ag.last_import_date&&<div style={{padding:"9px 12px",borderRadius:10,background:"rgba(0,200,83,.06)",border:"1px solid rgba(0,200,83,.2)",fontSize:12,color:T.tx,marginBottom:12}}>
        💾 Import du <strong>{new Date(ag.last_import_date).toLocaleDateString("fr-FR")}</strong> · Valide jusqu'au <strong style={{color:T.ok}}>{new Date(ag.last_import_expiry).toLocaleDateString("fr-FR")}</strong>
      </div>}
      <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(127,0,255,.3)",padding:18,marginBottom:12}} className="fup1">
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:44,fontWeight:900,color:T.acc,lineHeight:1}}>{okBoth}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:15,fontWeight:700,color:T.sec}}>/ {total}</div><div style={{fontSize:11,color:T.sec}}>créateurs éligibles</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:28,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div><div style={{fontSize:11,color:T.sec}}>éligibilité</div></div>
        </div>
        {total>0&&<div style={{height:7,borderRadius:20,overflow:"hidden",display:"flex",gap:2,marginBottom:10}}><div style={{flex:okBoth,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/><div style={{flex:total-okBoth,background:"rgba(244,67,54,.28)",borderRadius:20}}/></div>}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{l:`Créateur ${ag.pct_creator||55}%`,c:T.ok},{l:`Agent ${ag.pct_agent||10}%`,c:T.cy},{l:`Manager ${ag.pct_manager||5}%`,c:T.pu},{l:`Dir. ${ag.pct_director||3}%`,c:T.acc}].map((x,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:x.c}}/><span style={{fontSize:11,color:T.sec}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}} className="fup2">
        <SC label="Directeurs" val={directors.length} sub="Responsables" accent={T.acc}/>
        <SC label="Managers"   val={managers.length}  sub="Superviseurs"/>
        <SC label="Agents"     val={agents.length}    sub="Comm. libre"/>
        <SC label="Créateurs"  val={`${okBoth}/${total}`} sub={`${total-okBoth} bloqué`} accent={okBoth===total&&total>0?T.ok:"#FF6D00"}/>
      </div>
    </div>
  );
}

/* ─── TEAM VIEW ──────────────────────────────────── */
function TeamView({agents,managers,directors}){
  const [tab,setTab] = useState("agents");
  const lists = {agents,managers,directors};
  const colors = {agents:T.cy,managers:T.pu,directors:T.acc};
  const items = lists[tab]||[];
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
        <div style={{textAlign:"center",padding:"40px 20px",color:T.sec,border:`2px dashed ${T.b}`,borderRadius:14}}>
          Aucun {tab.slice(0,-1)} · Invitez-en via vos liens d'invitation
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map(p=>(
            <div key={p.id} style={{background:T.card,borderRadius:11,border:`1px solid ${T.b}`,padding:14,display:"flex",alignItems:"center",gap:12}}>
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

/* ─── APP ROOT ───────────────────────────────────── */
export default function App(){
  const auth = useAuth();
  const [tab,setTab]   = useState("dash");
  const [team,setTeam] = useState({creators:[],agents:[],managers:[],directors:[]});
  const [loadT,setLT]  = useState(false);

  const role     = auth.profile?.role;
  const agencyId = auth.profile?.agency_id;

  useEffect(()=>{
    if(agencyId){
      setLT(true);
      fetchTeam(agencyId).then(d=>{setTeam(d);setLT(false);});
    }
  },[agencyId]);

  useEffect(()=>{setTab("dash");},[role]);

  const reload = ()=>{
    auth.reload();
    if(agencyId) fetchTeam(agencyId).then(setTeam);
  };

  if(auth.loading) return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Brand big={true}/></div>
          <div style={{width:28,height:28,borderRadius:"50%",border:`3px solid rgba(127,0,255,.2)`,borderTop:`3px solid ${T.acc}`,animation:"sp2 .8s linear infinite",margin:"0 auto"}}/>
        </div>
      </div>
    </>
  );

  if(!auth.user) return <><style>{css}</style><LoginPage/></>;

  const nav = NAVS[role]||NAVS["admin"];

  const views = {
    dash:    ()=> role==="admin"?<AdminDash setTab={setTab}/>:<DashView profile={auth.profile} creators={team.creators} agents={team.agents} managers={team.managers} directors={team.directors}/>,
    agencies:()=> <AdminAgencies/>,
    billing: ()=> <AdminBilling/>,
    team:    ()=> <TeamView agents={team.agents} managers={team.managers} directors={team.directors}/>,
    creators:()=> <CreatorsView profile={auth.profile} creators={team.creators} agents={team.agents} reload={reload}/>,
    import:  ()=> <ImportView profile={auth.profile} reload={reload}/>,
    links:   ()=> <CodesPanel profile={auth.profile} agents={team.agents}/>,
    settings:()=> <SettingsView profile={auth.profile} reload={reload}/>,
  };

  const View = views[tab]||views.dash;

  return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",fontFamily:"Inter,sans-serif"}}>
        <div style={{width:195,flexShrink:0,background:T.card,borderRight:`1px solid ${T.b}`,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 10px 16px",cursor:"pointer"}} onClick={()=>setTab("dash")}><Brand/></div>
          <div style={{padding:"0 8px",flex:1,overflowY:"auto"}}>
            {nav.map(n=>(
              <button key={n.id} className={`nb${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>{n.l}</button>
            ))}
          </div>
          <div style={{padding:"9px 10px",borderTop:`1px solid ${T.b}`,display:"flex",alignItems:"center",gap:8}}>
            <AV name={(auth.profile?.email||"?")[0].toUpperCase()} color={T.acc} size={28}/>
            <div style={{overflow:"hidden",minWidth:0}}>
              <div style={{fontSize:11.5,fontWeight:600,color:T.tx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{auth.profile?.email}</div>
              <div style={{fontSize:9.5,color:T.sec}}>{role}</div>
            </div>
          </div>
          <button onClick={auth.signOut} style={{margin:"0 8px 10px",padding:"7px 10px",borderRadius:9,border:`1px solid ${T.b}`,background:"transparent",color:T.sec,fontSize:12,cursor:"pointer",fontFamily:"Inter,sans-serif",transition:"color .18s"}}
            onMouseEnter={e=>e.currentTarget.style.color=T.ng} onMouseLeave={e=>e.currentTarget.style.color=T.sec}>
            Déconnexion
          </button>
        </div>
        <main style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
          {loadT?<div style={{textAlign:"center",padding:40,color:T.sec}}>Chargement…</div>:<View/>}
        </main>
      </div>
    </>
  );
}
