import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../public/data');
const SURAHS_DIR = path.resolve(DATA_DIR, 'surahs');

// Daftar arti nama 114 surah dalam Bahasa Indonesia standar Kemenag
const SURAH_MEANINGS = {
  1: "Pembukaan", 2: "Sapi Betina", 3: "Keluarga Imran", 4: "Wanita",
  5: "Jamuan Hidangan", 6: "Binatang Ternak", 7: "Tempat Tertinggi", 8: "Rampasan Perang",
  9: "Pengampunan", 10: "Yunus", 11: "Hud", 12: "Yusuf",
  13: "Guruh", 14: "Ibrahim", 15: "Bukit Al-Hijr", 16: "Lebah",
  17: "Perjalanan Malam", 18: "Gua", 19: "Maryam", 20: "Taha",
  21: "Para Nabi", 22: "Haji", 23: "Orang-Orang Mukmin", 24: "Cahaya",
  25: "Pembeda", 26: "Penyair", 27: "Semut", 28: "Kisah-Kisah",
  29: "Laba-Laba", 30: "Bangsa Romawi", 31: "Luqman", 32: "Sujud",
  33: "Golongan yang Bersekutu", 34: "Saba'", 35: "Pencipta", 36: "Yasin",
  37: "Barisan-Barisan", 38: "Shad", 39: "Rombongan", 40: "Maha Pengampun",
  41: "Dijelaskan", 42: "Musyawarah", 43: "Perhiasan", 44: "Kabut",
  45: "Berlutut", 46: "Bukit Pasir", 47: "Muhammad", 48: "Kemenangan",
  49: "Kamar-Kamar", 50: "Qaf", 51: "Angin yang Menerbangkan", 52: "Bukit Tursina",
  53: "Bintang", 54: "Bulan", 55: "Maha Pengasih", 56: "Hari Kiamat",
  57: "Besi", 58: "Gugatan", 59: "Pengusiran", 60: "Wanita yang Diuji",
  61: "Barisan", 62: "Hari Jumat", 63: "Orang-Orang Munafik", 64: "Hari Ditampakkan Kesalahan",
  65: "Talak", 66: "Pengharaman", 67: "Kerajaan", 68: "Pena",
  69: "Hari Kiamat", 70: "Tempat-Tempat Naik", 71: "Nuh", 72: "Jin",
  73: "Orang yang Berselimut", 74: "Orang yang Berkemul", 75: "Hari Kebangkitan", 76: "Manusia",
  77: "Malaikat yang Diutus", 78: "Berita Besar", 79: "Malaikat yang Mencabut", 80: "Bermuka Masam",
  81: "Menggulung", 82: "Terbelah", 83: "Orang-Orang Curang", 84: "Terbelah",
  85: "Gugusan Bintang", 86: "Yang Datang di Malam Hari", 87: "Maha Tinggi", 88: "Hari Pembalasan",
  89: "Fajar", 90: "Negeri", 91: "Matahari", 92: "Malam",
  93: "Waktu Duha", 94: "Kelapangan", 95: "Buah Tin", 96: "Segumpal Darah",
  97: "Kemuliaan", 98: "Bukti Nyata", 99: "Guncangan", 100: "Kuda Perang",
  101: "Hari Kiamat", 102: "Bermegah-Megahan", 103: "Masa", 104: "Pengumpat",
  105: "Gajah", 106: "Suku Quraisy", 107: "Barang-Barang Berguna", 108: "Nikmat yang Banyak",
  109: "Orang-Orang Kafir", 110: "Pertolongan", 111: "Gejolak Api", 112: "Keesaan Allah",
  113: "Waktu Subuh", 114: "Manusia"
};

