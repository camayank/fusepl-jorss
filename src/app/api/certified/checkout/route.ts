import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_REGEX } from '@/lib/utils'

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

    const { valuation_id, email } = await req.json()

    if (!valuation_id || typeof valuation_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid valuation_id' },
        { status: 400 }
      )
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Missing or invalid email' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    const order = await razorpay.orders.create({
      amount: 1499900, // Rs 14,999 in paise
      currency: 'INR',
      receipt: valuation_id,
      notes: {
        valuation_id,
        email,
        report_type: 'rule_11ua',
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
