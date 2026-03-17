'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { calculateValuation } from '@/lib/valuation'
import { WIZARD_STEPS } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanyStep } from './company-step'
import { TeamStep } from './team-step'
import { FinancialsStep } from './financials-step'
import { MarketProductStep } from './market-product-step'
import { StrategicStep } from './strategic-step'
import { ESOPCapTableStep } from './esop-captable-step'
import { PreviousValuationsDialog } from './previous-valuations-dialog'
import { toast } from 'sonner'
import { Loader2, ChevronLeft, ChevronRight, Sparkles, Check, Search, History as HistoryIcon } from 'lucide-react'
import type { WizardInputs } from '@/types'

/* ─── useAnimatedCounter ────────────────────────────────────────────── */
export function useAnimatedCounter(target: number, duration = 600) {
  const [value, setValue] = useState(isNaN(target) ? 0 : target)
  const prevTarget = useRef(target)

  useEffect(() => {
    if (isNaN(target)) return
    if (target === prevTarget.current) return
    const from = prevTarget.current
    prevTarget.current = target
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // easeOutQuart
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

/* ─── Stagger variants ──────────────────────────────────────────────── */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/* ─── Celebration Particles ─────────────────────────────────────────── */
function CelebrationParticles({ active }: { active: boolean }) {
  if (!active) return null
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * 360 + (Math.random() * 20 - 10)
    const distance = 50 + Math.random() * 40
    const size = 4 + Math.random() * 4
    const hue = Math.random() > 0.5 ? 330 + Math.random() * 20 : 155 + Math.random() * 20
    const rad = (angle * Math.PI) / 180
    return (
      <motion.div
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size,
          height: size,
          background: `oklch(0.68 0.20 ${hue})`,
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
        animate={{
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
          opacity: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          delay: i * 0.03,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    )
  })

  return (
    <>
      {/* Radial gradient flash */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'radial-gradient(circle at center, oklch(0.62 0.22 330 / 0.3), transparent 70%)',
        }}
      />
      {particles}
    </>
  )
}

function validateStep(step: number, inputs: WizardInputs): string | null {
  switch (step) {
    case 1:
      if (!inputs.company_name.trim()) return 'Company name is required'
      return null
    case 2:
      if (inputs.team_size < 1) return 'Team size must be at least 1'
      return null
    case 3:
      if (inputs.annual_revenue < 0) return 'Revenue cannot be negative'
      if (inputs.gross_margin_pct < 0 || inputs.gross_margin_pct > 100) return 'Gross margin must be 0-100%'
      if (inputs.revenue_growth_pct < -100 || inputs.revenue_growth_pct > 1000) return 'Revenue growth must be -100% to 1000%'
      return null
    case 4:
      if (inputs.tam <= 0) return 'TAM must be greater than 0'
      return null
    case 5:
      return null
    case 6:
      if (inputs.esop_pool_pct !== null && (inputs.esop_pool_pct < 0 || inputs.esop_pool_pct > 30)) {
        return 'ESOP pool must be 0-30%'
      }
      return null
    default:
      return null
  }
}

const STEP_COMPONENTS = [
  CompanyStep,
  TeamStep,
  FinancialsStep,
  MarketProductStep,
  StrategicStep,
  ESOPCapTableStep,
]

const STEP_SUBTITLES = [
  "Let's start with the basics",
  "Tell us about your people",
  "Show us the numbers",
  "How big is the opportunity?",
  "Almost there — just 2 more steps!",
  "Final step — you're at the finish line!",
]

export function WizardContainer() {
  const { currentStep, highestCompletedStep, inputs, nextStep, prevStep, goToStep, completeStep, setResult } =
    useValuationStore()
  const [direction, setDirection] = useState(1)
  const [computing, setComputing] = useState(false)
  const [celebratingStep, setCelebratingStep] = useState<number | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  
  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const completionPct = Math.round(((currentStep - 1) / 6) * 100)

  const triggerCelebration = useCallback((step: number) => {
    setCelebratingStep(step)
    setTimeout(() => setCelebratingStep(null), 800)
  }, [])

  const handleNext = () => {
    const error = validateStep(currentStep, inputs)
    if (error) {
      toast.error(error)
      return
    }
    completeStep(currentStep)
    triggerCelebration(currentStep)
    if (currentStep === 6) {
      setComputing(true)
      setTimeout(() => {
        const result = calculateValuation(inputs)
        setResult(result)
        setComputing(false)
        toast.success('Valuation complete!')
      }, 100)
    } else {
      setDirection(1)
      nextStep()
    }
  }

  const handlePrev = () => {
    setDirection(-1)
    prevStep()
  }

  const handleStepClick = (step: number) => {
    if (step <= highestCompletedStep + 1) {
      setDirection(step > currentStep ? 1 : -1)
      goToStep(step)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-8 space-y-8 z-[10]">
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[oklch(0.62_0.22_330/0.1)] text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-wider">
                  v1.4
                </span>
                <span className="text-[10px] font-semibold text-[oklch(0.45_0.01_260)] uppercase tracking-widest">
                  Protocol
                </span>
              </div>
              <h2 className="font-heading text-xl text-[oklch(0.15_0.02_260)]">
                Valuation Wizard
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[10px] font-bold text-[oklch(0.45_0.01_260)] uppercase tracking-widest">Completion</span>
                <span className="text-xl font-heading text-[oklch(0.15_0.02_260)] tabular-nums">{completionPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-[oklch(0.92_0.005_260)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[oklch(0.62_0.22_330)] to-[oklch(0.75_0.18_162)]"
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            {/* Vertical Discrete Stepper */}
            <nav className="space-y-2 pt-6 border-t border-[oklch(0.91_0.005_260/0.6)]">
              {WIZARD_STEPS.map((label, i) => {
                const stepNum = i + 1
                const isActive = stepNum === currentStep
                const isCompleted = stepNum <= highestCompletedStep
                const isClickable = stepNum <= highestCompletedStep + 1
                return (
                  <button
                    key={label}
                    onClick={() => handleStepClick(stepNum)}
                    disabled={!isClickable}
                    className={`group relative flex items-center gap-4 w-full text-left p-2 rounded-xl transition-all ${isClickable ? 'cursor-pointer hover:bg-[oklch(0.15_0.02_260/0.02)]' : 'cursor-not-allowed'}`}
                  >
                    <div className="relative z-[2]">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isActive ? 'bg-[oklch(0.15_0.02_260)] border-[oklch(0.15_0.02_260)] text-white shadow-[0_0_12px_oklch(0.15_0.02_260/0.2)]' : 
                        isCompleted ? 'bg-[oklch(0.75_0.18_162/0.1)] border-[oklch(0.75_0.18_162/0.4)] text-[oklch(0.75_0.18_162)]' : 
                        'bg-white border-[oklch(0.91_0.005_260)] text-[oklch(0.45_0.01_260)]'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                      </div>
                      {/* Connecting Line */}
                      {i < 5 && (
                        <div className={`absolute top-10 left-4 w-px h-2 -translate-x-1/2 ${
                          stepNum <= highestCompletedStep ? 'bg-[oklch(0.75_0.18_162/0.4)]' : 'bg-[oklch(0.91_0.005_260/0.3)]'
                        }`} />
                      )}
                    </div>
                    <div className="flex flex-col relative z-[2]">
                      <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        isActive ? 'text-[oklch(0.62_0.22_330)]' : isCompleted ? 'text-[oklch(0.15_0.02_260)]' : 'text-[oklch(0.50_0.01_260)]'
                      }`}>
                        {label}
                      </span>
                      {isActive && (
                        <motion.span layoutId="active-subtitle-desktop" className="text-[9px] text-[oklch(0.45_0.01_260)] font-medium leading-tight">
                          {STEP_SUBTITLES[i]}
                        </motion.span>
                      )}
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* Previous Valuations Link */}
            <div className="pt-4 border-t border-[oklch(0.91_0.005_260/0.4)]">
              <button 
                onClick={() => setIsHistoryDialogOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-[oklch(0.91_0.005_260)] text-[10px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)] hover:border-[oklch(0.62_0.22_330/0.4)] hover:text-[oklch(0.62_0.22_330)] hover:bg-[oklch(0.62_0.22_330/0.05)] transition-all cursor-pointer"
              >
                <Search className="w-3 h-3" />
                See Previous Valuations
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header - Visible only on small screens */}
        <div className="lg:hidden w-full space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[oklch(0.62_0.22_330)] uppercase tracking-widest">Step {currentStep} of 6</span>
              <h1 className="font-heading text-xl text-[oklch(0.15_0.02_260)]">{WIZARD_STEPS[currentStep - 1]}</h1>
            </div>
            <div className="text-right">
              <div className="text-xl font-heading text-[oklch(0.15_0.02_260)]">{completionPct}%</div>
            </div>
          </div>
          <div className="h-1.5 w-full bg-[oklch(0.92_0.005_260)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[oklch(0.62_0.22_330)] to-[oklch(0.75_0.18_162)]"
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex justify-center items-center gap-1.5 pt-1">
            {WIZARD_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all ${i + 1 === currentStep ? 'bg-[oklch(0.62_0.22_330)] w-6' : i + 1 < currentStep ? 'bg-[oklch(0.75_0.18_162)] w-3' : 'bg-[oklch(0.91_0.005_260)] w-3'}`} 
              />
            ))}
          </div>
        </div>

        {/* Previous Valuations Dialog */}
        <PreviousValuationsDialog 
          open={isHistoryDialogOpen} 
          onOpenChange={setIsHistoryDialogOpen} 
        />

        {/* Main Content Area */}
        <main className="lg:col-span-9 space-y-4 md:space-y-6">
          <header className="hidden lg:block mb-6">
             <h1 className="font-heading text-3xl text-[oklch(0.15_0.02_260)] leading-tight">
                {WIZARD_STEPS[currentStep - 1]}
              </h1>
              <p className="text-sm text-[oklch(0.45_0.02_260)] opacity-80 mt-1">
                {STEP_SUBTITLES[currentStep - 1]}
              </p>
          </header>

          <div className="relative bg-gradient-to-b from-[oklch(1 0 0)] to-[oklch(0.98 0.002 260)] border border-[oklch(0.91 0.005 260)] rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-[0_4px_32px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.5)] overflow-hidden">
            {/* Top border accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330/0.3)] to-transparent" />
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 30 : -30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction > 0 ? -30 : 30, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[1]"
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls - Fixed on mobile, relative on desktop */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto bg-[oklch(1_0_0/0.85)] lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-t lg:border-t-0 border-[oklch(0.91_0.005_260/0.6)] px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:p-0">
            <div className="max-w-6xl mx-auto flex justify-between items-center lg:bg-white/50 lg:backdrop-blur-sm lg:p-4 lg:rounded-2xl lg:border lg:border-[oklch(0.91_0.005_260/0.6)]">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="btn-press focus-ring group inline-flex items-center gap-1.5 h-11 px-4 sm:px-5 text-sm font-medium rounded-xl border border-[oklch(0.91 0.005 260)] text-[oklch(0.45 0.02 260)] transition-all hover:border-[oklch(0.62_0.22_330/0.3)] hover:text-[oklch(0.62 0.22 330)] hover:bg-[oklch(0.62_0.22_330/0.05)] disabled:opacity-20"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <button 
                onClick={() => setIsHistoryDialogOpen(true)}
                className="lg:hidden flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[oklch(0.45_0.01_260)] opacity-60 hover:opacity-100 transition-opacity"
              >
                <HistoryIcon className="w-4 h-4" />
                History
              </button>

              <button
                onClick={handleNext}
                disabled={computing}
                className="btn-press focus-ring group inline-flex items-center gap-2 h-11 px-6 sm:px-8 text-sm font-semibold rounded-xl bg-[#1e2226] text-white transition-all hover:bg-[#000] hover:shadow-[0_0_24px_oklch(0.62_0.22_330/0.3)] disabled:opacity-50"
              >
                {computing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Analyzing Protocol...</span>
                    <span className="sm:hidden">Computing...</span>
                  </>
                ) : currentStep === 6 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Evaluate</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Next Phase</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Bottom Spacer for Mobile */}
          <div className="h-24 lg:hidden" />
        </main>
      </div>
    </div>
  )
}
