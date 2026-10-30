# 🕌 Modern Quran App — Design Specification

> **Sumber:** Stitch project `projects/561699491349587191` ("Modern Quran App")
> **Tema desain:** Emerald & Gold Minimalism — "Sacred Serenity"
> **Mode warna:** Light (default) · Dark (supported)
> **Device target:** Mobile (390 × auto)

---

## 1. Palet Warna

### Warna Utama (Brand Override)

| Peran | Hex | Keterangan |
|---|---|---|
| **Primary** | `#003527` | Teks heading, ikon utama, elemen dominan |
| **Primary Container** | `#064E3B` | Latar hero card, header surah, audio disc, CTA besar |
| **On Primary Container** | `#80BEA6` | Teks sekunder di atas primary-container |
| **On Primary** | `#FFFFFF` | Teks putih di atas elemen primary |
| **Accent Gold** | `#D4AF37` | Gold rim (border 1 px), ornamen, highlight aksen |
| **Secondary** | `#735C00` | Ikon aksi (bookmark, play), progress bar, toggle aktif |
| **Secondary Container** | `#FED65B` | Tombol "Continue Reading", chip "Full Surah", badge emas |
| **On Secondary Container** | `#745C00` | Teks di atas secondary-container |

### Warna Permukaan & Netral

| Peran | Hex | Keterangan |
|---|---|---|
| **Background** | `#FCF9F8` | Canvas utama seluruh halaman |
| **Surface** | `#FCF9F8` | Area konten utama |
| **Surface Container Lowest** | `#FFFFFF` | Card putih, input field |
| **Surface Container Low** | `#F6F3F2` | Hover state list item |
| **Surface Container** | `#F0EDED` | Badge netral, progress bar background |
| **Surface Container High** | `#EAE7E7` | Divider tebal |
| **Surface Container Highest** | `#E5E2E1` | Toggle track, range slider track |
| **Surface Variant** | `#E5E2E1` | Border card, separator ayat |
| **Surface Tint** | `#2B6954` | Teks label di atas permukaan terang |

### Warna Teks

| Peran | Hex | Keterangan |
|---|---|---|
| **On Surface** | `#1C1B1B` | Body text, judul utama |
| **On Surface Variant** | `#404944` | Teks deskripsi, subtitle |
| **On Background** | `#1C1B1B` | Teks umum |
| **Outline** | `#707974` | Ikon nonaktif, placeholder |
| **Outline Variant** | `#BFC9C3` | Border ringan, verse number border |

### Warna Tertier & Aksen Khusus

| Peran | Hex | Keterangan |
|---|---|---|
| **Tertiary Fixed** | `#E5E2DB` | Chip/tag nonaktif (background parchment) |
| **Tertiary Fixed Dim** | `#C9C6BF` | Hover state chip |
| **Primary Fixed** | `#B0F0D6` | Badge nomor surah (lingkaran hijau muda) |
| **Primary Fixed Dim** | `#95D3BA` | Inverse primary |
| **Secondary Fixed** | `#FFE088` | Label emas terang |
| **Error** | `#BA1A1A` | Ikon & teks error, tombol "Remove" |
| **Error Container** | `#FFDAD6` | Background pesan error |

---

## 2. Tipografi

### Font Latin

| Token | Font Family | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `headline-lg` | **Noto Serif** | 32 px | 600 (SemiBold) | 40 px | — |
| `headline-md` | **Noto Serif** | 24 px | 500 (Medium) | 32 px | — |
| `body-lg` | **Inter** | 18 px | 400 (Regular) | 28 px | — |
| `body-md` | **Inter** | 16 px | 400 (Regular) | 24 px | — |
| `label-sm` | **Inter** | 12 px | 600 (SemiBold) | 16 px | 0.05 em |

### Font Arab

| Token | Font Family | Size | Weight | Line Height |
|---|---|---|---|---|
| `arabic-display` | **Amiri** | 40 px | 700 (Bold) | 56 px |

> [!TIP]
> Teks Arab di-render 20% lebih besar dari padanan Latin-nya agar diakritik (harakat) tetap terbaca. Gunakan `line-height: 1.4` minimum untuk ayat panjang.

### Penggunaan di UI

- **App bar title:** Serif manual (`font-serif`, 20 px, bold) — dipakai konsisten di semua screen
- **Bottom nav label:** Serif manual (`font-serif`, 10 px, medium, `tracking-tighter`)
- **Verse number badge:** `label-sm` (12 px, 600) atau `headline-md` di ukuran kecil
- **Nama surah (Latin):** `headline-md` @18 px (override size kecil)
- **Nama surah (Arab):** `arabic-display` @24 px (override size kecil pada daftar)

