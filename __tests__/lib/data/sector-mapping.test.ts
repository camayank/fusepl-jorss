import { describe, it, expect } from 'vitest'
import { SECTOR_MAPPING, getSectorLabel, getDamodaranBenchmark, getAdjacentSectors } from '@/lib/data/sector-mapping'
import { STARTUP_CATEGORIES } from '@/types'

describe('sector-mapping', () => {
  it('has mapping for all startup categories', () => {
    for (const cat of STARTUP_CATEGORIES) {
      expect(SECTOR_MAPPING[cat]).toBeDefined()
      expect(SECTOR_MAPPING[cat].label).toBeTruthy()
      expect(SECTOR_MAPPING[cat].primary_damodaran).toBeTruthy()
    }
  })

  it('getSectorLabel returns human-readable label', () => {
    expect(getSectorLabel('saas_horizontal')).toBe('SaaS — Horizontal')
    expect(getSectorLabel('fintech_payments')).toBe('Fintech — Payments')
  })

  it('getDamodaranBenchmark returns benchmark for valid sector', () => {
    const bm = getDamodaranBenchmark('saas_horizontal')
    expect(bm).toBeDefined()
    expect(bm.ev_revenue).toBeGreaterThan(0)
    expect(bm.wacc).toBeGreaterThan(0)
    expect(bm.beta).toBeGreaterThan(0)
  })

  it('getDamodaranBenchmark falls back to secondary when primary missing', () => {
    const bm = getDamodaranBenchmark('fintech_banking')
    expect(bm).toBeDefined()
    expect(bm.wacc).toBeGreaterThan(0)
  })

  it('getDamodaranBenchmark returns Total Market for "other"', () => {
    const bm = getDamodaranBenchmark('other')
    expect(bm.ev_revenue).toBeCloseTo(3.2, 0)
  })

  it('getAdjacentSectors returns array', () => {
    const adj = getAdjacentSectors('saas_horizontal')
    expect(adj).toContain('saas_collaboration')
    expect(adj).toContain('saas_analytics')
  })
})
