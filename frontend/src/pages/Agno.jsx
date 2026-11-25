import { useEffect, useMemo, useState } from 'react'

import {
  HARF_NOTLARI,
  katsayiBul,
  hedefHesapla,
  tahminiAgno,
  ikiHane
} from '../utils/agno'

const inputSinifi = `
  w-full
  border
  border-slate-300
  rounded-xl
  px-4
  py-3
  bg-white
  outline-none
  transition
  focus:border-blue-500
  focus:ring-2
  focus:ring-blue-100
`

function Agno({
  apiUrl,
  token,
  kullanici,
  ogrenciler,
  cikisYap
}) {
  const adminMi =
    kullanici?.rol === 'Admin'


  // ==========================================
  // DURUMLAR
  // ==========================================

  const [seciliOgrenciId, setSeciliOgrenciId] =
    useState('')

  const [ozet, setOzet] =
    useState(null)

  const [yukleniyor, setYukleniyor] =
    useState(false)

  const [hata, setHata] =
    useState('')

  const [hedefAgno, setHedefAgno] =
    useState('3.00')

  const [ekKredi, setEkKredi] =
    useState('0')

  // dersId -> tahmini harf notu
  const [tahminiNotlar, setTahminiNotlar] =
    useState({})

  // Admin: hesap eşleştirme
  const [kullanicilar, setKullanicilar] =
    useState([])


  // ==========================================
  // API YARDIMCISI
  // ==========================================

  const istek = async (yol, secenekler = {}) => {
    const response = await fetch(
      `${apiUrl}${yol}`,
      {
        ...secenekler,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(secenekler.body
            ? { 'Content-Type': 'application/json' }
            : {})
        }
      }
    )

    if (response.status === 401) {
      cikisYap()
      throw new Error('Oturum süreniz doldu.')
    }

    if (response.status === 403) {
      throw new Error('Bu bilgiyi görüntüleme yetkiniz yok.')
    }

    if (!response.ok) {
      const mesaj = await response.text()
      throw new Error(mesaj || 'İstek başarısız oldu.')
    }

    return response.json()
  }


  // ==========================================
  // AGNO ÖZETİNİ GETİR
  // ==========================================

  useEffect(() => {
    const yol = adminMi
      ? seciliOgrenciId
        ? `/ogrenciler/${seciliOgrenciId}/agno`
        : null
      : '/benim/agno'

    if (!yol) {
      setOzet(null)
      return
    }

    let iptal = false

    const getir = async () => {
      try {
        setYukleniyor(true)
        setHata('')

        const data = await istek(yol)

        if (!iptal) {
          setOzet(data)
          setTahminiNotlar({})
        }
      } catch (error) {
        if (!iptal) {
          setOzet(null)
          setHata(error.message)
        }
      } finally {
        if (!iptal) setYukleniyor(false)
      }
    }

    getir()

    return () => {
      iptal = true
    }
  }, [adminMi, seciliOgrenciId, token])


  // ==========================================
  // ADMIN: KULLANICILARI GETİR
  // ==========================================

  useEffect(() => {
    if (!adminMi) return

    istek('/kullanicilar')
      .then(setKullanicilar)
      .catch((error) => console.error(error))
  }, [adminMi, token])

  const hesabiBagla = async (
    kullaniciId,
    ogrenciId
  ) => {
    try {
      await istek(
        `/kullanicilar/${kullaniciId}/ogrenci`,
        {
          method: 'PUT',
          body: JSON.stringify({
            ogrenciId: ogrenciId
              ? Number(ogrenciId)
              : null
          })
        }
      )

      setKullanicilar((onceki) =>
        onceki.map((k) =>
          k.id === kullaniciId
            ? {
                ...k,
                ogrenciId: ogrenciId
                  ? Number(ogrenciId)
                  : null
              }
            : k
        )
      )
    } catch (error) {
      alert(error.message)
    }
  }


  // ==========================================
  // HESAPLAMALAR
  // ==========================================

  const devamEdenDersler = useMemo(
    () =>
      ozet?.dersler.filter(
        (d) => !d.harfNotu
      ) ?? [],
    [ozet]
  )

  const kalanKredi =
    (ozet?.devamEdenKredi ?? 0) +
    (Number(ekKredi) || 0)

  const hedefSonucu = ozet
    ? hedefHesapla({
        toplamPuan: ozet.toplamPuan,
        tamamlananKredi: ozet.tamamlananKredi,
        kalanKredi,
        hedefAgno
      })
    : null

  const tahmin = ozet
    ? tahminiAgno({
        toplamPuan: ozet.toplamPuan,
        tamamlananKredi: ozet.tamamlananKredi,
        tahminler: devamEdenDersler.map(
          (d) => ({
            kredi: d.kredi,
            katsayi: katsayiBul(
              tahminiNotlar[d.dersId]
            )
          })
        )
      })
    : null

  const tahminVarMi = Object.values(
    tahminiNotlar
  ).some(Boolean)

  const hedefeGoreDoldur = () => {
    if (!hedefSonucu?.enDusukHarf) return

    const yeni = {}

    devamEdenDersler.forEach((d) => {
      yeni[d.dersId] = hedefSonucu.enDusukHarf
    })

    setTahminiNotlar(yeni)
  }


  // ==========================================
  // ARAYÜZ
  // ==========================================

  return (
    <div className="space-y-6">

      {/* BAŞLIK */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            AGNO
          </h2>

          <p className="text-slate-500 mt-2">
            Genel not ortalamanı gör, hedefin
            için ne alman gerektiğini hesapla.
          </p>
        </div>

        {adminMi && (
          <div className="md:w-80">
            <select
              value={seciliOgrenciId}
              onChange={(e) =>
                setSeciliOgrenciId(
                  e.target.value
                )
              }
              className={inputSinifi}
            >
              <option value="">
                Öğrenci seç
              </option>

              {ogrenciler.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.ad} {o.soyad} — {o.bolum}
                </option>
              ))}
            </select>
          </div>
        )}

      </div>


      {/* DURUM MESAJLARI */}

      {adminMi && !seciliOgrenciId && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl p-5">
          AGNO'sunu görmek istediğiniz
          öğrenciyi sağ üstten seçin.
        </div>
      )}

      {yukleniyor && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center text-slate-500">
          ⏳ AGNO hesaplanıyor...
        </div>
      )}

      {hata && !yukleniyor && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-5">
          {hata}
        </div>
      )}


      {ozet && !yukleniyor && (
        <>

          {/* ÖZET KARTLARI */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-400">
                Güncel AGNO
              </p>
              <p className="text-4xl font-bold mt-2">
                {ikiHane(ozet.agno)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                / 4.00
              </p>
            </div>

            <OzetKart
              baslik="Tamamlanan Kredi"
              deger={ozet.tamamlananKredi}
            />

            <OzetKart
              baslik="Devam Eden Kredi"
              deger={ozet.devamEdenKredi}
            />

            <OzetKart
              baslik="Ders Sayısı"
              deger={ozet.dersler.length}
            />

          </div>


          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* HEDEF HESAPLAYICI */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

              <h3 className="text-xl font-bold text-slate-800">
                🎯 Hedef AGNO Hesaplayıcı
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Hedefine ulaşmak için kalan
                derslerde ortalama kaç alman
                gerektiğini gösterir.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Hedef AGNO
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.01"
                    value={hedefAgno}
                    onChange={(e) =>
                      setHedefAgno(
                        e.target.value
                      )
                    }
                    className={inputSinifi}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Ek kredi (sonraki dönemler)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={ekKredi}
                    onChange={(e) =>
                      setEkKredi(
                        e.target.value
                      )
                    }
                    className={inputSinifi}
                  />
                </div>

              </div>

              <p className="text-xs text-slate-400 mt-3">
                Hesaba katılan kalan kredi:
                {' '}
                <b>{kalanKredi}</b>
                {' '}(devam eden {ozet.devamEdenKredi}
                {' '}+ ek {Number(ekKredi) || 0})
              </p>

              <HedefSonucu
                sonuc={hedefSonucu}
                hedefAgno={hedefAgno}
              />

            </div>


            {/* SİMÜLASYON */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    🧮 Not Simülasyonu
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Devam eden derslere tahmini
                    not ver, AGNO'nun ne olacağını gör.
                  </p>
                </div>

                {hedefSonucu?.enDusukHarf &&
                  devamEdenDersler.length > 0 && (
                    <button
                      type="button"
                      onClick={hedefeGoreDoldur}
                      className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg font-semibold whitespace-nowrap"
                    >
                      Hedefe göre doldur
                    </button>
                  )}

              </div>

              {devamEdenDersler.length === 0 ? (
                <p className="text-sm text-slate-400 mt-5">
                  Notu girilmemiş (devam eden)
                  ders yok.
                </p>
              ) : (
                <div className="mt-5 space-y-3">

                  {devamEdenDersler.map((d) => (
                    <div
                      key={d.dersId}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {d.dersKodu} — {d.dersAdi}
                        </p>
                        <p className="text-xs text-slate-400">
                          {d.kredi} kredi
                        </p>
                      </div>

                      <select
                        value={
                          tahminiNotlar[d.dersId] ?? ''
                        }
                        onChange={(e) =>
                          setTahminiNotlar({
                            ...tahminiNotlar,
                            [d.dersId]:
                              e.target.value
                          })
                        }
                        className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="">—</option>
                        {HARF_NOTLARI.map((n) => (
                          <option
                            key={n.harf}
                            value={n.harf}
                          >
                            {n.harf} ({n.katsayi.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="mt-4 bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Tahmini AGNO
                    </span>
                    <span className="text-2xl font-bold text-slate-800">
                      {tahminVarMi
                        ? ikiHane(tahmin)
                        : '-'}
                    </span>
                  </div>

                </div>
              )}

            </div>

          </div>


          {/* DERS LİSTESİ */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-800">
                Dersler ve Notlar
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {ozet.ogrenciAdSoyad} · {ozet.bolum}
              </p>
            </div>

            {ozet.dersler.length === 0 ? (
              <p className="p-8 text-center text-slate-400">
                Bu öğrencinin kayıtlı dersi yok.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {ozet.dersler.map((d) => (
                  <div
                    key={d.dersId}
                    className="px-6 py-4 flex items-center gap-4"
                  >
                    <span className="inline-flex bg-violet-50 text-violet-700 px-3 py-1 rounded-lg text-sm font-semibold">
                      {d.dersKodu}
                    </span>

                    <span className="flex-1 min-w-0 truncate text-slate-800">
                      {d.dersAdi}
                    </span>

                    <span className="text-sm text-slate-500">
                      {d.kredi} kr
                    </span>

                    {d.harfNotu ? (
                      <span className="w-14 text-center bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-sm font-bold">
                        {d.harfNotu}
                      </span>
                    ) : (
                      <span className="w-14 text-center bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-xs">
                        Devam
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </>
      )}


      {/* ADMIN: HESAP EŞLEŞTİRME */}

      {adminMi && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          <h3 className="text-xl font-bold text-slate-800">
            🔗 Hesap – Öğrenci Eşleştirme
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Öğrenci hesapları kendi AGNO'larını
            görebilmek için bir öğrenci profiline
            bağlanmalıdır.
          </p>

          <div className="mt-5 divide-y divide-slate-100">

            {kullanicilar
              .filter((k) => k.rol !== 'Admin')
              .map((k) => (
                <div
                  key={k.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">
                      {k.ad} {k.soyad}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {k.email}
                    </p>
                  </div>

                  <select
                    value={k.ogrenciId ?? ''}
                    onChange={(e) =>
                      hesabiBagla(
                        k.id,
                        e.target.value
                      )
                    }
                    className="sm:w-72 border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="">
                      Bağlı değil
                    </option>
                    {ogrenciler.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.ad} {o.soyad} — {o.bolum}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

            {kullanicilar.filter(
              (k) => k.rol !== 'Admin'
            ).length === 0 && (
              <p className="py-3 text-sm text-slate-400">
                Henüz öğrenci hesabı yok.
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  )
}


// ==========================================
// ALT BİLEŞENLER
// ==========================================

function OzetKart({ baslik, deger }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {baslik}
      </p>
      <p className="text-3xl font-bold text-slate-800 mt-2">
        {deger}
      </p>
    </div>
  )
}

function HedefSonucu({ sonuc, hedefAgno }) {
  if (!sonuc) return null

  const kutu =
    'mt-5 rounded-xl p-5 border'

  if (sonuc.durum === 'gecersiz-hedef') {
    return (
      <div className={`${kutu} bg-slate-50 border-slate-200 text-slate-600`}>
        Hedef AGNO 0.00 ile 4.00 arasında olmalı.
      </div>
    )
  }

  if (sonuc.durum === 'kredi-yok') {
    return (
      <div className={`${kutu} bg-slate-50 border-slate-200 text-slate-600`}>
        Hesaplanacak kalan kredi yok. Devam eden
        ders yoksa "Ek kredi" alanına sonraki
        dönemlerde alacağın krediyi yaz.
      </div>
    )
  }

  if (sonuc.durum === 'imkansiz') {
    return (
      <div className={`${kutu} bg-red-50 border-red-200 text-red-800`}>
        <p className="font-semibold">
          Bu kredi ile {Number(hedefAgno).toFixed(2)} hedefine
          ulaşılamıyor.
        </p>
        <p className="text-sm mt-1">
          Gereken ortalama {ikiHane(sonuc.gerekenOrtalama)} —
          4.00'ın üstünde. Kalan tüm derslerden AA
          alsan bile AGNO en fazla
          {' '}<b>{ikiHane(sonuc.ulasilabilirMaks)}</b> olur.
          Daha fazla ek kredi girerek tekrar dene.
        </p>
      </div>
    )
  }

  if (sonuc.durum === 'garanti') {
    return (
      <div className={`${kutu} bg-emerald-50 border-emerald-200 text-emerald-800`}>
        <p className="font-semibold">
          Hedef zaten garanti 🎉
        </p>
        <p className="text-sm mt-1">
          Kalan derslerin tamamı FF olsa bile AGNO
          {' '}{ikiHane(sonuc.ulasilabilirMin)} olur.
        </p>
      </div>
    )
  }

  return (
    <div className={`${kutu} bg-blue-50 border-blue-200 text-blue-900`}>
      <p className="text-sm">
        Kalan derslerde gereken ortalama
      </p>
      <p className="text-4xl font-bold mt-1">
        {ikiHane(sonuc.gerekenOrtalama)}
      </p>
      <p className="text-sm mt-2">
        Yani her dersten en az
        {' '}<b>{sonuc.enDusukHarf}</b>{' '}
        alırsan hedefe ulaşırsın (bazı derslerde
        daha düşük, bazılarında daha yüksek alarak
        da dengeleyebilirsin).
      </p>
      <p className="text-xs text-blue-700 mt-3">
        Ulaşılabilir aralık:
        {' '}{ikiHane(sonuc.ulasilabilirMin)} –
        {' '}{ikiHane(sonuc.ulasilabilirMaks)}
      </p>
    </div>
  )
}

export default Agno
