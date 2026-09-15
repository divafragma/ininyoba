import React, { useState, useEffect } from 'react';
import { 
  FileText, Users, KeyRound, Sparkles, Layers, 
  BarChart3, Download, Plus, Shield, RefreshCw, LogOut, UserCheck
} from 'lucide-react';
import { CaseData, SessionData, GroupData } from '../../types';
import { StorageService } from '../../services/storageService';
import { CaseLibrary } from './CaseLibrary';
import { CaseEditorModal } from './CaseEditorModal';
import { SessionManager } from './SessionManager';
import { GroupLiveDistribution } from './GroupLiveDistribution';
import { ExportImportPanel } from './ExportImportPanel';

interface TeacherStudioProps {
  onLogout?: () => void;
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'sessions' | 'groups' | 'export'>('overview');

  const [cases, setCases] = useState<CaseData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);

  const [editingCase, setEditingCase] = useState<CaseData | null>(null);
  const [isCreatingCase, setIsCreatingCase] = useState(false);

  const loadAllData = () => {
    setCases(StorageService.getCases());
    setSessions(StorageService.getSessions());
    setGroups(StorageService.getGroups());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Case Actions
  const handleSaveCase = (caseData: CaseData) => {
    StorageService.saveCase(caseData);
    setEditingCase(null);
    setIsCreatingCase(false);
    loadAllData();
  };

  const handleDeleteCase = (caseId: string) => {
    StorageService.deleteCase(caseId);
    loadAllData();
  };

  const handleDuplicateCase = (caseId: string) => {
    StorageService.duplicateCase(caseId);
    loadAllData();
  };

  const handleToggleCaseStatus = (caseId: string) => {
    StorageService.toggleCaseStatus(caseId);
    loadAllData();
  };

  // Session Actions
  const handleSaveSession = (session: SessionData) => {
    StorageService.saveSession(session);
    loadAllData();
  };

  const handleDeleteSession = (sessionId: string) => {
    StorageService.deleteSession(sessionId);
    loadAllData();
  };

  // Group Actions
  const handleCreateGroup = (group: GroupData) => {
    StorageService.saveGroup(group);
    loadAllData();
  };

  const handleAssignNextCase = (groupId: string, sessionCode?: string) => {
    StorageService.assignNextCaseToGroup(groupId, sessionCode);
    loadAllData();
  };

  const handleResetGroupHistory = (groupId: string) => {
    const grp = groups.find(g => g.groupId === groupId);
    if (grp) {
      grp.caseHistory = [];
      grp.currentCaseId = undefined;
      StorageService.saveGroup(grp);
      loadAllData();
    }
  };

  const activeCasesCount = cases.filter(c => c.status === 'Active').length;
  const totalExplorations = groups.reduce((acc, g) => acc + g.caseHistory.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#69021E]/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#AA0235]/40 bg-gradient-to-br from-[#AA0235]/30 via-[#09050e] to-[#710755]/30 text-[#fef08a] shadow-md">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                Mode Guru &mdash; Teacher Studio
              </h1>
              <span className="rounded-full bg-[#710755]/20 border border-[#710755]/50 px-2.5 py-0.5 text-[10px] font-semibold text-[#fef9c3]">
                Kontrol Otoritatif
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Pusat pengelolaan kasus Kaidah Pencacahan, kunci validasi guru, dan distribusi kelompok LKPD.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-[#AA0235]/40 bg-[#09050e] px-3 py-2 text-xs">
            <UserCheck className="h-3.5 w-3.5 text-[#fef08a]" />
            <span className="text-slate-400">Guru:</span>
            <span className="font-semibold text-[#fef9c3]">Diva</span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => {
              setEditingCase(null);
              setIsCreatingCase(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-4 py-2.5 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md transition"
          >
            <Plus className="h-4 w-4 text-[#fef08a]" />
            <span>Tambah Kasus Baru</span>
          </button>

          {/* Log Out Button */}
          {onLogout && (
            <button
              id="btn-teacher-logout"
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-xl border border-[#69021E]/60 bg-[#030206] px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-300 transition shadow-sm"
              title="Keluar dari Mode Guru"
            >
              <LogOut className="h-3.5 w-3.5 text-red-400" />
              <span>LOG OUT</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-[#69021E]/40 gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[#AA0235]/25 text-[#fef08a] border border-[#AA0235]/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#69021E]/20'
          }`}
        >
          <BarChart3 className="h-4 w-4 text-[#fef08a]" />
          <span>Ikhtisar Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'cases'
              ? 'bg-[#AA0235]/25 text-[#fef08a] border border-[#AA0235]/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#69021E]/20'
          }`}
        >
          <FileText className="h-4 w-4 text-[#fef08a]" />
          <span>Koleksi Kasus ({cases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'bg-[#AA0235]/25 text-[#fef08a] border border-[#AA0235]/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#69021E]/20'
          }`}
        >
          <KeyRound className="h-4 w-4 text-[#fef9c3]" />
          <span>Sesi Kelas ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'groups'
              ? 'bg-[#AA0235]/25 text-[#fef08a] border border-[#AA0235]/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#69021E]/20'
          }`}
        >
          <Users className="h-4 w-4 text-[#fef08a]" />
          <span>Monitoring Kelompok ({groups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
            activeTab === 'export'
              ? 'bg-[#AA0235]/25 text-[#fef08a] border border-[#AA0235]/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#69021E]/20'
          }`}
        >
          <Download className="h-4 w-4 text-[#fef9c3]" />
          <span>Cadangkan / Impor 40 Kasus</span>
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 shadow-md">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-[#fef08a]" /> Total Kasus Guru
              </span>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                {cases.length} <span className="text-xs font-sans text-slate-400 font-normal">kasus</span>
              </p>
              <p className="mt-1 text-[11px] text-[#fef08a] font-mono">
                {activeCasesCount} kasus aktif dalam rotasi
              </p>
            </div>

            <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 shadow-md">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-[#fef9c3]" /> Sesi Kelas Aktif
              </span>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                {sessions.filter(s => s.isActive).length} <span className="text-xs font-sans text-slate-400 font-normal">sesi</span>
              </p>
              <p className="mt-1 text-[11px] text-[#fef9c3] font-mono">
                Kode Utama: {sessions[0]?.sessionCode || 'CASCADE-2026'}
              </p>
            </div>

            <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 shadow-md">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#fef08a]" /> Kelompok Terdaftar
              </span>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                {groups.length} <span className="text-xs font-sans text-slate-400 font-normal">kelompok</span>
              </p>
              <p className="mt-1 text-[11px] text-[#fef08a] font-mono">
                Semua memiliki riwayat terisolasi
              </p>
            </div>

            <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 shadow-md">
              <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#fef9c3]" /> Total Eksplorasi
              </span>
              <p className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
                {totalExplorations} <span className="text-xs font-sans text-slate-400 font-normal">eksplorasi</span>
              </p>
              <p className="mt-1 text-[11px] text-[#fef9c3] font-mono">
                Diteruskan ke LKPD kelompok
              </p>
            </div>
          </div>

          {/* Quick Shortcuts & Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('cases')}
              className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 hover:border-[#AA0235]/60 cursor-pointer transition shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#AA0235]/20 text-[#fef08a]">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xs text-[#fef08a] font-semibold group-hover:translate-x-1 transition">
                  Kelola Kasus →
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                Perpustakaan Kasus Kaidah Pencacahan
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Tinjau kasus aktif, buat soal baru, atur fakta blok informasi, dan kunci jawaban terproteksi.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('sessions')}
              className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 hover:border-[#AA0235]/60 cursor-pointer transition shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#710755]/25 text-[#fef9c3]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <span className="text-xs text-[#fef9c3] font-semibold group-hover:translate-x-1 transition">
                  Atur Sesi →
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                Sesi Kelas & Kode Masuk Siswa
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Buat kode sesi untuk kelas, atur case pool yang ingin dibagikan, dan tentukan jumlah kelompok.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('groups')}
              className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 hover:border-[#AA0235]/60 cursor-pointer transition shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#69021E]/30 text-[#fef08a]">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs text-[#fef08a] font-semibold group-hover:translate-x-1 transition">
                  Pantau Live →
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                Distribusi Kasus Kelompok
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Pantau secara real-time kasus yang sedang diselidiki oleh masing-masing kelompok siswa.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CASE LIBRARY */}
      {activeTab === 'cases' && (
        <CaseLibrary
          cases={cases}
          onAddNewCase={() => {
            setEditingCase(null);
            setIsCreatingCase(true);
          }}
          onEditCase={(c) => {
            setEditingCase(c);
            setIsCreatingCase(true);
          }}
          onDuplicateCase={handleDuplicateCase}
          onDeleteCase={handleDeleteCase}
          onToggleStatus={handleToggleCaseStatus}
        />
      )}

      {/* TAB CONTENT: SESSIONS */}
      {activeTab === 'sessions' && (
        <SessionManager
          sessions={sessions}
          cases={cases}
          groups={groups}
          onSaveSession={handleSaveSession}
          onDeleteSession={handleDeleteSession}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* TAB CONTENT: GROUPS */}
      {activeTab === 'groups' && (
        <GroupLiveDistribution
          groups={groups}
          sessions={sessions}
          cases={cases}
          onAssignNextCase={handleAssignNextCase}
          onResetGroupHistory={handleResetGroupHistory}
          onAddNewGroup={handleCreateGroup}
        />
      )}

      {/* TAB CONTENT: EXPORT/IMPORT */}
      {activeTab === 'export' && (
        <ExportImportPanel onDataChanged={loadAllData} />
      )}

      {/* Case Editor Modal */}
      {isCreatingCase && (
        <CaseEditorModal
          initialCase={editingCase}
          onSave={handleSaveCase}
          onClose={() => {
            setIsCreatingCase(false);
            setEditingCase(null);
          }}
        />
      )}
    </div>
  );
};
