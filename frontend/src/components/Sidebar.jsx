import { useState } from 'react'

function Sidebar({
  sayfa,
  setSayfa
}) {
  const [mobilMenuAcik, setMobilMenuAcik] =
    useState(false)

  const menu = [
    {
      id: 'dashboard',
      ad: 'Dashboard',
      ikon: '⌂'
    },
    {
      id: 'ogrenciler',
      ad: 'Öğrenciler',
      ikon: '👨‍🎓'
    },
    {
      id: 'dersler',
      ad: 'Dersler',
      ikon: '📚'
    },
    {
      id: 'kayitlar',
      ad: 'Kayıtlar',
      ikon: '📝'
    }
  ]

  const sayfaDegistir = (id) => {
    setSayfa(id)
    setMobilMenuAcik(false)
  }

  const MenuIcerigi = () => (
    <>
      {/* LOGO */}

      <div className="px-6 py-7 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
            C
          </div>

          <div>

            <h1 className="text-xl font-bold">
              CampusOS
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">
              Student Management
            </p>

          </div>

        </div>

      </div>


      {/* MENÜ */}

      <nav className="flex-1 px-4 py-6">

        <p className="px-3 mb-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Menü
        </p>

        <div className="space-y-2">

          {menu.map((item) => {

            const aktif =
              sayfa === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  sayfaDegistir(item.id)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-left
                  transition
                  ${
                    aktif
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >

                <span className="text-lg w-6 text-center">
                  {item.ikon}
                </span>

                <span className="font-medium">
                  {item.ad}
                </span>

                {aktif && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-white" />
                )}

              </button>
            )
          })}

        </div>

      </nav>


      {/* ALT BÖLÜM */}

      <div className="p-4 border-t border-slate-800">

        <div className="bg-slate-800 rounded-xl p-4">

          <div className="flex items-center gap-2">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />

            <p className="text-sm font-medium">
              Sistem Aktif
            </p>

          </div>

          <p className="text-xs text-slate-400 mt-2">
            CampusOS v1.0
          </p>

        </div>

      </div>
    </>
  )

  return (
    <>
      {/* ======================================
          MASAÜSTÜ SIDEBAR
      ====================================== */}

      <aside
        className="
          hidden
          lg:flex
          lg:w-64
          lg:min-h-screen
          lg:flex-shrink-0
          bg-slate-900
          text-white
          flex-col
        "
      >
        <MenuIcerigi />
      </aside>


      {/* ======================================
          MOBİL ÜST BAR
      ====================================== */}

      <div
        className="
          lg:hidden
          fixed
          top-0
          left-0
          right-0
          z-40
          h-16
          bg-slate-900
          text-white
          flex
          items-center
          justify-between
          px-4
          shadow-lg
        "
      >

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
            C
          </div>

          <div>

            <p className="font-bold leading-none">
              CampusOS
            </p>

            <p className="text-[10px] text-slate-400 mt-1">
              Student Management
            </p>

          </div>

        </div>


        {/* HAMBURGER */}

        <button
          type="button"
          onClick={() =>
            setMobilMenuAcik(true)
          }
          aria-label="Menüyü aç"
          className="
            w-10
            h-10
            rounded-xl
            bg-slate-800
            hover:bg-slate-700
            flex
            items-center
            justify-center
            text-2xl
          "
        >
          ☰
        </button>

      </div>


      {/* ======================================
          MOBİL OVERLAY
      ====================================== */}

      {mobilMenuAcik && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            z-50
          "
        >

          {/* KARANLIK ARKA PLAN */}

          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() =>
              setMobilMenuAcik(false)
            }
            className="
              absolute
              inset-0
              w-full
              h-full
              bg-black/50
            "
          />


          {/* MOBİL SIDEBAR */}

          <aside
            className="
              absolute
              top-0
              left-0
              bottom-0
              w-72
              max-w-[85vw]
              bg-slate-900
              text-white
              flex
              flex-col
              shadow-2xl
            "
          >

            {/* KAPAT */}

            <button
              type="button"
              onClick={() =>
                setMobilMenuAcik(false)
              }
              aria-label="Menüyü kapat"
              className="
                absolute
                top-5
                right-4
                z-10
                w-9
                h-9
                rounded-lg
                bg-slate-800
                hover:bg-slate-700
                flex
                items-center
                justify-center
                text-xl
              "
            >
              ×
            </button>

            <MenuIcerigi />

          </aside>

        </div>
      )}
    </>
  )
}

export default Sidebar