/**
 * Central Application Configuration
 * Nama dan konfigurasi aplikasi disimpan di sini dan dipakai di seluruh aplikasi.
 */

export const RECITERS = [
  {
    id: "mishary_alafasy",
    name: "Syaikh Mishary Rashid Alafasy",
    shortName: "Mishary Alafasy",
    verseBaseUrl: "https://everyayah.com/data/Alafasy_128kbps",
    getUrl: (num) => `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${num}.mp3`,
  },
  {
    id: "abdul_basit",
    name: "Syaikh Abdul Basit Abdul Samad",
    shortName: "Abdul Basit",
    verseBaseUrl: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps",
    getUrl: (num) => `https://download.quranicaudio.com/qdc/abdul_baset/murattal/${num}.mp3`,
  },
  {
    id: "khalil_al_husary",
    name: "Syaikh Mahmoud Khalil Al-Husary",
    shortName: "Al-Husary",
    verseBaseUrl: "https://everyayah.com/data/Husary_128kbps",
    getUrl: (num) => `https://download.quranicaudio.com/qdc/khalil_al_husary/murattal/${num}.mp3`,
  },
  {
    id: "saad_al_ghamdi",
    name: "Syaikh Saad Al-Ghamdi",
    shortName: "Saad Al-Ghamdi",
    verseBaseUrl: "https://everyayah.com/data/Ghamadi_40kbps",
    getUrl: (num) => `https://server7.mp3quran.net/s_gmd/${String(num).padStart(3, '0')}.mp3`,
  },
];

export const APP_CONFIG = {
  name: "QuranKu",
  shortName: "QuranKu",
  tagline: "Sacred Serenity in Every Verse",
  version: "1.0.0",
  description: "Aplikasi Al-Qur'an digital modern, bersih, dan menenangkan.",

  // Audio Streaming Endpoints
  audio: {
    reciterId: "mishary_alafasy",
    reciterName: "Mishary Rashid Alafasy",
    verseBaseUrl: "https://everyayah.com/data/Alafasy_128kbps",
    chapterBaseUrl: "https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal",
    formatVerseFilename: (surah, ayah) => {
      const s = String(surah).padStart(3, "0");
      const a = String(ayah).padStart(3, "0");
      return `${s}${a}.mp3`;
    }
  },

  // Fallback API jika file statis gagal dimuat
  fallbackApi: {
    baseUrl: "https://api.alquran.cloud/v1"
  },

  // Atribusi Resmi
  attributions: [
    {
      title: "Teks Arab Al-Qur'an (Rasm Uthmani)",
      source: "Tanzil Project (Medina Mushaf Standard)",
      license: "Creative Commons Attribution 3.0 (CC BY 3.0)",
      notice: "Copyright © 2007-2024 Tanzil Project. Teks Al-Qur'an disajikan secara verbatim tanpa modifikasi.",
      url: "https://tanzil.net"
    },
    {
      title: "Terjemahan Bahasa Indonesia",
      source: "Kementerian Agama Republik Indonesia (Kemenag RI) via Tanzil Translations Repository",
      license: "Teks Keagamaan Resmi Kemenag RI / Tanzil Repository",
      notice: "Hak Cipta Terjemahan Kementerian Agama Republik Indonesia.",
      url: "https://tanzil.net/trans/"
    },
    {
      title: "Audio Murottal (Ayat per Ayat)",
      source: "EveryAyah.com Audio Archive",
      reciter: "Syaikh Mishary Rashid Alafasy dkk.",
      license: "Non-commercial Islamic Educational Archive",
      url: "https://everyayah.com"
    },
    {
      title: "Audio Murottal (Surah Penuh)",
      source: "Quranicaudio CDN",
      reciter: "Syaikh Mishary Rashid Alafasy dkk.",
      license: "Public Educational Distribution",
      url: "https://quranicaudio.com"
    },
    {
      title: "Fallback Data API",
      source: "Al-Quran Cloud (Islamic Network)",
      license: "Free Community API",
      url: "https://alquran.cloud"
    }
  ],

  // Default App Settings
  defaults: {
    fontSize: 24,
    minFontSize: 16,
    maxFontSize: 40,
    language: "id",
    darkMode: false,
    reciterId: "mishary_alafasy"
  }
};
