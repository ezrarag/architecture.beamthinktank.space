import { notFound } from 'next/navigation'
import ProjectWorkspaceClient from '@/components/workspace/ProjectWorkspaceClient'
import { getArchitectureProjectById } from '@/lib/architectureWorkspace'

interface ProjectWorkspacePageProps {
  params: {
    projectId: string
  }
}

export default function ProjectWorkspacePage({ params }: ProjectWorkspacePageProps) {
  if (!getArchitectureProjectById(params.projectId)) {
    notFound()
  }

  return <ProjectWorkspaceClient projectId={params.projectId} />
}
