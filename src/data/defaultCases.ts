import { CaseData } from '../types';

/**
 * 5 Kasus Otoritatif Counting Cascade
 * Materi: Kaidah Pencacahan
 * Submateri: Aturan Penjumlahan dan Aturan Perkalian
 * 
 * PENTING:
 * - Teks kasus disajikan secara verbatim (persis seperti yang dirancang guru).
 * - Blok informasi hanya memuat fakta mentah dari soal (RAW INFORMATION ONLY).
 * - Tidak memuat jumlah pilihan, rumus, aturan matematika, atau jawaban di mode murid.
 * - Informasi aturan, kunci, dan penyelesaian hanya disimpan untuk Teacher Mode.
 */
export const DEFAULT_CASES: CaseData[] = [
  // ==========================================
  // SOAL 1: Pilihan Menu Restoran
  // ==========================================
  {
    caseId: 'CC-01',
    title: 'Pilihan Menu Restoran',
    topic: 'Kaidah Pencacahan',
    subtopic: 'Aturan Perkalian',
    difficulty: 'Mudah',
    status: 'Active',
    text: 'Sebuah restoran menyediakan nasi goreng, nasi putih, dan nasi liwet. Pelanggan dapat memilih satu lauk berupa ayam goreng, ayam bakar, ikan goreng, atau telur balado, serta satu minuman berupa es teh atau jus jeruk. Setiap pelanggan hanya diperbolehkan memilih satu nasi, satu lauk, dan satu minuman. Tentukan banyak pilihan menu berbeda yang dapat dibuat dari pilihan tersebut.',
    informationBlocks: [
      {
        id: 'c1-ib-1',
        label: 'Pilihan nasi',
        value: 'Nasi goreng, nasi putih, dan nasi liwet.',
        order: 1,
        type: 'REVEAL',
        highlightText: 'nasi goreng, nasi putih, dan nasi liwet'
      },
      {
        id: 'c1-ib-2',
        label: 'Pilihan lauk',
        value: 'Ayam goreng, ayam bakar, ikan goreng, atau telur balado.',
        order: 2,
        type: 'REVEAL',
        highlightText: 'ayam goreng, ayam bakar, ikan goreng, atau telur balado'
      },
      {
        id: 'c1-ib-3',
        label: 'Pilihan minuman',
        value: 'Es teh atau jus jeruk.',
        order: 3,
        type: 'REVEAL',
        highlightText: 'es teh atau jus jeruk'
      },
      {
        id: 'c1-ib-4',
        label: 'Ketentuan pemilihan',
        value: 'Setiap pelanggan hanya diperbolehkan memilih satu nasi, satu lauk, dan satu minuman.',
        order: 4,
        type: 'REVEAL',
        highlightText: 'Setiap pelanggan hanya diperbolehkan memilih satu nasi, satu lauk, dan satu minuman'
      }
    ],
    // Teacher-only validation data
    correctRule: 'Aturan Perkalian',
    teacherSolution: '3 pilihan nasi × 4 pilihan lauk × 2 pilihan minuman\n= 3 × 4 × 2\n= 24',
    finalAnswer: '24 pilihan menu',
    answerKey: '24 pilihan menu (3 × 4 × 2)',
    usageCount: 0,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z'
  },

  // ==========================================
  // SOAL 2: Perjalanan Sinta
  // ==========================================
  {
    caseId: 'CC-02',
    title: 'Perjalanan Sinta',
    topic: 'Kaidah Pencacahan',
    subtopic: 'Aturan Perkalian',
    difficulty: 'Sedang',
    status: 'Active',
    text: 'Sinta merencanakan perjalanan dari Semarang menuju Yogyakarta, kemudian melanjutkan perjalanan ke Pantai Parangtritis, sebelum kembali ke Semarang. Untuk berangkat dari Semarang menuju Yogyakarta, Sinta dapat memilih bus, kereta api, atau travel. Dari Yogyakarta menuju Pantai Parangtritis, Sinta dapat memilih bus wisata, taksi, atau menyewa sepeda motor. Setelah selesai berkunjung, Sinta dapat kembali dari Pantai Parangtritis ke Yogyakarta menggunakan bus wisata atau taksi. Selanjutnya, Sinta dapat kembali ke Semarang menggunakan bus, kereta api, atau travel. Berapa banyak kemungkinan perjalanan berbeda yang dapat dilakukan Sinta hingga kembali ke Semarang?',
    informationBlocks: [
      {
        id: 'c2-ib-1',
        label: 'Semarang → Yogyakarta',
        value: 'Bus, kereta api, atau travel.',
        order: 1,
        type: 'REVEAL',
        highlightText: 'Untuk berangkat dari Semarang menuju Yogyakarta, Sinta dapat memilih bus, kereta api, atau travel'
      },
      {
        id: 'c2-ib-2',
        label: 'Yogyakarta → Pantai Parangtritis',
        value: 'Bus wisata, taksi, atau menyewa sepeda motor.',
        order: 2,
        type: 'REVEAL',
        highlightText: 'Dari Yogyakarta menuju Pantai Parangtritis, Sinta dapat memilih bus wisata, taksi, atau menyewa sepeda motor'
      },
      {
        id: 'c2-ib-3',
        label: 'Pantai Parangtritis → Yogyakarta',
        value: 'Bus wisata atau taksi.',
        order: 3,
        type: 'REVEAL',
        highlightText: 'Sinta dapat kembali dari Pantai Parangtritis ke Yogyakarta menggunakan bus wisata atau taksi'
      },
      {
        id: 'c2-ib-4',
        label: 'Yogyakarta → Semarang',
        value: 'Bus, kereta api, atau travel.',
        order: 4,
        type: 'REVEAL',
        highlightText: 'Sinta dapat kembali ke Semarang menggunakan bus, kereta api, atau travel'
      }
    ],
    // Teacher-only validation data
    correctRule: 'Aturan Perkalian',
    teacherSolution: '3 pilihan perjalanan Semarang → Yogyakarta\n× 3 pilihan perjalanan Yogyakarta → Pantai Parangtritis\n× 2 pilihan perjalanan Pantai Parangtritis → Yogyakarta\n× 3 pilihan perjalanan Yogyakarta → Semarang\n= 3 × 3 × 2 × 3\n= 54',
    finalAnswer: '54 kemungkinan perjalanan',
    answerKey: '54 kemungkinan perjalanan (3 × 3 × 2 × 3)',
    usageCount: 0,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z'
  },

  // ==========================================
  // SOAL 3: Pemilihan Kendaraan
  // ==========================================
  {
    caseId: 'CC-03',
    title: 'Pemilihan Kendaraan',
    topic: 'Kaidah Pencacahan',
    subtopic: 'Aturan Penjumlahan',
    difficulty: 'Sedang',
    status: 'Active',
    text: `Sebuah sekolah akan mengadakan kunjungan yang diikuti oleh 67 murid. Panitia harus memilih satu kendaraan untuk membawa seluruh peserta. Tersedia beberapa kendaraan sebagai berikut:

Minibus: 3 kendaraan dengan kapasitas 68, 75, dan 80 kursi.

Bus sedang: 4 kendaraan dengan kapasitas 72, 78, 85, dan 88 kursi.

Bus besar: 5 kendaraan dengan kapasitas 90, 100, 110, 120, dan 130 kursi.

Namun, minibus berkapasitas 80 kursi, bus sedang berkapasitas 78 kursi, serta bus besar berkapasitas 110 kursi sedang menjalani perawatan. Selain itu, minibus berkapasitas 68 kursi dan bus besar berkapasitas 120 kursi telah digunakan untuk kegiatan lain.

Jika panitia hanya dapat memilih satu kendaraan yang masih tersedia dan memiliki kapasitas yang cukup`,
    informationBlocks: [
      {
        id: 'c3-ib-1',
        label: 'Jumlah peserta',
        value: '67 murid.',
        order: 1,
        type: 'REVEAL',
        highlightText: '67 murid'
      },
      {
        id: 'c3-ib-2',
        label: 'Minibus',
        value: '3 kendaraan dengan kapasitas 68, 75, dan 80 kursi.',
        order: 2,
        type: 'REVEAL',
        highlightText: 'Minibus: 3 kendaraan dengan kapasitas 68, 75, dan 80 kursi.'
      },
      {
        id: 'c3-ib-3',
        label: 'Bus sedang',
        value: '4 kendaraan dengan kapasitas 72, 78, 85, dan 88 kursi.',
        order: 3,
        type: 'REVEAL',
        highlightText: 'Bus sedang: 4 kendaraan dengan kapasitas 72, 78, 85, dan 88 kursi.'
      },
      {
        id: 'c3-ib-4',
        label: 'Bus besar',
        value: '5 kendaraan dengan kapasitas 90, 100, 110, 120, dan 130 kursi.',
        order: 4,
        type: 'REVEAL',
        highlightText: 'Bus besar: 5 kendaraan dengan kapasitas 90, 100, 110, 120, dan 130 kursi.'
      },
      {
        id: 'c3-ib-5',
        label: 'Sedang menjalani perawatan',
        value: 'Minibus berkapasitas 80 kursi, bus sedang berkapasitas 78 kursi, serta bus besar berkapasitas 110 kursi.',
        order: 5,
        type: 'REVEAL',
        highlightText: 'minibus berkapasitas 80 kursi, bus sedang berkapasitas 78 kursi, serta bus besar berkapasitas 110 kursi sedang menjalani perawatan'
      },
      {
        id: 'c3-ib-6',
        label: 'Telah digunakan',
        value: 'Minibus berkapasitas 68 kursi dan bus besar berkapasitas 120 kursi.',
        order: 6,
        type: 'REVEAL',
        highlightText: 'minibus berkapasitas 68 kursi dan bus besar berkapasitas 120 kursi telah digunakan untuk kegiatan lain'
      },
      {
        id: 'c3-ib-7',
        label: 'Ketentuan',
        value: 'Panitia hanya dapat memilih satu kendaraan yang masih tersedia dan memiliki kapasitas yang cukup.',
        order: 7,
        type: 'REVEAL',
        highlightText: 'Jika panitia hanya dapat memilih satu kendaraan yang masih tersedia dan memiliki kapasitas yang cukup'
      }
    ],
    // Teacher-only validation data
    correctRule: 'Aturan Penjumlahan',
    teacherSolution: 'Kendaraan yang masih tersedia dan memiliki kapasitas cukup (≥ 67 murid):\n• Minibus 75 kursi (1)\n• Bus sedang 72, 85, 88 kursi (3)\n• Bus besar 90, 100, 130 kursi (3)\nTotal = 1 + 3 + 3 = 7 pilihan kendaraan',
    finalAnswer: '7 pilihan kendaraan',
    answerKey: '7 pilihan kendaraan (Aturan Penjumlahan)',
    usageCount: 0,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z'
  },

  // ==========================================
  // SOAL 4: Pilihan Lomba Raka
  // ==========================================
  {
    caseId: 'CC-04',
    title: 'Pilihan Lomba Raka',
    topic: 'Kaidah Pencacahan',
    subtopic: 'Aturan Penjumlahan',
    difficulty: 'Sedang',
    status: 'Active',
    text: 'Dalam sebuah festival sekolah, murid dapat mengikuti satu jenis lomba sesuai minatnya. Cabang yang tersedia meliputi lomba matematika, fisika, dan kimia pada bidang akademik, lomba poster, fotografi, dan desain digital pada bidang seni, serta lomba pidato, membaca puisi, dan debat pada bidang bahasa. Raka ingin mengikuti salah satu lomba tersebut. Ia tidak dapat mengikuti lomba fisika karena jadwal pelaksanaannya bersamaan dengan kegiatan lain yang harus diikutinya. Raka tidak menyukai lomba fotografi dan tidak berminat mengikuti lomba pidato. Selain itu, Raka tidak diperbolehkan mengikuti lomba matematika karena pada festival tahun sebelumnya ia telah menjadi juara pertama pada lomba tersebut. Berdasarkan kondisi tersebut, berapa banyak pilihan lomba yang masih dapat diikuti Raka?',
    informationBlocks: [
      {
        id: 'c4-ib-1',
        label: 'Bidang akademik',
        value: 'Lomba matematika, fisika, dan kimia.',
        order: 1,
        type: 'REVEAL',
        highlightText: 'lomba matematika, fisika, dan kimia pada bidang akademik'
      },
      {
        id: 'c4-ib-2',
        label: 'Bidang seni',
        value: 'Lomba poster, fotografi, dan desain digital.',
        order: 2,
        type: 'REVEAL',
        highlightText: 'lomba poster, fotografi, dan desain digital pada bidang seni'
      },
      {
        id: 'c4-ib-3',
        label: 'Bidang bahasa',
        value: 'Lomba pidato, membaca puisi, dan debat.',
        order: 3,
        type: 'REVEAL',
        highlightText: 'lomba pidato, membaca puisi, dan debat pada bidang bahasa'
      },
      {
        id: 'c4-ib-4',
        label: 'Kondisi Raka',
        value: 'Raka tidak dapat mengikuti lomba fisika karena jadwal pelaksanaannya bersamaan dengan kegiatan lain yang harus diikutinya. Raka tidak menyukai lomba fotografi dan tidak berminat mengikuti lomba pidato. Selain itu, Raka tidak diperbolehkan mengikuti lomba matematika karena pada festival tahun sebelumnya ia telah menjadi juara pertama pada lomba tersebut.',
        order: 4,
        type: 'REVEAL',
        highlightText: 'Raka tidak dapat mengikuti lomba fisika karena jadwal pelaksanaannya bersamaan dengan kegiatan lain yang harus diikutinya. Raka tidak menyukai lomba fotografi dan tidak berminat mengikuti lomba pidato. Selain itu, Raka tidak diperbolehkan mengikuti lomba matematika karena pada festival tahun sebelumnya ia telah menjadi juara pertama pada lomba tersebut.'
      }
    ],
    // Teacher-only validation data
    correctRule: 'Aturan Penjumlahan',
    teacherSolution: 'Total lomba: 3 akademik + 3 seni + 3 bahasa = 9\nLomba yang tidak dapat diikuti: matematika, fisika, fotografi, pidato (4 lomba)\nMaka: 9 − 4 = 5 pilihan lomba',
    finalAnswer: '5 pilihan lomba',
    answerKey: '5 pilihan lomba (9 − 4 = 5)',
    usageCount: 0,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z'
  },

  // ==========================================
  // SOAL 5: Kode Akses Ujian
  // ==========================================
  {
    caseId: 'CC-05',
    title: 'Kode Akses Ujian',
    topic: 'Kaidah Pencacahan',
    subtopic: 'Aturan Perkalian',
    difficulty: 'Tantangan',
    status: 'Active',
    text: 'Menjelang pelaksanaan ujian sekolah, setiap murid memperoleh kode akses untuk membuka sistem ujian. Kode tersebut terdiri atas lima karakter. Bagian awal kode menggunakan salah satu huruf vokal A, I, U, E, atau O, kemudian diikuti salah satu huruf B, C, D, F, atau G. Setelah dua huruf tersebut, sistem meminta satu angka ganjil dari 1, 3, 5, 7, atau 9, kemudian satu angka genap dari 2, 4, 6, atau 8. Sebagai karakter terakhir, murid dapat menggunakan salah satu huruf A sampai E atau salah satu angka 1 sampai 3. Berapa banyak kode akses berbeda yang mungkin terbentuk?',
    informationBlocks: [
      {
        id: 'c5-ib-1',
        label: 'Karakter pertama',
        value: 'Salah satu huruf vokal A, I, U, E, atau O.',
        order: 1,
        type: 'REVEAL',
        highlightText: 'salah satu huruf vokal A, I, U, E, atau O'
      },
      {
        id: 'c5-ib-2',
        label: 'Karakter kedua',
        value: 'Salah satu huruf B, C, D, F, atau G.',
        order: 2,
        type: 'REVEAL',
        highlightText: 'salah satu huruf B, C, D, F, atau G'
      },
      {
        id: 'c5-ib-3',
        label: 'Karakter ketiga',
        value: 'Satu angka ganjil dari 1, 3, 5, 7, atau 9.',
        order: 3,
        type: 'REVEAL',
        highlightText: 'satu angka ganjil dari 1, 3, 5, 7, atau 9'
      },
      {
        id: 'c5-ib-4',
        label: 'Karakter keempat',
        value: 'Satu angka genap dari 2, 4, 6, atau 8.',
        order: 4,
        type: 'REVEAL',
        highlightText: 'satu angka genap dari 2, 4, 6, atau 8'
      },
      {
        id: 'c5-ib-5',
        label: 'Karakter terakhir',
        value: 'Salah satu huruf A sampai E atau salah satu angka 1 sampai 3.',
        order: 5,
        type: 'REVEAL',
        highlightText: 'salah satu huruf A sampai E atau salah satu angka 1 sampai 3'
      }
    ],
    // Teacher-only validation data
    correctRule: 'Aturan Perkalian',
    teacherSolution: 'Karakter 1: 5 pilihan\nKarakter 2: 5 pilihan\nKarakter 3: 5 pilihan\nKarakter 4: 4 pilihan\nKarakter 5: 5 huruf (A-E) + 3 angka (1-3) = 8 pilihan\nMaka: 5 × 5 × 5 × 4 × 8 = 4.000',
    finalAnswer: '4.000 kode akses',
    answerKey: '4.000 kode akses (5 × 5 × 5 × 4 × 8)',
    usageCount: 0,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T08:00:00Z'
  }
];