---

## 3. Spacing, Radius, Shadow & Pola

### Spacing (skala 8 px)

| Token | Nilai | Penggunaan |
|---|---|---|
| `container-margin` | 24 px | Padding horizontal halaman |
| `section-padding` | 32 px | Jarak antar section besar (vertikal) |
| `inner-padding` | 20 px | Padding dalam card |
| `stack-gap` | 16 px | Jarak antar item dalam daftar |

### Border Radius

| Token | Nilai | Penggunaan |
|---|---|---|
| `sm` | 8 px (0.5 rem) | Elemen kecil |
| `DEFAULT` | 16 px (1 rem) | Card umum, verse card, settings card |
| `md` | 24 px (1.5 rem) | — |
| `lg` | 32 px (2 rem) | Hero card, surah header, large container |
| `xl` | 48 px (3 rem) | — |
| `full` | 9999 px | Tombol pill, chip, bottom nav tab aktif |
| Bottom nav top | 32 px | `rounded-t-[32px]` khusus bottom bar |

### Shadow

| Nama | Nilai CSS | Penggunaan |
|---|---|---|
| **Soft Emerald** | `0 10px 30px -5px rgba(6, 78, 59, 0.06)` | Card surah list, hero card |
| **Card Ambient** | `0 8px 30px rgba(6, 78, 59, 0.04)` | Bookmark card, settings card |
| **Header Deep** | `0 20px 40px rgba(6, 78, 59, 0.15)` | Surah detail header |
| **Verse Active** | `0 15px 30px rgba(6, 78, 59, 0.06)` | Verse card yang aktif/highlighted |
| **Verse Default** | `0 4px 20px rgba(0, 0, 0, 0.02)` | Verse card biasa |
| **Album Art** | `0 20px 50px -12px rgba(6, 78, 59, 0.25)` | Disc audio player |
| **Bottom Nav** | `0 -8px 30px rgba(6, 78, 59, 0.08)` | Bottom navigation |
| **Top App Bar** | `shadow-sm shadow-emerald-900/5` | Sticky header |

### Pola Dekoratif

| Pola | Opacity | Penggunaan |
|---|---|---|
| **Sacred Pattern** (radial-gradient dots) | 3% | Overlay di hero card (Home) |
| **Islamic Pattern** (SVG star/geometric) | 3% | Background halaman (Bookmarks, Settings) |
| **Geometric Pattern** (SVG 8-pointed star) | 3% | Background Audio Player |

---

## 4. Gaya Komponen

### 📦 Card (Kartu)

#### Surah List Card (Home)
- Background: `#FFFFFF`
- Padding: `inner-padding` (20 px)
- Border: `1px solid #D4AF37` (gold-rim)
- Radius: `DEFAULT` (16 px)
- Shadow: Soft Emerald
- Layout: `flex items-center justify-between`
- Hover: `bg-emerald-50/30`
- Konten kiri: nomor surah (star icon overlay) + nama Latin + subtitle
- Konten kanan: nama Arab + label Meccan/Medinan

#### Verse Card (Surah Detail)
- Background: `#FFFFFF`
- Padding: `inner-padding` (20 px)
- Border default: `1px solid surface-variant`
- Border aktif: `1px solid secondary/30` + `ring-1 ring-secondary/10`
- Radius: `DEFAULT` (16 px)
- Shadow default: `0 4px 20px rgba(0,0,0,0.02)`
- Shadow aktif: `0 15px 30px rgba(6,78,59,0.06)`
- Layout: column — verse number bar → teks Arab (RTL) → separator → terjemahan
- Hover: `border-secondary/20`

#### Bookmark Card
- Background: `#FFFFFF`
- Padding: `inner-padding` (20 px)
- Border: `1px solid #D4AF37` opacity 30%
- Radius: `DEFAULT` (16 px)
- Shadow: Card Ambient
- Ikon bookmark (filled, gold) di sudut kanan atas
- Footer: separator + tombol Listen & Remove

#### Featured Bookmark Card (lebar penuh)
- Background: `primary-container` (`#064E3B`)
- Teks: putih
- Border: `1px solid #D4AF37` opacity 20%
- Shadow: `shadow-xl`
- Ikon dekoratif besar (opacity 10%) di kanan bawah

#### Settings Section Card
- Background: `surface-container-lowest` (`#FFFFFF`)
- Border: gold-rim (`1px solid #D4AF37`)
- Radius: `DEFAULT` (16 px)
- Shadow: Card Ambient
- Section header: label uppercase dengan border-bottom
- List item: `divide-y divide-surface-variant/30`
- Hover item: `bg-surface-container-low`

