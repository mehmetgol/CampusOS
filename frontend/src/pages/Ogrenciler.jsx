import { useState } from 'react'

function Ogrenciler({
  ogrenciler,
  yeniOgrenci,
  setYeniOgrenci,
  duzenlenenOgrenciId,
  ogrenciEkle,
  ogrenciGuncelle,
  ogrenciDuzenlemeyiBaslat,
  ogrenciDuzenlemeyiIptalEt,
  ogrenciSil,
  yukleniyor,
  hata,
  kullanici
}) {
  const adminMi =
    kullanici?.rol === 'Admin'

  const [arama, setArama] =
    useState('')

  const filtrelenmisOgrenciler =
    ogrenciler.filter((ogrenci) => {
      const aranacakMetin =
        `${ogrenci.ad} ${ogrenci.soyad} ${ogrenci.bolum}`
          .toLowerCase()

      return aranacakMetin.includes(
        arama.toLowerCase()
      )
    })

  return (
    <div className="space-y-6">

      {/* ==========================
          BAŞLIK
      ========================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Öğrenciler
          </h2>

          <p className="text-slate-500 mt-2">
            Sistemdeki öğrencileri görüntüleyin
            ve yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm text-slate-500">
              Toplam
            </span>

            <span className="ml-2 font-bold text-slate-800">
              {ogrenciler.length}
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


      {/* ==========================
          ARAMA
      ========================== */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col md:flex-row md:items-center gap-4">

          <div className="flex-1">

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Öğrenci Ara
            </label>

            <input
              type="text"
              placeholder="Ad, soyad veya bölüm..."
              value={arama}
              onChange={(e) =>
                setArama(e.target.value)
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
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

          <div className="md:pt-7 text-sm text-slate-500">
            {filtrelenmisOgrenciler.length}
            {' '}sonuç bulundu
          </div>

        </div>

      </div>


      {/* ==========================
          ADMIN FORM
      ========================== */}

      {adminMi && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {duzenlenenOgrenciId
                  ? 'Öğrenci Düzenle'
                  : 'Yeni Öğrenci'}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {duzenlenenOgrenciId
                  ? 'Seçilen öğrencinin bilgilerini güncelleyin.'
                  : 'Sisteme yeni bir öğrenci ekleyin.'}
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
              👨‍🎓
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Ad
              </label>

              <input
                type="text"
                placeholder="Öğrenci adı"
                value={yeniOgrenci.ad}
                onChange={(e) =>
                  setYeniOgrenci({
                    ...yeniOgrenci,
                    ad: e.target.value
                  })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Soyad
              </label>

              <input
                type="text"
                placeholder="Öğrenci soyadı"
                value={yeniOgrenci.soyad}
                onChange={(e) =>
                  setYeniOgrenci({
                    ...yeniOgrenci,
                    soyad: e.target.value
                  })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Bölüm
              </label>

              <input
                type="text"
                placeholder="Örn. MIS"
                value={yeniOgrenci.bolum}
                onChange={(e) =>
                  setYeniOgrenci({
                    ...yeniOgrenci,
                    bolum: e.target.value
                  })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Yaş
              </label>

              <input
                type="number"
                placeholder="Örn. 21"
                value={yeniOgrenci.yas}
                onChange={(e) =>
                  setYeniOgrenci({
                    ...yeniOgrenci,
                    yas: e.target.value
                  })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

          </div>


          <div className="flex flex-wrap gap-3 mt-6">

            {duzenlenenOgrenciId ? (
              <>
                <button
                  type="button"
                  onClick={ogrenciGuncelle}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Değişiklikleri Kaydet
                </button>

                <button
                  type="button"
                  onClick={ogrenciDuzenlemeyiIptalEt}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"
                >
                  İptal
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={ogrenciEkle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                + Öğrenci Ekle
              </button>
            )}

          </div>

        </div>
      )}


      {/* ==========================
          ÖĞRENCİ BİLGİLENDİRME
      ========================== */}

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
                Öğrenci hesabıyla giriş yaptığınız
                için bilgileri görüntüleyebilir ve
                arayabilirsiniz.
              </p>
            </div>

          </div>

        </div>
      )}


      {/* ==========================
          HATA / YÜKLENİYOR
      ========================== */}

      {yukleniyor && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center text-slate-500">
          Öğrenciler yükleniyor...
        </div>
      )}

      {hata && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
          {hata}
        </div>
      )}


      {/* ==========================
          TABLO
      ========================== */}

      {!yukleniyor && !hata && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">

            <h3 className="font-bold text-slate-800">
              Öğrenci Listesi
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Kayıtlı öğrenci bilgileri
            </p>

          </div>


          {/* ==========================
              MOBİL KART GÖRÜNÜMÜ
          ========================== */}

          <div className="md:hidden p-4 space-y-4">

            {filtrelenmisOgrenciler.map(
              (ogrenci) => {

                const basHarf =
                  ogrenci.ad
                    ?.charAt(0)
                    ?.toUpperCase() || '?'

                return (
                  <div
                    key={ogrenci.id}
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

                        <div className="w-11 h-11 flex-shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                          {basHarf}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-800 break-words">
                            {ogrenci.ad}{' '}
                            {ogrenci.soyad}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            CampusOS Öğrencisi
                          </p>

                        </div>

                      </div>

                      <span className="text-xs text-slate-400 flex-shrink-0">
                        #{ogrenci.id}
                      </span>

                    </div>


                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-400 mb-1">
                          Bölüm
                        </p>

                        <p className="text-sm font-semibold text-slate-700 break-words">
                          {ogrenci.bolum || '-'}
                        </p>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-xs text-slate-400 mb-1">
                          Yaş
                        </p>

                        <p className="text-sm font-semibold text-slate-700">
                          {ogrenci.yas}
                        </p>

                      </div>

                    </div>


                    {adminMi && (
                      <div className="grid grid-cols-2 gap-3 mt-4">

                        <button
                          type="button"
                          onClick={() =>
                            ogrenciDuzenlemeyiBaslat(
                              ogrenci
                            )
                          }
                          className="
                            bg-amber-50
                            text-amber-700
                            hover:bg-amber-100
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            font-semibold
                            transition
                          "
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            ogrenciSil(
                              ogrenci.id
                            )
                          }
                          className="
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
                          Sil
                        </button>

                      </div>
                    )}

                  </div>
                )
              }
            )}

          </div>


          {/* ==========================
              MASAÜSTÜ TABLO GÖRÜNÜMÜ
          ========================== */}

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
                    Yaş
                  </th>

                  {adminMi && (
                    <th className="text-right font-semibold px-6 py-4">
                      İşlemler
                    </th>
                  )}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filtrelenmisOgrenciler.map(
                  (ogrenci) => {

                    const basHarf =
                      ogrenci.ad
                        ?.charAt(0)
                        ?.toUpperCase() || '?'

                    return (
                      <tr
                        key={ogrenci.id}
                        className="hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5 text-sm text-slate-500">
                          #{ogrenci.id}
                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                              {basHarf}
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {ogrenci.ad}{' '}
                                {ogrenci.soyad}
                              </p>

                              <p className="text-xs text-slate-400">
                                CampusOS Öğrencisi
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <span className="inline-flex bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm">
                            {ogrenci.bolum}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-slate-600">
                          {ogrenci.yas}
                        </td>

                        {adminMi && (
                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  ogrenciDuzenlemeyiBaslat(
                                    ogrenci
                                  )
                                }
                                className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
                              >
                                Düzenle
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  ogrenciSil(
                                    ogrenci.id
                                  )
                                }
                                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
                              >
                                Sil
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


          {ogrenciler.length === 0 && (
            <div className="p-10 text-center">

              <div className="text-4xl mb-3">
                👨‍🎓
              </div>

              <p className="font-semibold text-slate-700">
                Henüz öğrenci yok
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Sisteme eklenen öğrenciler
                burada görüntülenecek.
              </p>

            </div>
          )}


          {ogrenciler.length > 0 &&
            filtrelenmisOgrenciler.length === 0 && (
              <div className="p-10 text-center">

                <p className="font-semibold text-slate-700">
                  Sonuç bulunamadı
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Arama kriterinizi değiştirin.
                </p>

              </div>
            )}

        </div>
      )}

    </div>
  )
}

export default Ogrenciler