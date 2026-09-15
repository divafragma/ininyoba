import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Edit2, Copy, Trash2, 
  Power, Layers, Tag, Eye, EyeOff, ShieldCheck, 
  FileText, Sparkles 
} from 'lucide-react';
import { CaseData, DifficultyLevel, CaseStatus } from '../../types';

interface CaseLibraryProps {
  cases: CaseData[];
  onAddNewCase: () => void;
  onEditCase: (c: CaseData) => void;
  onDuplicateCase: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
  onToggleStatus: (caseId: string) => void;
}

export const CaseLibrary: React.FC<CaseLibraryProps> = ({
  cases,
  onAddNewCase,
  onEditCase,
  onDuplicateCase,
  onDeleteCase,
  onToggleStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAnswerKeyMap, setShowAnswerKeyMap] = useState<Record<string, boolean>>({});

  const toggleShowAnswer = (caseId: string) => {
    setShowAnswerKeyMap(prev => ({ ...prev, [caseId]: !prev[caseId] }));
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtopic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff = filterDifficulty === 'ALL' || c.difficulty === filterDifficulty;
    const matchesStat = filterStatus === 'ALL' || c.status === filterStatus;

    return matchesSearch && matchesDiff && matchesStat;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Koleksi Kasus Otoritatif Guru ({cases.length} Kasus)
          </h2>
          <p className="text-xs text-slate-300">
            Kelola data kasus, blok informasi, opsi jawaban, dan kunci validasi guru.
          </p>
        </div>

        <button
          onClick={onAddNewCase}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-4 py-2.5 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md transition"
        >
          <Plus className="h-4 w-4 text-[#fef08a]" />
          <span>Tambah Kasus Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-4">
        <div className="relative sm:col-span-6">
          <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan Kode Kasus, Judul, atau kata kunci teks..."
            className="w-full rounded-xl border border-[#69021E]/40 bg-[#021233]/50 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-400 focus:border-[#AA0235] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full rounded-xl border border-[#69021E]/40 bg-[#021233]/50 py-2.5 px-3 text-xs text-slate-200 focus:border-[#AA0235] focus:outline-none"
          >
            <option value="ALL">Semua Kesulitan</option>
            <option value="Mudah">Mudah</option>
            <option value="Sedang">Sedang</option>
            <option value="Tantangan">Tantangan</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-xl border border-[#69021E]/40 bg-[#021233]/50 py-2.5 px-3 text-xs text-slate-200 focus:border-[#AA0235] focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Active">Active (Aktif)</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#69021E]/50 bg-[#021233]/20 p-12 text-center text-slate-400">
            <FileText className="mx-auto h-8 w-8 text-slate-500 mb-2" />
            <p className="text-sm font-semibold text-white">Tidak ada kasus yang cocok dengan filter.</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambah kasus baru.</p>
          </div>
        ) : (
          filteredCases.map((c) => {
            const isRevealed = showAnswerKeyMap[c.caseId] || false;

            return (
              <div
                key={c.caseId}
                className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-5 sm:p-6 shadow-md transition hover:border-[#AA0235]/60"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#69021E]/40 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#fef08a]">
                      {c.caseId}
                    </span>
                    <span className="text-[#69021E]">•</span>
                    <h3 className="text-sm sm:text-base font-bold text-white font-display">
                      {c.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        c.status === 'Active'
                          ? 'border border-[#710755]/50 bg-[#710755]/20 text-[#fef08a]'
                          : 'border border-[#69021E]/50 bg-[#69021E]/20 text-[#fef9c3]'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="rounded-full border border-[#69021E]/40 bg-[#021233]/50 px-2.5 py-0.5 text-[10px] text-slate-300">
                      {c.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Digunakan: {c.usageCount || 0}x
                    </span>
                  </div>
                </div>

                {/* Subtopic & Verbatim Text Preview */}
                <div className="mt-3.5 space-y-2">
                  <div className="text-xs text-[#fef9c3] font-medium">
                    {c.topic} → <span className="text-slate-300">{c.subtopic}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 line-clamp-3 leading-relaxed font-sans bg-[#021233]/30 p-3 rounded-xl border border-[#69021E]/30">
                    &ldquo;{c.text}&rdquo;
                  </p>
                </div>

                {/* Badges Info */}
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-[#69021E]/40 bg-[#021233]/40 px-2.5 py-1 text-slate-300">
                    <Tag className="h-3 w-3 text-[#fef08a]" />
                    <span>{c.informationBlocks?.length || 0} Blok Informasi Siswa</span>
                  </span>

                  {c.correctRule && (
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#710755]/50 bg-[#710755]/20 px-2.5 py-1 text-[#fef08a] font-medium">
                      <span>Kaidah: {c.correctRule}</span>
                    </span>
                  )}

                  {c.finalAnswer && (
                    <span className="rounded-lg border border-[#AA0235]/40 bg-[#AA0235]/15 px-2.5 py-1 text-[#fef9c3] font-mono">
                      Hasil: {c.finalAnswer}
                    </span>
                  )}
                </div>

                {/* Confidential Answer Key & Teacher Solution Section (Teacher Only) */}
                {(c.answerKey || c.teacherSolution || c.correctRule) && (
                  <div className="mt-4 rounded-xl border border-[#AA0235]/40 bg-[#69021E]/20 p-3.5 space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#fef08a] shrink-0" />
                        <span className="text-[11px] font-bold text-[#fef08a] uppercase tracking-wider">
                          Solusi Guru & Kunci Validasi (Terkunci dari Siswa)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleShowAnswer(c.caseId)}
                        className="flex items-center gap-1 rounded-lg border border-[#AA0235]/40 bg-[#AA0235]/20 px-2.5 py-1 text-[11px] font-medium text-[#fef08a] hover:bg-[#AA0235]/30 transition"
                      >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        <span>{isRevealed ? 'Sembunyikan' : 'Buka Solusi'}</span>
                      </button>
                    </div>

                    {isRevealed ? (
                      <div className="pt-2 border-t border-[#69021E]/40 space-y-1.5 text-xs text-slate-200">
                        {c.correctRule && (
                          <p><strong className="text-[#fef08a]">Kaidah:</strong> {c.correctRule}</p>
                        )}
                        {c.finalAnswer && (
                          <p><strong className="text-[#fef08a]">Jawaban Akhir:</strong> <span className="font-mono text-[#fef9c3]">{c.finalAnswer}</span></p>
                        )}
                        {c.answerKey && (
                          <p><strong className="text-[#fef08a]">Kunci:</strong> <span className="font-mono text-white">{c.answerKey}</span></p>
                        )}
                        {c.teacherSolution && (
                          <div className="mt-2 p-2.5 rounded-lg bg-[#030206]/80 border border-[#69021E]/30 whitespace-pre-line text-xs font-mono text-slate-300">
                            {c.teacherSolution}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="font-mono text-xs text-slate-400 italic">
                        •••••••••••••••••••••••••••• (Terproteksi Khusus Guru)
                      </p>
                    )}
                  </div>
                )}

                {/* Actions Row */}
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#69021E]/40">
                  <button
                    onClick={() => onToggleStatus(c.caseId)}
                    className="flex items-center gap-1 rounded-lg border border-[#69021E]/50 bg-[#021233]/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-[#69021E]/30 hover:text-white transition"
                    title="Ubah Status Aktif / Non-Aktif"
                  >
                    <Power className="h-3.5 w-3.5 text-[#fef08a]" />
                    <span>{c.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                  </button>

                  <button
                    onClick={() => onDuplicateCase(c.caseId)}
                    className="flex items-center gap-1 rounded-lg border border-[#69021E]/50 bg-[#021233]/60 px-3 py-1.5 text-xs text-slate-200 hover:bg-[#69021E]/30 hover:text-white transition"
                    title="Duplikasi Kasus"
                  >
                    <Copy className="h-3.5 w-3.5 text-[#fef9c3]" />
                    <span>Duplikasi</span>
                  </button>

                  <button
                    onClick={() => onEditCase(c)}
                    className="flex items-center gap-1 rounded-lg border border-[#AA0235]/50 bg-[#AA0235]/20 px-3 py-1.5 text-xs font-semibold text-[#fef08a] hover:bg-[#AA0235]/30 transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Kasus</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus kasus ${c.caseId} (${c.title})?`)) {
                        onDeleteCase(c.caseId);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-[#AA0235]/20 hover:text-white transition"
                    title="Hapus Kasus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
