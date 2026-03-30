import { NextRequest, NextResponse } from 'next/server'

type InquiryType = 'faculty' | 'student' | 'site'

const requiredFieldsByType: Record<InquiryType, string[]> = {
  faculty: ['fullName', 'email', 'institution', 'participationMode', 'message'],
  student: ['fullName', 'email', 'school', 'experienceLevel', 'focusArea', 'message'],
  site: ['fullName', 'email', 'organization', 'siteName', 'supportNeeded', 'message'],
}

const successMessages: Record<InquiryType, string> = {
  faculty: 'Faculty interest received. BEAM will follow up about advising, sponsorship, or course partnership fit.',
  student: 'Student interest received. BEAM will follow up about cohort opportunities and next steps.',
  site: 'Site referral received. BEAM will review the building context and follow up about project fit and scope.',
}

function isInquiryType(value: unknown): value is InquiryType {
  return value === 'faculty' || value === 'student' || value === 'site'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const inquiryType = body.inquiryType

    if (!isInquiryType(inquiryType)) {
      return NextResponse.json({ error: 'Invalid inquiry type.' }, { status: 400 })
    }

    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    const missingFields = requiredFieldsByType[inquiryType].filter((field) => {
      const value = body[field]
      return typeof value !== 'string' || value.trim().length === 0
    })

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const payload = Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    )

    console.log('BEAM intake submission:', {
      inquiryType,
      payload,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: successMessages[inquiryType],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('BEAM intake error:', error)

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
