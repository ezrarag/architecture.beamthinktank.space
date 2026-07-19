import ProjectsBoardClient from '@/components/ProjectsBoardClient'
import { listArchitecturePropertyViews } from '@/lib/architectureData'

export default async function ProjectsPage() {
  const propertyViews = await listArchitecturePropertyViews()

  return <ProjectsBoardClient initialViews={propertyViews} />
}
