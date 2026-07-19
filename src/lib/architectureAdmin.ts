import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { ngoConfig } from './ngoConfig'

export type AdminRole = 'beam_admin' | 'partner_admin'
export type ProjectStatus = 'concept' | 'active_pilot' | 'proposal_packet' | 'archived'
export type ProjectType =
  | 'adaptive_reuse'
  | 'ecological_residential'
  | 'institutional_pilot'
  | 'community_greenhouse'
export type ProjectPhase = 'Discovery' | 'Zoning & Variances' | 'Active Build'
export type AreaSource = 'design' | 'regulatory' | 'operations' | 'custom'
export type FillType = 'subscription_covered' | 'sponsor_participant' | 'sweat_equity'
export type ParticipantSource = 'architecture' | 'orchestra' | 'forge' | 'law'

export interface RoleTemplate {
  id: string
  label: string
  areaSource: AreaSource
}

export interface RoleSlot {
  id: string
  roleId: string
  roleLabel: string
  areaSource: AreaSource
  slotsNeeded: number
  fillType: FillType
  noRentCovenant: boolean
  filledBy: string[]
}

export interface Encumbrance {
  id: string
  type: 'lien' | 'easement' | 'title_restriction'
  description: string
  status: string
}

export interface CostLineItem {
  id: string
  label: string
  amount: number
}

export interface OperationalCovenant {
  rentAmountSimulated: number
  requiredDeliverables: string[]
  externalMonetizationGate: string
}

export interface AdminProject {
  id: string
  name: string
  slug: string
  siteLocation: string
  status: ProjectStatus
  projectType: ProjectType
  partnerOrg: string
  phase: ProjectPhase
  notes: string
  assetLinks: string[]
  zoningClassification: string
  varianceType: string[]
  encumbrances: Encumbrance[]
  financials: {
    hardCosts: CostLineItem[]
    operationalCovenant: OperationalCovenant
  }
  roleSlots: RoleSlot[]
  cohortId: string
}

export interface Participant {
  id: string
  name: string
  email: string
  role: string
  status: string
  headline: string
  notes: string
  sourceSite: ParticipantSource
  organizationId?: string
}

export interface SiteDirectoryEntry {
  id: string
  name: string
  location: string
  projectId?: string
  status: 'pilot' | 'prospect' | 'inactive'
}

export interface ProjectMilestone {
  id: string
  projectId: string
  phase: ProjectPhase
  description: string
  targetDate: string
  status: 'not_started' | 'in_progress' | 'complete' | 'blocked'
}

export const seedRoleTemplates: RoleTemplate[] = [
  ['site-planner', 'Site Planner', 'design'],
  ['renderer', 'Renderer / Visualization Artist', 'design'],
  ['landscape-ecological-designer', 'Landscape / Ecological Designer', 'design'],
  ['structural-engineer', 'Structural Engineer', 'design'],
  ['zoning-entitlements-lead', 'Zoning & Entitlements Lead', 'regulatory'],
  ['legal-encumbrance-reviewer', 'Legal / Encumbrance Reviewer', 'regulatory'],
  ['grant-writer-manager', 'Grant Writer / Manager', 'regulatory'],
  ['community-liaison', 'Community Liaison', 'operations'],
  ['caretaker-steward', 'Caretaker / Steward', 'operations'],
  ['construction-coordinator', 'Construction / Build Coordinator', 'operations'],
  ['insurance-coordinator', 'Insurance Coordinator', 'operations'],
].map(([id, label, areaSource]) => ({ id, label, areaSource: areaSource as AreaSource }))

export const centralUmcProject: AdminProject = {
  id: 'central-umc',
  name: 'Central UMC',
  slug: 'central-umc',
  siteLocation: 'Milwaukee, Wisconsin',
  status: 'active_pilot',
  projectType: 'adaptive_reuse',
  partnerOrg: 'Central United Methodist Church',
  phase: 'Discovery',
  notes:
    'Anchor pilot for existing-conditions documentation, preservation framing, accessibility review, and phased adaptive-reuse planning.',
  assetLinks: [],
  zoningClassification: '',
  varianceType: [],
  encumbrances: [],
  financials: {
    hardCosts: [],
    operationalCovenant: {
      rentAmountSimulated: 0,
      requiredDeliverables: [],
      externalMonetizationGate: '',
    },
  },
  roleSlots: [
    {
      id: 'central-community-liaison',
      roleId: 'community-liaison',
      roleLabel: 'Community Liaison',
      areaSource: 'operations',
      slotsNeeded: 1,
      fillType: 'sponsor_participant',
      noRentCovenant: false,
      filledBy: [],
    },
    {
      id: 'central-site-planner',
      roleId: 'site-planner',
      roleLabel: 'Site Planner',
      areaSource: 'design',
      slotsNeeded: 1,
      fillType: 'sweat_equity',
      noRentCovenant: false,
      filledBy: [],
    },
    {
      id: 'central-caretaker-steward',
      roleId: 'caretaker-steward',
      roleLabel: 'Caretaker / Steward',
      areaSource: 'operations',
      slotsNeeded: 1,
      fillType: 'sweat_equity',
      noRentCovenant: true,
      filledBy: [],
    },
  ],
  cohortId: 'architecture-central-umc',
}

