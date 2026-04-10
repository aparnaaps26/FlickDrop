import { useState, useCallback, useRef, useEffect } from "react";

const PCOLORS = {
  "Netflix": { c: "#E50914", b: "rgba(229,9,20,0.12)" },
  "Prime": { c: "#00A8E1", b: "rgba(0,168,225,0.12)" },
  "Hulu": { c: "#1CE783", b: "rgba(28,231,131,0.12)" },
  "Peacock": { c: "#B494F6", b: "rgba(180,148,246,0.12)" },
  "Disney+": { c: "#0057FF", b: "rgba(0,87,255,0.12)" },
  "Hotstar": { c: "#1F74DB", b: "rgba(31,116,219,0.12)" },
  "Apple TV+": { c: "#fff", b: "rgba(255,255,255,0.08)" },
  "Paramount+": { c: "#0064FF", b: "rgba(0,100,255,0.12)" },
  "Max": { c: "#002BE7", b: "rgba(0,43,231,0.12)" },
  "HBO": { c: "#002BE7", b: "rgba(0,43,231,0.12)" },
  "Crunchyroll": { c: "#F47521", b: "rgba(244,117,33,0.12)" },
  "Tubi": { c: "#F55D24", b: "rgba(245,93,36,0.12)" },
};
const SUBS_LIST = ["Netflix","Prime","Hulu","Disney+","Hotstar","Max","HBO","Peacock","Apple TV+","Paramount+","Crunchyroll","Tubi"];
const LANGS = [
  { e: "🇺🇸", l: "English", c: "en" }, { e: "🇪🇸", l: "Spanish", c: "es" },
  { e: "🇫🇷", l: "French", c: "fr" }, { e: "🇮🇳", l: "Hindi", c: "hi" },
  { e: "🇰🇷", l: "Korean", c: "ko" }, { e: "🇯🇵", l: "Japanese", c: "ja" },
  { e: "🇮🇹", l: "Italian", c: "it" }, { e: "🇩🇪", l: "German", c: "de" },
  { e: "🇮🇳", l: "Telugu", c: "te" }, { e: "🇮🇳", l: "Tamil", c: "ta" },
  { e: "🇨🇳", l: "Mandarin", c: "zh" }, { e: "🇧🇷", l: "Portuguese", c: "pt" },
  { e: "🇮🇳", l: "Malayalam", c: "ml" }, { e: "🇮🇳", l: "Bengali", c: "bn" },
  { e: "🇮🇳", l: "Punjabi", c: "pa" },
];
const ERAS = [
  { e: "🎞️", l: "Classic", s: "Before 1980", v: "classic" },
  { e: "📼", l: "Retro", s: "1980–2005", v: "retro" },
  { e: "🎬", l: "Modern", s: "2006–2019", v: "modern" },
  { e: "✨", l: "Recent", s: "2020+", v: "recent" },
];
const MC = [
  { e: "😂", l: "Laugh Together" }, { e: "💕", l: "Romance" }, { e: "😱", l: "Thrills" },
  { e: "🤯", l: "Mind-Bending" }, { e: "🎭", l: "Drama" }, { e: "🍿", l: "Feel-Good" },
  { e: "🎥", l: "Documentary" }, { e: "🧟", l: "Zombie" },
];
const MF = [
  { e: "✨", l: "Adventure" }, { e: "😂", l: "Comedy" }, { e: "🦸", l: "Superheroes" },
  { e: "🐾", l: "Animals" }, { e: "🧙", l: "Fantasy" }, { e: "🎵", l: "Musical" },
  { e: "🎥", l: "Documentary" },
];
const AGES = ["Under 5","5–8","9–12","13+"];
const AVATARS = [
  { id: "ninja", emoji: "🥷", label: "Ninja", bg: "#1a1a2e" },
  { id: "astro", emoji: "🧑‍🚀", label: "Astronaut", bg: "#0f3460" },
  { id: "wizard", emoji: "🧙‍♂️", label: "Wizard", bg: "#3a1078" },
  { id: "witch", emoji: "🧙‍♀️", label: "Witch", bg: "#2d1050" },
  { id: "pirate", emoji: "🏴‍☠️", label: "Pirate", bg: "#2c1810" },
  { id: "queen", emoji: "👸", label: "Queen", bg: "#3d1a3a" },
  { id: "prince", emoji: "🤴", label: "Prince", bg: "#1a2a3d" },
  { id: "hero", emoji: "🦸‍♂️", label: "Hero", bg: "#0a1a3d" },
  { id: "heroine", emoji: "🦸‍♀️", label: "Heroine", bg: "#2a0a3d" },
  { id: "alien", emoji: "👽", label: "Alien", bg: "#0a3d2e" },
  { id: "robot", emoji: "🤖", label: "Robot", bg: "#1a2a3a" },
  { id: "vampire", emoji: "🧛‍♂️", label: "Vampire", bg: "#2d0a31" },
  { id: "vampiress", emoji: "🧛‍♀️", label: "Vampiress", bg: "#3d0a2a" },
  { id: "detective", emoji: "🕵️‍♂️", label: "Detective", bg: "#1a1a1a" },
  { id: "sleuth", emoji: "🕵️‍♀️", label: "Sleuth", bg: "#1a1a2a" },
  { id: "dancer", emoji: "💃", label: "Dancer", bg: "#3d0a1a" },
  { id: "rockstar", emoji: "🎸", label: "Rockstar", bg: "#2d0a1a" },
  { id: "dragon", emoji: "🐉", label: "Dragon", bg: "#3d1a0a" },
  { id: "chef", emoji: "👨‍🍳", label: "Chef", bg: "#2a1a0a" },
  { id: "artist", emoji: "🎨", label: "Artist", bg: "#1a2a2a" },
];
const RES = [
  { e: "🔥", l: "Loved it" },{ e: "👍", l: "Pretty good" },{ e: "😴", l: "Fell asleep" },
  { e: "🤮", l: "Nope" },{ e: "😭", l: "Made me cry" },{ e: "🤣", l: "So funny" },
];
const LMS = ["🍿 Warming up the projector…","🎬 Scanning the archives…","🎞️ Finding hidden gems…","🌙 Curating tonight's lineup…"];

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Libre+Baskerville:wght@400;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body,#root{height:100%;background:#0e0a13;}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes swL{to{transform:translateX(-120%) rotate(-15deg);opacity:0}}
@keyframes swR{to{transform:translateX(120%) rotate(15deg);opacity:0}}
.sp{width:32px;height:32px;border:2.5px solid rgba(232,147,47,0.15);border-top-color:#e8932f;border-radius:50%;animation:spin .8s linear infinite}
.fu{animation:fadeUp .4s ease both}
.pt{animation:pulse 1.6s ease-in-out infinite}
.sl{animation:swL .35s ease forwards}
.sr{animation:swR .35s ease forwards}
.sc::-webkit-scrollbar{width:0}
input:focus{outline:none}
button{border:none;background:none;cursor:pointer;font-family:inherit}`;

const F="'Poppins',sans-serif",DF="'Libre Baskerville',serif",A="#e8932f",AG="linear-gradient(135deg,#e8932f,#d4641a)";
const tg=(a,v)=>a.includes(v)?a.filter(x=>x!==v):[...a,v];
const mk=m=>`${m.title}::${m.year}`;
const avBg=emoji=>AVATARS.find(a=>a.emoji===emoji)?.bg||"#1a1a2e";

const load=(k,def)=>{try{const v=localStorage.getItem("fd_"+k);return v?JSON.parse(v):def;}catch{return def;}};
const save=(k,v)=>{try{localStorage.setItem("fd_"+k,JSON.stringify(v));}catch{}};

async function askAI(prompt, signal) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch('/api/movies', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
        body: JSON.stringify({ prompt, max_tokens: 2000 }),
      });
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data.text;
    } catch (e) {
      if (e.name === 'AbortError' || attempt === 1) throw e;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

export default function App(){
  const [user,setUser]=useState(()=>load("user",null));
  const [subs,setSubs]=useState(()=>load("subs",[]));
  const [scr,setScr]=useState(()=>load("user",null)?"home":"login");
  const [prof,setProf]=useState(()=>load("prof",[]));
  const [wl,setWl]=useState(()=>load("wl",[]));
  const [seen,setSeen]=useState(()=>load("seen",{}));
  const [rat,setRat]=useState(()=>load("rat",{}));
  const [ap,setAp]=useState(null);
  const [mode,setMode]=useState("couple");
  const [moods,setMoods]=useState([]);
  const [ages,setAges]=useState([]);
  const [langs,setLangs]=useState(["en"]);
  const [eras,setEras]=useState([]);
  const [mov,setMov]=useState([]);
  const [busy,setBusy]=useState(false);
  const [lm,setLm]=useState(LMS[0]);
  const [det,setDet]=useState(null);
  const [err,setErr]=useState("");
  const [loginName,setLoginName]=useState("");
  const [loginAvatar,setLoginAvatar]=useState("🥷");
  const [en,setEn]=useState("");
  const [ee,setEe]=useState("🤖");
  const [tab,setTab]=useState(0);
  const [showLangs,setShowLangs]=useState(false);
  const [fbType,setFbType]=useState(null);
  const [fbText,setFbText]=useState("");
  const [fbSent,setFbSent]=useState(false);
  const [fbScreen,setFbScreen]=useState(null);
  const [fbAll,setFbAll]=useState([]);
  const [rView,setRView]=useState("list");
  const [swIdx,setSwIdx]=useState(0);
  const [swLiked,setSwLiked]=useState([]);
  const [swDir,setSwDir]=useState(null);
  const [votes,setVotes]=useState({});
  const [bpMov,setBpMov]=useState(null);
  const [bpRevealed,setBpRevealed]=useState(false);
  const [bpGuess,setBpGuess]=useState("");
  const [bpLoading,setBpLoading]=useState(false);
  const [quizStep,setQuizStep]=useState(0);
  const [quizAnswers,setQuizAnswers]=useState([]);
  const [quizResult,setQuizResult]=useState(null);
  const [quizLoading,setQuizLoading]=useState(false);
  const shownRef=useRef([]);

  useEffect(()=>{save("user",user);},[user]);
  useEffect(()=>{save("subs",subs);},[subs]);
  useEffect(()=>{save("prof",prof);},[prof]);
  useEffect(()=>{save("wl",wl);},[wl]);
  useEffect(()=>{save("seen",seen);},[seen]);
  useEffect(()=>{save("rat",rat);},[rat]);

  const inWl=m=>wl.some(w=>mk(w)===mk(m));
  const isSn=m=>!!seen[mk(m)];
  const gR=m=>rat[mk(m)]?.emoji||null;
  const tWl=m=>inWl(m)?setWl(wl.filter(w=>mk(w)!==mk(m))):setWl([...wl,m]);
  const tSn=m=>{const n={...seen};n[mk(m)]?delete n[mk(m)]:n[mk(m)]={title:m.title,year:m.year,genre:m.genre,language:m.language};setSeen(n);};
  const doRate=(m,emoji,label)=>setRat({...rat,[mk(m)]:{emoji,label,title:m.title,year:m.year,genre:m.genre,language:m.language}});
  const lovedMovies=Object.entries(rat).filter(([_,v])=>v.emoji==="🔥").map(([k,v])=>({...v,key:k}));
  const likedTitles=Object.entries(rat).filter(([_,v])=>v.emoji==="🔥"||v.emoji==="👍").map(([_,v])=>v.title).filter(Boolean);
  const resetNav=d=>{setBusy(false);setMov([]);setErr("");setRView("list");setSwIdx(0);setSwLiked([]);setSwDir(null);setVotes({});setScr(d);};

  const doFetch=useCallback(async()=>{
    if(busy)return;
    setBusy(true);setMov([]);setScr("results");setErr("");setRView("list");setSwIdx(0);setSwLiked([]);setSwDir(null);setVotes({});
    let mi=0;let timer=null;
    const iv=setInterval(()=>{mi=(mi+1)%LMS.length;setLm(LMS[mi]);},2200);
    const mt=moods.join(", ");
    const langNames=langs.map(c=>LANGS.find(l=>l.c===c)?.l).filter(Boolean);
    const ln=langNames.join(", ");

    // Count: 2 per vibe if multi-vibe, else 2 per lang if multi-lang, else 3
    // Eras are always a preference, never a distribution axis (too restrictive with niche combos)
    let total=3,distRule="";
    if(moods.length>=2){total=moods.length*2;distRule=` IMPORTANT: Return EXACTLY 2 movies for EACH of these ${moods.length} moods: ${mt}. That is ${total} movies total. Label each movie's "mood" field.`;}
    else if(langNames.length>=2){total=langNames.length*2;distRule=` IMPORTANT: Return EXACTLY 2 movies per language for: ${ln}. That is ${total} movies total.`;}
    else{distRule=` Every movie MUST match this mood: ${mt}. Do not deviate.`;}

    const langClause=langNames.length>=2?` Distribute across: ${ln}.`:(ln?` Language: ${ln}.`:"");
    const er=eras.map(e=>({classic:"before 1980",retro:"1980–2005",modern:"2006–2019",recent:"2020+"}[e]||"")).filter(Boolean).join(" or ");
    const ec=er?` Era: ${er}.`:"";
    const seenT=Object.keys(seen).map(k=>k.split("::")[0]);
    const excl=[...new Set([...seenT,...shownRef.current])];
    const sc=excl.length?` Do NOT suggest: ${excl.join(", ")}.`:"";
    const taste=likedTitles.length>0?` We previously enjoyed: ${likedTitles.slice(-8).join(", ")}. Suggest similar quality.`:"";
    const subList=subs.length>0?` CRITICAL: User ONLY subscribes to: ${subs.join(", ")}. Every movie MUST be available on one of these. Do NOT suggest movies from other platforms. The platforms field must ONLY contain services from this list.`:"";
    const exPlat=subs.length>0?subs[0]:"Netflix";

    const pr=mode==="couple"
      ?`Return exactly ${total} movies as JSON array.${distRule}${langClause}${ec}${taste}${subList} Mix popular+hidden gems.${sc} Genre: pick 1-2 from ONLY: Action, Comedy, Drama, Romance, Thriller, Horror, Sci-Fi, Fantasy, Animation, Musical, Documentary, Mystery, Adventure, Family. Context: couple's movie night. Return ONLY: [{"title":"...","year":2020,"genre":"Drama, Thriller","language":"...","mood":"...","whyWatch":"...","contentRating":"...","platforms":["${exPlat}"]}]. No markdown.`
      :`Return exactly ${total} movies as JSON array.${distRule} Kids ages: ${ages.join(",")}.${langClause}${ec}${taste}${subList}${sc} Genre: pick 1-2 from ONLY: Action, Comedy, Drama, Romance, Thriller, Horror, Sci-Fi, Fantasy, Animation, Musical, Documentary, Mystery, Adventure, Family. Context: family movie night, age-appropriate. Return ONLY: [{"title":"...","year":2020,"genre":"Action, Adventure","language":"...","mood":"...","whyWatch":"...","ageAppropriate":"...","platforms":["${exPlat}"]}]. No markdown.`;
    try{
      const ctrl=new AbortController();timer=setTimeout(()=>ctrl.abort(),40000);
      const txt=await askAI(pr,ctrl.signal);
      const m=txt.replace(/```json|```/g,"").trim().match(/\[[\s\S]*\]/);if(!m)throw new Error("Parse error");
      const parsed=JSON.parse(m[0]);
      parsed.forEach(p=>{if(p.title&&!shownRef.current.includes(p.title))shownRef.current.push(p.title);});
      setMov(parsed);
    }catch(e){setErr(e.name==="AbortError"?"Timed out. Try again!":(e.message||"Error"));setMov([{error:true}]);}
    finally{clearTimeout(timer);clearInterval(iv);setBusy(false);}
  },[moods,ages,mode,seen,langs,eras,subs]);

  // styles
  const cd={background:"rgba(255,255,255,0.035)",borderRadius:16,border:"1px solid rgba(255,255,255,0.06)"};
  const hd={fontFamily:DF,color:"#fff",fontWeight:700};
  const sb={color:"rgba(255,255,255,0.35)",fontSize:15};
  const lb={fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.28)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:10};
  const pbtn=on=>({width:"100%",padding:"16px",borderRadius:14,fontSize:16,fontWeight:700,fontFamily:F,
    background:on?AG:"rgba(255,255,255,0.05)",color:on?"#fff":"rgba(255,255,255,0.2)",
    boxShadow:on?"0 6px 24px rgba(232,147,47,0.3)":"none"});
  const bk={color:"rgba(255,255,255,0.4)",fontSize:15,fontWeight:600,padding:"6px 0",marginBottom:8};
  const pill=on=>({padding:"8px 14px",borderRadius:20,fontSize:14,fontWeight:600,fontFamily:F,
    border:on?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.07)",
    background:on?"rgba(232,147,47,0.12)":"rgba(255,255,255,0.03)",color:on?A:"rgba(255,255,255,0.4)"});
  const inp={width:"100%",padding:"13px 14px",borderRadius:12,fontSize:16,fontFamily:F,
    background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#fff",marginBottom:12};
  const Badge=({n})=>{const p=PCOLORS[n]||{c:"#888",b:"rgba(255,255,255,0.06)"};
    return <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,background:p.b,color:p.c}}>{n}</span>;};
  const socialBtn=(bg,color,border)=>({width:"100%",padding:"14px 20px",borderRadius:14,fontSize:15,fontWeight:600,fontFamily:F,
    display:"flex",alignItems:"center",justifyContent:"center",gap:12,background:bg,color,border:border||"none",marginBottom:10});
  const AvatarGrid=({selected,onSelect})=><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
    {AVATARS.map(a=><button key={a.id} onClick={()=>onSelect(a.emoji)}
      style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 2px 4px",borderRadius:10,gap:2,
        background:selected===a.emoji?a.bg:"rgba(255,255,255,0.03)",
        border:selected===a.emoji?"2px solid rgba(232,147,47,0.6)":"1.5px solid rgba(255,255,255,0.06)"}}>
      <span style={{fontSize:20}}>{a.emoji}</span>
      <span style={{fontSize:8,fontWeight:600,color:selected===a.emoji?A:"rgba(255,255,255,0.25)"}}>{a.label}</span>
    </button>)}
  </div>;

  const view=()=>{
    // ── LOGIN ──
    if(scr==="login")return <div className="fu" style={{padding:"30px 0"}}>
      <div style={{textAlign:"center",marginBottom:30}}>
        <div style={{fontSize:56,marginBottom:12}}>🎬</div>
        <h1 style={{...hd,fontSize:30,marginBottom:6}}>FlickDrop</h1>
        <p style={{...sb,lineHeight:1.5,fontSize:14}}>Your vibe. Your flick. Dropped.</p>
      </div>
      <button onClick={()=>setScr("login-name")} style={socialBtn("#fff","#1a1a1a")}>
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Continue with Google</button>
      <button onClick={()=>setScr("login-name")} style={socialBtn("#000","#fff","1px solid rgba(255,255,255,0.15)")}>
        <svg width="18" height="18" viewBox="0 0 384 512" fill="#fff"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
        Continue with Apple</button>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/><span style={{fontSize:12,color:"rgba(255,255,255,0.2)",fontWeight:600}}>OR</span><div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
      </div>
      <button onClick={()=>setScr("login-name")} style={socialBtn("rgba(255,255,255,0.06)","rgba(255,255,255,0.5)","1px solid rgba(255,255,255,0.08)")}>Continue as Guest</button>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.15)",textAlign:"center",marginTop:16}}>By continuing you agree to FlickDrop's Terms & Privacy Policy</p>
    </div>;

    // ── LOGIN NAME ──
    if(scr==="login-name")return <div className="fu" style={{padding:"20px 0"}}>
      <button style={bk} onClick={()=>setScr("login")}>← Back</button>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{width:72,height:72,borderRadius:18,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:38,background:avBg(loginAvatar),border:"2px solid rgba(232,147,47,0.4)"}}>{loginAvatar}</div>
        <h2 style={{...hd,fontSize:22}}>Choose your character</h2>
      </div>
      <AvatarGrid selected={loginAvatar} onSelect={setLoginAvatar}/>
      <p style={{...lb,marginTop:14}}>YOUR NAME</p>
      <input value={loginName} onChange={e=>setLoginName(e.target.value)} placeholder="Enter your name…" style={inp}/>
      <button style={pbtn(loginName.trim().length>0)} onClick={()=>{
        if(!loginName.trim())return;setUser({name:loginName.trim(),avatar:loginAvatar});setScr("login-subs");
      }}>Next → Streaming Services</button>
    </div>;

    // ── STREAMING SUBSCRIPTIONS ──
    if(scr==="login-subs")return <div className="fu" style={{padding:"20px 0"}}>
      <button style={bk} onClick={()=>setScr("login-name")}>← Back</button>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:40,marginBottom:8}}>📺</div>
        <h2 style={{...hd,fontSize:22,marginBottom:4}}>What do you subscribe to?</h2>
        <p style={sb}>We'll only recommend movies on your platforms</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {SUBS_LIST.map(s=>{const pc=PCOLORS[s]||{c:"#888",b:"rgba(255,255,255,0.06)"};
          return <button key={s} onClick={()=>setSubs(p=>tg(p,s))}
            style={{padding:"12px 10px",borderRadius:12,fontSize:14,fontWeight:600,fontFamily:F,textAlign:"center",
              border:subs.includes(s)?`1.5px solid ${pc.c}40`:"1.5px solid rgba(255,255,255,0.06)",
              background:subs.includes(s)?pc.b:"rgba(255,255,255,0.03)",
              color:subs.includes(s)?pc.c:"rgba(255,255,255,0.4)"}}>{s}{subs.includes(s)?" ✓":""}</button>;})}
      </div>
      <button style={pbtn(subs.length>0)} onClick={()=>{if(subs.length>0)setScr("home");}}>Let's Go</button>
      <button onClick={()=>setScr("home")} style={{width:"100%",padding:"12px",fontSize:13,color:"rgba(255,255,255,0.25)",marginTop:8,fontFamily:F}}>Skip for now</button>
    </div>;

    // ── HOME ──
    if(scr==="home")return <div className="fu">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,marginTop:6}}>
        <div><h1 style={{...hd,fontSize:26}}>🎬 FlickDrop</h1><p style={sb}>Hey {user?.name} {user?.avatar}</p></div>
        <button onClick={()=>setScr("account")}
          style={{width:44,height:44,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:26,background:avBg(user?.avatar),border:"1.5px solid rgba(232,147,47,0.3)"}}>{user?.avatar||"🥷"}</button>
      </div>
      <p style={lb}>WHO'S WATCHING?</p>
      <div style={{display:"flex",gap:10,marginBottom:24,flexWrap:"wrap"}}>
        <button onClick={()=>setAp(ap==="me"?null:"me")}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:14,
            border:ap==="me"?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
            background:ap==="me"?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
          <span style={{fontSize:30}}>{user?.avatar}</span>
          <span style={{fontSize:11,fontWeight:600,color:ap==="me"?A:"rgba(255,255,255,0.4)"}}>Me</span>
        </button>
        {prof.map(p=><button key={p.id} onClick={()=>setAp(ap===p.id?null:p.id)}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"10px 14px",borderRadius:14,
            border:ap===p.id?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
            background:ap===p.id?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
          <span style={{fontSize:30}}>{p.emoji}</span>
          <span style={{fontSize:11,fontWeight:600,color:ap===p.id?A:"rgba(255,255,255,0.4)"}}>{p.name}</span>
        </button>)}
      </div>
      <button onClick={()=>{setMoods([]);setAges([]);setLangs(["en"]);setEras([]);setTab(0);shownRef.current=[];setScr("pick");}}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>🍿</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Find a Flick</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>Pick a vibe, language & era</div></div>
      </button>
      <button onClick={()=>setScr("wl")}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>📋</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Watchlist</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>{wl.length} saved</div></div>
      </button>
      {lovedMovies.length>0&&<button onClick={()=>setScr("loved")}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>🔥</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Movies We Loved</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>{lovedMovies.length} favorites</div></div>
      </button>}
      <button onClick={()=>setScr("friends")}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>👥</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Friends</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>Poll, swipe & share with friends</div></div>
      </button>
      <p style={{...lb,marginTop:16}}>FUN STUFF</p>
      <button onClick={()=>{setBpMov(null);setBpRevealed(false);setBpGuess("");setScr("blindpick");}}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>🎭</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Blind Pick</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>Guess the movie from the plot alone</div></div>
      </button>
      <button onClick={()=>{setQuizStep(0);setQuizAnswers([]);setQuizResult(null);setScr("quiz");}}
        style={{...cd,width:"100%",padding:"18px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:10,textAlign:"left"}}>
        <span style={{fontSize:30}}>🧬</span>
        <div><div style={{color:"#fff",fontWeight:700,fontSize:17,fontFamily:DF}}>Movie DNA Quiz</div>
          <div style={{color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:2}}>Discover your movie personality</div></div>
      </button>
    </div>;

    // ── FRIENDS (placeholder) ──
    if(scr==="friends")return <div className="fu">
      <button style={bk} onClick={()=>setScr("home")}>← Home</button>
      <div style={{textAlign:"center",padding:"40px 0"}}>
        <div style={{fontSize:56,marginBottom:14}}>👥</div>
        <h2 style={{...hd,fontSize:22,marginBottom:8}}>Friends Circle</h2>
        <p style={{...sb,lineHeight:1.6,marginBottom:20,padding:"0 10px"}}>
          Share movie picks, vote together, and see what your friends loved — all in real-time.
        </p>
        <div style={{...cd,padding:"14px 16px",marginBottom:10,textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>🗳️</span>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>Group Poll</div>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>Friends vote on movie picks together</div></div>
          </div>
        </div>
        <div style={{...cd,padding:"14px 16px",marginBottom:10,textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>👆</span>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>Group Swipe</div>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>Everyone swipes, matches are revealed</div></div>
          </div>
        </div>
        <div style={{...cd,padding:"14px 16px",marginBottom:10,textAlign:"left"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>📤</span>
            <div><div style={{color:"#fff",fontWeight:600,fontSize:14}}>Share Watchlist</div>
              <div style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>Send picks to friends with notifications</div></div>
          </div>
        </div>
        <div style={{marginTop:16,padding:"14px",borderRadius:14,background:"rgba(232,147,47,0.08)",border:"1px solid rgba(232,147,47,0.15)"}}>
          <p style={{fontSize:13,color:A,fontWeight:600}}>Coming soon in the deployed version</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>Requires user accounts & real-time sync</p>
        </div>
      </div>
    </div>;

    // ── ACCOUNT ──
    if(scr==="account")return <div className="fu">
      <button style={bk} onClick={()=>setScr("home")}>← Home</button>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{width:72,height:72,borderRadius:18,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:38,background:avBg(user?.avatar),border:"2px solid rgba(232,147,47,0.4)"}}>{user?.avatar}</div>
        <h2 style={{...hd,fontSize:24,marginBottom:4}}>{user?.name}</h2>
        <button onClick={()=>setScr("edit-avatar")} style={{fontSize:13,color:A,fontWeight:600}}>Change avatar</button>
      </div>
      {[{s:"prof",i:"👨‍👩‍👧‍👦",t:"Family Members",d:`${prof.length} added`},
        {s:"wl",i:"📋",t:"Watchlist",d:`${wl.length} saved`},
        {s:"history",i:"🕐",t:"Watch History",d:`${Object.keys(seen).length} watched · ${Object.keys(rat).length} rated`},
        {s:"edit-subs",i:"📺",t:"Streaming Services",d:subs.length>0?subs.join(", "):"None selected"},
        {s:"feedback",i:"💬",t:"Send Feedback",d:"Report a bug or share what you love"},
      ].map(x=><button key={x.s} onClick={()=>setScr(x.s)}
        style={{...cd,width:"100%",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:20}}>{x.i}</span>
          <div style={{textAlign:"left"}}><div style={{color:"#fff",fontWeight:600,fontSize:14}}>{x.t}</div>
            <div style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginTop:2,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.d}</div></div>
        </div>
        <span style={{color:"rgba(255,255,255,0.2)",fontSize:16}}>›</span>
      </button>)}
      <button onClick={()=>{setUser(null);setProf([]);setWl([]);setSeen({});setRat({});setSubs([]);shownRef.current=[];setScr("login");}}
        style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:600,fontFamily:F,color:"#e85d4a",border:"1px solid rgba(232,93,74,0.2)",marginTop:16}}>Sign Out</button>
    </div>;

    // ── EDIT AVATAR ──
    if(scr==="edit-avatar")return <div className="fu">
      <button style={bk} onClick={()=>setScr("account")}>← Account</button>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{width:72,height:72,borderRadius:18,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:38,background:avBg(user?.avatar),border:"2px solid rgba(232,147,47,0.4)"}}>{user?.avatar}</div>
        <h2 style={{...hd,fontSize:22}}>Change Avatar</h2>
      </div>
      <AvatarGrid selected={user?.avatar} onSelect={emoji=>setUser({...user,avatar:emoji})}/>
      <button style={{...pbtn(true),marginTop:16}} onClick={()=>setScr("account")}>Done</button>
    </div>;

    // ── EDIT SUBS ──
    if(scr==="edit-subs")return <div className="fu">
      <button style={bk} onClick={()=>setScr("account")}>← Account</button>
      <h2 style={{...hd,fontSize:22,marginBottom:4}}>📺 Streaming Services</h2>
      <p style={{...sb,marginBottom:16}}>Select your active subscriptions</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {SUBS_LIST.map(s=>{const pc=PCOLORS[s]||{c:"#888",b:"rgba(255,255,255,0.06)"};
          return <button key={s} onClick={()=>setSubs(p=>tg(p,s))}
            style={{padding:"12px 10px",borderRadius:12,fontSize:14,fontWeight:600,fontFamily:F,textAlign:"center",
              border:subs.includes(s)?`1.5px solid ${pc.c}40`:"1.5px solid rgba(255,255,255,0.06)",
              background:subs.includes(s)?pc.b:"rgba(255,255,255,0.03)",
              color:subs.includes(s)?pc.c:"rgba(255,255,255,0.4)"}}>{s}{subs.includes(s)?" ✓":""}</button>;})}
      </div>
      <button style={pbtn(true)} onClick={()=>setScr("account")}>Done</button>
    </div>;

    // ── FAMILY PROFILES ──
    if(scr==="prof")return <div className="fu">
      <button style={bk} onClick={()=>setScr("account")}>← Account</button>
      <h2 style={{...hd,fontSize:22,marginBottom:4}}>Family Members</h2>
      <p style={{...sb,marginBottom:16}}>Add your family to FlickDrop</p>
      {prof.map(p=><div key={p.id} style={{...cd,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,background:avBg(p.emoji),flexShrink:0}}>{p.emoji}</div>
        <span style={{flex:1,fontSize:15,color:"#fff",fontWeight:600}}>{p.name}</span>
        <button onClick={()=>setProf(prof.filter(x=>x.id!==p.id))} style={{fontSize:12,color:"rgba(255,255,255,0.25)",padding:"4px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"}}>Remove</button>
      </div>)}
      <div style={{marginTop:16}}>
        <p style={lb}>ADD MEMBER</p>
        <AvatarGrid selected={ee} onSelect={setEe}/>
        <input value={en} onChange={e=>setEn(e.target.value)} placeholder="Name…" style={{...inp,marginTop:10}}/>
        <button style={pbtn(en.trim().length>0)} onClick={()=>{if(!en.trim())return;setProf([...prof,{id:String(Date.now()),name:en.trim(),emoji:ee}]);setEn("");}}>Add</button>
      </div>
    </div>;

    // ── PICK ──
    if(scr==="pick"){
      const ml=mode==="couple"?MC:MF;
      const ok=moods.length>0&&langs.length>0&&(mode==="couple"||ages.length>0);
      const selLangs=langs.map(c=>LANGS.find(l=>l.c===c)?.l).filter(Boolean);
      return <div className="fu">
        <button style={bk} onClick={()=>resetNav("home")}>← Home</button>
        <h2 style={{...hd,fontSize:24,marginBottom:4}}>{mode==="couple"?"Movie Night 🎬":"Family Night 👨‍👩‍👧‍👦"}</h2>
        <p style={{...sb,marginBottom:12}}>{mode==="couple"?"Pick a vibe for tonight":"What does everyone feel like?"}</p>
        <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:12,padding:3,marginBottom:14,gap:3}}>
          {["couple","family"].map(m=><button key={m} onClick={()=>{setMode(m);setMoods([]);setAges([]);setTab(0);}}
            style={{flex:1,padding:"10px 0",borderRadius:10,fontSize:14,fontWeight:600,fontFamily:F,
              background:mode===m?AG:"transparent",color:mode===m?"#fff":"rgba(255,255,255,0.3)",
              boxShadow:mode===m?"0 4px 14px rgba(232,147,47,0.25)":"none"}}>
            {m==="couple"?"🎬 Couple":"👨‍👩‍👧‍👦 Family"}</button>)}
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {["Vibe","Language & Era"].map((t,i)=><button key={t} onClick={()=>setTab(i)}
            style={{padding:"7px 14px",borderRadius:10,fontSize:12,fontWeight:700,
              background:tab===i?"rgba(232,147,47,0.12)":"rgba(255,255,255,0.03)",
              color:tab===i?A:"rgba(255,255,255,0.3)",border:tab===i?"1px solid rgba(232,147,47,0.3)":"1px solid rgba(255,255,255,0.06)"}}>
            {i===0&&moods.length>0&&"✓ "}{i===1&&langs.length>0&&"✓ "}{t}</button>)}
        </div>
        {tab===0?<>
          <p style={lb}>WHAT'S THE VIBE?</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginBottom:10}}>Pick 1 for 3 movies, or 2+ for 2 movies per vibe</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:16}}>
            {ml.map(m=><button key={m.l} onClick={()=>setMoods(p=>tg(p,m.l))}
              style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"11px 4px 8px",borderRadius:12,gap:4,
                border:moods.includes(m.l)?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
                background:moods.includes(m.l)?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
              <span style={{fontSize:24}}>{m.e}</span>
              <span style={{fontSize:11,fontWeight:600,color:moods.includes(m.l)?A:"rgba(255,255,255,0.45)"}}>{m.l}</span>
            </button>)}
          </div>
          {mode==="family"&&<><p style={lb}>KIDS' AGES</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {AGES.map(a=><button key={a} style={pill(ages.includes(a))} onClick={()=>setAges(p=>tg(p,a))}>{a}</button>)}
            </div></>}
          <button style={pbtn(moods.length>0&&(mode==="couple"||ages.length>0))}
            onClick={()=>{if(moods.length>0&&(mode==="couple"||ages.length>0))setTab(1);}}>Next → Language & Era</button>
        </>:<>
          <button onClick={()=>setShowLangs(!showLangs)}
            style={{...cd,width:"100%",padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div><p style={{...lb,marginBottom:2,fontSize:11}}>LANGUAGE</p>
              <p style={{fontSize:13,color:A,fontWeight:600}}>{selLangs.join(", ")}</p></div>
            <span style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>{showLangs?"▲":"▼"}</span>
          </button>
          {showLangs&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
            {LANGS.map(l=><button key={l.c} onClick={()=>setLangs(p=>tg(p,l.c))}
              style={{padding:"8px 10px",borderRadius:10,fontSize:13,fontWeight:600,fontFamily:F,textAlign:"left",
                border:langs.includes(l.c)?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
                background:langs.includes(l.c)?"rgba(232,147,47,0.12)":"rgba(255,255,255,0.03)",
                color:langs.includes(l.c)?A:"rgba(255,255,255,0.4)"}}>{l.e} {l.l}</button>)}
          </div>}
          <p style={lb}>MOVIE ERA</p>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.2)",marginBottom:8}}>Optional · Select multiple for variety</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
            {ERAS.map(x=><button key={x.v} onClick={()=>setEras(p=>tg(p,x.v))}
              style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 8px 8px",borderRadius:12,gap:2,
                border:eras.includes(x.v)?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
                background:eras.includes(x.v)?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
              <span style={{fontSize:20}}>{x.e}</span>
              <span style={{fontSize:13,fontWeight:700,color:eras.includes(x.v)?A:"rgba(255,255,255,0.5)"}}>{x.l}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>{x.s}</span>
            </button>)}
          </div>
          <button style={pbtn(ok)} onClick={()=>ok&&doFetch()}>🍿 Drop My Flicks</button>
        </>}
      </div>;
    }

    // ── RESULTS ──
    if(scr==="results"){
      return <div className="fu">
        <button style={bk} onClick={()=>resetNav("pick")}>← New Search</button>
        {busy?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"50px 20px",gap:14}}>
          <div className="sp"/><p className="pt" style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>{lm}</p>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.2)"}}>Usually takes 5–15 seconds</p>
          <button onClick={()=>resetNav("pick")} style={{fontSize:13,color:A,marginTop:8,padding:"8px 20px",borderRadius:10,border:"1px solid rgba(232,147,47,0.3)"}}>Cancel</button></div>
        :mov[0]?.error?<div style={{textAlign:"center",padding:"40px 0"}}>
          <p style={{color:"#e85d4a",fontSize:16,marginBottom:8}}>Something went wrong</p>
          {err&&<p style={{color:"rgba(255,255,255,0.3)",fontSize:13,marginBottom:12,wordBreak:"break-word"}}>{err}</p>}
          <button style={bk} onClick={()=>resetNav("pick")}>← Try again</button></div>
        :<>
          <p style={{...lb,marginBottom:12}}>TONIGHT'S DROP</p>
          {mov.map((m,i)=><button key={i} onClick={()=>{setDet(m);setScr("detail");}}
            style={{...cd,padding:"14px 16px",marginBottom:10,width:"100%",textAlign:"left"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
              <h3 style={{fontFamily:DF,fontSize:15,fontWeight:700,color:"#fff",lineHeight:1.2}}>{m.title}</h3>
              {isSn(m)&&<span style={{fontSize:10,color:A,fontWeight:700,marginLeft:6}}>SEEN ✓</span>}
            </div>
            <p style={{fontSize:12,color:"rgba(232,147,47,0.7)",fontWeight:600,margin:"3px 0 5px"}}>
              {m.year} · {m.genre}{m.language&&m.language!=="English"?` · ${m.language}`:""}{m.mood?` · ${m.mood}`:""}</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.42)",lineHeight:1.5,marginBottom:6}}>{m.whyWatch}</p>
            {m.platforms?.length>0&&<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {m.platforms.map((p,j)=><Badge key={j} n={p}/>)}</div>}
          </button>)}
          <button style={pbtn(true)} onClick={doFetch}>🎬 Fresh Drop</button>
          <button onClick={()=>resetNav("home")} style={{width:"100%",padding:"12px",borderRadius:14,fontSize:14,fontWeight:600,fontFamily:F,color:"rgba(255,255,255,0.4)",marginTop:8}}>← Back to Home</button>
          <p style={{fontSize:10,color:"rgba(255,255,255,0.13)",textAlign:"center",marginTop:6}}>Streaming is AI-estimated</p>
        </>}
      </div>;
    }

    // ── DETAIL ──
    if(scr==="detail"&&det){const rv=gR(det);return <div className="fu">
      <button style={bk} onClick={()=>setScr("results")}>← Back</button>
      <div style={{textAlign:"center",fontSize:40,marginBottom:10}}>🎬</div>
      <h2 style={{...hd,fontSize:20,textAlign:"center"}}>{det.title}</h2>
      <p style={{textAlign:"center",fontSize:12,color:"rgba(232,147,47,0.7)",fontWeight:600,margin:"4px 0 6px"}}>{det.year} · {det.genre}</p>
      <p style={{textAlign:"center",fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.5,marginBottom:16,padding:"0 6px"}}>{det.whyWatch}</p>
      {det.platforms?.length>0&&<><p style={lb}>LIKELY STREAMING ON</p>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {det.platforms.map((p,j)=>{const c=PCOLORS[p]||{c:"#888",b:"rgba(255,255,255,0.06)"};
            return <span key={j} style={{fontSize:12,fontWeight:700,padding:"7px 14px",borderRadius:10,background:c.b,color:c.c}}>{p}</span>;})}</div></>}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={()=>tWl(det)} style={{...cd,flex:1,padding:"12px",textAlign:"center",background:inWl(det)?"rgba(232,147,47,0.1)":cd.background}}>
          <div style={{fontSize:20}}>{inWl(det)?"✅":"📋"}</div>
          <div style={{fontSize:11,fontWeight:600,color:inWl(det)?A:"rgba(255,255,255,0.4)",marginTop:3}}>{inWl(det)?"Saved":"Watchlist"}</div>
        </button>
        <button onClick={()=>tSn(det)} style={{...cd,flex:1,padding:"12px",textAlign:"center",background:isSn(det)?"rgba(232,147,47,0.1)":cd.background}}>
          <div style={{fontSize:20}}>{isSn(det)?"👁️":"👀"}</div>
          <div style={{fontSize:11,fontWeight:600,color:isSn(det)?A:"rgba(255,255,255,0.4)",marginTop:3}}>{isSn(det)?"Seen ✓":"Mark Seen"}</div>
        </button>
      </div>
      <p style={lb}>HOW WAS IT?</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {RES.map(r=><button key={r.e} onClick={()=>doRate(det,r.e,r.l)}
          style={{padding:"10px 4px",borderRadius:12,textAlign:"center",
            border:rv===r.e?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
            background:rv===r.e?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
          <div style={{fontSize:20}}>{r.e}</div>
          <div style={{fontSize:10,fontWeight:600,color:rv===r.e?A:"rgba(255,255,255,0.35)",marginTop:2}}>{r.l}</div>
        </button>)}
      </div>
    </div>;}

    // ── WATCHLIST ──
    if(scr==="wl")return <div className="fu">
      <button style={bk} onClick={()=>setScr("home")}>← Home</button>
      <h2 style={{...hd,fontSize:22,marginBottom:4}}>📋 Watchlist</h2>
      <p style={{...sb,marginBottom:16}}>{wl.length} saved</p>
      {wl.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><p style={{fontSize:36,marginBottom:10}}>🎬</p><p style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>No movies saved yet!</p></div>
      :wl.map((m,i)=><div key={i} style={{...cd,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontFamily:DF,fontSize:14,fontWeight:700,color:"#fff"}}>{m.title}</span>
            {isSn(m)&&<span style={{fontSize:10,color:A,fontWeight:700}}>SEEN</span>}
            {gR(m)&&<span style={{fontSize:14}}>{gR(m)}</span>}
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:2}}>{m.year} · {m.genre}</div>
        </div>
        <button onClick={()=>tWl(m)} style={{fontSize:12,color:"rgba(255,255,255,0.25)",padding:"4px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)"}}>Remove</button>
      </div>)}
    </div>;

    // ── LOVED ──
    if(scr==="loved")return <div className="fu">
      <button style={bk} onClick={()=>setScr("home")}>← Home</button>
      <h2 style={{...hd,fontSize:22,marginBottom:4}}>🔥 Movies We Loved</h2>
      <p style={{...sb,marginBottom:16}}>Family favorites</p>
      {lovedMovies.map((m,i)=><div key={i} style={{...cd,padding:"12px 14px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>🔥</span>
          <span style={{fontFamily:DF,fontSize:14,fontWeight:700,color:"#fff"}}>{m.title}</span></div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:3}}>{m.year}{m.genre?` · ${m.genre}`:""}</div>
      </div>)}
      <p style={{fontSize:11,color:"rgba(255,255,255,0.18)",textAlign:"center",marginTop:10}}>Your favorites help FlickDrop suggest better picks</p>
    </div>;

    // ── WATCH HISTORY ──
    if(scr==="history"){
      const items=Object.entries(seen).map(([k,v])=>({key:k,title:v.title||k.split("::")[0],year:v.year||k.split("::")[1],genre:v.genre,language:v.language,rating:rat[k]}));
      return <div className="fu">
        <button style={bk} onClick={()=>setScr("account")}>← Account</button>
        <h2 style={{...hd,fontSize:22,marginBottom:4}}>🕐 Watch History</h2>
        <p style={{...sb,marginBottom:16}}>{items.length} watched</p>
        {items.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><p style={{fontSize:36,marginBottom:10}}>👀</p><p style={{color:"rgba(255,255,255,0.3)",fontSize:14}}>No movies watched yet!</p></div>
        :items.map((m,i)=><div key={i} style={{...cd,padding:"12px 14px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {m.rating&&<span style={{fontSize:16}}>{m.rating.emoji}</span>}
            <span style={{fontFamily:DF,fontSize:14,fontWeight:700,color:"#fff"}}>{m.title}</span>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:3}}>
            {m.year}{m.genre?` · ${m.genre}`:""}{m.rating?` · ${m.rating.label}`:""}</div>
        </div>)}
      </div>;
    }
    // ── BLIND PICK ──
    if(scr==="blindpick"){
      const fetchBP=async()=>{
        setBpLoading(true);setBpMov(null);setBpRevealed(false);setBpGuess("");
        try{
          const ctrl=new AbortController();setTimeout(()=>ctrl.abort(),40000);
          const txt=await askAI("Pick 1 well-known movie and describe its plot in 2-3 sentences WITHOUT mentioning the title, any character names, or actor names. Make it tricky but fair. Return ONLY JSON with fields: plot, title, year, genre, hint (1 word). No markdown, no backticks, pure JSON only.",ctrl.signal);
          const m=txt.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
          if(m)setBpMov(JSON.parse(m[0]));
        }catch(e){console.error(e);}
        finally{setBpLoading(false);}
      };
      if(!bpMov&&!bpLoading){fetchBP();}
      return <div className="fu">
        <button style={bk} onClick={()=>setScr("home")}>← Home</button>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:44,marginBottom:8}}>🎭</div>
          <h2 style={{...hd,fontSize:22}}>Blind Pick</h2>
          <p style={sb}>Can you guess the movie?</p>
        </div>
        {bpLoading?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px",gap:14}}>
          <div className="sp"/><p className="pt" style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Finding a tricky one…</p></div>
        :bpMov?<>
          <div style={{...cd,padding:"20px 16px",marginBottom:16}}>
            <p style={{...lb,marginBottom:8}}>THE PLOT</p>
            <p style={{fontSize:15,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>{bpMov.plot}</p>
            {!bpRevealed&&<div style={{marginTop:12}}>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.25)",marginBottom:4}}>Hint: {bpMov.hint}</p>
            </div>}
          </div>
          {!bpRevealed?<>
            <input value={bpGuess} onChange={e=>setBpGuess(e.target.value)} placeholder="Your guess…" style={inp}/>
            <button style={pbtn(true)} onClick={()=>setBpRevealed(true)}>
              {bpGuess.trim()?"Check My Answer":"Reveal Answer"}</button>
          </>:<div style={{textAlign:"center",padding:"10px 0"}}>
            {bpGuess.trim()&&bpGuess.trim().toLowerCase()===bpMov.title.toLowerCase()?
              <><div style={{fontSize:44,marginBottom:8}}>🎉</div><p style={{...hd,fontSize:20,marginBottom:4}}>You got it!</p></>:
              bpGuess.trim()?<><div style={{fontSize:44,marginBottom:8}}>😅</div><p style={{...hd,fontSize:20,marginBottom:4}}>Not quite!</p></>:null}
            <div style={{...cd,padding:"16px",marginTop:12}}>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:4}}>THE ANSWER</p>
              <p style={{fontFamily:DF,fontSize:20,fontWeight:700,color:"#fff"}}>{bpMov.title}</p>
              <p style={{fontSize:13,color:"rgba(232,147,47,0.7)",fontWeight:600,marginTop:4}}>{bpMov.year} · {bpMov.genre}</p>
            </div>
            <button style={{...pbtn(true),marginTop:16}} onClick={()=>{setBpMov(null);setBpRevealed(false);setBpGuess("");}}>Next Movie →</button>
          </div>}
        </>:null}
      </div>;
    }

    // ── MOVIE DNA QUIZ ──
    if(scr==="quiz"){
      const QS=[
        {q:"It's Saturday night. You reach for…",opts:["Something everyone's talking about","A hidden gem no one knows","Whatever matches my mood","The one with the best trailer"]},
        {q:"Your ideal movie snack?",opts:["Popcorn (classic energy)","Nachos (bold choices)","Candy (sweet + lighthearted)","Nothing (fully locked in)"]},
        {q:"A movie makes you cry. You…",opts:["Pretend it didn't happen","Embrace it — tears are valid","Rewatch the scene immediately","Text everyone about it"]},
        {q:"Pick a movie era:",opts:["Black & white classics","'80s and '90s nostalgia","2000s golden age","Brand new releases only"]},
        {q:"Your friend picks a bad movie. You…",opts:["Suffer in silence","Roast them mercilessly","Fall asleep","Find something to enjoy anyway"]},
        {q:"Favorite plot twist?",opts:["The villain was right all along","It was a dream (or was it?)","The quiet character saves everyone","The ending is left open"]},
      ];
      const TYPES=[
        {name:"The Curator",emoji:"🎩",desc:"You have impeccable taste and a watchlist longer than most people's lifetime viewing. You're the friend everyone asks for recommendations.",color:"#3a1078"},
        {name:"The Adventurer",emoji:"🗺️",desc:"You'll watch anything once. Foreign films, documentaries, silent movies — you're always chasing the next discovery.",color:"#0f3460"},
        {name:"The Comfort Rewatcher",emoji:"🛋️",desc:"You have 5 movies you've seen 50 times each and you're not ashamed. Predictability is underrated.",color:"#2c1810"},
        {name:"The Social Screener",emoji:"📱",desc:"Movies are a group activity. You're organizing watch parties, sharing memes, and live-texting reactions.",color:"#2d0a31"},
      ];
      const doQuizResult=async(answers)=>{
        setQuizLoading(true);
        try{
          const ctrl=new AbortController();setTimeout(()=>ctrl.abort(),40000);
          var qStr=answers.map(function(a,i){return "Q"+(i+1)+": "+a;}).join(", ");
          const txt=await askAI("Based on these movie quiz answers, give a fun movie personality result. Answers: "+qStr+". Return ONLY JSON with fields: type (creative name), emoji (1 emoji), description (2-3 fun sentences), topGenres (array of 2 genres), spiritMovie (a movie title), color (hex color). No markdown, no backticks, pure JSON only.",ctrl.signal);
          const m=txt.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
          if(m)setQuizResult(JSON.parse(m[0]));
          else setQuizResult(TYPES[Math.floor(Math.random()*TYPES.length)]);
        }catch{setQuizResult(TYPES[Math.floor(Math.random()*TYPES.length)]);}
        finally{setQuizLoading(false);}
      };

      if(quizResult)return <div className="fu">
        <button style={bk} onClick={()=>setScr("home")}>← Home</button>
        <div style={{textAlign:"center",padding:"10px 0"}}>
          <div style={{width:80,height:80,borderRadius:20,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:40,background:quizResult.color||"#3a1078",border:"2px solid rgba(232,147,47,0.4)"}}>{quizResult.emoji}</div>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginBottom:4}}>YOUR MOVIE DNA</p>
          <h2 style={{...hd,fontSize:22,marginBottom:8}}>{quizResult.type||quizResult.name}</h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.6,padding:"0 8px",marginBottom:16}}>{quizResult.description||quizResult.desc}</p>
          {quizResult.topGenres&&<div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:12}}>
            {quizResult.topGenres.map((g,i)=><span key={i} style={{padding:"5px 12px",borderRadius:10,fontSize:12,fontWeight:600,
              background:"rgba(232,147,47,0.1)",color:A,border:"1px solid rgba(232,147,47,0.2)"}}>{g}</span>)}</div>}
          {quizResult.spiritMovie&&<div style={{...cd,padding:"12px 16px",marginBottom:16}}>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>YOUR SPIRIT MOVIE</p>
            <p style={{fontFamily:DF,fontSize:16,fontWeight:700,color:"#fff",marginTop:4}}>{quizResult.spiritMovie}</p>
          </div>}
          <button style={pbtn(true)} onClick={()=>{setQuizStep(0);setQuizAnswers([]);setQuizResult(null);}}>Retake Quiz</button>
          <button onClick={()=>setScr("home")} style={{width:"100%",padding:"12px",fontSize:14,fontWeight:600,fontFamily:F,color:"rgba(255,255,255,0.4)",marginTop:8}}>← Home</button>
        </div>
      </div>;

      if(quizLoading)return <div className="fu">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px",gap:14}}>
          <div className="sp"/><p className="pt" style={{fontSize:14,color:"rgba(255,255,255,0.4)"}}>Analyzing your movie DNA…</p>
        </div>
      </div>;

      const cq=QS[quizStep];
      return <div className="fu">
        <button style={bk} onClick={()=>quizStep>0?setQuizStep(quizStep-1):setScr("home")}>{quizStep>0?"← Back":"← Home"}</button>
        <div style={{textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:12,color:A,fontWeight:700,marginBottom:6}}>{quizStep+1} of {QS.length}</p>
          <div style={{width:"100%",height:4,borderRadius:2,background:"rgba(255,255,255,0.06)",marginBottom:16}}>
            <div style={{width:`${((quizStep+1)/QS.length)*100}%`,height:"100%",borderRadius:2,background:AG,transition:"width .3s"}}/>
          </div>
          <h2 style={{...hd,fontSize:20,lineHeight:1.4}}>{cq.q}</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {cq.opts.map((o,i)=><button key={i} onClick={()=>{
            const na=[...quizAnswers,o];setQuizAnswers(na);
            if(quizStep<QS.length-1)setQuizStep(quizStep+1);
            else doQuizResult(na);
          }} style={{...cd,padding:"14px 16px",textAlign:"left",fontSize:15,color:"#fff",fontWeight:500}}>
            {o}
          </button>)}
        </div>
      </div>;
    }

    // ── FEEDBACK ──
    if(scr==="feedback"){
      const FB_TYPES=[
        {e:"🐛",l:"Bug",d:"Something isn't working"},
        {e:"🎬",l:"Wrong Movie",d:"Got a bad recommendation"},
        {e:"📺",l:"Wrong Platform",d:"Movie isn't on this service"},
        {e:"💡",l:"Feature Idea",d:"I wish the app could..."},
        {e:"❤️",l:"Love It",d:"Something I really enjoyed"},
      ];
      const FB_SCREENS=["Login","Home","Find a Flick","Results","Movie Detail","Watchlist","Blind Pick","Quiz","Other"];
      const submitFb=()=>{
        if(!fbType||!fbText.trim())return;
        const entry={type:fbType,text:fbText.trim(),screen:fbScreen||"Not specified",time:new Date().toLocaleString()};
        setFbAll(prev=>[entry,...prev]);
        setFbSent(true);
        // In deployed version, this would POST to a webhook:
        // fetch('/api/feedback', {method:'POST', body:JSON.stringify(entry)})
      };
      if(fbSent)return <div className="fu">
        <button style={bk} onClick={()=>{setFbSent(false);setFbType(null);setFbText("");setScr("account");}}>← Account</button>
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:56,marginBottom:14}}>🎉</div>
          <h2 style={{...hd,fontSize:22,marginBottom:8}}>Thanks for your feedback!</h2>
          <p style={{...sb,lineHeight:1.6,marginBottom:24}}>This helps us make FlickDrop better for everyone.</p>
          <button style={pbtn(true)} onClick={()=>{setFbSent(false);setFbType(null);setFbText("");setScr("home");}}>Back to Home</button>
          <button onClick={()=>{setFbSent(false);setFbType(null);setFbText("");}} style={{width:"100%",padding:"12px",fontSize:14,fontWeight:600,fontFamily:F,color:"rgba(255,255,255,0.4)",marginTop:8}}>Send More Feedback</button>
        </div>
      </div>;
      return <div className="fu">
        <button style={bk} onClick={()=>{setFbType(null);setFbText("");setScr("account");}}>← Account</button>
        <h2 style={{...hd,fontSize:22,marginBottom:4}}>💬 Send Feedback</h2>
        <p style={{...sb,marginBottom:16}}>No personal info collected — just what we need to improve</p>

        <p style={lb}>WHAT'S THIS ABOUT?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:18}}>
          {FB_TYPES.map(t=><button key={t.l} onClick={()=>setFbType(t.l)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:12,textAlign:"left",
              border:fbType===t.l?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
              background:fbType===t.l?"rgba(232,147,47,0.1)":"rgba(255,255,255,0.03)"}}>
            <span style={{fontSize:20}}>{t.e}</span>
            <div><div style={{fontSize:13,fontWeight:600,color:fbType===t.l?A:"rgba(255,255,255,0.5)"}}>{t.l}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>{t.d}</div></div>
          </button>)}
        </div>

        {fbType&&<>
          <p style={lb}>WHICH SCREEN? (OPTIONAL)</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {FB_SCREENS.map(s=><button key={s} onClick={()=>setFbScreen(prev=>prev===s?null:s)}
              style={{padding:"6px 12px",borderRadius:10,fontSize:12,fontWeight:600,fontFamily:F,
                border:fbScreen===s?"1.5px solid rgba(232,147,47,0.5)":"1.5px solid rgba(255,255,255,0.06)",
                background:fbScreen===s?"rgba(232,147,47,0.12)":"rgba(255,255,255,0.03)",
                color:fbScreen===s?A:"rgba(255,255,255,0.35)"}}>{s}</button>)}
          </div>

          <p style={lb}>TELL US MORE</p>
          <textarea value={fbText} onChange={e=>setFbText(e.target.value)}
            placeholder={fbType==="Bug"?"What happened? What did you expect?":fbType==="Love It"?"What did you enjoy? We'd love to know!":"Describe in a few words..."}
            rows={4} style={{width:"100%",padding:"12px 14px",borderRadius:12,fontSize:14,fontFamily:F,resize:"vertical",
              background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#fff",marginBottom:16,lineHeight:1.5}}/>

          <button style={pbtn(fbText.trim().length>0)} onClick={submitFb}>Send Feedback</button>
        </>}

        {fbAll.length>0&&<>
          <p style={{...lb,marginTop:24}}>RECENT FEEDBACK ({fbAll.length})</p>
          {fbAll.slice(0,5).map((f,i)=><div key={i} style={{...cd,padding:"10px 14px",marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:14}}>{FB_TYPES.find(t=>t.l===f.type)?.e||"💬"}</span>
              <span style={{fontSize:12,fontWeight:600,color:A}}>{f.type}</span>
              {f.screen&&f.screen!=="Not specified"&&<span style={{fontSize:10,color:"rgba(255,255,255,0.25)"}}>· {f.screen}</span>}
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",lineHeight:1.4}}>{f.text}</p>
            <p style={{fontSize:10,color:"rgba(255,255,255,0.15)",marginTop:4}}>{f.time}</p>
          </div>)}
        </>}
      </div>;
    }

    return null;
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(170deg,#1c1722,#0e0a13)",fontFamily:F,
      paddingTop:"env(safe-area-inset-top)",paddingBottom:"env(safe-area-inset-bottom)"}}>
      <style>{CSS}</style>
      <div className="sc" style={{maxWidth:430,margin:"0 auto",padding:"12px 22px 32px",minHeight:"100vh"}}>{view()}</div>
    </div>
  );
}
