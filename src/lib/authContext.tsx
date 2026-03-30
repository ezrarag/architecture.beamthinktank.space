'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { ensureArchitectureMembership } from './ensureArchitectureMembership'
import { auth, googleProvider } from './firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)

      if (u) {
        void ensureArchitectureMembership(u).catch((error) => {
          console.error('Failed to ensure architecture membership:', error)
        })
      }
    })
  }, [])

  async function handleSignIn() {
    if (!auth) {
      throw new Error(
        'Firebase authentication is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars.',
      )
    }

    await signInWithPopup(auth, googleProvider)
  }

  async function handleSignOut() {
    if (!auth) return

    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
