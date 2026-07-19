import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import {
  architectureProjects,
  ngoConfig,
  seedArchitectureProperties,
  type ArchitectureProject,
  type ArchitectureProjectStatus,
  type ArchitectureProperty,
  type ArchitecturePropertyStatus,
  type ArchitecturePropertyView,
  type ArchitecturePropertyViewStatus,
} from './ngoConfig'

function normalizeDate(value: unknown, fallback: string) {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate()
    if (date instanceof Date && !Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  return fallback
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

function normalizeDocuments(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const label = typeof item.label === 'string' ? item.label.trim() : ''
    const href = typeof item.href === 'string' ? item.href.trim() : ''

    if (!label || !href) {
      return []
    }

    return [{ label, href }]
  })
}

function normalizeStoredProperty(
  id: string,
  input: Record<string, unknown>,
  fallback: ArchitectureProperty | null,
): ArchitectureProperty {
  const fallbackProperty = fallback ?? seedArchitectureProperties[0]
  const now = new Date().toISOString()
  const status =
    input.status === 'active' || input.status === 'inactive'
      ? (input.status as ArchitecturePropertyStatus)
      : fallback?.status ?? 'active'

  return {
    id,
    slug:
      typeof input.slug === 'string' && input.slug.trim().length > 0
        ? input.slug.trim()
        : fallback?.slug ?? id,
    sourceId:
      typeof input.sourceId === 'string' && input.sourceId.trim().length > 0
        ? input.sourceId.trim()
        : fallback?.sourceId ?? id,
    sourceDataset:
      typeof input.sourceDataset === 'string' && input.sourceDataset.trim().length > 0
        ? input.sourceDataset.trim()
        : fallback?.sourceDataset ?? 'unknown',
    title:
      typeof input.title === 'string' && input.title.trim().length > 0
        ? input.title.trim()
        : fallback?.title ?? fallbackProperty.title,
    summary:
      typeof input.summary === 'string' && input.summary.trim().length > 0
        ? input.summary.trim()
        : fallback?.summary ?? fallbackProperty.summary,
    address:
      typeof input.address === 'string' && input.address.trim().length > 0
        ? input.address.trim()
        : fallback?.address ?? fallbackProperty.address,
    city:
      typeof input.city === 'string' && input.city.trim().length > 0
        ? input.city.trim()
        : fallback?.city ?? fallbackProperty.city,
    lat:
      typeof input.lat === 'number' && Number.isFinite(input.lat)
        ? input.lat
        : fallback?.lat ?? fallbackProperty.lat,
    lng:
      typeof input.lng === 'number' && Number.isFinite(input.lng)
        ? input.lng
        : fallback?.lng ?? fallbackProperty.lng,
    status,
    rawSourceUrl:
      typeof input.rawSourceUrl === 'string' && input.rawSourceUrl.trim().length > 0
        ? input.rawSourceUrl.trim()
        : fallback?.rawSourceUrl ?? fallbackProperty.rawSourceUrl,
    lastSyncedAt: normalizeDate(input.lastSyncedAt, fallback?.lastSyncedAt ?? now),
    parcel:
      typeof input.parcel === 'string' && input.parcel.trim().length > 0
        ? input.parcel.trim()
        : fallback?.parcel ?? null,
    use:
      typeof input.use === 'string' && input.use.trim().length > 0
        ? input.use.trim()
        : fallback?.use ?? null,
    type:
      typeof input.type === 'string' && input.type.trim().length > 0
        ? input.type.trim()
        : fallback?.type ?? null,
    owner:
      typeof input.owner === 'string' && input.owner.trim().length > 0
        ? input.owner.trim()
        : fallback?.owner ?? null,
    program:
      typeof input.program === 'string' && input.program.trim().length > 0
        ? input.program.trim()
        : fallback?.program ?? null,
    tags: normalizeStringList(input.tags).length > 0 ? normalizeStringList(input.tags) : fallback?.tags ?? [],
    documents:
      normalizeDocuments(input.documents).length > 0
        ? normalizeDocuments(input.documents)
        : fallback?.documents ?? [],
    rawSourceRecord:
      input.rawSourceRecord && typeof input.rawSourceRecord === 'object'
        ? (input.rawSourceRecord as Record<string, unknown>)
        : fallback?.rawSourceRecord ?? null,
  }
}

function getViewStatus(project: ArchitectureProject | null, property: ArchitectureProperty): ArchitecturePropertyViewStatus {
  if (project) {
    return project.status
  }

  return property.status === 'inactive' ? 'completed' : 'unassigned'
}

function getViewSummary(project: ArchitectureProject | null, property: ArchitectureProperty) {
  return project?.summary ?? property.summary
}

function getViewLead(project: ArchitectureProject | null, property: ArchitectureProperty) {
  return project?.lead ?? property.owner ?? 'No cohort assigned yet'
}

