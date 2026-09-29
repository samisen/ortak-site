"use client";

import { useMemo, useState } from "react";
import { Button, Segmented, Select, Switch, Empty, Slider, Tooltip, App } from "antd";
import { BellOutlined, ReloadOutlined } from "@ant-design/icons";
import TalepKarti from "@/components/talep-karti";
import { TALEPLER, SEHIRLER, TURLER, KATEGORI_METIN, SATICI } from "@/lib/data";
import type { Kategori } from "@/lib/types";

type KategoriFiltre = Kategori | "hepsi";
type Siralama = "uyum" | "yeni" | "butceAzalan" | "biten";

/** Farklı para birimlerini kaba bir TL karşılığıyla aynı eksene indirir (sadece filtre/sıralama için) */
const KUR = { TRY: 1, USD: 41, EUR: 48 };
const tlKarsilik = (tutar: number, pb: keyof typeof KUR) => tutar * KUR[pb];

export default function TaleplerSayfasi() {
  const { message } = App.useApp();
  const [kategori, setKategori] = useState<KategoriFiltre>("hepsi");
  const [sehir, setSehir] = useState<string[]>([]);
  const [tur, setTur] = useState<string[]>([]);
  const [butceBelgeli, setButceBelgeli] = useState(false);
  const [sadeceUyumlu, setSadeceUyumlu] = useState(false);
  const [butceAraligi, setButceAraligi] = useState<[number, number]>([0, 600]);
  const [siralama, setSiralama] = useState<Siralama>("uyum");

  const sonuclar = useMemo(() => {
    const liste = TALEPLER.filter((t) => {
      if (kategori !== "hepsi" && t.kategori !== kategori) return false;
      if (sehir.length && !sehir.includes(t.sehir)) return false;
      if (tur.length && !tur.includes(t.tur)) return false;
      if (butceBelgeli && !t.rozetler.includes("butce")) return false;
      if (sadeceUyumlu && t.uyum < 80) return false;
      const tavanMn = tlKarsilik(t.butceMax, t.paraBirimi) / 1_000_000;
      const tabanMn = tlKarsilik(t.butceMin, t.paraBirimi) / 1_000_000;
      if (tavanMn < butceAraligi[0] || tabanMn > butceAraligi[1]) return false;
      return true;
    });

    return liste.sort((a, b) => {
      if (siralama === "uyum") return b.uyum - a.uyum;
      if (siralama === "yeni") return +new Date(b.yayin) - +new Date(a.yayin);
      if (siralama === "biten") return +new Date(a.sonGecerlilik) - +new Date(b.sonGecerlilik);
      return tlKarsilik(b.butceMax, b.paraBirimi) - tlKarsilik(a.butceMax, a.paraBirimi);
    });
  }, [kategori, sehir, tur, butceBelgeli, sadeceUyumlu, butceAraligi, siralama]);

  const filtreVar =
    kategori !== "hepsi" || sehir.length > 0 || tur.length > 0 || butceBelgeli || sadeceUyumlu ||
    butceAraligi[0] !== 0 || butceAraligi[1] !== 600;

  function temizle() {
    setKategori("hepsi");
    setSehir([]);
    setTur([]);
    setButceBelgeli(false);
    setSadeceUyumlu(false);
    setButceAraligi([0, 600]);
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10">
      {/* Başlık */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="overline mb-2.5">Satıcı görünümü</div>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,42px)", margin: 0 }}>
            Talep akışı
          </h1>
          <p className="mt-2.5" style={{ fontSize: 14.5, color: "var(--color-muted)", margin: "10px 0 0" }}>
            Bütçesi doğrulanmış alıcıların açık talepleri. Portföyünüzde uyan bir varlık varsa teklif verin.
          </p>
        </div>
        <div
          className="panel-2 flex items-center gap-4 px-4 py-3"
          style={{ fontSize: 12.5, color: "var(--color-muted)" }}
        >
          <div>
            <div className="num" style={{ fontSize: 19, color: "var(--color-gold-soft)", fontWeight: 600 }}>
              {SATICI.token}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-faint)" }}>jeton</div>
          </div>
          <div style={{ width: 1, height: 30, background: "var(--color-line)" }} />
          <div>
            <div className="num" style={{ fontSize: 19, color: "var(--color-cream)", fontWeight: 600 }}>
              {TALEPLER.length}
            </div>
            <div style={{ fontSize: 11, color: "var(--color-faint)" }}>açık talep</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
        {/* ---- Filtre paneli ---- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="overline">Filtreler</span>
              {filtreVar && (
                <Button type="text" size="small" icon={<ReloadOutlined />} onClick={temizle} style={{ fontSize: 12 }}>
                  Temizle
                </Button>
              )}
            </div>

            <div className="mb-5">
              <div className="mb-2" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Kategori</div>
              <Segmented
                block
                size="small"
                value={kategori}
                onChange={(v) => setKategori(v as KategoriFiltre)}
                options={[
                  { label: "Tümü", value: "hepsi" },
                  { label: "Emlak", value: "emlak" },
                  { label: "Vasıta", value: "vasita" },
                  { label: "Deniz", value: "deniz" },
                ]}
              />
            </div>

            <div className="mb-5">
              <div className="mb-2" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Şehir</div>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Tüm şehirler"
                value={sehir}
                onChange={setSehir}
                maxTagCount={2}
                options={SEHIRLER.map((s) => ({ label: s, value: s }))}
              />
            </div>

            <div className="mb-5">
              <div className="mb-2" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Varlık türü</div>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                placeholder="Tüm türler"
                value={tur}
                onChange={setTur}
                maxTagCount={1}
                options={TURLER.map((s) => ({ label: s, value: s }))}
              />
            </div>

            <div className="mb-5">
              <div className="mb-1 flex items-baseline justify-between">
                <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Bütçe</span>
                <span className="num" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                  {butceAraligi[0]}–{butceAraligi[1] >= 600 ? "600+" : butceAraligi[1]} Mn ₺
                </span>
              </div>
              <Slider
                range
                min={0}
                max={600}
                step={10}
                value={butceAraligi}
                onChange={(v) => setButceAraligi(v as [number, number])}
                tooltip={{ open: false }}
              />
              <div style={{ fontSize: 10.5, color: "var(--color-faint)" }}>
                Döviz talepler güncel kurla TL karşılığına çevrilir
              </div>
            </div>

            <div
              className="flex flex-col gap-3 pt-4"
              style={{ borderTop: "1px solid var(--color-line)" }}
            >
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Sadece bütçesi belgeli</span>
                <Switch size="small" checked={butceBelgeli} onChange={setButceBelgeli} />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <Tooltip title="Portföyünüzle %80 ve üzeri örtüşen talepler">
                  <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>Yüksek uyumlular</span>
                </Tooltip>
                <Switch size="small" checked={sadeceUyumlu} onChange={setSadeceUyumlu} />
              </label>
            </div>
          </div>

          {/* Kayıtlı arama kutusu */}
          <div
            className="mt-4 rounded-xl p-5"
            style={{ background: "rgba(200,163,74,.05)", border: "1px solid rgba(200,163,74,.2)" }}
          >
            <BellOutlined style={{ color: "var(--color-gold)", fontSize: 15 }} />
            <div className="mb-1.5 mt-2.5" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-cream)" }}>
              Yeni talep çıkınca haber ver
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 14px" }}>
              Bu filtreye uyan bir talep açıldığında ilk 10 dakika içinde bildirim alırsınız.
            </p>
            <Button
              block
              size="small"
              onClick={() => message.success("Kayıtlı arama oluşturuldu — yeni taleplerde bildirim alacaksınız")}
            >
              Aramayı kaydet
            </Button>
          </div>
        </aside>

        {/* ---- Sonuçlar ---- */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span style={{ fontSize: 13.5, color: "var(--color-muted)" }}>
              <strong className="num" style={{ color: "var(--color-cream)", fontWeight: 600 }}>
                {sonuclar.length}
              </strong>{" "}
              talep listeleniyor
              {kategori !== "hepsi" && ` · ${KATEGORI_METIN[kategori].ad}`}
            </span>
            <Select
              value={siralama}
              onChange={(v) => setSiralama(v)}
              style={{ width: 210 }}
              size="middle"
              options={[
                { label: "Portföy uyumuna göre", value: "uyum" },
                { label: "En yeni talepler", value: "yeni" },
                { label: "Bütçesi en yüksek", value: "butceAzalan" },
                { label: "Süresi dolmak üzere", value: "biten" },
              ]}
            />
          </div>

          {sonuclar.length === 0 ? (
            <div className="panel flex items-center justify-center py-20">
              <Empty
                description={
                  <span style={{ color: "var(--color-muted)" }}>
                    Bu filtrelerle eşleşen açık talep yok.
                    <br />
                    Kayıtlı arama oluşturun, yenisi çıkınca haber verelim.
                  </span>
                }
              />
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {sonuclar.map((t) => (
                <TalepKarti key={t.id} talep={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
