export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Tantangan';
export type CaseStatus = 'Active' | 'Draft' | 'Archived';
export type InfoBlockType = 'REVEAL' | 'HIGHLIGHT' | 'SEQUENCE' | 'RELATION' | 'CATEGORY' | 'TEXT_INSPECTION';

export interface InformationBlock {
  id: string;
  label: string; // e.g. "Pilihan nasi", "Jumlah peserta"
  value: string; // RAW ONLY, e.g. "Nasi goreng, nasi putih, dan nasi liwet."
  description?: string;
  order: number;
  type?: InfoBlockType;
  highlightText?: string; // Substring in verbatim case text
}

export interface CaseData {
  caseId: string; // e.g. "CC-01", "CC-02"
  title: string;
  text: string; // EXACT teacher text verbatim
  topic: string;
  subtopic: string;
  difficulty: DifficultyLevel;
  status: CaseStatus;
  informationBlocks: InformationBlock[];
  // TEACHER-ONLY FIELDS (Sanitized from student mode)
  correctRule?: string; // "Aturan Perkalian" | "Aturan Penjumlahan"
  teacherSolution?: string; // Step-by-step teacher calculation breakdown
  finalAnswer?: string; // e.g. "24 pilihan menu"
  answerKey?: string; // Summary answer key
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupMember {
  name: string;
  attendanceNumber: string;
}

export interface GroupData {
  groupId: string;
  groupCode: string; // e.g. "A", "B", "KELOMPOK-1"
  groupName: string; // e.g. "Kelompok A"
  members?: GroupMember[];
  caseHistory: string[]; // List of case IDs previously assigned
  currentCaseId?: string;
  joinedAt?: string;
}

export interface SessionData {
  sessionId: string;
  sessionCode: string; // e.g. "CASCADE-2026"
  sessionName: string; // e.g. "Kelas XII - Kaidah Pencacahan"
  groupIds: string[];
  activeCasePool: string[]; // List of case IDs available for this session
  assignmentRules: {
    allowRepeatAcrossGroups: boolean;
    allowRepeatWithinSameGroup: boolean;
  };
  isActive: boolean;
  createdAt: string;
}

export type AppMode = 'student' | 'teacher';

export type StudentStep = 'ENTRY' | 'READY' | 'EXPLORING' | 'EXPLORED';

