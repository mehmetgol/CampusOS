import { useEffect, useState } from 'react'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Ogrenciler from './pages/Ogrenciler'
import Dersler from './pages/Dersler'
import Kayitlar from './pages/Kayitlar'
import Login from './pages/Login'
import Register from './pages/Register'

const API_URL = 'http://localhost:5070'

function App() {
  // ==========================================
  // OTURUM
  // ==========================================

  const [token, setToken] = useState(() =>
    localStorage.getItem('token')
  )

  const [kullanici, setKullanici] = useState(() => {
    const kayitliKullanici =
      localStorage.getItem('kullanici')

    if (!kayitliKullanici) {
      return null
    }

    try {
      return JSON.parse(kayitliKullanici)
    } catch {
      localStorage.removeItem('kullanici')
      return null
    }
  })


  // ==========================================
  // AUTH EKRANI
  // ==========================================

  const [authEkrani, setAuthEkrani] =
    useState('login')


  // ==========================================
  // SAYFA
  // ==========================================

  const [sayfa, setSayfa] =
    useState('dashboard')


  // ==========================================
  // VERİLER
  // ==========================================

  const [ogrenciler, setOgrenciler] =
    useState([])

  const [dersler, setDersler] =
    useState([])

  const [kayitlar, setKayitlar] =
    useState([])


  // ==========================================
  // ÖĞRENCİ FORMU
  // ==========================================

  const [yeniOgrenci, setYeniOgrenci] =
    useState({
      ad: '',
      soyad: '',
      bolum: '',
      yas: ''
    })

  const [
    duzenlenenOgrenciId,
    setDuzenlenenOgrenciId
  ] = useState(null)


  // ==========================================
  // DERS FORMU
  // ==========================================

  const [yeniDers, setYeniDers] =
    useState({
      dersAdi: '',
      dersKodu: '',
      kredi: ''
    })

  const [
    duzenlenenDersId,
    setDuzenlenenDersId
  ] = useState(null)


  // ==========================================
  // KAYIT FORMU
  // ==========================================

  const [yeniKayit, setYeniKayit] =
    useState({
      ogrenciId: '',
      dersId: ''
    })


  // ==========================================
  // GENEL DURUMLAR
  // ==========================================

  const [yukleniyor, setYukleniyor] =
    useState(false)

  const [hata, setHata] =
    useState('')


  // ==========================================
  // LOGIN
  // ==========================================

  const loginYapildi = (
    girisYapanKullanici,
    yeniToken
  ) => {
    setKullanici(girisYapanKullanici)
    setToken(yeniToken)
    setSayfa('dashboard')
    setAuthEkrani('login')
  }


  // ==========================================
  // LOGOUT
  // ==========================================

  const cikisYap = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('kullanici')

    setToken(null)
    setKullanici(null)

    setOgrenciler([])
    setDersler([])
    setKayitlar([])

    setSayfa('dashboard')
    setAuthEkrani('login')
  }


  // ==========================================
  // AUTH HEADER
  // ==========================================

  const authHeaders = (
    jsonIcerik = false
  ) => {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    if (jsonIcerik) {
      headers['Content-Type'] =
        'application/json'
    }

    return headers
  }


  // ==========================================
  // RESPONSE KONTROL
  // ==========================================

  const responseKontrol = (
    response,
    varsayilanMesaj
  ) => {
    if (response.status === 401) {
      cikisYap()

      throw new Error(
        'Oturum süreniz doldu. Lütfen tekrar giriş yapın.'
      )
    }

    if (response.status === 403) {
      throw new Error(
        'Bu işlem için yetkiniz bulunmuyor.'
      )
    }

    if (!response.ok) {
      throw new Error(varsayilanMesaj)
    }
  }


  // ==========================================
  // VERİLERİ GETİR
  // ==========================================

  useEffect(() => {
    if (!token || !kullanici) {
      return
    }

    const verileriGetir = async () => {
      try {
        setYukleniyor(true)
        setHata('')

        const [
          ogrenciResponse,
          dersResponse,
          kayitResponse
        ] = await Promise.all([
          fetch(
            `${API_URL}/ogrenciler`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            `${API_URL}/dersler`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          ),

          fetch(
            `${API_URL}/kayitlar`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )
        ])

        if (
          ogrenciResponse.status === 401 ||
          dersResponse.status === 401 ||
          kayitResponse.status === 401
        ) {
          cikisYap()

          throw new Error(
            'Oturum süreniz doldu.'
          )
        }

        if (!ogrenciResponse.ok) {
          throw new Error(
            'Öğrenciler alınamadı.'
          )
        }

        if (!dersResponse.ok) {
          throw new Error(
            'Dersler alınamadı.'
          )
        }

        if (!kayitResponse.ok) {
          throw new Error(
            'Kayıtlar alınamadı.'
          )
        }

        const ogrenciData =
          await ogrenciResponse.json()

        const dersData =
          await dersResponse.json()

        const kayitData =
          await kayitResponse.json()

        setOgrenciler(ogrenciData)
        setDersler(dersData)
        setKayitlar(kayitData)

      } catch (error) {
        console.error(error)

        setHata(
          error.message ||
          'Backend bağlantısı kurulamadı.'
        )
      } finally {
        setYukleniyor(false)
      }
    }

    verileriGetir()

  }, [token])


  // ==========================================
  // KAYITLARI YENİLE
  // ==========================================

  const kayitlariYenile = async () => {
    try {
      const response = await fetch(
        `${API_URL}/kayitlar`,
        {
          headers: authHeaders()
        }
      )

      responseKontrol(
        response,
        'Kayıtlar alınamadı.'
      )

      const data =
        await response.json()

      setKayitlar(data)

    } catch (error) {
      console.error(error)
      alert(error.message)
    }
  }


  // ==========================================
  // ÖĞRENCİ EKLE
  // ==========================================

  const ogrenciEkle = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ogrenciler`,
        {
          method: 'POST',

          headers:
            authHeaders(true),

          body: JSON.stringify({
            ad: yeniOgrenci.ad,
            soyad: yeniOgrenci.soyad,
            bolum: yeniOgrenci.bolum,
            yas: Number(
              yeniOgrenci.yas
            )
          })
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      const eklenenOgrenci =
        await response.json()

      setOgrenciler((onceki) => [
        ...onceki,
        eklenenOgrenci
      ])

      setYeniOgrenci({
        ad: '',
        soyad: '',
        bolum: '',
        yas: ''
      })

      alert(
        'Öğrenci başarıyla eklendi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Öğrenci eklenirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // ÖĞRENCİ DÜZENLE
  // ==========================================

  const ogrenciDuzenlemeyiBaslat = (
    ogrenci
  ) => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    setDuzenlenenOgrenciId(
      ogrenci.id
    )

    setYeniOgrenci({
      ad: ogrenci.ad,
      soyad: ogrenci.soyad,
      bolum: ogrenci.bolum,
      yas: ogrenci.yas
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // ==========================================
  // ÖĞRENCİ GÜNCELLE
  // ==========================================

  const ogrenciGuncelle = async () => {
    try {
      const response = await fetch(
        `${API_URL}/ogrenciler/${duzenlenenOgrenciId}`,
        {
          method: 'PUT',

          headers:
            authHeaders(true),

          body: JSON.stringify({
            ad: yeniOgrenci.ad,
            soyad: yeniOgrenci.soyad,
            bolum: yeniOgrenci.bolum,
            yas: Number(
              yeniOgrenci.yas
            )
          })
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      const guncellenenOgrenci =
        await response.json()

      setOgrenciler((onceki) =>
        onceki.map((ogrenci) =>
          ogrenci.id ===
          duzenlenenOgrenciId
            ? guncellenenOgrenci
            : ogrenci
        )
      )

      setKayitlar((onceki) =>
        onceki.map((kayit) =>
          kayit.ogrenciId ===
          duzenlenenOgrenciId
            ? {
                ...kayit,
                ogrenci:
                  guncellenenOgrenci
              }
            : kayit
        )
      )

      setYeniOgrenci({
        ad: '',
        soyad: '',
        bolum: '',
        yas: ''
      })

      setDuzenlenenOgrenciId(null)

      alert(
        'Öğrenci başarıyla güncellendi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Öğrenci güncellenirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // ÖĞRENCİ DÜZENLEME İPTAL
  // ==========================================

  const ogrenciDuzenlemeyiIptalEt =
    () => {
      setDuzenlenenOgrenciId(null)

      setYeniOgrenci({
        ad: '',
        soyad: '',
        bolum: '',
        yas: ''
      })
    }


  // ==========================================
  // ÖĞRENCİ SİL
  // ==========================================

  const ogrenciSil = async (id) => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    const onay = window.confirm(
      'Bu öğrenciyi silmek istediğinize emin misiniz?'
    )

    if (!onay) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/ogrenciler/${id}`,
        {
          method: 'DELETE',
          headers: authHeaders()
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      setOgrenciler((onceki) =>
        onceki.filter(
          (ogrenci) =>
            ogrenci.id !== id
        )
      )

      setKayitlar((onceki) =>
        onceki.filter(
          (kayit) =>
            kayit.ogrenciId !== id
        )
      )

      alert(
        'Öğrenci başarıyla silindi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Öğrenci silinirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // DERS EKLE
  // ==========================================

  const dersEkle = async () => {
    try {
      const response = await fetch(
        `${API_URL}/dersler`,
        {
          method: 'POST',

          headers:
            authHeaders(true),

          body: JSON.stringify({
            dersAdi:
              yeniDers.dersAdi,

            dersKodu:
              yeniDers.dersKodu,

            kredi: Number(
              yeniDers.kredi
            )
          })
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      const eklenenDers =
        await response.json()

      setDersler((onceki) => [
        ...onceki,
        eklenenDers
      ])

      setYeniDers({
        dersAdi: '',
        dersKodu: '',
        kredi: ''
      })

      alert(
        'Ders başarıyla eklendi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Ders eklenirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // DERS DÜZENLE
  // ==========================================

  const dersDuzenlemeyiBaslat = (
    ders
  ) => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    setDuzenlenenDersId(
      ders.id
    )

    setYeniDers({
      dersAdi: ders.dersAdi,
      dersKodu: ders.dersKodu,
      kredi: ders.kredi
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // ==========================================
  // DERS GÜNCELLE
  // ==========================================

  const dersGuncelle = async () => {
    try {
      const response = await fetch(
        `${API_URL}/dersler/${duzenlenenDersId}`,
        {
          method: 'PUT',

          headers:
            authHeaders(true),

          body: JSON.stringify({
            dersAdi:
              yeniDers.dersAdi,

            dersKodu:
              yeniDers.dersKodu,

            kredi: Number(
              yeniDers.kredi
            )
          })
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      const guncellenenDers =
        await response.json()

      setDersler((onceki) =>
        onceki.map((ders) =>
          ders.id ===
          duzenlenenDersId
            ? guncellenenDers
            : ders
        )
      )

      setKayitlar((onceki) =>
        onceki.map((kayit) =>
          kayit.dersId ===
          duzenlenenDersId
            ? {
                ...kayit,
                ders:
                  guncellenenDers
              }
            : kayit
        )
      )

      setYeniDers({
        dersAdi: '',
        dersKodu: '',
        kredi: ''
      })

      setDuzenlenenDersId(null)

      alert(
        'Ders başarıyla güncellendi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Ders güncellenirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // DERS DÜZENLEME İPTAL
  // ==========================================

  const dersDuzenlemeyiIptalEt =
    () => {
      setDuzenlenenDersId(null)

      setYeniDers({
        dersAdi: '',
        dersKodu: '',
        kredi: ''
      })
    }


  // ==========================================
  // DERS SİL
  // ==========================================

  const dersSil = async (id) => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    const onay = window.confirm(
      'Bu dersi silmek istediğinize emin misiniz?'
    )

    if (!onay) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/dersler/${id}`,
        {
          method: 'DELETE',
          headers: authHeaders()
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      setDersler((onceki) =>
        onceki.filter(
          (ders) =>
            ders.id !== id
        )
      )

      setKayitlar((onceki) =>
        onceki.filter(
          (kayit) =>
            kayit.dersId !== id
        )
      )

      if (
        duzenlenenDersId === id
      ) {
        setDuzenlenenDersId(null)

        setYeniDers({
          dersAdi: '',
          dersKodu: '',
          kredi: ''
        })
      }

      alert(
        'Ders başarıyla silindi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Ders silinirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // KAYIT EKLE
  // ==========================================

  const kayitEkle = async () => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    if (!yeniKayit.ogrenciId) {
      alert(
        'Lütfen bir öğrenci seçin.'
      )
      return
    }

    if (!yeniKayit.dersId) {
      alert(
        'Lütfen bir ders seçin.'
      )
      return
    }

    try {
      const ogrenciId =
        Number(
          yeniKayit.ogrenciId
        )

      const dersId =
        Number(
          yeniKayit.dersId
        )

      const response = await fetch(
        `${API_URL}/kayitlar?ogrenciId=${ogrenciId}&dersId=${dersId}`,
        {
          method: 'POST',
          headers: authHeaders()
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      await kayitlariYenile()

      setYeniKayit({
        ogrenciId: '',
        dersId: ''
      })

      alert(
        'Öğrenci derse başarıyla kaydedildi!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Ders kaydı yapılırken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // KAYIT SİL
  // ==========================================

  const kayitSil = async (
    ogrenciId,
    dersId
  ) => {
    if (
      kullanici?.rol !== 'Admin'
    ) {
      alert(
        'Bu işlem sadece Admin tarafından yapılabilir.'
      )
      return
    }

    const onay = window.confirm(
      'Öğrenciyi bu dersten çıkarmak istediğinize emin misiniz?'
    )

    if (!onay) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/kayitlar?ogrenciId=${ogrenciId}&dersId=${dersId}`,
        {
          method: 'DELETE',
          headers: authHeaders()
        }
      )

      if (response.status === 401) {
        cikisYap()
        return
      }

      if (response.status === 403) {
        alert(
          'Bu işlem sadece Admin tarafından yapılabilir.'
        )
        return
      }

      if (!response.ok) {
        const mesaj =
          await response.text()

        alert(mesaj)
        return
      }

      setKayitlar((onceki) =>
        onceki.filter(
          (kayit) =>
            !(
              kayit.ogrenciId ===
                ogrenciId &&
              kayit.dersId ===
                dersId
            )
        )
      )

      alert(
        'Öğrenci dersten çıkarıldı!'
      )

    } catch (error) {
      console.error(error)

      alert(
        'Kayıt silinirken bağlantı hatası oluştu.'
      )
    }
  }


  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

  if (!token || !kullanici) {
    if (authEkrani === 'register') {
      return (
        <Register
          onRegisterSuccess={() =>
            setAuthEkrani('login')
          }
          onLoginClick={() =>
            setAuthEkrani('login')
          }
        />
      )
    }

    return (
      <Login
        onLogin={loginYapildi}
        onRegisterClick={() =>
          setAuthEkrani('register')
        }
      />
    )
  }


  // ==========================================
  // ANA ARAYÜZ
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <Sidebar
        sayfa={sayfa}
        setSayfa={setSayfa}
      />


      <main
        className="
          flex-1
          min-w-0
          w-full
          pt-20
          px-4
          pb-6
          sm:px-6
          lg:p-10
        "
      >

        {/* ==========================
            TOPBAR
        ========================== */}

        <Topbar
          kullanici={kullanici}
          cikisYap={cikisYap}
        />


        {/* ==========================
            DASHBOARD
        ========================== */}

        {sayfa === 'dashboard' && (
          <Dashboard
            ogrenciler={ogrenciler}
            dersler={dersler}
            kayitlar={kayitlar}
            yukleniyor={yukleniyor}
            hata={hata}
          />
        )}


        {/* ==========================
            ÖĞRENCİLER
        ========================== */}

        {sayfa === 'ogrenciler' && (
          <Ogrenciler
            ogrenciler={ogrenciler}

            yeniOgrenci={
              yeniOgrenci
            }

            setYeniOgrenci={
              setYeniOgrenci
            }

            duzenlenenOgrenciId={
              duzenlenenOgrenciId
            }

            ogrenciEkle={
              ogrenciEkle
            }

            ogrenciGuncelle={
              ogrenciGuncelle
            }

            ogrenciDuzenlemeyiBaslat={
              ogrenciDuzenlemeyiBaslat
            }

            ogrenciDuzenlemeyiIptalEt={
              ogrenciDuzenlemeyiIptalEt
            }

            ogrenciSil={
              ogrenciSil
            }

            yukleniyor={
              yukleniyor
            }

            hata={
              hata
            }

            kullanici={
              kullanici
            }
          />
        )}


        {/* ==========================
            DERSLER
        ========================== */}

        {sayfa === 'dersler' && (
          <Dersler
            dersler={dersler}

            yeniDers={
              yeniDers
            }

            setYeniDers={
              setYeniDers
            }

            duzenlenenDersId={
              duzenlenenDersId
            }

            dersEkle={
              dersEkle
            }

            dersGuncelle={
              dersGuncelle
            }

            dersDuzenlemeyiBaslat={
              dersDuzenlemeyiBaslat
            }

            dersDuzenlemeyiIptalEt={
              dersDuzenlemeyiIptalEt
            }

            dersSil={
              dersSil
            }

            yukleniyor={
              yukleniyor
            }

            hata={
              hata
            }

            kullanici={
              kullanici
            }
          />
        )}


        {/* ==========================
            KAYITLAR
        ========================== */}

        {sayfa === 'kayitlar' && (
          <Kayitlar
            ogrenciler={
              ogrenciler
            }

            dersler={
              dersler
            }

            kayitlar={
              kayitlar
            }

            yeniKayit={
              yeniKayit
            }

            setYeniKayit={
              setYeniKayit
            }

            kayitEkle={
              kayitEkle
            }

            kayitSil={
              kayitSil
            }

            yukleniyor={
              yukleniyor
            }

            hata={
              hata
            }

            kullanici={
              kullanici
            }
          />
        )}

      </main>

    </div>
  )
}

export default App