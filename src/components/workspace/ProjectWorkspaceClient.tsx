'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  FileText,
  FolderOpen,
  Lightbulb,
  Mail,
  MessageSquare,
  PencilLine,
  Phone,
  Pin,
  Plus,
  Trash2,
  UploadCloud,
  Users,
} from 'lucide-react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useAuth } from '@/lib/authContext'
import {
  createWorkspaceItemId,
  createWorkspaceSeed,
  getArchitectureProjectById,
  getFinanceNgoUrl,
  projectSeedIncludesEmail,
  workspaceIncludesUser,
  workspaceTabs,
  type ArchitectureInvite,
  type ArchitectureWorkspace,
  type CorrespondenceStatus,
  type CorrespondenceType,
  type MaterialType,
  type SuggestionCategory,
  type WorkspaceMeeting,
  type WorkspaceNote,
  type WorkspaceTabId,
  type WorkspaceTodo,
} from '@/lib/architectureWorkspace'
import { db } from '@/lib/firebase'
import { ngoConfig, type ArchitectureProject, type NGORole } from '@/lib/ngoConfig'

const projectStatusBadgeStyles = {
  open: 'border border-[#c8b99a]/50 bg-[#c8b99a]/18 text-[#6b5f49]',
  active: 'border border-[#88aa8f]/50 bg-[#88aa8f]/18 text-[#355443]',
  completed: 'border border-black/[0.15] bg-black/[0.08] text-[var(--ink-soft)]',
} as const

const grantStatusBadgeStyles = {
  draft: 'border border-black/10 bg-black/5 text-[var(--ink-soft)]',
  submitted: 'border border-[#557180]/25 bg-[#557180]/12 text-[#2f4f5f]',
  awarded: 'border border-[#2f7b57]/20 bg-[#2f7b57]/12 text-[#21523b]',
  declined: 'border border-[#8a3b3b]/20 bg-[#8a3b3b]/12 text-[#6f2b2b]',
  pending: 'border border-[#b48738]/20 bg-[#b48738]/12 text-[#7a5b27]',
} as const

const allocationStatusBadgeStyles = {
  proposed: 'border border-[#b48738]/20 bg-[#b48738]/12 text-[#7a5b27]',
  approved: 'border border-[#557180]/25 bg-[#557180]/12 text-[#2f4f5f]',
  paid: 'border border-[#2f7b57]/20 bg-[#2f7b57]/12 text-[#21523b]',
} as const

const suggestionStatusBadgeStyles = {
  open: 'border border-black/10 bg-black/5 text-[var(--ink-soft)]',
  adopted: 'border border-[#2f7b57]/20 bg-[#2f7b57]/12 text-[#21523b]',
  declined: 'border border-[#8a3b3b]/20 bg-[#8a3b3b]/12 text-[#6f2b2b]',
} as const

const correspondenceTypeOptions: CorrespondenceType[] = ['email', 'letter', 'meeting', 'phone']
const correspondenceStatusOptions: CorrespondenceStatus[] = [
  'draft',
  'sent',
  'responded',
  'no_response',
]
const materialTypeOptions: MaterialType[] = [
  'drawing',
  'photo',
  'report',
  'grant_doc',
  'survey',
  'reference',
]
const suggestionCategoryOptions: SuggestionCategory[] = [
  'budget',
  'design',
  'outreach',
  'timeline',
  'other',
]

const materialTypeLabels: Record<MaterialType, string> = {
  drawing: 'Drawing',
  photo: 'Photo',
  report: 'Report',
  grant_doc: 'Grant doc',
  survey: 'Survey',
  reference: 'Reference',
}

const suggestionCategoryLabels: Record<SuggestionCategory, string> = {
  budget: 'Budget',
  design: 'Design',
  outreach: 'Outreach',
  timeline: 'Timeline',
  other: 'Other',
}

const teamRoleLabels = {
  lead: 'Lead',
  researcher: 'Researcher',
  fabrication: 'Fabrication',
  documentation: 'Documentation',
  liaison: 'Liaison',
} as const

