import { describe, it, expect } from 'vitest'
import { SECTOR_MAPPING, getSectorLabel, getDamodaranBenchmark, getAdjacentSectors } from '@/lib/data/sector-mapping'
import type { StartupCategory } from '@/types'

describe('sector-mapping', () => {
  it('has mapping for all 25 startup categories', () => {
    const categories: StartupCategory[] = [
      'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
      'd2c', 'edtech', 'healthtech_products', 'healthtech_services',
      'ecommerce_general', 'ecommerce_grocery', 'marketplace', 'agritech',
      'logistics', 'cleantech', 'deeptech', 'gaming', 'real_estate_tech',
      'auto_mobility', 'manufacturing', 'media_advertising', 'telecom',
      'travel_hospitality', 'social_impact', 'b2b_services', 'other',
    ]
    for (const cat of categories) {
      expect(SECTOR_MAPPING[cat]).toBeDefined()
      expect(SECTOR_MAPPING[cat].label).toBeTruthy()
      expect(SECTOR_MAPPING[cat].primary_damodaran).toBeTruthy()
    }
  })

  it('getSectorLabel returns human-readable label', () => {
    expect(getSectorLabel('saas')).toBe('SaaS / Enterprise Software')
    expect(getSectorLabel('fintech_payments')).toBe('Fintech — Payments & Lending')
  })

  it('getDamodaranBenchmark returns benchmark for valid sector', () => {
    const bm = getDamodaranBenchmark('saas')
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
    const adj = getAdjacentSectors('saas')
    expect(adj).toContain('fintech_payments')
    expect(adj).toContain('marketplace')
  })
})
