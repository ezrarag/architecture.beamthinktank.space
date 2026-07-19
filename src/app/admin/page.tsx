import type { Metadata } from 'next'
import AdminClient from '@/components/admin/AdminClient'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Manage BEAM Architecture projects, participants, roles, and pilot sites.',
}

export default function AdminPage() {
  return <AdminClient />
}
