'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { ArrowRight, FolderKanban, MapPinned } from 'lucide-react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useAuth } from '@/lib/authContext'
import { getFinanceNgoUrl, projectSeedIncludesEmail } from '@/lib/architectureWorkspace'
import { db } from '@/lib/firebase'
import { architectureProjects, ngoConfig, type NGORole } from '@/lib/ngoConfig'

const statusBadgeStyles = {
  open: 'border border-[#c8b99a]/50 bg-[#c8b99a]/18 text-[#6b5f49]',
  active: 'border border-[#88aa8f]/50 bg-[#88aa8f]/18 text-[#355443]',
  completed: 'border border-black/[0.15] bg-black/[0.08] text-[var(--ink-soft)]',
} as const

export default function WorkspaceIndexClient() {
  const { loading, signIn, user } = useAuth()
  const [role, setRole] = useState<NGORole>('participant')
  const [mappedProjectIds, setMappedProjectIds] = useState<string[]>([])
  const [loadingAccess, setLoadingAccess] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAccess() {
      if (loading) {
        return
      }

      if (!user) {
        setLoadingAccess(false)
        return
      }

      if (!db) {
        setErrorMessage(
          'Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars to enable workspace access.',
        )
        setLoadingAccess(false)
        return
      }

      try {
        setLoadingAccess(true)

        const [membershipSnapshot, mappingSnapshot] = await Promise.all([
          getDoc(doc(db, ngoConfig.firestoreCollections.memberships, user.uid)),
          getDocs(
            query(
              collection(db, ngoConfig.firestoreCollections.projectMappings),
              where('uid', '==', user.uid),
            ),
          ),
        ])

        if (cancelled) {
          return
        }

        const nextRole = (membershipSnapshot.data()?.role as NGORole | undefined) ?? 'participant'
        setRole(nextRole)
        setMappedProjectIds(
          mappingSnapshot.docs
            .map((snapshot) => snapshot.data().projectId)
            .filter((projectId): projectId is string => typeof projectId === 'string'),
        )
        setErrorMessage('')
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to load your workspace access.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingAccess(false)
        }
      }
    }

    void loadAccess()

    return () => {
      cancelled = true
    }
  }, [loading, user])

  const accessibleProjects = useMemo(() => {
    if (!user) {
      return []
    }

    if (role === 'admin') {
      return architectureProjects
    }

    const projectIds = new Set(mappedProjectIds)

    architectureProjects.forEach((project) => {
      if (projectSeedIncludesEmail(project.id, user.email)) {
        projectIds.add(project.id)
      }
    })

    return architectureProjects.filter((project) => projectIds.has(project.id))
  }, [mappedProjectIds, role, user])

  return (
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow">Workspace</p>
              <h1 className="section-title mt-5 text-5xl md:text-7xl">
                Project workspaces for active BEAM Architecture participants.
              </h1>
            </div>

            <p className="body-copy max-w-2xl text-lg">
              Open the internal workspace for the projects where you have access, review live
              materials, and keep execution work moving.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame space-y-6">
          {errorMessage ? <div className="error-box">{errorMessage}</div> : null}

          {loading || loadingAccess ? (
            <div className="panel">
              <p className="panel-label">Loading</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Checking your workspace access.
              </h2>
            </div>
          ) : null}

          {!loading && !user ? (
            <div className="panel">
              <p className="panel-label">Sign In Required</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Sign in to view your project workspaces.
              </h2>
              <p className="body-copy mt-4 max-w-2xl">
                This index shows the projects you are assigned to. If you are not yet mapped to a
                project, start on the public projects board.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="cta-primary" onClick={() => void signIn()} type="button">
                  Sign in with Google
                </button>
                <Link className="cta-secondary" href="/projects">
                  Go to projects
                </Link>
              </div>
            </div>
          ) : null}

          {!loading && user && !loadingAccess && accessibleProjects.length === 0 ? (
            <div className="panel">
              <p className="panel-label">No Access Yet</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                No project workspaces are assigned to this account yet.
              </h2>
              <p className="body-copy mt-4 max-w-2xl">
                Map yourself to a project on the public projects board first. Once your assignment
                exists, the workspace will appear here automatically.
              </p>
              <div className="mt-8">
                <Link className="cta-primary" href="/projects">
                  Open projects board
                </Link>
              </div>
            </div>
          ) : null}

          {!loading && user && !loadingAccess && accessibleProjects.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {accessibleProjects.map((project) => (
                <article key={project.id} className="panel">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="panel-label">Workspace</p>
                      <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                        {project.title}
                      </h2>
                    </div>
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${statusBadgeStyles[project.status]}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="body-copy mt-5">{project.summary}</p>

                  <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
                    <p className="flex items-start gap-2">
                      <MapPinned className="mt-1 h-4 w-4 flex-none" />
                      <span>{project.location}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <FolderKanban className="mt-1 h-4 w-4 flex-none" />
                      <span>{project.tracks.join(' / ')}</span>
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link className="cta-primary" href={`/workspace/${project.id}`}>
                      Open workspace
                    </Link>
                    <Link className="cta-secondary" href={`/${project.slug}`}>
                      Public page
                    </Link>
                  </div>

                  <div className="mt-8 border-t border-black/10 pt-6 text-sm text-[var(--ink-soft)]">
                    <Link
                      className="inline-flex items-center gap-2 font-semibold text-[var(--ink)]"
                      href={getFinanceNgoUrl(project.id)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Budget allocations in Finance NGO
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}
