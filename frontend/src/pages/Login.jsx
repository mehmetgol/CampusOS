import { useState } from 'react'

function Login({
  onLogin,
  onRegisterClick
}) {
  const [email, setEmail] =
    useState('')

  const [sifre, setSifre] =
    useState('')

  const [hata, setHata] =
    useState('')

  const [yukleniyor, setYukleniyor] =
    useState(false)

  const girisYap = async (e) => {
    e.preventDefault()

    setHata('')
    setYukleniyor(true)

    try {
      const response = await fetch(
        'http://localhost:5070/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            email,
            sifre
          })
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            'Email veya şifre hatalı.'
          )
        }

        throw new Error(
          'Giriş sırasında bir hata oluştu.'
        )
      }

      const data =
        await response.json()

      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'kullanici',
        JSON.stringify(
          data.kullanici
        )
      )

      onLogin(
        data.kullanici,
        data.token
      )
    }
    catch (error) {
      setHata(error.message)
    }
    finally {
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ==========================
          SOL TARAF
      ========================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700" />

        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">

          {/* LOGO */}

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center text-xl font-bold border border-white/20">
              C
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                CampusOS
              </h1>

              <p className="text-blue-100 text-sm">
                Student Management
              </p>
            </div>

          </div>


          {/* ORTA ALAN */}

          <div className="max-w-lg">

            <p className="text-blue-200 font-semibold mb-4">
              CAMPUS MANAGEMENT SYSTEM
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Kampüs yönetimini
              tek bir yerde
              yönetin.
            </h2>

            <p className="text-blue-100 text-lg mt-6 leading-8">
              Öğrenciler, dersler ve ders
              kayıtları için modern ve güvenli
              bir yönetim sistemi.
            </p>


            <div className="grid grid-cols-3 gap-4 mt-10">

              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-2">
                  👨‍🎓
                </div>

                <p className="text-sm font-semibold">
                  Öğrenciler
                </p>
              </div>


              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-2">
                  📚
                </div>

                <p className="text-sm font-semibold">
                  Dersler
                </p>
              </div>


              <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-2">
                  📝
                </div>

                <p className="text-sm font-semibold">
                  Kayıtlar
                </p>
              </div>

            </div>

          </div>


          {/* ALT */}

          <p className="text-sm text-blue-200">
            CampusOS v1.0
          </p>

        </div>

      </div>


      {/* ==========================
          LOGIN
      ========================== */}

      <div className="w-full lg:w-1/2 bg-slate-50 flex items-center justify-center p-6">

        <div className="w-full max-w-md">

          {/* MOBİL LOGO */}

          <div className="lg:hidden text-center mb-8">

            <div className="w-14 h-14 mx-auto bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
              C
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mt-4">
              CampusOS
            </h1>

          </div>


          {/* LOGIN CARD */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">

            <div>

              <p className="text-sm font-semibold text-blue-600">
                HOŞ GELDİNİZ
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Hesabınıza giriş yapın
              </h2>

              <p className="text-slate-500 mt-3">
                CampusOS yönetim paneline
                devam etmek için bilgilerinizi
                girin.
              </p>

            </div>


            <form
              onSubmit={girisYap}
              className="space-y-5 mt-8"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="ornek@campusos.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-xl
                    px-4
                    py-3.5
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* ŞİFRE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Şifre
                </label>

                <input
                  type="password"
                  value={sifre}
                  onChange={(e) =>
                    setSifre(
                      e.target.value
                    )
                  }
                  placeholder="Şifrenizi girin"
                  required
                  autoComplete="current-password"
                  className="
                    w-full
                    border
                    border-slate-300
                    rounded-xl
                    px-4
                    py-3.5
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* HATA */}

              {hata && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                  {hata}
                </div>
              )}


              {/* LOGIN */}

              <button
                type="submit"
                disabled={yukleniyor}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-slate-400
                  text-white
                  py-3.5
                  rounded-xl
                  font-semibold
                  transition
                  shadow-sm
                "
              >
                {yukleniyor
                  ? 'Giriş yapılıyor...'
                  : 'Giriş Yap'}
              </button>

            </form>


            {/* REGISTER */}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">

              <p className="text-sm text-slate-500">
                CampusOS hesabınız yok mu?
              </p>

              <button
                type="button"
                onClick={
                  onRegisterClick
                }
                className="mt-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Yeni hesap oluştur
              </button>

            </div>

          </div>


          {/* FOOTER */}

          <p className="text-center text-xs text-slate-400 mt-6">
            CampusOS • Student Management System
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login