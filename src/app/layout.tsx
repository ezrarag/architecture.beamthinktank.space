import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BEAM Architecture - Innovative Design & Sustainable Building',
  description: 'Explore cutting-edge architectural designs, sustainable building projects, and innovative urban planning solutions. View 3D models, support projects, and discover the future of architecture.',
  keywords: 'architecture, sustainable design, 3D models, urban planning, building projects, BEAM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
