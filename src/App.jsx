import { useState } from "react";

const T={bg:"#0F0A1E",card:"#1A1035",b:"#2D1F5E",acc:"#7F00FF",cy:"#00E5FF",sec:"#7B6FA0",ok:"#00C853",ng:"#F44336",go:"#FFB300",pu:"#8E44AD",tx:"#F0EAFF"};

const CREATORS=[
  {id:1,ps:"@kaito.live",av:"KL",cl:"#7F00FF",fn:"Kaito",ln:"Morel",ph:"+33 6 10 20 30 40",dm:284000,dy:22,hr:48,ag:"Julien M."},
  {id:2,ps:"@leamktg",av:"LM",cl:"#00C853",fn:"Léa",ln:"Martin",ph:"+33 6 21 31 41 51",dm:126000,dy:21,hr:44,ag:"Julien M."},
  {id:3,ps:"@sara.drops",av:"SD",cl:"#FF6D00",fn:"Sara",ln:"Dupont",ph:"+33 6 32 42 52 62",dm:97000,dy:14,hr:28,ag:"Sarah K."},
  {id:4,ps:"@tobifit",av:"TF",cl:"#00BCD4",fn:"Tobias",ln:"Ferreira",ph:"+33 6 43 53 63 73",dm:57600,dy:20,hr:41,ag:"Sarah K."},
];
const PCTS={director:3,manager:5,agent:10,creator:55};
const MIN={d:20,h:40};
const CODES={director:"NOVA-DIR-4X2K",manager:"NOVA-MGR-7R3Q",agent:"NOVA-AGT-8M3P",creator:"NOVA-CRE-9Z1Q"};
const DEMOS=[
  {e:"admin@belive.io",p:"demo123",r:"admin",l:"Super Admin (Belive)"},
  {e:"nova@agency.io",p:"demo123",r:"agency",l:"Nova TikTok (Agence)"},
  {e:"maxime@nova.io",p:"demo123",r:"director",l:"Maxime (Directeur)"},
  {e:"kevin@nova.io",p:"demo123",r:"manager",l:"Kevin (Manager)"},
  {e:"julien@nova.io",p:"demo123",r:"agent",l:"Julien M. (Agent)"},
  {e:"kaito@creator.io",p:"demo123",r:"creator",l:"@kaito.live (Créateur)"},
];
const NAVS={
  admin:[{id:"dash",l:"Vue globale"},{id:"agencies",l:"Agences"},{id:"billing",l:"Facturation"}],
  agency:[{id:"dash",l:"Dashboard"},{id:"creators",l:"Créateurs"},{id:"import",l:"Import Backstage"},{id:"links",l:"Liens d'invitation"},{id:"settings",l:"Paramètres"}],
  director:[{id:"dash",l:"Mon pôle"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mes liens"}],
  manager:[{id:"dash",l:"Mon groupe"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mes liens"}],
  agent:[{id:"dash",l:"Dashboard"},{id:"creators",l:"Mes créateurs"},{id:"links",l:"Mon lien"}],
  creator:[{id:"dash",l:"Mon espace"}],
};

const calcP=(c)=>{const ok=c.dy>=MIN.d&&c.hr>=MIN.h;if(!ok)return{ok:false,c:0,a:0};const b=c.dm*0.017;return{ok:true,c:Math.round(b*PCTS.creator/100),a:Math.round(b*PCTS.agent/100)};};

const css=`
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500;600;700;800;900&display=swap');
@keyframes spk{0%,100%{transform:translate(0,0) scale(1);opacity:.9}35%{transform:translate(4px,-6px) scale(1.3);opacity:.4}70%{transform:translate(-3px,-2px) scale(.8);opacity:.3}}
@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp2{to{transform:rotate(360deg)}}
.fup{animation:fup .3s ease both}
.nb{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:500;border:none;background:transparent;width:100%;color:#7B6FA0;transition:all .18s;text-align:left;font-family:Inter,sans-serif}
.nb:hover{background:rgba(127,0,255,.1);color:#7F00FF}
.nb.on{background:rgba(127,0,255,.15);color:#7F00FF;position:relative}
.nb.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:#7F00FF;border-radius:0 2px 2px 0}
.btn{background:linear-gradient(135deg,#7F00FF,#B060FF);color:#fff;border:none;border-radius:9px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:Inter,sans-serif;transition:all .2s}
.btn:hover{box-shadow:0 4px 18px rgba(127,0,255,.4);transform:translateY(-1px)}
.btng{background:transparent;color:#7B6FA0;border:1px solid #2D1F5E;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-family:Inter,sans-serif;transition:all .18s}
.btng:hover{background:rgba(127,0,255,.1);color:#7F00FF;border-color:rgba(127,0,255,.3)}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600}
.cr{display:grid;align-items:center;padding:9px 14px;border-bottom:1px solid #2D1F5E;transition:background .15s}
.cr:last-child{border-bottom:none}
.cr:hover{background:rgba(127,0,255,.04)}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:20px;background:rgba(255,255,255,.1);outline:none}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#7F00FF;cursor:pointer}
`;

const DiamondSVG=({size=40})=>(
  <svg width={size} height={size} viewBox="0 0 40 40">
    <defs>
      <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C080FF"/>
        <stop offset="55%" stopColor="#7F00FF"/>
        <stop offset="100%" stopColor="#00E5FF"/>
      </linearGradient>
      <linearGradient id="dg2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,.6)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
    </defs>
    <polygon points="20,2 37,15 20,38 3,15" fill="url(#dg)" style={{filter:"drop-shadow(0 0 8px rgba(127,0,255,.5))"}}/>
    <polygon points="20,2 37,15 20,15 3,15" fill="url(#dg2)" opacity=".6"/>
    <line x1="3" y1="15" x2="37" y2="15" stroke="rgba(255,255,255,.2)" strokeWidth=".8"/>
    <line x1="20" y1="2" x2="20" y2="15" stroke="rgba(255,255,255,.15)" strokeWidth=".6"/>
  </svg>
);

const Sparkle=({x,y,delay,size=7})=>(
  <div style={{position:"absolute",left:x,top:y,animation:`spk ${5+delay}s ${delay}s ease-in-out infinite`,pointerEvents:"none"}}>
    <svg width={size} height={size} viewBox="0 0 8 8"><path d="M4 0L5 3 8 4 5 5 4 8 3 5 0 4 3 3Z" fill="rgba(180,130,255,.9)"/></svg>
  </div>
);

const Brand=({big=false})=>(
  <div style={{display:"flex",alignItems:"center",gap:big?14:8}}>
    <div style={{position:"relative",width:big?60:28,height:big?60:28,flexShrink:0}}>
      <DiamondSVG size={big?60:28}/>
      {big&&<><Sparkle x={-7} y={-5} delay={0}/><Sparkle x={57} y={-3} delay={0.4}/><Sparkle x={-4} y={52} delay={0.7} size={6}/><Sparkle x={58} y={50} delay={0.2} size={6}/></>}
    </div>
    <div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:big?32:14,color:T.tx,letterSpacing:"-0.025em",lineHeight:1}}>
        Diamond<span style={{color:T.cy}}>'</span>s
      </div>
      <div style={{fontSize:big?10:8.5,color:T.sec,fontWeight:500,marginTop:1,letterSpacing:".06em"}}>by Belive Academy</div>
    </div>
  </div>
);

const AV=({name,color,size=30})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}28,${color}15)`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",color,fontWeight:700,fontSize:size*.36,flexShrink:0}}>{name}</div>
);

const SC=({label,val,sub,accent})=>(
  <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:14,position:"relative",overflow:"hidden"}}>
    {accent&&<div style={{position:"absolute",top:0,right:0,width:70,height:70,background:`radial-gradient(${accent}18,transparent 70%)`,borderRadius:"0 12px 0 100%"}}/>}
    <div style={{fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{label}</div>
    <div style={{fontSize:accent?24:18,fontWeight:800,color:accent||T.tx,marginBottom:4}}>{val}</div>
    {sub&&<div style={{fontSize:11,color:T.sec}}>{sub}</div>}
  </div>
);

function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [load,setLoad]=useState(false);

  const go=()=>{
    setErr("");setLoad(true);
    setTimeout(()=>{
      const acc=DEMOS.find(a=>a.e===email&&a.p===pw);
      if(acc){onLogin(acc.r);}
      else{setErr("Email ou mot de passe incorrect");setLoad(false);}
    },700);
  };

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,rgba(127,0,255,.15) 0%,transparent 55%),${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:360}}>
        <div style={{textAlign:"center",marginBottom:24}} className="fup">
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Brand big={true}/></div>
          <div style={{fontSize:12.5,color:T.sec,marginTop:10}}>La plateforme des agences TikTok Live</div>
        </div>
        <div style={{background:T.card,borderRadius:14,border:`1px solid ${T.b}`,padding:20,marginBottom:10}} className="fup">
          <div style={{fontSize:15,fontWeight:700,color:T.tx,marginBottom:14}}>Connexion</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="vous@agence.com"
                style={{width:"100%",padding:"8px 11px",borderRadius:8,border:`1px solid ${T.b}`,background:"rgba(255,255,255,.04)",color:T.tx,fontSize:12.5,outline:"none",fontFamily:"Inter,sans-serif"}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:T.sec,display:"block",marginBottom:3}}>Mot de passe</label>
              <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"
                style={{width:"100%",padding:"8px 11px",borderRadius:8,border:`1px solid ${T.b}`,background:"rgba(255,255,255,.04)",color:T.tx,fontSize:12.5,outline:"none",fontFamily:"Inter,sans-serif"}}/>
            </div>
            {err&&<div style={{padding:"7px 10px",borderRadius:7,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng}}>{err}</div>}
            <button className="btn" style={{width:"100%",justifyContent:"center",padding:"9px"}} onClick={go} disabled={load}>
              {load?<><div style={{width:14,height:14,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid white",animation:"sp2 .7s linear infinite"}}/>Connexion…</>:"Se connecter"}
            </button>
          </div>
        </div>
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:12}} className="fup">
          <div style={{fontSize:10,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Comptes demo · mot de passe: demo123</div>
          {DEMOS.map(d=>(
            <div key={d.e} onClick={()=>{setEmail(d.e);setPw(d.p);}}
              style={{display:"flex",alignItems:"center",gap:8,padding:"5px 7px",borderRadius:7,cursor:"pointer",border:`1px solid ${T.b}`,marginBottom:4,transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(127,0,255,.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor=T.b}>
              <div style={{width:22,height:22,borderRadius:6,background:"rgba(127,0,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:T.acc,flexShrink:0}}>{d.l[0]}</div>
              <div style={{flex:1}}><div style={{fontSize:11.5,fontWeight:600,color:T.tx}}>{d.l}</div><div style={{fontSize:10,color:T.sec}}>{d.e}</div></div>
              <span className="tag" style={{background:"rgba(127,0,255,.15)",color:T.acc}}>{d.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Dashboard({role}){
  const okBoth=CREATORS.filter(c=>c.dy>=MIN.d&&c.hr>=MIN.h).length;
  const total=CREATORS.length;
  const pct=Math.round(okBoth/total*100);

  if(role==="creator"){
    const c=CREATORS[0];const p=calcP(c);
    const dp=Math.min(100,Math.round(c.dy/MIN.d*100));
    const hp=Math.min(100,Math.round(c.hr/MIN.h*100));
    return(
      <div className="fup">
        <div style={{marginBottom:14}}><h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Bonjour, {c.ps} 👋</h1></div>
        <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(127,0,255,.3)",padding:24,textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Tes diamants ce mois</div>
          <div style={{fontSize:52,fontWeight:900,color:T.cy,lineHeight:1,marginBottom:4}}>💎 {c.dm.toLocaleString()}</div>
          <div style={{fontSize:12,color:T.sec,marginBottom:16}}>diamants accumulés en live</div>
          <div style={{display:"inline-flex",padding:"12px 24px",borderRadius:12,background:p.ok?"rgba(127,0,255,.1)":"rgba(244,67,54,.08)",border:`1px solid ${p.ok?"rgba(127,0,255,.25)":"rgba(244,67,54,.2)"}`}}>
            <div><div style={{fontSize:11,color:T.sec,marginBottom:2}}>Ce que tu reçois</div><div style={{fontSize:26,fontWeight:900,color:p.ok?T.acc:T.sec}}>{p.ok?`${p.c}€`:"0€"}</div></div>
          </div>
        </div>
        <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:18}}>
          <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:13}}>{p.ok?"✅ Tu es éligible !":"❌ Conditions non atteintes"}</div>
          {[{l:"Jours de live",cur:c.dy,max:MIN.d,pct:dp,c:dp>=100?T.ok:T.go},{l:"Heures de live",cur:c.hr,max:MIN.h,pct:hp,c:hp>=100?T.ok:T.go}].map((item,i)=>(
            <div key={i} style={{marginBottom:i===0?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12.5,fontWeight:600,color:T.tx}}>{item.l}</span><span style={{fontWeight:700,color:item.c}}>{item.cur} / {item.max}</span></div>
              <div style={{height:4,borderRadius:20,background:"rgba(255,255,255,.08)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:20,width:`${item.pct}%`,background:item.c}}/></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>
            {{agency:"Fondateur · Agence",director:"Directeur",manager:"Manager",agent:"Agent"}[role]}
          </div>
          <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Nova TikTok</h1>
          <p style={{fontSize:12,color:T.sec,marginTop:2}}>Mars 2025 · Mode demo ⚡</p>
        </div>
      </div>
      <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(127,0,255,.3)",padding:18,marginBottom:12}} className="fup">
        <div style={{fontSize:10,fontWeight:700,color:T.sec,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Objectifs créateurs</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,marginBottom:12}}>
          <div style={{fontSize:44,fontWeight:900,color:T.acc,lineHeight:1}}>{okBoth}</div>
          <div style={{paddingBottom:4}}><div style={{fontSize:15,fontWeight:700,color:T.sec}}>/ {total}</div><div style={{fontSize:11,color:T.sec}}>conditions remplies</div></div>
          <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:28,fontWeight:900,color:pct>=75?T.ok:pct>=50?T.go:T.ng}}>{pct}%</div><div style={{fontSize:11,color:T.sec}}>éligibilité</div></div>
        </div>
        <div style={{height:7,borderRadius:20,overflow:"hidden",display:"flex",gap:2,marginBottom:10}}>
          <div style={{flex:okBoth,background:"linear-gradient(90deg,#00C853,#00E676)",borderRadius:20}}/>
          <div style={{flex:total-okBoth,background:"rgba(244,67,54,.28)",borderRadius:20}}/>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{l:`Créateur ${PCTS.creator}%`,c:T.ok},{l:`Agent ${PCTS.agent}%`,c:T.cy},{l:`Manager ${PCTS.manager}%`,c:T.pu},{l:`Dir. ${PCTS.director}%`,c:T.acc}].map((x,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:2,background:x.c}}/><span style={{fontSize:11,color:T.sec}}>{x.l}</span></div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}} className="fup">
        <SC label="Directeurs" val="2" sub="Responsables" accent={T.acc}/>
        <SC label="Managers" val="2" sub="Superviseurs"/>
        <SC label="Agents" val="3" sub="Comm. libre"/>
        <SC label="Éligibles" val={`${okBoth}/${total}`} sub={`${total-okBoth} bloqué`} accent={okBoth===total?T.ok:"#FF6D00"}/>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}} className="fup">
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Créateurs · Reversements</div>
        <div style={{overflowX:"auto"}}>
          <div style={{minWidth:520}}>
            <div className="cr" style={{gridTemplateColumns:"30px 1fr 90px 50px 50px 75px 75px",background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
              <div/><div>Créateur</div><div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>
            </div>
            {CREATORS.map(c=>{const p=calcP(c);return(
              <div key={c.id} className="cr" style={{gridTemplateColumns:"30px 1fr 90px 50px 50px 75px 75px"}}>
                <AV name={c.av} color={c.cl} size={26}/>
                <div><div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.ps}</div><div style={{fontSize:10,color:T.sec}}>{c.ag}</div></div>
                <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {c.dm.toLocaleString()}</div>
                <div style={{fontWeight:600,fontSize:12,color:c.dy>=MIN.d?T.ok:T.ng}}>{c.dy}j</div>
                <div style={{fontWeight:600,fontSize:12,color:c.hr>=MIN.h?T.ok:T.ng}}>{c.hr}h</div>
                <div><span className="tag" style={{background:p.ok?`${T.ok}18`:`${T.ng}18`,color:p.ok?T.ok:T.ng}}>{p.ok?"éligible":"bloqué"}</span></div>
                <div style={{fontWeight:700,fontSize:12.5,color:p.ok?T.acc:T.sec}}>{p.ok?`${p.c}€`:"0€"}</div>
              </div>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
}

function Creators({role}){
  const canPhone=["agency","director","manager","agent"].includes(role);
  const canName=role==="agency";
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Créateurs</h1>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <span className="tag" style={{background:`${T.ok}18`,color:T.ok}}>Pseudo = public</span>
        <span className="tag" style={{background:"rgba(127,0,255,.15)",color:T.acc}}>Nom réel = {canName?"visible":"masqué"}</span>
        <span className="tag" style={{background:`${T.go}18`,color:T.go}}>Téléphone = {canPhone?"visible":"masqué"}</span>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}><div style={{minWidth:580}}>
          <div className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"115px ":""}90px 50px 50px 75px 75px`,background:"rgba(255,255,255,.02)",borderBottom:`1px solid ${T.b}`,fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase"}}>
            <div/><div>Créateur</div>{canName&&<div>Nom réel</div>}{canPhone&&<div>Téléphone</div>}<div>💎 Diamants</div><div>Jours</div><div>Heures</div><div>Statut</div><div>Reversement</div>
          </div>
          {CREATORS.map(c=>{const p=calcP(c);return(
            <div key={c.id} className="cr" style={{gridTemplateColumns:`30px 1fr ${canName?"110px ":""}${canPhone?"115px ":""}90px 50px 50px 75px 75px`}}>
              <AV name={c.av} color={c.cl} size={26}/>
              <div><div style={{fontWeight:600,fontSize:12.5,color:T.tx}}>{c.ps}</div><div style={{fontSize:10,color:T.sec}}>{c.ag}</div></div>
              {canName&&<div style={{fontSize:12,fontWeight:600,color:T.tx}}>{c.fn} {c.ln}</div>}
              {canPhone&&<div style={{fontSize:11,color:T.tx}}>{c.ph}</div>}
              <div style={{fontWeight:700,color:T.cy,fontSize:12}}>💎 {c.dm.toLocaleString()}</div>
              <div style={{fontWeight:600,fontSize:12,color:c.dy>=MIN.d?T.ok:T.ng}}>{c.dy}j</div>
              <div style={{fontWeight:600,fontSize:12,color:c.hr>=MIN.h?T.ok:T.ng}}>{c.hr}h</div>
              <div><span className="tag" style={{background:p.ok?`${T.ok}18`:`${T.ng}18`,color:p.ok?T.ok:T.ng}}>{p.ok?"éligible":"bloqué"}</span></div>
              <div style={{fontWeight:700,fontSize:12.5,color:p.ok?T.acc:T.sec}}>{p.ok?`${p.c}€`:"0€"}</div>
            </div>
          );})}
        </div></div>
      </div>
    </div>
  );
}

