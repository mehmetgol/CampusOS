// ==========================================
// HARF NOTU SKALASI (4'LÜK SİSTEM)
// Backend'deki Service/AgnoService.cs ile
// AYNI tutulmalıdır.
// ==========================================

export const HARF_NOTLARI = [
  { harf: 'AA', katsayi: 4.0 },
  { harf: 'BA', katsayi: 3.5 },
  { harf: 'BB', katsayi: 3.0 },
  { harf: 'CB', katsayi: 2.5 },
  { harf: 'CC', katsayi: 2.0 },
  { harf: 'DC', katsayi: 1.5 },
  { harf: 'DD', katsayi: 1.0 },
  { harf: 'FD', katsayi: 0.5 },
  { harf: 'FF', katsayi: 0.0 }
]

export const MAKS_KATSAYI = 4.0

// Kayan nokta hatalarına karşı tolerans (ör. 3.0000000001)
const EPS = 1e-9

export const katsayiBul = (harf) =>
  HARF_NOTLARI.find((n) => n.harf === harf)
    ?.katsayi ?? null

// Gereken ortalamayı karşılayan EN DÜŞÜK harf notu
export const enDusukHarfNotu = (
  gerekenOrtalama
) => {
  const uygunlar = HARF_NOTLARI.filter(
    (n) => n.katsayi >= gerekenOrtalama - EPS
  )

  return uygunlar.length > 0
    ? uygunlar[uygunlar.length - 1].harf
    : null
}

export const ikiHane = (sayi) =>
  sayi == null || Number.isNaN(sayi)
    ? '-'
    : sayi.toFixed(2)


// ==========================================
// HEDEF AGNO HESABI
//
// AGNO = Σ(kredi × katsayı) / Σ kredi
//
// Hedefe ulaşmak için kalan R kredide
// gereken ortalama g:
//   (P + g·R) / (C + R) = H
//   g = (H·(C + R) − P) / R
//
// P: toplam puan, C: tamamlanan kredi,
// R: kalan kredi, H: hedef AGNO
// ==========================================

export const hedefHesapla = ({
  toplamPuan,
  tamamlananKredi,
  kalanKredi,
  hedefAgno
}) => {
  const P = Number(toplamPuan) || 0
  const C = Number(tamamlananKredi) || 0
  const R = Number(kalanKredi) || 0
  const H = Number(hedefAgno)

  if (Number.isNaN(H) || H < 0 || H > MAKS_KATSAYI) {
    return { durum: 'gecersiz-hedef' }
  }

  if (R <= 0) {
    return { durum: 'kredi-yok' }
  }

  const gerekenOrtalama =
    (H * (C + R) - P) / R

  // Kalan tüm derslerden AA alınsa ulaşılacak AGNO
  const ulasilabilirMaks =
    (P + MAKS_KATSAYI * R) / (C + R)

  // Kalan tüm derslerden FF alınsa kalınacak AGNO
  const ulasilabilirMin =
    P / (C + R)

  if (gerekenOrtalama > MAKS_KATSAYI + EPS) {
    return {
      durum: 'imkansiz',
      gerekenOrtalama,
      ulasilabilirMaks,
      ulasilabilirMin
    }
  }

  if (gerekenOrtalama <= EPS) {
    return {
      durum: 'garanti',
      gerekenOrtalama,
      ulasilabilirMaks,
      ulasilabilirMin
    }
  }

  return {
    durum: 'mumkun',
    gerekenOrtalama,
    enDusukHarf:
      enDusukHarfNotu(gerekenOrtalama),
    ulasilabilirMaks,
    ulasilabilirMin
  }
}


// ==========================================
// TAHMİNİ AGNO
// Devam eden derslere varsayılan notlar
// verildiğinde oluşacak AGNO.
// tahminler: [{ kredi, katsayi }]
// ==========================================

export const tahminiAgno = ({
  toplamPuan,
  tamamlananKredi,
  tahminler
}) => {
  let puan = Number(toplamPuan) || 0
  let kredi = Number(tamamlananKredi) || 0

  for (const t of tahminler) {
    if (t.katsayi == null) continue

    puan += t.kredi * t.katsayi
    kredi += t.kredi
  }

  return kredi > 0 ? puan / kredi : null
}
