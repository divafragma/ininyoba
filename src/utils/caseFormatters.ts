import { CaseData } from '../types';

/**
 * Formats a case ID (such as CC-01 or CC-05) into a clean, natural label for students.
 * e.g. "CC-01" -> "KASUS 1"
 */
export function getDisplayCaseLabel(caseId: string, allCases?: CaseData[]): string {
  if (!caseId) return 'KASUS';

  if (allCases && allCases.length > 0) {
    const idx = allCases.findIndex((c) => c.caseId === caseId);
    if (idx !== -1) {
      return `KASUS ${idx + 1}`;
    }
  }

  // Extract trailing digits
  const match = caseId.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `KASUS ${num}`;
  }

  return `KASUS ${caseId.replace(/^CC-DEMO-|^CC-/, '')}`;
}

/**
 * Returns a friendly, student-focused step title for exploration layers.
 */
export function getNaturalStepTitle(type: string, stepIndex: number, originalTitle?: string): string {
  const stepPrefix = `LANGKAH ${stepIndex + 1}`;
  
  switch (type.toUpperCase()) {
    case 'CONTEXT':
      return `${stepPrefix} — AWAL CERITANYA`;
    case 'OBJECTS':
      return `${stepPrefix} — APA SAJA OBJEKNYA?`;
    case 'CHOICES':
      return `${stepPrefix} — KETERSEDIAAN PILIHAN`;
    case 'CONDITIONS':
      return `${stepPrefix} — KONDISI & BATASAN KHUSUS`;
    case 'STRUCTURE':
      return `${stepPrefix} — SUSUNAN HUBUNGAN INFORMASI`;
    default:
      return originalTitle ? `${stepPrefix} — ${originalTitle}` : `${stepPrefix} — INFORMASI KASUS`;
  }
}
