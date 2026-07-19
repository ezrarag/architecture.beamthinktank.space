'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ArchitectureProjectsMap from '@/components/ArchitectureProjectsMap'
import { useAuth } from '@/lib/authContext'
import { auth, db } from '@/lib/firebase'
import { ngoConfig, type ArchitecturePropertyView } from '@/lib/ngoConfig'

const statusBadgeStyles: Record<
  ArchitecturePropertyView['status'],
  { label: string; className: string }
> = {
  open: {
    label: 'Open',
    className: 'border border-[#c8b99a]/50 bg-[#c8b99a]/18 text-[#6b5f49]',
  },
  active: {
    label: 'Active',
    className: 'border border-[#88aa8f]/50 bg-[#88aa8f]/18 text-[#355443]',
  },
  completed: {
    label: 'Completed',
    className: 'border border-black/[0.15] bg-black/[0.08] text-[var(--ink-soft)]',
  },
  unassigned: {
    label: 'Unassigned',
    className: 'border border-[#557180]/25 bg-[#557180]/12 text-[#2f4f5f]',
  },
}

interface ProjectsBoardClientProps {
  initialViews: ArchitecturePropertyView[]
}

export default function ProjectsBoardClient({ initialViews }: ProjectsBoardClientProps) {
  const searchParams = useSearchParams()
  const { user, signIn } = useAuth()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(initialViews[0]?.id ?? null)
  const [submittingProjectId, setSubmittingProjectId] = useState<string | null>(null)
  const [mappedProjectIds, setMappedProjectIds] = useState<Set<string>>(() => new Set())
  const [errorMessage, setErrorMessage] = useState('')
  const workspaceMessage = searchParams.get('message')

  const selectedView = useMemo(
    () => initialViews.find((view) => view.id === selectedPropertyId) ?? null,
    [initialViews, selectedPropertyId],
  )

  async function handleProjectMapping(view: ArchitecturePropertyView) {
    if (!view.project) {
      return
    }

    setErrorMessage('')
    setSubmittingProjectId(view.project.id)

    try {
      setSelectedPropertyId(view.id)

      if (!auth || !db) {
        throw new Error(
          'Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars to enable project mapping.',
        )
      }

      if (!user) {
        await signIn()
      }

      const activeUser = auth.currentUser

      if (!activeUser) {
        throw new Error('Unable to confirm your sign-in. Please try again.')
      }

      await setDoc(
        doc(db, ngoConfig.firestoreCollections.projectMappings, `${activeUser.uid}_${view.project.id}`),
        {
          uid: activeUser.uid,
          email: activeUser.email,
          projectId: view.project.id,
          projectTitle: view.project.title,
          mappedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setMappedProjectIds((current) => {
        const next = new Set(current)
        next.add(view.project!.id)
        return next
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to register interest in this project.',
      )
    } finally {
      setSubmittingProjectId(null)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow">Projects</p>
              <h1 className="section-title mt-5 text-5xl md:text-7xl">
                Public property board for active, emerging, and unassigned BEAM Architecture sites.
              </h1>
            </div>

            <p className="body-copy max-w-2xl text-lg">
              Review live properties, see what the cohort is doing at each location, and register
              interest where a BEAM project is already active.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame">
          <ArchitectureProjectsMap
            projects={initialViews}
            selectedProjectId={selectedPropertyId}
            onSelectProject={setSelectedPropertyId}
          />

          {selectedView ? (
            <div className="panel mt-6">
              <p className="panel-label">Selected Property</p>
              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-semibold text-[var(--ink)]">{selectedView.title}</h2>
                  <p className="body-copy mt-4">{selectedView.summary}</p>
                </div>

                <div className="space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Lead:</span> {selectedView.lead}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Location:</span>{' '}
                    {selectedView.location}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="cta-secondary" href={`/properties/${selectedView.slug}`}>
                  Open property page
                </Link>
                {selectedView.project ? (
                  <Link className="cta-secondary" href={`/workspace/${selectedView.project.id}`}>
                    Open workspace
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}

          {workspaceMessage ? <div className="success-box mt-6">{workspaceMessage}</div> : null}

          {errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-800">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {initialViews.map((view) => {
              const badge = statusBadgeStyles[view.status]
              const projectId = view.project?.id ?? null
              const isMapped = projectId ? mappedProjectIds.has(projectId) : false
              const isSubmitting = projectId != null && submittingProjectId === projectId
              const isSelected = selectedPropertyId === view.id

              return (
                <article
                  key={view.id}
                  className={`panel transition-transform duration-200 ${
                    isSelected
                      ? 'border-black/25 shadow-[0_22px_70px_rgba(16,23,27,0.14)]'
                      : 'hover:-translate-y-1'
                  }`}
                  onClick={() => setSelectedPropertyId(view.id)}
                  onFocusCapture={() => setSelectedPropertyId(view.id)}
                  onMouseEnter={() => setSelectedPropertyId(view.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="panel-label">Property</p>
                      <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{view.title}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="body-copy mt-5">{view.summary}</p>

                  <div className="mt-6 space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Location:</span> {view.location}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Lead:</span> {view.lead}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Source:</span>{' '}
                      {view.property.sourceDataset}
                    </p>
                  </div>

                  {view.tracks.length > 0 ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {view.tracks.map((track) => (
                        <span key={track} className="chip !px-3 !py-2 !text-sm">
                          {track}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {view.project ? (
                      <button
                        type="button"
                        className="cta-primary"
                        disabled={isSubmitting}
                        onClick={(event) => {
                          event.stopPropagation()
                          void handleProjectMapping(view)
                        }}
                      >
                        {isSubmitting
                          ? 'Registering...'
                          : isMapped
                            ? 'Interest registered'
                            : 'Map yourself to this project'}
                      </button>
                    ) : (
                      <span className="cta-primary cursor-default opacity-70">
                        No active cohort yet
                      </span>
                    )}
                    <Link
                      className="cta-secondary"
                      href={`/properties/${view.slug}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      View property page
                    </Link>
                    {user && view.project ? (
                      <Link
                        className="cta-secondary"
                        href={`/workspace/${view.project.id}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        Open workspace
                      </Link>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
