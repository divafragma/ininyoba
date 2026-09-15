import { SessionData, GroupData } from '../types';

export const DEFAULT_GROUPS: GroupData[] = [
  {
    groupId: 'grp-1',
    groupCode: 'KELOMPOK-1',
    groupName: 'Kelompok 1 (Alpha)',
    caseHistory: ['CC-01'],
    currentCaseId: 'CC-01',
    joinedAt: new Date().toISOString()
  },
  {
    groupId: 'grp-2',
    groupCode: 'KELOMPOK-2',
    groupName: 'Kelompok 2 (Beta)',
    caseHistory: ['CC-02'],
    currentCaseId: 'CC-02',
    joinedAt: new Date().toISOString()
  },
  {
    groupId: 'grp-3',
    groupCode: 'KELOMPOK-3',
    groupName: 'Kelompok 3 (Gamma)',
    caseHistory: ['CC-03'],
    currentCaseId: 'CC-03',
    joinedAt: new Date().toISOString()
  },
  {
    groupId: 'grp-4',
    groupCode: 'KELOMPOK-4',
    groupName: 'Kelompok 4 (Delta)',
    caseHistory: ['CC-04'],
    currentCaseId: 'CC-04',
    joinedAt: new Date().toISOString()
  },
  {
    groupId: 'grp-5',
    groupCode: 'KELOMPOK-5',
    groupName: 'Kelompok 5 (Epsilon)',
    caseHistory: ['CC-05'],
    currentCaseId: 'CC-05',
    joinedAt: new Date().toISOString()
  }
];

export const DEFAULT_SESSIONS: SessionData[] = [
  {
    sessionId: 'ses-1',
    sessionCode: 'CASCADE-2026',
    sessionName: 'Kelas XII Matematika - Kaidah Pencacahan & LKM',
    groupIds: ['grp-1', 'grp-2', 'grp-3', 'grp-4', 'grp-5'],
    activeCasePool: ['CC-01', 'CC-02', 'CC-03', 'CC-04', 'CC-05'],
    assignmentRules: {
      allowRepeatAcrossGroups: true,
      allowRepeatWithinSameGroup: false
    },
    isActive: true,
    createdAt: new Date().toISOString()
  }
];
