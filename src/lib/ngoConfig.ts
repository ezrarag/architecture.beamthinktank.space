export type NGORole = 'admin' | 'faculty' | 'participant' | 'public'

export interface ArchitectureProject {
  id: string
  title: string
  slug: string
  status: 'open' | 'active' | 'completed'
  location: string
  city: string
  lat: number
  lng: number
  lead: string
  summary: string
  tracks: string[]
  openToParticipants: boolean
}

export interface NGOConfig {
  id: string
  name: string
  subdomain: string
  siteUrl: string
  tagline: string
  primaryColor: string
  roles: NGORole[]
  defaultRole: NGORole
  firestoreCollections: {
    memberships: string
    projects: string
    projectMappings: string
  }
}

export const architectureProjects: ArchitectureProject[] = [
  {
    id: 'central-umc',
    title: 'Central UMC',
    slug: 'central-umc',
    status: 'active',
    location: '639 N 25th Street, Milwaukee',
    city: 'Milwaukee',
    lat: 43.0465,
    lng: -87.9387,
    lead: 'BEAM Architecture / Rev. Viviane Thomas-Breitfeld',
    summary:
      'Documentation, preservation framing, adaptive reuse thinking, and accessibility review for a 121-year-old community anchor on the Near Westside.',
    tracks: ['Historic Preservation', 'Accessibility Planning', 'Adaptive Reuse'],
    openToParticipants: true,
  },
  {
    id: 'waukesha-fabrication-studio',
    title: 'UWM Waukesha Prototyping Studio',
    slug: 'waukesha-fabrication-studio',
    status: 'open',
    location: 'UWM Waukesha Campus',
    city: 'Waukesha',
    lat: 43.0117,
    lng: -88.2315,
    lead: 'William Krueger, UWM Architecture',
    summary:
      'A fabrication-led collaboration with UWM Architecture using the Waukesha prototyping campus to bridge design, material testing, and built outcomes.',
    tracks: ['Fabrication', 'Architecture'],
    openToParticipants: true,
  },
  {
    id: 'beam-summer-project',
    title: 'BEAM Summer Design-Build',
    slug: 'beam-summer-project',
    status: 'open',
    location: 'Milwaukee / TBD',
    city: 'Milwaukee',
    lat: 43.0389,
    lng: -87.9065,
    lead: 'BEAM Architecture',
    summary:
      "A cohort-driven, interdisciplinary summer project of BEAM's own design — open scope, real site, real outcome. Architecture, preservation, fabrication, and community engagement working together.",
    tracks: ['Architecture', 'Fabrication', 'Adaptive Reuse', 'Real Estate Strategy'],
    openToParticipants: true,
  },
]

export const ngoConfig: NGOConfig = {
  id: 'architecture',
  name: 'BEAM Architecture',
  subdomain: 'architecture.beamthinktank.space',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://architecture.beamthinktank.space',
  tagline: 'University-linked cohorts connecting education to real built-environment projects',
  primaryColor: '#c8b99a',
  roles: ['admin', 'faculty', 'participant', 'public'],
  defaultRole: 'public',
  firestoreCollections: {
    memberships: 'architectureMemberships',
    projects: 'architectureProjects',
    projectMappings: 'architectureProjectMappings',
  },
}
