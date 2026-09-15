import React, { useState } from 'react';
import { Sparkles, Users, KeyRound, ArrowRight, UserPlus, Trash2, ShieldCheck, Compass } from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { SessionData, GroupData, GroupMember } from '../../types';

interface StudentEntryProps {
  onJoinSuccess: (session: SessionData, group: GroupData) => void;
}

export const StudentEntry: React.FC<StudentEntryProps> = ({ onJoinSuccess }) => {
  const [sessionCode, setSessionCode] = useState('CASCADE-2026');
  const [groupCode, setGroupCode] = useState('A');
  const [members, setMembers] = useState<GroupMember[]>([
    { name: '', attendanceNumber: '' },
    { name: '', attendanceNumber: '' },
    { name: '', attendanceNumber: '' },
    { name: '', attendanceNumber: '' }
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableSessions = StorageService.getSessions();
  const presetGroupOptions = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5'];

  const handleMemberChange = (index: number, field: keyof GroupMember, value: string) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddMemberRow = () => {
    if (members.length < 8) {
      setMembers((prev) => [...prev, { name: '', attendanceNumber: '' }]);
    }
  };

  const handleRemoveMemberRow = (index: number) => {
    if (members.length > 1) {
      setMembers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const sCode = sessionCode.trim().toUpperCase();
    const gCode = groupCode.trim().toUpperCase();

    if (!sCode) {
      setErrorMsg('Harap masukkan Kode Sesi yang diberikan oleh guru.');
      return;
    }
    if (!gCode) {
      setErrorMsg('Harap pilih atau masukkan Kode Kelompok Anda.');
      return;
    }

    // Filter valid filled members
    const validMembers = members.filter((m) => m.name.trim().length > 0);

    // Format natural group name e.g. "Kelompok A" or "Kelompok 1"
    const formattedGroupName = gCode.startsWith('KELOMPOK')
      ? gCode.replace('KELOMPOK-', 'Kelompok ').replace('KELOMPOK', 'Kelompok ')
      : `Kelompok ${gCode}`;

    // Find or create session
    let session = StorageService.getSessionByCode(sCode);
    if (!session) {
      session = {
        sessionId: `ses-${Date.now()}`,
        sessionCode: sCode,
        sessionName: `Sesi Kelas ${sCode}`,
        groupIds: [],
        activeCasePool: StorageService.getCases()
          .filter((c) => c.status === 'Active')
          .map((c) => c.caseId),
        assignmentRules: {
          allowRepeatAcrossGroups: true,
          allowRepeatWithinSameGroup: false
        },
        isActive: true,
        createdAt: new Date().toISOString()
      };
      StorageService.saveSession(session);
    }

    // Find or create group
    let group = StorageService.getGroupByCode(gCode);
    if (!group) {
      group = {
        groupId: `grp-${gCode.toLowerCase()}-${Date.now()}`,
        groupCode: gCode,
        groupName: formattedGroupName,
        members: validMembers,
        caseHistory: [],
        joinedAt: new Date().toISOString()
      };
      StorageService.saveGroup(group);
    } else {
      // Update group members and name if provided
      group.groupName = formattedGroupName;
      if (validMembers.length > 0) {
        group.members = validMembers;
      }
      StorageService.saveGroup(group);
    }

    // Register group in session if not present
    if (!session.groupIds.includes(group.groupId)) {
      session.groupIds.push(group.groupId);
      StorageService.saveSession(session);
    }

    onJoinSuccess(session, group);
  };

  return (
    <div className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Decorative Ambient Rings */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[480px] w-[480px] rounded-full border border-[#AA0235]/15 bg-radial from-[#AA0235]/10 to-transparent blur-2xl" />
        <div className="absolute h-[720px] w-[720px] rounded-full border border-[#021233]/40" />
      </div>

      {/* Main Entry Card */}
      <div className="w-full max-w-lg rounded-2xl border border-[#69021E]/60 bg-[#09050e]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#AA0235]/40 bg-gradient-to-br from-[#AA0235]/30 via-[#021233] to-[#710755]/30 text-[#fef08a] shadow-md">
            <Compass className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
            COUNTING CASCADE
          </h1>
          <p className="mt-1 text-xs text-[#fef9c3]/80 font-light tracking-wider">
            Media Eksplorasi Kasus Kaidah Pencacahan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleJoin} className="mt-6 space-y-5">
          {/* Sesi Guru (compact / collapsible feel) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Kode Sesi
              </label>
              <span className="text-[11px] text-slate-400">Diberikan oleh Guru</span>
            </div>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="CASCADE-2026"
                className="w-full rounded-xl border border-[#69021E]/50 bg-[#030206] py-2.5 pl-10 pr-4 text-sm font-mono text-[#fef08a] placeholder:text-slate-600 focus:border-[#AA0235] focus:outline-none focus:ring-1 focus:ring-[#AA0235]/40 uppercase"
              />
            </div>
          </div>

          {/* Identitas / Kode Kelompok */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pilih / Masukkan Kode Kelompok
            </label>
            
            {/* Quick preset selector buttons for Group Code (A, B, C, D, E, etc.) */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {presetGroupOptions.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setGroupCode(code)}
                  className={`h-9 min-w-[40px] rounded-lg border px-3 text-xs font-bold font-mono transition ${
                    groupCode === code
                      ? 'border-[#AA0235] bg-[#69021E]/40 text-[#fef08a] shadow-sm'
                      : 'border-[#69021E]/40 bg-[#021233]/40 text-slate-300 hover:border-[#AA0235]/50 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Users className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="Contoh: A atau B atau 1"
                className="w-full rounded-xl border border-[#69021E]/50 bg-[#030206] py-2.5 pl-10 pr-4 text-sm font-mono text-[#fef9c3] placeholder:text-slate-600 focus:border-[#710755] focus:outline-none focus:ring-1 focus:ring-[#710755]/40 uppercase"
              />
            </div>
          </div>

          {/* Anggota Kelompok (Nama & Nomor Absen) */}
          <div className="rounded-xl border border-[#69021E]/50 bg-[#021233]/30 p-4">
            <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#fef08a]" />
                Daftar Anggota Kelompok
              </span>
              <span className="text-[11px] text-slate-400">1 Perangkat / Kelompok</span>
            </div>

            <div className="space-y-2.5">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 text-center text-xs font-mono text-[#fef08a]">{idx + 1}.</span>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    placeholder={`Nama Anggota ${idx + 1}`}
                    className="flex-1 rounded-lg border border-[#69021E]/40 bg-[#030206]/90 px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:border-[#AA0235]/60 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={member.attendanceNumber}
                    onChange={(e) => handleMemberChange(idx, 'attendanceNumber', e.target.value)}
                    placeholder="Absen"
                    className="w-20 rounded-lg border border-[#69021E]/40 bg-[#030206]/90 px-2.5 py-1.5 text-xs text-center font-mono text-[#fef9c3] placeholder:text-slate-600 focus:border-[#AA0235]/60 focus:outline-none"
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMemberRow(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Hapus baris"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {members.length < 8 && (
              <button
                type="button"
                onClick={handleAddMemberRow}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#fef08a] hover:text-white transition"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>+ Tambah Anggota</span>
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-[#AA0235]/40 bg-[#69021E]/30 p-3 text-xs text-[#fef9c3]">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] py-3.5 text-sm font-semibold text-white shadow-lg hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-[0.99] transition"
          >
            <span>Masuk sebagai Kelompok {groupCode || ''}</span>
            <ArrowRight className="h-4 w-4 text-[#fef08a] transition group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
