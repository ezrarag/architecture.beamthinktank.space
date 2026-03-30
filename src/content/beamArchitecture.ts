export const pageSlugs = [
  'about',
  'central-umc',
  'faculty-partnerships',
  'student-cohorts',
  'project-types',
  'deliverables',
  'community-partners',
  'join',
  'contact',
] as const

export type PageSlug = (typeof pageSlugs)[number]

export interface Metric {
  value: string
  label: string
}

export interface NarrativeSection {
  eyebrow?: string
  title: string
  body: string[]
  bullets?: string[]
}

export interface HighlightCard {
  title: string
  summary: string
  detail: string
}

export interface CorePageLink {
  label: string
  href: `/${string}` | '/'
  summary: string
}

export interface SitePage {
  slug: PageSlug
  label: string
  href: `/${PageSlug}`
  title: string
  description: string
  summary: string
  stats: Metric[]
  sections: NarrativeSection[]
  highlights?: HighlightCard[]
  showForms?: boolean
  formLead?: string
}

export const corePageLinks: CorePageLink[] = [
  {
    label: 'Home',
    href: '/',
    summary: 'Overview of the cohort model, current pilot, roles, and calls to action.',
  },
  {
    label: 'About BEAM Architecture',
    href: '/about',
    summary: 'Mission, model, and why a university-linked practice matters.',
  },
  {
    label: 'Current Pilot: Central UMC',
    href: '/central-umc',
    summary: 'Current pilot site testing documentation, planning, and phased implementation.',
  },
  {
    label: 'Faculty Partnerships',
    href: '/faculty-partnerships',
    summary: 'Advising, sponsorship, course integration, and research collaboration paths.',
  },
  {
    label: 'Student Cohorts',
    href: '/student-cohorts',
    summary: 'How student teams are formed, what they produce, and how they learn.',
  },
  {
    label: 'Project Types',
    href: '/project-types',
    summary: 'Architecture, preservation, adaptive reuse, fabrication, access, and strategy.',
  },
  {
    label: 'Deliverables',
    href: '/deliverables',
    summary: 'The documents, drawings, analyses, and phased planning packages sites receive.',
  },
  {
    label: 'Community Partners',
    href: '/community-partners',
    summary: 'How building stewards and redevelopment teams can engage BEAM.',
  },
  {
    label: 'Join / Apply',
    href: '/join',
    summary: 'Shared intake for faculty, students, and site referrals.',
  },
  {
    label: 'Contact',
    href: '/contact',
    summary: 'Program coordination, referral questions, and next-step conversations.',
  },
]

export const heroMetrics: Metric[] = [
  { value: '1', label: 'cohort model linking university learning to live sites' },
  { value: '3', label: 'constituencies: faculty, students, community partners' },
  { value: '6', label: 'project tracks spanning preservation to real estate strategy' },
]

export const pilotMetrics: Metric[] = [
  { value: 'Active', label: 'pilot status at Central UMC' },
  { value: 'Phased', label: 'delivery model from documentation through implementation strategy' },
  { value: 'Real Site', label: 'student work anchored in building conditions and community need' },
]

export const beamProcess: HighlightCard[] = [
  {
    title: 'Frame the site question',
    summary: 'A community site, congregation, or redevelopment steward identifies a building challenge or opportunity.',
    detail: 'The entry point can be preservation planning, adaptive reuse, accessibility, fabrication, or implementation sequencing.',
  },
  {
    title: 'Assemble a faculty-guided cohort',
    summary: 'Faculty advisors, course partners, and project sponsors help define methods, standards, and review cycles.',
    detail: 'BEAM structures the work so teaching, research, and community engagement reinforce one another instead of competing.',
  },
  {
    title: 'Produce actionable work',
    summary: 'Students document conditions, test scenarios, coordinate technical inputs, and build public-facing deliverables.',
    detail: 'Outputs are designed to help the site move into the next decision, funding, design, or execution phase.',
  },
  {
    title: 'Carry work forward',
    summary: 'The cohort closes with a documented handoff that can support future courses, fundraising, owners, or implementation teams.',
    detail: 'Each project becomes part of a longer pipeline rather than a one-off academic exercise.',
  },
]

