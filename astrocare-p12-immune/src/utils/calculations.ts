import { MonitoringState, ResultInterpretation } from '../types';

/**
 * Calculates absolute change between latest and baseline values.
 */
export function calculateAbsoluteChange(
  latest: number | null | undefined,
  baseline: number | null | undefined
): number | null {
  if (latest === null || latest === undefined || baseline === null || baseline === undefined) {
    return null;
  }
  return Number((latest - baseline).toFixed(2));
}

/**
 * Calculates percentage change safely.
 * Returns null if baseline is zero, negative (when inappropriate), or missing.
 */
export function calculatePercentChange(
  latest: number | null | undefined,
  baseline: number | null | undefined
): number | null {
  if (
    latest === null ||
    latest === undefined ||
    baseline === null ||
    baseline === undefined ||
    baseline === 0 ||
    isNaN(latest) ||
    isNaN(baseline)
  ) {
    return null;
  }

  const change = ((latest - baseline) / Math.abs(baseline)) * 100;
  return Number(change.toFixed(1));
}

/**
 * Evaluates a value against reference intervals with explicit bounds.
 */
export function evaluateReferenceInterval(
  value: number,
  low?: number,
  high?: number
): ResultInterpretation {
  if (value === undefined || value === null || isNaN(value)) {
    return 'NOT_AVAILABLE';
  }
  if (low !== undefined && value < low) {
    return 'BELOW_REFERENCE';
  }
  if (high !== undefined && value > high) {
    return 'ABOVE_REFERENCE';
  }
  return 'WITHIN_REFERENCE';
}

/**
 * Determines monitoring state from value, baseline, and reference intervals.
 */
export function determineMonitoringState(
  value: number,
  low: number,
  high: number,
  baseline?: number | null
): MonitoringState {
  if (value === undefined || value === null || isNaN(value)) {
    return 'INSUFFICIENT_DATA';
  }

  // Check if severely outside boundaries (> 50% deviation from high or < 50% below low)
  const range = high - low;
  if (value > high + range * 0.5 || (low > 0 && value < Math.max(0, low - range * 0.5))) {
    return 'CRITICAL';
  }

  // Check if moderately outside
  if (value > high || value < low) {
    return 'WARNING';
  }

  // If inside range but shifted > 50% from baseline
  if (baseline !== null && baseline !== undefined && baseline > 0) {
    const shiftPercent = Math.abs(((value - baseline) / baseline) * 100);
    if (shiftPercent >= 75) {
      return 'WARNING';
    }
    if (shiftPercent >= 35) {
      return 'MONITOR';
    }
  }

  return 'NORMAL';
}

/**
 * Generates an RFC-4180 compliant CSV string from an array of objects.
 * Properly escapes quotes, commas, and newlines.
 */
export function generateCsv<T extends object>(
  data: T[],
  columns: { key: keyof T; header: string }[]
): string {
  if (!data || data.length === 0) {
    return columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',') + '\n';
  }

  const headerRow = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');
  const dataRows = data.map((row) =>
    columns
      .map((col) => {
        const val = (row as any)[col.key];
        if (val === null || val === undefined) {
          return '""';
        }
        const stringVal = String(val);
        return `"${stringVal.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Triggers a browser download of a CSV text file.
 */
export function downloadCsvFile(csvContent: string, fileName: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
