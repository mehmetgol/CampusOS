function Topbar({
  kullanici,
  cikisYap
}) {
  const adminMi =
    kullanici?.rol === 'Admin'

  const basHarf =
    kullanici?.ad
      ?.charAt(0)
      ?.toUpperCase() || 'K'

  return (
    <header className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-4 mb-8">

      <div className="flex items-center justify-between gap-4">

        {/* SOL TARAF */}

        <div>
          <p className="text-sm text-slate-400">
            CampusOS
          </p>

          <h2 className="text-lg font-semibold text-slate-800">
            Hoş geldiniz, {kullanici?.ad}
          </h2>
        </div>


        {/* SAĞ TARAF */}

        <div className="flex items-center gap-4">

          {/* KULLANICI */}

          <div className="hidden sm:flex items-center gap-3">

            <div className="text-right">

              <p className="font-semibold text-slate-800">
                {kullanici?.ad}{' '}
                {kullanici?.soyad}
              </p>

              <span
                className={
                  adminMi
                    ? 'inline-flex mt-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700'
                    : 'inline-flex mt-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700'
                }
              >
                {kullanici?.rol}
              </span>

            </div>


            {/* AVATAR */}

            <div
              className={
                `
                w-11
                h-11
                rounded-full
                flex
                items-center
                justify-center
                font-bold
                text-white
                ${
                  adminMi
                    ? 'bg-blue-600'
                    : 'bg-emerald-600'
                }
                `
              }
            >
              {basHarf}
            </div>

          </div>


          {/* AYIRICI */}

          <div className="hidden sm:block h-10 w-px bg-slate-200" />


          {/* ÇIKIŞ */}

          <button
            type="button"
            onClick={cikisYap}
            className="
              bg-red-50
              text-red-600
              hover:bg-red-600
              hover:text-white
              px-4
              py-2.5
              rounded-xl
              font-semibold
              transition
            "
          >
            Çıkış Yap
          </button>

        </div>

      </div>

    </header>
  )
}

export default Topbar