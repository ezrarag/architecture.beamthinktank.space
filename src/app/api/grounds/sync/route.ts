import { NextResponse } from 'next/server'
import { syncGroundsProperties } from '@/lib/groundsCkan'

function getGroundsConfig() {
  const baseUrl = process.env.GROUNDS_CKAN_BASE_URL?.trim() || ''
  const datasetId = process.env.GROUNDS_CKAN_DATASET_ID?.trim() || ''
  const resourceId = process.env.GROUNDS_CKAN_RESOURCE_ID?.trim() || null
  const apiKey = process.env.GROUNDS_CKAN_API_KEY?.trim() || null

  if (!baseUrl || !datasetId) {
    return null
  }

  return {
    baseUrl,
    datasetId,
    resourceId,
    apiKey,
  }
}

function isAuthorized(request: Request) {
  const configuredToken = process.env.GROUNDS_SYNC_TOKEN?.trim()

  if (!configuredToken) {
    return true
  }

  const headerToken = request.headers.get('x-grounds-sync-token')?.trim()
  return headerToken === configuredToken
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized grounds sync request.' }, { status: 401 })
  }

  const config = getGroundsConfig()

  if (!config) {
    return NextResponse.json(
      {
        error:
          'Grounds sync is not configured. Set GROUNDS_CKAN_BASE_URL and GROUNDS_CKAN_DATASET_ID.',
      },
      { status: 400 },
    )
  }

  try {
    const result = await syncGroundsProperties(config)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Grounds sync failed.',
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  return POST(request)
}
