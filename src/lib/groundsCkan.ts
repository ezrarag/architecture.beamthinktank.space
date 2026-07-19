import {
  markPropertiesInactiveBySourceDataset,
  upsertArchitectureProperties,
} from './architectureData'
import { type ArchitectureProperty } from './ngoConfig'

interface CkanResource {
  id?: string
  name?: string
  title?: string
  url?: string
  format?: string
}

interface CkanPackageResponse {
  success?: boolean
  result?: {
    id?: string
    name?: string
    title?: string
    resources?: CkanResource[]
  }
}

interface CkanDatastoreResponse {
  success?: boolean
  result?: {
    records?: Array<Record<string, unknown>>
  }
}

export interface GroundsSyncConfig {
  baseUrl: string
  datasetId: string
  resourceId?: string | null
  apiKey?: string | null
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getString(record: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }

  return ''
}

function getOptionalString(record: Record<string, unknown>, aliases: string[]) {
  const value = getString(record, aliases)
  return value || null
}

function getNumber(record: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return null
}

function getStringList(record: Record<string, unknown>, aliases: string[]) {
  for (const alias of aliases) {
    const value = record[alias]
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function getPropertyStatus(record: Record<string, unknown>) {
  const status = getString(record, ['status', 'record_status', 'site_status']).toLowerCase()

  if (status === 'inactive' || status === 'retired' || status === 'closed') {
    return 'inactive' as const
  }

  return 'active' as const
}

function normalizeGroundsRecord(
  record: Record<string, unknown>,
  config: GroundsSyncConfig,
  resource: CkanResource | undefined,
): ArchitectureProperty | null {
  const sourceId = getString(record, ['id', '_id', 'property_id', 'site_id', 'record_id'])
  const title = getString(record, ['title', 'name', 'property_name', 'site_name'])
  const address = getString(record, ['address', 'street_address', 'location', 'site_address'])
  const city = getString(record, ['city', 'municipality', 'locality']) || 'Unknown'
  const lat = getNumber(record, ['lat', 'latitude', 'y'])
  const lng = getNumber(record, ['lng', 'lon', 'long', 'longitude', 'x'])

  if (!sourceId || !title || !address || lat == null || lng == null) {
    return null
  }

  const slugBase = getString(record, ['slug']) || title
  const id = slugify(getString(record, ['beam_property_id']) || sourceId || slugBase)
  const datasetPath = config.datasetId
  const resourcePath = resource?.id ? `/dataset/${datasetPath}/resource/${resource.id}` : `/dataset/${datasetPath}`

  return {
    id,
    slug: slugify(slugBase),
    sourceId,
    sourceDataset: config.datasetId,
    title,
    summary:
      getString(record, ['summary', 'description', 'notes']) ||
      `Synced from Grounds/CKAN dataset ${config.datasetId}.`,
    address,
    city,
    lat,
    lng,
    status: getPropertyStatus(record),
    rawSourceUrl: joinUrl(config.baseUrl, resourcePath),
    lastSyncedAt: new Date().toISOString(),
    parcel: getOptionalString(record, ['parcel', 'parcel_id', 'parcel_number']),
    use: getOptionalString(record, ['use', 'land_use', 'program_use']),
    type: getOptionalString(record, ['type', 'property_type', 'site_type']),
    owner: getOptionalString(record, ['owner', 'owner_name']),
    program: getOptionalString(record, ['program', 'initiative', 'cohort_program']),
    tags: getStringList(record, ['tags', 'keywords', 'categories']),
    documents: [],
    rawSourceRecord: record,
  }
}

async function fetchJson<T>(url: string, apiKey?: string | null) {
  const response = await fetch(url, {
    headers: apiKey ? { Authorization: apiKey } : undefined,
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    throw new Error(`Grounds request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

async function resolveResource(config: GroundsSyncConfig) {
  const packageResponse = await fetchJson<CkanPackageResponse>(
    joinUrl(config.baseUrl, `/api/3/action/package_show?id=${encodeURIComponent(config.datasetId)}`),
    config.apiKey,
  )

  if (!packageResponse.success || !packageResponse.result) {
    throw new Error('Grounds package_show request did not return a dataset result.')
  }

  const resources = packageResponse.result.resources ?? []
  const resource =
    resources.find((candidate) => candidate.id === config.resourceId) ??
    resources[0]

  if (!resource?.id) {
    throw new Error('Grounds dataset has no CKAN resource to sync.')
  }

  return resource
}

export async function fetchGroundsProperties(config: GroundsSyncConfig) {
  const resource = await resolveResource(config)
  const resourceId = resource.id

  if (!resourceId) {
    throw new Error('Grounds resource id is missing.')
  }

  const datastoreResponse = await fetchJson<CkanDatastoreResponse>(
    joinUrl(
      config.baseUrl,
      `/api/3/action/datastore_search?resource_id=${encodeURIComponent(resourceId)}&limit=1000`,
    ),
    config.apiKey,
  )

  if (!datastoreResponse.success) {
    throw new Error('Grounds datastore_search request did not succeed.')
  }

  const properties = (datastoreResponse.result?.records ?? [])
    .map((record) => normalizeGroundsRecord(record, config, resource))
    .filter((record): record is ArchitectureProperty => record != null)

  return {
    resource,
    properties,
  }
}

export async function syncGroundsProperties(config: GroundsSyncConfig) {
  const { resource, properties } = await fetchGroundsProperties(config)
  const propertyIds = new Set(properties.map((property) => property.id))
  const upsertResult = await upsertArchitectureProperties(properties)
  const inactiveResult = await markPropertiesInactiveBySourceDataset(config.datasetId, propertyIds)

  return {
    datasetId: config.datasetId,
    resourceId: resource.id ?? null,
    fetchedCount: properties.length,
    persisted: upsertResult.persisted && inactiveResult.persisted,
    upsertedCount: upsertResult.count,
    inactivatedCount: inactiveResult.count,
    properties,
  }
}
