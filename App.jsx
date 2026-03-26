import { useState, useRef, useCallback, useEffect } from 'react'

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  lime:'#aaee22', limeD:'#88cc00', limeL:'#d4f57a', limeXL:'#f0fcd4',
  bg:'#f7faf0', surf:'#ffffff', surfAlt:'#f2f7e8', border:'#ddeebb',
  text:'#1a2a0a', mid:'#4a6020', soft:'#8aaa50',
  red:'#e8390a', orange:'#f5a623', purple:'#7c3aed', blue:'#2563eb',
  gray:'#94a3b8', grayL:'#f1f5f9', grayB:'#e2e8f0',
  sim1:'#2563eb',  // bleu  — SIM 1
  sim2:'#7c3aed',  // violet — SIM 2
}

const KW_COLORS = [
  '#88cc00','#f5a623','#2563eb','#e8390a','#7c3aed','#06b6d4',
  '#ec4899','#059669','#d97706','#6366f1','#65a30d','#dc2626',
  '#2d87f0','#9333ea','#0d9488','#ea580c','#16a34a','#a21caf',
  '#0284c7','#c2410c',
]

const fmtDur = s => s ? `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` : ''
const fmtDate = () => new Date().toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({size=42}) => (
  <svg width={size} height={size} viewBox="0 0 46 46" fill="none">
    <defs>
      <radialGradient id="lg" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#d4f57a"/>
        <stop offset="100%" stopColor="#88cc00"/>
      </radialGradient>
    </defs>
    <circle cx="23" cy="23" r="22" fill="url(#lg)"/>
    <ellipse cx="17" cy="14" rx="8" ry="4.5" fill="rgba(255,255,255,0.28)"/>
    <path d="M15 17.5c-.5 3.2 1.1 7 4 9.9 2.9 2.9 6.6 4.5 9.9 4l.9-3.7-3-1.3-1.3 1.5c-1.3-.6-3-1.9-4.1-3-1.1-1.1-2.4-2.7-3-4.1l1.5-1.3-1.3-3-3.6.9z" fill="#1a2a0a"/>
    <path d="M27 15.5c1.6 1.6 2.4 3.8 2.2 6" stroke="#1a2a0a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M29.8 12.7c2.7 2.7 4 6.2 3.6 9.7" stroke="#1a2a0a" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="23" cy="38" r="3.5" fill="#1a2a0a"/>
    <circle cx="23" cy="38" r="2"   fill="#aaee22"/>
  </svg>
)

