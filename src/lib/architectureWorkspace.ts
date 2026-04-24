import { architectureProjects, type ArchitectureProject } from './ngoConfig'

export type GrantStatus = 'draft' | 'submitted' | 'awarded' | 'declined' | 'pending'
export type BudgetPaymentMethod = 'equity_formula' | 'stipend' | 'grant_direct'
export type BudgetAllocationStatus = 'proposed' | 'approved' | 'paid'
export type TeamRole = 'lead' | 'researcher' | 'fabrication' | 'documentation' | 'liaison'
export type CorrespondenceType = 'email' | 'letter' | 'meeting' | 'phone'
export type CorrespondenceStatus = 'draft' | 'sent' | 'responded' | 'no_response'
export type MaterialType = 'drawing' | 'photo' | 'report' | 'grant_doc' | 'survey' | 'reference'
export type SuggestionCategory = 'budget' | 'design' | 'outreach' | 'timeline' | 'other'
export type SuggestionStatus = 'open' | 'adopted' | 'declined'
export type InviteStatus = 'pending' | 'accepted' | 'declined'
export type WorkspaceTabId =
  | 'overview'
  | 'todo'
  | 'notes'
  | 'correspondence'
  | 'materials'
  | 'suggestions'
  | 'meetings'
  | 'invite'

export interface WorkspaceGrantProposal {
  title: string
  submittedTo: string
  submittedBy: string
  submissionDate?: string | null
  amount: number
  status: GrantStatus
  documentUrl?: string | null
  notes: string
}

export interface WorkspaceBudgetAllocation {
  participantId: string
  participantName: string
  role: string
  allocatedAmount: number
  paymentMethod: BudgetPaymentMethod
  status: BudgetAllocationStatus
  financeNGORef?: string | null
}

export interface WorkspaceTeamMember {
  participantId: string
  name: string
  role: TeamRole
  institution: string
  email: string
  joinedAt: string
}

export interface WorkspaceTodo {
  id: string
  text: string
  assignedTo?: string | null
  dueDate?: string | null
  completed: boolean
  createdBy: string
  createdAt: string
}

export interface WorkspaceNote {
  id: string
  authorId: string
  authorName: string
  content: string
  pinned: boolean
  createdAt: string
}

export interface WorkspaceCorrespondence {
  id: string
  type: CorrespondenceType
  to: string
  subject: string
  summary: string
  sentAt: string
  sentBy: string
  status: CorrespondenceStatus
}

export interface WorkspaceMaterial {
  id: string
  title: string
  type: MaterialType
  url: string
  uploadedBy: string
  uploadedAt: string
  notes: string
}

export interface WorkspaceSuggestion {
  id: string
  authorId: string
  authorName: string
  content: string
  category: SuggestionCategory
  votes: number
  votedBy: string[]
  status: SuggestionStatus
  createdAt: string
}

export interface WorkspaceMeeting {
  id: string
  title: string
  date: string
  attendees: string[]
  notes: string
  actionItems: string[]
  recordedBy: string
}

export interface ArchitectureWorkspace {
  id: string
  projectId: string
  projectTitle: string
  grantProposal: WorkspaceGrantProposal
  budgetAllocations: WorkspaceBudgetAllocation[]
  teamMembers: WorkspaceTeamMember[]
  todos: WorkspaceTodo[]
  notes: WorkspaceNote[]
  correspondence: WorkspaceCorrespondence[]
  materials: WorkspaceMaterial[]
  suggestions: WorkspaceSuggestion[]
  meetings: WorkspaceMeeting[]
  updatedAt: string
  createdAt: string
}

export interface ArchitectureInvite {
  id: string
  projectId: string
  invitedBy: string
  invitedEmail: string
  invitedName: string
  proposedRole: string
  message: string
  status: InviteStatus
  sentAt: string
  respondedAt?: string | null
}

export interface WorkspaceTabDefinition {
  id: WorkspaceTabId
  label: string
  shortLabel: string
}

export const workspaceTabs: WorkspaceTabDefinition[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview' },
  { id: 'todo', label: 'To-Do', shortLabel: 'To-Do' },
  { id: 'notes', label: 'Notes', shortLabel: 'Notes' },
  { id: 'correspondence', label: 'Correspondence', shortLabel: 'Comms' },
  { id: 'materials', label: 'Materials', shortLabel: 'Files' },
  { id: 'suggestions', label: 'Suggestions', shortLabel: 'Ideas' },
  { id: 'meetings', label: 'Meetings', shortLabel: 'Meetings' },
  { id: 'invite', label: 'Invite', shortLabel: 'Invite' },
]

