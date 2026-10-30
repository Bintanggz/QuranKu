import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../public/data');
const SURAHS_DIR = path.resolve(DATA_DIR, 'surahs');

describe('Pengujian Integritas Metadata dan Teks Al-Qur\'an', () => {
  const surahListPath = path.join(DATA_DIR, 'surah-list.json');

  test('File surah-list.json harus ada dan berisi tepat 114 surah', () => {
    assert.equal(fs.existsSync(surahListPath), true, 'surah-list.json harus ada');
    const rawData = fs.readFileSync(surahListPath, 'utf-8');
    const surahs = JSON.parse(rawData);

    assert.equal(Array.isArray(surahs), true, 'surah-list harus berbentuk array');
    assert.equal(surahs.length, 114, 'Jumlah surah harus tepat 114');

    // Validasi nomor urut 1 sampai 114
    for (let i = 0; i < 114; i++) {
      assert.equal(surahs[i].number, i + 1, `Surah indeks ${i} harus bernomor ${i + 1}`);
      assert.ok(surahs[i].name && surahs[i].name.trim().length > 0, `Nama surah ${i + 1} tidak boleh kosong`);
      assert.ok(surahs[i].arabicName && surahs[i].arabicName.trim().length > 0, `Nama Arab surah ${i + 1} tidak boleh kosong`);
      assert.ok(surahs[i].meaning && surahs[i].meaning.trim().length > 0, `Arti surah ${i + 1} tidak boleh kosong`);
      assert.ok(surahs[i].totalAyah > 0, `Jumlah ayat surah ${i + 1} harus > 0`);
      assert.ok(['MECCAN', 'MEDINAN'].includes(surahs[i].revelation), `Tipe wahyu surah ${i + 1} harus MECCAN atau MEDINAN`);
    }
  });

  test('Setiap file surah (1 s.d. 114) harus memiliki jumlah ayat yang tepat sesuai metadata', () => {
    const rawData = fs.readFileSync(surahListPath, 'utf-8');
    const surahs = JSON.parse(rawData);
    let totalAyahSemuaSurah = 0;

    for (const meta of surahs) {
      const filePath = path.join(SURAHS_DIR, `${meta.number}.json`);
      assert.equal(fs.existsSync(filePath), true, `File ${meta.number}.json harus ada di public/data/surahs/`);

      const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Validasi metadata di dalam file per-surah
      assert.equal(fileContent.number, meta.number, `Nomor surah di ${meta.number}.json tidak cocok`);
      assert.equal(fileContent.totalAyah, meta.totalAyah, `totalAyah di ${meta.number}.json tidak cocok dengan metadata`);
      assert.equal(Array.isArray(fileContent.ayahs), true, `ayahs di ${meta.number}.json harus berupa array`);
      assert.equal(fileContent.ayahs.length, meta.totalAyah, `Jumlah ayat di ${meta.number}.json (${fileContent.ayahs.length}) tidak sama dengan totalAyah (${meta.totalAyah})`);

      // Validasi setiap ayat
      fileContent.ayahs.forEach((ayah, index) => {
        const expectedAyahNum = index + 1;
        assert.equal(ayah.number, expectedAyahNum, `Nomor ayat harus berurutan (${expectedAyahNum}) pada surah ${meta.number}`);
        assert.ok(ayah.text && ayah.text.trim().length > 0, `Teks Arab ayat ${ayah.number} di surah ${meta.number} tidak boleh kosong`);
        assert.ok(ayah.translation && ayah.translation.trim().length > 0, `Terjemahan ayat ${ayah.number} di surah ${meta.number} tidak boleh kosong`);
        assert.ok(ayah.audioUrl && ayah.audioUrl.startsWith('https://everyayah.com/data/'), `URL audio ayat ${ayah.number} di surah ${meta.number} tidak valid`);
      });

      totalAyahSemuaSurah += fileContent.ayahs.length;
    }

    // Validasi Total 6.236 Ayat Al-Qur'an
    assert.equal(
      totalAyahSemuaSurah,
      6236,
      `Total seluruh ayat Al-Qur'an harus tepat 6.236 ayat! Ditemukan: ${totalAyahSemuaSurah}`
    );
  });
});

