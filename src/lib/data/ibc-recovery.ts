import type { StartupCategory } from '@/types'
import ibcRaw from '../../../public/data/ibc/recovery-benchmarks.json'

interface IBCRecovery {
  avg_low: number
  avg_high: number
  sample_size: string
  p25: number
  p75: number
}

const ibcData = ibcRaw as Record<string, IBCRecovery>

// Map startup categories to IBC sectors
const IBC_SECTOR_MAP: Record<string, string> = {
  saas: 'services_it',
  fintech_payments: 'services_it',
  fintech_insurance: 'services_it',
  fintech_banking: 'services_it',
  d2c: 'retail_consumer',
  edtech: 'services_it',
  healthtech_products: 'manufacturing',
  healthtech_services: 'services_it',
  ecommerce_general: 'retail_consumer',
  ecommerce_grocery: 'retail_consumer',
  marketplace: 'services_it',
  agritech: 'manufacturing',
  logistics: 'infrastructure',
  cleantech: 'infrastructure',
  deeptech: 'services_it',
  gaming: 'services_it',
  real_estate_tech: 'real_estate',
  auto_mobility: 'manufacturing',
  manufacturing: 'manufacturing',
  media_advertising: 'services_it',
  telecom: 'infrastructure',
  travel_hospitality: 'retail_consumer',
  social_impact: 'other',
  b2b_services: 'services_it',
  other: 'other',
}

export function getIBCRecovery(category: StartupCategory): IBCRecovery {
  const ibcSector = IBC_SECTOR_MAP[category] || 'other'
  return ibcData[ibcSector] || ibcData['other']
}
