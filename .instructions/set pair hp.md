# Cara Pair HP Android via Wireless Debugging

## Prasyarat
- HP dan Laptop harus **terhubung ke WiFi yang sama**
- **Developer Options** sudah aktif di HP
- ADB path: `C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe`

---

## Langkah di HP Android

1. Buka **Settings → Additional Settings → Developer Options**
2. Aktifkan **Wireless debugging**
3. Aktifkan juga:
   - ✅ **Install via USB**
   - ✅ **USB Debugging (Security settings)**
4. Ketuk **Wireless debugging** → ketuk **Pair device with pairing code**
5. Catat:
   - **IP:Port** (untuk pairing, contoh: `192.168.1.5:37123`)
   - **Pairing Code** (6 digit, contoh: `807830`)

> ⚠️ **Xiaomi/MIUI**: Kedua setting di langkah 3 **wajib** aktif. Harus login Mi Account terlebih dahulu.

---

## Langkah di Terminal (PowerShell)

### Step 1 — Pair

Ganti `IP:PORT` dan `CODE` sesuai yang tampil di HP:

```powershell
C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe pair IP:PORT CODE
```

**Contoh:**
```powershell
C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe pair 192.168.1.5:37123 807830
```

Jika berhasil, akan muncul:
```
Successfully paired to 192.168.1.5:37123
```

### Step 2 — Connect

Gunakan **IP:Port dari halaman Wireless debugging** (bukan dari pairing — portnya berbeda):

```powershell
C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe connect IP:PORT
```

**Contoh:**
```powershell
C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe connect 192.168.1.5:43567
```

### Step 3 — Verifikasi

```powershell
C:\Users\admin\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
```

Pastikan HP muncul di daftar device.

### Step 4 — Jalankan Aplikasi

```powershell
flutter run
```

---

## Troubleshooting

| Error | Solusi |
|---|---|
| `INSTALL_FAILED_USER_RESTRICTED` | Aktifkan **Install via USB** & **USB Debugging (Security settings)** di Developer Options |
| `error: protocol fault` | Cek IP:Port sudah benar, pastikan WiFi sama |
| `unable to connect` | Pastikan **Wireless debugging** masih aktif (auto-off jika layar mati) |
| HP minta izin install | Ketuk **Allow/Install** di layar HP saat proses install |

---

## Alternatif: Install APK Manual

Jika wireless debugging tetap gagal, build APK lalu transfer ke HP:

```powershell
flutter build apk --release
```

File APK ada di:
```
build\app\outputs\flutter-apk\app-release.apk
```

Transfer via WhatsApp/Telegram/Google Drive, lalu install manual dari HP.