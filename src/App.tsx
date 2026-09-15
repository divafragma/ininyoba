import React, { useState, useEffect } from 'react';
import { AppMode, StudentStep, SessionData, GroupData, CaseData } from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { StudentEntry } from './components/StudentExperience/StudentEntry';
import { GroupWelcome } from './components/StudentExperience/GroupWelcome';
import { CaseReadingChamber } from './components/StudentExperience/CaseReadingChamber';
import { CaseExploredFinal } from './components/StudentExperience/CaseExploredFinal';
import { TeacherStudio } from './components/TeacherStudio/TeacherStudio';
import { TeacherPortal } from './components/TeacherStudio/TeacherPortal';

export default function App() {
  const [mode, setMode] = useState<AppMode>('student');
  const [studentStep, setStudentStep] = useState<StudentStep>('ENTRY');

  // Teacher Authentication state (persisted per browser session)
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('cc_teacher_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Student active session, group, and case
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const [activeGroup, setActiveGroup] = useState<GroupData | null>(null);
  const [assignedCase, setAssignedCase] = useState<CaseData | null>(null);

  // Initialize storage on mount
  useEffect(() => {
    StorageService.init();
  }, []);

  // Teacher Login Success Handler
  const handleTeacherLoginSuccess = () => {
    setIsTeacherAuthenticated(true);
    try {
      sessionStorage.setItem('cc_teacher_auth', 'true');
    } catch {
      // ignore storage errors
    }
  };

  // Teacher Logout Handler
  const handleTeacherLogout = () => {
    setIsTeacherAuthenticated(false);
    try {
      sessionStorage.removeItem('cc_teacher_auth');
    } catch {
      // ignore storage errors
    }
  };

  // When student enters session and group code
  const handleStudentJoin = (session: SessionData, group: GroupData) => {
    setActiveSession(session);
    setActiveGroup(group);

    // If group already has currentCaseId, load it sanitized, else assign a new random case
    let studentCase: CaseData | null = null;
    if (group.currentCaseId) {
      studentCase = StorageService.getCaseForStudent(group.currentCaseId);
    }
    
    if (!studentCase) {
      studentCase = StorageService.assignNextCaseToGroup(group.groupId, session.sessionCode);
      // Reload updated group
      const updatedGrp = StorageService.getGroups().find(g => g.groupId === group.groupId);
      if (updatedGrp) setActiveGroup(updatedGrp);
    }

    setAssignedCase(studentCase);
    setStudentStep('READY');
  };

  // Reveal Case button in GroupWelcome
  const handleRevealCase = () => {
    setStudentStep('EXPLORING');
  };

  // Finish Exploration button in CaseReadingChamber -> Leads to CaseExploredFinal
  const handleFinishExploration = () => {
    setStudentStep('EXPLORED');
  };

  // Request next case for group
  const handleRequestNextCase = () => {
    if (!activeGroup || !activeSession) return;
    const nextCase = StorageService.assignNextCaseToGroup(activeGroup.groupId, activeSession.sessionCode);
    
    // Refresh group data
    const updatedGrp = StorageService.getGroups().find(g => g.groupId === activeGroup.groupId);
    if (updatedGrp) setActiveGroup(updatedGrp);

    setAssignedCase(nextCase);
    setStudentStep('READY');
  };

  // Select a previously explored case from group history
  const handleSelectPreviousCase = (caseId: string) => {
    const studentCase = StorageService.getCaseForStudent(caseId);
    if (studentCase) {
      setAssignedCase(studentCase);
      setStudentStep('EXPLORING');
    }
  };

  // Reset session/group back to entry
  const handleResetSessionGroup = () => {
    setActiveSession(null);
    setActiveGroup(null);
    setAssignedCase(null);
    setStudentStep('ENTRY');
  };

  return (
    <div className="min-h-screen bg-[#030206] text-[#f8fafc] flex flex-col cosmic-grid">
      {/* Header with mode switcher, session & group indicators, and pedagogy guide */}
      <Header
        mode={mode}
        onToggleMode={(newMode) => setMode(newMode)}
        activeSession={activeSession}
        activeGroup={activeGroup}
        onResetSessionGroup={handleResetSessionGroup}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onTeacherLogout={handleTeacherLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {mode === 'student' ? (
          <>
            {studentStep === 'ENTRY' && (
              <StudentEntry onJoinSuccess={handleStudentJoin} />
            )}

            {studentStep === 'READY' && activeSession && activeGroup && assignedCase && (
              <GroupWelcome
                session={activeSession}
                group={activeGroup}
                assignedCase={assignedCase}
                onRevealCase={handleRevealCase}
                onSelectPreviousCase={handleSelectPreviousCase}
              />
            )}

            {studentStep === 'EXPLORING' && assignedCase && activeGroup && (
              <CaseReadingChamber
                caseData={assignedCase}
                groupName={activeGroup.groupName}
                onFinishExploration={handleFinishExploration}
                onBackToWelcome={() => setStudentStep('READY')}
              />
            )}

            {studentStep === 'EXPLORED' && assignedCase && activeGroup && activeSession && (
              <CaseExploredFinal
                caseData={assignedCase}
                group={activeGroup}
                session={activeSession}
                onBackToSession={() => setStudentStep('READY')}
                onRequestNextCase={handleRequestNextCase}
              />
            )}
          </>
        ) : (
          /* TEACHER MODE: AUTHENTICATED STUDIO OR LOGIN PORTAL */
          isTeacherAuthenticated ? (
            <TeacherStudio onLogout={handleTeacherLogout} />
          ) : (
            <TeacherPortal
              onLoginSuccess={handleTeacherLoginSuccess}
              onBackToStudent={() => setMode('student')}
            />
          )
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#69021E]/30 bg-[#030206]/95 py-3 text-center text-[11px] text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong className="text-[#fef08a]">Counting Cascade</strong> &mdash; Media Eksplorasi Kasus Interaktif Kaidah Pencacahan
          </span>
          <span className="font-mono text-slate-400">
            Kaidah Pencacahan (meliputi: aturan penjumlahan dan perkalian)
          </span>
        </div>
      </footer>
    </div>
  );
}
