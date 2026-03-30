import Link from 'next/link'
import { corePageLinks, deliverables, projectTypes } from '@/content/beamArchitecture'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 bg-[var(--charcoal)] text-[var(--chalk)]">
      <div className="site-frame py-16">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.85fr_0.85fr]">
          <div>
            <p className="eyebrow !text-[rgba(247,242,232,0.52)]">BEAM Architecture</p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold">
              Building a pipeline from education into professional practice through real sites.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[rgba(247,242,232,0.72)]">
              BEAM Architecture connects students, faculty, and community partners through architecture, historic
              preservation, adaptive reuse, fabrication, accessibility planning, and real estate strategy.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="cta-primary" href="/join">
                Join / Apply
              </Link>
              <Link className="cta-secondary !border-white/20 !text-[var(--chalk)] hover:!bg-white/10" href="/central-umc">
                View Current Pilot
              </Link>
            </div>
          </div>

          <div>
            <p className="panel-label !text-[rgba(247,242,232,0.52)]">Core Pages</p>
            <div className="mt-4 grid gap-3">
              {corePageLinks.map((item) => (
                <Link key={item.href} className="footer-link" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <p className="panel-label !text-[rgba(247,242,232,0.52)]">Project Types</p>
              <div className="mt-4 grid gap-3">
                {projectTypes.slice(0, 4).map((item) => (
                  <p key={item.title} className="text-sm leading-6 text-[rgba(247,242,232,0.72)]">
                    {item.title}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="panel-label !text-[rgba(247,242,232,0.52)]">Typical Outputs</p>
              <div className="mt-4 grid gap-3">
                {deliverables.slice(0, 4).map((item) => (
                  <p key={item.title} className="text-sm leading-6 text-[rgba(247,242,232,0.72)]">
                    {item.title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-[rgba(247,242,232,0.58)]">
          <p>© {currentYear} BEAM Architecture. Cohort-based architecture practice for community-rooted project execution.</p>
        </div>
      </div>
    </footer>
  )
}
