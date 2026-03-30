import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from './firebase'

export async function ensureArchitectureMembership(user: User) {
  if (!db) return

  const ref = doc(db, 'architectureMemberships', user.uid)
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'participant',
      sourceSite: 'architecture.beamthinktank.space',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
