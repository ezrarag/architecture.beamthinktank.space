'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { doc, onSnapshot } from 'firebase/firestore'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import WorkspaceLaunchPanel from '@/components/workspace/WorkspaceLaunchPanel'
import { centralUmcProject, type AdminProject } from '@/lib/architectureAdmin'
import { db } from '@/lib/firebase'
import { ngoConfig } from '@/lib/ngoConfig'

export default function ProjectRecordPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<AdminProject>(centralUmcProject)

  useEffect(() => {
    if (!db) return
    return onSnapshot(doc(db, ngoConfig.firestoreCollections.projects, projectId), (snapshot) => {
      if (snapshot.exists()) setProject({ ...centralUmcProject, ...snapshot.data(), id: snapshot.id } as AdminProject)
    })
  }, [projectId])

  const covenantSlots = project.roleSlots.filter((slot) => slot.noRentCovenant)

  return (
    <main className="min-h-screen">
      <Header />
      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad !pb-16">
          <p className="eyebrow">Live project record · {project.status.split('_').join(' ')}</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div><h1 className="section-title text-5xl md:text-6xl">{project.name}</h1><p className="body-copy mt-6 max-w-3xl text-lg">{project.notes}</p><div className="mt-7 flex flex-wrap gap-2"><span className="chip">{project.projectType.split('_').join(' ')}</span><span className="chip">{project.phase}</span><span className="chip">{project.siteLocation}</span></div></div>
            <aside className="panel panel-dark"><p className="panel-label !text-white/55">Partner and site</p><p className="mt-4 text-2xl font-semibold">{project.partnerOrg}</p><p className="mt-3 text-white/70">{project.siteLocation}</p><p className="mt-7 text-sm text-white/60">Project data is loaded from the same Firestore record managed in /admin.</p></aside>
          </div>
        </div>
      </section>
      <section className="section-pad"><div className="site-frame grid gap-6 lg:grid-cols-2">
        <article className="panel"><p className="panel-label">Staffing plan</p><h2 className="mt-4 text-3xl font-semibold">Role slots</h2><div className="mt-6 grid gap-3">{project.roleSlots.map(slot=><div key={slot.id} className="rounded-2xl border border-black/10 p-4"><div className="flex flex-wrap justify-between gap-3"><p className="font-semibold">{slot.roleLabel}</p><span className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{slot.filledBy.length}/{slot.slotsNeeded} filled</span></div><p className="mt-2 text-sm text-[var(--ink-soft)]">{slot.areaSource} · {slot.fillType.split('_').join(' ')}{slot.noRentCovenant ? ' · project covenant applies' : ''}</p></div>)}</div></article>
        <article className="panel"><p className="panel-label">Municipal + operations</p><h2 className="mt-4 text-3xl font-semibold">Structured project terms</h2><dl className="mt-6 grid gap-4 text-sm"><div><dt className="font-semibold">Zoning classification</dt><dd className="mt-1 text-[var(--ink-soft)]">{project.zoningClassification || 'Pending documentation'}</dd></div><div><dt className="font-semibold">Variance types</dt><dd className="mt-1 text-[var(--ink-soft)]">{project.varianceType.join(', ') || 'None recorded'}</dd></div><div><dt className="font-semibold">Operational covenant</dt><dd className="mt-1 text-[var(--ink-soft)]">{covenantSlots.length ? `${covenantSlots.length} role slot(s) flagged; simulated rent $${project.financials.operationalCovenant.rentAmountSimulated}.` : 'No role slots flagged.'}</dd></div></dl></article>
      </div></section>
      <WorkspaceLaunchPanel projectId={project.id} projectTitle={project.name} />
      <section className="pb-20"><div className="site-frame"><div className="panel flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="panel-label">Participate</p><h2 className="mt-3 text-3xl font-semibold">Help move the pilot forward.</h2></div><Link className="cta-primary" href="/join">Join / Apply</Link></div></div></section>
      <Footer />
    </main>
  )
}
