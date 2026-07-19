'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { LogOut, Plus, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/authContext'
import { ngoConfig } from '@/lib/ngoConfig'
import {
  centralUmcProject,
  createId,
  getAdminRole,
  loadAdminData,
  saveParticipantAndAttach,
  saveRecord,
  seedArchitectureAdmin,
  type AdminProject,
  type AreaSource,
  type Participant,
  type ParticipantSource,
  type RoleTemplate,
  type SiteDirectoryEntry,
} from '@/lib/architectureAdmin'

type Tab = 'projects' | 'participants' | 'areas' | 'sites'
type Data = Awaited<ReturnType<typeof loadAdminData>>

const emptyData: Data = { projects: [centralUmcProject], participants: [], areas: [], sites: [], milestones: [] }

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{children}</label>
}

export default function AdminClient() {
  const { user, loading: authLoading, signIn, signOut } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  const [data, setData] = useState<Data>(emptyData)
  const [tab, setTab] = useState<Tab>('projects')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function refresh() {
    setData(await loadAdminData())
  }

  useEffect(() => {
    if (!user) {
      setRole(null)
      return
    }
    void Promise.all([getAdminRole(user.uid), loadAdminData()]).then(([nextRole, nextData]) => {
      setRole(nextRole)
      setData(nextData)
    })
  }, [user])

  if (authLoading) return <Gate title="Checking access…" />
  if (!user) return <Gate title="Architecture admin" detail="Sign in with an approved BEAM administrator account." action={() => void signIn()} />
  if (!role) {
    return (
      <Gate
        title="Admin access required"
        detail={`Signed in as ${user.email}. An existing beam_admin or partner_admin must update your architectureMemberships record.`}
        action={() => void signOut()}
        actionLabel="Sign out"
      />
    )
  }

  async function initialize() {
    setBusy(true)
    try {
      await seedArchitectureAdmin()
      await refresh()
      setMessage('Central UMC, role templates, and the site directory are now stored in Firestore.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Initialization failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-black/10 bg-[var(--ink)] text-[var(--chalk)]">
        <div className="site-frame flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">BEAM Architecture</p>
            <h1 className="mt-2 font-display text-4xl font-semibold">Project administration</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-white/15 px-4 py-2"><ShieldCheck className="mr-2 inline h-4 w-4" />{role}</span>
            <Link className="rounded-full border border-white/15 px-4 py-2" href="/">Public site</Link>
            <button className="rounded-full border border-white/15 px-4 py-2" onClick={() => void signOut()}><LogOut className="mr-2 inline h-4 w-4" />Sign out</button>
          </div>
        </div>
      </header>
      <div className="site-frame py-8">
        <div className="flex flex-wrap gap-2">
          {(['projects', 'participants', 'areas', 'sites'] as Tab[]).map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`nav-pill capitalize ${tab === item ? 'nav-pill-active' : ''}`}>{item === 'sites' ? 'Site Directory' : item}</button>
          ))}
        </div>
        {message ? <p className="mt-5 rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-sm">{message}</p> : null}
        <section className="mt-7">
          {tab === 'projects' ? <Projects data={data} refresh={refresh} setMessage={setMessage} initialize={initialize} busy={busy} /> : null}
          {tab === 'participants' ? <Participants data={data} refresh={refresh} setMessage={setMessage} /> : null}
          {tab === 'areas' ? <Areas data={data} refresh={refresh} setMessage={setMessage} /> : null}
          {tab === 'sites' ? <Sites data={data} refresh={refresh} setMessage={setMessage} /> : null}
        </section>
      </div>
    </main>
  )
}

function Gate({ title, detail, action, actionLabel = 'Sign in with Google' }: { title: string; detail?: string; action?: () => void; actionLabel?: string }) {
  return <main className="grid min-h-screen place-items-center p-6"><div className="panel max-w-xl text-center"><p className="eyebrow">Protected workspace</p><h1 className="mt-4 font-display text-5xl font-semibold">{title}</h1>{detail ? <p className="body-copy mt-5">{detail}</p> : null}{action ? <button className="cta-primary mt-7" onClick={action}>{actionLabel}</button> : null}</div></main>
}