export const roleCards: HighlightCard[] = [
  {
    title: 'Faculty',
    summary: 'Participate as advisors, project sponsors, or course partners shaping the intellectual and technical rigor of the work.',
    detail: 'BEAM is designed for faculty like William Krueger at UWM who want applied teaching, public scholarship, and real site impact.',
  },
  {
    title: 'Students',
    summary: 'Gain practical experience through live community projects that demand coordination, documentation, and decision-making.',
    detail: 'Cohorts are interdisciplinary by design and translate classroom training into professional habits, public accountability, and portfolio-ready work.',
  },
  {
    title: 'Community Partners',
    summary: 'Receive documentation, planning, and phased support for buildings, campuses, and redevelopment questions.',
    detail: 'The model is especially suited to sites that need a serious first phase before conventional design, funding, or construction mobilization.',
  },
]

export const projectTypes: HighlightCard[] = [
  {
    title: 'Architecture',
    summary: 'Spatial studies, concept packages, and site-responsive design thinking.',
    detail: 'Projects move from existing conditions and stakeholder goals toward programmatic and architectural direction.',
  },
  {
    title: 'Historic Preservation',
    summary: 'Archival research, significance framing, and preservation-minded intervention strategy.',
    detail: 'BEAM helps sites understand what should be documented, protected, adapted, and communicated to funders or the public.',
  },
  {
    title: 'Adaptive Reuse',
    summary: 'Reuse scenarios for underused buildings and complex institutional properties.',
    detail: 'The emphasis is on fit, phasing, mission alignment, and what it takes to move an existing asset toward productive reuse.',
  },
  {
    title: 'Fabrication',
    summary: 'Prototype development, material testing, and fabrication-informed design support.',
    detail: 'Cohorts can translate design intent into mockups, installable details, and production planning logic.',
  },
  {
    title: 'Accessibility Planning',
    summary: 'Site and building reviews that frame access as design, infrastructure, and community care.',
    detail: 'BEAM can help partners identify barriers, priorities, and phased improvements in a way that informs funding and implementation.',
  },
  {
    title: 'Real Estate Strategy',
    summary: 'Feasibility framing, phased development thinking, and asset-positioning support.',
    detail: 'The work connects architectural insight to redevelopment sequence, partner alignment, and practical next steps.',
  },
]

export const deliverables: HighlightCard[] = [
  {
    title: 'Existing Conditions Dossier',
    summary: 'A documented baseline of the site, building, and current constraints.',
    detail: 'This can include field notes, photo logs, basic measured information, mapped issues, and a synthesis of observed conditions.',
  },
  {
    title: 'Preservation and Reuse Analysis',
    summary: 'A structured reading of what matters, what is viable, and where intervention can begin.',
    detail: 'Useful for faculty review, board conversations, donor briefings, and community decision-making.',
  },
  {
    title: 'Accessibility and Planning Review',
    summary: 'Barrier identification and phased recommendations oriented toward actual implementation.',
    detail: 'The output is meant to support practical planning rather than remain a static audit.',
  },
  {
    title: 'Scenario Studies',
    summary: 'Alternative futures for use, occupancy, phasing, and project sequencing.',
    detail: 'Scenario work helps organizations compare options before committing to capital-intensive paths.',
  },
  {
    title: 'Fabrication or Prototype Package',
    summary: 'Mockups, details, or material studies that bridge concept and execution.',
    detail: 'Especially useful when sites need testable design ideas or communication tools for collaborators.',
  },
  {
    title: 'Implementation Roadmap',
    summary: 'A next-step framework linking priorities, sequencing, and likely collaborators.',
    detail: 'This is where the cohort model becomes operational: a clear handoff toward grants, consultants, contractors, or future cohorts.',
  },
]

