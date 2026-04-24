export type NGORole = 'admin' | 'faculty' | 'participant' | 'public'

export interface NGOConnection {
  id: string
  label: string
  href: string
  summary: string
}

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
  ngoConnections: NGOConnection[]
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
    workspaces: string
    invites: string
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
    ngoConnections: [
      {
        id: 'finance',
        label: 'Finance NGO',
        href: 'https://finance.beamthinktank.space/equity?category=accounting&project=central-umc',
        summary: 'Budget allocation approvals, equity planning, and grant-linked accounting.',
      },
      {
        id: 'education',
        label: 'Education NGO',
        href: 'https://education.beamthinktank.space',
        summary: 'Faculty coordination, cohort structure, and course-linked participation pathways.',
      },
      {
        id: 'home',
        label: 'BEAM Home',
        href: 'https://home.beamthinktank.space/admin',
        summary: 'Cross-site admin oversight, membership context, and shared operational controls.',
      },
    ],
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
    ngoConnections: [
      {
        id: 'finance',
        label: 'Finance NGO',
        href: 'https://finance.beamthinktank.space/equity?category=accounting&project=waukesha-fabrication-studio',
        summary: 'Equipment, stipend, and grant allocation tracking for fabrication workstreams.',
      },
      {
        id: 'transportation',
        label: 'Transportation NGO',
        href: 'https://transportation.beamthinktank.space',
        summary: 'Mobility and logistics planning for site visits, transport, and equipment access.',
      },
      {
        id: 'home',
        label: 'BEAM Home',
        href: 'https://home.beamthinktank.space/admin',
        summary: 'Shared admin coordination across the BEAM NGO stack.',
      },
    ],
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
    ngoConnections: [
      {
        id: 'finance',
        label: 'Finance NGO',
        href: 'https://finance.beamthinktank.space/equity?category=accounting&project=beam-summer-project',
        summary: 'Budget distribution, project stipends, and grant-backed allocations.',
      },
      {
        id: 'education',
        label: 'Education NGO',
        href: 'https://education.beamthinktank.space',
        summary: 'Summer cohort recruitment, curricular framing, and participant development.',
      },
      {
        id: 'transportation',
        label: 'Transportation NGO',
        href: 'https://transportation.beamthinktank.space',
        summary: 'Site logistics and travel coordination for a distributed design-build project.',
      },
    ],
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
    workspaces: 'architectureWorkspaces',
    invites: 'architectureInvites',
  },
}
