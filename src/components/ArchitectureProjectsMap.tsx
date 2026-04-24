'use client'

import { useEffect, useRef, useState } from 'react'
import { importLibrary, setOptions } from '@googlemaps/js-api-loader'
import type { ArchitectureProject } from '@/lib/ngoConfig'

type MapMode = 'data' | 'flyin'

type ProjectMapMarker = {
  setMap: (map: google.maps.Map | null) => void
  setSelected: (isSelected: boolean) => void
}

interface ArchitectureProjectsMapProps {
  projects: ArchitectureProject[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
}

const fallbackCenter = { lat: 43.0389, lng: -87.9065 }

const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0c1713' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0c1713' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7f9585' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#20312a' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#14251f' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#18362d' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1b2b24' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f1714' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#355443' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#0f1714' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1110' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5c7768' }] },
]

const projectStatusMarkerColors: Record<ArchitectureProject['status'], string> = {
  open: '#c8b99a',
  active: '#88aa8f',
  completed: '#555',
}

let configuredMapsApiKey: string | null = null

function isMappableProject(project: ArchitectureProject) {
  return Number.isFinite(project.lat) && Number.isFinite(project.lng) && !(project.lat === 0 && project.lng === 0)
}

function applyProjectMarkerStyles(
  element: HTMLButtonElement,
  status: ArchitectureProject['status'],
  isSelected: boolean,
) {
  const size = isSelected ? 20 : 14

  element.style.position = 'absolute'
  element.style.left = '0'
  element.style.top = '0'
  element.style.width = `${size}px`
  element.style.height = `${size}px`
  element.style.padding = '0'
  element.style.borderRadius = '9999px'
  element.style.border = `${isSelected ? 3 : 2}px solid ${isSelected ? '#edf3ea' : '#0b1712'}`
  element.style.backgroundColor = projectStatusMarkerColors[status]
  element.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.38)'
  element.style.cursor = 'pointer'
  element.style.transform = 'translate(-50%, -50%)'
  element.style.transition =
    'width 160ms ease, height 160ms ease, border-color 160ms ease, box-shadow 160ms ease'
  element.style.zIndex = isSelected ? '100' : '1'
  element.setAttribute('aria-pressed', String(isSelected))
}

function createProjectMarker({
  map,
  position,
  title,
  status,
  isSelected,
  onClick,
}: {
  map: google.maps.Map
  position: google.maps.LatLngLiteral
  title: string
  status: ArchitectureProject['status']
  isSelected: boolean
  onClick: () => void
}): ProjectMapMarker {
  class ProjectMarkerOverlay extends google.maps.OverlayView {
    private readonly element: HTMLButtonElement
    private isSelected: boolean

    constructor() {
      super()

      this.isSelected = isSelected
      this.element = document.createElement('button')
      this.element.type = 'button'
      this.element.title = title
      this.element.setAttribute('aria-label', title)
      this.element.style.appearance = 'none'
      this.element.style.outline = 'none'
      applyProjectMarkerStyles(this.element, status, this.isSelected)
      this.element.addEventListener('click', this.handleClick)
    }

    draw() {
      const point = this.getProjection().fromLatLngToDivPixel(position)
      if (!point) return

      this.element.style.left = `${point.x}px`
      this.element.style.top = `${point.y}px`
    }

    onAdd() {
      const pane = this.getPanes()?.overlayMouseTarget
      if (!pane) return

      google.maps.OverlayView.preventMapHitsFrom(this.element)
      pane.appendChild(this.element)
    }

    onRemove() {
      this.element.removeEventListener('click', this.handleClick)
      this.element.remove()
    }

    setSelected(nextSelected: boolean) {
      if (this.isSelected === nextSelected) return

      this.isSelected = nextSelected
      applyProjectMarkerStyles(this.element, status, this.isSelected)
    }

    private readonly handleClick = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      onClick()
    }
  }

  const marker = new ProjectMarkerOverlay()
  marker.setMap(map)
  return marker
}

function resolveCenter(projects: ArchitectureProject[]) {
  if (!projects.length) return fallbackCenter

  return {
    lat: projects.reduce((sum, project) => sum + project.lat, 0) / projects.length,
    lng: projects.reduce((sum, project) => sum + project.lng, 0) / projects.length,
  }
}

function ensureMapsLoader(apiKey: string, mapIds: string[]) {
  if (configuredMapsApiKey) return

  setOptions({
    key: apiKey,
    v: 'weekly',
    mapIds,
  })

  configuredMapsApiKey = apiKey
}

