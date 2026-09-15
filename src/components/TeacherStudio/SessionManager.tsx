import React, { useState } from 'react';
import { 
  Plus, KeyRound, Users, Layers, CheckCircle2, 
  Trash2, ShieldCheck, RefreshCw, Eye 
} from 'lucide-react';
import { SessionData, CaseData, GroupData } from '../../types';

interface SessionManagerProps {
  sessions: SessionData[];
  cases: CaseData[];
  groups: GroupData[];
  onSaveSession: (session: SessionData) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateGroup: (group: GroupData) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  sessions,
  cases,
  groups,
  onSaveSession,
  onDeleteSession,
  onCreateGroup
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Session State
  const [sessionCode, setSessionCode] = useState(`CASCADE-${new Date().getFullYear()}`);
  const [sessionName, setSessionName] = useState('Matematika XII - Kaidah Pencacahan');
  const [selectedCasePool, setSelectedCasePool] = useState<string[]>(
    cases.filter(c => c.status === 'Active').map(c => c.caseId)
  );
  const [numGroups, setNumGroups] = useState(5);

  const activeCases = cases.filter(c => c.status === 'Active');

  const handleToggleCaseInPool = (caseId: string) => {
    if (selectedCasePool.includes(caseId)) {
      setSelectedCasePool(selectedCasePool.filter(id => id !== caseId));
    } else {
      setSelectedCasePool([...selectedCasePool, caseId]);
    }
  };

  const handleSelectAllCases = () => {
    setSelectedCasePool(activeCases.map(c => c.caseId));
  };

  const handleDeselectAllCases = () => {
    setSelectedCasePool([]);
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionCode.trim() || !sessionName.trim()) {
      alert('Harap lengkapi Kode Sesi dan Nama Sesi.');
      return;
    }
    if (selectedCasePool.length === 0) {
      alert('Pilih minimal 1 kasus aktif untuk dimasukkan ke dalam pool sesi.');
      return;
    }

    // Auto-create groups if needed
    const createdGroupIds: string[] = [];
    for (let i = 1; i <= numGroups; i++) {
      const gCode = `KELOMPOK-${i}`;
      const existing = groups.find(g => g.groupCode === gCode);
      if (existing) {
        createdGroupIds.push(existing.groupId);
      } else {
        const newGrp: GroupData = {
          groupId: `grp-${Date.now()}-${i}`,
          groupCode: gCode,
          groupName: `Kelompok ${i}`,
          caseHistory: [],
          joinedAt: new Date().toISOString()
        };
        onCreateGroup(newGrp);
        createdGroupIds.push(newGrp.groupId);
      }
    }

    const newSession: SessionData = {
      sessionId: `ses-${Date.now()}`,
      sessionCode: sessionCode.trim().toUpperCase(),
      sessionName: sessionName.trim(),
      groupIds: createdGroupIds,
      activeCasePool: selectedCasePool,
      assignmentRules: {
        allowRepeatAcrossGroups: true,
        allowRepeatWithinSameGroup: false
      },
      isActive: true,
      createdAt: new Date().toISOString()
    };

