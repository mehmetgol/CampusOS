import { useState } from 'react'

function Register({
  onRegisterSuccess,
  onLoginClick
}) {
  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    email: '',
    sifre: ''
  })

  const [hata, setHata] =
    useState('')

  const [basari, setBasari] =
    useState('')

  const [yukleniyor, setYukleniyor] =
    useState(false)


  // ==========================================
  // FORM DEĞİŞİKLİĞİ
  // ==========================================

  const formDegistir = (e) => {
    const {
      name,
      value
    } = e.target

    setForm((onceki) => ({
      ...onceki,
      [name]: value
    }))
  }


  // ==========================================
  // KAYIT OL
  // ==========================================

  const kayitOl = async (e) => {
    e.preventDefault()

    setHata('')
    setBasari('')


    // ========================================
    // FORM KONTROL
    // ========================================

    if (
      !form.ad.trim() ||
      !form.soyad.trim() ||
      !form.email.trim() ||
      !form.sifre
    ) {
      setHata(
        'Lütfen tüm alanları doldurun.'
      )

      return
    }


    if (form.sifre.length < 6) {
      setHata(
        'Şifre en az 6 karakter olmalıdır.'
      )

      return
    }


    setYukleniyor(true)


    try {
      const response = await fetch(
        'http://localhost:5070/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            ad: form.ad.trim(),
            soyad: form.soyad.trim(),
            email: form.email.trim(),
            sifre: form.sifre
          })
        }
      )


      if (!response.ok) {
        const mesaj =
          await response.text()

        if (
          response.status === 409
        ) {
          throw new Error(
            'Bu email adresi zaten kullanılıyor.'
          )
        }

        throw new Error(
          mesaj ||
          'Kayıt sırasında bir hata oluştu.'
        )
      }


      setForm({
        ad: '',
        soyad: '',
        email: '',
        sifre: ''
      })


      setBasari(
        'Hesabınız başarıyla oluşturuldu. Giriş ekranına yönlendiriliyorsunuz...'
      )


      setTimeout(() => {
        onRegisterSuccess()
      }, 1000)
    }
    catch (error) {
      setHata(
        error.message ||
        'Kayıt sırasında bir hata oluştu.'
      )
    }
    finally {
      setYukleniyor(false)
    }
  }


  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ======================================
          SOL TARAF
      ====================================== */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-blue-600 to-blue-700" />


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


          {/* ORTA */}

          <div className="max-w-lg">

            <p className="text-blue-200 font-semibold mb-4">
              CAMPUSOS
            </p>

            <h2 className="text-5xl font-bold leading-tight">
              Kampüsünüze
              katılmaya hazır
              mısınız?
            </h2>

            <p className="text-blue-100 text-lg mt-6 leading-8">
              Hesabınızı oluşturun ve
              CampusOS üzerinden öğrencileri,
              dersleri ve kayıtları
              görüntülemeye başlayın.
            </p>


            <div className="space-y-4 mt-10">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  ✓
                </div>

                <p className="text-blue-50">
                  Güvenli kullanıcı hesabı
                </p>

              </div>


              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  ✓
                </div>

                <p className="text-blue-50">
                  JWT tabanlı kimlik doğrulama
                </p>

              </div>


              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  ✓
                </div>

                <p className="text-blue-50">
                  Rol tabanlı yetkilendirme
                </p>

              </div>

            </div>

          </div>


          <p className="text-sm text-blue-200">
            CampusOS v1.0
          </p>

        </div>

      </div>


      {/* ======================================
          REGISTER TARAFI
      ====================================== */}

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


          {/* REGISTER CARD */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10">

            <div>

              <p className="text-sm font-semibold text-blue-600">
                YENİ HESAP
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Hesap oluşturun
              </h2>

              <p className="text-slate-500 mt-3">
                CampusOS'a katılmak için
                bilgilerinizi girin.
              </p>

            </div>


            {/* ==================================
                FORM
            ================================== */}

            <form
              onSubmit={kayitOl}
              className="space-y-5 mt-8"
            >

              {/* AD + SOYAD */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ad
                  </label>

                  <input
                    type="text"
                    name="ad"
                    value={form.ad}
                    onChange={formDegistir}
                    placeholder="Adınız"
                    required
                    autoComplete="given-name"
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


                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Soyad
                  </label>

                  <input
                    type="text"
                    name="soyad"
                    value={form.soyad}
                    onChange={formDegistir}
                    placeholder="Soyadınız"
                    required
                    autoComplete="family-name"
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

              </div>


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={formDegistir}
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
                  name="sifre"
                  value={form.sifre}
                  onChange={formDegistir}
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
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

                <p className="text-xs text-slate-400 mt-2">
                  Şifreniz en az 6 karakter
                  olmalıdır.
                </p>

              </div>


              {/* HATA */}

              {hata && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
                  {hata}
                </div>
              )}


              {/* BAŞARI */}

              {basari && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm">
                  {basari}
                </div>
              )}


              {/* KAYIT BUTONU */}

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
                  ? 'Hesap oluşturuluyor...'
                  : 'Hesap Oluştur'}
              </button>

            </form>


            {/* ==================================
                LOGIN
            ================================== */}

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">

              <p className="text-sm text-slate-500">
                Zaten CampusOS hesabınız var mı?
              </p>

              <button
                type="button"
                onClick={onLoginClick}
                className="mt-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Giriş ekranına dön
              </button>

            </div>

          </div>


          <p className="text-center text-xs text-slate-400 mt-6">
            CampusOS • Student Management System
          </p>

        </div>

      </div>

    </div>
  )
}

export default Register