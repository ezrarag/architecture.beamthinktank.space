'use client'

import { useMemo, useState } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ArchitectureProjectsMap from '@/components/ArchitectureProjectsMap'
import { useAuth } from '@/lib/authContext'
import { auth, db } from '@/lib/firebase'
import { architectureProjects, ngoConfig, type ArchitectureProject } from '@/lib/ngoConfig'

const statusBadgeStyles: Record<
  ArchitectureProject['status'],
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
}

export default function ProjectsPage() {
  const { user, signIn } = useAuth()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    architectureProjects[0]?.id ?? null,
  )
  const [submittingProjectId, setSubmittingProjectId] = useState<string | null>(null)
  const [mappedProjectIds, setMappedProjectIds] = useState<Set<string>>(() => new Set())
  const [errorMessage, setErrorMessage] = useState('')

  const selectedProject = useMemo(
    () => architectureProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId],
  )

  async function handleProjectMapping(project: ArchitectureProject) {
    setErrorMessage('')
    setSubmittingProjectId(project.id)

    try {
      setSelectedProjectId(project.id)

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
        doc(db, ngoConfig.firestoreCollections.projectMappings, `${activeUser.uid}_${project.id}`),
        {
          uid: activeUser.uid,
          email: activeUser.email,
          projectId: project.id,
          projectTitle: project.title,
          mappedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setMappedProjectIds((current) => {
        const next = new Set(current)
        next.add(project.id)
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
                Public project board for active and emerging BEAM Architecture work.
              </h1>
            </div>

            <p className="body-copy max-w-2xl text-lg">
              Review live sites, explore them on the map, and register interest in the projects
              where you want to contribute as a participant.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame">
          <ArchitectureProjectsMap
            projects={architectureProjects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />

          {selectedProject ? (
            <div className="panel mt-6">
              <p className="panel-label">Selected Project</p>
              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-semibold text-[var(--ink)]">{selectedProject.title}</h2>
                  <p className="body-copy mt-4">{selectedProject.summary}</p>
                </div>

                <div className="space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Lead:</span> {selectedProject.lead}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Location:</span>{' '}
                    {selectedProject.location}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-800">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {architectureProjects.map((project) => {
              const badge = statusBadgeStyles[project.status]
              const isMapped = mappedProjectIds.has(project.id)
              const isSubmitting = submittingProjectId === project.id
              const isSelected = selectedProjectId === project.id

              return (
                <article
                  key={project.id}
                  className={`panel transition-transform duration-200 ${
                    isSelected
                      ? 'border-black/25 shadow-[0_22px_70px_rgba(16,23,27,0.14)]'
                      : 'hover:-translate-y-1'
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                  onFocusCapture={() => setSelectedProjectId(project.id)}
                  onMouseEnter={() => setSelectedProjectId(project.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="panel-label">Project</p>
                      <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{project.title}</h2>
                    </div>
                    <span className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="body-copy mt-5">{project.summary}</p>

                  <div className="mt-6 space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Location:</span> {project.location}
                    </p>
                    <p>
                      <span className="font-semibold text-[var(--ink)]">Lead:</span> {project.lead}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.tracks.map((track) => (
                      <span key={track} className="chip !px-3 !py-2 !text-sm">
                        {track}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="cta-primary"
                      disabled={isSubmitting}
                      onClick={(event) => {
                        event.stopPropagation()
                        void handleProjectMapping(project)
                      }}
                    >
                      {isSubmitting
                        ? 'Registering...'
                        : isMapped
                          ? 'Interest registered ✓'
                          : 'Map yourself to this project'}
                    </button>
                    <button
                      type="button"
                      className="cta-secondary"
                      onClick={(event) => {
                        event.stopPropagation()
                        setSelectedProjectId(project.id)
                      }}
                    >
                      View on map
                    </button>
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