function Projects({ data, refresh, setMessage, initialize, busy }: { data: Data; refresh: () => Promise<void>; setMessage: (s: string) => void; initialize: () => Promise<void>; busy: boolean }) {
  const [selectedId, setSelectedId] = useState(data.projects[0]?.id ?? '')
  const selected = data.projects.find((item) => item.id === selectedId) ?? data.projects[0]
  const [draft, setDraft] = useState<AdminProject>(selected ?? centralUmcProject)
  useEffect(() => { if (selected) setDraft(selected) }, [selected])
  async function submit(event: FormEvent) {
    event.preventDefault()
    try { await saveRecord(ngoConfig.firestoreCollections.projects, draft); await refresh(); setMessage(`${draft.name} saved.`) } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed.') }
  }
  function addProject() {
    const id = createId('new-project')
    setSelectedId(id)
    setDraft({ ...centralUmcProject, id, slug: id, name: 'New project', siteLocation: '', partnerOrg: '', status: 'concept', notes: '', roleSlots: [], cohortId: `architecture-${id}` })
  }
  function addSlot() {
    const role = data.areas[0]
    if (!role) return setMessage('Add or initialize Areas first.')
    setDraft({ ...draft, roleSlots: [...draft.roleSlots, { id: createId(role.label), roleId: role.id, roleLabel: role.label, areaSource: role.areaSource, slotsNeeded: 1, fillType: 'subscription_covered', noRentCovenant: false, filledBy: [] }] })
  }
  async function addMilestone() {
    const milestone = {
      id: createId(`${draft.id}-milestone`),
      projectId: draft.id,
      phase: draft.phase,
      description: 'New milestone',
      targetDate: '',
      status: 'not_started' as const,
    }
    try {
      await saveRecord(ngoConfig.firestoreCollections.milestones, milestone)
      await refresh()
      setMessage('Milestone added. Edit its details in Firestore or extend the milestone editor as the workflow matures.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Milestone save failed.')
    }
  }
  return <div className="grid gap-6 xl:grid-cols-[18rem_1fr]">
    <aside className="panel"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Projects</h2><button onClick={addProject} aria-label="Add project"><Plus /></button></div><div className="mt-5 grid gap-2">{data.projects.map((project) => <button key={project.id} onClick={() => setSelectedId(project.id)} className={`rounded-xl px-3 py-3 text-left text-sm ${selectedId === project.id ? 'bg-[var(--ink)] text-white' : 'bg-black/5'}`}>{project.name}<span className="mt-1 block text-xs opacity-65">{project.phase}</span></button>)}</div><button disabled={busy} onClick={() => void initialize()} className="cta-secondary mt-6 w-full">Initialize seed data</button></aside>
    <form className="panel" onSubmit={submit}><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="panel-label">Project record</p><h2 className="mt-2 text-3xl font-semibold">{draft.name}</h2></div><button className="cta-primary" type="submit">Save project</button></div>
      <div className="mt-7 grid gap-5 md:grid-cols-2"><Field label="Name" value={draft.name} onChange={(name) => setDraft({...draft,name})}/><Field label="City / state" value={draft.siteLocation} onChange={(siteLocation) => setDraft({...draft,siteLocation})}/><Select label="Status" value={draft.status} options={['concept','active_pilot','proposal_packet','archived']} onChange={(status) => setDraft({...draft,status: status as AdminProject['status']})}/><Select label="Project type" value={draft.projectType} options={['adaptive_reuse','ecological_residential','institutional_pilot','community_greenhouse']} onChange={(projectType) => setDraft({...draft,projectType: projectType as AdminProject['projectType']})}/><Select label="Phase" value={draft.phase} options={['Discovery','Zoning & Variances','Active Build']} onChange={(phase) => setDraft({...draft,phase: phase as AdminProject['phase']})}/><Field label="Partner organization" value={draft.partnerOrg} onChange={(partnerOrg) => setDraft({...draft,partnerOrg})}/><Field label="Zoning classification" value={draft.zoningClassification} onChange={(zoningClassification) => setDraft({...draft,zoningClassification})}/><Field label="Asset links (comma-separated URLs)" value={draft.assetLinks.join(', ')} onChange={(value) => setDraft({...draft,assetLinks:value.split(',').map(x=>x.trim()).filter(Boolean)})}/></div>
      <div className="mt-5"><Label>Notes</Label><textarea className="field-textarea mt-2" value={draft.notes} onChange={(e)=>setDraft({...draft,notes:e.target.value})}/></div>
      <div className="mt-7 grid gap-5 md:grid-cols-2"><Field label="Variance types (comma-separated)" value={draft.varianceType.join(', ')} onChange={(value)=>setDraft({...draft,varianceType:value.split(',').map(x=>x.trim()).filter(Boolean)})}/><Field label="Simulated rent" type="number" value={String(draft.financials.operationalCovenant.rentAmountSimulated)} onChange={(value)=>setDraft({...draft,financials:{...draft.financials,operationalCovenant:{...draft.financials.operationalCovenant,rentAmountSimulated:Number(value)||0}}})}/><Field label="Covenant deliverables (comma-separated)" value={draft.financials.operationalCovenant.requiredDeliverables.join(', ')} onChange={(value)=>setDraft({...draft,financials:{...draft.financials,operationalCovenant:{...draft.financials.operationalCovenant,requiredDeliverables:value.split(',').map(x=>x.trim()).filter(Boolean)}}})}/><Field label="External monetization gate" value={draft.financials.operationalCovenant.externalMonetizationGate} onChange={(externalMonetizationGate)=>setDraft({...draft,financials:{...draft.financials,operationalCovenant:{...draft.financials.operationalCovenant,externalMonetizationGate}}})}/></div>
      <div className="mt-8 border-t border-black/10 pt-7"><div className="flex items-center justify-between"><div><p className="panel-label">Role slots</p><p className="mt-2 text-sm text-[var(--ink-soft)]">Compensation and occupancy covenants remain separate axes.</p></div><button className="cta-secondary" type="button" onClick={addSlot}><Plus className="mr-2 inline h-4 w-4"/>Add slot</button></div><div className="mt-5 grid gap-4">{draft.roleSlots.map((slot,index)=><div key={slot.id} className="rounded-2xl border border-black/10 p-4"><div className="grid gap-4 md:grid-cols-4"><Select label="Role" value={slot.roleId} options={data.areas.map(x=>x.id)} optionLabels={Object.fromEntries(data.areas.map(x=>[x.id,x.label]))} onChange={(roleId)=>{const role=data.areas.find(x=>x.id===roleId); if(!role)return; const slots=[...draft.roleSlots];slots[index]={...slot,roleId,roleLabel:role.label,areaSource:role.areaSource};setDraft({...draft,roleSlots:slots})}}/><Field label="Slots needed" type="number" value={String(slot.slotsNeeded)} onChange={(v)=>{const slots=[...draft.roleSlots];slots[index]={...slot,slotsNeeded:Math.max(1,Number(v))};setDraft({...draft,roleSlots:slots})}}/><Select label="Fill type" value={slot.fillType} options={['subscription_covered','sponsor_participant','sweat_equity']} onChange={(fillType)=>{const slots=[...draft.roleSlots];slots[index]={...slot,fillType:fillType as typeof slot.fillType};setDraft({...draft,roleSlots:slots})}}/><label className="flex items-end gap-2 pb-3 text-sm"><input type="checkbox" checked={slot.noRentCovenant} onChange={(e)=>{const slots=[...draft.roleSlots];slots[index]={...slot,noRentCovenant:e.target.checked};setDraft({...draft,roleSlots:slots})}}/> No-rent covenant</label></div></div>)}</div></div>
      <div className="mt-8 border-t border-black/10 pt-7"><div className="flex items-center justify-between"><div><p className="panel-label">Milestones</p><p className="mt-2 text-sm text-[var(--ink-soft)]">Stored independently and linked by project ID.</p></div><button className="cta-secondary" type="button" onClick={()=>void addMilestone()}><Plus className="mr-2 inline h-4 w-4"/>Add milestone</button></div><div className="mt-4 grid gap-2">{data.milestones.filter(x=>x.projectId===draft.id).map(item=><div key={item.id} className="rounded-xl bg-black/5 px-4 py-3 text-sm"><span className="font-semibold">{item.phase}</span> · {item.description} · {item.status}</div>)}</div></div>
    </form></div>
}