async function main() {
  console.log("Memulai persiapan dataset Al-Qur'an (Tanzil Uthmani + Kemenag RI)...");

  if (!fs.existsSync(SURAHS_DIR)) {
    fs.mkdirSync(SURAHS_DIR, { recursive: true });
  }

  // 1. Fetch metadata surah
  console.log("Mengambil metadata 114 surah...");
  const metaRes = await fetch("https://api.alquran.cloud/v1/surah");
  if (!metaRes.ok) throw new Error(`Gagal fetch surah list: ${metaRes.statusText}`);
  const metaJson = await metaRes.json();
  const rawSurahs = metaJson.data;

  // 2. Fetch full Quran text Uthmani dan Terjemahan Indonesia
  console.log("Mengambil teks Uthmani lengkap (Tanzil)...");
  const uthmaniRes = await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
  if (!uthmaniRes.ok) throw new Error(`Gagal fetch Uthmani text: ${uthmaniRes.statusText}`);
  const uthmaniJson = await uthmaniRes.json();
  const uthmaniSurahs = uthmaniJson.data.surahs;

  console.log("Mengambil terjemahan Indonesia lengkap (Kemenag RI)...");
  const indoRes = await fetch("https://api.alquran.cloud/v1/quran/id.indonesian");
  if (!indoRes.ok) throw new Error(`Gagal fetch Indonesian translation: ${indoRes.statusText}`);
  const indoJson = await indoRes.json();
  const indoSurahs = indoJson.data.surahs;

  // 3. Olah dan simpan metadata 114 surah
  const surahList = rawSurahs.map((s) => ({
    number: s.number,
    name: s.englishName,
    arabicName: s.name,
    meaning: SURAH_MEANINGS[s.number] || s.englishNameTranslation,
    revelation: s.revelationType.toUpperCase(),
    totalAyah: s.numberOfAyahs,
  }));

  fs.writeFileSync(
    path.join(DATA_DIR, "surah-list.json"),
    JSON.stringify(surahList, null, 2),
    "utf-8"
  );
  console.log("✓ Berhasil membuat public/data/surah-list.json");

  // 4. Olah dan simpan file JSON per surah (1.json s.d. 114.json)
  let totalAyahCount = 0;

  for (let i = 0; i < 114; i++) {
    const meta = surahList[i];
    const uSurah = uthmaniSurahs[i];
    const iSurah = indoSurahs[i];

    if (uSurah.ayahs.length !== meta.totalAyah || iSurah.ayahs.length !== meta.totalAyah) {
      throw new Error(`Inkonsistensi jumlah ayat pada Surah ${meta.number} (${meta.name})!`);
    }

    const ayahs = uSurah.ayahs.map((aya, idx) => {
      const ayahNum = aya.numberInSurah;
      const sNum = String(meta.number).padStart(3, "0");
      const aNum = String(ayahNum).padStart(3, "0");
      const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sNum}${aNum}.mp3`;

      return {
        number: ayahNum,
        text: aya.text,
        translation: iSurah.ayahs[idx].text,
        audioUrl: audioUrl,
      };
    });

    totalAyahCount += ayahs.length;

    const surahData = {
      number: meta.number,
      name: meta.name,
      arabicName: meta.arabicName,
      meaning: meta.meaning,
      revelation: meta.revelation,
      totalAyah: meta.totalAyah,
      bismillahPre: meta.number !== 1 && meta.number !== 9, // At-Taubah tidak pakai bismillah, Al-Fatihah bismillah ayat 1
      ayahs: ayahs,
    };

    fs.writeFileSync(
      path.join(SURAHS_DIR, `${meta.number}.json`),
      JSON.stringify(surahData, null, 2),
      "utf-8"
    );
  }

  console.log(`✓ Selesai memproses 114 surah.`);
  console.log(`✓ Total seluruh ayat Al-Qur'an: ${totalAyahCount} ayat.`);

  if (totalAyahCount === 6236) {
    console.log("✓ VALIDASI SUKSES: Total 6.236 ayat sesuai standar Mushaf Madinah & Kemenag!");
  } else {
    throw new Error(`Total ayat ${totalAyahCount} tidak sesuai dengan 6.236!`);
  }
}

main().catch((err) => {
  console.error("Gagal mempersiapkan data:", err);
  process.exit(1);
});