### 🔘 Tombol (Button)

| Varian | Background | Teks | Border | Shape |
|---|---|---|---|---|
| **Primary Filled** | `#003527` | `#FFFFFF` | — | Pill (`rounded-full`) |
| **Secondary Filled** | `#FED65B` | `#745C00` | — | Pill |
| **Outline Gold** | transparent | `#D4AF37` | `1px solid #D4AF37` | Pill |
| **CTA White** | `#FFFFFF` | `#003527` | — | Pill, `shadow-lg` |
| **Ghost/Icon** | transparent | inherit | — | Circle (`rounded-full`), 8 px padding |
| **Destructive** | — | `#BA1A1A` | — | Text button |

- Ukuran pill: `px-6 py-2.5` (standar), `px-8 py-3` (besar), `px-5 py-2` (chip)
- Transisi: `hover:brightness-110`, `scale-95 active:scale-90`
- Tombol play besar (Audio): `w-20 h-20`, shadow, `bg-primary-container`

### 🏷️ Chip / Tab

| Varian | Background | Teks | Border | Shape |
|---|---|---|---|---|
| **Active** | `primary` (`#003527`) | `on-primary` (putih) | — | Pill |
| **Inactive** | `#FFFFFF` | `surface-tint` (`#2B6954`) | `1px solid amber-100` | Pill |
| **Filter Active** | `primary` | `on-primary` | — | Pill + `shadow-md` |
| **Filter Inactive** | `tertiary-fixed` | `primary` | — | Pill |
| **Speed / Action** | `tertiary-fixed` | `primary` | `1px solid secondary/10` | Pill |

- Label: `label-sm` (12 px, 600, uppercase)
- Spacing: `px-5 py-2` atau `px-6 py-2`

### 📱 Bottom Navigation

- Container: `fixed bottom-0`, `rounded-t-[32px]`
- Background: `white/80` + `backdrop-blur-xl`
- Border top: `1px solid amber-100/40`
- Shadow: `0 -8px 30px rgba(6, 78, 59, 0.08)`
- Padding: `px-4 pb-8 pt-4` (safe area bottom)
- 4 item: Home, Bookmark, Audio, Settings
- **Tab aktif:** `bg-emerald-900 text-white rounded-full px-5 py-1.5 translate-y-[-2px]`
- **Tab nonaktif:** `text-emerald-800/50`, hover: `text-emerald-900`
- Label: serif, 10 px, medium, `tracking-tighter`
- Icon: Material Symbols Outlined; filled (`FILL 1`) saat aktif

### 🔝 Top App Bar

- `sticky top-0 z-50`
- Background: `white/90` + `backdrop-blur-md`
- Border bottom: `1px solid amber-100/50`
- Shadow: `shadow-sm shadow-emerald-900/5`
- Padding: `px-6 py-4`
- Title center: serif, 20 px, bold, `text-emerald-900`
- Tombol kiri/kanan: icon button, `p-2 rounded-full`

### 📝 Input / Search

- Background: `#FFFFFF`
- Border: none (borderless)
- Radius: `full` (pill)
- Padding: `py-4 pl-12 pr-6`
- Shadow: Soft Emerald
- Focus ring: `ring-2 ring-secondary/20`
- Placeholder: `text-outline-variant`
- Icon search di kiri (absolute positioned)

### 🔢 Verse Number Badge

| Konteks | Style |
|---|---|
| Surah list | Star icon (opacity 20%) dengan nomor absolute di tengah |
| Surah detail (aktif) | `w-10 h-10 rounded-full border-2 border-secondary bg-secondary-container/10 text-secondary` |
| Surah detail (biasa) | `w-10 h-10 rounded-full border border-outline-variant text-outline` |
| Bookmark | `w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed` |

### 🎵 Audio Player

- Disc: circular (`rounded-full`), border 4 px `secondary-container/30`, gold rim inner
- Background disc: `primary-container` dengan Islamic art overlay (mix-blend-overlay, 60%)
- Controls: skip previous/next (fill), play/pause (80×80 circle, `primary-container`)
- Progress bar: `h-1.5 bg-surface-container` track, `bg-secondary` fill
- Timestamp: `label-sm text-outline`

### 🔀 Toggle Switch (Settings)

- Track: `w-12 h-6 bg-surface-container-highest rounded-full`
- Thumb: `w-5 h-5 bg-white rounded-full`
- Active: track `bg-secondary`

---

## 5. Komponen yang Dipakai Ulang Antar Screen

