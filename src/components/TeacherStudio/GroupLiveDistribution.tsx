import React, { useState } from 'react';
import { 
  Users, Layers, RotateCcw, Sparkles, History, 
  Eye, Shuffle, Plus, ShieldCheck 
} from 'lucide-react';
import { GroupData, SessionData, CaseData } from '../../types';

interface GroupLiveDistributionProps {
  groups: GroupData[];
  sessions: SessionData[];
  cases: CaseData[];
  onAssignNextCase: (groupId: string, sessionCode?: string) => void;
  onResetGroupHistory: (groupId: string) => void;
  onAddNewGroup: (group: GroupData) => void;
}

export const GroupLiveDistribution: React.FC<GroupLiveDistributionProps> = ({
  groups,
  sessions,
  cases,
  onAssignNextCase,
  onResetGroupHistory,
  onAddNewGroup
}) => {
  const [selectedSessionCode, setSelectedSessionCode] = useState<string>(
    sessions[0]?.sessionCode || 'CASCADE-2026'
  );
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const currentSession = sessions.find(s => s.sessionCode === selectedSessionCode) || sessions[0];

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupCode.trim()) return;

    const group: GroupData = {
      groupId: `grp-${Date.now()}`,
      groupCode: newGroupCode.trim().toUpperCase(),
      groupName: newGroupName.trim() || `Kelompok ${newGroupCode.trim()}`,
      caseHistory: [],
      joinedAt: new Date().toISOString()
    };

    onAddNewGroup(group);
    setShowAddGroupModal(false);
    setNewGroupCode('');
    setNewGroupName('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Session Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Monitoring Distribusi Kasus Kelompok (Live)
          </h2>
          <p className="text-xs text-slate-300">
            Pantau alokasi kasus aktif dan riwayat eksplorasi setiap kelompok tanpa penilaian otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-[#69021E]/50 bg-[#09050e] px-3 py-1.5 text-xs text-slate-300">
            <span className="text-slate-400">Sesi Aktif:</span>
            <select
              value={selectedSessionCode}
              onChange={(e) => setSelectedSessionCode(e.target.value)}
              className="bg-transparent font-mono text-[#fef08a] focus:outline-none"
            >
              {sessions.map(s => (
                <option key={s.sessionId} value={s.sessionCode} className="bg-[#030206] text-white">
                  {s.sessionCode} - {s.sessionName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddGroupModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#AA0235] to-[#710755] border border-[#AA0235]/40 px-3.5 py-2 text-xs font-semibold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 transition shadow-sm"
          >
            <Plus className="h-4 w-4 text-[#fef08a]" />
            <span>Tambah Kelompok</span>
          </button>
        </div>
      </div>

      {/* Distribution Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((grp) => {
          const currentCase = cases.find(c => c.caseId === grp.currentCaseId);
          const previousCases = grp.caseHistory.filter(id => id !== grp.currentCaseId);

          return (
            <div
              key={grp.groupId}
              className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 shadow-md space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Group Header */}
                <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#710755]/20 border border-[#710755]/50 text-[#fef08a] font-mono font-bold text-xs">
                      {grp.groupCode.replace(/[^0-9A-Za-z]/g, '').slice(-2)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#fef08a]">
                        {grp.groupCode}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white">
                        {grp.groupName}
                      </h4>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#021233]/60 border border-[#69021E]/40 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    Total: {grp.caseHistory.length} Kasus
                  </span>
                </div>

                {/* CURRENT ASSIGNED CASE */}
                <div className="mt-4 rounded-xl border border-[#AA0235]/40 bg-[#69021E]/15 p-3.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#fef08a] flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Kasus Aktif Saat Ini:
                  </span>
                  {currentCase ? (
                    <div className="mt-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-white">
                          {currentCase.caseId}
                        </span>
                        <span className="rounded bg-[#030206] px-1.5 py-0.5 text-[10px] text-[#fef9c3] border border-[#69021E]/40">
                          {currentCase.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 mt-1 line-clamp-1">
                        {currentCase.title}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1 italic">
                      Belum ada kasus yang diambil kelompok ini.
                    </p>
                  )}
                </div>

                {/* PREVIOUS CASE HISTORY */}
                <div className="mt-3">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                    <History className="h-3 w-3 text-[#fef9c3]" /> Riwayat Kasus Sebelumnya:
                  </span>
                  {previousCases.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {previousCases.map((cid) => (
                        <span
                          key={cid}
                          className="rounded-lg border border-[#69021E]/40 bg-[#030206] px-2 py-0.5 font-mono text-[10px] text-[#fef08a]"
                        >
                          {cid}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Belum ada riwayat kasus sebelumnya.
                    </span>
                  )}
                </div>
              </div>

              {/* Group Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#69021E]/40">
                <button
                  type="button"
                  onClick={() => onAssignNextCase(grp.groupId, selectedSessionCode)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#AA0235]/50 bg-[#AA0235]/20 px-3 py-1.5 text-xs font-semibold text-[#fef08a] hover:bg-[#AA0235]/30 transition"
                  title="Alokasikan Kasus Acak Baru dari Pool Sesi"
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  <span>Acak Kasus Baru</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Reset riwayat eksplorasi untuk ${grp.groupName}?`)) {
                      onResetGroupHistory(grp.groupId);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-[#69021E]/30 rounded-lg transition"
                  title="Reset Riwayat Kelompok"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Group */}
      {showAddGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206]/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#69021E]/60 bg-[#09050e] p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-base font-bold text-white">
              Tambah Kelompok Peserta Didik
            </h3>

            <form onSubmit={handleCreateGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Kode Kelompok (Unik) *
                </label>
                <input
                  type="text"
                  value={newGroupCode}
                  onChange={(e) => setNewGroupCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: KELOMPOK-6 atau GROUP-F"
                  className="mt-1 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-xs font-mono text-[#fef08a] uppercase focus:border-[#AA0235] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Nama Kelompok (Opsional)
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Contoh: Kelompok 6 (Zeta)"
                  className="mt-1 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-xs text-white focus:border-[#AA0235] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#69021E]/40">
                <button
                  type="button"
                  onClick={() => setShowAddGroupModal(false)}
                  className="rounded-xl border border-[#69021E]/50 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#69021E]/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-4 py-2 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow"
                >
                  Simpan Kelompok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