export const copyBlocks: HighlightCard[] = [
  {
    title: 'BEAM is a cohort model',
    summary: 'BEAM organizes students, faculty, and community sites into time-bound cohorts built around real buildings and real decisions.',
    detail: 'The work is not hypothetical studio imagery detached from implementation. It is a structured pipeline from education into practice.',
  },
  {
    title: 'Faculty participation is flexible',
    summary: 'Faculty can enter as advisors, project sponsors, or course partners depending on calendar, discipline, and teaching goals.',
    detail: 'That flexibility makes the model viable across architecture, preservation, planning, real estate, accessibility, and fabrication contexts.',
  },
  {
    title: 'Students gain practical experience',
    summary: 'Students work on actual community projects and learn how architecture intersects with stewardship, execution, and institutional decision-making.',
    detail: 'The result is professional formation grounded in collaboration, accountability, and public value.',
  },
  {
    title: 'Community sites receive phased support',
    summary: 'Sites can receive documentation, planning, and implementation framing even when they are not ready for a full conventional design contract.',
    detail: 'BEAM helps partners move from uncertainty toward usable evidence, shared language, and phased action.',
  },
]

export const intakePathways: HighlightCard[] = [
  {
    title: 'Faculty interest',
    summary: 'Start a conversation about advising, sponsoring, or integrating a cohort into a course or research agenda.',
    detail: 'Use the faculty intake to describe department fit, semester timing, and where your expertise can shape the work.',
  },
  {
    title: 'Student interest',
    summary: 'Apply to participate in a cohort and describe your discipline, skills, and the kind of built-environment work you want to do.',
    detail: 'Architecture students are central, but allied disciplines are part of the model by design.',
  },
  {
    title: 'Site or project referral',
    summary: 'Refer a building, property, campus, or redevelopment question that would benefit from documentation and phased planning support.',
    detail: 'This intake is appropriate for congregations, nonprofits, civic stewards, and redevelopment partners with a real site need.',
  },
]

