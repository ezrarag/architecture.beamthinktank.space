import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { IBM_Plex_Sans, Cormorant_Garamond } from 'next/font/google'
import { AuthProvider } from '@/lib/authContext'
import './globals.css'

const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://architecture.beamthinktank.space'),
  title: {
    default: 'BEAM Architecture',
    template: '%s | BEAM Architecture',
  },
  description:
    'BEAM Architecture is a university-linked cohort model connecting students, faculty, and community sites through architecture, historic preservation, adaptive reuse, fabrication, accessibility planning, and real estate strategy.',
  keywords: [
    'BEAM Architecture',
    'architecture cohort',
    'historic preservation',
    'adaptive reuse',
    'fabrication',
    'accessibility planning',
    'real estate strategy',
    'community partnerships',
    'UWM architecture',
  ],
  openGraph: {
    title: 'BEAM Architecture',
    description:
      'A university-linked cohort model connecting students, faculty, and community sites through architecture and project execution.',
    url: 'https://architecture.beamthinktank.space',
    siteName: 'BEAM Architecture',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
