import type { ListedComparable, StartupCategory } from '@/types'

export const LISTED_COMPARABLES: ListedComparable[] = [
  // SaaS / IT Services
  { name: 'Infosys', ticker: 'INFY', sector: 'saas_horizontal', market_cap_cr: 625000, revenue_cr: 161000, ebitda_cr: 46000, pe_ratio: 28.5, ev_revenue: 3.9, ev_ebitda: 14.2, as_of_date: '2025-12', source: 'NSE' },
  { name: 'TCS', ticker: 'TCS', sector: 'saas_horizontal', market_cap_cr: 1450000, revenue_cr: 242000, ebitda_cr: 70000, pe_ratio: 31.2, ev_revenue: 6.0, ev_ebitda: 20.7, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Persistent Systems', ticker: 'PERSISTENT', sector: 'saas_horizontal', market_cap_cr: 55000, revenue_cr: 9500, ebitda_cr: 1800, pe_ratio: 62.5, ev_revenue: 5.8, ev_ebitda: 30.6, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Coforge', ticker: 'COFORGE', sector: 'saas_horizontal', market_cap_cr: 40000, revenue_cr: 9200, ebitda_cr: 1600, pe_ratio: 45.0, ev_revenue: 4.3, ev_ebitda: 25.0, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Newgen Software', ticker: 'NEWGEN', sector: 'saas_horizontal', market_cap_cr: 12000, revenue_cr: 1200, ebitda_cr: 350, pe_ratio: 55.0, ev_revenue: 10.0, ev_ebitda: 34.3, as_of_date: '2025-12', source: 'NSE' },

  // Fintech
  { name: 'Paytm (One97)', ticker: 'PAYTM', sector: 'fintech_payments', market_cap_cr: 38000, revenue_cr: 9200, ebitda_cr: -200, pe_ratio: null, ev_revenue: 4.1, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },
  { name: 'PB Fintech (PolicyBazaar)', ticker: 'POLICYBZR', sector: 'fintech_insurance', market_cap_cr: 58000, revenue_cr: 3800, ebitda_cr: 200, pe_ratio: null, ev_revenue: 15.3, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Angel One', ticker: 'ANGELONE', sector: 'fintech_payments', market_cap_cr: 22000, revenue_cr: 4200, ebitda_cr: 1800, pe_ratio: 18.5, ev_revenue: 5.2, ev_ebitda: 12.2, as_of_date: '2025-12', source: 'NSE' },

  // E-Commerce / D2C
  { name: 'Nykaa (FSN E-Commerce)', ticker: 'NYKAA', sector: 'ecommerce_beauty', market_cap_cr: 50000, revenue_cr: 6300, ebitda_cr: 350, pe_ratio: 300.0, ev_revenue: 7.9, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Zomato', ticker: 'ZOMATO', sector: 'ecommerce_grocery', market_cap_cr: 230000, revenue_cr: 16500, ebitda_cr: 1500, pe_ratio: null, ev_revenue: 13.9, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },

  // EdTech
  { name: 'Veranda Learning', ticker: 'VERANDA', sector: 'edtech_test_prep', market_cap_cr: 2800, revenue_cr: 850, ebitda_cr: 120, pe_ratio: 45.0, ev_revenue: 3.3, ev_ebitda: 23.3, as_of_date: '2025-12', source: 'NSE' },

  // HealthTech
  { name: 'Vijaya Diagnostic', ticker: 'VIJAYA', sector: 'healthtech_services', market_cap_cr: 8500, revenue_cr: 700, ebitda_cr: 280, pe_ratio: 48.0, ev_revenue: 12.1, ev_ebitda: 30.4, as_of_date: '2025-12', source: 'NSE' },
  { name: 'Narayana Hrudayalaya', ticker: 'NH', sector: 'healthtech_services', market_cap_cr: 28000, revenue_cr: 5200, ebitda_cr: 1100, pe_ratio: 40.0, ev_revenue: 5.4, ev_ebitda: 25.5, as_of_date: '2025-12', source: 'NSE' },

  // Logistics
  { name: 'Delhivery', ticker: 'DELHIVERY', sector: 'logistics_last_mile', market_cap_cr: 28000, revenue_cr: 8500, ebitda_cr: 250, pe_ratio: null, ev_revenue: 3.3, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },

  // Auto / EV
  { name: 'Ola Electric', ticker: 'OLAELEC', sector: 'auto_ev', market_cap_cr: 32000, revenue_cr: 5200, ebitda_cr: -2500, pe_ratio: null, ev_revenue: 6.2, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },

  // Real Estate Tech
  { name: 'Info Edge (Naukri)', ticker: 'NAUKRI', sector: 'hrtech_recruitment', market_cap_cr: 85000, revenue_cr: 2800, ebitda_cr: 900, pe_ratio: 70.0, ev_revenue: 30.4, ev_ebitda: null, as_of_date: '2025-12', source: 'NSE' },

  // Media
  { name: 'Nazara Technologies', ticker: 'NAZARA', sector: 'gaming_mobile', market_cap_cr: 6500, revenue_cr: 1500, ebitda_cr: 200, pe_ratio: 55.0, ev_revenue: 4.3, ev_ebitda: 32.5, as_of_date: '2025-12', source: 'NSE' },

  // CleanTech
  { name: 'Tata Power (Renewables)', ticker: 'TATAPOWER', sector: 'cleantech_solar', market_cap_cr: 140000, revenue_cr: 60000, ebitda_cr: 12000, pe_ratio: 35.0, ev_revenue: 2.3, ev_ebitda: 11.7, as_of_date: '2025-12', source: 'NSE' },

  // Manufacturing
  { name: 'Dixon Technologies', ticker: 'DIXON', sector: 'manufacturing_electronics', market_cap_cr: 75000, revenue_cr: 18000, ebitda_cr: 1200, pe_ratio: 120.0, ev_revenue: 4.2, ev_ebitda: 62.5, as_of_date: '2025-12', source: 'NSE' },
]

/**
 * Find listed comparables matching a sector.
 * Returns all matches for the given sector.
 */
export function getListedComparables(sector: StartupCategory): ListedComparable[] {
  return LISTED_COMPARABLES.filter(c => c.sector === sector)
}
