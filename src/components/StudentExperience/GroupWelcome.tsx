import React, { useState } from 'react';
import { Compass, Eye, ArrowRight, History, Users } from 'lucide-react';
import { GroupData, SessionData, CaseData } from '../../types';
import { soundFX } from '../../utils/audioEffects';
import { getDisplayCaseLabel } from '../../utils/caseFormatters';
import { StorageService } from '../../services/storageService';

interface GroupWelcomeProps {
  session: SessionData;
  group: GroupData;
  assignedCase: CaseData;
  onRevealCase: () => void;
  onSelectPreviousCase?: (caseId: string) => void;
}

export const GroupWelcome: React.FC<GroupWelcomeProps> = ({
  session,
  group,
  assignedCase,
  onRevealCase,
  onSelectPreviousCase
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const allCases = StorageService.getCases();
  const caseDisplayLabel = getDisplayCaseLabel(assignedCase.caseId, allCases);

  const handleRevealClick = () => {
    soundFX.playCardReveal();
    onRevealCase();
  };

  return (
    <div className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Ambient background rays */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#AA0235]/10 blur-3xl" />
        <div className="absolute h-[800px] w-[800px] rounded-full border border-[#69021E]/30" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        {/* Welcome Tagline */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#AA0235]/50 bg-[#69021E]/30 px-4 py-1.5 text-xs font-semibold text-[#fef08a]">
          <span>Selamat Datang, {group.groupName}!</span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-wide text-white sm:text-4xl">
          Kasus kalian sudah siap untuk dieksplorasi.
        </h2>

        {/* Group members chip display if entered */}
        {group.members && group.members.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-xs text-slate-300 mr-1 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-[#fef08a]" /> Anggota:
            </span>
            {group.members.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-lg border border-[#69021E]/40 bg-[#021233]/50 px-2.5 py-0.5 text-xs text-slate-200"
              >
                {m.name} {m.attendanceNumber ? `(${m.attendanceNumber})` : ''}
              </span>
            ))}
          </div>
        )}

        {/* Exploration Card */}
        <div className="mt-8 flex justify-center w-full">
          <div
            className="group relative w-full max-w-sm sm:max-w-md cursor-pointer transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleRevealClick}
          >
            {/* Ambient Card Outer Glow */}
            <div
              className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#AA0235]/30 via-[#710755]/20 to-[#021233]/40 blur-xl transition duration-700 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-40'
              }`}
            />

            {/* The Card Body */}
            <div className="relative flex flex-col items-center justify-between rounded-2xl border-2 border-[#AA0235]/50 bg-gradient-to-b from-[#140612] via-[#090510] to-[#021233]/80 p-8 sm:p-10 shadow-2xl transition-all duration-300 group-hover:-translate-y-1">
              {/* Card Corner Accents */}
              <div className="absolute top-3 left-3 text-[#fef08a]/50 text-xs font-mono">◇</div>
              <div className="absolute top-3 right-3 text-[#fef08a]/50 text-xs font-mono">◇</div>
              <div className="absolute bottom-3 left-3 text-[#fef08a]/50 text-xs font-mono">◇</div>
              <div className="absolute bottom-3 right-3 text-[#fef08a]/50 text-xs font-mono">◇</div>

              {/* Inner Decorative Border */}
              <div className="pointer-events-none absolute inset-3 rounded-xl border border-[#69021E]/40" />

              {/* Card Top Label */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-[11px] font-semibold tracking-widest text-[#fef08a] uppercase">
                  COUNTING CASCADE
                </span>
                <span className="mt-0.5 text-[10px] text-slate-400 tracking-wider">
                  KAIDAH PENCACAHAN
                </span>
              </div>

              {/* Centerpiece Seal & Case Title */}
              <div className="my-8 flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#AA0235]/40 bg-[#AA0235]/10 shadow-inner">
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#fef08a]/30 animate-[spin_20s_linear_infinite]" />
                  <Compass className="h-10 w-10 text-[#fef08a] transition-transform duration-700 group-hover:rotate-45" />
                </div>

                <div className="mt-5 text-center px-2">
                  <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#fef08a] tracking-wider">
                    {caseDisplayLabel}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white mt-1 line-clamp-2">
                    {assignedCase.title}
                  </h3>
                </div>
              </div>

              {/* Card CTA Trigger */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleRevealClick}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] py-3.5 px-6 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-95 transition"
                >
                  <Eye className="h-4 w-4 text-[#fef08a]" />
                  <span className="text-white">Buka Kasus</span>
                  <ArrowRight className="h-4 w-4 text-[#fef08a] transition group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Group History (Previously explored cases) */}
        {group.caseHistory.length > 1 && (
          <div className="mt-8 w-full max-w-md rounded-xl border border-[#69021E]/40 bg-[#021233]/40 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#69021E]/30 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <History className="h-3.5 w-3.5 text-[#fef08a]" />
                <span>Kasus yang Pernah Dibuka ({group.caseHistory.length})</span>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
              {group.caseHistory.map((cid) => {
                const label = getDisplayCaseLabel(cid, allCases);
                return (
                  <button
                    key={cid}
                    onClick={() => onSelectPreviousCase && onSelectPreviousCase(cid)}
                    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-mono transition ${
                      cid === assignedCase.caseId
                        ? 'border-[#AA0235] bg-[#69021E]/40 text-[#fef08a] font-semibold'
                        : 'border-[#69021E]/30 bg-[#030206]/70 text-slate-400 hover:border-[#AA0235]/40 hover:text-white'
                    }`}
                  >
                    <span>{label}</span>
                    {cid === assignedCase.caseId && (
                      <span className="rounded-full bg-[#fef08a] h-1.5 w-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