    onSaveSession(newSession);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Manajemen Sesi Kelas & Distribusi Kasus
          </h2>
          <p className="text-xs text-slate-300">
            Atur kode akses kelas, kumpulan pool kasus aktif, dan jumlah kelompok peserta didik.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-4 py-2.5 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md transition"
        >
          <Plus className="h-4 w-4 text-[#fef08a]" />
          <span>Buat Sesi Kelas Baru</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((ses) => (
          <div
            key={ses.sessionId}
            className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 sm:p-6 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-3">
              <div>
                <span className="font-mono text-sm font-bold text-[#fef08a]">
                  {ses.sessionCode}
                </span>
                <h3 className="font-display text-base font-bold text-white mt-0.5">
                  {ses.sessionName}
                </h3>
              </div>

              <span className="rounded-full border border-[#710755]/50 bg-[#710755]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#fef08a]">
                {ses.isActive ? 'Sesi Aktif' : 'Non-Aktif'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#69021E]/40 bg-[#021233]/40 p-3">
                <span className="text-slate-300 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-[#fef08a]" /> Pool Kasus Aktif:
                </span>
                <p className="mt-1 font-mono text-base font-bold text-white">
                  {ses.activeCasePool.length} Kasus
                </p>
              </div>

              <div className="rounded-xl border border-[#69021E]/40 bg-[#021233]/40 p-3">
                <span className="text-slate-300 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#fef9c3]" /> Kelompok Terdaftar:
                </span>
                <p className="mt-1 font-mono text-base font-bold text-white">
                  {ses.groupIds.length} Kelompok
                </p>
              </div>
            </div>

            {/* Case Pool Chips */}
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Daftar Kasus Dalam Pool:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {ses.activeCasePool.map((cid) => (
                  <span
                    key={cid}
                    className="rounded-lg border border-[#69021E]/40 bg-[#030206] px-2 py-0.5 font-mono text-[10px] text-[#fef08a]"
                  >
                    {cid}
                  </span>
                ))}
              </div>
            </div>

            {/* Rule Indicator */}
            <div className="rounded-xl border border-[#69021E]/40 bg-[#021233]/30 p-3 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-[#fef9c3] font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-[#fef08a]" />
                <span>Aturan Distribusi Kasus:</span>
              </div>
              <p>• Kasus dapat didistribusikan ke kelompok berbeda secara serentak.</p>
              <p>• Kasus yang telah dieksplorasi oleh kelompok tidak akan diulang kembali untuk kelompok yang sama.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-2 border-t border-[#69021E]/40">
              <button
                onClick={() => {
                  if (confirm(`Hapus sesi ${ses.sessionCode}?`)) {
                    onDeleteSession(ses.sessionId);
                  }
                }}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-rose-400 hover:bg-[#AA0235]/20 hover:text-white transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Sesi</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206]/90 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative my-8 w-full max-w-xl rounded-2xl border border-[#69021E]/60 bg-[#09050e] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#fef08a]" />
                <h3 className="font-display text-base font-bold text-white">
                  Buat Sesi Kelas Baru
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Kode Sesi (Dibagikan ke Siswa) *
                </label>
                <input
                  type="text"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: CASCADE-2026 atau MAT-XII-1"
                  className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm font-mono text-[#fef08a] uppercase focus:border-[#AA0235] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Nama Sesi Kelas *
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Contoh: Kelas XII MIPA 1 - Kaidah Pencacahan"
                  className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-white focus:border-[#AA0235] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Jumlah Kelompok Awal (Auto-Generate)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={numGroups}
                  onChange={(e) => setNumGroups(parseInt(e.target.value) || 1)}
                  className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-[#fef9c3]">
                  Akan otomatis menyiapkan KELOMPOK-1 s/d KELOMPOK-{numGroups}.
                </p>
              </div>

              {/* Case Pool Selector */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Pilih Kasus untuk Pool Sesi Ini ({selectedCasePool.length} Terpilih)
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllCases}
                      className="text-[#fef08a] hover:underline"
                    >
                      Pilih Semua
                    </button>
                    <span className="text-[#69021E]">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllCases}
                      className="text-slate-400 hover:underline"
                    >
                      Batal Semua
                    </button>
                  </div>
                </div>

                <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5 rounded-xl border border-[#69021E]/40 bg-[#030206] p-3">
                  {activeCases.map((c) => {
                    const isSelected = selectedCasePool.includes(c.caseId);
                    return (
                      <label
                        key={c.caseId}
                        className={`flex items-center justify-between rounded-lg p-2 text-xs cursor-pointer transition ${
                          isSelected
                            ? 'border border-[#AA0235]/60 bg-[#AA0235]/20 text-[#fef08a]'
                            : 'border border-transparent hover:bg-[#69021E]/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCaseInPool(c.caseId)}
                            className="rounded border-[#69021E] bg-[#021233] text-[#AA0235] focus:ring-0"
                          />
                          <span className="font-mono font-bold text-[#fef08a]">{c.caseId}</span>
                          <span className="text-white">{c.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{c.difficulty}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#69021E]/40">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#69021E]/50 px-4 py-2 text-xs text-slate-300 hover:bg-[#69021E]/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-5 py-2 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md"
                >
                  Buat Sesi Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
