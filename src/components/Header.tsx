import React, { useState } from 'react';
import { Compass, Shield, UserCheck, Volume2, VolumeX, Info, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { AppMode, GroupData, SessionData } from '../types';
import { soundFX } from '../utils/audioEffects';

interface HeaderProps {
  mode: AppMode;
  onToggleMode: (newMode: AppMode) => void;
  activeSession: SessionData | null;
  activeGroup: GroupData | null;
  onResetSessionGroup?: () => void;
  isTeacherAuthenticated?: boolean;
  onTeacherLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleMode,
  activeSession,
  activeGroup,
  onResetSessionGroup,
  isTeacherAuthenticated,
  onTeacherLogout
}) => {
  const [muted, setMuted] = useState(soundFX.getMuted());
  const [showPedagogyModal, setShowPedagogyModal] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    soundFX.setMuted(next);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#69021E]/40 bg-[#030206]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#AA0235]/40 bg-gradient-to-br from-[#AA0235]/30 via-[#021233] to-[#710755]/40 shadow-inner">
              <Compass className="h-5 w-5 text-[#fef08a]" />
              <div className="absolute inset-0 rounded-xl bg-[#fef08a]/5 blur-sm -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold tracking-wider text-white sm:text-xl">
                  COUNTING CASCADE
                </span>
                <span className="hidden rounded-full border border-[#AA0235]/40 bg-[#69021E]/30 px-2.5 py-0.5 text-[10px] font-semibold text-[#fef08a] md:inline-block">
                  Media Eksplorasi Kasus
                </span>
              </div>
              <p className="hidden text-xs text-slate-300 sm:block font-light">
                Kaidah Pencacahan: Aturan Penjumlahan dan Aturan Perkalian
              </p>
            </div>
          </div>

          {/* Active Session & Group Badges (In Student Mode) */}
          {mode === 'student' && (activeSession || activeGroup) && (
            <div className="hidden items-center gap-2 rounded-xl border border-[#69021E]/50 bg-[#021233]/70 px-3 py-1.5 text-xs text-slate-200 lg:flex">
              {activeSession && (
                <div className="flex items-center gap-1.5 border-r border-[#69021E]/60 pr-2.5">
                  <span className="text-slate-400">Sesi:</span>
                  <span className="font-mono font-semibold text-[#fef08a]">{activeSession.sessionCode}</span>
                </div>
              )}
              {activeGroup && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Kelompok:</span>
                  <span className="font-medium text-white">{activeGroup.groupName}</span>
                </div>
              )}
              {onResetSessionGroup && (
                <button
                  onClick={onResetSessionGroup}
                  className="ml-1 rounded-lg px-2 py-0.5 text-[11px] text-[#fef08a]/80 hover:bg-[#AA0235]/30 hover:text-[#fef08a] transition"
                  title="Ganti Sesi atau Kelompok"
                >
                  Ganti
                </button>
              )}
            </div>
          )}

          {/* Active Teacher Badge (In Teacher Mode when logged in) */}
          {mode === 'teacher' && isTeacherAuthenticated && (
            <div className="hidden items-center gap-2 rounded-xl border border-[#AA0235]/40 bg-[#710755]/25 px-3 py-1.5 text-xs text-slate-200 lg:flex">
              <Shield className="h-3.5 w-3.5 text-[#fef08a]" />
              <span className="text-slate-400">Akses Guru:</span>
              <span className="font-semibold text-[#fef9c3]">Diva</span>
              {onTeacherLogout && (
                <button
                  onClick={onTeacherLogout}
                  className="ml-1 rounded-lg px-2 py-0.5 text-[11px] font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition"
                  title="Log Out Guru"
                >
                  Log Out
                </button>
              )}
            </div>
          )}

          {/* Action Tools & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Guide Button */}
            <button
              onClick={() => setShowPedagogyModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-[#69021E]/50 bg-[#021233]/60 px-3 py-1.5 text-xs text-slate-200 hover:border-[#AA0235]/60 hover:bg-[#69021E]/30 transition"
              title="Panduan Konsep Media"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#fef08a]" />
              <span className="hidden sm:inline text-[#fef9c3]">Panduan</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`rounded-xl border p-2 text-xs transition ${
                muted
                  ? 'border-[#69021E]/30 bg-[#030206] text-slate-500'
                  : 'border-[#AA0235]/50 bg-[#69021E]/40 text-[#fef08a]'
              }`}
              title={muted ? 'Aktifkan Efek Suara' : 'Matikan Efek Suara'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Mode Switcher */}
            <div className="flex rounded-xl border border-[#69021E]/50 bg-[#030206] p-1">
              <button
                onClick={() => onToggleMode('student')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  mode === 'student'
                    ? 'bg-gradient-to-r from-[#AA0235] to-[#69021E] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5 text-[#fef08a]" />
                <span>Mode Siswa</span>
              </button>
              <button
                onClick={() => onToggleMode('teacher')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  mode === 'teacher'
                    ? 'bg-gradient-to-r from-[#710755] to-[#021233] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-[#fef08a]" />
                <span>Mode Guru</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pedagogical Concept Modal */}
      {showPedagogyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206]/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#69021E]/60 bg-[#09050d] p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#69021E]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#69021E]/30 border border-[#AA0235]/40 text-[#fef08a]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Alur Pembelajaran Counting Cascade
                  </h3>
                  <p className="text-xs text-slate-300">
                    Media Eksplorasi Kasus untuk Pembelajaran Kaidah Pencacahan & LKPD Fisik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPedagogyModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-[#69021E]/40 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-200 leading-relaxed">
              {/* Tujuan Pembelajaran */}
              <div className="rounded-xl border border-[#AA0235]/40 bg-[#69021E]/20 p-4">
                <h4 className="font-semibold text-[#fef08a] flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Info className="h-4 w-4" /> Tujuan Pembelajaran
                </h4>
                <ol className="mt-2 space-y-2 text-xs text-slate-200 list-decimal list-inside leading-relaxed">
                  <li>
                    Mengidentifikasi objek, pilihan, tahapan, kondisi, dan batasan yang terdapat dalam kasus kontekstual dengan tepat pada seluruh informasi yang relevan.
                  </li>
                  <li>
                    Menerapkan kaidah penjumlahan, kaidah perkalian, atau gabungan keduanya berdasarkan struktur permasalahan untuk menyelesaikan kasus kontekstual dengan langkah yang sesuai dan hasil yang benar.
                  </li>
                </ol>
              </div>

              {/* Alur Pembelajaran */}
              <div className="rounded-xl border border-[#69021E]/50 bg-[#021233]/40 p-4">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-2.5">
                  Alur Pembelajaran
                </h4>
                <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                  <li>Masuk menggunakan kode sesi dan kode kelompok.</li>
                  <li>Baca kasus yang diberikan secara seksama.</li>
                  <li>Eksplorasi informasi yang tersedia.</li>
                  <li>Diskusikan informasi bersama kelompok.</li>
                  <li>Catat informasi yang diperlukan pada Lembar Kerja Murid (LKM).</li>
                  <li>Lanjutkan analisis dan penyelesaian pada LKM fisik.</li>
                </ol>
              </div>

              {/* Peran Media vs LKM */}
              <div className="rounded-xl border border-[#69021E]/30 bg-[#021233]/20 p-3.5 text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-[#fef9c3]">Peran Media & LKM:</p>
                <p>&bull; <strong>Counting Cascade:</strong> Media digital untuk menemukan dan mengeksplorasi informasi mentah dari teks kasus.</p>
                <p>&bull; <strong>LKM (Lembar Kerja Murid):</strong> Tempat menalar, menentukan aturan matematika, melakukan perhitungan, dan menuliskan jawaban akhir.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPedagogyModal(false)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] to-[#69021E] px-5 py-2.5 text-xs font-semibold text-white hover:from-[#AA0235]/90 hover:to-[#69021E]/90 transition shadow-md"
              >
                <span>Tutup Panduan</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#fef08a]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
