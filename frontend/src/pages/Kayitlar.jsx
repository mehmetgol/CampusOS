import { useState } from 'react'

import { HARF_NOTLARI } from '../utils/agno'

function Kayitlar({
  ogrenciler,
  dersler,
  kayitlar,
  yeniKayit,
  setYeniKayit,
  kayitEkle,
  kayitSil,
  notGuncelle,
  yukleniyor,
  hata,
  kullanici
}) {
  // ==========================================
  // YETKİ
  // ==========================================

  const adminMi =
    kullanici?.rol === 'Admin'


  // ==========================================
  // ARAMA
  // ==========================================

  const [arama, setArama] =
    useState('')

  const filtrelenmisKayitlar =
    kayitlar.filter((kayit) => {
      const aranacakMetin = `
        ${kayit.ogrenci?.ad ?? ''}
        ${kayit.ogrenci?.soyad ?? ''}
        ${kayit.ogrenci?.bolum ?? ''}
        ${kayit.ders?.dersAdi ?? ''}
        ${kayit.ders?.dersKodu ?? ''}
      `.toLowerCase()

      return aranacakMetin.includes(
        arama.toLowerCase()
      )
    })


  return (
    <div className="space-y-6">

      {/* ======================================
          BAŞLIK
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Kayıtlar
          </h2>

          <p className="text-slate-500 mt-2">
            Öğrencilerin ders kayıtlarını
            görüntüleyin ve yönetin.
          </p>
        </div>


        <div className="flex items-center gap-3">

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">

            <span className="text-sm text-slate-500">
              Toplam
            </span>

            <span className="ml-2 font-bold text-slate-800">
              {kayitlar.length}
            </span>

          </div>


          {adminMi ? (
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
              Admin Yetkisi
            </span>
          ) : (
            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-semibold">
              Görüntüleme
            </span>
          )}

        </div>

      </div>


      {/* ======================================
          ARAMA
      ====================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col md:flex-row md:items-end gap-4">

          <div className="flex-1">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kayıt Ara
            </label>

            <input
              type="text"
              placeholder="Öğrenci, bölüm, ders veya ders kodu..."
              value={arama}
              onChange={(e) =>
                setArama(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-slate-300
                rounded-xl
                px-4
                py-3
                outline-none
                transition
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-100
              "
            />

          </div>


          <div className="text-sm text-slate-500 pb-3">
            {filtrelenmisKayitlar.length}
            {' '}sonuç bulundu
          </div>

        </div>

      </div>


      {/* ======================================
          YENİ KAYIT
          SADECE ADMIN
      ====================================== */}

      {adminMi && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Öğrenciyi Derse Kaydet
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Öğrenci ve ders seçerek yeni
                bir ders kaydı oluşturun.
              </p>
            </div>


            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl">
              📝
            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* ÖĞRENCİ */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Öğrenci
              </label>

              <select
                value={
                  yeniKayit.ogrenciId
                }
                onChange={(e) =>
                  setYeniKayit({
                    ...yeniKayit,
                    ogrenciId:
                      e.target.value
                  })
                }
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  outline-none
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              >

                <option value="">
                  Öğrenci Seç
                </option>

                {ogrenciler.map(
                  (ogrenci) => (
                    <option
                      key={
                        ogrenci.id
                      }
                      value={
                        ogrenci.id
                      }
                    >
                      {ogrenci.ad}{' '}
                      {ogrenci.soyad}
                      {' — '}
                      {ogrenci.bolum}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* DERS */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Ders
              </label>

              <select
                value={
                  yeniKayit.dersId
                }
                onChange={(e) =>
                  setYeniKayit({
                    ...yeniKayit,
                    dersId:
                      e.target.value
                  })
                }
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  outline-none
                  focus:border-violet-500
                  focus:ring-2
                  focus:ring-violet-100
                "
              >

                <option value="">
                  Ders Seç
                </option>

                {dersler.map(
                  (ders) => (
                    <option
                      key={
                        ders.id
                      }
                      value={
                        ders.id
                      }
                    >
                      {ders.dersKodu}
                      {' — '}
                      {ders.dersAdi}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>


          <div className="mt-6">

            <button
              type="button"
              onClick={
                kayitEkle
              }
              className="
                bg-violet-600
                hover:bg-violet-700
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
                shadow-sm
              "
            >
              + Derse Kaydet
            </button>

          </div>

        </div>
      )}


      {/* ======================================
          NORMAL ÖĞRENCİ
      ====================================== */}

      {!adminMi && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

          <div className="flex gap-3">

            <div className="text-xl">
              ℹ️
            </div>

            <div>

              <p className="font-semibold text-blue-800">
                Görüntüleme modu
              </p>

              <p className="text-sm text-blue-700 mt-1">
                Öğrenci hesabıyla giriş
                yaptığınız için ders
                kayıtlarını görüntüleyebilir
                ve arayabilirsiniz.
              </p>

            </div>

          </div>

        </div>
      )}


      {/* ======================================
          YÜKLENİYOR
      ====================================== */}

      {yukleniyor && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">

          <div className="text-3xl mb-3">
            ⏳
          </div>

          <p className="text-slate-500">
            Kayıtlar yükleniyor...
          </p>

        </div>
      )}


      {/* ======================================
          HATA
      ====================================== */}

      {hata && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">

          <p className="font-semibold">
            Kayıtlar yüklenemedi
          </p>

          <p className="text-sm mt-1">
            {hata}
          </p>

        </div>
      )}


      {/* ======================================
          KAYIT TABLOSU
      ====================================== */}

      {!yukleniyor && !hata && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* TABLO BAŞLIĞI */}

          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h3 className="font-bold text-slate-800">
                Ders Kayıtları
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Öğrenci ve ders
                eşleşmeleri
              </p>

            </div>


            <span className="text-sm bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg font-medium">
              {filtrelenmisKayitlar.length}
              {' '}kayıt
            </span>

          </div>


          {/* ==================================
              MOBİL KART GÖRÜNÜMÜ
          ================================== */}

          <div className="md:hidden p-4 space-y-4">

            {filtrelenmisKayitlar.map(
              (kayit) => {

                const basHarf =
                  kayit.ogrenci?.ad
                    ?.charAt(0)
                    ?.toUpperCase() ||
                  '?'

                return (
                  <div
                    key={kayit.id}
                    className="
                      border
                      border-slate-200
                      rounded-2xl
                      p-4
                      bg-white
                      shadow-sm
                    "
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-11 h-11 flex-shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          {basHarf}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-800 break-words">
                            {kayit.ogrenci
                              ? `${kayit.ogrenci.ad} ${kayit.ogrenci.soyad}`
                              : `Öğrenci #${kayit.ogrenciId}`}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            CampusOS Öğrencisi
                          </p>

                        </div>

                      </div>

                      <span className="text-xs text-slate-400 flex-shrink-0">
                        #{kayit.id}
                      </span>

                    </div>


                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-400 mb-1">
                          Bölüm
                        </p>

                        <p className="text-sm font-semibold text-slate-700 break-words">
                          {kayit.ogrenci?.bolum ?? '-'}
                        </p>

                      </div>


                      <div className="bg-violet-50 rounded-xl p-3">

                        <p className="text-xs text-violet-400 mb-1">
                          Ders Kodu
                        </p>

                        <p className="text-sm font-semibold text-violet-700 break-words">
                          {kayit.ders?.dersKodu ?? '-'}
                        </p>

                      </div>

                    </div>


                    <div className="mt-3 bg-slate-50 rounded-xl p-3">

                      <p className="text-xs text-slate-400 mb-1">
                        Ders
                      </p>

                      <p className="text-sm font-semibold text-slate-800 break-words">
                        {kayit.ders?.dersAdi ??
                          `Ders #${kayit.dersId}`}
                      </p>

                    </div>


                    {adminMi && (
                      <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-400">
                          Harf Notu
                        </p>

                        <NotSecici
                          kayit={kayit}
                          notGuncelle={notGuncelle}
                        />

                      </div>
                    )}


                    {adminMi && (
                      <button
                        type="button"
                        onClick={() =>
                          kayitSil(
                            kayit.ogrenciId,
                            kayit.dersId
                          )
                        }
                        className="
                          mt-4
                          w-full
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          px-4
                          py-3
                          rounded-xl
                          text-sm
                          font-semibold
                          transition
                        "
                      >
                        Dersten Çıkar
                      </button>
                    )}

                  </div>
                )
              }
            )}

          </div>


          {/* ==================================
              MASAÜSTÜ TABLO GÖRÜNÜMÜ
          ================================== */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="text-sm text-slate-500">

                  <th className="text-left font-semibold px-6 py-4">
                    ID
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Öğrenci
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Bölüm
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Ders
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Ders Kodu
                  </th>

                  {adminMi && (
                    <th className="text-left font-semibold px-6 py-4">
                      Not
                    </th>
                  )}

                  {adminMi && (
                    <th className="text-right font-semibold px-6 py-4">
                      İşlem
                    </th>
                  )}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filtrelenmisKayitlar.map(
                  (kayit) => {

                    const basHarf =
                      kayit.ogrenci?.ad
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      '?'

                    return (
                      <tr
                        key={kayit.id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5 text-sm text-slate-500">
                          #{kayit.id}
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              {basHarf}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {kayit.ogrenci
                                  ? `${kayit.ogrenci.ad} ${kayit.ogrenci.soyad}`
                                  : `Öğrenci #${kayit.ogrenciId}`}
                              </p>

                              <p className="text-xs text-slate-400 mt-0.5">
                                CampusOS Öğrencisi
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <span className="inline-flex bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm">
                            {kayit.ogrenci?.bolum ?? '-'}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <p className="font-medium text-slate-800">
                            {kayit.ders?.dersAdi ??
                              `Ders #${kayit.dersId}`}
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <span className="inline-flex bg-violet-50 text-violet-700 px-3 py-1 rounded-lg text-sm font-semibold">
                            {kayit.ders?.dersKodu ?? '-'}
                          </span>

                        </td>

                        {adminMi && (
                          <td className="px-6 py-5">

                            <NotSecici
                              kayit={kayit}
                              notGuncelle={notGuncelle}
                            />

                          </td>
                        )}

                        {adminMi && (
                          <td className="px-6 py-5">

                            <div className="flex justify-end">

                              <button
                                type="button"
                                onClick={() =>
                                  kayitSil(
                                    kayit.ogrenciId,
                                    kayit.dersId
                                  )
                                }
                                className="
                                  bg-red-50
                                  text-red-600
                                  hover:bg-red-100
                                  px-4
                                  py-2
                                  rounded-lg
                                  text-sm
                                  font-semibold
                                  transition
                                "
                              >
                                Dersten Çıkar
                              </button>

                            </div>

                          </td>
                        )}

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>


          {/* ==================================
              HİÇ KAYIT YOK
          ================================== */}

          {kayitlar.length === 0 && (
            <div className="p-10 text-center">

              <div className="text-4xl mb-3">
                📝
              </div>

              <p className="font-semibold text-slate-700">
                Henüz ders kaydı yok
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Öğrencilerin ders kayıtları
                burada görüntülenecek.
              </p>

            </div>
          )}


          {/* ==================================
              ARAMA SONUCU YOK
          ================================== */}

          {kayitlar.length > 0 &&
            filtrelenmisKayitlar.length === 0 && (
              <div className="p-10 text-center">

                <div className="text-3xl mb-3">
                  🔍
                </div>

                <p className="font-semibold text-slate-700">
                  Sonuç bulunamadı
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Arama kriterinizi
                  değiştirerek tekrar deneyin.
                </p>

              </div>
            )}

        </div>
      )}

    </div>
  )
}

// ==========================================
// HARF NOTU SEÇİCİ (ADMIN)
// ==========================================

function NotSecici({ kayit, notGuncelle }) {
  return (
    <select
      value={kayit.harfNotu ?? ''}
      onChange={(e) =>
        notGuncelle(
          kayit.ogrenciId,
          kayit.dersId,
          e.target.value
        )
      }
      className="
        border
        border-slate-300
        rounded-lg
        px-3
        py-2
        bg-white
        text-sm
        font-semibold
        outline-none
        focus:border-violet-500
      "
    >
      <option value="">
        Devam
      </option>

      {HARF_NOTLARI.map((n) => (
        <option key={n.harf} value={n.harf}>
          {n.harf}
        </option>
      ))}
    </select>
  )
}

export default Kayitlar