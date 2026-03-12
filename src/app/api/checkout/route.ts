import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { EMAIL_REGEX } from '@/lib/utils'
import { VALUATION_PURPOSES, PURPOSE_PRICES, type ValuationPurpose } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { valuation_id, email, purpose } = body as {
      valuation_id: string
      email: string
      purpose: ValuationPurpose
    }

    // Validate inputs
    if (!valuation_id || typeof valuation_id !== 'string') {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!purpose || !VALUATION_PURPOSES.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
    }

    const amount = PURPOSE_PRICES[purpose]
    if (amount === 0) {
      return NextResponse.json({ error: 'Indicative valuations are free' }, { status: 400 })
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: valuation_id,
      notes: { valuation_id, email, purpose },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
