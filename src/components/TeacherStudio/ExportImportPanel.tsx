import React, { useState } from 'react';
import { 
  Download, Upload, RotateCcw, FileText, CheckCircle2, 
  AlertCircle, Copy, Check, Database, ShieldAlert 
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { CaseData } from '../../types';

interface ExportImportPanelProps {
  onDataChanged: () => void;
}

export const ExportImportPanel: React.FC<ExportImportPanelProps> = ({ onDataChanged }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const sampleTemplate = [
    {
      caseId: "CC-040",
      title: "Contoh Judul Kasus Otoritatif Guru",
      topic: "Kaidah Pencacahan",
      subtopic: "Kombinasi / Permutasi / Filling Slots",
      difficulty: "Sedang",
      status: "Active",
      text: "[TEACHER CASE WILL BE INSERTED HERE]",
      options: [
        "A. Opsi 1",
        "B. Opsi 2",
        "C. Opsi 3",
        "D. Opsi 4",
        "E. Opsi 5"
      ],
      answerKey: "Kunci Jawaban Guru (Hanya untuk Teacher Mode)",
      informationBlocks: [
        {
          id: "ib-1",
          label: "Konteks Kasus",
          value: "Nilai fakta spesifik",
          description: "Keterangan tambahan guru",
          order: 1,
          type: "REVEAL",
          highlightText: "kata penting pada teks"
        }
      ],
      explorationBlocks: [
        { id: "eb-1", type: "CONTEXT", title: "Konteks & Latar Kasus", content: "Penjelasan konteks", order: 1 },
        { id: "eb-2", type: "OBJECTS", title: "Objek & Elemen Kasus", content: "Daftar objek", order: 2 },
        { id: "eb-3", type: "CHOICES", title: "Pilihan & Ketersediaan", content: "Ketersediaan pilihan", order: 3 },
        { id: "eb-4", type: "CONDITIONS", title: "Kondisi & Batasan", content: "Batasan khusus", order: 4 },
        { id: "eb-5", type: "STRUCTURE", title: "Peta Struktur", content: "Alur relasi", order: 5 }
      ],
      relationData: {
        title: "Diagram Struktur Kasus",
        type: "tree",
        nodes: [
          {
            id: "r1",
            label: "Objek Utama",
            type: "root",
            children: [{ id: "r2", label: "Sub-elemen", type: "item" }]
          }
        ],
        notes: "Catatan hubungan struktur"
      }
    }
  ];

  const handleExport = () => {
    const jsonStr = StorageService.exportCasesJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `counting-cascade-cases-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) {
        setJsonInput(content);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!jsonInput.trim()) {
      setImportStatus({ type: 'error', message: 'Harap masukkan data JSON kasus.' });
      return;
    }

    const result = StorageService.importCasesJSON(jsonInput);
    if (result.success) {
      setImportStatus({
        type: 'success',
        message: `Berhasil mengimpor ${result.count} kasus guru ke dalam sistem!`
      });
      setJsonInput('');
      onDataChanged();
    } else {
      setImportStatus({
        type: 'error',
        message: result.error || 'Gagal mengimpor data JSON.'
      });
    }
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleTemplate, null, 2)).then(() => {
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke 5 kasus demo standar (CC-DEMO-01 s/d CC-DEMO-05)? Data custom akan tereset.')) {
      StorageService.resetAllToDefaults();
      onDataChanged();
      setImportStatus({
        type: 'success',
        message: 'Data berhasil direset ke 5 kasus default Counting Cascade.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-white">
          Cadangkan & Impor Paket Kasus Otoritatif Guru
        </h2>
        <p className="text-xs text-slate-300">
          Impor batch hingga 40 kasus sekaligus menggunakan format JSON terstruktur untuk penggunaan di kelas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EXPORT PANEL */}
        <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-[#69021E]/40 pb-3">
            <Download className="h-5 w-5 text-[#fef08a]" />
            <h3 className="font-display text-base font-bold text-white">
              Ekspor Koleksi Kasus (Backup JSON)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Unduh seluruh kasus yang tersimpan di sistem saat ini sebagai file berkas JSON. Berkas ini dapat dibagikan kepada rekan guru atau dipulihkan sewaktu-waktu.
          </p>

          <div className="rounded-xl border border-[#69021E]/40 bg-[#021233]/40 p-4 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Database className="h-4 w-4 text-[#fef08a]" />
              <span>Isi Data yang Diekspor:</span>
            </div>
            <p>• Teks kasus lengkap verbatim guru</p>
            <p>• Opsi jawaban, topik, dan tingkat kesulitan</p>
            <p>• Kunci jawaban guru (terproteksi)</p>
            <p>• Konfigurasi blok informasi & diagram relasi</p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] py-3 text-xs font-bold uppercase tracking-wider text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md transition"
          >
            <Download className="h-4 w-4 text-[#fef08a]" />
            <span>Unduh Berkas JSON Kasus (.json)</span>
          </button>
        </div>

        {/* IMPORT PANEL */}
        <div className="rounded-2xl border border-[#69021E]/50 bg-[#09050e] p-6 space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-[#69021E]/40 pb-3">
            <Upload className="h-5 w-5 text-[#fef08a]" />
            <h3 className="font-display text-base font-bold text-white">
              Impor Kasus Guru (JSON Batch)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Unggah berkas JSON atau tempel teks JSON kasus baru di bawah untuk menambah atau memperbarui koleksi kasus.
          </p>

          {/* File Upload Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Unggah File .json
            </label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#710755] file:text-white hover:file:bg-[#AA0235] cursor-pointer"
            />
          </div>

          {/* Text Area JSON */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">
                Atau Tempel Teks JSON Kasus
              </label>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="flex items-center gap-1 text-[11px] text-[#fef08a] hover:underline"
              >
                {copiedTemplate ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedTemplate ? 'Template Tersalin!' : 'Salin Template Kasus'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Tempel format JSON array [...] di sini..."
              className="w-full rounded-xl border border-[#69021E]/50 bg-[#030206] p-3 font-mono text-xs text-[#fef9c3] focus:border-[#AA0235] focus:outline-none"
            />
          </div>

          {importStatus && (
            <div
              className={`rounded-xl border p-3 text-xs flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'border-[#AA0235]/40 bg-[#AA0235]/20 text-[#fef08a]'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#fef08a]" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleImport}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#AA0235] via-[#69021E] to-[#710755] py-3 text-xs font-bold uppercase tracking-wider text-white hover:from-[#AA0235]/90 hover:to-[#710755]/90 shadow-md transition"
          >
            <Upload className="h-4 w-4 text-[#fef08a]" />
            <span>Proses Impor Kasus ke Perpustakaan</span>
          </button>
        </div>
      </div>

      {/* DANGER ZONE / RESET */}
      <div className="rounded-2xl border border-[#AA0235]/40 bg-[#AA0235]/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-xs sm:text-sm text-[#fef08a] flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" /> Kembalikan ke 5 Demo Kasus Awal
          </h4>
          <p className="mt-1 text-xs text-slate-300">
            Reset basis data lokal kembali ke 5 kasus prototipe default (CC-DEMO-01 s/d CC-DEMO-05).
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 rounded-xl border border-[#AA0235]/50 bg-[#030206] px-4 py-2 text-xs font-semibold text-[#fef08a] hover:bg-[#AA0235]/20 transition shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset ke Demo Standar</span>
        </button>
      </div>
    </div>
  );
};
