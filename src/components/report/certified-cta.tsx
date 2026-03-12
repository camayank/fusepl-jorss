'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface Props {
  valuationId: string
  email: string
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.head.appendChild(script)
  })
}

export function CertifiedCTA({ valuationId, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  const canPurchase = email.length > 0

  const handleCheckout = async () => {
    if (!canPurchase) return
    setLoading(true)

    try {
      const res = await fetch('/api/certified/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_id: valuationId, email }),
      })

      if (res.status === 503) {
        toast.error('Payment service is being set up. Contact us directly.')
        setLoading(false)
        return
      }

      if (res.status === 400) {
        toast.error('Please complete a valuation and provide your email first.')
        setLoading(false)
        return
      }

      if (!res.ok) {
        toast.error('Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      const data = await res.json()

      await loadRazorpayScript()

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: 'First Unicorn Startup',
        description: 'IBBI-Certified Valuation Report',
        handler: () => {
          setPaid(true)
          setLoading(false)
          toast.success('Payment received! Your certified report will be delivered within 48 hours.')
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: '#f59e0b' },
      })

      rzp.open()
    } catch {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <Card className="border-2 border-green-500/30 bg-green-500/5">
        <CardContent className="text-center py-8 space-y-3">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Payment Received</h2>
          <p className="text-sm text-slate-400">
            Your certified valuation report will be delivered to <strong className="text-white">{email}</strong> within 48 hours.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-amber-500/30 bg-amber-500/5">
      <CardContent className="text-center py-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Need a Legally Valid Valuation?</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Get a certified Rule 11UA / FEMA valuation report — Rs 14,999.
          Signed by a registered valuer. Valid for RoC filing, fundraising, and tax compliance.
        </p>
        <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Compliant with Rule 11UA (Income Tax Act)
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Valid for FEMA pricing (foreign investment)
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> 15-20 page professional report
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Signed by registered valuer with registration number
          </li>
          <li className="flex items-center gap-2 text-slate-300">
            <span className="text-green-500">&#10003;</span> Delivered within 48 hours of payment
          </li>
        </ul>
        <Button
          size="lg"
          className="mt-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          onClick={handleCheckout}
          disabled={loading || !canPurchase}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Certified Report — Rs 14,999'
          )}
        </Button>
        {!canPurchase && (
          <p className="text-xs text-amber-400">Complete the email gate above to purchase</p>
        )}
        <p className="text-xs text-slate-500">
          Payment via Razorpay. GST included. Refund if not delivered within 48 hours.
        </p>
      </CardContent>
    </Card>
  )
}
