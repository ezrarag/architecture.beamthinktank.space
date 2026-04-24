import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageTemplate from '@/components/PageTemplate'
import { isPageSlug, pageSlugs, pagesBySlug } from '@/content/beamArchitecture'
import { getArchitectureProjectBySlug } from '@/lib/architectureWorkspace'

interface SitePageProps {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: SitePageProps): Metadata {
  if (!isPageSlug(params.slug)) {
    return {}
  }

  const page = pagesBySlug[params.slug]

  return {
    title: page.label,
    description: page.description,
  }
}

export default function SitePage({ params }: SitePageProps) {
  if (!isPageSlug(params.slug)) {
    notFound()
  }

  const workspaceProject = getArchitectureProjectBySlug(params.slug)

  return (
    <PageTemplate
      page={pagesBySlug[params.slug]}
      workspaceProject={
        workspaceProject
          ? {
              id: workspaceProject.id,
              title: workspaceProject.title,
            }
          : undefined
      }
    />
  )
}
