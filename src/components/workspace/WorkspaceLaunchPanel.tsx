'use client'

import WorkspaceLaunchButton from './WorkspaceLaunchButton'
import { useAuth } from '@/lib/authContext'

interface WorkspaceLaunchPanelProps {
  projectId: string
  projectTitle: string
}

export default function WorkspaceLaunchPanel({
  projectId,
  projectTitle,
}: WorkspaceLaunchPanelProps) {
  const { loading, user } = useAuth()

  if (loading || !user) {
    return null
  }

  return (
    <section className="pb-12">
      <div className="site-frame">
        <div className="panel">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="panel-label">Authenticated Workspace</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Open the live {projectTitle} project workspace.
              </h2>
              <p className="body-copy mt-4">
                Jump from the public project narrative into the internal working space for notes,
                assignments, materials, correspondence, and budget coordination.
              </p>
            </div>

            <WorkspaceLaunchButton projectId={projectId} label="Open workspace" />
          </div>
        </div>
      </div>
    </section>
  )
}
