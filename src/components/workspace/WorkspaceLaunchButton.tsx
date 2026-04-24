'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/authContext'

interface WorkspaceLaunchButtonProps {
  projectId: string
  className?: string
  label?: string
}

export default function WorkspaceLaunchButton({
  projectId,
  className = 'cta-primary',
  label = 'Open workspace',
}: WorkspaceLaunchButtonProps) {
  const { loading, user } = useAuth()

  if (loading || !user) {
    return null
  }

  return (
    <Link className={className} href={`/workspace/${projectId}`}>
      {label}
    </Link>
  )
}
