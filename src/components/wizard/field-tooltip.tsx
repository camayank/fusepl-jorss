'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { FIELD_TOOLTIPS, type TooltipContent } from '@/lib/data/field-tooltips'
import { useValuationStore } from '@/stores/valuation-store'

interface Props {
  field: string
}

export function FieldTooltip({ field }: Props) {
  const [open, setOpen] = useState(false)
  const sector = useValuationStore((s) => s.inputs.sector)

  const tooltipFn = FIELD_TOOLTIPS[field]
  if (!tooltipFn) return null

  const content: TooltipContent = tooltipFn({ sector })

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-slate-500 hover:text-amber-400 transition-colors"
        aria-label={`Help for ${field}`}
      >
        <HelpCircle className="h-3.5 w-3.5 inline" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute z-50 left-0 top-6 w-72 p-3 rounded-lg border border-slate-700 bg-slate-800 shadow-xl text-xs space-y-2">
            <p className="text-slate-200">{content.definition}</p>
            {content.benchmark && (
              <p className="text-amber-400">{content.benchmark}</p>
            )}
            <p className="text-slate-400 italic">{content.guidance}</p>
          </div>
        </>
      )}
    </span>
  )
}
