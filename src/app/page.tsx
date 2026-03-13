import { Hero } from '@/components/landing/hero'
import { AuthorityBrands } from '@/components/landing/authority-brands'
import { TrustSignals } from '@/components/landing/trust-signals'
import { FounderAuthority } from '@/components/landing/founder-authority'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MethodShowcase } from '@/components/landing/method-showcase'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      <Hero />
      <AuthorityBrands />
      <TrustSignals />
      <FounderAuthority />
      <HowItWorks />
      <MethodShowcase />
      <CtaSection />
      <Footer />
    </main>
  )
}
