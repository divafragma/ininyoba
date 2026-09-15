import React from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Compass } from 'lucide-react';
import { CaseData, GroupData, SessionData } from '../../types';
import { getDisplayCaseLabel } from '../../utils/caseFormatters';
import { StorageService } from '../../services/storageService';

interface CaseExploredFinalProps {
  caseData: CaseData;
  group: GroupData;
  session: SessionData;
  onBackToSession: () => void;
  onRequestNextCase: () => void;
}

export const CaseExploredFinal: React.FC<CaseExploredFinalProps> = ({
  caseData,
  group,
  session,
  onBackToSession,
  onRequestNextCase
}) => {
  const allCases = StorageService.getCases();
  const caseDisplayLabel = getDisplayCaseLabel(caseData.caseId, allCases);

  return (
    <div className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Subtle celebratory ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-[#AA0235]/10 blur-3xl" />
        <div className="absolute h-[750px] w-[750px] rounded-full border border-[#69021E]/25" />
      </div>

      <div className="w-full max-w-xl text-center">
        {/* Final Card */}
        <div className="relative rounded-3xl border-2 border-[#AA0235]/50 bg-gradient-to-b from-[#140612] via-[#09050e] to-[#021233]/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          {/* Decorative Corner Accents */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border border-[#69021E]/40" />
          <div className="absolute top-4 left-4 text-[#fef08a]/60 text-xs font-mono">◇</div>
          <div className="absolute top-4 right-4 text-[#fef08a]/60 text-xs font-mono">◇</div>
          <div className="absolute bottom-4 left-4 text-[#fef08a]/60 text-xs font-mono">◇</div>
          <div className="absolute bottom-4 right-4 text-[#fef08a]/60 text-xs font-mono">◇</div>

          {/* Badge */}
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#AA0235]/40 bg-[#AA0235]/15 text-[#fef08a] shadow-inner">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <span className="mt-5 block font-mono text-xs font-bold tracking-widest text-[#fef08a] uppercase">
            {caseDisplayLabel}
          </span>

          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
            Kasus sudah selesai dieksplorasi.
          </h2>

          <p className="mt-3 text-sm text-slate-200 font-normal leading-relaxed max-w-md mx-auto">
            Gunakan informasi yang telah kalian temukan untuk melanjutkan pengerjaan pada <strong>Lembar Kerja Murid (LKM)</strong>.
          </p>

          {/* Session Return Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-[#69021E]/40">
            <button
              type="button"
              onClick={onBackToSession}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#69021E]/50 bg-[#021233]/60 px-5 py-3 text-xs font-semibold text-slate-200 hover:bg-[#69021E]/30 hover:text-white transition"
            >
              <RotateCcw className="h-4 w-4 text-[#fef08a]" />
              <span>Kembali ke Sesi</span>
            </button>

            <button
              type="button"
              onClick={onRequestNextCase}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-95 transition"
            >
              <span className="text-white">Eksplorasi Kasus Lain</span>
              <ArrowRight className="h-4 w-4 text-[#fef08a]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
