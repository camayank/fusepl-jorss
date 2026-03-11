import type { DamodaranBenchmark } from '@/types'
import damodaranRaw from '../../../public/data/damodaran/india-benchmarks.json'

const data = damodaranRaw as Record<string, DamodaranBenchmark>

/**
 * Get Damodaran benchmark by exact Damodaran industry name.
 * Use this when you have the raw Damodaran industry string.
 * For startup category lookups, use getDamodaranBenchmark from sector-mapping.
 */
export function getDamodaranByIndustry(industry: string): DamodaranBenchmark | null {
  return data[industry] ?? null
}

/** Get all available Damodaran industry names */
export function getDamodaranIndustries(): string[] {
  return Object.keys(data)
}

/** Get the full dataset */
export function getAllDamodaranData(): Record<string, DamodaranBenchmark> {
  return { ...data }
}