export function buildArchitecturePropertyViews(
  properties: ArchitectureProperty[],
  projects: ArchitectureProject[] = architectureProjects,
): ArchitecturePropertyView[] {
  const projectByPropertyId = new Map(projects.map((project) => [project.propertyId, project]))
  const views = properties.map((property) => {
    const project = projectByPropertyId.get(property.id) ?? null

    return {
      id: property.id,
      slug: property.slug,
      title: property.title,
      status: getViewStatus(project, property),
      summary: getViewSummary(project, property),
      location: property.address,
      city: property.city,
      lat: property.lat,
      lng: property.lng,
      lead: getViewLead(project, property),
      tracks: project?.tracks ?? [],
      openToParticipants: project?.openToParticipants ?? false,
      ngoConnections: project?.ngoConnections ?? [],
      property,
      project,
    }
  })

  return views.sort((left, right) => {
    if (left.project && !right.project) return -1
    if (!left.project && right.project) return 1
    return left.title.localeCompare(right.title)
  })
}

export async function listArchitectureProperties() {
  const seededById = new Map(seedArchitectureProperties.map((property) => [property.id, property]))

  if (!db) {
    return seedArchitectureProperties
  }

  try {
    const snapshot = await getDocs(collection(db, ngoConfig.firestoreCollections.properties))
    const mergedById = new Map(seededById)

    snapshot.forEach((documentSnapshot) => {
      const fallback = seededById.get(documentSnapshot.id) ?? null
      mergedById.set(
        documentSnapshot.id,
        normalizeStoredProperty(
          documentSnapshot.id,
          documentSnapshot.data() as Record<string, unknown>,
          fallback,
        ),
      )
    })

    return Array.from(mergedById.values())
  } catch (error) {
    console.error('Unable to load stored architecture properties. Falling back to seed data.', error)
    return seedArchitectureProperties
  }
}

export async function listArchitecturePropertyViews() {
  const properties = await listArchitectureProperties()
  return buildArchitecturePropertyViews(properties)
}

export async function getArchitecturePropertyViewBySlug(slug: string) {
  const views = await listArchitecturePropertyViews()
  return views.find((view) => view.slug === slug) ?? null
}

export async function upsertArchitectureProperties(properties: ArchitectureProperty[]) {
  if (!db) {
    return { persisted: false, count: 0 }
  }

  const firestore = db
  const batch = writeBatch(firestore)

  properties.forEach((property) => {
    batch.set(doc(firestore, ngoConfig.firestoreCollections.properties, property.id), property, {
      merge: true,
    })
  })

  await batch.commit()

  return { persisted: true, count: properties.length }
}

export async function markPropertiesInactiveBySourceDataset(
  sourceDataset: string,
  activePropertyIds: Set<string>,
) {
  if (!db) {
    return { persisted: false, count: 0 }
  }

  const firestore = db
  const snapshot = await getDocs(collection(firestore, ngoConfig.firestoreCollections.properties))
  const updates = snapshot.docs.filter((documentSnapshot) => {
    const data = documentSnapshot.data() as Record<string, unknown>
    return data.sourceDataset === sourceDataset && !activePropertyIds.has(documentSnapshot.id)
  })

  if (updates.length === 0) {
    return { persisted: true, count: 0 }
  }

  const batch = writeBatch(firestore)
  const now = new Date().toISOString()

  updates.forEach((documentSnapshot) => {
    batch.set(
      doc(firestore, ngoConfig.firestoreCollections.properties, documentSnapshot.id),
      {
        status: 'inactive',
        lastSyncedAt: now,
      },
      { merge: true },
    )
  })

  await batch.commit()

  return { persisted: true, count: updates.length }
}

export async function seedArchitectureProperty(property: ArchitectureProperty) {
  if (!db) {
    return { persisted: false }
  }

  const firestore = db
  await setDoc(doc(firestore, ngoConfig.firestoreCollections.properties, property.id), property, {
    merge: true,
  })
  return { persisted: true }
}

export function getArchitectureProjectById(projectId: string) {
  return architectureProjects.find((project) => project.id === projectId) ?? null
}

export function getArchitectureProjectBySlug(slug: string) {
  return architectureProjects.find((project) => project.slug === slug) ?? null
}

export function getArchitectureProjectStatusCounts(views: ArchitecturePropertyView[]) {
  return views.reduce<Record<ArchitecturePropertyViewStatus, number>>(
    (counts, view) => {
      counts[view.status] += 1
      return counts
    },
    {
      open: 0,
      active: 0,
      completed: 0,
      unassigned: 0,
    },
  )
}

export function isProjectStatus(value: string): value is ArchitectureProjectStatus {
  return value === 'open' || value === 'active' || value === 'completed'
}
