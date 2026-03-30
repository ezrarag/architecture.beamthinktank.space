'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { corePageLinks } from '@/content/beamArchitecture'

const projectsLink = {
  label: 'Projects',
  href: '/projects',
  summary: 'Public projects board with a map view and project interest registration.',
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigationLinks = [...corePageLinks, projectsLink]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'border-b border-black/10 bg-[rgba(247,242,232,0.92)] shadow-[0_18px_60px_rgba(15,21,25,0.08)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="site-frame">
        <div className="flex min-h-[5.25rem] items-center justify-between gap-4">
          <Link className="min-w-0" href="/">
            <span className="eyebrow !mb-2 !tracking-[0.28em]">BEAM Architecture</span>
            <span className="block font-display text-2xl font-semibold text-[var(--ink)] sm:text-[1.9rem]">
              University-linked cohort practice
            </span>
          </Link>

          <nav className="nav-scroll hidden max-w-[52rem] flex-1 items-center justify-end gap-2 overflow-x-auto lg:flex">
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  className={`nav-pill ${isActive ? 'nav-pill-active' : ''}`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex lg:hidden">
            <Link className="cta-secondary" href="/join">
              Join / Apply
            </Link>
          </div>

          <button
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[rgba(247,242,232,0.78)] text-[var(--ink)] shadow-[0_12px_30px_rgba(15,21,25,0.08)] lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-black/10 bg-[rgba(247,242,232,0.97)] backdrop-blur-xl lg:hidden">
          <div className="site-frame py-4">
            <div className="grid gap-2">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  className={`mobile-nav-link ${pathname === item.href ? 'mobile-nav-link-active' : ''}`}
                  href={item.href}
                >
                  <span className="block text-base font-medium text-[var(--ink)]">{item.label}</span>
                  <span className="mt-1 block text-sm text-[var(--ink-soft)]">{item.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