export default function ArchitectureProjectsMap({
  projects,
  selectedProjectId,
  onSelectProject,
}: ArchitectureProjectsMapProps) {
  const [mode, setMode] = useState<MapMode>('data')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Array<{ projectId: string; marker: ProjectMapMarker }>>([])
  const onSelectProjectRef = useRef(onSelectProject)
  const selectedProjectIdRef = useRef<string | null>(selectedProjectId)

  useEffect(() => {
    onSelectProjectRef.current = onSelectProject
  }, [onSelectProject])

  useEffect(() => {
    selectedProjectIdRef.current = selectedProjectId
  }, [selectedProjectId])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || ''
  const configuredMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || ''
  const hasApiKey = Boolean(apiKey && apiKey !== 'undefined')
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null
  const selectedMappableProject =
    selectedProject && isMappableProject(selectedProject) ? selectedProject : null

  useEffect(() => {
    if (!hasApiKey || !containerRef.current) {
      setLoading(false)
      return
    }

    let isCancelled = false

    async function initializeMap() {
      try {
        setLoading(true)
        setError('')
        ensureMapsLoader(apiKey, configuredMapId ? [configuredMapId] : ['DEMO_MAP_ID'])
        const nextMappableProjects = projects.filter(isMappableProject)
        const nextSelectedProject =
          projects.find((project) => project.id === selectedProjectIdRef.current) ?? null
        const nextSelectedMappableProject =
          nextSelectedProject && isMappableProject(nextSelectedProject) ? nextSelectedProject : null

        const { Map } = (await importLibrary('maps')) as google.maps.MapsLibrary

        if (isCancelled || !containerRef.current) return

        markersRef.current.forEach(({ marker }) => marker.setMap(null))
        markersRef.current = []

        const isFlyinMode = mode === 'flyin'
        const map = new Map(containerRef.current, {
          center: resolveCenter(nextMappableProjects),
          zoom: nextMappableProjects.length > 0 ? 11 : 9,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          backgroundColor: '#08110d',
          colorScheme: google.maps.ColorScheme.DARK,
          tiltInteractionEnabled: isFlyinMode,
          headingInteractionEnabled: isFlyinMode,
          cameraControl: isFlyinMode,
          ...(isFlyinMode
            ? {
                mapId: configuredMapId || Map.DEMO_MAP_ID,
                renderingType: google.maps.RenderingType.VECTOR,
              }
            : {
                styles: mapStyles,
              }),
        })

        mapRef.current = map

        if (nextMappableProjects.length > 0) {
          if (mode === 'data') {
            const bounds = new google.maps.LatLngBounds()
            nextMappableProjects.forEach((project) => {
              bounds.extend({ lat: project.lat, lng: project.lng })
            })

            if (nextMappableProjects.length === 1) {
              map.setCenter(bounds.getCenter())
              map.setZoom(14)
            } else {
              map.fitBounds(bounds, 72)
            }
          } else if (nextSelectedMappableProject) {
            map.moveCamera({
              center: { lat: nextSelectedMappableProject.lat, lng: nextSelectedMappableProject.lng },
              tilt: 67.5,
              heading: 0,
              zoom: 18,
            })
          }
        }

        markersRef.current = nextMappableProjects.map((project) => {
          const marker = createProjectMarker({
            map,
            position: { lat: project.lat, lng: project.lng },
            title: project.title,
            status: project.status,
            isSelected: project.id === selectedProjectIdRef.current,
            onClick: () => {
              onSelectProjectRef.current(project.id)
            },
          })

          return { projectId: project.id, marker }
        })
      } catch (loadError) {
        if (isCancelled) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load Google Maps.')
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    void initializeMap()

    return () => {
      isCancelled = true
      markersRef.current.forEach(({ marker }) => marker.setMap(null))
      markersRef.current = []
      mapRef.current = null
    }
  }, [apiKey, configuredMapId, hasApiKey, mode, projects])

  useEffect(() => {
    if (!mapRef.current) return

    const nextMappableProjects = projects.filter(isMappableProject)

    markersRef.current.forEach(({ projectId, marker }) => {
      const project = nextMappableProjects.find((candidate) => candidate.id === projectId)
      if (!project) return

      marker.setSelected(projectId === selectedProjectId)
    })

    if (mode === 'flyin' && selectedMappableProject) {
      mapRef.current.moveCamera({
        center: { lat: selectedMappableProject.lat, lng: selectedMappableProject.lng },
        tilt: 67.5,
        heading: 0,
        zoom: 18,
      })
    }

    if (mode === 'data' && selectedMappableProject) {
      mapRef.current.panTo({ lat: selectedMappableProject.lat, lng: selectedMappableProject.lng })
    }
  }, [loading, mode, projects, selectedMappableProject, selectedProjectId])

  return (
    <section className="panel panel-dark">
      <div className="relative z-[1]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow !text-[rgba(247,242,232,0.72)]">Projects Map</p>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--chalk)]">Explore live BEAM Architecture sites</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[rgba(247,242,232,0.72)]">
              Site Map mode shows the active project landscape. 3D View flies the camera to the selected project for a closer site read.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-[#0f1c17] p-1">
            <button
              type="button"
              disabled={!hasApiKey}
              onClick={() => setMode('data')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'data' ? 'bg-[#c8b99a] text-[#0b1712]' : 'text-white/74 hover:text-white'
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              Site Map
            </button>
            <button
              type="button"
              disabled={!hasApiKey}
              onClick={() => setMode('flyin')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === 'flyin' ? 'bg-[#88aa8f] text-[#0b1712]' : 'text-white/74 hover:text-white'
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              3D View
            </button>
          </div>
        </div>

        {!hasApiKey ? (
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#0f1c17] p-6 text-sm leading-7 text-white/72">
            <p className="font-medium text-white">Map requires a Google Maps API key.</p>
            <p className="mt-2">Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your environment variables.</p>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-[1.5rem] border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-100">
            {error}
          </div>
        ) : (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
              {Object.entries(projectStatusMarkerColors).map(([status, color]) => (
                <div
                  key={status}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/74"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize">{status}</span>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
              <div ref={containerRef} className="h-[280px] w-full bg-[#08110d] md:h-[420px]" />

              {loading ? <div className="absolute inset-0 animate-pulse bg-[#08110d]" /> : null}

              {mode === 'flyin' && !selectedMappableProject ? (
                <div className="pointer-events-none absolute inset-x-4 top-4 rounded-[1.1rem] border border-white/10 bg-[#07100c]/90 px-4 py-3 text-sm text-white/74 backdrop-blur-sm">
                  {selectedProject && !selectedMappableProject
                    ? 'Selected project does not have valid coordinates yet.'
                    : 'Select a project to fly in.'}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