export const seedSites: SiteDirectoryEntry[] = [
  {
    id: 'central-umc',
    name: 'Central UMC',
    location: 'Milwaukee, Wisconsin',
    projectId: 'central-umc',
    status: 'pilot',
  },
]

export function createId(value: string) {
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `${slug || 'record'}-${Date.now().toString(36)}`
}

async function listCollection<T>(name: string): Promise<T[]> {
  if (!db) return []
  const snapshot = await getDocs(collection(db, name))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)
}

export async function loadAdminData() {
  const [storedProjects, storedParticipants, storedAreas, storedSites, milestones] = await Promise.all([
    listCollection<AdminProject>(ngoConfig.firestoreCollections.projects),
    listCollection<Participant>(ngoConfig.firestoreCollections.participants),
    listCollection<RoleTemplate>(ngoConfig.firestoreCollections.areas),
    listCollection<SiteDirectoryEntry>(ngoConfig.firestoreCollections.sites),
    listCollection<ProjectMilestone>(ngoConfig.firestoreCollections.milestones),
  ])
  const projects = storedProjects.some((project) => project.id === centralUmcProject.id)
    ? storedProjects
    : [centralUmcProject, ...storedProjects]
  return {
    projects,
    participants: storedParticipants,
    areas: storedAreas.length ? storedAreas : seedRoleTemplates,
    sites: storedSites.length ? storedSites : seedSites,
    milestones,
  }
}

export async function getAdminRole(uid: string): Promise<AdminRole | null> {
  if (!db) return null
  const snapshot = await getDoc(doc(db, ngoConfig.firestoreCollections.memberships, uid))
  const role = snapshot.data()?.role
  return role === 'beam_admin' || role === 'partner_admin' ? role : null
}

export async function saveRecord<T extends { id: string }>(collectionName: string, record: T) {
  if (!db) throw new Error('Firebase is not configured.')
  await setDoc(doc(db, collectionName, record.id), { ...record, updatedAt: serverTimestamp() }, { merge: true })
}

export async function seedArchitectureAdmin() {
  if (!db) throw new Error('Firebase is not configured.')
  const batch = writeBatch(db)
  batch.set(doc(db, ngoConfig.firestoreCollections.projects, centralUmcProject.id), centralUmcProject, { merge: true })
  seedRoleTemplates.forEach((area) => batch.set(doc(db!, ngoConfig.firestoreCollections.areas, area.id), area, { merge: true }))
  seedSites.forEach((site) => batch.set(doc(db!, ngoConfig.firestoreCollections.sites, site.id), site, { merge: true }))
  await batch.commit()
}

export async function saveParticipantAndAttach(
  participant: Participant,
  project: AdminProject,
  slotId: string,
) {
  if (!db) throw new Error('Firebase is not configured.')
  const slot = project.roleSlots.find((item) => item.id === slotId)
  if (!slot) throw new Error('Choose a valid role slot.')
  const updatedProject = {
    ...project,
    roleSlots: project.roleSlots.map((item) =>
      item.id === slotId && !item.filledBy.includes(participant.id)
        ? { ...item, filledBy: [...item.filledBy, participant.id] }
        : item,
    ),
  }
  const batch = writeBatch(db)
  batch.set(doc(db, ngoConfig.firestoreCollections.participants, participant.id), participant, { merge: true })
  batch.set(doc(db, ngoConfig.firestoreCollections.projects, project.id), updatedProject, { merge: true })

  // Canonical identity adapter. Confirm these fields against /admin/participant-identity before production rollout.
  batch.set(doc(db, 'participantProfiles', participant.id), {
    displayName: participant.name,
    email: participant.email.toLowerCase(),
    skills: [participant.role],
    roles: [participant.role],
    sourceSite: participant.sourceSite,
    updatedAt: serverTimestamp(),
  }, { merge: true })
  batch.set(doc(db, 'cohortMemberships', `${project.cohortId}_${participant.id}`), {
    cohortId: project.cohortId,
    participantId: participant.id,
    projectId: project.id,
    sourceSite: 'architecture',
    status: 'active',
    updatedAt: serverTimestamp(),
  }, { merge: true })
  if (participant.organizationId) {
    batch.set(doc(db, 'organizationMemberships', `${participant.organizationId}_${participant.id}`), {
      organizationId: participant.organizationId,
      participantId: participant.id,
      sourceSite: 'architecture',
      status: 'active',
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }
  await batch.commit()
  return updatedProject
}
