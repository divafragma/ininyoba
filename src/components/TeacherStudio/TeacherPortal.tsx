import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';

interface TeacherPortalProps {
  onLoginSuccess: () => void;
  onBackToStudent?: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  onLoginSuccess,
  onBackToStudent
}) => {
  const [teacherName, setTeacherName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = teacherName.trim();
    const rawPassword = password;

    // Kondisi 4 — Nama dan password kosong (atau salah satunya kosong)
    if (!trimmedName || !rawPassword) {
      setErrorMessage('Nama dan password wajib diisi.');
      soundFX.playInspectClick();
      return;
    }

    // Kondisi 2 — Nama salah (bukan Diva)
    if (trimmedName !== 'Diva') {
      setErrorMessage('Nama guru tidak dikenali.');
      soundFX.playInspectClick();
      return;
    }

    // Kondisi 3 — Password salah (bukan 123)
    if (rawPassword !== '123') {
      setErrorMessage('Password salah.');
      soundFX.playInspectClick();
      return;
    }

    // Kondisi 1 — Login benar (Diva / 123)
    setIsSubmitting(true);
    soundFX.playLayerUnlock();
    setTimeout(() => {
      onLoginSuccess();
    }, 250);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <div className="relative w-full max-w-md">
        {/* Subtle decorative glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#AA0235]/30 via-[#710755]/20 to-[#021233]/40 blur-xl opacity-75 -z-10" />

        <div className="card-glass-wine relative rounded-3xl border border-[#69021E]/60 p-6 sm:p-8 shadow-2xl">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#AA0235]/40 bg-gradient-to-br from-[#AA0235]/30 via-[#09050e] to-[#710755]/40 text-[#fef08a] shadow-lg">
              <Shield className="h-7 w-7" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="font-display text-xs font-bold tracking-widest text-[#fef08a] uppercase">
                  COUNTING CASCADE
                </span>
                <span className="h-1 w-1 rounded-full bg-[#fef08a]/60" />
                <span className="text-[10px] font-mono text-slate-400">Portal Otoritatif</span>
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-wide text-white">
                Teacher Portal
              </h1>
              <p className="mt-1.5 text-xs text-slate-300">
                Kelola kasus dan sesi pembelajaranmu.
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              id="teacher-login-error"
              className="mt-5 flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-950/40 px-3.5 py-2.5 text-xs text-red-200 animate-fade-in shadow-inner"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Nama Guru Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="teacher-name-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Nama Guru
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4 text-[#fef08a]" />
                </div>
                <input
                  id="teacher-name-input"
                  type="text"
                  value={teacherName}
                  onChange={(e) => {
                    setTeacherName(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masukkan nama guru"
                  className="w-full rounded-xl border border-[#69021E]/60 bg-[#030206]/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#AA0235] focus:outline-none focus:ring-2 focus:ring-[#AA0235]/30 transition"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="teacher-password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <KeyRound className="h-4 w-4 text-[#fef08a]" />
                </div>
                <input
                  id="teacher-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-[#69021E]/60 bg-[#030206]/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-[#AA0235] focus:outline-none focus:ring-2 focus:ring-[#AA0235]/30 transition"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="btn-teacher-login"
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-[0.99] disabled:opacity-50"
              >
                <span>MASUK</span>
                <ArrowRight className="h-4 w-4 text-[#fef08a] transition group-hover:translate-x-0.5" />
              </button>
            </div>
          </form>

          {/* Return to Student Mode Link */}
          {onBackToStudent && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={onBackToStudent}
                className="text-xs text-slate-400 hover:text-[#fef08a] transition"
              >
                &larr; Kembali ke Mode Siswa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
