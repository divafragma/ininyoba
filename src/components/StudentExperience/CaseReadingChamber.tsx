import React, { useState } from 'react';
import { 
  FileText, Tag, CheckCircle2, ArrowRight, Compass, 
  ChevronRight, Eye, Sparkles, BookOpen 
} from 'lucide-react';
import { CaseData, InformationBlock } from '../../types';
import { soundFX } from '../../utils/audioEffects';
import { getDisplayCaseLabel } from '../../utils/caseFormatters';
import { StorageService } from '../../services/storageService';

interface CaseReadingChamberProps {
  caseData: CaseData;
  groupName: string;
  onFinishExploration: () => void;
  onBackToWelcome: () => void;
}

export const CaseReadingChamber: React.FC<CaseReadingChamberProps> = ({
  caseData,
  groupName,
  onFinishExploration,
  onBackToWelcome
}) => {
  const allCases = StorageService.getCases();
  const caseDisplayLabel = getDisplayCaseLabel(caseData.caseId, allCases);

  const clues = caseData.informationBlocks || [];
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);

  const handleToggleClue = (id: string) => {
    soundFX.playInspectClick();
    setSelectedClueId((prev) => (prev === id ? null : id));
  };

  // Helper to render interactive case text with highlights linked to clues
  const renderInteractiveText = () => {
    const rawText = caseData.text;
    const highlightBlocks = clues.filter(
      (b) => b.highlightText && b.highlightText.trim().length > 0
    );

    if (highlightBlocks.length === 0) {
      return (
        <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-sans whitespace-pre-line">
          {rawText}
        </p>
      );
    }

    // Sort by descending length so longer phrases match first
    const sorted = [...highlightBlocks].sort(
      (a, b) => (b.highlightText?.length || 0) - (a.highlightText?.length || 0)
    );

    const fragments: { text: string; clue?: InformationBlock }[] = [];
    let remaining = rawText;

    while (remaining.length > 0) {
      let earliestMatchIndex = -1;
      let matchedClue: InformationBlock | null = null;

      for (const clue of sorted) {
        const needle = clue.highlightText!;
        const index = remaining.indexOf(needle);
        if (index !== -1 && (earliestMatchIndex === -1 || index < earliestMatchIndex)) {
          earliestMatchIndex = index;
          matchedClue = clue;
        }
      }

      if (earliestMatchIndex !== -1 && matchedClue) {
        if (earliestMatchIndex > 0) {
          fragments.push({ text: remaining.substring(0, earliestMatchIndex) });
        }
        fragments.push({
          text: matchedClue.highlightText!,
          clue: matchedClue
        });
        remaining = remaining.substring(earliestMatchIndex + matchedClue.highlightText!.length);
      } else {
        fragments.push({ text: remaining });
        remaining = '';
      }
    }

    return (
      <div className="text-base sm:text-lg leading-relaxed text-white font-sans whitespace-pre-line">
        {fragments.map((frag, idx) => {
          if (!frag.clue) {
            return <span key={idx}>{frag.text}</span>;
          }
          const isSelected = selectedClueId === frag.clue.id;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleToggleClue(frag.clue!.id)}
              className={`inline mx-0.5 rounded px-1.5 py-0.5 font-medium transition-all text-left ${
                isSelected
                  ? 'bg-[#AA0235] text-white shadow-md ring-2 ring-[#fef08a]'
                  : 'bg-[#69021E]/40 text-[#fef08a] hover:bg-[#AA0235]/40 hover:text-white underline decoration-[#fef08a]/60 underline-offset-4'
              }`}
              title={`Klik untuk menyorot informasi: ${frag.clue.label}`}
            >
              {frag.text}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#69021E]/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToWelcome}
            className="flex items-center gap-1.5 rounded-xl border border-[#69021E]/40 bg-[#021233]/50 px-3 py-1.5 text-xs text-slate-300 hover:bg-[#69021E]/30 hover:text-white transition"
          >
            ← Kembali ke Kartu Kasus
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#fef08a] tracking-wider uppercase">
                {caseDisplayLabel}
              </span>
              <span className="text-[#69021E]">•</span>
              <span className="text-xs text-slate-300 font-medium">{groupName}</span>
            </div>
            <h1 className="font-display text-lg font-bold text-white sm:text-xl">
              {caseData.title}
            </h1>
          </div>
        </div>

        <div className="rounded-full border border-[#AA0235]/40 bg-[#69021E]/20 px-3 py-1 text-xs text-[#fef08a] font-mono">
          {clues.length} Informasi Kasus
        </div>
      </div>

      {/* Main Exploration Grid: Step 1 (Left) | Step 2 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* STEP 1: BACA KASUS (lg:col-span-7) */}
        <div className="space-y-3 lg:col-span-7">
          <div className="rounded-2xl border border-[#AA0235]/40 bg-[#09050e] p-6 sm:p-7 shadow-xl space-y-4">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#AA0235]/30 border border-[#AA0235]/50 text-[#fef08a] text-xs font-bold font-mono">
                  1
                </div>
                <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  BACA KASUS
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {caseDisplayLabel}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Baca kasus kontekstual di bawah secara seksama bersama anggota kelompokmu. Kata atau kalimat yang bergaris bawah dapat diklik untuk menelusuri rincian informasi.
            </p>

            {/* Verbatim Text Area */}
            <div className="rounded-xl border border-[#69021E]/30 bg-[#021233]/40 p-5 sm:p-6 shadow-inner">
              {renderInteractiveText()}
            </div>
          </div>
        </div>

        {/* STEP 2: EKSPLORASI INFORMASI (lg:col-span-5) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-6 shadow-xl space-y-4">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#710755]/30 border border-[#710755]/50 text-[#fef08a] text-xs font-bold font-mono">
                  2
                </div>
                <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  EKSPLORASI INFORMASI
                </h2>
              </div>
              <span className="text-xs text-[#fef9c3] font-mono">
                {clues.length} Informasi
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Klik setiap informasi di bawah untuk mencocokkan fakta mentah yang terdapat dalam teks permasalahan.
            </p>

            {/* Information Cards List */}
            <div className="space-y-2.5">
              {clues.map((clue, idx) => {
                const isSelected = selectedClueId === clue.id;
                return (
                  <div
                    key={clue.id}
                    onClick={() => handleToggleClue(clue.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-[#AA0235] bg-[#69021E]/30 shadow-md ring-1 ring-[#AA0235]/60'
                        : 'border-[#69021E]/40 bg-[#021233]/40 hover:border-[#AA0235]/40 hover:bg-[#021233]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-[#fef08a] shrink-0" />
                        <span className="text-xs font-bold text-[#fef08a]">
                          {clue.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-slate-400 transition-transform ${
                          isSelected ? 'rotate-90 text-[#fef08a]' : ''
                        }`}
                      />
                    </div>

                    <div className="mt-2 text-xs sm:text-sm text-slate-100 leading-relaxed border-t border-[#69021E]/30 pt-2 font-sans">
                      {clue.value}
                    </div>

                    {clue.description && (
                      <p className="mt-1.5 text-[11px] text-slate-300 italic">
                        {clue.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* STEP 3: SELESAI EKSPLORASI (Bottom Card) */}
      <div className="rounded-2xl border border-[#AA0235]/50 bg-gradient-to-r from-[#69021E]/30 via-[#09050e] to-[#021233]/40 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#AA0235]/30 border border-[#AA0235]/50 text-[#fef08a] text-xs font-bold font-mono">
                3
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                SELESAI EKSPLORASI INFORMASI?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Diskusikan seluruh informasi yang telah kalian temukan bersama anggota kelompok, lalu lanjutkan proses identifikasi, pemilihan aturan, dan perhitungan pada <strong>Lembar Kerja Murid (LKM)</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playCaseComplete();
              onFinishExploration();
            }}
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-95 transition shrink-0"
          >
            <span>Selesai Eksplorasi</span>
            <ArrowRight className="h-4 w-4 text-[#fef08a] transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