// ─── SIM CARD ICON ────────────────────────────────────────────────────────────
const SimIcon = ({color='#2563eb', size=28, label='1'}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <rect x="2" y="1" width="24" height="26" rx="4" fill={`${color}22`} stroke={color} strokeWidth="1.8"/>
    <path d="M9 1v5a2 2 0 0 1-2 2H2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="7" y="12" width="5" height="4" rx="1" fill={color} opacity="0.5"/>
    <rect x="16" y="12" width="5" height="4" rx="1" fill={color} opacity="0.5"/>
    <rect x="7" y="18" width="14" height="4" rx="1" fill={color} opacity="0.5"/>
    <text x="14" y="9" textAnchor="middle" fontSize="7" fontWeight="800" fill={color} fontFamily="Nunito,sans-serif">SIM {label}</text>
  </svg>
)

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ic = ({n, sz=18, c='currentColor'}) => {
  const p = {fill:'none',stroke:c,strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'}
  const s = {width:sz,height:sz}
  const m = {
    mic:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    stop:   <svg {...s} viewBox="0 0 24 24" {...p}><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    phone:  <svg {...s} viewBox="0 0 24 24" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    folder: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    gear:   <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    trash:  <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    plus:   <svg {...s} viewBox="0 0 24 24" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x:      <svg {...s} viewBox="0 0 24 24" {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    dl:     <svg {...s} viewBox="0 0 24 24" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    ok:     <svg {...s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    star:   <svg {...s} viewBox="0 0 24 24" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    home:   <svg {...s} viewBox="0 0 24 24" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    edit:   <svg {...s} viewBox="0 0 24 24" {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    block:  <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    info:   <svg {...s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    shield: <svg {...s} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    tag:    <svg {...s} viewBox="0 0 24 24" {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  }
  return m[n] || null
}

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────
const Wave = ({on, color=C.limeD}) => (
  <div style={{display:'flex',alignItems:'center',gap:3,height:30}}>
    {Array.from({length:16}).map((_,i)=>(
      <div key={i} style={{
        width:4, borderRadius:3,
        background:`linear-gradient(180deg,${C.lime},${color})`,
        height: on ? undefined : '3px',
        minHeight: on ? '5px' : undefined,
        animation: on ? `wave ${0.3+(i%5)*0.11}s ease-in-out infinite alternate` : 'none',
        animationDelay:`${i*0.06}s`,
        opacity: on ? 1 : 0.18,
      }}/>
    ))}
  </div>
)

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {

  // ── SIM CONFIG — cœur de la fonctionnalité ───────────────────────────────
  // activeSim : 1 | 2 | null
  // Si activeSim === 1 → seuls les appels SIM 1 sont enregistrables
  // Si activeSim === 2 → seuls les appels SIM 2 sont enregistrables
  const [sims, setSims] = useState({
    sim1: { num: '', label: 'SIM 1', operator: '', configured: false },
    sim2: { num: '', label: 'SIM 2', operator: '', configured: false },
  })
  const [activeSim, setActiveSim] = useState(null) // 1 ou 2 — la SIM surveillée

  // ── App state ─────────────────────────────────────────────────────────────
  const [tab,         setTab]         = useState('home')
  const [contacts,    setContacts]    = useState([
    {id:1, num:'+22961000001', label:'Kofi Mensah – Parakou',  color:KW_COLORS[0], calls:0, sim:1},
    {id:2, num:'+22967000002', label:'Amina Diallo – Cotonou', color:KW_COLORS[1], calls:0, sim:1},
  ])
  const [keywords,    setKeywords]    = useState([
    {id:1, word:'urgent',    color:KW_COLORS[2], count:0},
    {id:2, word:'livraison', color:KW_COLORS[3], count:0},
    {id:3, word:'contrat',   color:KW_COLORS[4], count:0},
  ])
  const [recordings,  setRecordings]  = useState([])
  const [activeRec,   setActiveRec]   = useState(null)
  const [transcript,  setTranscript]  = useState('')
  const [detKws,      setDetKws]      = useState([])
  const [permOk,      setPermOk]      = useState(false)
  const [wave,        setWave]        = useState(false)
  const [aiData,      setAiData]      = useState({})
  const [notif,       setNotif]       = useState(null)
  const [folderFilter,setFolderFilter]= useState(null)
  const [elapsed,     setElapsed]     = useState(0)

  // forms
  const [showSimSetup,  setShowSimSetup]  = useState(false)
  const [simDraft,      setSimDraft]      = useState({sim1:{num:'',label:'SIM 1',operator:''},sim2:{num:'',label:'SIM 2',operator:''}})
  const [showAddContact,setShowAddContact]= useState(false)
  const [contactDraft,  setContactDraft]  = useState({num:'',label:'',sim:1})
  const [editContactId, setEditContactId] = useState(null)
  const [showAddKw,     setShowAddKw]     = useState(false)
  const [newKw,         setNewKw]         = useState('')

  // refs
  const mrRef  = useRef(null)
  const chunks = useRef([])
  const recog  = useRef(null)
  const stm    = useRef(null)
  const detRef = useRef([])
  const txRef  = useRef('')
  const timer  = useRef(null)

  // Charger config depuis localStorage
  useEffect(() => {
    try {
      const s = localStorage.getItem('callscan_sims')
      if (s) setSims(JSON.parse(s))
      const a = localStorage.getItem('callscan_activeSim')
      if (a) setActiveSim(JSON.parse(a))
      const c = localStorage.getItem('callscan_contacts')
      if (c) setContacts(JSON.parse(c))
      const k = localStorage.getItem('callscan_keywords')
      if (k) setKeywords(JSON.parse(k))
      const r = localStorage.getItem('callscan_recordings_meta')
      if (r) setRecordings(JSON.parse(r))
    } catch {}
  }, [])

  // Sauvegarder config dans localStorage
  useEffect(() => { localStorage.setItem('callscan_sims', JSON.stringify(sims)) }, [sims])
  useEffect(() => { localStorage.setItem('callscan_activeSim', JSON.stringify(activeSim)) }, [activeSim])
  useEffect(() => { localStorage.setItem('callscan_contacts', JSON.stringify(contacts)) }, [contacts])
  useEffect(() => { localStorage.setItem('callscan_keywords', JSON.stringify(keywords)) }, [keywords])
  useEffect(() => {
    // On sauvegarde les métadonnées (sans le blob audio)
    const meta = recordings.map(r => ({...r, url: null}))
    localStorage.setItem('callscan_recordings_meta', JSON.stringify(meta))
  }, [recordings])

  // ── helpers ───────────────────────────────────────────────────────────────
  const notify = useCallback((msg,type='ok') => {
    setNotif({msg,type}); setTimeout(()=>setNotif(null),3400)
  },[])

  const findKws = useCallback(txt =>
    keywords.filter(k=>txt.toLowerCase().includes(k.word.toLowerCase()))
  ,[keywords])

  const simColor  = n => n===1 ? C.sim1 : C.sim2
  const simLabel  = n => n===1 ? (sims.sim1.label||'SIM 1') : (sims.sim2.label||'SIM 2')
  const simNum    = n => n===1 ? sims.sim1.num : sims.sim2.num

  // Contacts de la SIM surveillée uniquement
  const allowedContacts = contacts.filter(c => c.sim === activeSim)

  // ── Microphone ────────────────────────────────────────────────────────────
  const askMic = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({audio:true,echoCancellation:true,noiseSuppression:true})
      stm.current = s; setPermOk(true); notify('✅ Microphone autorisé !')
    } catch { notify('❌ Permission microphone refusée','err') }
  }

  // ── START enregistrement ──────────────────────────────────────────────────
  const startRec = async (contact) => {
    // 🔒 VÉRIFICATION SIM : bloquer si le contact n'appartient pas à la SIM active
    if (contact.sim !== activeSim) {
      notify(`🚫 Ce numéro est sur ${simLabel(contact.sim)} — seule ${simLabel(activeSim)} est surveillée`,'err')
      return
    }
    if (activeRec) return
    if (!permOk) { await askMic(); return }

    try {
      const s = stm.current || await navigator.mediaDevices.getUserMedia({audio:true})
      stm.current = s
      const mr = new MediaRecorder(s)
      mrRef.current = mr; chunks.current=[]; detRef.current=[]; txRef.current=''

      mr.ondataavailable = e => { if(e.data.size>0) chunks.current.push(e.data) }
      mr.onstop = () => {
        clearInterval(timer.current)
        const blob    = new Blob(chunks.current,{type:'audio/webm'})
        const url     = URL.createObjectURL(blob)
        const det     = detRef.current
        const kwIds   = det.map(k=>k.id)
        const dur     = elapsed
        const rec = {
          id:        Date.now(),
          url,
          contactId: contact.id,
          folder:    contact.label,
          color:     contact.color,
          num:       contact.num,
          simSlot:   contact.sim,
          simLabel:  simLabel(contact.sim),
          kwIds, keywords: det.map(k=>k.word),
          transcript: txRef.current,
          date:      fmtDate(),
          duration:  dur,
        }
        setRecordings(p=>[rec,...p])
        setContacts(p=>p.map(c=>c.id===contact.id?{...c,calls:c.calls+1}:c))
        setKeywords(p=>p.map(k=>kwIds.includes(k.id)?{...k,count:k.count+1}:k))
        notify(`💾 Sauvegardé — ${contact.label} (${simLabel(contact.sim)})`)
        setWave(false); setActiveRec(null); setElapsed(0); setTranscript(''); setDetKws([])
      }
      mr.start(500)

      setElapsed(0)
      timer.current = setInterval(()=>setElapsed(p=>p+1),1000)

      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SR) {
        const r = new SR()
        recog.current = r
        r.continuous=true; r.interimResults=true; r.lang='fr-FR'
        r.onresult = ev => {
          let fin='',int=''
          for(let i=ev.resultIndex;i<ev.results.length;i++){
            const t=ev.results[i][0].transcript
            ev.results[i].isFinal?(fin+=t+' '):(int+=t)
          }
          txRef.current+=fin
          setTranscript(txRef.current+int)
          const found=findKws(txRef.current+int)
          const news=found.filter(k=>!detRef.current.find(c=>c.id===k.id))
          if(news.length){
            detRef.current=[...detRef.current,...news]; setDetKws([...detRef.current])
            news.forEach(kw=>notify(`🎯 « ${kw.word} » détecté`,'kw'))
          }
        }
        r.onerror=()=>{}; r.start()
      }

      setActiveRec({contact,startedAt:Date.now()}); setWave(true)
      notify(`🔴 Écoute — ${contact.label}`)
    } catch { notify('Erreur démarrage','err') }
  }

  const stopRec = () => { recog.current?.stop(); mrRef.current?.stop() }

  // ── AI ────────────────────────────────────────────────────────────────────
  const analyze = async id => {
    const rec = recordings.find(r=>r.id===id)
    if (!rec||aiData[id]) return
    setAiData(p=>({...p,[id]:'loading'}))
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:800,
          messages:[{role:'user', content:
            `Analyse cet appel reçu sur ${rec.simLabel} de "${rec.folder}" (${rec.num}).
Réponds UNIQUEMENT en JSON valide sans backticks :
{"summary":"...","subject":"...","urgency":"faible|moyenne|haute","action":"...","sentiment":"positif|neutre|négatif"}
Transcript : "${rec.transcript||'Non disponible'}"`
          }]
        })
      })
      const d=await res.json()
      const txt=d.content?.[0]?.text||'{}'
      try{setAiData(p=>({...p,[id]:JSON.parse(txt.replace(/```json|```/g,'').trim())}))}
      catch{setAiData(p=>({...p,[id]:{summary:txt,subject:'—',urgency:'—',action:'—',sentiment:'—'}}))}
    } catch{setAiData(p=>({...p,[id]:{summary:'Erreur',subject:'—',urgency:'—',action:'—',sentiment:'—'}}))}
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const saveSims = () => {
    setSims({
      sim1:{...simDraft.sim1, configured:!!simDraft.sim1.num},
      sim2:{...simDraft.sim2, configured:!!simDraft.sim2.num},
    })
    setShowSimSetup(false)
    notify('✅ Configuration SIM sauvegardée')
  }

  const saveContact = () => {
    const num = contactDraft.num.trim()
    if (!num) return
    const fmt = num.startsWith('+')?num:'+'+num.replace(/\D/g,'')
    if (editContactId) {
      setContacts(p=>p.map(c=>c.id===editContactId?{...c,num:fmt,label:contactDraft.label||fmt,sim:contactDraft.sim}:c))
      setEditContactId(null); notify('Contact mis à jour')
    } else {
      setContacts(p=>[...p,{id:Date.now(),num:fmt,label:contactDraft.label||fmt,color:KW_COLORS[p.length%20],calls:0,sim:contactDraft.sim}])
      notify(`📱 Contact ajouté sur ${simLabel(contactDraft.sim)}`)
    }
    setContactDraft({num:'',label:'',sim:1}); setShowAddContact(false)
  }

  const deleteContact = id => { setContacts(p=>p.filter(c=>c.id!==id)); notify('Contact supprimé') }
  const deleteRec     = id => { setRecordings(p=>p.filter(r=>r.id!==id)); notify('Supprimé') }
  const saveKw = () => {
    if (!newKw.trim()||keywords.length>=20) return
    setKeywords(p=>[...p,{id:Date.now(),word:newKw.trim(),color:KW_COLORS[(p.length+5)%20],count:0}])
    notify(`Mot-clé « ${newKw.trim()} » ajouté`); setNewKw(''); setShowAddKw(false)
  }

  // ── Style helpers ─────────────────────────────────────────────────────────
  const card  = (ex={}) => ({background:C.surf,borderRadius:18,padding:'20px 22px',border:`1.5px solid ${C.border}`,boxShadow:'0 2px 14px rgba(100,160,0,0.07)',marginBottom:14,...ex})
  const btnP  = (ex={}) => ({display:'flex',alignItems:'center',gap:7,padding:'11px 22px',borderRadius:50,border:'none',background:`linear-gradient(135deg,${C.lime},${C.limeD})`,color:C.text,fontSize:13,fontWeight:900,boxShadow:`0 3px 14px ${C.lime}55`,...ex})
  const btnR  = (ex={}) => ({...btnP(ex),background:`linear-gradient(135deg,#ff6b6b,${C.red})`,color:'#fff',boxShadow:'0 3px 14px rgba(232,57,10,0.3)'})
  const btnG  = (ex={}) => ({display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:10,border:`1.5px solid ${C.border}`,background:C.surfAlt,color:C.mid,fontSize:12,fontWeight:700,...ex})
  const pill  = (color,ex={}) => ({display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:800,background:`${color}22`,border:`1.5px solid ${color}66`,color,...ex})
  const lbl   = (ex={}) => ({fontSize:10,fontWeight:800,color:C.soft,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6,...ex})

  const navBtn = (id,icon,txt) => (
    <button key={id} onClick={()=>setTab(id)} style={{
      display:'flex',alignItems:'center',gap:6,padding:'9px 17px',borderRadius:50,
      border:tab===id?`2px solid ${C.limeD}`:'2px solid transparent',
      background:tab===id?C.lime:'transparent',
      color:tab===id?C.text:C.mid, fontSize:12,fontWeight:800,
      boxShadow:tab===id?`0 3px 12px ${C.lime}55`:'none',transition:'all 0.18s',
    }}>
      <Ic n={icon} sz={13} c={tab===id?C.text:C.mid}/>{txt}
    </button>
  )

  const simConfigured = sims.sim1.configured || sims.sim2.configured
  const activeSimData = activeSim===1 ? sims.sim1 : activeSim===2 ? sims.sim2 : null

  const visRecs = folderFilter
    ? recordings.filter(r=>r.contactId===folderFilter)
    : recordings

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{background:C.bg,minHeight:'100vh',display:'flex',flexDirection:'column',fontFamily:"'Nunito','Segoe UI',sans-serif"}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"/>

      {/* TOAST */}
      {notif && (
        <div style={{position:'fixed',top:18,right:18,zIndex:1000,padding:'11px 20px',borderRadius:14,fontSize:13,fontWeight:800,
          background:notif.type==='err'?C.red:notif.type==='kw'?C.purple:C.limeD,
          color:notif.type==='err'||notif.type==='kw'?'#fff':C.text,
          boxShadow:'0 6px 22px rgba(0,0,0,0.15)',animation:'slideDown 0.25s ease',maxWidth:310,
        }}>{notif.msg}</div>
      )}

      {/* FLOATING RECORDING BAR */}
      {activeRec && (
        <div style={{
          position:'fixed',bottom:20,left:'50%',transform:'translateX(-50%)',zIndex:999,
          background:C.surf,border:`2px solid ${C.limeD}`,borderRadius:22,
          padding:'14px 20px',boxShadow:'0 10px 36px rgba(0,0,0,0.16)',
          display:'flex',alignItems:'center',gap:16,minWidth:340,maxWidth:'90vw',
          animation:'slideUp 0.3s ease',
        }}>
          <div style={{position:'relative',width:44,height:44,flexShrink:0}}>
            <div style={{position:'absolute',inset:0,borderRadius:'50%',background:`${C.lime}33`,animation:'ringPulse 1.4s infinite'}}/>
            <div style={{position:'absolute',inset:4,borderRadius:'50%',background:`${activeRec.contact.color}22`,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Ic n="mic" sz={20} c={activeRec.contact.color}/>
            </div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:900,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              {activeRec.contact.label}
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3,flexWrap:'wrap'}}>
              <span style={pill(simColor(activeRec.contact.sim),{fontSize:10})}>
                <SimIcon color={simColor(activeRec.contact.sim)} size={12} label={activeRec.contact.sim}/>{simLabel(activeRec.contact.sim)}
              </span>
              <span style={{fontSize:12,color:C.red,fontWeight:900}}>● {fmtDur(elapsed)}</span>
            </div>
            {detKws.length>0 && (
              <div style={{display:'flex',gap:4,marginTop:5,flexWrap:'wrap'}}>
                {detKws.map(k=><span key={k.id} style={pill(k.color,{fontSize:10,padding:'2px 7px'})}>{k.word}</span>)}
              </div>
            )}
          </div>
          <Wave on={wave} color={activeRec.contact.color}/>
          <button onClick={stopRec} style={btnR({padding:'10px 18px',fontSize:12})}>
            <Ic n="stop" sz={15}/> Terminer
          </button>
        </div>
      )}

      {/* HEADER */}
      <header style={{background:C.surf,borderBottom:`2px solid ${C.border}`,padding:'0 24px',height:72,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 20px rgba(100,160,0,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Logo size={42}/>
          <div>
            <div style={{fontSize:19,fontWeight:900,color:C.text,letterSpacing:-0.5,lineHeight:1.1}}>
              Call<span style={{color:C.limeD}}>Scan</span>
            </div>
            <div style={{fontSize:9,fontWeight:800,color:C.soft,letterSpacing:2,textTransform:'uppercase'}}>
              AI · DOUBLE SIM
            </div>
          </div>
        </div>

        <nav style={{display:'flex',gap:4,background:C.surfAlt,padding:'5px 5px',borderRadius:50,border:`1.5px solid ${C.border}`}}>
          {navBtn('home',    'home',   'Accueil')}
          {navBtn('contacts','phone',  'Contacts')}
          {navBtn('folders', 'folder', 'Dossiers')}
          {navBtn('settings','gear',   'Réglages')}
        </nav>

        {/* SIM active indicator */}
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {activeSim ? (
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:50,background:`${simColor(activeSim)}14`,border:`1.5px solid ${simColor(activeSim)}55`}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:simColor(activeSim),animation:activeRec?'pulse 1s infinite':'none'}}/>
              <span style={{fontSize:11,fontWeight:800,color:simColor(activeSim)}}>
                {simLabel(activeSim)} surveillée
              </span>
            </div>
          ) : (
            <button onClick={()=>{setShowSimSetup(true);setSimDraft({sim1:{...sims.sim1},sim2:{...sims.sim2}})}} style={btnP({padding:'8px 16px',fontSize:12})}>
              <Ic n="gear" sz={13} c={C.text}/> Configurer les SIM
            </button>
          )}
        </div>
      </header>

      <main style={{flex:1,padding:'22px 24px',maxWidth:960,margin:'0 auto',width:'100%'}}>

        {/* ════ ACCUEIL ════ */}
        {tab==='home' && (
          <>
            {/* ── SIM SELECTOR (bandeau principal) ── */}
            <div style={{...card(),padding:0,overflow:'hidden',marginBottom:18}}>
              <div style={{padding:'18px 22px',borderBottom:`1.5px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <div style={lbl()}>SIM SURVEILLÉE</div>
                  <div style={{fontWeight:900,fontSize:17}}>
                    {activeSim ? `${simLabel(activeSim)} est active — les appels ${activeSim===1?'SIM 2':'SIM 1'} sont ignorés` : 'Choisissez la SIM à surveiller'}
                  </div>
                </div>
                <button onClick={()=>{setShowSimSetup(true);setSimDraft({sim1:{...sims.sim1},sim2:{...sims.sim2}})}} style={btnG()}>
                  <Ic n="edit" sz={13}/> Configurer
                </button>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
                {[1,2].map(n => {
                  const simData = n===1 ? sims.sim1 : sims.sim2
                  const color   = simColor(n)
                  const isActive = activeSim === n
                  const isIgnored = activeSim !== null && activeSim !== n
                  return (
                    <button key={n} onClick={()=>setActiveSim(isActive?null:n)} style={{
                      display:'flex',flexDirection:'column',alignItems:'center',gap:10,
                      padding:'22px 16px', border:'none',
                      background: isActive ? `linear-gradient(135deg,${color}18,${color}08)` : isIgnored ? C.grayL : C.surf,
                      borderRight: n===1?`1.5px solid ${C.border}`:'none',
                      cursor:'pointer', transition:'all 0.25s', position:'relative',
                      opacity: isIgnored ? 0.55 : 1,
                    }}>
                      {/* Ignored overlay */}
                      {isIgnored && (
                        <div style={{position:'absolute',top:10,right:10}}>
                          <Ic n="block" sz={16} c={C.gray}/>
                        </div>
                      )}
                      {/* Active badge */}
                      {isActive && (
                        <div style={{position:'absolute',top:10,right:10,background:color,borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:800,color:'#fff',boxShadow:`0 2px 8px ${color}55`}}>
                          ACTIVE
                        </div>
                      )}

                      <SimIcon color={isIgnored ? C.gray : color} size={44} label={String(n)}/>

                      <div style={{textAlign:'center'}}>
                        <div style={{fontWeight:900,fontSize:15,color:isIgnored?C.gray:C.text}}>{simData.label||`SIM ${n}`}</div>
                        {simData.num
                          ? <div style={{fontSize:12,color:isIgnored?C.gray:color,fontWeight:700,marginTop:2}}>{simData.num}</div>
                          : <div style={{fontSize:11,color:C.gray,fontStyle:'italic',marginTop:2}}>Non configurée</div>
                        }
                        {simData.operator && <div style={{fontSize:11,color:C.soft,marginTop:2}}>{simData.operator}</div>}
                      </div>

                      <div style={{
                        padding:'6px 16px',borderRadius:50,fontSize:12,fontWeight:800,
                        background: isActive?color:isIgnored?C.grayB:`${color}18`,
                        color: isActive?'#fff':isIgnored?C.gray:color,
                        border:`1.5px solid ${isActive?color:isIgnored?C.grayB:color+'44'}`,
                        transition:'all 0.25s',
                      }}>
                        {isActive ? '✅ Surveiller cette SIM' : isIgnored ? '🚫 Ignorée' : 'Sélectionner'}
                      </div>
                    </button>
                  )
                })}
              </div>

              {activeSim && (
                <div style={{padding:'12px 22px',background:`${simColor(activeSim)}0c`,borderTop:`1.5px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
                  <Ic n="info" sz={14} c={simColor(activeSim)}/>
                  <span style={{fontSize:12,color:C.mid}}>
                    Seuls les appels entrants sur <strong style={{color:simColor(activeSim)}}>{simLabel(activeSim)}</strong> ({simNum(activeSim)||'numéro non configuré'}) peuvent être enregistrés.
                    Les appels sur <strong>{activeSim===1?simLabel(2):simLabel(1)}</strong> sont automatiquement ignorés.
                  </span>
                </div>
              )}
            </div>

            {/* ── AVERTISSEMENT si SIM non configurée ── */}
            {!simConfigured && (
              <div style={{...card(),background:`${C.orange}0e`,border:`1.5px solid ${C.orange}55`,display:'flex',alignItems:'center',gap:14}}>
                <Ic n="info" sz={22} c={C.orange}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14,color:C.text}}>Configurez vos SIM d'abord</div>
                  <div style={{fontSize:13,color:C.mid,marginTop:3}}>Entrez les numéros de vos deux SIM pour activer le filtrage automatique.</div>
                </div>
                <button style={btnP({padding:'9px 18px',fontSize:12})} onClick={()=>{setShowSimSetup(true);setSimDraft({sim1:{...sims.sim1},sim2:{...sims.sim2}})}}>
                  Configurer
                </button>
              </div>
            )}

            {/* ── QUICK DIAL — contacts de la SIM active ── */}
            {activeSim && (
              <div style={card()}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                  <div>
                    <div style={lbl()}>Contacts {simLabel(activeSim)}</div>
                    <div style={{fontWeight:900,fontSize:16}}>
                      {allowedContacts.length>0
                        ? 'Appuyez sur un contact pour enregistrer'
                        : `Aucun contact assigné à ${simLabel(activeSim)}`}
                    </div>
                  </div>
                  <button style={btnG()} onClick={()=>setTab('contacts')}><Ic n="gear" sz={13}/> Gérer</button>
                </div>

                {!permOk && (
                  <div style={{background:`${C.orange}14`,border:`1.5px solid ${C.orange}55`,borderRadius:12,padding:'11px 15px',marginBottom:14,display:'flex',alignItems:'center',gap:12}}>
                    <Ic n="mic" sz={17} c={C.orange}/>
                    <div style={{flex:1,fontSize:13,color:C.mid}}>Autorisez le microphone pour enregistrer.</div>
                    <button style={btnP({padding:'8px 16px',fontSize:12})} onClick={askMic}>Autoriser</button>
                  </div>
                )}

                {allowedContacts.length===0
                  ? <EmptyState emoji="📵" title={`Aucun contact sur ${simLabel(activeSim)}`} sub="Ajoutez des contacts et assignez-les à cette SIM dans l'onglet Contacts"/>
                  : (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
                      {allowedContacts.map(ct=>(
                        <ContactCard key={ct.id} contact={ct} simColor={simColor} simLabel={simLabel}
                          isActive={activeRec?.contact.id===ct.id} isRecording={!!activeRec}
                          onRecord={()=>startRec(ct)} pill={pill} btnP={btnP} btnR={btnR} C={C} Ic={Ic}/>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            {/* ── CONTACTS IGNORÉS (SIM non surveillée) ── */}
            {activeSim && contacts.filter(c=>c.sim!==activeSim).length>0 && (
              <div style={{...card(),background:C.grayL,border:`1.5px solid ${C.grayB}`,opacity:0.8}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <Ic n="block" sz={18} c={C.gray}/>
                  <div>
                    <div style={lbl({color:C.gray})}>Contacts ignorés — {simLabel(activeSim===1?2:1)}</div>
                    <div style={{fontSize:13,color:C.gray,fontWeight:700}}>Ces numéros ne peuvent pas être enregistrés (SIM non surveillée)</div>
                  </div>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {contacts.filter(c=>c.sim!==activeSim).map(ct=>(
                    <div key={ct.id} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 12px',borderRadius:10,background:'#fff',border:`1px solid ${C.grayB}`}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:C.gray}}/>
                      <span style={{fontSize:12,color:C.gray,fontWeight:700}}>{ct.label}</span>
                      <span style={{fontSize:10,color:C.gray}}>({ct.num})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TRANSCRIPTION EN DIRECT ── */}
            {activeRec && (
              <div style={{...card(),border:`1.5px solid ${C.limeL}`,background:`linear-gradient(135deg,${C.limeXL},#fff)`}}>
                <div style={lbl()}>Transcription — {activeRec.contact.label}</div>
                <div style={{background:'#fff',border:`1.5px solid ${C.border}`,borderRadius:12,padding:'12px 15px',fontSize:13,color:C.mid,lineHeight:1.9,minHeight:64,fontStyle:transcript?'normal':'italic'}}>
                  {transcript
                    ? <span dangerouslySetInnerHTML={{__html:keywords.reduce((t,kw)=>typeof t==='string'?t.replace(new RegExp(`(${kw.word})`,'gi'),`<mark style="background:${kw.color}33;color:${kw.color};border-radius:4px;padding:0 4px;font-weight:800">$1</mark>`):t,transcript)}}/>
                    : 'En attente de parole…'
                  }
                </div>
              </div>
            )}

            {/* ── RÉCENTS ── */}
            <div style={card()}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div>
                  <div style={lbl()}>Derniers enregistrements</div>
                  <div style={{fontWeight:900,fontSize:15}}>{recordings.length} appel{recordings.length!==1?'s':''}</div>
                </div>
                {recordings.length>0&&<button style={btnG()} onClick={()=>setTab('folders')}>Voir les dossiers →</button>}
              </div>
              {recordings.length===0
                ? <EmptyState emoji="📵" title="Aucun enregistrement" sub="Sélectionnez une SIM et appuyez sur Enregistrer"/>
                : recordings.slice(0,4).map(r=><RecRow key={r.id} rec={r} keywords={keywords} onDelete={deleteRec} onAnalyze={analyze} ai={aiData[r.id]} pill={pill} btnG={btnG} C={C} Ic={Ic} simColor={simColor}/>)
              }
            </div>
          </>
        )}

        {/* ════ CONTACTS ════ */}
        {tab==='contacts' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div>
                <div style={lbl()}>Gestion des contacts</div>
                <div style={{fontWeight:900,fontSize:22}}>Mes Contacts</div>
                <p style={{fontSize:13,color:C.mid,marginTop:4}}>
                  Assignez chaque contact à <strong>SIM 1</strong> ou <strong>SIM 2</strong>. Seuls les contacts de la SIM surveillée seront enregistrables.
                </p>
              </div>
              <button style={btnP()} onClick={()=>{setShowAddContact(true);setEditContactId(null);setContactDraft({num:'',label:'',sim:activeSim||1})}}>
                <Ic n="plus" sz={16} c={C.text}/> Ajouter
              </button>
            </div>

            {/* Form */}
            {showAddContact && (
              <div style={{...card(),border:`2px solid ${C.limeD}`,background:C.limeXL,marginBottom:18}}>
                <div style={lbl()}>{editContactId?'Modifier':'Nouveau contact'}</div>

                {/* SIM selector in form */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12,marginTop:8}}>
                  {[1,2].map(n=>(
                    <button key={n} type="button" onClick={()=>setContactDraft(p=>({...p,sim:n}))} style={{
                      display:'flex',alignItems:'center',gap:10,padding:'12px 16px',
                      borderRadius:12,cursor:'pointer',transition:'all 0.18s',border:'2px solid',
                      background:contactDraft.sim===n?`${simColor(n)}18`:C.surf,
                      borderColor:contactDraft.sim===n?simColor(n):C.border,
                      boxShadow:contactDraft.sim===n?`0 3px 12px ${simColor(n)}33`:'none',
                    }}>
                      <SimIcon color={simColor(n)} size={32} label={String(n)}/>
                      <div style={{textAlign:'left'}}>
                        <div style={{fontWeight:800,fontSize:13,color:contactDraft.sim===n?simColor(n):C.text}}>{simLabel(n)}</div>
                        <div style={{fontSize:11,color:C.soft}}>{simNum(n)||'Non configurée'}</div>
                      </div>
                      {contactDraft.sim===n && <Ic n="ok" sz={16} c={simColor(n)}/>}
                    </button>
                  ))}
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr auto auto',gap:10}}>
                  <input value={contactDraft.num} onChange={e=>setContactDraft(p=>({...p,num:e.target.value}))}
                    placeholder="+229 61 00 00 01"
                    style={{background:'#fff',border:`1.5px solid ${C.border}`,borderRadius:10,padding:'10px 13px',color:C.text,fontSize:14,fontWeight:700}}/>
                  <input value={contactDraft.label} onChange={e=>setContactDraft(p=>({...p,label:e.target.value}))}
                    onKeyDown={e=>e.key==='Enter'&&saveContact()}
                    placeholder="Nom du contact"
                    style={{background:'#fff',border:`1.5px solid ${C.border}`,borderRadius:10,padding:'10px 13px',color:C.text,fontSize:14,fontWeight:700}}
                    autoFocus/>
                  <button style={btnP({padding:'10px 18px',fontSize:12})} onClick={saveContact}>
                    <Ic n="ok" sz={15} c={C.text}/>{editContactId?'Mettre à jour':'Ajouter'}
                  </button>
                  <button style={btnG({padding:'10px 13px'})} onClick={()=>{setShowAddContact(false);setEditContactId(null)}}>
                    <Ic n="x" sz={15}/>
                  </button>
                </div>
              </div>
            )}

            {/* Contacts par SIM */}
            {[1,2].map(simN=>{
              const simContacts = contacts.filter(c=>c.sim===simN)
              const color = simColor(simN)
              const isWatched = activeSim===simN
              const isIgnored = activeSim!==null && activeSim!==simN
              return (
                <div key={simN} style={{...card(),border:`2px solid ${isWatched?color:isIgnored?C.grayB:C.border}`,opacity:isIgnored?0.7:1}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <SimIcon color={isIgnored?C.gray:color} size={36} label={String(simN)}/>
                      <div>
                        <div style={{fontWeight:900,fontSize:16,color:isIgnored?C.gray:C.text}}>{simLabel(simN)}</div>
                        <div style={{fontSize:12,color:isIgnored?C.gray:color,fontWeight:700}}>
                          {simNum(simN)||'Numéro non configuré'} · {simContacts.length} contact{simContacts.length!==1?'s':''}
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      {isWatched && <span style={pill(color,{fontSize:11})}>✅ Surveillée</span>}
                      {isIgnored && <span style={pill(C.gray,{fontSize:11})}>🚫 Ignorée</span>}
                      <button onClick={()=>setActiveSim(isWatched?null:simN)} style={btnG({borderColor:isIgnored?C.grayB:color+'44',color:isIgnored?C.gray:color})}>
                        {isWatched?'Désactiver':isIgnored?'Activer cette SIM':'Activer'}
                      </button>
                    </div>
                  </div>

                  {simContacts.length===0
                    ? <div style={{textAlign:'center',padding:'20px 0',color:C.soft,fontSize:13}}>Aucun contact sur cette SIM</div>
                    : (
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:10}}>
                        {simContacts.map(ct=>(
                          <div key={ct.id} style={{background:C.surfAlt,borderRadius:14,padding:'13px 15px',border:`1.5px solid ${ct.color}33`,display:'flex',alignItems:'center',gap:11}}>
                            <div style={{width:40,height:40,borderRadius:11,background:`${ct.color}22`,border:`2px solid ${ct.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:ct.color,flexShrink:0}}>
                              {ct.label.charAt(0).toUpperCase()}
                            </div>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:800,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ct.label}</div>
                              <div style={{fontSize:11,color:C.soft,fontWeight:700}}>{ct.num}</div>
                              <span style={pill(ct.color,{fontSize:9,marginTop:3,display:'inline-flex'})}>{ct.calls} appel{ct.calls!==1?'s':''}</span>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',gap:5}}>
                              <button onClick={()=>{setEditContactId(ct.id);setContactDraft({num:ct.num,label:ct.label,sim:ct.sim});setShowAddContact(true)}} style={btnG({padding:'5px 8px',border:'none',background:'transparent'})}>
                                <Ic n="edit" sz={13} c={C.mid}/>
                              </button>
                              <button onClick={()=>deleteContact(ct.id)} style={btnG({padding:'5px 8px',border:'none',background:'transparent'})}>
                                <Ic n="trash" sz={13} c={C.red}/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              )
            })}
          </>
        )}

        {/* ════ DOSSIERS ════ */}
        {tab==='folders' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div>
                <div style={lbl()}>Classement automatique</div>
                <div style={{fontWeight:900,fontSize:22}}>Dossiers d'enregistrements</div>
              </div>
              {folderFilter&&<button style={btnG()} onClick={()=>setFolderFilter(null)}><Ic n="x" sz={13}/> Tout afficher</button>}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:12,marginBottom:20}}>
              {contacts.map(ct=>{
                const n=recordings.filter(r=>r.contactId===ct.id).length
                const sel=folderFilter===ct.id
                const isIgnored=activeSim!==null&&ct.sim!==activeSim
                return(
                  <div key={ct.id} onClick={()=>setFolderFilter(sel?null:ct.id)} style={{background:sel?`${ct.color}18`:C.surf,border:`2px solid ${sel?ct.color:C.border}`,borderRadius:16,padding:'16px 14px',cursor:'pointer',transition:'all 0.18s',boxShadow:sel?`0 4px 18px ${ct.color}33`:'none',opacity:isIgnored?0.55:1,position:'relative'}}>
                    {isIgnored&&<div style={{position:'absolute',top:8,right:8}}><Ic n="block" sz={13} c={C.gray}/></div>}
                    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" style={{marginBottom:8}}>
                      <path d="M2 6C2 4.9 2.9 4 4 4h8l3 4h13a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" fill={`${isIgnored?C.gray:ct.color}28`} stroke={isIgnored?C.gray:ct.color} strokeWidth="1.6"/>
                    </svg>
                    <div style={{fontWeight:800,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ct.label}</div>
                    <div style={{fontSize:11,color:isIgnored?C.gray:ct.color,fontWeight:800,marginTop:2}}>{n} appel{n!==1?'s':''}</div>
                    <div style={pill(isIgnored?C.gray:simColor(ct.sim),{fontSize:9,marginTop:5,padding:'1px 7px'})}>SIM {ct.sim}</div>
                  </div>
                )
              })}
            </div>
            <div style={card()}>
              <div style={{...lbl(),marginBottom:14}}>
                {folderFilter?`Dossier : ${contacts.find(c=>c.id===folderFilter)?.label}`:'Tous les appels'} — {visRecs.length} enregistrement(s)
              </div>
              {visRecs.length===0
                ? <EmptyState emoji="📂" title="Aucun enregistrement"/>
                : visRecs.map(r=><RecRow key={r.id} rec={r} keywords={keywords} onDelete={deleteRec} onAnalyze={analyze} ai={aiData[r.id]} pill={pill} btnG={btnG} C={C} Ic={Ic} simColor={simColor}/>)
              }
            </div>
          </>
        )}

        {/* ════ RÉGLAGES ════ */}
        {tab==='settings' && (
          <>
            <div style={lbl()}>Configuration</div>
            <div style={{fontWeight:900,fontSize:22,marginBottom:20}}>Réglages</div>

            {/* SIM config section */}
            <div style={{...card(),border:`1.5px solid ${C.limeL}`,background:C.limeXL}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div>
                  <div style={lbl()}>Double SIM Android</div>
                  <div style={{fontWeight:900,fontSize:16}}>Configuration des SIM</div>
                </div>
                <button style={btnP({padding:'9px 18px',fontSize:12})} onClick={()=>{setShowSimSetup(true);setSimDraft({sim1:{...sims.sim1},sim2:{...sims.sim2}})}}>
                  <Ic n="edit" sz={14} c={C.text}/> Modifier
                </button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {[1,2].map(n=>{
                  const d=n===1?sims.sim1:sims.sim2; const color=simColor(n)
                  return(
                    <div key={n} style={{background:'#fff',borderRadius:12,padding:'14px',border:`1.5px solid ${color}44`}}>
                      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                        <SimIcon color={color} size={30} label={String(n)}/>
                        <div style={{fontWeight:800,color:C.text}}>{d.label||`SIM ${n}`}</div>
                        {activeSim===n&&<span style={pill(color,{fontSize:10})}>Active</span>}
                      </div>
                      <div style={{fontSize:12,color:C.mid}}><strong>Numéro :</strong> {d.num||<em style={{color:C.soft}}>Non défini</em>}</div>
                      {d.operator&&<div style={{fontSize:12,color:C.mid,marginTop:3}}><strong>Opérateur :</strong> {d.operator}</div>}
                      <div style={{fontSize:11,color:d.configured?C.limeD:C.orange,fontWeight:800,marginTop:6}}>
                        {d.configured?'✅ Configurée':'⚠️ Non configurée'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Keywords */}
            <div style={card()}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div>
                  <div style={lbl()}>Détection automatique</div>
                  <div style={{fontWeight:900,fontSize:16}}>Mots-clés ({keywords.length}/20)</div>
                </div>
                {keywords.length<20&&<button style={btnP({padding:'9px 18px',fontSize:12})} onClick={()=>setShowAddKw(true)}><Ic n="plus" sz={15} c={C.text}/> Ajouter</button>}
              </div>
              {showAddKw&&(
                <div style={{display:'flex',gap:10,marginBottom:14}}>
                  <input value={newKw} onChange={e=>setNewKw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&saveKw()}
                    placeholder="Ex: urgent, livraison, paiement…"
                    style={{flex:1,background:C.surfAlt,border:`1.5px solid ${C.border}`,borderRadius:10,padding:'10px 13px',color:C.text,fontSize:14,fontWeight:700}}
                    autoFocus/>
                  <button style={btnP({padding:'10px 18px',fontSize:12})} onClick={saveKw}><Ic n="ok" sz={15} c={C.text}/> OK</button>
                  <button style={btnG({padding:'10px 13px'})} onClick={()=>{setShowAddKw(false);setNewKw('')}}><Ic n="x" sz={15}/></button>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
                {keywords.map((kw,i)=>(
                  <div key={kw.id} style={{background:C.surfAlt,borderRadius:12,padding:'12px 14px',border:`1.5px solid ${kw.color}44`}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:10,height:10,borderRadius:'50%',background:kw.color}}/>
                        <span style={{fontWeight:800,fontSize:14}}>{kw.word}</span>
                      </div>
                      <button onClick={()=>{setKeywords(p=>p.filter(k=>k.id!==kw.id));notify('Supprimé')}} style={{background:'none',border:'none',cursor:'pointer',padding:2}}>
                        <Ic n="x" sz={12} c={C.red}/>
                      </button>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={pill(kw.color,{fontSize:10})}>{kw.count} détection{kw.count!==1?'s':''}</span>
                      <span style={{fontSize:10,color:C.soft,fontWeight:700}}>#{i+1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── MODALE CONFIGURATION SIM ─────────────────────────────────────── */}
      {showSimSetup && (
        <div style={{position:'fixed',inset:0,zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.45)',backdropFilter:'blur(4px)'}} onClick={()=>setShowSimSetup(false)}>
          <div style={{background:C.surf,borderRadius:24,padding:'28px 28px',width:'min(560px,94vw)',boxShadow:'0 24px 60px rgba(0,0,0,0.22)',animation:'popIn 0.25s ease'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
              <div>
                <div style={lbl()}>Android Dual SIM</div>
                <div style={{fontWeight:900,fontSize:20}}>Configurer vos SIM</div>
              </div>
              <button onClick={()=>setShowSimSetup(false)} style={btnG({padding:'8px 10px',border:'none',background:C.surfAlt})}>
                <Ic n="x" sz={16}/>
              </button>
            </div>

            {[1,2].map(n=>{
              const key  = `sim${n}`
              const color = simColor(n)
              return(
                <div key={n} style={{background:`${color}0a`,borderRadius:16,padding:'18px',border:`1.5px solid ${color}33`,marginBottom:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                    <SimIcon color={color} size={32} label={String(n)}/>
                    <div style={{fontWeight:900,fontSize:15,color}}>SIM {n}</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                    <div>
                      <div style={{...lbl(),marginBottom:4}}>Numéro de téléphone</div>
                      <input value={simDraft[key].num} onChange={e=>setSimDraft(p=>({...p,[key]:{...p[key],num:e.target.value}}))}
                        placeholder={`+229 6${n} 00 00 0${n}`}
                        style={{width:'100%',background:'#fff',border:`1.5px solid ${color}44`,borderRadius:10,padding:'9px 12px',color:C.text,fontSize:14,fontWeight:700}}/>
                    </div>
                    <div>
                      <div style={{...lbl(),marginBottom:4}}>Label (optionnel)</div>
                      <input value={simDraft[key].label} onChange={e=>setSimDraft(p=>({...p,[key]:{...p[key],label:e.target.value}}))}
                        placeholder={`SIM ${n} Pro`}
                        style={{width:'100%',background:'#fff',border:`1.5px solid ${color}44`,borderRadius:10,padding:'9px 12px',color:C.text,fontSize:14,fontWeight:700}}/>
                    </div>
                  </div>
                  <div>
                    <div style={{...lbl(),marginBottom:4}}>Opérateur (optionnel)</div>
                    <input value={simDraft[key].operator} onChange={e=>setSimDraft(p=>({...p,[key]:{...p[key],operator:e.target.value}}))}
                      placeholder="MTN, Moov, Orange…"
                      style={{width:'100%',background:'#fff',border:`1.5px solid ${color}44`,borderRadius:10,padding:'9px 12px',color:C.text,fontSize:14,fontWeight:700}}/>
                  </div>
                </div>
              )
            })}

            <div style={{display:'flex',gap:10,marginTop:8}}>
              <button style={btnP({flex:1,justifyContent:'center',padding:'13px'})} onClick={saveSims}>
                <Ic n="ok" sz={16} c={C.text}/> Enregistrer la configuration
              </button>
              <button style={btnG({padding:'13px 18px'})} onClick={()=>setShowSimSetup(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── CONTACT CARD ─────────────────────────────────────────────────────────────
function ContactCard({contact:ct, simColor, simLabel, isActive, isRecording, onRecord, pill, btnP, btnR, C, Ic}) {
  return (
    <div style={{background:isActive?`linear-gradient(135deg,${C.limeXL},#e8f9c0)`:C.surfAlt,border:`2px solid ${isActive?C.limeD:ct.color+'44'}`,borderRadius:16,padding:'15px',boxShadow:isActive?`0 4px 20px ${C.lime}44`:'none',transition:'all 0.3s'}}>
      <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:11}}>
        <div style={{width:40,height:40,borderRadius:11,background:`${ct.color}22`,border:`2px solid ${ct.color}55`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:17,color:ct.color,flexShrink:0}}>
          {ct.label.charAt(0).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:900,fontSize:14,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ct.label}</div>
          <div style={{fontSize:11,color:C.soft,fontWeight:700}}>{ct.num}</div>
        </div>
        <span style={pill(simColor(ct.sim),{fontSize:9,padding:'2px 7px'})}>SIM {ct.sim}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={pill(ct.color,{fontSize:10})}>{ct.calls} appel{ct.calls!==1?'s':''}</span>
        <button onClick={onRecord} disabled={isRecording&&!isActive} style={{
          ...(isActive?btnR({padding:'8px 14px',fontSize:12}):btnP({padding:'8px 14px',fontSize:12})),
          opacity:isRecording&&!isActive?.4:1, cursor:isRecording&&!isActive?'not-allowed':'pointer',
        }}>
          <Ic n={isActive?'stop':'mic'} sz={13} c={isActive?'#fff':C.text}/>
          {isActive?'En cours…':'Enregistrer'}
        </button>
      </div>
    </div>
  )
}

// ─── RECORDING ROW ────────────────────────────────────────────────────────────
function RecRow({rec, keywords, onDelete, onAnalyze, ai, pill, btnG, C, Ic, simColor}) {
  const [open, setOpen] = useState(false)
  const kws  = keywords.filter(k=>rec.kwIds?.includes(k.id))
  const sColor = simColor ? simColor(rec.simSlot) : C.blue
  const urgC = {faible:C.limeD, moyenne:C.orange, haute:C.red}
  const senC = {positif:C.limeD, neutre:C.orange, négatif:C.red}

  return (
    <div style={{background:C.surfAlt,border:`1.5px solid ${C.border}`,borderRadius:14,padding:'12px 15px',marginBottom:9}}>
      <div style={{display:'flex',alignItems:'center',gap:11}}>
        <div style={{width:43,height:43,borderRadius:12,background:`${rec.color||C.soft}1e`,border:`2px solid ${rec.color||C.soft}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <Ic n="phone" sz={18} c={rec.color||C.soft}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
            <span style={{fontWeight:900,fontSize:13}}>{rec.folder}</span>
            {rec.simLabel&&<span style={pill(sColor,{fontSize:9,padding:'2px 7px'})}>{rec.simLabel}</span>}
            {kws.map(k=><span key={k.id} style={pill(k.color,{fontSize:9,padding:'2px 7px'})}>{k.word}</span>)}
          </div>
          <div style={{fontSize:11,color:C.soft,fontWeight:700,marginTop:2}}>
            {rec.date}{rec.duration?` · ${fmtDur(rec.duration)}`:''}
          </div>
        </div>
        <div style={{display:'flex',gap:6}}>
          {rec.url&&<a href={rec.url} download={`appel-${rec.folder}-${rec.id}.webm`} style={{...btnG(),textDecoration:'none'}}><Ic n="dl" sz={13}/></a>}
          <button style={btnG()} onClick={()=>{setOpen(!open);if(!open)onAnalyze(rec.id)}}><Ic n="star" sz={13}/> IA</button>
          <button style={{...btnG(),borderColor:'#fcc',color:C.red}} onClick={()=>onDelete(rec.id)}><Ic n="trash" sz={13} c={C.red}/></button>
        </div>
      </div>
      {open&&(
        <div style={{marginTop:12,animation:'fadeIn 0.2s ease'}}>
          {rec.transcript
            ?<div style={{background:'#fff',border:`1.5px solid ${C.border}`,borderRadius:10,padding:'10px 13px',fontSize:12,color:C.mid,lineHeight:1.8,marginBottom:10}}>{rec.transcript}</div>
            :<div style={{fontSize:12,color:C.soft,fontStyle:'italic',marginBottom:10}}>Aucune transcription disponible</div>
          }
          {ai==='loading'&&<div style={{textAlign:'center',padding:'14px 0',color:C.soft,fontSize:13}}>✨ Analyse en cours…</div>}
          {ai&&ai!=='loading'&&(
            <div style={{background:'#f3f0ff',border:'1.5px solid #c4b5fd',borderRadius:12,padding:'13px 16px',fontSize:13}}>
              <div style={{color:C.purple,fontWeight:900,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                <Ic n="star" sz={13} c={C.purple}/> Analyse IA
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><span style={{fontWeight:800,color:C.mid}}>Résumé :</span><br/><span>{ai.summary}</span></div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <div><span style={{fontWeight:800,color:C.mid}}>Sujet :</span> {ai.subject}</div>
                  <div><span style={{fontWeight:800,color:C.mid}}>Urgence :</span> <strong style={{color:urgC[ai.urgency]||C.text}}>{ai.urgency}</strong></div>
                  {ai.sentiment&&<div><span style={{fontWeight:800,color:C.mid}}>Tonalité :</span> <strong style={{color:senC[ai.sentiment]||C.text}}>{ai.sentiment}</strong></div>}
                  {ai.action&&<div><span style={{fontWeight:800,color:C.mid}}>Action :</span> {ai.action}</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const fmtDur = s => s ? `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}` : ''

const EmptyState = ({emoji,title,sub}) => (
  <div style={{textAlign:'center',padding:'36px 0',color:'#8aaa50'}}>
    <div style={{fontSize:48}}>{emoji}</div>
    <p style={{marginTop:10,fontWeight:800,fontSize:14,color:'#4a6020'}}>{title}</p>
    {sub&&<p style={{fontSize:12,marginTop:5}}>{sub}</p>}
  </div>
)
