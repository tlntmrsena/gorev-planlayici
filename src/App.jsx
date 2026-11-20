
import { useEffect, useState } from "react";
import "./App.css";

const KATEGORILER = ["Eğitim", "İş", "Kişisel"];
const ONCELIKLER = ["Düşük", "Orta", "Yüksek"];

const bosForm = {
  baslik: "",
  kategori: "Eğitim",
  oncelik: "Orta",
  tarih: new Date().toLocaleDateString("en-CA"),
};

function App() {
  const [gorevler, setGorevler] = useState(() => {
    try {
      const veri = JSON.parse(localStorage.getItem("gorevler") || "[]");
      return Array.isArray(veri) ? veri : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({ ...bosForm });
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [arama, setArama] = useState("");
  const [filtre, setFiltre] = useState("Tümü");

  useEffect(() => {
    localStorage.setItem("gorevler", JSON.stringify(gorevler));
  }, [gorevler]);

  const alanDegistir = (e) => {
    setForm((onceki) => ({
      ...onceki,
      [e.target.name]: e.target.value,
    }));
  };

  const formuTemizle = () => {
    setForm({
      ...bosForm,
      tarih: new Date().toLocaleDateString("en-CA"),
    });
    setDuzenlenenId(null);
  };

  const gorevKaydet = (e) => {
    e.preventDefault();

    if (!form.baslik.trim()) {
      alert("Lütfen görev başlığını yazın.");
      return;
    }

    if (duzenlenenId !== null) {
      setGorevler((onceki) =>
        onceki.map((g) =>
          g.id === duzenlenenId
            ? { ...g, ...form, baslik: form.baslik.trim() }
            : g
        )
      );
    } else {
      const yeniGorev = {
        ...form,
        id: crypto.randomUUID(),
        baslik: form.baslik.trim(),
        tamamlandi: false,
      };

      setGorevler((onceki) => [...onceki, yeniGorev]);
    }

    formuTemizle();
  };

  const gorevDuzenle = (gorev) => {
    setDuzenlenenId(gorev.id);
    setForm({
      baslik: gorev.baslik,
      kategori: gorev.kategori || "Eğitim",
      oncelik: gorev.oncelik || "Orta",
      tarih: gorev.tarih || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gorevSil = (id) => {
    if (!window.confirm("Bu görevi silmek istiyor musunuz?")) {
      return;
    }

    setGorevler((onceki) =>
      onceki.filter((g) => g.id !== id)
    );

    if (duzenlenenId === id) {
      formuTemizle();
    }
  };

  const gorevTamamla = (id) => {
    setGorevler((onceki) =>
      onceki.map((g) =>
        g.id === id
          ? { ...g, tamamlandi: !g.tamamlandi }
          : g
      )
    );
  };

  const toplam = gorevler.length;
  const tamamlanan = gorevler.filter((g) => g.tamamlandi).length;
  const bekleyen = toplam - tamamlanan;

  const filtreliGorevler = gorevler.filter((g) => {
    const aramaUyumu = g.baslik
      .toLocaleLowerCase("tr-TR")
      .includes(arama.toLocaleLowerCase("tr-TR"));

    const filtreUyumu =
      filtre === "Tümü" ||
      (filtre === "Tamamlanan" && g.tamamlandi) ||
      (filtre === "Bekleyen" && !g.tamamlandi) ||
      g.kategori === filtre;

    return aramaUyumu && filtreUyumu;
  });

  return (
    <div className="uygulama">
      <header className="ust-alan">
        <div className="logo">✓</div>
        <div>
          <h1>Günlük Planım</h1>
          <p>Görevlerini düzenle, hedeflerine ulaş.</p>
        </div>
      </header>

      <section className="istatistikler">
        <div className="istatistik mor">
          <span>Toplam Görev</span>
          <strong>{toplam}</strong>
          <small>Oluşturulan görevler</small>
        </div>

        <div className="istatistik yesil">
          <span>Tamamlanan</span>
          <strong>{tamamlanan}</strong>
          <small>Başarıyla bitirilen</small>
        </div>

        <div className="istatistik turuncu">
          <span>Bekleyen</span>
          <strong>{bekleyen}</strong>
          <small>Yapılacak görevler</small>
        </div>
      </section>

      <section className="panel">
        <h2>
          {duzenlenenId !== null
            ? "Görevi Düzenle"
            : "Yeni Görev Oluştur"}
        </h2>

        <p className="panel-aciklama">
          Gününü planlamak için yeni bir görev oluştur.
        </p>

        <form onSubmit={gorevKaydet} className="gorev-formu">
          <div className="form-grup tam">
            <label htmlFor="baslik">Görev Başlığı</label>
            <input
              id="baslik"
              name="baslik"
              type="text"
              placeholder="Örn: React projesini tamamla"
              value={form.baslik}
              onChange={alanDegistir}
              maxLength={150}
              required
            />
          </div>

          <div className="form-grup">
            <label htmlFor="kategori">Kategori</label>
            <select
              id="kategori"
              name="kategori"
              value={form.kategori}
              onChange={alanDegistir}
            >
              {KATEGORILER.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="form-grup">
            <label htmlFor="oncelik">Öncelik</label>
            <select
              id="oncelik"
              name="oncelik"
              value={form.oncelik}
              onChange={alanDegistir}
            >
              {ONCELIKLER.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="form-grup tam">
            <label htmlFor="tarih">Görev Tarihi</label>
            <input
              id="tarih"
              name="tarih"
              type="date"
              value={form.tarih}
              onChange={alanDegistir}
              required
            />
          </div>

          <div className="form-butonlari tam">
            <button type="submit" className="ana-buton">
              {duzenlenenId !== null
                ? "Değişiklikleri Kaydet"
                : "+ Görev Ekle"}
            </button>

            {duzenlenenId !== null && (
              <button
                type="button"
                className="ikincil-buton"
                onClick={formuTemizle}
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="liste-baslik">
          <div>
            <h2>Görevlerim</h2>
            <p className="panel-aciklama">
              Günlük görevlerini buradan takip edebilirsin.
            </p>
          </div>
          <span className="gorev-sayisi">
            {filtreliGorevler.length} görev
          </span>
        </div>

        <div className="filtre-alani">
          <input
            type="search"
            placeholder="Görev ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            aria-label="Görev ara"
          />

          <select
            value={filtre}
            onChange={(e) => setFiltre(e.target.value)}
            aria-label="Görevleri filtrele"
          >
            <option value="Tümü">Tüm Görevler</option>
            <option value="Bekleyen">Bekleyen</option>
            <option value="Tamamlanan">Tamamlanan</option>
            {KATEGORILER.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="gorev-listesi">
          {filtreliGorevler.length === 0 ? (
            <div className="bos-durum">
              <div className="bos-ikon">✓</div>
              <h3>Görev bulunamadı</h3>
              <p>
                Yeni bir görev ekleyebilir veya filtreyi değiştirebilirsin.
              </p>
            </div>
          ) : (
            filtreliGorevler.map((g) => (
              <article
                key={g.id}
                className={`gorev-karti ${
                  g.tamamlandi ? "gorev-bitti" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="gorev-checkbox"
                  checked={Boolean(g.tamamlandi)}
                  onChange={() => gorevTamamla(g.id)}
                  aria-label={`${g.baslik} tamamlandı`}
                />

                <div className="gorev-icerik">
                  <h3>{g.baslik}</h3>

                  <div className="gorev-etiketleri">
                    <span className="etiket kategori">
                      {g.kategori || "Eğitim"}
                    </span>

                    <span
                      className={`etiket oncelik-${(
                        g.oncelik || "Orta"
                      ).toLocaleLowerCase("tr-TR")}`}
                    >
                      {g.oncelik || "Orta"} Öncelik
                    </span>

                    {g.tarih && (
                      <span className="tarih">
                        {g.tarih}
                      </span>
                    )}
                  </div>
                </div>

                <div className="gorev-islemleri">
                  <button
                    type="button"
                    className="duzenle-buton"
                    onClick={() => gorevDuzenle(g)}
                  >
                    Düzenle
                  </button>

                  <button
                    type="button"
                    className="sil-buton"
                    onClick={() => gorevSil(g.id)}
                  >
                    Sil
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <footer>
        Görev ve Günlük Planlayıcı · React + Vite
      </footer>
    </div>
  );
}

export default App;
