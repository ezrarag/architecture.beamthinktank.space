export type NGORole = 'admin' | 'faculty' | 'participant' | 'public'
export type ArchitectureProjectStatus = 'open' | 'active' | 'completed'
export type ArchitecturePropertyStatus = 'active' | 'inactive'
export type ArchitecturePropertyViewStatus = ArchitectureProjectStatus | 'unassigned'

export interface NGOConnection {
  id: string
  label: string
  href: string
  summary: string
}

export interface ArchitecturePropertyDocument {
  label: string
  href: string
}

export interface ArchitectureProperty {
  id: string
  slug: string
  sourceId: string
  sourceDataset: string
  title: string
  summary: string
  address: string
  city: string
  lat: number
  lng: number
  status: ArchitecturePropertyStatus
  rawSourceUrl: string
  lastSyncedAt: string
  parcel?: string | null
  use?: string | null
  type?: string | null
  owner?: string | null
  program?: string | null
  tags: string[]
  documents: ArchitecturePropertyDocument[]
  rawSourceRecord?: Record<string, unknown> | null
}

export interface ArchitectureProject {
  id: string
  propertyId: string
  title: string
  slug: string
  status: ArchitectureProjectStatus
  location: string
  city: string
  lat: number
  lng: number
  lead: string
  facultyLead?: string | null
  summary: string
  whatCohortIsDoing: string
  stage: string
  participantStatus: string
  tracks: string[]
  deliverables: string[]
  nextActions: string[]
  openToParticipants: boolean
  ngoConnections: NGOConnection[]
}

export interface ArchitecturePropertyView {
  id: string
  slug: string
  title: string
  status: ArchitecturePropertyViewStatus
  summary: string
  location: string
  city: string
  lat: number
  lng: number
  lead: string
  tracks: string[]
  openToParticipants: boolean
  ngoConnections: NGOConnection[]
  property: ArchitectureProperty
  project: ArchitectureProject | null
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
    properties: string
    participants: string
    areas: string
    sites: string
    milestones: string
  }
}

export const seedArchitectureProperties: ArchitectureProperty[] = [
  {
    id: 'central-umc',
    slug: 'central-umc',
    sourceId: 'beam-seed-central-umc',
    sourceDataset: 'beam-seed',
    title: 'Central UMC',
    summary:
      'Historic church property on Milwaukee’s Near Westside used as the anchor BEAM Architecture pilot for documentation and phased reuse planning.',
    address: '639 N 25th Street, Milwaukee',
    city: 'Milwaukee',
    lat: 43.0465,
    lng: -87.9387,
    status: 'active',
    rawSourceUrl: 'https://architecture.beamthinktank.space/projects',
    lastSyncedAt: '2026-06-07T00:00:00.000Z',
    parcel: null,
    use: 'Religious / community facility',
    type: 'Historic church',
    owner: 'Central United Methodist Church',
    program: 'Adaptive reuse / preservation pilot',
    tags: ['historic', 'adaptive reuse', 'accessibility', 'near westside'],
    documents: [],
    rawSourceRecord: null,
  },
  {
    id: 'waukesha-fabrication-studio',
    slug: 'waukesha-fabrication-studio',
    sourceId: 'beam-seed-waukesha-fabrication-studio',
    sourceDataset: 'beam-seed',
    title: 'UWM Waukesha Prototyping Studio',
    summary:
      'Campus-based fabrication site for architecture prototyping, materials testing, and cohort-led build experimentation.',
    address: 'UWM Waukesha Campus',
    city: 'Waukesha',
    lat: 43.0117,
    lng: -88.2315,
    status: 'active',
    rawSourceUrl: 'https://architecture.beamthinktank.space/projects',
    lastSyncedAt: '2026-06-07T00:00:00.000Z',
    parcel: null,
    use: 'Academic / fabrication',
    type: 'Campus prototyping studio',
    owner: 'University of Wisconsin-Milwaukee at Waukesha',
    program: 'Fabrication cohort collaboration',
    tags: ['fabrication', 'campus', 'prototyping'],
    documents: [],
    rawSourceRecord: null,
  },
  {
    id: 'beam-summer-project',
    slug: 'beam-summer-project',
    sourceId: 'beam-seed-beam-summer-project',
    sourceDataset: 'beam-seed',
    title: 'BEAM Summer Design-Build',
    summary:
      'Placeholder property record for a live summer site that will host an interdisciplinary design-build cohort.',
    address: 'Milwaukee / TBD',
    city: 'Milwaukee',
    lat: 43.0389,
    lng: -87.9065,
    status: 'active',
    rawSourceUrl: 'https://architecture.beamthinktank.space/projects',
    lastSyncedAt: '2026-06-07T00:00:00.000Z',
    parcel: null,
    use: 'TBD',
    type: 'Prospective site',
    owner: null,
    program: 'Summer design-build',
    tags: ['summer', 'design-build', 'tbd'],
    documents: [],
    rawSourceRecord: null,
  },
]

