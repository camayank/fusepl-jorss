import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-500">
          firstunicornstartup.com — Built by an IBBI-Registered IP & SFA-Licensed Valuer
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/valuation" className="text-slate-400 hover:text-amber-400 hover:underline">Valuation</Link>
          <Link href="/cap-table" className="text-slate-400 hover:text-amber-400 hover:underline">Cap Table</Link>
          <Link href="/esop-calculator" className="text-slate-400 hover:text-amber-400 hover:underline">ESOP Calculator</Link>
          <Link href="/privacy" className="text-slate-400 hover:text-amber-400 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-slate-400 hover:text-amber-400 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
