import type { ValuationPurpose } from '@/types'

export interface ReportConfig {
  showMethodWorking: boolean
  showAINarrative: boolean
  showSensitivity: boolean
  showComparableDetails: boolean
  showInvestorMatch: boolean
  showESOPDetail: boolean
  showListedComparables: boolean
  showIBCDownside: boolean
  showRegulatoryCompliance: boolean
  showCredentials: boolean
  disclaimerLevel: 'basic' | 'enhanced' | 'full_regulatory'
  aiPromptVariant: ValuationPurpose
  pdfWatermark: boolean
}

export function getReportConfig(purpose: ValuationPurpose): ReportConfig {
  return {
    showMethodWorking: purpose !== 'indicative',
    showAINarrative: purpose !== 'indicative',
    showSensitivity: purpose !== 'indicative',
    showComparableDetails: purpose !== 'indicative',
    showInvestorMatch: purpose === 'fundraising' || purpose === 'ma',
    showESOPDetail: purpose === 'esop' || purpose === 'rule_11ua',
    showListedComparables: purpose === 'rule_11ua' || purpose === 'fema' || purpose === 'ma',
    showIBCDownside: purpose === 'ma',
    showRegulatoryCompliance: ['rule_11ua', 'fema', 'ma'].includes(purpose),
    showCredentials: ['rule_11ua', 'fema', 'ma'].includes(purpose),
    disclaimerLevel: purpose === 'indicative'
      ? 'basic'
      : purpose === 'fundraising' || purpose === 'esop'
        ? 'enhanced'
        : 'full_regulatory',
    aiPromptVariant: purpose,
    pdfWatermark: purpose === 'indicative',
  }
}
