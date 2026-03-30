'use client'

import { useState, type FormEvent } from 'react'

type InquiryType = 'faculty' | 'student' | 'site'

type FieldType = 'text' | 'email' | 'textarea' | 'select'

interface FieldOption {
  label: string
  value: string
}

interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  rows?: number
  options?: FieldOption[]
}

interface InquiryConfig {
  id: InquiryType
  anchor: string
  title: string
  description: string
  submitLabel: string
  fields: FieldConfig[]
}

const inquiryConfigs: InquiryConfig[] = [
  {
    id: 'faculty',
    anchor: 'faculty-interest',
    title: 'Faculty interest',
    description:
      'For advisors, project sponsors, and course partners exploring how BEAM can connect teaching, research, and site work.',
    submitLabel: 'Submit faculty interest',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'Your name', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'name@university.edu', required: true },
      { name: 'institution', label: 'Institution', type: 'text', placeholder: 'University or school', required: true },
      { name: 'department', label: 'Department or program', type: 'text', placeholder: 'Architecture, preservation, planning...' },
      {
        name: 'participationMode',
        label: 'Participation mode',
        type: 'select',
        required: true,
        options: [
          { label: 'Select one', value: '' },
          { label: 'Advisor', value: 'advisor' },
          { label: 'Project sponsor', value: 'project-sponsor' },
          { label: 'Course partner', value: 'course-partner' },
          { label: 'Exploratory conversation', value: 'exploratory' },
        ],
      },
      {
        name: 'semesterWindow',
        label: 'Timing',
        type: 'text',
        placeholder: 'Semester, quarter, or planning horizon',
      },
      {
        name: 'message',
        label: 'How would you like to engage?',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: 'Describe fit, site interests, course alignment, or advising goals.',
      },
    ],
  },
  {
    id: 'student',
    anchor: 'student-interest',
    title: 'Student interest',
    description:
      'For architecture and allied-discipline students who want practical experience through real community projects.',
    submitLabel: 'Submit student interest',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'Your name', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'name@school.edu', required: true },
      { name: 'school', label: 'School', type: 'text', placeholder: 'University or college', required: true },
      { name: 'program', label: 'Program or discipline', type: 'text', placeholder: 'Architecture, planning, real estate...' },
      {
        name: 'experienceLevel',
        label: 'Current stage',
        type: 'select',
        required: true,
        options: [
          { label: 'Select one', value: '' },
          { label: 'Undergraduate', value: 'undergraduate' },
          { label: 'Graduate', value: 'graduate' },
          { label: 'Recent graduate', value: 'recent-graduate' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'focusArea',
        label: 'Primary interest',
        type: 'select',
        required: true,
        options: [
          { label: 'Select one', value: '' },
          { label: 'Architecture', value: 'architecture' },
          { label: 'Historic preservation', value: 'historic-preservation' },
          { label: 'Adaptive reuse', value: 'adaptive-reuse' },
          { label: 'Fabrication', value: 'fabrication' },
          { label: 'Accessibility planning', value: 'accessibility-planning' },
          { label: 'Real estate strategy', value: 'real-estate-strategy' },
        ],
      },
      {
        name: 'message',
        label: 'Why are you interested in a BEAM cohort?',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: 'Describe your skills, goals, and the type of site-based work you want to do.',
      },
    ],
  },
  {
    id: 'site',
    anchor: 'site-referral',
    title: 'Site / project referral',
    description:
      'For congregations, nonprofits, civic stewards, or redevelopment partners with a building, campus, or adaptive reuse need.',
    submitLabel: 'Submit site referral',
    fields: [
      { name: 'fullName', label: 'Contact name', type: 'text', placeholder: 'Your name', required: true },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'name@organization.org', required: true },
      { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Organization or ownership entity', required: true },
      { name: 'siteName', label: 'Site or project name', type: 'text', placeholder: 'Building, property, or campus', required: true },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'City, neighborhood, or address' },
      {
        name: 'supportNeeded',
        label: 'Support needed',
        type: 'select',
        required: true,
        options: [
          { label: 'Select one', value: '' },
          { label: 'Documentation', value: 'documentation' },
          { label: 'Historic preservation', value: 'historic-preservation' },
          { label: 'Adaptive reuse planning', value: 'adaptive-reuse-planning' },
          { label: 'Accessibility planning', value: 'accessibility-planning' },
          { label: 'Fabrication / prototyping', value: 'fabrication-prototyping' },
          { label: 'Real estate strategy', value: 'real-estate-strategy' },
          { label: 'Mixed scope', value: 'mixed-scope' },
        ],
      },
      {
        name: 'message',
        label: 'Describe the site and current need',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: 'Share building conditions, current questions, project stage, and what help would be most useful.',
      },
    ],
  },
]

function buildInitialState(fields: FieldConfig[]) {
  return Object.fromEntries(fields.map((field) => [field.name, ''])) as Record<string, string>
}

function IntakeCard({ config }: { config: InquiryConfig }) {
  const [formValues, setFormValues] = useState<Record<string, string>>(() => buildInitialState(config.fields))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryType: config.id,
          ...formValues,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to submit the form right now.')
      }

      setSubmitStatus('success')
      setSubmitMessage(payload.message || 'Thanks. We will follow up soon.')
      setFormValues(buildInitialState(config.fields))
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage(error instanceof Error ? error.message : 'Unable to submit the form right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <article id={config.anchor} className="panel h-full">
      <p className="panel-label">Intake</p>
      <h3 className="mt-4 text-3xl font-semibold text-[var(--ink)]">{config.title}</h3>
      <p className="body-copy mt-3">{config.description}</p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {config.fields.map((field) => {
          const value = formValues[field.name] || ''

          return (
            <label key={field.name} className="field-label">
              <span>
                {field.label}
                {field.required ? ' *' : ''}
              </span>

              {field.type === 'textarea' ? (
                <textarea
                  className="field-textarea"
                  name={field.name}
                  rows={field.rows ?? 4}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                />
              ) : field.type === 'select' ? (
                <select
                  className="field-select"
                  name={field.name}
                  required={field.required}
                  value={value}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                >
                  {(field.options || []).map((option) => (
                    <option key={`${field.name}-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="field-input"
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={value}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                />
              )}
            </label>
          )
        })}

        {submitStatus === 'success' ? <p className="success-box">{submitMessage}</p> : null}
        {submitStatus === 'error' ? <p className="error-box">{submitMessage}</p> : null}

        <button className="cta-primary w-full justify-center" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Submitting...' : config.submitLabel}
        </button>
      </form>
    </article>
  )
}

export default function IntakeForms({ lead }: { lead: string }) {
  return (
    <section id="intake" className="section-pad">
      <div className="site-frame">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Shared Intake</p>
            <h2 className="section-title mt-4 max-w-3xl text-4xl md:text-5xl">
              Start with the right intake instead of a generic contact form.
            </h2>
          </div>
          <p className="body-copy max-w-2xl">{lead}</p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {inquiryConfigs.map((config) => (
            <IntakeCard key={config.id} config={config} />
          ))}
        </div>
      </div>
    </section>
  )
}
