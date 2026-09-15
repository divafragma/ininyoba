import React, { useState } from 'react';
import { 
  X, Save, Plus, Trash2, ShieldAlert, 
  Tag, FileText, CheckCircle2, Lock 
} from 'lucide-react';
import { CaseData, DifficultyLevel, CaseStatus, InformationBlock } from '../../types';

interface CaseEditorModalProps {
  initialCase?: CaseData | null;
  onSave: (caseData: CaseData) => void;
  onClose: () => void;
}

export const CaseEditorModal: React.FC<CaseEditorModalProps> = ({
  initialCase,
  onSave,
  onClose
}) => {
  const isEditing = !!initialCase;

  const [activeTab, setActiveTab] = useState<'main' | 'infoBlocks' | 'teacherSolution'>('main');

  // Form states
  const [caseId, setCaseId] = useState(initialCase?.caseId || `CC-${Date.now().toString().slice(-4)}`);
  const [title, setTitle] = useState(initialCase?.title || '');
  const [text, setText] = useState(initialCase?.text || '');
  const [topic, setTopic] = useState(initialCase?.topic || 'Kaidah Pencacahan');
  const [subtopic, setSubtopic] = useState(initialCase?.subtopic || 'Aturan Perkalian');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialCase?.difficulty || 'Sedang');
  const [status, setStatus] = useState<CaseStatus>(initialCase?.status || 'Active');

  // Teacher-Only Evaluation Fields
  const [correctRule, setCorrectRule] = useState(initialCase?.correctRule || 'Aturan Perkalian');
  const [teacherSolution, setTeacherSolution] = useState(initialCase?.teacherSolution || '');
  const [finalAnswer, setFinalAnswer] = useState(initialCase?.finalAnswer || '');
  const [answerKey, setAnswerKey] = useState(initialCase?.answerKey || '');

  // Information Blocks
  const [infoBlocks, setInfoBlocks] = useState<InformationBlock[]>(
    initialCase?.informationBlocks || [
      {
        id: `ib-${Date.now()}-1`,
        label: 'Pilihan Objek 1',
        value: '',
        description: '',
        order: 1,
        type: 'REVEAL',
        highlightText: ''
      }
    ]
  );

  // Handlers for Information Blocks
  const handleAddInfoBlock = () => {
    const newBlock: InformationBlock = {
      id: `ib-${Date.now()}`,
      label: 'Fakta Baru',
      value: '',
      description: '',
      order: infoBlocks.length + 1,
      type: 'REVEAL',
      highlightText: ''
    };
    setInfoBlocks([...infoBlocks, newBlock]);
  };

  const handleUpdateInfoBlock = (index: number, field: keyof InformationBlock, val: unknown) => {
    const updated = [...infoBlocks];
    updated[index] = { ...updated[index], [field]: val };
    setInfoBlocks(updated);
  };

  const handleRemoveInfoBlock = (index: number) => {
    setInfoBlocks(infoBlocks.filter((_, i) => i !== index));
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId.trim() || !title.trim() || !text.trim()) {
      alert('Harap lengkapi Kode Kasus, Judul Kasus, dan Teks Kasus Asli.');
      return;
    }

    const payload: CaseData = {
      caseId: caseId.trim().toUpperCase(),
      title: title.trim(),
      text: text.trim(),
      topic: topic.trim(),
      subtopic: subtopic.trim(),
      difficulty,
      status,
      correctRule: correctRule.trim() || undefined,
      teacherSolution: teacherSolution.trim() || undefined,
      finalAnswer: finalAnswer.trim() || undefined,
      answerKey: answerKey.trim() || undefined,
      informationBlocks: infoBlocks,
      usageCount: initialCase?.usageCount || 0,
      createdAt: initialCase?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206]/90 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl border border-[#69021E]/60 bg-[#09050e] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#69021E]/40 bg-[#021233]/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#AA0235]/20 border border-[#AA0235]/40 text-[#fef08a]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isEditing ? `Edit Kasus: ${caseId}` : 'Tambah Kasus Baru Guru'}
              </h3>
              <p className="text-xs text-slate-300">
                Konten teks kasus bersifat otoritatif dan disajikan persis tanpa modifikasi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#69021E]/30 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#69021E]/40 bg-[#030206] px-6 pt-2 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'main'
                ? 'border-[#AA0235] text-[#fef08a]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Teks & Informasi Kasus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('infoBlocks')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'infoBlocks'
                ? 'border-[#AA0235] text-[#fef08a]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Blok Informasi Siswa ({infoBlocks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('teacherSolution')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'teacherSolution'
                ? 'border-[#710755] text-[#fef9c3]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="h-4 w-4 text-[#fef08a]" />
            <span>Kunci & Solusi Guru (Teacher Only)</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MAIN DETAILS & VERBATIM TEXT */}
          {activeTab === 'main' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Kode Kasus (Case ID) *
                  </label>
                  <input
                    type="text"
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    placeholder="Contoh: CC-01"
                    className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm font-mono text-[#fef08a] focus:border-[#AA0235] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tantangan">Tantangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Status Kasus
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none"
                  >
                    <option value="Active">Active (Tersedia untuk Sesi)</option>
                    <option value="Draft">Draft (Disimpan Sementara)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Judul Kasus *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pemilihan Menu Restoran"
                  className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-white focus:border-[#AA0235] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Topik
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Kaidah Pencacahan"
                    className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Subtopik / Konsep
                  </label>
                  <input
                    type="text"
                    value={subtopic}
                    onChange={(e) => setSubtopic(e.target.value)}
                    placeholder="Aturan Perkalian / Aturan Penjumlahan"
                    className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 px-3.5 py-2 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none"
                  />
                </div>
              </div>

              {/* Exact Verbatim Case Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Teks Kasus Asli (Authoritative Case Text) *
                </label>
                <textarea
                  rows={6}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Masukkan kalimat soal/kasus persis seperti yang dirancang guru..."
                  className="mt-1.5 w-full rounded-xl border border-[#69021E]/50 bg-[#021233]/50 p-3.5 text-sm text-slate-200 focus:border-[#AA0235] focus:outline-none leading-relaxed"
                  required
                />
                <p className="mt-1 text-[11px] text-[#fef9c3]">
                  Teks ini akan disajikan persis tanpa parafrase atau pengubahan angka otomatis.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: INFORMATION BLOCKS */}
          {activeTab === 'infoBlocks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  Blok informasi berisi fakta-fakta spesifik yang telah dipetakan guru dari teks kasus.
                </p>
                <button
                  type="button"
                  onClick={handleAddInfoBlock}
                  className="flex items-center gap-1.5 rounded-xl bg-[#AA0235]/20 border border-[#AA0235]/40 px-3 py-1.5 text-xs font-semibold text-[#fef08a] hover:bg-[#AA0235]/30"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Blok Informasi
                </button>
              </div>

              <div className="space-y-3">
                {infoBlocks.map((blk, idx) => (
                  <div key={blk.id || idx} className="rounded-xl border border-[#69021E]/50 bg-[#021233]/40 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#69021E]/40 pb-2">
                      <span className="font-mono text-xs font-bold text-[#fef08a]">
                        Blok #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInfoBlock(idx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300">Label Blok *</label>
                        <input
                          type="text"
                          value={blk.label}
                          onChange={(e) => handleUpdateInfoBlock(idx, 'label', e.target.value)}
                          placeholder="Contoh: Pilihan nasi"
                          className="mt-1 w-full rounded-lg border border-[#69021E]/40 bg-[#030206] px-3 py-1.5 text-xs text-slate-200 focus:border-[#AA0235] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300">
                          Potongan Teks untuk Highlight Interaktif (Substring dari Teks Kasus)
                        </label>
                        <input
                          type="text"
                          value={blk.highlightText || ''}
                          onChange={(e) => handleUpdateInfoBlock(idx, 'highlightText', e.target.value)}
                          placeholder="Ketik kalimat/kata dari teks soal..."
                          className="mt-1 w-full rounded-lg border border-[#69021E]/40 bg-[#030206] px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-[#AA0235] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300">Nilai / Fakta Mentah (Value) *</label>
                      <input
                        type="text"
                        value={blk.value}
                        onChange={(e) => handleUpdateInfoBlock(idx, 'value', e.target.value)}
                        placeholder="Contoh: Nasi goreng, nasi putih, dan nasi liwet."
                        className="mt-1 w-full rounded-lg border border-[#69021E]/40 bg-[#030206] px-3 py-1.5 text-xs text-[#fef08a] focus:border-[#AA0235] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300">Penjelasan / Catatan Tambahan Guru (Opsional)</label>
                      <input
                        type="text"
                        value={blk.description || ''}
                        onChange={(e) => handleUpdateInfoBlock(idx, 'description', e.target.value)}
                        placeholder="Catatan klarifikasi informasi tanpa membocorkan rumus/jawaban..."
                        className="mt-1 w-full rounded-lg border border-[#69021E]/40 bg-[#030206] px-3 py-1.5 text-xs text-slate-300 focus:border-[#AA0235] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEACHER ONLY EVALUATION FIELDS */}
          {activeTab === 'teacherSolution' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-[#AA0235]/40 bg-[#69021E]/20 p-4">
                <div className="flex items-center gap-2 text-[#fef08a] font-semibold text-xs uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" />
                  <span>KUNCI JAWABAN & SOLUSI GURU (TERPROTEKSI PENUH)</span>
                </div>
                <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                  Semua data pada tab ini tersimpan secara eksklusif untuk guru. Sistem <strong>secara ketat membersihkan (strip)</strong> data ini sebelum payload kasus dikirimkan ke Mode Siswa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Kaidah / Aturan yang Tepat
                  </label>
                  <select
                    value={correctRule}
                    onChange={(e) => setCorrectRule(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#AA0235]/40 bg-[#021233]/60 px-3.5 py-2.5 text-xs text-[#fef08a] font-semibold focus:border-[#AA0235] focus:outline-none"
                  >
                    <option value="Aturan Perkalian">Aturan Perkalian</option>
                    <option value="Aturan Penjumlahan">Aturan Penjumlahan</option>
                    <option value="Gabungan Aturan Penjumlahan dan Perkalian">Gabungan Aturan Penjumlahan & Perkalian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Jawaban Akhir
                  </label>
                  <input
                    type="text"
                    value={finalAnswer}
                    onChange={(e) => setFinalAnswer(e.target.value)}
                    placeholder="Contoh: 24 cara atau 14 pilihan"
                    className="mt-1.5 w-full rounded-xl border border-[#AA0235]/40 bg-[#021233]/60 px-3.5 py-2.5 text-xs font-mono text-[#fef9c3] focus:border-[#AA0235] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Langkah Penyelesaian Lengkap Guru (Teacher Solution)
                </label>
                <textarea
                  rows={6}
                  value={teacherSolution}
                  onChange={(e) => setTeacherSolution(e.target.value)}
                  placeholder="Tuliskan analisis permasalahan dan langkah perhitungan rinci untuk pegangan guru saat mendampingi kelompok..."
                  className="mt-1.5 w-full rounded-xl border border-[#AA0235]/40 bg-[#021233]/60 p-3.5 text-xs text-slate-200 focus:border-[#AA0235] focus:outline-none leading-relaxed font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase">
                  Ringkasan Kunci Jawaban (Answer Key)
                </label>
                <input
                  type="text"
                  value={answerKey}
                  onChange={(e) => setAnswerKey(e.target.value)}
                  placeholder="Contoh: 3 × 4 × 2 = 24 cara"
                  className="mt-1.5 w-full rounded-xl border border-[#AA0235]/40 bg-[#021233]/60 px-3.5 py-2 text-xs font-mono text-white focus:border-[#AA0235] focus:outline-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#69021E]/40 bg-[#021233]/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#69021E]/50 bg-[#030206] px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-[#69021E]/30 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] px-5 py-2 text-xs font-bold text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 active:scale-95 transition shadow-lg"
          >
            <Save className="h-4 w-4 text-[#fef08a]" />
            <span>Simpan Kasus Guru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