export const architectureProjects: ArchitectureProject[] = [
  {
    id: 'central-umc',
    propertyId: 'central-umc',
    title: 'Central UMC',
    slug: 'central-umc',
    status: 'active',
    location: '639 N 25th Street, Milwaukee',
    city: 'Milwaukee',
    lat: 43.0465,
    lng: -87.9387,
    lead: 'BEAM Architecture / Rev. Viviane Thomas-Breitfeld',
    facultyLead: 'Faculty advisory track pending confirmation',
    summary:
      'Documentation, preservation framing, adaptive reuse thinking, and accessibility review for a 121-year-old community anchor on the Near Westside.',
    whatCohortIsDoing:
      'The cohort is documenting existing conditions, framing preservation and accessibility constraints, and producing a phased handoff package that can support reuse planning and next-stage fundraising.',
    stage: 'Existing conditions and phased planning',
    participantStatus: 'Open to architecture and preservation participants',
    tracks: ['Historic Preservation', 'Accessibility Planning', 'Adaptive Reuse'],
    deliverables: [
      'Existing conditions documentation package',
      'Accessibility and circulation review',
      'Preservation / reuse framing memo',
    ],
    nextActions: [
      'Schedule the next site visit with church leadership',
      'Confirm preservation grant positioning',
      'Coordinate AR/VR mapping support',
    ],
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
    propertyId: 'waukesha-fabrication-studio',
    title: 'UWM Waukesha Prototyping Studio',
    slug: 'waukesha-fabrication-studio',
    status: 'open',
    location: 'UWM Waukesha Campus',
    city: 'Waukesha',
    lat: 43.0117,
    lng: -88.2315,
    lead: 'William Krueger, UWM Architecture',
    facultyLead: 'UWM Architecture',
    summary:
      'A fabrication-led collaboration with UWM Architecture using the Waukesha prototyping campus to bridge design, material testing, and built outcomes.',
    whatCohortIsDoing:
      'The cohort is setting up a fabrication-first workflow around prototyping, material testing, and translation from speculative design work into physically reviewable assemblies.',
    stage: 'Cohort formation and fabrication scoping',
    participantStatus: 'Recruiting fabrication and architecture participants',
    tracks: ['Fabrication', 'Architecture'],
    deliverables: [
      'Prototype fabrication plan',
      'Material testing log',
      'Studio-to-site deployment outline',
    ],
    nextActions: [
      'Confirm semester framing with faculty partners',
      'Define equipment access and safety constraints',
      'Select initial prototype work packages',
    ],
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
    propertyId: 'beam-summer-project',
    title: 'BEAM Summer Design-Build',
    slug: 'beam-summer-project',
    status: 'open',
    location: 'Milwaukee / TBD',
    city: 'Milwaukee',
    lat: 43.0389,
    lng: -87.9065,
    lead: 'BEAM Architecture',
    facultyLead: null,
    summary:
      "A cohort-driven, interdisciplinary summer project of BEAM's own design - open scope, real site, real outcome. Architecture, preservation, fabrication, and community engagement working together.",
    whatCohortIsDoing:
      'BEAM is using this site slot to assemble a summer cohort around a live property, define a practical scope, and move from site selection into a real design-build execution path.',
    stage: 'Site selection and program definition',
    participantStatus: 'Open to interdisciplinary summer cohort participants',
    tracks: ['Architecture', 'Fabrication', 'Adaptive Reuse', 'Real Estate Strategy'],
    deliverables: [
      'Selected site brief',
      'Summer cohort work plan',
      'Design-build handoff package',
    ],
    nextActions: [
      'Confirm the final summer property',
      'Set faculty review cadence',
      'Lock the interdisciplinary scope and budget',
    ],
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
    properties: 'architectureProperties',
    participants: 'architectureParticipants',
    areas: 'architectureAreas',
    sites: 'architectureSites',
    milestones: 'architectureMilestones',
  },
}
