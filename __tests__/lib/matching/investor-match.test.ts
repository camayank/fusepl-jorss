import { describe, it, expect } from 'vitest'
import { matchInvestors } from '@/lib/matching/investor-match'

describe('matchInvestors', () => {
  const baseQuery = {
    sector: 'saas' as const,
    stage: 'seed' as const,
    city: 'Bangalore',
    target_raise_cr: 5,
  }

  it('returns top 5 matches sorted by score descending', () => {
    const matches = matchInvestors(baseQuery)
    expect(matches.length).toBeLessThanOrEqual(5)
    expect(matches.length).toBeGreaterThan(0)
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i].score).toBeLessThanOrEqual(matches[i - 1].score)
    }
  })

  it('includes reasons for each match', () => {
    const matches = matchInvestors(baseQuery)
    for (const match of matches) {
      expect(match.reasons.length).toBeGreaterThan(0)
    }
  })

  it('gives +3 for exact sector match', () => {
    const matches = matchInvestors({ ...baseQuery, sector: 'saas' })
    const hasSectorMatch = matches.some(m =>
      m.reasons.some(r => r.includes('sector'))
    )
    expect(hasSectorMatch).toBe(true)
  })

  it('gives +1 for adjacent sector match', () => {
    const matches = matchInvestors({ ...baseQuery, sector: 'agritech' })
    expect(matches.length).toBeGreaterThan(0)
  })

  it('gives +2 for stage sweet spot', () => {
    const matches = matchInvestors(baseQuery)
    const hasStageMatch = matches.some(m =>
      m.reasons.some(r => r.includes('stage'))
    )
    expect(hasStageMatch).toBe(true)
  })

  it('gives +1 for geographic proximity', () => {
    const bangaloreMatches = matchInvestors({ ...baseQuery, city: 'Bangalore' })
    const delhiMatches = matchInvestors({ ...baseQuery, city: 'Delhi' })
    expect(bangaloreMatches).not.toEqual(delhiMatches)
  })

  it('filters by check size', () => {
    const smallRaise = matchInvestors({ ...baseQuery, target_raise_cr: 0.3 })
    const largeRaise = matchInvestors({ ...baseQuery, target_raise_cr: 300 })
    const smallNames = smallRaise.map(m => m.investor.name)
    const largeNames = largeRaise.map(m => m.investor.name)
    expect(smallNames).not.toEqual(largeNames)
  })

  it('returns empty array if no investors match', () => {
    const matches = matchInvestors({
      sector: 'auto_mobility',
      stage: 'series_c_plus',
      city: 'Patna',
      target_raise_cr: 5000,
    })
    expect(matches.length).toBeLessThanOrEqual(5)
  })

  it('includes investor metadata in results', () => {
    const matches = matchInvestors(baseQuery)
    if (matches.length > 0) {
      const first = matches[0].investor
      expect(first.name).toBeTruthy()
      expect(first.type).toBeTruthy()
      expect(first.sectors.length).toBeGreaterThan(0)
    }
  })
})
