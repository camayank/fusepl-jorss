import { Hero } from '@/components/landing/hero'
import { TrustSignals } from '@/components/landing/trust-signals'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MethodShowcase } from '@/components/landing/method-showcase'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <MethodShowcase />
      <Footer />
    </main>
  )
}