export const pagesBySlug: Record<PageSlug, SitePage> = {
  about: {
    slug: 'about',
    label: 'About BEAM Architecture',
    href: '/about',
    title: 'A university-linked architecture model rooted in real sites, real partnerships, and public purpose.',
    description:
      'BEAM Architecture connects academic rigor to the built environment by organizing faculty, students, and community sites into cohorts that produce serious work for real buildings and redevelopment questions.',
    summary:
      'BEAM is not a conventional studio or a generic nonprofit volunteer model. It is a structured practice framework where education, preservation, design, accessibility, fabrication, and redevelopment strategy intersect.',
    stats: [
      { value: 'Cohort', label: 'delivery structure' },
      { value: 'Interdisciplinary', label: 'across architecture and allied fields' },
      { value: 'Community-rooted', label: 'through real site partnerships' },
    ],
    sections: [
      {
        eyebrow: 'Model',
        title: 'Why BEAM exists',
        body: [
          'Many communities have buildings that matter but lack the capacity, language, or first-phase resources to move a project forward.',
          'At the same time, universities contain students and faculty who need applied work that reaches beyond simulation and into the complexity of stewardship, documentation, and implementation.',
          'BEAM Architecture exists to connect those realities in a disciplined, project-based format.',
        ],
      },
      {
        eyebrow: 'Structure',
        title: 'How the cohort model works',
        body: [
          'Each cohort forms around a real site question, a faculty-supported work plan, and a clear set of outputs.',
          'Rather than treating community engagement as peripheral, the model makes the site itself the organizing center for research, design, documentation, and strategic planning.',
        ],
        bullets: [
          'Faculty guide standards, methods, and review cycles.',
          'Students carry work forward through coordinated production and field investigation.',
          'Community partners contribute access, context, and decision-making priorities.',
        ],
      },
      {
        eyebrow: 'Discipline',
        title: 'Interdisciplinary by design',
        body: [
          'Architecture is the backbone, but many site questions demand adjacent expertise.',
          'Historic preservation, fabrication, accessibility planning, and real estate strategy are not side topics. They are part of how buildings actually move toward reuse, investment, and responsible stewardship.',
        ],
      },
      {
        eyebrow: 'Outcome',
        title: 'What credibility looks like',
        body: [
          'The aim is academically credible work that can be reviewed by faculty and used by partner organizations.',
          'Deliverables should be rigorous enough to inform next-stage planning, fundraising, consultant engagement, or future cohorts.',
        ],
      },
    ],
    highlights: copyBlocks,
  },
  'central-umc': {
    slug: 'central-umc',
    label: 'Current Pilot: Central UMC',
    href: '/central-umc',
    title: 'Central UMC is the active pilot used to test BEAM Architecture in a live community setting.',
    description:
      'The Central UMC pilot is the first concentrated proof of how a BEAM cohort can document an existing building, frame preservation and reuse questions, and produce phased support for real next steps.',
    summary:
      'This pilot matters because it places the model inside a living site context where architecture, preservation, access, institutional decision-making, and implementation strategy all need to be addressed together.',
    stats: pilotMetrics,
    sections: [
      {
        eyebrow: 'Pilot Brief',
        title: 'What the pilot is designed to test',
        body: [
          'Central UMC gives BEAM a real building, a real stewardship context, and a real decision environment.',
          'The pilot tests whether a faculty-guided student cohort can produce work that is simultaneously educational, credible, and useful to a partner site.',
        ],
      },
      {
        eyebrow: 'Scope',
        title: 'Likely workstreams',
        body: [
          'The pilot can support documentation, preservation framing, adaptive reuse thinking, accessibility review, and phased implementation planning.',
          'Each workstream is coordinated so the project does not fragment into isolated classroom exercises.',
        ],
        bullets: [
          'Existing conditions and field documentation',
          'Historic and architectural reading of the site',
          'Accessibility priorities and phased interventions',
          'Reuse and implementation scenarios',
        ],
      },
      {
        eyebrow: 'Learning',
        title: 'What students and faculty gain',
        body: [
          'Students encounter the full complexity of a building with history, public meaning, physical constraints, and institutional realities.',
          'Faculty gain a project platform where teaching, advising, and community-linked scholarship can operate together.',
        ],
      },
      {
        eyebrow: 'Future',
        title: 'Why the pilot matters beyond one site',
        body: [
          'The goal is not only to support Central UMC. It is to establish a replicable method for future BEAM Architecture cohorts.',
          'If the pilot succeeds, it becomes a precedent for how sites, faculty, and student teams can work together across the broader BEAM network.',
        ],
      },
    ],
  },
  'faculty-partnerships': {
    slug: 'faculty-partnerships',
    label: 'Faculty Partnerships',
    href: '/faculty-partnerships',
    title: 'Faculty can shape BEAM Architecture as advisors, project sponsors, or course partners.',
    description:
      'The faculty partnership model is built for educators who want academically rigorous applied work without sacrificing disciplinary seriousness or community accountability.',
    summary:
      'BEAM creates multiple entry points so faculty can participate at the level that fits their calendar, institution, and agenda while still influencing project quality and student formation.',
    stats: [
      { value: 'Advisor', label: 'method and review support' },
      { value: 'Sponsor', label: 'project framing and stewardship' },
      { value: 'Course Partner', label: 'integrated teaching pathway' },
    ],
    sections: [
      {
        eyebrow: 'Roles',
        title: 'Three practical modes of participation',
        body: [
          'Faculty can enter as advisors who sharpen methods and review work, as sponsors who help define a project platform, or as course partners who integrate the cohort into semester-based teaching.',
          'The model is intentionally flexible so it can work for architecture faculty and for allied disciplines that strengthen the project.',
        ],
      },
      {
        eyebrow: 'Academic Value',
        title: 'What faculty partnerships make possible',
        body: [
          'Faculty partnerships turn community projects into serious teaching and research opportunities.',
          'The work can generate studio prompts, seminars, field documentation exercises, preservation case studies, fabrication prototypes, or planning analyses grounded in a live site.',
        ],
      },
      {
        eyebrow: 'Review',
        title: 'How rigor is maintained',
        body: [
          'Faculty help define standards for evidence, representation, coordination, and critique.',
          'That means site partners receive stronger work and students learn that professional credibility depends on process as much as presentation.',
        ],
      },
      {
        eyebrow: 'Audience',
        title: 'Who this page is for',
        body: [
          'This page is for architecture faculty and adjacent educators who want public-facing, project-based collaboration.',
          'It is especially relevant for faculty like William Krueger at UWM who are positioned to bridge practice, pedagogy, and community-rooted site work.',
        ],
      },
    ],
  },
  'student-cohorts': {
    slug: 'student-cohorts',
    label: 'Student Cohorts',
    href: '/student-cohorts',
    title: 'Student cohorts translate classroom learning into site-based professional practice.',
    description:
      'Students join BEAM Architecture to work on buildings and redevelopment questions that require documentation, coordination, technical judgment, and public responsibility.',
    summary:
      'The cohort is where practical experience becomes structured: students work with faculty and partners, produce real deliverables, and learn how projects move through actual constraints.',
    stats: [
      { value: 'Applied', label: 'experience tied to live sites' },
      { value: 'Collaborative', label: 'teams across disciplines and skill levels' },
      { value: 'Portfolio-ready', label: 'deliverables with public and professional value' },
    ],
    sections: [
      {
        eyebrow: 'Structure',
        title: 'How cohorts are organized',
        body: [
          'A cohort forms around a specific site, a defined scope, and faculty-guided review points.',
          'Students are not asked to float in the abstract. They work toward documented outputs and a formal handoff.',
        ],
      },
      {
        eyebrow: 'Participation',
        title: 'Who should apply',
        body: [
          'Architecture students are a natural fit, but BEAM is designed to include students from preservation, planning, real estate, fabrication, landscape, accessibility, and related fields.',
          'Interdisciplinary collaboration is part of the model because real buildings demand it.',
        ],
      },
      {
        eyebrow: 'Learning',
        title: 'What students gain',
        body: [
          'Students gain practical experience through real community projects rather than speculative exercises alone.',
          'They learn how to document conditions, synthesize evidence, communicate with partners, and frame phased next steps.',
        ],
        bullets: [
          'Field documentation and analytical methods',
          'Team coordination and public accountability',
          'Exposure to preservation, access, and implementation logic',
          'A clearer pipeline from education into professional practice',
        ],
      },
      {
        eyebrow: 'Responsibility',
        title: 'What the work demands',
        body: [
          'BEAM expects seriousness. Sites are not props for student experience; they are partners with real needs and constraints.',
          'That means reliability, careful observation, responsive communication, and work that can stand up to review.',
        ],
      },
    ],
  },
  'project-types': {
    slug: 'project-types',
    label: 'Project Types',
    href: '/project-types',
    title: 'BEAM Architecture works across architecture, preservation, adaptation, fabrication, access, and strategy.',
    description:
      'Projects are chosen for their ability to connect academic expertise with building realities. The focus is on work that can move a site from uncertainty toward action.',
    summary:
      'Project type does not define the cohort alone. BEAM combines multiple lenses when a site requires it, because built environment problems rarely arrive in neat disciplinary categories.',
    stats: [
      { value: '6', label: 'core project tracks' },
      { value: 'Hybrid', label: 'projects often span more than one track' },
      { value: 'Phased', label: 'work can begin before full design mobilization' },
    ],
    sections: [
      {
        eyebrow: 'Selection',
        title: 'What makes a project a good fit',
        body: [
          'Strong BEAM projects have a real site, a definable question, and a community partner ready to engage a disciplined early phase.',
          'The work may be pre-design, but it is not vague. Each project needs an attainable scope and a reason the cohort can create momentum.',
        ],
      },
      {
        eyebrow: 'Integration',
        title: 'Why the project tracks overlap',
        body: [
          'A preservation question may become an accessibility problem. A reuse study may require real estate reasoning. A concept package may lead directly into fabrication tests.',
          'BEAM treats these overlaps as normal and uses them to connect students and faculty across disciplines.',
        ],
      },
    ],
    highlights: projectTypes,
  },
  deliverables: {
    slug: 'deliverables',
    label: 'Deliverables',
    href: '/deliverables',
    title: 'Deliverables are designed to help sites decide, communicate, and move toward implementation.',
    description:
      'BEAM deliverables should be useful to faculty, students, boards, donors, redevelopment partners, and future design teams. The point is not output for output’s sake. The point is forward motion.',
    summary:
      'A BEAM cohort concludes with a documented package that frames the site, clarifies priorities, and provides a practical handoff into the next stage of work.',
    stats: [
      { value: 'Documented', label: 'site knowledge captured in durable form' },
      { value: 'Actionable', label: 'outputs aimed at next decisions' },
      { value: 'Transferable', label: 'work that future teams can build on' },
    ],
    sections: [
      {
        eyebrow: 'Purpose',
        title: 'Why deliverables matter',
        body: [
          'Many community sites stall because information lives in fragments, memory, or disconnected consultant documents.',
          'BEAM deliverables consolidate what is known, what has been observed, and what should happen next in a form that can actually be used.',
        ],
      },
      {
        eyebrow: 'Use',
        title: 'Who uses the output',
        body: [
          'Deliverables can support internal board conversations, faculty assessment, donor communication, grant positioning, consultant onboarding, or future cohort work.',
          'The format changes by project, but the goal stays consistent: increase clarity and reduce drift.',
        ],
      },
    ],
    highlights: deliverables,
  },
  'community-partners': {
    slug: 'community-partners',
    label: 'Community Partners',
    href: '/community-partners',
    title: 'Community partners bring the real sites, stewardship questions, and redevelopment needs that make BEAM Architecture meaningful.',
    description:
      'BEAM works with organizations that have a building, property, or campus question requiring thoughtful early-phase support before or alongside conventional project delivery.',
    summary:
      'This is especially valuable for sites that need documentation, planning, preservation framing, access strategy, or phased execution thinking but are not yet positioned for a full design or construction mobilization.',
    stats: [
      { value: 'Buildings', label: 'existing structures with real public stakes' },
      { value: 'Partners', label: 'stewards ready to share context and priorities' },
      { value: 'Phased Support', label: 'from first documentation to next-stage planning' },
    ],
    sections: [
      {
        eyebrow: 'Fit',
        title: 'Who should refer a site',
        body: [
          'Congregations, nonprofits, neighborhood anchors, civic stewards, and redevelopment groups are all possible partners when they have a real built-environment challenge.',
          'The strongest referrals involve a site with significance, practical constraints, and a clear need for disciplined first-phase work.',
        ],
      },
      {
        eyebrow: 'Support',
        title: 'What community sites can receive',
        body: [
          'Community sites can receive documentation, planning, and phased project support shaped by the site’s actual condition and decision horizon.',
          'That may include existing conditions work, accessibility framing, reuse scenarios, preservation analysis, or implementation sequencing.',
        ],
      },
      {
        eyebrow: 'Collaboration',
        title: 'What BEAM needs from partners',
        body: [
          'Partners need to provide access, context, and a willingness to engage review cycles with students and faculty.',
          'The work is collaborative, but it still requires a site steward who can help set priorities and receive the final handoff.',
        ],
      },
      {
        eyebrow: 'Progress',
        title: 'How BEAM helps sites move forward',
        body: [
          'A site may begin with uncertainty or fragmented information. BEAM helps turn that into a coherent first body of evidence and strategy.',
          'That in turn makes later fundraising, consultant work, board action, or implementation planning more grounded and more credible.',
        ],
      },
    ],
  },
  join: {
    slug: 'join',
    label: 'Join / Apply',
    href: '/join',
    title: 'One intake, three entry points: faculty interest, student interest, and site or project referral.',
    description:
      'BEAM Architecture uses a shared intake so faculty, students, and community partners can enter the same system while still describing their distinct goals, capacities, and project contexts.',
    summary:
      'This page is the front door for participation. The public website collects interest and referral information, then the program can route each person or site into the right next-step conversation and onboarding path.',
    stats: [
      { value: 'Faculty', label: 'advisors, sponsors, and course partners' },
      { value: 'Students', label: 'architecture and allied-discipline applicants' },
      { value: 'Sites', label: 'buildings and redevelopment referrals' },
    ],
    sections: [
      {
        eyebrow: 'Intake',
        title: 'Choose the path that matches your role',
        body: [
          'Faculty should use the faculty form to describe institutional fit, advising interest, and calendar timing.',
          'Students should use the student form to describe discipline, experience, and the type of site-based work they want to pursue.',
          'Community partners should use the site referral form to describe the building, the need, and the kind of support required.',
        ],
      },
      {
        eyebrow: 'Review',
        title: 'What happens after submission',
        body: [
          'BEAM reviews each intake in relation to current pilot work, upcoming cohorts, faculty capacity, and site fit.',
          'The next step may be a faculty conversation, a student follow-up, a site scoping discussion, or a referral into a more formal participant onboarding flow.',
        ],
      },
      {
        eyebrow: 'Account Flow',
        title: 'How participation will be scaffolded',
        body: [
          'This site handles public interest capture. Participant accounts and role-specific onboarding can then be issued through the broader BEAM stack once a person or site is being actively routed into project work.',
          'That keeps public intake lightweight while preserving a more structured authenticated environment for active participants.',
        ],
      },
    ],
    showForms: true,
    formLead:
      'Use the intake that matches your role. If you are unsure, submit the closest fit and describe the context in your message.',
  },
  contact: {
    slug: 'contact',
    label: 'Contact',
    href: '/contact',
    title: 'Contact BEAM Architecture to start a faculty conversation, student pathway, or site-focused project discussion.',
    description:
      'Use the BEAM intake to begin the right conversation. The program is designed to coordinate across academic, community, and implementation contexts rather than treat them as separate silos.',
    summary:
      'Contact starts with clarity: who you are, what site or institutional context you are working from, and what kind of next step would be most useful.',
    stats: [
      { value: 'Program', label: 'coordination across cohorts and partners' },
      { value: 'Focused', label: 'responses organized by role and project fit' },
      { value: 'Field-ready', label: 'conversations centered on actual buildings and needs' },
    ],
    sections: [
      {
        eyebrow: 'Use This Page',
        title: 'What to send',
        body: [
          'The strongest inquiries include enough context to identify whether the next step is academic, site-based, or participant-oriented.',
          'If you have a building or redevelopment need, describe the place. If you are a faculty or student contact, describe the institutional and disciplinary context.',
        ],
      },
      {
        eyebrow: 'Response',
        title: 'How follow-up is framed',
        body: [
          'Responses are organized around fit, capacity, and immediate relevance to active or upcoming cohort work.',
          'That means the first reply may clarify scope, ask for supporting material, or redirect you toward the appropriate participation path.',
        ],
      },
    ],
    showForms: true,
    formLead:
      'All public contact currently routes through the same structured intake so BEAM can sort faculty conversations, student applications, and site referrals into the correct next step.',
  },
}

export function isPageSlug(value: string): value is PageSlug {
  return (pageSlugs as readonly string[]).includes(value)
}
