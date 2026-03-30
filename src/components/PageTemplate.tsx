import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import IntakeForms from '@/components/IntakeForms'
import { corePageLinks, type SitePage } from '@/content/beamArchitecture'

export default function PageTemplate({ page }: { page: SitePage }) {
  const relatedPages = corePageLinks.filter((link) => link.href !== page.href && link.href !== '/').slice(0, 4)

  return (
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad !pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className="eyebrow">{page.label}</p>
              <h1 className="section-title mt-5 max-w-5xl text-5xl md:text-6xl">{page.title}</h1>
              <p className="body-copy mt-6 max-w-3xl text-lg">{page.description}</p>
            </div>

            <aside className="panel panel-dark">
              <p className="panel-label !text-[rgba(247,242,232,0.62)]">Working Brief</p>
              <p className="mt-4 text-base leading-7 text-[rgba(247,242,232,0.82)]">{page.summary}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {page.stats.map((stat) => (
                  <div
                    key={`${page.slug}-${stat.label}`}
                    className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-xl font-semibold text-[var(--chalk)]">{stat.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[rgba(247,242,232,0.68)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame">
          <div className="grid gap-6 lg:grid-cols-2">
            {page.sections.map((section) => (
              <article key={`${page.slug}-${section.title}`} className="panel">
                {section.eyebrow ? <p className="panel-label">{section.eyebrow}</p> : null}
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{section.title}</h2>

                <div className="mt-5 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="body-copy">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {section.bullets?.length ? (
                  <ul className="mt-6 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="chip !flex !items-start !justify-start text-left">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.highlights?.length ? (
        <section className="pb-12">
          <div className="site-frame">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {page.highlights.map((item) => (
                <article key={`${page.slug}-${item.title}`} className="panel">
                  <p className="panel-label">Detail</p>
                  <h2 className="mt-4 text-2xl font-semibold text-[var(--ink)]">{item.title}</h2>
                  <p className="body-copy mt-4">{item.summary}</p>
                  <p className="body-copy mt-4 text-sm">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {page.showForms && page.formLead ? <IntakeForms lead={page.formLead} /> : null}

      <section className="pb-20">
        <div className="site-frame">
          <div className="panel">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="panel-label">Continue Exploring</p>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">Review the rest of the BEAM Architecture framework.</h2>
              </div>
              <Link className="cta-secondary" href="/join">
                Join / Apply
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedPages.map((link) => (
                <Link key={link.href} className="nav-card" href={link.href}>
                  <p className="panel-label">{link.label}</p>
                  <p className="mt-3 text-base font-medium text-[var(--ink)]">{link.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
