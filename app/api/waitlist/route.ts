import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase'
import { waitlistEmail } from '@/emails/waitlist-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Save to waitlist table (upsert to avoid duplicate error)
    const { error: dbError } = await supabase
      .from('waitlist')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Continue anyway — email still gets sent
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Forticlaw <hello@forticlaw.com>',
      to: email,
      subject: "You're on the list — 20% off for life when we launch",
      html: waitlistEmail(email),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