| Komponen | Screen yang Menggunakan |
|---|---|
| **Top App Bar** | Home, Surah Detail, Audio Player, Bookmarks, Settings |
| **Bottom Navigation** | Home, Surah Detail, Audio Player, Bookmarks, Settings |
| **Gold-Rimmed Card** | Home (surah list), Bookmarks (verse card), Settings (section card) |
| **Primary Container Hero** | Home (last read), Surah Detail (header), Bookmarks (featured), Settings (premium CTA) |
| **Pill Button** | Home (Continue Reading), Surah Detail (—), Bookmarks (Read Now/Details), Settings (Upgrade) |
| **Chip / Filter Tab** | Home (Surah/Juz/Bookmark/Page), Bookmarks (All/Surahs/Ayats/Last Read) |
| **Verse Number Badge** | Home (surah list), Surah Detail (per ayat), Bookmarks (per card) |
| **Icon Button (Ghost)** | Semua screen (top bar, verse actions) |
| **Islamic/Sacred Pattern** | Home (hero), Surah Detail (header), Audio Player (background), Bookmarks (body), Settings (body) |
| **Material Symbols Outlined** | Semua screen — icon set konsisten |
| **Action Button Row (play, bookmark, share)** | Surah Detail (verse card), Bookmarks (card footer) |
| **Label Uppercase** | Semua screen (section header, status, chip) |

---

## 6. Deskripsi Singkat Tiap Screen

### 🏠 Home
Halaman utama menampilkan sapaan pengguna, **hero card "Last Read"** (latar emerald gelap dengan pola islami, gambar kaligrafi, dan tombol "Continue Reading"), **search bar** berbentuk pill, **tab filter** (Surah/Juz/Bookmark/Page), dan **daftar surah** dalam bentuk gold-rimmed card yang menampilkan nomor, nama Latin, nama Arab, jumlah ayat, dan asal (Meccan/Medinan).

### 📖 Surah Detail
Menampilkan **header surah** berlatar emerald dengan info surah (nomor, nama, asal, jumlah ayat) dan ornamen emas dekoratif. Di bawahnya terdapat **Bismillah** dalam font Arab besar beserta terjemahan, diikuti **daftar ayat** dalam card terpisah — masing-masing berisi nomor ayat, teks Arab (RTL, font Amiri 36–40 px), terjemahan Indonesia, serta tombol aksi (play, bookmark, share). Ayat aktif diberi highlight border emas dan shadow lebih kuat.

### 🎧 Audio Player
Layar pemutar audio full-screen dengan **disc art** bundar besar (Islamic art overlay dalam lingkaran emas), informasi surah dan qari, **progress bar** emas tipis dengan timestamp, dan **kontrol playback** (shuffle, skip prev, play/pause 80 px, skip next, repeat). Di bawah kontrol ada chip kecepatan (1.0×) dan "Up Next". Background menggunakan geometric pattern + elemen blur dekoratif.

### 🔖 Bookmarks
Koleksi ayat dan surah tersimpan. Diawali **header "Saved Verses"** dengan deskripsi, **filter chip** (All Bookmarks/Surahs/Ayats/Last Read), dan **grid kartu**. Kartu ayat menampilkan nomor surah, nama, teks Arab, terjemahan dengan border-left emas, serta tombol Listen dan Remove. Terdapat juga **featured card** lebar penuh (emerald gelap) untuk surah tersimpan lengkap (Al-Kahf) dengan tombol "Read Now" dan "Details".

### ⚙️ Settings
Halaman pengaturan dengan card-card yang dikelompokkan: **Appearance** (toggle dark mode, slider font size), **Preferences** (pilih bahasa, pilih qari default — navigasi chevron), **Premium upsell** (card emerald gelap dengan tombol "Upgrade Now"), dan **Help** (Help & Feedback, About). Setiap item settings menggunakan ikon di dalam lingkaran `primary-fixed` dan layout list dengan divider halus.

---

## 7. Sumber Referensi

| Screen | Stitch Screen ID | HTML File ID |
|---|---|---|
| Home | `ceb25023ac234ae2aa4c1ab24f16a2e4` | `41d0e943bf1e43799704290afe491999` |
| Surah Detail | `f5c8c4e4bbaf46e08b6ad63ca1da4c44` | `d066d6d7aa694d16a81e91f907626c7e` |
| Audio Player | `b820fd0da77f411ca975cd2208de6d89` | `a765d5d6dcad40b29bce33e3e6e22452` |
| Bookmarks | `1a60559ae6214803bf960068a34cdc71` | `d5808af18ab04eeca3c555659adfe508` |
| Settings | `44d342bad31c4998a8933b130271a437` | `13dafcb0c4f14b8f8a8a969a8b715f05` |

