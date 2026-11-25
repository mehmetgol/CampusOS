# AGENTS.md — CampusOS

Bu dosya, CampusOS üzerinde çalışan yapay zekâ kodlama ajanları (ve yeni geliştiriciler) için projenin nasıl çalıştığını, kurallarını ve dikkat edilmesi gerekenleri anlatır.

## Proje özeti

CampusOS; öğrenci, ders, ders kaydı ve not/AGNO yönetimi yapan full-stack bir öğrenci yönetim sistemidir.

- **Backend:** C# / .NET 10, ASP.NET Core **Minimal API** (`Program.cs`), Entity Framework Core, SQL Server 2022 (Docker), JWT kimlik doğrulama
- **Frontend:** React 19 + Vite + Tailwind CSS v4 (`frontend/`)
- **Dil:** Kod içindeki isimler (sınıf, değişken, endpoint, UI metinleri) **Türkçe**dir. Yeni kod da Türkçe isimlendirme kullanmalı (`Ogrenci`, `Ders`, `Kayit`, `notGuncelle`, `hedefHesapla` …). Dosya adları ve tanımlayıcılarda Türkçe karakter kullanılmaz (`Öğrenci` değil `Ogrenci`); UI metinlerinde Türkçe karakter kullanılır.

## Dizin yapısı

```text
CampusOS/
├── Program.cs              # Tüm DI kayıtları + tüm endpointler (Minimal API)
├── Data/CampusOSDbContext.cs  # DbSet'ler, indeksler, ilişkiler
├── Models/                 # Entity'ler ve request/response DTO'ları
├── Service/                # İş mantığı (OgrenciService, DersService, KayitService, AuthService, AgnoService)
├── Migrations/             # EF Core migration'ları (elle düzenlenmez, dotnet ef ile üretilir)
└── frontend/
    └── src/
        ├── App.jsx         # Oturum, global state, CRUD fonksiyonları, sayfa yönlendirme
        ├── components/     # Sidebar, Topbar
        ├── pages/          # Dashboard, Ogrenciler, Dersler, Kayitlar, Agno, Login, Register
        └── utils/agno.js   # AGNO / hedef hesaplama saf fonksiyonları
```

## Çalıştırma

```bash
# 1) SQL Server (Docker Desktop açık olmalı) container'ını başlat

# 2) Backend  -> http://localhost:5070  (Swagger: /swagger, sadece Development)
dotnet run

# 3) Frontend -> http://localhost:5173
cd frontend
npm install
npm run dev
npm run lint      # oxlint
npm run build
```

### Gizli ayarlar

`ConnectionStrings:DefaultConnection` ve `Jwt:Key` **.NET User Secrets** ile tutulur. Bunları asla `appsettings.json`'a veya repoya yazma:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<bağlantı cümlesi>"
dotnet user-secrets set "Jwt:Key" "<en az 32 karakterlik anahtar>"
```

`appsettings.Development.json` `.gitignore`'dadır.

### Migration

Model değiştiğinde migration'ı **elle yazma**, üret:

```bash
dotnet ef migrations add <AnlamliIsim>
dotnet ef database update
```

## Mimari kurallar

### Backend

- Endpointler `Program.cs` içinde, bölüm başlıklarıyla (`// ===== ... =====`) gruplanmış halde durur. Yeni endpoint eklerken ilgili bölüme koy ve aynı yorum stilini kullan.
- İş mantığı `Service/` içindeki sınıflarda; endpointler doğrulama + servis çağrısı + `Results.*` dönüşünden ibaret olmalı. Servisler `AddScoped` ile kaydedilir.
- Doğrulama hataları `Results.BadRequest("Türkçe mesaj")`, bulunamayanlar `Results.NotFound("Türkçe mesaj")` döner. Frontend bu metni `response.text()` ile kullanıcıya gösterir.
- **Yetkilendirme backend'de zorunludur**, frontend'deki kontroller sadece UX içindir:
  - Okuma: `.RequireAuthorization()`
  - Yazma/silme: `.RequireAuthorization(policy => policy.RequireRole("Admin"))`
- Roller: `"Admin"` ve `"Ogrenci"`. Kayıt olan herkes `Ogrenci` rolüyle başlar; Admin yapmak için veritabanında `Rol` güncellenir.
- Giriş yapan kullanıcının Id'si JWT'deki `ClaimTypes.NameIdentifier` claim'inden okunur. Token 2 saat geçerlidir; token içindeki bilgiye (ör. bağlı öğrenci) güvenmek yerine güncel değeri DB'den oku.
- Benzersizlik kuralları DB seviyesinde indekslerle korunur (`DersKodu`, `Email`, `(OgrenciId, DersId)`, `Kullanici.OgrenciId`). Yeni kural eklerken hem servis kontrolü hem indeks ekle.

### Frontend