function Participants({ data, refresh, setMessage }: { data: Data; refresh: () => Promise<void>; setMessage: (s:string)=>void }) {
  const [projectId,setProjectId]=useState(data.projects[0]?.id ?? '')
  const project=data.projects.find(x=>x.id===projectId)
  const [slotId,setSlotId]=useState(project?.roleSlots[0]?.id ?? '')
  const [form,setForm]=useState({name:'',email:'',role:'',status:'active',headline:'',notes:'',sourceSite:'architecture' as ParticipantSource,organizationId:''})
  useEffect(()=>setSlotId(project?.roleSlots[0]?.id ?? ''),[project])
  async function submit(e:FormEvent){e.preventDefault();if(!project)return;const participant:Participant={...form,id:createId(form.email),organizationId:form.organizationId||undefined};try{await saveParticipantAndAttach(participant,project,slotId);await refresh();setMessage(`${form.name} added to ${project.name} and written through to canonical identity collections.`);setForm({...form,name:'',email:'',headline:'',notes:''})}catch(error){setMessage(error instanceof Error?error.message:'Save failed.')}}
  return <div className="grid gap-6 lg:grid-cols-[1fr_1fr]"><form className="panel" onSubmit={submit}><p className="panel-label">Standalone participant</p><h2 className="mt-3 text-3xl font-semibold">Add and attach</h2><div className="mt-6 grid gap-4 md:grid-cols-2"><Field label="Name" value={form.name} required onChange={(name)=>setForm({...form,name})}/><Field label="Email" type="email" value={form.email} required onChange={(email)=>setForm({...form,email})}/><Field label="Role" value={form.role} required onChange={(role)=>setForm({...form,role})}/><Field label="Status" value={form.status} onChange={(status)=>setForm({...form,status})}/><Field label="Headline" value={form.headline} onChange={(headline)=>setForm({...form,headline})}/><Select label="Source site" value={form.sourceSite} options={['architecture','orchestra','forge','law']} onChange={(sourceSite)=>setForm({...form,sourceSite:sourceSite as ParticipantSource})}/><Field label="Organization ID (optional)" value={form.organizationId} onChange={(organizationId)=>setForm({...form,organizationId})}/><Select label="Project" value={projectId} options={data.projects.map(x=>x.id)} optionLabels={Object.fromEntries(data.projects.map(x=>[x.id,x.name]))} onChange={setProjectId}/><Select label="Role slot" value={slotId} options={project?.roleSlots.map(x=>x.id)??[]} optionLabels={Object.fromEntries(project?.roleSlots.map(x=>[x.id,x.roleLabel])??[])} onChange={setSlotId}/></div><div className="mt-4"><Label>Notes</Label><textarea className="field-textarea mt-2" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})}/></div><button className="cta-primary mt-6">Add participant</button></form><div className="panel"><p className="panel-label">Directory</p><div className="mt-5 grid gap-3">{data.participants.length?data.participants.map(p=><div className="rounded-2xl border border-black/10 p-4" key={p.id}><p className="font-semibold">{p.name}</p><p className="text-sm text-[var(--ink-soft)]">{p.role} · {p.sourceSite} · {p.email}</p></div>):<p className="body-copy">No stored participants yet. Central UMC role slots are intentionally unfilled until staffing is confirmed.</p>}</div></div></div>
}

