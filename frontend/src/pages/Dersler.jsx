import { useState } from 'react'

function Dersler({
  dersler,
  yeniDers,
  setYeniDers,
  duzenlenenDersId,
  dersEkle,
  dersGuncelle,
  dersDuzenlemeyiBaslat,
  dersDuzenlemeyiIptalEt,
  dersSil,
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

  const filtrelenmisDersler =
    dersler.filter((ders) => {
      const aranacakMetin =
        `${ders.dersAdi} ${ders.dersKodu}`
          .toLowerCase()

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
            Dersler
          </h2>

          <p className="text-slate-500 mt-2">
            Sistemdeki dersleri görüntüleyin
            ve yönetin.
          </p>
        </div>


        <div className="flex items-center gap-3">

          {/* TOPLAM DERS */}

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">

            <span className="text-sm text-slate-500">
              Toplam
            </span>

            <span className="ml-2 font-bold text-slate-800">
              {dersler.length}
            </span>

          </div>


          {/* ROL */}

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
              Ders Ara
            </label>

            <input
              type="text"
              placeholder="Ders adı veya ders kodu..."
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
                focus:border-emerald-500
                focus:ring-2
                focus:ring-emerald-100
              "
            />

          </div>


          <div className="text-sm text-slate-500 pb-3">
            {filtrelenmisDersler.length}
            {' '}sonuç bulundu
          </div>

        </div>

      </div>


      {/* ======================================
          DERS EKLE / GÜNCELLE
          SADECE ADMIN
      ====================================== */}

      {adminMi && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

          {/* FORM BAŞLIĞI */}

          <div className="flex items-center justify-between mb-6">

            <div>

              <h3 className="text-xl font-bold text-slate-800">

                {duzenlenenDersId
                  ? 'Ders Düzenle'
                  : 'Yeni Ders'}

              </h3>

              <p className="text-sm text-slate-500 mt-1">

                {duzenlenenDersId
                  ? 'Seçilen dersin bilgilerini güncelleyin.'
                  : 'Sisteme yeni bir ders ekleyin.'}

              </p>

            </div>


            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
              📚
            </div>

          </div>


          {/* FORM */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* DERS ADI */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Ders Adı
              </label>

              <input
                type="text"
                placeholder="Örn. Database Management Systems"
                value={
                  yeniDers.dersAdi
                }
                onChange={(e) =>
                  setYeniDers({
                    ...yeniDers,
                    dersAdi:
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
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />

            </div>


            {/* DERS KODU */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Ders Kodu
              </label>

              <input
                type="text"
                placeholder="Örn. MIS3003"
                value={
                  yeniDers.dersKodu
                }
                onChange={(e) =>
                  setYeniDers({
                    ...yeniDers,
                    dersKodu:
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
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />

            </div>


            {/* KREDİ */}

            <div>

              <label className="block text-sm font-medium text-slate-600 mb-2">
                Kredi
              </label>

              <input
                type="number"
                placeholder="Örn. 3"
                value={
                  yeniDers.kredi
                }
                onChange={(e) =>
                  setYeniDers({
                    ...yeniDers,
                    kredi:
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
                  outline-none
                  transition
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />

            </div>

          </div>


          {/* BUTONLAR */}

          <div className="flex flex-wrap gap-3 mt-6">

            {duzenlenenDersId ? (
              <>

                <button
                  type="button"
                  onClick={
                    dersGuncelle
                  }
                  className="
                    bg-emerald-600
                    hover:bg-emerald-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Değişiklikleri Kaydet
                </button>


                <button
                  type="button"
                  onClick={
                    dersDuzenlemeyiIptalEt
                  }
                  className="
                    bg-slate-100
                    hover:bg-slate-200
                    text-slate-700
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  İptal
                </button>

              </>
            ) : (

              <button
                type="button"
                onClick={
                  dersEkle
                }
                className="
                  bg-emerald-600
                  hover:bg-emerald-700
                  text-white
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                  shadow-sm
                "
              >
                + Ders Ekle
              </button>

            )}

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
                yaptığınız için dersleri
                görüntüleyebilir ve
                arayabilirsiniz.
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
            Dersler yükleniyor...
          </p>

        </div>
      )}


      {/* ======================================
          HATA
      ====================================== */}

      {hata && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">

          <p className="font-semibold">
            Dersler yüklenemedi
          </p>

          <p className="text-sm mt-1">
            {hata}
          </p>

        </div>
      )}


      {/* ======================================
          DERS TABLOSU
      ====================================== */}

      {!yukleniyor && !hata && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* TABLO BAŞLIĞI */}

          <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h3 className="font-bold text-slate-800">
                Ders Listesi
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Sistemde tanımlı dersler
              </p>

            </div>


            <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium">

              {filtrelenmisDersler.length}
              {' '}ders

            </span>

          </div>


          {/* TABLO */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="text-sm text-slate-500">

                  <th className="text-left font-semibold px-6 py-4">
                    ID
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Ders
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Ders Kodu
                  </th>

                  <th className="text-left font-semibold px-6 py-4">
                    Kredi
                  </th>

                  {adminMi && (
                    <th className="text-right font-semibold px-6 py-4">
                      İşlemler
                    </th>
                  )}

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filtrelenmisDersler.map(
                  (ders) => (
                    <tr
                      key={
                        ders.id
                      }
                      className="hover:bg-slate-50 transition"
                    >

                      {/* ID */}

                      <td className="px-6 py-5 text-sm text-slate-500">
                        #{ders.id}
                      </td>


                      {/* DERS */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                            📚
                          </div>


                          <div>

                            <p className="font-semibold text-slate-800">
                              {ders.dersAdi}
                            </p>

                            <p className="text-xs text-slate-400 mt-0.5">
                              CampusOS Dersi
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* DERS KODU */}

                      <td className="px-6 py-5">

                        <span className="inline-flex bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          {ders.dersKodu}
                        </span>

                      </td>


                      {/* KREDİ */}

                      <td className="px-6 py-5">

                        <span className="inline-flex items-center gap-2 text-slate-700">

                          <span className="font-bold">
                            {ders.kredi}
                          </span>

                          <span className="text-sm text-slate-400">
                            kredi
                          </span>

                        </span>

                      </td>


                      {/* ==================================
                          ADMIN İŞLEMLERİ
                      ================================== */}

                      {adminMi && (
                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            {/* DÜZENLE */}

                            <button
                              type="button"
                              onClick={() =>
                                dersDuzenlemeyiBaslat(
                                  ders
                                )
                              }
                              className="
                                bg-amber-50
                                text-amber-700
                                hover:bg-amber-100
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                font-semibold
                                transition
                              "
                            >
                              Düzenle
                            </button>


                            {/* SİL */}

                            <button
                              type="button"
                              onClick={() =>
                                dersSil(
                                  ders.id
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
                              Sil
                            </button>

                          </div>

                        </td>
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>


          {/* ======================================
              HİÇ DERS YOK
          ====================================== */}

          {dersler.length === 0 && (
            <div className="p-10 text-center">

              <div className="text-4xl mb-3">
                📚
              </div>

              <p className="font-semibold text-slate-700">
                Henüz ders yok
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Sisteme eklenen dersler
                burada görüntülenecek.
              </p>

            </div>
          )}


          {/* ======================================
              ARAMA SONUCU YOK
          ====================================== */}

          {dersler.length > 0 &&
            filtrelenmisDersler.length === 0 && (
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

export default Dersler