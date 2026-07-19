import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getArchitecturePropertyViewBySlug } from '@/lib/architectureData'

interface PropertyDetailPageProps {
  params: {
    slug: string
  }
}

const statusBadgeStyles = {
  open: 'border border-[#c8b99a]/50 bg-[#c8b99a]/18 text-[#6b5f49]',
  active: 'border border-[#88aa8f]/50 bg-[#88aa8f]/18 text-[#355443]',
  completed: 'border border-black/[0.15] bg-black/[0.08] text-[var(--ink-soft)]',
  unassigned: 'border border-[#557180]/25 bg-[#557180]/12 text-[#2f4f5f]',
} as const

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const propertyView = await getArchitecturePropertyViewBySlug(params.slug)

  if (!propertyView) {
    notFound()
  }

  const { property, project } = propertyView

  return (
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow">Property</p>
              <h1 className="section-title mt-5 text-5xl md:text-7xl">{property.title}</h1>
              <p className="body-copy mt-6 max-w-3xl text-lg">{property.summary}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span
                className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${statusBadgeStyles[propertyView.status]}`}
              >
                {propertyView.status}
              </span>
              <span className="rounded-full border border-black/10 px-3 py-2 text-sm text-[var(--ink-soft)]">
                {property.address}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="panel">
            <p className="panel-label">Source Property Overview</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Address</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.address}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">City</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.city}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Use</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.use || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Type</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.type || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Owner</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.owner || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">Program</p>
                <p className="mt-2 text-base text-[var(--ink)]">{property.program || 'Not provided'}</p>
              </div>
            </div>

            {property.tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {property.tags.map((tag) => (
                  <span key={tag} className="chip !px-3 !py-2 !text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="cta-secondary" href={property.rawSourceUrl} rel="noreferrer" target="_blank">
                View source record
              </Link>
              <Link className="cta-secondary" href="/projects">
                Back to property board
              </Link>
            </div>
          </article>

          <article className="panel">
            <p className="panel-label">What The Cohort Is Doing Here</p>
            {project ? (
              <>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{project.stage}</h2>
                <p className="body-copy mt-5">{project.whatCohortIsDoing}</p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Lead:</span> {project.lead}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Faculty:</span>{' '}
                    {project.facultyLead || 'Faculty partner not listed yet'}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Participant status:</span>{' '}
                    {project.participantStatus}
                  </p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="panel-label">Deliverables</p>
                    <ul className="mt-4 space-y-3">
                      {project.deliverables.map((deliverable) => (
                        <li key={deliverable} className="chip !flex !items-start !justify-start text-left">
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="panel-label">Next Steps</p>
                    <ul className="mt-4 space-y-3">
                      {project.nextActions.map((nextAction) => (
                        <li key={nextAction} className="chip !flex !items-start !justify-start text-left">
                          {nextAction}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {project.tracks.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.tracks.map((track) => (
                      <span key={track} className="chip !px-3 !py-2 !text-sm">
                        {track}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link className="cta-primary" href={`/workspace/${project.id}`}>
                    Open workspace
                  </Link>
                  {project.ngoConnections[0] ? (
                    <Link
                      className="cta-secondary"
                      href={project.ngoConnections[0].href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open BEAM tool
                    </Link>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                  No active BEAM cohort is assigned to this property yet.
                </h2>
                <p className="body-copy mt-5">
                  This location is available in the property layer, but it does not yet have an
                  active architecture cohort record attached to it. Once a project is assigned, this
                  page will show the cohort scope, deliverables, and next steps.
                </p>
              </>
            )}
          </article>
        </div>
      </section>

      {project?.ngoConnections.length ? (
        <section className="pb-20">
          <div className="site-frame">
            <div className="panel">
              <p className="panel-label">Connected BEAM Systems</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {project.ngoConnections.map((connection) => (
                  <Link
                    key={connection.id}
                    className="nav-card"
                    href={connection.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <p className="panel-label">{connection.label}</p>
                    <p className="mt-3 text-base font-medium text-[var(--ink)]">{connection.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  )
}
