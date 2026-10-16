function Dashboard({
  ogrenciler,
  dersler,
  kayitlar,
  yukleniyor,
  hata
}) {
  const toplamOgrenci =
    ogrenciler.length

  const toplamDers =
    dersler.length

  const toplamKayit =
    kayitlar.length

  return (
    <div className="space-y-8">

      {/* ==========================
          BAŞLIK
      ========================== */}

      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-slate-500 mt-2">
          CampusOS öğrenci yönetim sistemine
          hoş geldiniz.
        </p>
      </div>


      {/* ==========================
          HATA
      ========================== */}

      {hata && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          <p className="font-semibold">
            Bir sorun oluştu
          </p>

          <p className="text-sm mt-1">
            {hata}
          </p>
        </div>
      )}


      {/* ==========================
          İSTATİSTİK KARTLARI
      ========================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* ÖĞRENCİ */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Toplam Öğrenci
              </p>

              <p className="text-4xl font-bold text-slate-800 mt-3">
                {yukleniyor
                  ? '...'
                  : toplamOgrenci}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
              👨‍🎓
            </div>

          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Sistemde kayıtlı öğrenciler
            </p>
          </div>

        </div>


        {/* DERS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Toplam Ders
              </p>

              <p className="text-4xl font-bold text-slate-800 mt-3">
                {yukleniyor
                  ? '...'
                  : toplamDers}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
              📚
            </div>

          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Aktif dersler
            </p>
          </div>

        </div>


        {/* KAYIT */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Toplam Ders Kaydı
              </p>

              <p className="text-4xl font-bold text-slate-800 mt-3">
                {yukleniyor
                  ? '...'
                  : toplamKayit}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl">
              📝
            </div>

          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Öğrenci-ders eşleşmeleri
            </p>
          </div>

        </div>

      </div>


      {/* ==========================
          ALT BÖLÜM
      ========================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SİSTEM DURUMU */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <h3 className="text-lg font-bold text-slate-800">
            Sistem Durumu
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            CampusOS servislerinin genel durumu
          </p>


          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Backend API
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">

                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />

                Aktif

              </span>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Veritabanı
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">

                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />

                Bağlı

              </span>

            </div>


            <div className="flex items-center justify-between">

              <span className="text-slate-600">
                Kimlik Doğrulama
              </span>

              <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">

                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />

                JWT Aktif

              </span>

            </div>

          </div>

        </div>


        {/* CAMPUSOS */}

        <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-blue-400 text-sm font-semibold">
                CAMPUSOS
              </p>

              <h3 className="text-2xl font-bold mt-2">
                Kampüs yönetimi
                artık daha kolay.
              </h3>

            </div>

            <div className="text-4xl">
              🎓
            </div>

          </div>


          <p className="text-slate-400 mt-5 leading-7">
            Öğrencileri, dersleri ve ders
            kayıtlarını tek bir sistem
            üzerinden yönetin.
          </p>


          <div className="mt-6 flex flex-wrap gap-2">

            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              React
            </span>

            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              ASP.NET Core
            </span>

            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              SQL Server
            </span>

            <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs text-slate-300">
              JWT
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard