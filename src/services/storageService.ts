import { CaseData, SessionData, GroupData } from '../types';
import { DEFAULT_CASES } from '../data/defaultCases';
import { DEFAULT_SESSIONS, DEFAULT_GROUPS } from '../data/defaultSessions';

const STORAGE_KEYS = {
  CASES: 'counting_cascade_v2_cases',
  SESSIONS: 'counting_cascade_v2_sessions',
  GROUPS: 'counting_cascade_v2_groups',
  CURRENT_SESSION: 'counting_cascade_v2_current_session',
  CURRENT_GROUP: 'counting_cascade_v2_current_group',
};

export class StorageService {
  // Initialize default data if empty or contains obsolete cases
  public static init(): void {
    if (typeof window === 'undefined') return;

    const existingCases = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!existingCases) {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DEFAULT_CASES));
    } else {
      // Check if it's using old CC-DEMO cases
      try {
        const parsed = JSON.parse(existingCases);
        const hasNewCases = Array.isArray(parsed) && parsed.some(c => c.caseId === 'CC-01' || c.caseId === 'CC-02');
        if (!hasNewCases) {
          localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DEFAULT_CASES));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DEFAULT_CASES));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEFAULT_SESSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(DEFAULT_GROUPS));
    }
  }

  // --- CASES ---
  public static getCases(): CaseData[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      return data ? JSON.parse(data) : DEFAULT_CASES;
    } catch {
      return DEFAULT_CASES;
    }
  }

  public static getCaseById(caseId: string): CaseData | undefined {
    const cases = this.getCases();
    return cases.find(c => c.caseId === caseId);
  }

  // Strictly sanitizes case payload for Student Mode (Removes answerKey, teacherSolution, correctRule, finalAnswer)
  public static getCaseForStudent(caseId: string): CaseData | null {
    const rawCase = this.getCaseById(caseId);
    if (!rawCase) return null;

    // Deep clone and strictly delete all teacher evaluation fields
    const studentCase: CaseData = JSON.parse(JSON.stringify(rawCase));
    delete studentCase.answerKey;
    delete studentCase.teacherSolution;
    delete studentCase.correctRule;
    delete studentCase.finalAnswer;
    return studentCase;
  }

  public static saveCase(caseData: CaseData): void {
    const cases = this.getCases();
    const index = cases.findIndex(c => c.caseId === caseData.caseId);
    if (index >= 0) {
      cases[index] = { ...caseData, updatedAt: new Date().toISOString() };
    } else {
      cases.push({
        ...caseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      });
    }
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }

  public static deleteCase(caseId: string): void {
    const cases = this.getCases().filter(c => c.caseId !== caseId);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }

  public static duplicateCase(caseId: string): CaseData | null {
    const original = this.getCaseById(caseId);
    if (!original) return null;

    const newId = `CC-${Date.now().toString().slice(-4)}`;
    const duplicated: CaseData = {
      ...JSON.parse(JSON.stringify(original)),
      caseId: newId,
      title: `${original.title} (Salinan)`,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveCase(duplicated);
    return duplicated;
  }

  public static toggleCaseStatus(caseId: string): void {
    const cases = this.getCases();
    const target = cases.find(c => c.caseId === caseId);
    if (target) {
      target.status = target.status === 'Active' ? 'Draft' : 'Active';
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    }
  }

  // --- SESSIONS ---
  public static getSessions(): SessionData[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : DEFAULT_SESSIONS;
    } catch {
      return DEFAULT_SESSIONS;
    }
  }

  public static getSessionByCode(code: string): SessionData | undefined {
    const sessions = this.getSessions();
    const clean = code.trim().toUpperCase();
    return sessions.find(s => s.sessionCode.toUpperCase() === clean);
  }

  public static saveSession(sessionData: SessionData): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.sessionId === sessionData.sessionId);
    if (index >= 0) {
      sessions[index] = sessionData;
    } else {
      sessions.push(sessionData);
    }
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  public static deleteSession(sessionId: string): void {
    const sessions = this.getSessions().filter(s => s.sessionId !== sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }

  // --- GROUPS ---
  public static getGroups(): GroupData[] {
    this.init();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
      return data ? JSON.parse(data) : DEFAULT_GROUPS;
    } catch {
      return DEFAULT_GROUPS;
    }
  }

  public static getGroupByCode(groupCode: string): GroupData | undefined {
    const groups = this.getGroups();
    const clean = groupCode.trim().toUpperCase();
    return groups.find(g => g.groupCode.toUpperCase() === clean);
  }

  public static saveGroup(groupData: GroupData): void {
    const groups = this.getGroups();
    const index = groups.findIndex(g => g.groupId === groupData.groupId);
    if (index >= 0) {
      groups[index] = groupData;
    } else {
      groups.push(groupData);
    }
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }

  // --- RANDOM CASE ASSIGNMENT (Respecting history rule) ---
  public static assignNextCaseToGroup(groupId: string, sessionCode?: string): CaseData | null {
    const groups = this.getGroups();
    const group = groups.find(g => g.groupId === groupId);
    if (!group) return null;

    const allCases = this.getCases().filter(c => c.status === 'Active');
    if (allCases.length === 0) return null;

    let availablePool = allCases;

    if (sessionCode) {
      const session = this.getSessionByCode(sessionCode);
      if (session && session.activeCasePool && session.activeCasePool.length > 0) {
        availablePool = allCases.filter(c => session.activeCasePool.includes(c.caseId));
      }
    }

    // Filter out cases the group has already received
    const unseenCases = availablePool.filter(c => !group.caseHistory.includes(c.caseId));

    let chosenCase: CaseData;
    if (unseenCases.length > 0) {
      // Pick random from unseen
      const randomIndex = Math.floor(Math.random() * unseenCases.length);
      chosenCase = unseenCases[randomIndex];
    } else {
      // If all cases have been seen, pick any random case from pool to allow continued exploration
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      chosenCase = availablePool[randomIndex];
    }

    // Update group history
    if (!group.caseHistory.includes(chosenCase.caseId)) {
      group.caseHistory.push(chosenCase.caseId);
    }
    group.currentCaseId = chosenCase.caseId;
    this.saveGroup(group);

    // Increment case usage count
    chosenCase.usageCount = (chosenCase.usageCount || 0) + 1;
    this.saveCase(chosenCase);

    return this.getCaseForStudent(chosenCase.caseId);
  }

  // Reset all to default sample data
  public static resetAllToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DEFAULT_CASES));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEFAULT_SESSIONS));
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(DEFAULT_GROUPS));
  }

  // Export JSON of all cases
  public static exportCasesJSON(): string {
    const cases = this.getCases();
    return JSON.stringify(cases, null, 2);
  }

  // Import JSON cases
  public static importCasesJSON(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'Data JSON harus berupa array kasus.' };
      }
      
      const validCases: CaseData[] = [];
      for (const item of parsed) {
        if (item.caseId && item.title && item.text) {
          validCases.push({
            caseId: String(item.caseId),
            title: String(item.title),
            text: String(item.text),
            topic: String(item.topic || 'Kaidah Pencacahan'),
            subtopic: String(item.subtopic || 'Umum'),
            difficulty: item.difficulty || 'Sedang',
            status: item.status || 'Active',
            correctRule: item.correctRule ? String(item.correctRule) : undefined,
            teacherSolution: item.teacherSolution ? String(item.teacherSolution) : undefined,
            finalAnswer: item.finalAnswer ? String(item.finalAnswer) : undefined,
            answerKey: item.answerKey ? String(item.answerKey) : undefined,
            informationBlocks: Array.isArray(item.informationBlocks) ? item.informationBlocks : [],
            usageCount: Number(item.usageCount) || 0,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      if (validCases.length === 0) {
        return { success: false, count: 0, error: 'Tidak ditemukan format kasus yang valid.' };
      }

      // Merge with existing or overwrite
      const current = this.getCases();
      const map = new Map<string, CaseData>();
      current.forEach(c => map.set(c.caseId, c));
      validCases.forEach(c => map.set(c.caseId, c));

      const merged = Array.from(map.values());
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(merged));

      return { success: true, count: validCases.length };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Format JSON tidak valid';
      return { success: false, count: 0, error: message };
    }
  }
}