function Areas({ data,refresh,setMessage }:{data:Data;refresh:()=>Promise<void>;setMessage:(s:string)=>void}){const [label,setLabel]=useState('');const [areaSource,setAreaSource]=useState<AreaSource>('design');async function submit(e:FormEvent){e.preventDefault();const area:RoleTemplate={id:createId(label),label,areaSource};try{await saveRecord(ngoConfig.firestoreCollections.areas,area);await refresh();setLabel('');setMessage('Role template added.')}catch(error){setMessage(error instanceof Error?error.message:'Save failed.')}}return <div className="grid gap-6 lg:grid-cols-[22rem_1fr]"><form className="panel" onSubmit={submit}><p className="panel-label">Add role</p><div className="mt-5 grid gap-4"><Field label="Role label" value={label} required onChange={setLabel}/><Select label="Area" value={areaSource} options={['design','regulatory','operations','custom']} onChange={(v)=>setAreaSource(v as AreaSource)}/></div><button className="cta-primary mt-6">Add role</button></form><div className="panel"><div className="grid gap-3 md:grid-cols-2">{data.areas.map(area=><div key={area.id} className="rounded-2xl border border-black/10 p-4"><p className="font-semibold">{area.label}</p><p className="mt-1 text-xs uppercase tracking-wider text-[var(--ink-soft)]">{area.areaSource}</p></div>)}</div></div></div>}