export function getArchitectureProjectById(projectId: string) {
  return architectureProjects.find((project) => project.id === projectId) ?? null
}

export function getArchitectureProjectBySlug(slug: string) {
  return architectureProjects.find((project) => project.slug === slug) ?? null
}

export function createWorkspaceItemId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function getFinanceNgoUrl(projectId: string) {
  return `https://finance.beamthinktank.space/equity?category=accounting&project=${encodeURIComponent(projectId)}`
}

function createBaseWorkspace(project: ArchitectureProject, createdAt: string): ArchitectureWorkspace {
  return {
    id: project.id,
    projectId: project.id,
    projectTitle: project.title,
    grantProposal: {
      title: `${project.title} Grant Proposal`,
      submittedTo: '',
      submittedBy: '',
      submissionDate: null,
      amount: 0,
      status: 'draft',
      documentUrl: null,
      notes: `${project.title} workspace initialized for BEAM Architecture.`,
    },
    budgetAllocations: [],
    teamMembers: [],
    todos: [],
    notes: [],
    correspondence: [],
    materials: [],
    suggestions: [],
    meetings: [],
    updatedAt: createdAt,
    createdAt,
  }
}

export function createWorkspaceSeed(project: ArchitectureProject): ArchitectureWorkspace {
  const now = new Date().toISOString()

  if (project.id !== 'central-umc') {
    return createBaseWorkspace(project, now)
  }

  return {
    ...createBaseWorkspace(project, now),
    grantProposal: {
      title: 'Historic Preservation and Adaptive Reuse Assessment - Central United Methodist Church',
      submittedTo: 'Wisconsin Historic Preservation Office / pending determination',
      submittedBy: 'Ezra Haugabrooks / BEAM Architecture',
      amount: 0,
      status: 'draft',
      notes:
        'Initial assessment phase. Grant target and submission timeline TBD pending Rev. Viviane Thomas-Breitfeld meeting.',
    },
    teamMembers: [
      {
        participantId: 'ezra',
        name: 'Ezra Haugabrooks',
        role: 'lead',
        institution: 'UWM',
        email: 'ezra.haugabrooks@gmail.com',
        joinedAt: now,
      },
    ],
    todos: [
      {
        id: 'todo-1',
        text: 'Schedule site visit with Rev. Viviane Thomas-Breitfeld',
        assignedTo: 'ezra',
        dueDate: null,
        completed: false,
        createdBy: 'ezra',
        createdAt: now,
      },
      {
        id: 'todo-2',
        text: 'Confirm grant eligibility with Wisconsin Historic Preservation Office',
        assignedTo: null,
        dueDate: null,
        completed: false,
        createdBy: 'ezra',
        createdAt: now,
      },
      {
        id: 'todo-3',
        text: 'Invite William Krueger (UWM Waukesha) to fabrication track',
        assignedTo: null,
        dueDate: null,
        completed: false,
        createdBy: 'ezra',
        createdAt: now,
      },
      {
        id: 'todo-4',
        text: 'Connect architecture cohort to Krissi for AR/VR space mapping',
        assignedTo: null,
        dueDate: null,
        completed: false,
        createdBy: 'ezra',
        createdAt: now,
      },
    ],
    notes: [
      {
        id: 'note-1',
        authorId: 'ezra',
        authorName: 'Ezra Haugabrooks',
        content:
          'Central UMC is the anchor pilot. Rev. Viviane Thomas-Breitfeld is the primary contact. Site is a 121-year-old community church on the Near Westside. Tracks: Historic Preservation, Accessibility Planning, Adaptive Reuse.',
        pinned: true,
        createdAt: now,
      },
    ],
  }
}

export function projectSeedIncludesEmail(projectId: string, email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail) {
    return false
  }

  const project = getArchitectureProjectById(projectId)

  if (!project) {
    return false
  }

  return createWorkspaceSeed(project).teamMembers.some(
    (member) => member.email.trim().toLowerCase() === normalizedEmail,
  )
}

export function workspaceIncludesUser(
  workspace: ArchitectureWorkspace | null,
  user: { uid?: string | null; email?: string | null },
) {
  if (!workspace) {
    return false
  }

  const normalizedEmail = user.email?.trim().toLowerCase() ?? ''

  return workspace.teamMembers.some(
    (member) =>
      member.participantId === user.uid ||
      (normalizedEmail.length > 0 && member.email.trim().toLowerCase() === normalizedEmail),
  )
}
