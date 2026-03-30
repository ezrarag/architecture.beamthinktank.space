import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  beamProcess,
  copyBlocks,
  corePageLinks,
  heroMetrics,
  intakePathways,
  pilotMetrics,
  projectTypes,
  roleCards,
} from '@/content/beamArchitecture'

export default function Home() {
  const indexPages = corePageLinks.filter((link) => link.href !== '/')

  return (
    <main className="min-h-screen">
      <Header />

      <section id="home" className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.85fr]">
            <div>
              <p className="eyebrow">BEAM Architecture</p>
              <h1 className="section-title mt-5 max-w-5xl text-5xl md:text-7xl">
                Building a pipeline from education into professional practice through real sites.
              </h1>
              <p className="body-copy mt-6 max-w-3xl text-lg">
                BEAM Architecture is a university-linked cohort model connecting students, faculty, and community
                sites through architecture, historic preservation, adaptive reuse, fabrication, accessibility
                planning, and real estate strategy.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="cta-primary" href="/central-umc">
                  View Current Pilot
                </Link>
                <Link className="cta-secondary" href="/join">
                  Join / Apply
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <article key={metric.label} className="panel">
                    <p className="text-3xl font-semibold text-[var(--ink)]">{metric.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{metric.label}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="panel panel-dark">
              <p className="panel-label !text-[rgba(247,242,232,0.52)]">Featured Pilot</p>
              <h2 className="mt-4 text-4xl font-semibold text-[var(--chalk)]">Central UMC</h2>
              <p className="mt-4 text-base leading-7 text-[rgba(247,242,232,0.8)]">
                Central UMC is the current BEAM Architecture pilot: a live test of how faculty-guided cohorts can
                document existing conditions, frame preservation and reuse priorities, evaluate accessibility, and
                hand off phased project logic that a real partner can use.
              </p>

              <div className="mt-8 grid gap-3">
                {pilotMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-lg font-semibold text-[var(--chalk)]">{metric.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[rgba(247,242,232,0.68)]">{metric.label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="pilot" className="section-pad">
        <div className="site-frame">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Current Pilot</p>
              <h2 className="section-title mt-4 text-4xl md:text-5xl">
                Central UMC anchors the first full BEAM Architecture cohort cycle.
              </h2>
            </div>
            <p className="body-copy max-w-2xl">
              The pilot is designed to prove that a community-rooted site can become a disciplined platform for
              education, documentation, preservation thinking, access planning, and implementation strategy.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="panel">
              <p className="panel-label">Pilot Scope</p>
              <h3 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                A live site rather than a hypothetical studio brief.
              </h3>
              <div className="mt-5 space-y-4">
                <p className="body-copy">
                  BEAM uses Central UMC to test how a cohort can work from field conditions toward phased action.
                </p>
                <p className="body-copy">
                  That includes documentation, preservation framing, adaptive reuse thinking, accessibility review,
                  and a credible handoff for future project work.
                </p>
              </div>
            </article>

            <article className="panel">
              <p className="panel-label">What the site receives</p>
              <ul className="mt-5 space-y-3">
                <li className="chip !flex !items-start !justify-start text-left">Existing conditions documentation and mapped observations</li>
                <li className="chip !flex !items-start !justify-start text-left">Preservation and adaptive reuse framing grounded in site realities</li>
                <li className="chip !flex !items-start !justify-start text-left">Accessibility priorities and phased project thinking</li>
                <li className="chip !flex !items-start !justify-start text-left">A clearer bridge into future fundraising, design, or implementation work</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section id="how-beam-works" className="section-pad">
        <div className="site-frame">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">How BEAM Works</p>
              <h2 className="section-title mt-4 text-4xl md:text-5xl">BEAM is a cohort model, not a generic volunteer pipeline.</h2>
            </div>
            <p className="body-copy max-w-2xl">
              Each cohort is built around a real site, a faculty-guided workflow, and deliverables that can move a
              partner toward the next decision or implementation phase.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {beamProcess.map((item) => (
              <article key={item.title} className="panel">
                <p className="panel-label">Phase</p>
                <h3 className="mt-4 text-2xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="body-copy mt-4">{item.summary}</p>
                <p className="body-copy mt-4 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="section-pad">
        <div className="site-frame">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Roles</p>
              <h2 className="section-title mt-4 text-4xl md:text-5xl">
                Faculty, students, and community partners each have a defined place in the model.
              </h2>
            </div>
            <p className="body-copy max-w-2xl">
              Faculty can participate as advisors, project sponsors, or course partners. Students gain practical
              experience through real community projects. Community sites receive documentation, planning, and phased
              project support.
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            {roleCards.map((item) => (
              <article key={item.title} className="panel">
                <p className="panel-label">Role</p>
                <h3 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="body-copy mt-4">{item.summary}</p>
                <p className="body-copy mt-4 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="project-types" className="section-pad">
        <div className="site-frame">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Project Types</p>
              <h2 className="section-title mt-4 text-4xl md:text-5xl">
                Built environment work that connects research, stewardship, and execution.
              </h2>
            </div>
            <Link className="cta-secondary" href="/project-types">
              Full project types page
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectTypes.map((item) => (
              <article key={item.title} className="panel">
                <p className="panel-label">Track</p>
                <h3 className="mt-4 text-2xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="body-copy mt-4">{item.summary}</p>
                <p className="body-copy mt-4 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="copy-blocks" className="section-pad">
        <div className="site-frame">
          <div className="grid gap-6 lg:grid-cols-2">
            {copyBlocks.map((item) => (
              <article key={item.title} className="panel">
                <p className="panel-label">Framework</p>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{item.title}</h2>
                <p className="body-copy mt-4">{item.summary}</p>
                <p className="body-copy mt-4 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="site-index" className="section-pad">
        <div className="site-frame">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">Core Pages</p>
              <h2 className="section-title mt-4 text-4xl md:text-5xl">A full BEAM Architecture site, not a single landing page.</h2>
            </div>
            <p className="body-copy max-w-2xl">
              These pages organize the public story for faculty, students, community partners, and institutional supporters.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {indexPages.map((page) => (
              <Link key={page.href} className="nav-card" href={page.href}>
                <p className="panel-label">{page.label}</p>
                <p className="mt-3 text-base font-medium text-[var(--ink)]">{page.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="call-to-action" className="pb-20">
        <div className="site-frame">
          <div className="panel panel-dark">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="panel-label !text-[rgba(247,242,232,0.52)]">Call to Action</p>
                <h2 className="mt-4 text-4xl font-semibold text-[var(--chalk)] md:text-5xl">
                  Join the next cohort, sponsor a faculty partnership, or refer a site.
                </h2>
              </div>
              <Link className="cta-primary" href="/join#intake">
                Open Intake Forms
              </Link>
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-3">
              {intakePathways.map((item, index) => {
                const anchors = ['/join#faculty-interest', '/join#student-interest', '/join#site-referral']
                return (
                  <article key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                    <p className="panel-label !text-[rgba(247,242,232,0.52)]">Path {index + 1}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-[var(--chalk)]">{item.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[rgba(247,242,232,0.8)]">{item.summary}</p>
                    <p className="mt-4 text-sm leading-6 text-[rgba(247,242,232,0.64)]">{item.detail}</p>
                    <Link className="mt-6 inline-flex text-sm font-medium uppercase tracking-[0.18em] text-[var(--chalk)]" href={anchors[index]}>
                      Start this intake
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