function formatDate(value?: string | null) {
  if (!value) {
    return 'No date set'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return 'No timestamp'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid timestamp'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function getSortableTime(value?: string | null) {
  if (!value) {
    return 0
  }

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function getDueDateTime(value?: string | null) {
  if (!value) {
    return Number.MAX_SAFE_INTEGER
  }

  const time = new Date(`${value}T00:00:00`).getTime()
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time
}

function isOwnNote(note: WorkspaceNote, user: { uid?: string | null; displayName?: string | null; email?: string | null }) {
  return (
    note.authorId === user.uid ||
    note.authorId === user.email ||
    (user.displayName != null && note.authorName === user.displayName)
  )
}

function getCorrespondenceIcon(type: CorrespondenceType) {
  switch (type) {
    case 'email':
      return Mail
    case 'meeting':
      return MessageSquare
    case 'phone':
      return Phone
    default:
      return FileText
  }
}

function getMeetingAttendeeNames(meeting: WorkspaceMeeting, workspace: ArchitectureWorkspace) {
  if (meeting.attendees.length === 0) {
    return 'No attendees logged'
  }

  return meeting.attendees
    .map((attendee) => {
      const teamMember = workspace.teamMembers.find(
        (member) => member.participantId === attendee || member.name === attendee,
      )

      return teamMember?.name ?? attendee
    })
    .join(', ')
}

function getProject(projectId: string) {
  return getArchitectureProjectById(projectId)
}

export default function ProjectWorkspaceClient({ projectId }: { projectId: string }) {
  const router = useRouter()
  const { loading, user } = useAuth()
  const project = getProject(projectId)
  const hasAttemptedSeedRef = useRef(false)

  const [role, setRole] = useState<NGORole>('participant')
  const [mappedProjectIds, setMappedProjectIds] = useState<Set<string>>(() => new Set())
  const [loadingAccess, setLoadingAccess] = useState(true)
  const [workspaceLoading, setWorkspaceLoading] = useState(true)
  const [initializingWorkspace, setInitializingWorkspace] = useState(false)
  const [workspace, setWorkspace] = useState<ArchitectureWorkspace | null>(null)
  const [invites, setInvites] = useState<ArchitectureInvite[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('overview')

  const [todoDraft, setTodoDraft] = useState({ text: '', assignedTo: '', dueDate: '' })
  const [noteDraft, setNoteDraft] = useState({ content: '', pinned: false })
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteDraft, setEditingNoteDraft] = useState({ content: '', pinned: false })
  const [correspondenceDraft, setCorrespondenceDraft] = useState<{
    type: CorrespondenceType
    to: string
    subject: string
    summary: string
    sentAt: string
    status: CorrespondenceStatus
  }>({
    type: 'email',
    to: '',
    subject: '',
    summary: '',
    sentAt: new Date().toISOString().slice(0, 10),
    status: 'draft',
  })
  const [emailDraft, setEmailDraft] = useState<{ to: string; subject: string; body: string } | null>(
    null,
  )
  const [materialDraft, setMaterialDraft] = useState<{ title: string; type: MaterialType; notes: string }>({
    title: '',
    type: 'drawing',
    notes: '',
  })
  const [materialFile, setMaterialFile] = useState<File | null>(null)
  const [materialFilter, setMaterialFilter] = useState<'all' | MaterialType>('all')
  const [suggestionDraft, setSuggestionDraft] = useState<{
    content: string
    category: SuggestionCategory
  }>({
    content: '',
    category: 'design',
  })
  const [meetingDraft, setMeetingDraft] = useState<{
    title: string
    date: string
    attendees: string[]
    notes: string
    actionItems: string[]
  }>({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    attendees: [],
    notes: '',
    actionItems: [''],
  })
  const [inviteDraft, setInviteDraft] = useState({
    invitedName: '',
    invitedEmail: '',
    proposedRole: '',
    message: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/projects?message=${encodeURIComponent('Sign in to access the project workspace.')}`,
      )
    }
  }, [loading, router, user])

  useEffect(() => {
    let cancelled = false

    async function loadAccess() {
      if (loading) {
        return
      }

      if (!user) {
        setLoadingAccess(false)
        return
      }

      if (!db) {
        setErrorMessage(
          'Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* env vars to enable workspace access.',
        )
        setLoadingAccess(false)
        return
      }

      try {
        setLoadingAccess(true)
        const [membershipSnapshot, mappingSnapshot] = await Promise.all([
          getDoc(doc(db, ngoConfig.firestoreCollections.memberships, user.uid)),
          getDocs(
            query(
              collection(db, ngoConfig.firestoreCollections.projectMappings),
              where('uid', '==', user.uid),
            ),
          ),
        ])

        if (cancelled) {
          return
        }

        setRole((membershipSnapshot.data()?.role as NGORole | undefined) ?? 'participant')
        setMappedProjectIds(
          new Set(
            mappingSnapshot.docs
              .map((snapshot) => snapshot.data().projectId)
              .filter((value): value is string => typeof value === 'string'),
          ),
        )
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Unable to confirm your workspace access.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingAccess(false)
        }
      }
    }

    void loadAccess()

    return () => {
      cancelled = true
    }
  }, [loading, user])

  useEffect(() => {
    if (!project || loading || !user || !db) {
      return
    }

    setWorkspaceLoading(true)
    setInitializingWorkspace(false)

    const workspaceRef = doc(db, ngoConfig.firestoreCollections.workspaces, project.id)
    const inviteQuery = query(
      collection(db, ngoConfig.firestoreCollections.invites),
      where('projectId', '==', project.id),
    )

    const unsubscribeWorkspace = onSnapshot(
      workspaceRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setWorkspace({
            ...(snapshot.data() as ArchitectureWorkspace),
            id: snapshot.id,
            projectId: project.id,
          })
          setWorkspaceLoading(false)
          setInitializingWorkspace(false)
          return
        }

        const canBootstrap =
          role === 'admin' ||
          mappedProjectIds.has(project.id) ||
          projectSeedIncludesEmail(project.id, user.email)

        if (canBootstrap && !hasAttemptedSeedRef.current) {
          hasAttemptedSeedRef.current = true
          setInitializingWorkspace(true)

          void setDoc(workspaceRef, createWorkspaceSeed(project)).catch((error) => {
            setErrorMessage(
              error instanceof Error ? error.message : 'Unable to initialize the workspace.',
            )
            setInitializingWorkspace(false)
            setWorkspaceLoading(false)
          })

          return
        }

        setWorkspace(null)
        setWorkspaceLoading(false)
        setInitializingWorkspace(false)
      },
      (error) => {
        setErrorMessage(error.message)
        setWorkspaceLoading(false)
        setInitializingWorkspace(false)
      },
    )

    const unsubscribeInvites = onSnapshot(
      inviteQuery,
      (snapshot) => {
        const nextInvites = snapshot.docs
          .map(
            (inviteSnapshot) =>
              ({
                ...(inviteSnapshot.data() as ArchitectureInvite),
                id: inviteSnapshot.id,
              }) satisfies ArchitectureInvite,
          )
          .sort((left, right) => getSortableTime(right.sentAt) - getSortableTime(left.sentAt))

        setInvites(nextInvites)
      },
      (error) => {
        setErrorMessage(error.message)
      },
    )

    return () => {
      unsubscribeWorkspace()
      unsubscribeInvites()
    }
  }, [loading, mappedProjectIds, project, role, user])

  const hasSeedAccess = user ? projectSeedIncludesEmail(projectId, user.email) : false
  const hasWorkspaceMemberAccess = user
    ? workspaceIncludesUser(workspace, { uid: user.uid, email: user.email })
    : false
  const hasWorkspaceAccess =
    role === 'admin' || mappedProjectIds.has(projectId) || hasSeedAccess || hasWorkspaceMemberAccess
  const isAdmin = role === 'admin'

  const sortedNotes = useMemo(() => {
    if (!workspace) {
      return []
    }

    return [...workspace.notes].sort(
      (left, right) =>
        Number(right.pinned) - Number(left.pinned) ||
        getSortableTime(right.createdAt) - getSortableTime(left.createdAt),
    )
  }, [workspace])

  const sortedCorrespondence = useMemo(() => {
    if (!workspace) {
      return []
    }

    return [...workspace.correspondence].sort(
      (left, right) => getSortableTime(right.sentAt) - getSortableTime(left.sentAt),
    )
  }, [workspace])

  const filteredMaterials = useMemo(() => {
    if (!workspace) {
      return []
    }

    return [...workspace.materials]
      .filter((material) => materialFilter === 'all' || material.type === materialFilter)
      .sort((left, right) => getSortableTime(right.uploadedAt) - getSortableTime(left.uploadedAt))
  }, [materialFilter, workspace])

  const sortedSuggestions = useMemo(() => {
    if (!workspace) {
      return []
    }

    return [...workspace.suggestions].sort(
      (left, right) =>
        right.votes - left.votes || getSortableTime(right.createdAt) - getSortableTime(left.createdAt),
    )
  }, [workspace])

  const sortedMeetings = useMemo(() => {
    if (!workspace) {
      return []
    }

    return [...workspace.meetings].sort(
      (left, right) => getSortableTime(right.date) - getSortableTime(left.date),
    )
  }, [workspace])

  const pendingInvites = useMemo(
    () => invites.filter((invite) => invite.status === 'pending'),
    [invites],
  )

  const groupedTodos = useMemo(() => {
    const groups: Record<'overdue' | 'week' | 'upcoming' | 'completed', WorkspaceTodo[]> = {
      overdue: [],
      week: [],
      upcoming: [],
      completed: [],
    }

    if (!workspace) {
      return groups
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const sortedTodos = [...workspace.todos].sort(
      (left, right) => getDueDateTime(left.dueDate) - getDueDateTime(right.dueDate),
    )

    sortedTodos.forEach((todo) => {
      if (todo.completed) {
        groups.completed.push(todo)
        return
      }

      if (!todo.dueDate) {
        groups.upcoming.push(todo)
        return
      }

      const dueDate = new Date(`${todo.dueDate}T00:00:00`)

      if (dueDate < today) {
        groups.overdue.push(todo)
      } else if (dueDate <= weekEnd) {
        groups.week.push(todo)
      } else {
        groups.upcoming.push(todo)
      }
    })

    return groups
  }, [workspace])

  async function runMutation(task: () => Promise<void>, successCopy: string) {
    try {
      setErrorMessage('')
      await task()
      setSuccessMessage(successCopy)
    } catch (error) {
      setSuccessMessage('')
      setErrorMessage(error instanceof Error ? error.message : 'The update could not be saved.')
    }
  }

  async function updateWorkspaceDocument(
    patch: Partial<ArchitectureWorkspace>,
    successCopy: string,
  ) {
    if (!db || !workspace) {
      throw new Error('Workspace data is not ready yet.')
    }

    await updateDoc(doc(db, ngoConfig.firestoreCollections.workspaces, workspace.projectId), {
      ...patch,
      updatedAt: new Date().toISOString(),
    })

    setSuccessMessage(successCopy)
  }

  function getAssigneeLabel(assigneeId?: string | null) {
    if (!workspace || !assigneeId) {
      return 'Unassigned'
    }

    const assignee = workspace.teamMembers.find((member) => member.participantId === assigneeId)
    return assignee?.name ?? assigneeId
  }

  if (!project) {
    return null
  }

  const activeProject = project
  const financeNgoUrl = getFinanceNgoUrl(activeProject.id)
  const firestore = db

  async function handleAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !user || todoDraft.text.trim().length === 0) {
      return
    }

    const nextTodo: WorkspaceTodo = {
      id: createWorkspaceItemId('todo'),
      text: todoDraft.text.trim(),
      assignedTo: todoDraft.assignedTo || null,
      dueDate: todoDraft.dueDate || null,
      completed: false,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
    }

    await runMutation(async () => {
      await updateWorkspaceDocument(
        { todos: [...workspace.todos, nextTodo] },
        'To-do added to the workspace.',
      )
      setTodoDraft({ text: '', assignedTo: '', dueDate: '' })
    }, 'To-do added to the workspace.')
  }

  async function handleToggleTodo(todoId: string) {
    if (!workspace) {
      return
    }

    const nextTodos = workspace.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
    )

    await runMutation(
      () => updateWorkspaceDocument({ todos: nextTodos }, 'To-do status updated.'),
      'To-do status updated.',
    )
  }

  async function handleDeleteTodo(todoId: string) {
    if (!workspace) {
      return
    }

    const nextTodos = workspace.todos.filter((todo) => todo.id !== todoId)

    await runMutation(
      () => updateWorkspaceDocument({ todos: nextTodos }, 'To-do removed.'),
      'To-do removed.',
    )
  }

  async function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !user || noteDraft.content.trim().length === 0) {
      return
    }

    const nextNote: WorkspaceNote = {
      id: createWorkspaceItemId('note'),
      authorId: user.uid,
      authorName: user.displayName || user.email || 'BEAM participant',
      content: noteDraft.content.trim(),
      pinned: noteDraft.pinned,
      createdAt: new Date().toISOString(),
    }

    await runMutation(async () => {
      await updateWorkspaceDocument(
        { notes: [nextNote, ...workspace.notes] },
        'Note added to the workspace.',
      )
      setNoteDraft({ content: '', pinned: false })
    }, 'Note added to the workspace.')
  }

  async function handleSaveEditedNote(noteId: string) {
    if (!workspace || editingNoteDraft.content.trim().length === 0) {
      return
    }

    const nextNotes = workspace.notes.map((note) =>
      note.id === noteId
        ? {
            ...note,
            content: editingNoteDraft.content.trim(),
            pinned: editingNoteDraft.pinned,
          }
        : note,
    )

    await runMutation(async () => {
      await updateWorkspaceDocument({ notes: nextNotes }, 'Note updated.')
      setEditingNoteId(null)
      setEditingNoteDraft({ content: '', pinned: false })
    }, 'Note updated.')
  }

  async function handleDeleteNote(noteId: string) {
    if (!workspace) {
      return
    }

    const nextNotes = workspace.notes.filter((note) => note.id !== noteId)

    await runMutation(
      () => updateWorkspaceDocument({ notes: nextNotes }, 'Note deleted.'),
      'Note deleted.',
    )
  }

  async function handleAddCorrespondence(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !user || !correspondenceDraft.to.trim() || !correspondenceDraft.subject.trim()) {
      return
    }

    const nextEntry = {
      id: createWorkspaceItemId('correspondence'),
      type: correspondenceDraft.type,
      to: correspondenceDraft.to.trim(),
      subject: correspondenceDraft.subject.trim(),
      summary: correspondenceDraft.summary.trim(),
      sentAt: correspondenceDraft.sentAt,
      sentBy: user.displayName || user.email || 'BEAM participant',
      status: correspondenceDraft.status,
    }

    await runMutation(async () => {
      await updateWorkspaceDocument(
        { correspondence: [nextEntry, ...workspace.correspondence] },
        'Correspondence entry logged.',
      )
      setCorrespondenceDraft({
        type: 'email',
        to: '',
        subject: '',
        summary: '',
        sentAt: new Date().toISOString().slice(0, 10),
        status: 'draft',
      })
    }, 'Correspondence entry logged.')
  }

  async function handleUploadMaterial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !materialFile || !user || materialDraft.title.trim().length === 0) {
      return
    }

    await runMutation(async () => {
      const storage = getStorage()
      const storageRef = ref(
        storage,
        `architectureProjects/${activeProject.id}/materials/${Date.now()}-${materialFile.name}`,
      )

      await uploadBytes(storageRef, materialFile)
      const url = await getDownloadURL(storageRef)

      const nextMaterial = {
        id: createWorkspaceItemId('material'),
        title: materialDraft.title.trim(),
        type: materialDraft.type,
        url,
        uploadedBy: user.displayName || user.email || 'BEAM participant',
        uploadedAt: new Date().toISOString(),
        notes: materialDraft.notes.trim(),
      }

      await updateWorkspaceDocument(
        { materials: [nextMaterial, ...workspace.materials] },
        'Material uploaded to the workspace.',
      )
      setMaterialDraft({ title: '', type: 'drawing', notes: '' })
      setMaterialFile(null)
    }, 'Material uploaded to the workspace.')
  }

  async function handleAddSuggestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !user || suggestionDraft.content.trim().length === 0) {
      return
    }

    const nextSuggestion = {
      id: createWorkspaceItemId('suggestion'),
      authorId: user.uid,
      authorName: user.displayName || user.email || 'BEAM participant',
      content: suggestionDraft.content.trim(),
      category: suggestionDraft.category,
      votes: 0,
      votedBy: [],
      status: 'open' as const,
      createdAt: new Date().toISOString(),
    }

    await runMutation(async () => {
      await updateWorkspaceDocument(
        { suggestions: [nextSuggestion, ...workspace.suggestions] },
        'Suggestion added to the board.',
      )
      setSuggestionDraft({ content: '', category: 'design' })
    }, 'Suggestion added to the board.')
  }

  async function handleVoteSuggestion(suggestionId: string) {
    if (!workspace || !user) {
      return
    }

    const nextSuggestions = workspace.suggestions.map((suggestion) => {
      if (suggestion.id !== suggestionId) {
        return suggestion
      }

      const hasVoted = suggestion.votedBy.includes(user.uid)
      const votedBy = hasVoted
        ? suggestion.votedBy.filter((uid) => uid !== user.uid)
        : [...suggestion.votedBy, user.uid]

      return {
        ...suggestion,
        votedBy,
        votes: votedBy.length,
      }
    })

    await runMutation(
      () => updateWorkspaceDocument({ suggestions: nextSuggestions }, 'Suggestion vote updated.'),
      'Suggestion vote updated.',
    )
  }

  async function handleSuggestionStatusChange(
    suggestionId: string,
    status: 'adopted' | 'declined',
  ) {
    if (!workspace) {
      return
    }

    const nextSuggestions = workspace.suggestions.map((suggestion) =>
      suggestion.id === suggestionId ? { ...suggestion, status } : suggestion,
    )

    await runMutation(
      () =>
        updateWorkspaceDocument(
          { suggestions: nextSuggestions },
          `Suggestion marked ${status}.`,
        ),
      `Suggestion marked ${status}.`,
    )
  }

  async function handleAddMeeting(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!workspace || !user || meetingDraft.title.trim().length === 0) {
      return
    }

    const nextMeeting: WorkspaceMeeting = {
      id: createWorkspaceItemId('meeting'),
      title: meetingDraft.title.trim(),
      date: meetingDraft.date,
      attendees: meetingDraft.attendees,
      notes: meetingDraft.notes.trim(),
      actionItems: meetingDraft.actionItems.map((item) => item.trim()).filter(Boolean),
      recordedBy: user.displayName || user.email || 'BEAM participant',
    }

    await runMutation(async () => {
      await updateWorkspaceDocument(
        { meetings: [nextMeeting, ...workspace.meetings] },
        'Meeting logged.',
      )
      setMeetingDraft({
        title: '',
        date: new Date().toISOString().slice(0, 10),
        attendees: [],
        notes: '',
        actionItems: [''],
      })
    }, 'Meeting logged.')
  }

  async function handleCreateInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user || !firestore || !inviteDraft.invitedName.trim() || !inviteDraft.invitedEmail.trim()) {
      return
    }

    const inviteId = createWorkspaceItemId('invite')
    const nextInvite: ArchitectureInvite = {
      id: inviteId,
      projectId: activeProject.id,
      invitedBy: user.uid,
      invitedEmail: inviteDraft.invitedEmail.trim(),
      invitedName: inviteDraft.invitedName.trim(),
      proposedRole: inviteDraft.proposedRole.trim(),
      message: inviteDraft.message.trim(),
      status: 'pending',
      sentAt: new Date().toISOString(),
      respondedAt: null,
    }

    await runMutation(async () => {
      await setDoc(doc(firestore, ngoConfig.firestoreCollections.invites, inviteId), nextInvite)
      setInviteDraft({
        invitedName: '',
        invitedEmail: '',
        proposedRole: '',
        message: '',
      })
    }, 'Invite saved to Firestore.')
  }

  async function handleApproveAllocation(index: number) {
    if (!workspace) {
      return
    }

    const nextAllocations = workspace.budgetAllocations.map((allocation, allocationIndex) =>
      allocationIndex === index ? { ...allocation, status: 'approved' as const } : allocation,
    )

    await runMutation(
      () =>
        updateWorkspaceDocument(
          { budgetAllocations: nextAllocations },
          'Budget allocation approved.',
        ),
      'Budget allocation approved.',
    )
  }

  function buildEmailDraft(to: string, subject: string, summary: string) {
    setEmailDraft({
      to,
      subject,
      body: `Hello ${to},\n\nI am following up regarding ${activeProject.title}. ${summary || activeProject.summary}\n\nWe are coordinating the current BEAM Architecture workspace and would like to keep the next steps moving.\n\nBest,\n${user?.displayName || 'BEAM Architecture'}`,
    })
  }

  function toggleMeetingAttendee(participantId: string) {
    setMeetingDraft((current) => ({
      ...current,
      attendees: current.attendees.includes(participantId)
        ? current.attendees.filter((value) => value !== participantId)
        : [...current.attendees, participantId],
    }))
  }

  function updateMeetingActionItem(index: number, value: string) {
    setMeetingDraft((current) => ({
      ...current,
      actionItems: current.actionItems.map((item, actionIndex) =>
        actionIndex === index ? value : item,
      ),
    }))
  }

  function renderMainContent(activeProject: ArchitectureProject, workspaceDoc: ArchitectureWorkspace) {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="panel">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="panel-label">Grant Proposal</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                    {workspaceDoc.grantProposal.title}
                  </h2>
                  <p className="body-copy mt-4">{workspaceDoc.grantProposal.notes}</p>
                </div>

                <div className="space-y-3 text-sm text-[var(--ink-soft)]">
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Submitted to:</span>{' '}
                    {workspaceDoc.grantProposal.submittedTo || 'Not set'}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Submitted by:</span>{' '}
                    {workspaceDoc.grantProposal.submittedBy || 'Not set'}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink)]">Amount:</span>{' '}
                    {formatCurrency(workspaceDoc.grantProposal.amount)}
                  </p>
                  <span
                    className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${grantStatusBadgeStyles[workspaceDoc.grantProposal.status]}`}
                  >
                    {workspaceDoc.grantProposal.status}
                  </span>
                </div>
              </div>

              {workspaceDoc.grantProposal.documentUrl ? (
                <div className="mt-6">
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)]"
                    href={workspaceDoc.grantProposal.documentUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open grant document
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="panel">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="panel-label">Budget Allocations</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                    Finance-aligned project allocations
                  </h2>
                </div>
                <Link
                  className="cta-secondary"
                  href={financeNgoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Budget allocations -&gt; Finance NGO
                </Link>
              </div>

              {workspaceDoc.budgetAllocations.length === 0 ? (
                <p className="body-copy mt-6">
                  No budget allocations have been logged for this workspace yet.
                </p>
              ) : (
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
                    <thead>
                      <tr className="text-[var(--ink-soft)]">
                        <th className="pb-2 pr-6 font-semibold">Participant</th>
                        <th className="pb-2 pr-6 font-semibold">Role</th>
                        <th className="pb-2 pr-6 font-semibold">Allocation</th>
                        <th className="pb-2 pr-6 font-semibold">Method</th>
                        <th className="pb-2 pr-6 font-semibold">Status</th>
                        <th className="pb-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workspaceDoc.budgetAllocations.map((allocation, index) => (
                        <tr key={`${allocation.participantId}-${allocation.role}`} className="rounded-[1rem] bg-white/40">
                          <td className="rounded-l-[1rem] px-4 py-4 font-semibold text-[var(--ink)]">
                            {allocation.participantName}
                          </td>
                          <td className="px-4 py-4 text-[var(--ink-soft)]">{allocation.role}</td>
                          <td className="px-4 py-4 text-[var(--ink-soft)]">
                            {formatCurrency(allocation.allocatedAmount)}
                          </td>
                          <td className="px-4 py-4 text-[var(--ink-soft)]">
                            {allocation.paymentMethod.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${allocationStatusBadgeStyles[allocation.status]}`}
                            >
                              {allocation.status}
                            </span>
                          </td>
                          <td className="rounded-r-[1rem] px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {isAdmin && allocation.status === 'proposed' ? (
                                <button
                                  className="cta-secondary !px-4 !py-3"
                                  onClick={() => void handleApproveAllocation(index)}
                                  type="button"
                                >
                                  Approve
                                </button>
                              ) : null}
                              <Link
                                className="cta-secondary !px-4 !py-3"
                                href={allocation.financeNGORef || financeNgoUrl}
                                rel="noreferrer"
                                target="_blank"
                              >
                                View in Finance NGO
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="panel">
              <p className="panel-label">NGO Connections</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Cross-BEAM organizations needed for this project
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {activeProject.ngoConnections.map((connection) => (
                  <Link
                    key={connection.id}
                    className="nav-card"
                    href={connection.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <p className="panel-label">{connection.label}</p>
                    <p className="mt-3 text-base font-semibold text-[var(--ink)]">
                      {connection.summary}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                      Open connection
                      <ArrowUpRight className="h-4 w-4" />
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      case 'todo':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleAddTodo}>
              <p className="panel-label">Add To-Do</p>
              <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_0.8fr_0.7fr_auto]">
                <label className="field-label">
                  Task
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setTodoDraft((current) => ({ ...current, text: event.target.value }))
                    }
                    placeholder="Add a next action for the project team"
                    value={todoDraft.text}
                  />
                </label>
                <label className="field-label">
                  Assign to
                  <select
                    className="field-select"
                    onChange={(event) =>
                      setTodoDraft((current) => ({ ...current, assignedTo: event.target.value }))
                    }
                    value={todoDraft.assignedTo}
                  >
                    <option value="">Unassigned</option>
                    {workspaceDoc.teamMembers.map((member) => (
                      <option key={member.participantId} value={member.participantId}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-label">
                  Due date
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setTodoDraft((current) => ({ ...current, dueDate: event.target.value }))
                    }
                    type="date"
                    value={todoDraft.dueDate}
                  />
                </label>
                <div className="flex items-end">
                  <button className="cta-primary w-full justify-center" type="submit">
                    Add task
                  </button>
                </div>
              </div>
            </form>

            {[
              { label: 'Overdue', items: groupedTodos.overdue },
              { label: 'Due this week', items: groupedTodos.week },
              { label: 'Upcoming', items: groupedTodos.upcoming },
              { label: 'Completed', items: groupedTodos.completed },
            ].map((group) => (
              <div key={group.label} className="panel">
                <p className="panel-label">{group.label}</p>
                {group.items.length === 0 ? (
                  <p className="body-copy mt-4">No items in this group.</p>
                ) : (
                  <div className="mt-6 space-y-4">
                    {group.items.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex flex-col gap-4 rounded-[1.25rem] border border-black/10 bg-white/45 px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <button
                            className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                              todo.completed
                                ? 'border-[#2f7b57] bg-[#2f7b57] text-white'
                                : 'border-black/20 bg-white text-transparent'
                            }`}
                            onClick={() => void handleToggleTodo(todo.id)}
                            type="button"
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          <div>
                            <p className="font-semibold text-[var(--ink)]">{todo.text}</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                              <span className="rounded-full border border-black/10 px-3 py-2">
                                {getAssigneeLabel(todo.assignedTo)}
                              </span>
                              <span className="rounded-full border border-black/10 px-3 py-2">
                                {todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="cta-secondary !px-4 !py-3"
                          onClick={() => void handleDeleteTodo(todo.id)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      case 'notes':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleAddNote}>
              <p className="panel-label">Add Note</p>
              <label className="field-label mt-6">
                Note
                <textarea
                  className="field-textarea min-h-[150px]"
                  onChange={(event) =>
                    setNoteDraft((current) => ({ ...current, content: event.target.value }))
                  }
                  placeholder="Capture a design decision, field observation, or internal update."
                  value={noteDraft.content}
                />
              </label>

              <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[var(--ink)]">
                <input
                  checked={noteDraft.pinned}
                  onChange={(event) =>
                    setNoteDraft((current) => ({ ...current, pinned: event.target.checked }))
                  }
                  type="checkbox"
                />
                Pin this note
              </label>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  Save note
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {sortedNotes.length === 0 ? (
                <div className="panel">
                  <p className="body-copy">No notes have been added yet.</p>
                </div>
              ) : null}

              {sortedNotes.map((note) => {
                const ownNote = isOwnNote(note, user || {})
                const isEditing = editingNoteId === note.id

                return (
                  <article
                    key={note.id}
                    className={`panel ${note.pinned ? 'border-[#c8b99a]/40 bg-[#fff7eb]/90' : ''}`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-[var(--ink)]">{note.authorName}</p>
                          <span className="text-sm text-[var(--ink-soft)]">
                            {formatDateTime(note.createdAt)}
                          </span>
                          {note.pinned ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#c8b99a]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b5f49]">
                              <Pin className="h-3.5 w-3.5" />
                              Pinned
                            </span>
                          ) : null}
                        </div>

                        {isEditing ? (
                          <div className="mt-5 space-y-4">
                            <textarea
                              className="field-textarea min-h-[150px]"
                              onChange={(event) =>
                                setEditingNoteDraft((current) => ({
                                  ...current,
                                  content: event.target.value,
                                }))
                              }
                              value={editingNoteDraft.content}
                            />
                            <label className="flex items-center gap-3 text-sm font-semibold text-[var(--ink)]">
                              <input
                                checked={editingNoteDraft.pinned}
                                onChange={(event) =>
                                  setEditingNoteDraft((current) => ({
                                    ...current,
                                    pinned: event.target.checked,
                                  }))
                                }
                                type="checkbox"
                              />
                              Pin this note
                            </label>
                          </div>
                        ) : (
                          <p className="body-copy mt-5 whitespace-pre-wrap">{note.content}</p>
                        )}
                      </div>

                      {ownNote ? (
                        <div className="flex flex-wrap gap-3">
                          {isEditing ? (
                            <>
                              <button
                                className="cta-primary !px-4 !py-3"
                                onClick={() => void handleSaveEditedNote(note.id)}
                                type="button"
                              >
                                Save
                              </button>
                              <button
                                className="cta-secondary !px-4 !py-3"
                                onClick={() => {
                                  setEditingNoteId(null)
                                  setEditingNoteDraft({ content: '', pinned: false })
                                }}
                                type="button"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="cta-secondary !px-4 !py-3"
                                onClick={() => {
                                  setEditingNoteId(note.id)
                                  setEditingNoteDraft({
                                    content: note.content,
                                    pinned: note.pinned,
                                  })
                                }}
                                type="button"
                              >
                                <PencilLine className="h-4 w-4" />
                                Edit
                              </button>
                              <button
                                className="cta-secondary !px-4 !py-3"
                                onClick={() => void handleDeleteNote(note.id)}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )
      case 'correspondence':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleAddCorrespondence}>
              <p className="panel-label">Log Communication</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="field-label">
                  Type
                  <select
                    className="field-select"
                    onChange={(event) =>
                      setCorrespondenceDraft((current) => ({
                        ...current,
                        type: event.target.value as CorrespondenceType,
                      }))
                    }
                    value={correspondenceDraft.type}
                  >
                    {correspondenceTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Recipient
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setCorrespondenceDraft((current) => ({ ...current, to: event.target.value }))
                    }
                    placeholder="Name of recipient"
                    value={correspondenceDraft.to}
                  />
                </label>

                <label className="field-label">
                  Subject
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setCorrespondenceDraft((current) => ({
                        ...current,
                        subject: event.target.value,
                      }))
                    }
                    placeholder="Subject line or meeting topic"
                    value={correspondenceDraft.subject}
                  />
                </label>

                <label className="field-label">
                  Date sent
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setCorrespondenceDraft((current) => ({
                        ...current,
                        sentAt: event.target.value,
                      }))
                    }
                    type="date"
                    value={correspondenceDraft.sentAt}
                  />
                </label>
              </div>

              <label className="field-label mt-4">
                Summary
                <textarea
                  className="field-textarea min-h-[140px]"
                  onChange={(event) =>
                    setCorrespondenceDraft((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                  placeholder="Summarize what was sent, discussed, or requested."
                  value={correspondenceDraft.summary}
                />
              </label>

              <label className="field-label mt-4">
                Status
                <select
                  className="field-select"
                  onChange={(event) =>
                    setCorrespondenceDraft((current) => ({
                      ...current,
                      status: event.target.value as CorrespondenceStatus,
                    }))
                  }
                  value={correspondenceDraft.status}
                >
                  {correspondenceStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  Save correspondence
                </button>
              </div>
            </form>

            {emailDraft ? (
              <div className="panel">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="panel-label">Draft Email</p>
                    <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                      Pre-filled compose panel
                    </h2>
                  </div>
                  <button
                    className="cta-secondary"
                    onClick={() => setEmailDraft(null)}
                    type="button"
                  >
                    Close draft
                  </button>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="field-label">
                    To
                    <input className="field-input" readOnly value={emailDraft.to} />
                  </label>
                  <label className="field-label">
                    Subject
                    <input className="field-input" readOnly value={emailDraft.subject} />
                  </label>
                  <label className="field-label">
                    Body
                    <textarea className="field-textarea min-h-[220px]" readOnly value={emailDraft.body} />
                  </label>
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              {sortedCorrespondence.length === 0 ? (
                <div className="panel">
                  <p className="body-copy">No correspondence logged yet.</p>
                </div>
              ) : null}

              {sortedCorrespondence.map((item) => {
                const Icon = getCorrespondenceIcon(item.type)

                return (
                  <article key={item.id} className="panel">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60">
                            <Icon className="h-5 w-5 text-[var(--ink)]" />
                          </span>
                          <div>
                            <p className="font-semibold text-[var(--ink)]">{item.subject}</p>
                            <p className="text-sm text-[var(--ink-soft)]">
                              {item.to} • {formatDate(item.sentAt)}
                            </p>
                          </div>
                        </div>
                        <p className="body-copy mt-5">{item.summary || 'No summary recorded.'}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                          {item.status}
                        </span>
                        <button
                          className="cta-secondary !px-4 !py-3"
                          onClick={() => buildEmailDraft(item.to, item.subject, item.summary)}
                          type="button"
                        >
                          Draft email
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )
      case 'materials':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleUploadMaterial}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="panel-label">Upload Material</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                    Project files and supporting references
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="field-label">
                  Title
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setMaterialDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="File title"
                    value={materialDraft.title}
                  />
                </label>

                <label className="field-label">
                  Type
                  <select
                    className="field-select"
                    onChange={(event) =>
                      setMaterialDraft((current) => ({
                        ...current,
                        type: event.target.value as MaterialType,
                      }))
                    }
                    value={materialDraft.type}
                  >
                    {materialTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {materialTypeLabels[option]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="field-label mt-4">
                Notes
                <textarea
                  className="field-textarea min-h-[120px]"
                  onChange={(event) =>
                    setMaterialDraft((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Describe how the file should be used."
                  value={materialDraft.notes}
                />
              </label>

              <label className="field-label mt-4">
                File
                <input
                  className="field-input"
                  onChange={(event) => {
                    setMaterialFile(event.target.files?.[0] ?? null)
                  }}
                  type="file"
                />
              </label>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  <UploadCloud className="h-4 w-4" />
                  Upload file
                </button>
              </div>
            </form>

            <div className="panel">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="panel-label">Material Library</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                    Browse project materials
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className={`nav-pill ${materialFilter === 'all' ? 'nav-pill-active' : ''}`}
                    onClick={() => setMaterialFilter('all')}
                    type="button"
                  >
                    All
                  </button>
                  {materialTypeOptions.map((option) => (
                    <button
                      key={option}
                      className={`nav-pill ${materialFilter === option ? 'nav-pill-active' : ''}`}
                      onClick={() => setMaterialFilter(option)}
                      type="button"
                    >
                      {materialTypeLabels[option]}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMaterials.length === 0 ? (
                <p className="body-copy mt-6">No materials match the current filter.</p>
              ) : (
                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredMaterials.map((material) => (
                    <article key={material.id} className="rounded-[1.35rem] border border-black/10 bg-white/45 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="panel-label">{materialTypeLabels[material.type]}</p>
                          <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">
                            {material.title}
                          </h3>
                        </div>
                        <FolderOpen className="h-5 w-5 text-[var(--ink-soft)]" />
                      </div>
                      <p className="body-copy mt-4">{material.notes || 'No notes recorded.'}</p>
                      <div className="mt-5 text-sm text-[var(--ink-soft)]">
                        <p>Uploaded by {material.uploadedBy}</p>
                        <p>{formatDateTime(material.uploadedAt)}</p>
                      </div>
                      <div className="mt-6">
                        <Link
                          className="cta-secondary !px-4 !py-3"
                          href={material.url}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Download
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 'suggestions':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleAddSuggestion}>
              <p className="panel-label">Submit Suggestion</p>
              <label className="field-label mt-6">
                Suggestion
                <textarea
                  className="field-textarea min-h-[150px]"
                  onChange={(event) =>
                    setSuggestionDraft((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  placeholder="Propose a budget, design, outreach, or timeline improvement."
                  value={suggestionDraft.content}
                />
              </label>

              <label className="field-label mt-4">
                Category
                <select
                  className="field-select"
                  onChange={(event) =>
                    setSuggestionDraft((current) => ({
                      ...current,
                      category: event.target.value as SuggestionCategory,
                    }))
                  }
                  value={suggestionDraft.category}
                >
                  {suggestionCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {suggestionCategoryLabels[option]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  Add suggestion
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {sortedSuggestions.length === 0 ? (
                <div className="panel">
                  <p className="body-copy">No suggestions have been submitted yet.</p>
                </div>
              ) : null}

              {sortedSuggestions.map((suggestion) => {
                const hasVoted = user ? suggestion.votedBy.includes(user.uid) : false

                return (
                  <article key={suggestion.id} className="panel">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                            {suggestionCategoryLabels[suggestion.category]}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${suggestionStatusBadgeStyles[suggestion.status]}`}
                          >
                            {suggestion.status}
                          </span>
                          <span className="text-sm text-[var(--ink-soft)]">
                            {suggestion.authorName} • {formatDateTime(suggestion.createdAt)}
                          </span>
                        </div>
                        <p className="body-copy mt-5 whitespace-pre-wrap">{suggestion.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          className={`cta-secondary !px-4 !py-3 ${hasVoted ? 'border-[#557180]/35 bg-[#557180]/10 text-[#2f4f5f]' : ''}`}
                          onClick={() => void handleVoteSuggestion(suggestion.id)}
                          type="button"
                        >
                          <Lightbulb className="h-4 w-4" />
                          {hasVoted ? `Voted (${suggestion.votes})` : `Upvote (${suggestion.votes})`}
                        </button>

                        {isAdmin ? (
                          <>
                            <button
                              className="cta-secondary !px-4 !py-3"
                              onClick={() => void handleSuggestionStatusChange(suggestion.id, 'adopted')}
                              type="button"
                            >
                              Adopt
                            </button>
                            <button
                              className="cta-secondary !px-4 !py-3"
                              onClick={() => void handleSuggestionStatusChange(suggestion.id, 'declined')}
                              type="button"
                            >
                              Decline
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )
      case 'meetings':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleAddMeeting}>
              <p className="panel-label">Log Meeting</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="field-label">
                  Title
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setMeetingDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Meeting title"
                    value={meetingDraft.title}
                  />
                </label>

                <label className="field-label">
                  Date
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setMeetingDraft((current) => ({ ...current, date: event.target.value }))
                    }
                    type="date"
                    value={meetingDraft.date}
                  />
                </label>
              </div>

              <div className="mt-4">
                <p className="field-label">Attendees</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {workspaceDoc.teamMembers.map((member) => (
                    <label
                      key={member.participantId}
                      className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/50 px-4 py-3 text-sm font-semibold text-[var(--ink)]"
                    >
                      <input
                        checked={meetingDraft.attendees.includes(member.participantId)}
                        onChange={() => toggleMeetingAttendee(member.participantId)}
                        type="checkbox"
                      />
                      {member.name}
                    </label>
                  ))}
                </div>
              </div>

              <label className="field-label mt-4">
                Notes
                <textarea
                  className="field-textarea min-h-[150px]"
                  onChange={(event) =>
                    setMeetingDraft((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder="Summarize the meeting discussion."
                  value={meetingDraft.notes}
                />
              </label>

              <div className="mt-4 space-y-3">
                <p className="field-label">Action items</p>
                {meetingDraft.actionItems.map((item, index) => (
                  <input
                    key={`${index}-${item}`}
                    className="field-input"
                    onChange={(event) => updateMeetingActionItem(index, event.target.value)}
                    placeholder={`Action item ${index + 1}`}
                    value={item}
                  />
                ))}
                <button
                  className="cta-secondary"
                  onClick={() =>
                    setMeetingDraft((current) => ({
                      ...current,
                      actionItems: [...current.actionItems, ''],
                    }))
                  }
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add action item
                </button>
              </div>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  Save meeting
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {sortedMeetings.length === 0 ? (
                <div className="panel">
                  <p className="body-copy">No meetings are logged yet.</p>
                </div>
              ) : null}

              {sortedMeetings.map((meeting) => (
                <article key={meeting.id} className="panel">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-[var(--ink)]">{meeting.title}</h2>
                        <span className="text-sm text-[var(--ink-soft)]">{formatDate(meeting.date)}</span>
                      </div>
                      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                        Attendees
                      </p>
                      <p className="body-copy mt-2">{getMeetingAttendeeNames(meeting, workspaceDoc)}</p>
                      <p className="body-copy mt-5">{meeting.notes || 'No notes recorded.'}</p>
                    </div>

                    <div className="max-w-sm rounded-[1.25rem] border border-black/10 bg-white/45 px-4 py-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                        Action items
                      </p>
                      {meeting.actionItems.length === 0 ? (
                        <p className="body-copy mt-3">No action items listed.</p>
                      ) : (
                        <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
                          {meeting.actionItems.map((item) => (
                            <li key={item} className="rounded-[1rem] border border-black/10 px-3 py-3">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      case 'invite':
        return (
          <div className="space-y-6">
            <form className="panel" onSubmit={handleCreateInvite}>
              <p className="panel-label">Invite Participant</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="field-label">
                  Invitee name
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setInviteDraft((current) => ({ ...current, invitedName: event.target.value }))
                    }
                    placeholder="Participant name"
                    value={inviteDraft.invitedName}
                  />
                </label>
                <label className="field-label">
                  Invitee email
                  <input
                    className="field-input"
                    onChange={(event) =>
                      setInviteDraft((current) => ({ ...current, invitedEmail: event.target.value }))
                    }
                    placeholder="email@example.com"
                    type="email"
                    value={inviteDraft.invitedEmail}
                  />
                </label>
              </div>

              <label className="field-label mt-4">
                Proposed role
                <input
                  className="field-input"
                  onChange={(event) =>
                    setInviteDraft((current) => ({ ...current, proposedRole: event.target.value }))
                  }
                  placeholder="researcher, fabrication, liaison, etc."
                  value={inviteDraft.proposedRole}
                />
              </label>

              <label className="field-label mt-4">
                Personal message
                <textarea
                  className="field-textarea min-h-[150px]"
                  onChange={(event) =>
                    setInviteDraft((current) => ({ ...current, message: event.target.value }))
                  }
                  placeholder="Add context about why you are inviting this participant."
                  value={inviteDraft.message}
                />
              </label>

              <div className="mt-6">
                <button className="cta-primary" type="submit">
                  Save invite
                </button>
              </div>
            </form>

            <div className="panel">
              <p className="panel-label">Pending Invites</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Outstanding invitations for this project
              </h2>

              {pendingInvites.length === 0 ? (
                <p className="body-copy mt-6">No pending invites yet.</p>
              ) : (
                <div className="mt-8 space-y-4">
                  {pendingInvites.map((invite) => (
                    <article
                      key={invite.id}
                      className="rounded-[1.25rem] border border-black/10 bg-white/45 px-4 py-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="font-semibold text-[var(--ink)]">{invite.invitedName}</p>
                          <p className="text-sm text-[var(--ink-soft)]">{invite.invitedEmail}</p>
                          <p className="mt-2 text-sm text-[var(--ink-soft)]">
                            Proposed role: {invite.proposedRole || 'Not specified'}
                          </p>
                          <p className="body-copy mt-4">{invite.message || 'No message included.'}</p>
                        </div>
                        <div className="text-sm text-[var(--ink-soft)]">
                          <p className="font-semibold text-[var(--ink)]">Pending</p>
                          <p>{formatDateTime(invite.sentAt)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="border-b border-black/10 pt-28 sm:pt-32">
        <div className="site-frame section-pad">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow">Project Workspace</p>
              <h1 className="section-title mt-5 text-5xl md:text-7xl">{activeProject.title}</h1>
            </div>

            <div className="max-w-2xl">
              <p className="body-copy text-lg">{activeProject.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--ink-soft)]">
                <span className="rounded-full border border-black/10 px-3 py-2">{activeProject.location}</span>
                <span
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${projectStatusBadgeStyles[activeProject.status]}`}
                >
                  {activeProject.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-frame space-y-6">
          {successMessage ? <div className="success-box">{successMessage}</div> : null}
          {errorMessage ? <div className="error-box">{errorMessage}</div> : null}

          {!loading && !user ? (
            <div className="panel">
              <p className="panel-label">Redirecting</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                Sign in to access the project workspace.
              </h2>
            </div>
          ) : null}

          {loading || loadingAccess || workspaceLoading ? (
            <div className="panel">
              <p className="panel-label">Loading</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                {initializingWorkspace ? 'Initializing project workspace.' : 'Loading workspace data.'}
              </h2>
            </div>
          ) : null}

          {!loading && user && !loadingAccess && !hasWorkspaceAccess ? (
            <div className="panel">
              <p className="panel-label">Access Required</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">
                This workspace is only available to assigned participants.
              </h2>
              <p className="body-copy mt-4 max-w-2xl">
                Map yourself to the project first or have an admin add you to the team list in the
                workspace document.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="cta-primary" href="/projects">
                  Return to projects
                </Link>
                <Link className="cta-secondary" href={`/${activeProject.slug}`}>
                  View public page
                </Link>
              </div>
            </div>
          ) : null}

          {!loading &&
          user &&
          !loadingAccess &&
          hasWorkspaceAccess &&
          workspace &&
          !workspaceLoading ? (
            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside className="space-y-6">
                <div className="panel">
                  <p className="panel-label">Workspace</p>
                  <h2 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{workspace.projectTitle}</h2>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${projectStatusBadgeStyles[activeProject.status]}`}
                    >
                      {activeProject.status}
                    </span>
                    <span className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                      {isAdmin ? 'Admin' : 'Participant'}
                    </span>
                  </div>
                </div>

                <div className="panel">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[var(--ink)]" />
                    <p className="panel-label">Team Members</p>
                  </div>
                  <div className="mt-5 space-y-4">
                    {workspace.teamMembers.length === 0 ? (
                      <p className="body-copy">No team members have been added yet.</p>
                    ) : (
                      workspace.teamMembers.map((member) => (
                        <div key={`${member.email}-${member.participantId}`} className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-[var(--ink)]">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--ink)]">{member.name}</p>
                            <p className="text-sm text-[var(--ink-soft)]">
                              {teamRoleLabels[member.role]} • {member.institution}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="panel hidden lg:block">
                  <p className="panel-label">Quick Links</p>
                  <div className="mt-5 space-y-3">
                    {workspaceTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`mobile-nav-link w-full text-left ${activeTab === tab.id ? 'mobile-nav-link-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <p className="panel-label">Actions</p>
                  <div className="mt-5 space-y-3">
                    <button className="cta-primary w-full justify-center" onClick={() => setActiveTab('invite')} type="button">
                      Invite a participant
                    </button>
                    <Link className="cta-secondary w-full justify-center" href={financeNgoUrl} rel="noreferrer" target="_blank">
                      Connect to Finance NGO
                    </Link>
                    <Link className="cta-secondary w-full justify-center" href="https://lucid.app" rel="noreferrer" target="_blank">
                      Open in Lucid
                    </Link>
                    <Link className="cta-secondary w-full justify-center" href="https://drive.google.com" rel="noreferrer" target="_blank">
                      Open project folder in Drive
                    </Link>
                    <Link className="cta-secondary w-full justify-center" href={financeNgoUrl} rel="noreferrer" target="_blank">
                      Budget allocations -&gt; Finance NGO
                    </Link>
                    <Link className="cta-secondary w-full justify-center" href="https://home.beamthinktank.space/admin" rel="noreferrer" target="_blank">
                      View in BEAM admin
                    </Link>
                  </div>

                  <div className="mt-6 border-t border-black/10 pt-5 text-sm text-[var(--ink-soft)]">
                    <p>Lucid and Google Drive buttons are workspace stubs for a future MCP-linked session.</p>
                  </div>
                </div>
              </aside>

              <div className="space-y-6">
                <div className="panel lg:hidden">
                  <p className="panel-label">Tabs</p>
                  <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
                    {workspaceTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`nav-pill ${activeTab === tab.id ? 'nav-pill-active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                      >
                        {tab.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {renderMainContent(activeProject, workspace)}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  )
}