function Links({role}){
  const [copied,setCopied]=useState(null);
  const items={
    agency:[{k:"director",l:"Directeur",c:"#7F00FF"},{k:"manager",l:"Manager",c:T.pu},{k:"agent",l:"Agent",c:T.cy},{k:"creator",l:"Créateur",c:T.ok}],
    director:[{k:"manager",l:"Manager",c:T.pu},{k:"creator",l:"Créateur",c:T.ok}],
    manager:[{k:"agent",l:"Agent",c:T.cy},{k:"creator",l:"Créateur",c:T.ok}],
    agent:[{k:"creator",l:"Créateur",c:T.ok}],
    creator:[],
  }[role]||[];
  const cp=(k)=>{setCopied(k);setTimeout(()=>setCopied(null),2000);};
  if(!items.length)return<div style={{textAlign:"center",padding:40,color:T.sec}}>Aucun lien disponible.</div>;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:6}}>Liens d'invitation</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:12}}>Codes uniques pour Nova TikTok — différents de toutes les autres agences</p>
      <div style={{display:"grid",gridTemplateColumns:items.length===1?"1fr":"1fr 1fr",gap:11}}>
        {items.map(item=>(
          <div key={item.k} style={{background:T.card,borderRadius:12,border:`1px solid ${item.c}25`,padding:15}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
              <AV name={item.l[0]} color={item.c} size={34}/>
              <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,color:T.tx}}>{item.l}</div></div>
              <span className="tag" style={{background:`${item.c}18`,color:item.c}}>{item.l}</span>
            </div>
            <div style={{fontSize:9.5,fontWeight:600,color:T.sec,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>Code</div>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",borderRadius:7,padding:"6px 10px",border:`1px solid ${item.c}20`,marginBottom:8}}>
              <code style={{flex:1,fontSize:12.5,fontWeight:900,fontFamily:"monospace",letterSpacing:".1em",color:item.c}}>{CODES[item.k]}</code>
              <button className="btng" style={{padding:"3px 8px",borderColor:`${item.c}30`,color:item.c,fontSize:10.5}} onClick={()=>cp(item.k)}>
                {copied===item.k?"✓ Copié":"Copier"}
              </button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.04)",borderRadius:7,padding:"5px 9px",border:`1px solid ${T.b}`}}>
              <code style={{flex:1,fontSize:9.5,color:T.sec,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>https://app.diamonds.beliveacademy.com/join?c={CODES[item.k]}</code>
              <button className="btng" style={{padding:"3px 8px",fontSize:10.5}} onClick={()=>cp(`u-${item.k}`)}>
                {copied===`u-${item.k}`?"✓":"Copier"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Import(){
  const [phase,setPhase]=useState("idle");
  const [prog,setProg]=useState(0);
  const go=()=>{
    setPhase("load");setProg(0);
    let p=0;
    const iv=setInterval(()=>{p+=Math.random()*14+5;if(p>=100){p=100;clearInterval(iv);setTimeout(()=>setPhase("done"),300);}setProg(Math.min(Math.round(p),100));},110);
  };
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:4}}>Import Backstage</h1>
      <p style={{fontSize:12,color:T.sec,marginBottom:12}}>Données <strong style={{color:T.tx}}>remplacées</strong> à chaque import · Valides jusqu'au 15 du mois suivant</p>
      <div style={{background:T.card,borderRadius:12,border:"1px solid rgba(0,200,83,.2)",padding:13,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:9,background:"rgba(0,200,83,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>💾</div>
          <div><div style={{fontWeight:700,fontSize:13,color:T.tx}}>Dernier import : 07/04/2025</div>
          <div style={{fontSize:11.5,color:T.sec,marginTop:2}}>Par <strong style={{color:T.tx}}>nova@agency.io</strong> · 4 créateurs · Valide jusqu'au <strong style={{color:T.ok}}>15/05/2025</strong></div></div>
        </div>
      </div>
      <div style={{padding:"9px 12px",borderRadius:10,background:"rgba(127,0,255,.06)",border:"1px solid rgba(127,0,255,.15)",fontSize:11.5,color:T.sec,marginBottom:14,lineHeight:1.7}}>
        <strong style={{color:T.tx}}>Règle :</strong> Import du 30 avril → données du 7 avril supprimées. Sauvegardé dans Supabase via <code style={{background:"rgba(255,255,255,.06)",padding:"1px 5px",borderRadius:4}}>import_backstage()</code>
      </div>
      {phase==="idle"&&(
        <div onClick={go} style={{border:`2px dashed ${T.b}`,borderRadius:16,padding:"36px 28px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.acc;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.b;}}>
          <div style={{fontSize:30,marginBottom:10}}>📁</div>
          <div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:4}}>Glissez l'export Backstage ici</div>
          <div style={{fontSize:11.5,color:T.sec,marginBottom:14}}>CSV : tiktok_id, pseudo, diamonds, days_live, hours_live</div>
          <button className="btn" style={{fontSize:12,padding:"7px 14px"}}>Choisir un fichier</button>
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
          <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(0,200,83,.15)",border:"1px solid rgba(0,200,83,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 11px",fontSize:22}}>✓</div>
          <div style={{fontSize:18,fontWeight:800,color:T.tx,marginBottom:4}}>Import réussi !</div>
          <div style={{fontSize:12.5,color:T.sec,marginBottom:14}}><strong style={{color:T.tx}}>4 créateurs</strong> mis à jour · Valide jusqu'au <strong style={{color:T.ok}}>15/05/2025</strong></div>
          <button className="btng" onClick={()=>setPhase("idle")}>Importer un autre fichier</button>
        </div>
      )}
    </div>
  );
}

function Settings(){
  const [pcts,setPcts]=useState({...PCTS});
  const [minD,setMinD]=useState(MIN.d);
  const [minH,setMinH]=useState(MIN.h);
  const [tog,setTog]=useState({dir:true,mgr:false});
  const total=Object.values(pcts).reduce((s,v)=>s+v,0);
  const agPct=100-total;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Paramètres agence</h1>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:20,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:12}}>Répartition des revenus (0–100% libres)</div>
        <div style={{borderRadius:8,overflow:"hidden",height:28,display:"flex",marginBottom:12}}>
          {[{k:"creator",c:T.ok},{k:"agent",c:T.cy},{k:"manager",c:T.pu},{k:"director",c:T.acc}].map(r=>(
            <div key={r.k} style={{width:`${pcts[r.k]}%`,background:r.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:"white",overflow:"hidden",whiteSpace:"nowrap",transition:"width .25s"}}>
              {pcts[r.k]>5?`${pcts[r.k]}%`:""}
            </div>
          ))}
          <div style={{flex:1,background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:T.sec}}>Agence {agPct}%</div>
        </div>
        {agPct<0&&<div style={{padding:"6px 10px",borderRadius:7,background:"rgba(244,67,54,.1)",border:"1px solid rgba(244,67,54,.2)",fontSize:11.5,color:T.ng,marginBottom:10}}>⚠ Total dépasse 100%</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[{k:"creator",l:"Part créateur",c:T.ok},{k:"agent",l:"Commission agent",c:T.cy},{k:"manager",l:"Commission manager",c:T.pu},{k:"director",l:"Commission directeur",c:T.acc}].map(r=>(
            <div key={r.k}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <label style={{fontSize:12,fontWeight:600,color:T.tx}}>{r.l}</label>
                <span style={{fontSize:13,fontWeight:800,color:r.c}}>{pcts[r.k]}%</span>
              </div>
              <input type="range" min={0} max={100} step={1} value={pcts[r.k]} style={{accentColor:r.c}}
                onChange={e=>setPcts(p=>({...p,[r.k]:+e.target.value}))}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.sec,marginTop:2}}><span>0%</span><span>100%</span></div>
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
        <div style={{marginTop:11,padding:"8px 11px",borderRadius:9,background:"rgba(255,109,0,.06)",border:"1px solid rgba(255,109,0,.15)",fontSize:11.5,color:T.sec}}>
          En dessous de <strong style={{color:T.tx}}>{minD}j</strong> ET <strong style={{color:T.tx}}>{minH}h</strong> → le créateur reçoit <strong style={{color:T.ng}}>0€</strong>
        </div>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,padding:18,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13.5,color:T.tx,marginBottom:4}}>Permissions Import Backstage</div>
        <div style={{fontSize:12,color:T.sec,marginBottom:12}}>Par défaut seul le fondateur peut importer.</div>
        {[{k:"dir",l:"Autoriser les directeurs à importer",c:T.acc},{k:"mgr",l:"Autoriser les managers à importer",c:T.pu}].map(p=>(
          <div key={p.k} onClick={()=>setTog(t=>({...t,[p.k]:!t[p.k]}))}
            style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:9,background:tog[p.k]?`${p.c}08`:"rgba(255,255,255,.02)",border:`1px solid ${tog[p.k]?p.c+"25":T.b}`,marginBottom:7,cursor:"pointer",transition:"all .2s"}}>
            <div style={{flex:1,fontSize:12.5,fontWeight:600,color:T.tx}}>{p.l}</div>
            <div style={{width:38,height:20,borderRadius:10,background:tog[p.k]?p.c:"rgba(255,255,255,.1)",position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:tog[p.k]?"21px":"3px",width:14,height:14,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn">✓ Enregistrer</button></div>
    </div>
  );
}


const AGENCIES_LIST=[
  {id:1,name:"Nova TikTok",logo:"N",color:"#7F00FF",creators:4,agents:3,managers:2,directors:2,billing:"actif",amount:99,card:"**** 4242",pcts:{director:3,manager:5,agent:10,creator:55}},
  {id:2,name:"Apex Live",logo:"A",color:"#E91E63",creators:2,agents:2,managers:0,directors:0,billing:"impayé",amount:99,card:"**** 8811",pcts:{director:3,manager:4,agent:8,creator:50}},
  {id:3,name:"StreamForce",logo:"S",color:"#00BCD4",creators:0,agents:0,managers:0,directors:0,billing:"essai",amount:0,card:null,pcts:{director:3,manager:4,agent:8,creator:60}},
];

function AdminDash({setTab}){
  const mrr=AGENCIES_LIST.filter(a=>a.billing==="actif").length*99;
  const total=AGENCIES_LIST.reduce((s,a)=>s+a.creators,0);
  return(
    <div className="fup">
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:T.acc,textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>Super Admin · Belive Academy</div>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Vue globale</h1>
        <p style={{fontSize:12,color:T.sec,marginTop:2}}>{AGENCIES_LIST.length} agences · Mars 2025</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}} className="fup">
        <SC label="MRR Plateforme" val={mrr+"€"} sub="99€/agence actif" accent={T.acc}/>
        <SC label="Agences total" val={AGENCIES_LIST.length} sub="1 impayée · 1 essai"/>
        <SC label="Créateurs total" val={total} sub="Toutes agences"/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection annuelle"/>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden",marginBottom:14}} className="fup">
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Agences</div>
        {AGENCIES_LIST.map((ag,i)=>(
          <div key={ag.id} className="cr" style={{gridTemplateColumns:"36px 1fr 80px 120px 100px 90px",background:ag.billing==="impayé"?"rgba(244,67,54,.04)":"transparent"}}>
            <div style={{width:32,height:32,borderRadius:9,background:ag.color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color,fontWeight:800,fontSize:13,flexShrink:0}}>{ag.logo}</div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:T.tx,display:"flex",alignItems:"center",gap:6}}>
                {ag.name}
                {ag.billing==="impayé"&&<span className="tag" style={{background:"rgba(244,67,54,.15)",color:T.ng}}>IMPAYÉ</span>}
              </div>
              <div style={{fontSize:10.5,color:T.sec}}>{ag.creators} créateurs · {ag.agents} agents · {ag.managers} mgrs · {ag.directors} dirs</div>
            </div>
            <div>
              <span className="tag" style={{background:ag.billing==="actif"?`${T.ok}18`:ag.billing==="impayé"?`${T.ng}18`:`${T.go}18`,color:ag.billing==="actif"?T.ok:ag.billing==="impayé"?T.ng:T.go}}>
                {ag.billing==="actif"?"Abonné":ag.billing==="impayé"?"Impayé":"Essai"}
              </span>
            </div>
            <div style={{fontSize:11.5,color:T.sec}}>Crea {ag.pcts.creator}% · Agt {ag.pcts.agent}%</div>
            <div style={{fontWeight:700,fontSize:13,color:ag.billing==="impayé"?T.ng:T.tx}}>{ag.billing==="essai"?"0€":`${ag.amount}€/mois`}</div>
            <div style={{fontSize:11,color:T.sec}}>{ag.card||"Aucune carte"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAgencies(){
  const [sel,setSel]=useState(null);
  const [copied,setCopied]=useState(null);
  const cp=(k)=>{setCopied(k);setTimeout(()=>setCopied(null),2000);};
  if(sel){
    const ag=sel;
    const agCodes={director:`${ag.logo.toUpperCase()}-DIR-4X2K`,manager:`${ag.logo.toUpperCase()}-MGR-7R3Q`,agent:`${ag.logo.toUpperCase()}-AGT-8M3P`,creator:`${ag.logo.toUpperCase()}-CRE-9Z1Q`};
    return(
      <div className="fup">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <button className="btng" onClick={()=>setSel(null)}>← Retour</button>
          <div style={{width:36,height:36,borderRadius:10,background:ag.color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color,fontWeight:800,fontSize:15}}>{ag.logo}</div>
          <div><h1 style={{fontSize:18,fontWeight:800,color:T.tx}}>{ag.name}</h1><div style={{fontSize:11.5,color:T.sec}}>Crea {ag.pcts.creator}% · Agent {ag.pcts.agent}% · Manager {ag.pcts.manager}% · Dir {ag.pcts.director}%</div></div>
        </div>
        <div style={{fontWeight:700,fontSize:13,color:T.tx,marginBottom:10}}>Codes d'invitation uniques</div>
        {[{k:"director",l:"Directeur",c:"#7F00FF"},{k:"manager",l:"Manager",c:T.pu},{k:"agent",l:"Agent",c:T.cy},{k:"creator",l:"Créateur",c:T.ok}].map(item=>(
          <div key={item.k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:10,background:T.card,border:`1px solid ${item.c}22`,marginBottom:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:item.c+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><AV name={item.l[0]} color={item.c} size={30}/></div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:T.tx}}>{item.l}</div>
              <code style={{fontSize:12.5,fontWeight:900,fontFamily:"monospace",letterSpacing:".08em",color:item.c}}>{agCodes[item.k]}</code>
            </div>
            <button className="btng" style={{padding:"3px 8px",borderColor:item.c+"30",color:item.c,fontSize:10.5}} onClick={()=>cp(item.k)}>
              {copied===item.k?"✓ Copié":"Copier"}
            </button>
          </div>
        ))}
      </div>
    );
  }
  return(
    <div className="fup">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h1 style={{fontSize:20,fontWeight:800,color:T.tx}}>Agences</h1>
        <button className="btn" style={{fontSize:12}}>+ Nouvelle agence</button>
      </div>
      {AGENCIES_LIST.map((ag,i)=>(
        <div key={ag.id} onClick={()=>setSel(ag)} className="fup" style={{background:T.card,borderRadius:12,border:`1px solid ${ag.billing==="impayé"?"rgba(244,67,54,.3)":T.b}`,padding:16,marginBottom:10,cursor:"pointer",transition:"border-color .2s"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=ag.color+"50"} onMouseLeave={e=>e.currentTarget.style.borderColor=ag.billing==="impayé"?"rgba(244,67,54,.3)":T.b}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:13,background:ag.color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color,fontWeight:800,fontSize:17,flexShrink:0}}>{ag.logo}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14,color:T.tx,marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
                {ag.name}
                <span className="tag" style={{background:ag.billing==="actif"?`${T.ok}18`:ag.billing==="impayé"?`${T.ng}18`:`${T.go}18`,color:ag.billing==="actif"?T.ok:ag.billing==="impayé"?T.ng:T.go}}>
                  {ag.billing==="actif"?"Abonné":ag.billing==="impayé"?"Impayé":"Essai"}
                </span>
              </div>
              <div style={{fontSize:11.5,color:T.sec}}>{ag.creators} créateurs · {ag.agents} agents · {ag.managers} managers · {ag.directors} directeurs</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontWeight:800,fontSize:14,color:ag.billing==="impayé"?T.ng:T.tx}}>{ag.billing==="essai"?"0€":`${ag.amount}€/mois`}</div>
              <div style={{fontSize:10.5,color:T.acc,marginTop:3}}>Voir les codes →</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminBilling(){
  const mrr=AGENCIES_LIST.filter(a=>a.billing==="actif").length*99;
  return(
    <div className="fup">
      <h1 style={{fontSize:20,fontWeight:800,color:T.tx,marginBottom:14}}>Facturation · Stripe</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        <SC label="MRR" val={mrr+"€"} sub="Abonnements actifs" accent="#635BFF"/>
        <SC label="ARR estimé" val={mrr*12+"€"} sub="Projection annuelle"/>
        <SC label="Impayés" val={AGENCIES_LIST.filter(a=>a.billing==="impayé").length} sub="Apex Live" accent={T.ng}/>
        <SC label="En essai" val={AGENCIES_LIST.filter(a=>a.billing==="essai").length} sub="À convertir" accent={T.go}/>
      </div>
      <div style={{background:T.card,borderRadius:12,border:`1px solid ${T.b}`,overflow:"hidden"}}>
        <div style={{padding:"11px 14px",borderBottom:`1px solid ${T.b}`,fontWeight:700,fontSize:13,color:T.tx}}>Toutes les agences</div>
        {AGENCIES_LIST.map((ag,i)=>(
          <div key={ag.id} className="cr" style={{gridTemplateColumns:"34px 1fr 80px 80px 90px 120px",background:ag.billing==="impayé"?"rgba(244,67,54,.04)":"transparent"}}>
            <div style={{width:30,height:30,borderRadius:8,background:ag.color+"18",display:"flex",alignItems:"center",justifyContent:"center",color:ag.color,fontWeight:800,fontSize:12}}>{ag.logo}</div>
            <div style={{fontWeight:700,fontSize:13,color:T.tx}}>{ag.name}</div>
            <span className="tag" style={{background:ag.billing==="actif"?`${T.ok}18`:ag.billing==="impayé"?`${T.ng}18`:`${T.go}18`,color:ag.billing==="actif"?T.ok:ag.billing==="impayé"?T.ng:T.go}}>
              {ag.billing==="actif"?"Abonné":ag.billing==="impayé"?"Impayé":"Essai"}
            </span>
            <div style={{fontWeight:700,fontSize:13,color:ag.billing==="impayé"?T.ng:T.tx}}>{ag.billing==="essai"?"0€":`${ag.amount}€`}</div>
            <div style={{fontSize:11.5,color:T.sec}}>{ag.card||"—"}</div>
            <div style={{display:"flex",gap:5}}>
              {ag.billing==="impayé"&&<button className="btn" style={{fontSize:10.5,padding:"3px 9px",background:"linear-gradient(135deg,"+T.ok+",#00E676)"}}>Relancer</button>}
              {ag.billing==="actif"&&<button style={{padding:"3px 9px",borderRadius:7,fontSize:10.5,border:"1px solid rgba(244,67,54,.3)",background:"rgba(244,67,54,.1)",color:T.ng,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Résilier</button>}
              {ag.billing==="essai"&&<button className="btn" style={{fontSize:10.5,padding:"3px 9px"}}>Activer</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App(){
  const [role,setRole]=useState(null);
  const [tab,setTab]=useState("dash");

  if(!role) return(
    <>
      <style>{css}</style>
      <LoginPage onLogin={r=>{setRole(r);setTab("dash");}}/>
    </>
  );

  const nav=NAVS[role]||[];
  const u={admin:{name:"Super Admin",av:"SA"},agency:{name:"Nova TikTok",av:"N"},director:{name:"Maxime Aurore",av:"MA"},manager:{name:"Kevin Strand",av:"KS"},agent:{name:"Julien M.",av:"JM"},creator:{name:"@kaito.live",av:"KL"}}[role];

  const views={dash:()=>role==="admin"?<AdminDash setTab={setTab}/>:<Dashboard role={role}/>,agencies:()=><AdminAgencies/>,billing:()=><AdminBilling/>,dash_fallback:()=><Dashboard role={role}/>,creators:()=><Creators role={role}/>,links:()=><Links role={role}/>,import:()=><Import/>,settings:()=><Settings/>};
  const View=views[tab]||views.dash;

  return(
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column",fontFamily:"Inter,sans-serif"}}>
        <div style={{background:"rgba(0,0,0,.5)",padding:"4px 12px",display:"flex",alignItems:"center",gap:6,borderBottom:`1px solid ${T.b}`,overflowX:"auto",flexShrink:0}}>
          <span style={{fontSize:9,color:T.sec,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",flexShrink:0}}>Vue demo</span>
          {[{r:"admin",l:"Admin"},{r:"agency",l:"Agence"},{r:"director",l:"Directeur"},{r:"manager",l:"Manager"},{r:"agent",l:"Agent"},{r:"creator",l:"Créateur"}].map(x=>(
            <button key={x.r} onClick={()=>{setRole(x.r);setTab("dash");}}
              style={{padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",border:"none",whiteSpace:"nowrap",flexShrink:0,fontFamily:"Inter,sans-serif",background:role===x.r?T.acc:"rgba(255,255,255,.08)",color:role===x.r?"white":"rgba(255,255,255,.5)"}}>
              {x.l}
            </button>
          ))}
          <button onClick={()=>setRole(null)} style={{marginLeft:"auto",padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(255,255,255,.5)",flexShrink:0,fontFamily:"Inter,sans-serif"}}>← Déco</button>
        </div>
        <div style={{display:"flex",flex:1,minHeight:0}}>
          <div style={{width:190,flexShrink:0,background:T.card,borderRight:`1px solid ${T.b}`,display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 10px 14px",cursor:"pointer"}} onClick={()=>setTab("dash")}><Brand/></div>
            <div style={{padding:"0 8px",flex:1,overflowY:"auto"}}>
              {nav.map(n=>(
                <button key={n.id} className={`nb${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)}>{n.l}</button>
              ))}
            </div>
            <div style={{padding:"9px 10px",borderTop:`1px solid ${T.b}`,display:"flex",alignItems:"center",gap:8}}>
              <AV name={u.av} color={T.acc} size={26}/>
              <div style={{overflow:"hidden",minWidth:0}}><div style={{fontSize:11.5,fontWeight:600,color:T.tx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name}</div><div style={{fontSize:9.5,color:T.sec}}>{role}</div></div>
            </div>
          </div>
          <main style={{flex:1,overflowY:"auto",padding:"18px 20px"}}><View/></main>
        </div>
      </div>
    </>
  );
}