function Sites({data,refresh,setMessage}:{data:Data;refresh:()=>Promise<void>;setMessage:(s:string)=>void}){const [form,setForm]=useState({name:'',location:'',status:'prospect' as SiteDirectoryEntry['status']});async function submit(e:FormEvent){e.preventDefault();const site:SiteDirectoryEntry={...form,id:createId(form.name)};try{await saveRecord(ngoConfig.firestoreCollections.sites,site);await refresh();setForm({...form,name:'',location:''});setMessage('Site added.')}catch(error){setMessage(error instanceof Error?error.message:'Save failed.')}}return <div className="grid gap-6 lg:grid-cols-[22rem_1fr]"><form className="panel" onSubmit={submit}><p className="panel-label">Add pilot location</p><div className="mt-5 grid gap-4"><Field label="Site name" value={form.name} required onChange={(name)=>setForm({...form,name})}/><Field label="City / state" value={form.location} required onChange={(location)=>setForm({...form,location})}/><Select label="Status" value={form.status} options={['pilot','prospect','inactive']} onChange={(status)=>setForm({...form,status:status as SiteDirectoryEntry['status']})}/></div><button className="cta-primary mt-6">Add site</button></form><div className="panel"><div className="grid gap-3">{data.sites.map(site=><div key={site.id} className="rounded-2xl border border-black/10 p-4"><p className="font-semibold">{site.name}</p><p className="text-sm text-[var(--ink-soft)]">{site.location} · {site.status}</p></div>)}</div></div></div>}

function Field({label,value,onChange,type='text',required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}){return <div><Label>{label}</Label><input className="field-input mt-2" type={type} value={value} required={required} onChange={(e)=>onChange(e.target.value)}/></div>}
function Select({label,value,options,onChange,optionLabels={}}:{label:string;value:string;options:string[];onChange:(v:string)=>void;optionLabels?:Record<string,string>}){return <div><Label>{label}</Label><select className="field-select mt-2" value={value} onChange={(e)=>onChange(e.target.value)}>{options.map(option=><option value={option} key={option}>{optionLabels[option]??option.split('_').join(' ')}</option>)}</select></div>}