- Tek API adresi: `App.jsx` içindeki `API_URL` (`http://localhost:5070`). Yeni sayfaya prop olarak geçir, yeniden tanımlama.
- Token ve kullanıcı `localStorage`'da (`token`, `kullanici`). 401 → `cikisYap()`, 403 → "yetkiniz yok" mesajı. Bu kalıbı yeni isteklerde de uygula.
- Router yok; sayfa geçişi `App.jsx`'teki `sayfa` state'i ve `Sidebar`'daki `menu` dizisiyle yapılır. Yeni sayfa = `pages/` altında bileşen + `menu`'ye öğe + `App.jsx`'te `sayfa === '...'` bloğu.
- Stil: Tailwind sınıfları; kartlar `bg-white border border-slate-200 rounded-2xl shadow-sm`, inputlar `rounded-xl` + `focus:ring-2`. Her sayfa mobil (kart) ve masaüstü (tablo) görünümünü desteklemeli.
- Hesaplama mantığını bileşen içine gömme; saf fonksiyon olarak `src/utils/` altına koy.

## Not ve AGNO sistemi

### Veri modeli

- `Kayit.HarfNotu` (`string?`, max 2): `AA, BA, BB, CB, CC, DC, DD, FD, FF`. `null` = ders devam ediyor (AGNO'ya katılmaz).
- `Kullanici.OgrenciId` (`int?`, benzersiz): öğrenci hesabının bağlı olduğu öğrenci profili. Öğrenci silinirse `NULL` olur.

### Not skalası (4'lük sistem)

| Harf | AA | BA | BB | CB | CC | DC | DD | FD | FF |
|---|---|---|---|---|---|---|---|---|---|
| Katsayı | 4.0 | 3.5 | 3.0 | 2.5 | 2.0 | 1.5 | 1.0 | 0.5 | 0.0 |

> ⚠️ Skala **iki yerde** tanımlı ve aynı tutulmalı: `Service/AgnoService.cs` → `NotKatsayilari` ve `frontend/src/utils/agno.js` → `HARF_NOTLARI`. Birini değiştirirsen diğerini de değiştir.

### Formüller

- **AGNO** = Σ(kredi × katsayı) / Σ kredi — sadece notu girilmiş dersler. Gösterimde 2 haneye yuvarlanır; hesaplarda yuvarlanmamış `ToplamPuan` kullanılır.
- **Hedef için gereken ortalama** (kalan `R` kredide):
  `g = (H × (C + R) − P) / R`
  `P` = toplam puan, `C` = tamamlanan kredi, `H` = hedef AGNO.
  - `g > 4` → hedefe bu kredi ile ulaşılamaz (en fazla `(P + 4R)/(C + R)`)
  - `g ≤ 0` → hedef garanti
  - aksi halde en düşük yeterli harf = katsayısı `g`'ye eşit/büyük en küçük not
- `R` = devam eden derslerin kredisi + kullanıcının girdiği "ek kredi".
- Tekrar alınan dersler (aynı derse ikinci kayıt) şu an desteklenmiyor — `(OgrenciId, DersId)` benzersiz.

### Endpointler

| Metot | Yol | Yetki | Açıklama |
|---|---|---|---|
| GET | `/kayitlar` | Giriş | Admin'e `harfNotu` dahil, diğerlerine notsuz döner |
| PUT | `/kayitlar/not?ogrenciId=&dersId=` | Admin | Body `{ "harfNotu": "BB" }`; `null`/boş = notu temizle |
| GET | `/ogrenciler/{id}/agno` | Admin veya o öğrenciye bağlı hesap | `AgnoOzeti` döner |
| GET | `/benim/agno` | Giriş | Giriş yapanın bağlı öğrencisinin AGNO'su; bağlı değilse 404 |
| GET | `/kullanicilar` | Admin | Kullanıcı listesi (şifre hash'i olmadan) |
| PUT | `/kullanicilar/{id}/ogrenci` | Admin | Body `{ "ogrenciId": 5 }`; `null` = bağlantıyı kaldır |

### Gizlilik

Harf notları ve AGNO kişisel veridir. Öğrenci rolündeki kullanıcı **sadece kendi** notlarını görebilmeli. Not içeren yeni bir endpoint eklerken bu kuralı backend'de uygula.

## Değişiklik yaparken kontrol listesi

- [ ] Model değiştiyse `dotnet ef migrations add ...` çalıştırıldı
- [ ] Yeni endpoint uygun `RequireAuthorization` ile korunuyor
- [ ] Hata mesajları Türkçe ve kullanıcıya gösterilebilir
- [ ] Not skalası değiştiyse backend ve frontend birlikte güncellendi
- [ ] `dotnet build` ve `npm run lint` / `npm run build` hatasız
- [ ] Gizli anahtar veya bağlantı cümlesi commit'lenmedi
- [ ] README'deki özellik/yetki tablosu güncel
