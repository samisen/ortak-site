"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Button, Steps, Input, Select, Segmented, Switch, Slider, Radio, Alert, Result, Tooltip, Upload, App,
} from "antd";
import {
  CheckCircleFilled, SafetyCertificateOutlined, BankOutlined, UploadOutlined,
  EyeInvisibleOutlined, ArrowLeftOutlined,
} from "@ant-design/icons";
import TalepKarti from "@/components/talep-karti";
import { KRITERLER, TUR_SECENEKLERI, SEHIR_SECENEKLERI, ODEME_SECENEKLERI } from "@/lib/sablonlar";
import { SEMBOL } from "@/lib/format";
import type { Kategori, Kriter, ParaBirimi, Talep, Aciliyet } from "@/lib/types";

const ADIMLAR = ["Ne arıyorsunuz", "Nerede", "Kriterler", "Bütçe", "Doğrulama", "Yayın"];

const ACILIYETLER: { deger: Aciliyet; etiket: string; metin: string }[] = [
  { deger: "acil", etiket: "Bu ay içinde", metin: "Acil — teklifler öne çıkarılır" },
  { deger: "normal", etiket: "3 ay içinde", metin: "Normal süreç" },
  { deger: "firsat", etiket: "Doğru fırsat çıkarsa", metin: "Acelesi yok" },
];

export default function YeniTalep() {
  const { message } = App.useApp();
  const [adim, setAdim] = useState(0);

  const [kategori, setKategori] = useState<Kategori>("emlak");
  const [tur, setTur] = useState<string>("Villa");
  const [baslik, setBaslik] = useState("");
  const [sehir, setSehir] = useState<string>("Muğla");
  const [bolgeler, setBolgeler] = useState<string[]>([]);
  const [kriterDegerleri, setKriterDegerleri] = useState<Record<string, string>>({});
  const [zorunlular, setZorunlular] = useState<Record<string, boolean>>({});
  const [paraBirimi, setParaBirimi] = useState<ParaBirimi>("TRY");
  const [butce, setButce] = useState<[number, number]>([60, 110]);
  const [odeme, setOdeme] = useState(ODEME_SECENEKLERI[0]);
  const [aciliyet, setAciliyet] = useState<Aciliyet>("normal");
  const [not, setNot] = useState("");
  const kimlikOk = true;
  const [butceBelgesi, setButceBelgesi] = useState(false);
  const [gizliKimlik, setGizliKimlik] = useState(true);
  const [sadeceKurumsal, setSadeceKurumsal] = useState(false);
  const [yayinlandi, setYayinlandi] = useState(false);

  const sablon = KRITERLER[kategori];

  /** Kategori değişince tür ve kriterler sıfırlanır */
  function kategoriDegistir(k: Kategori) {
    setKategori(k);
    setTur(TUR_SECENEKLERI[k][0]);
    setKriterDegerleri({});
    setZorunlular({});
  }

  const kriterler: Kriter[] = useMemo(
    () =>
      sablon
        .filter((s) => kriterDegerleri[s.etiket])
        .map((s) => ({
          etiket: s.etiket,
          deger: kriterDegerleri[s.etiket],
          zorunlu: zorunlular[s.etiket] ?? s.varsayilanZorunlu,
        })),
    [sablon, kriterDegerleri, zorunlular]
  );

  const carpan = paraBirimi === "TRY" ? 1_000_000 : 1_000;

  /** Sağdaki canlı önizleme kartı */
  const onizleme: Talep = {
    id: "TLP-4830",
    kategori,
    tur,
    baslik: baslik || `${sehir} bölgesinde ${tur.toLowerCase()} arıyorum`,
    sehir,
    konum: bolgeler.length ? `${sehir} / ${bolgeler.join(", ")}` : sehir,
    butceMin: butce[0] * carpan,
    butceMax: butce[1] * carpan,
    paraBirimi,
    odeme,
    kriterler: kriterler.length ? kriterler : [{ etiket: "Kriter", deger: "Henüz girilmedi", zorunlu: true }],
    not,
    rozetler: [...(kimlikOk ? (["kimlik"] as const) : []), ...(butceBelgesi ? (["butce"] as const) : [])],
    aciliyet,
    aciliyetMetin: ACILIYETLER.find((a) => a.deger === aciliyet)!.etiket,
    yayin: "2026-09-29",
    sonGecerlilik: "2026-12-29",
    goruntuleme: 0,
    teklifSayisi: 0,
    izleyen: 0,
    tokenMaliyeti: 4,
    aliciKod: "Alıcı #4830",
    uyum: 0,
  };

  const adimGecerli = (() => {
    if (adim === 0) return baslik.trim().length >= 10;
    if (adim === 1) return bolgeler.length > 0;
    if (adim === 2) return kriterler.filter((k) => k.zorunlu).length >= 2;
    if (adim === 3) return not.trim().length >= 30;
    if (adim === 4) return kimlikOk && butceBelgesi;
    return true;
  })();

  const adimUyarisi = (() => {
    if (adim === 0) return "Devam etmek için en az 10 karakterlik bir başlık girin";
    if (adim === 1) return "En az bir bölge seçin";
    if (adim === 2) return "En az 2 zorunlu kriter belirleyin — eşleştirme buna göre yapılır";
    if (adim === 3) return "Satıcıların işini kolaylaştıracak en az 30 karakterlik bir not yazın";
    if (adim === 4) return "Bütçe belgenizi yükleyin — doğrulanmamış talepler yayınlanmaz";
    return "";
  })();

  if (yayinlandi) {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-20">
        <div className="panel p-10">
          <Result
            status="success"
            title={<span className="display" style={{ color: "var(--color-cream)", fontSize: 28 }}>Talebiniz yayında</span>}
            subTitle={
              <span style={{ color: "var(--color-muted)", fontSize: 14.5, lineHeight: 1.7 }}>
                {onizleme.id} numaralı talebiniz, kriterlerinize uyan portföy sahiplerine iletildi.
                Gelen teklifleri gelen kutunuzdan inceleyebilir, yalnızca beğendiklerinizin iletişimini
                açabilirsiniz. Kimliğiniz siz açana kadar gizli kalır.
              </span>
            }
            extra={[
              <Link key="ik" href="/gelen-kutusu">
                <Button type="primary" size="large">Gelen kutusuna git</Button>
              </Link>,
              <Link key="ana" href="/">
                <Button size="large">Ana sayfa</Button>
              </Link>,
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Ana sayfa
      </Link>

      <div className="mb-8">
        <div className="overline mb-2.5">Alıcı görünümü</div>
        <h1 className="display" style={{ fontSize: "clamp(30px,4vw,42px)", margin: 0 }}>
          Ne aradığınızı anlatın
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--color-muted)", margin: "10px 0 0", maxWidth: "62ch" }}>
          Hiçbir ilan gezmeyeceksiniz. Kriterlerinizi yazın, uyan varlıkları olan satıcılar size gelsin.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* ---------- FORM ---------- */}
        <div>
          <Steps
            size="small"
            current={adim}
            className="mb-8"
            items={ADIMLAR.map((a) => ({ title: a }))}
            responsive={false}
            style={{ overflowX: "auto", paddingBottom: 4 }}
          />

          <div className="panel p-6">
            {/* --- 0: Ne --- */}
            {adim === 0 && (
              <div>
                <h2 className="mb-5" style={{ fontSize: 17, fontWeight: 600, margin: "0 0 20px", color: "var(--color-cream)" }}>
                  Ne arıyorsunuz?
                </h2>

                <div className="mb-5">
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>Kategori</div>
                  <Segmented
                    block
                    value={kategori}
                    onChange={(v) => kategoriDegistir(v as Kategori)}
                    options={[
                      { label: "Emlak", value: "emlak" },
                      { label: "Vasıta", value: "vasita" },
                      { label: "Deniz aracı", value: "deniz" },
                    ]}
                  />
                </div>

                <div className="mb-5">
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>Tür</div>
                  <Select className="w-full" value={tur} onChange={setTur} size="large"
                    options={TUR_SECENEKLERI[kategori].map((t) => ({ label: t, value: t }))} />
                </div>

                <div>
                  <div className="mb-2.5 flex items-baseline justify-between">
                    <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Talebinizin başlığı</span>
                    <span className="num" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{baslik.length}/90</span>
                  </div>
                  <Input
                    size="large"
                    maxLength={90}
                    value={baslik}
                    onChange={(e) => setBaslik(e.target.value)}
                    placeholder="Örn. Yalıkavak hattında denize sıfır, özel havuzlu villa"
                  />
                  <div style={{ fontSize: 11.5, color: "var(--color-faint)", marginTop: 8 }}>
                    Satıcıların akışta gördüğü ilk satır bu olacak — net olun.
                  </div>
                </div>
              </div>
            )}

            {/* --- 1: Nerede --- */}
            {adim === 1 && (
              <div>
                <h2 className="mb-5" style={{ fontSize: 17, fontWeight: 600, margin: "0 0 20px", color: "var(--color-cream)" }}>
                  Nerede arıyorsunuz?
                </h2>
                <div className="mb-5">
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>Şehir</div>
                  <Select className="w-full" size="large" value={sehir} onChange={setSehir}
                    options={SEHIR_SECENEKLERI.map((s) => ({ label: s, value: s }))} />
                </div>
                <div>
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>
                    Bölge / semt <span style={{ color: "var(--color-faint)" }}>— birden fazla ekleyebilirsiniz</span>
                  </div>
                  <Select
                    mode="tags"
                    className="w-full"
                    size="large"
                    value={bolgeler}
                    onChange={setBolgeler}
                    placeholder="Yazıp Enter'a basın — örn. Yalıkavak, Türkbükü"
                    options={
                      sehir === "Muğla"
                        ? ["Yalıkavak", "Türkbükü", "Gündoğan", "Göcek", "Bitez", "Marmaris"].map((b) => ({ label: b, value: b }))
                        : sehir === "İstanbul"
                        ? ["Nişantaşı", "Teşvikiye", "Zekeriyaköy", "Beykoz", "Etiler", "Kuzguncuk", "Levent"].map((b) => ({ label: b, value: b }))
                        : sehir === "İzmir"
                        ? ["Alaçatı", "Çeşme", "Ilıca", "Urla"].map((b) => ({ label: b, value: b }))
                        : []
                    }
                  />
                  <Alert
                    className="mt-5"
                    type="info"
                    showIcon
                    style={{ background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}
                    title={
                      <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                        Bölgeyi geniş tutmak size daha çok teklif getirir, dar tutmak daha isabetli teklif.
                        Çoğu alıcı 2–3 bölgeyle başlıyor.
                      </span>
                    }
                  />
                </div>
              </div>
            )}

            {/* --- 2: Kriterler --- */}
            {adim === 2 && (
              <div>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "var(--color-cream)" }}>
                      Kriterleriniz
                    </h2>
                    <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "6px 0 0" }}>
                      <strong style={{ color: "var(--color-gold-soft)", fontWeight: 500 }}>Zorunlu</strong> işaretlediğiniz
                      kriterleri karşılamayan teklifler size hiç gösterilmez.
                    </p>
                  </div>
                  <span
                    className="num shrink-0 rounded-lg px-3 py-1.5"
                    style={{ fontSize: 12, background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
                  >
                    {kriterler.filter((k) => k.zorunlu).length} zorunlu
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {sablon.map((s) => {
                    const secili = !!kriterDegerleri[s.etiket];
                    const zorunlu = zorunlular[s.etiket] ?? s.varsayilanZorunlu;
                    return (
                      <div
                        key={s.etiket}
                        className="grid items-center gap-3 rounded-xl px-4 py-3"
                        style={{
                          gridTemplateColumns: "140px 1fr auto",
                          background: secili ? "var(--color-surface-2)" : "transparent",
                          border: `1px solid ${secili ? "var(--color-line-strong)" : "var(--color-line)"}`,
                        }}
                      >
                        <span style={{ fontSize: 13, color: secili ? "var(--color-cream)" : "var(--color-muted)" }}>
                          {s.etiket}
                        </span>
                        <Select
                          allowClear
                          placeholder="Seçin veya yazın"
                          value={kriterDegerleri[s.etiket]}
                          onChange={(v) => setKriterDegerleri((p) => ({ ...p, [s.etiket]: v }))}
                          options={s.secenekler.map((o) => ({ label: o, value: o }))}
                        />
                        <Tooltip title={secili ? (zorunlu ? "Zorunlu — karşılamayan teklif gösterilmez" : "Tercih — uyum skorunu etkiler") : "Önce bir değer seçin"}>
                          <span className="flex items-center gap-2">
                            <span style={{ fontSize: 11, color: "var(--color-faint)" }}>zorunlu</span>
                            <Switch
                              size="small"
                              disabled={!secili}
                              checked={secili && zorunlu}
                              onChange={(v) => setZorunlular((p) => ({ ...p, [s.etiket]: v }))}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- 3: Bütçe --- */}
            {adim === 3 && (
              <div>
                <h2 className="mb-5" style={{ fontSize: 17, fontWeight: 600, margin: "0 0 20px", color: "var(--color-cream)" }}>
                  Bütçe ve zamanlama
                </h2>

                <div className="mb-5 flex items-center gap-3">
                  <Segmented
                    value={paraBirimi}
                    onChange={(v) => setParaBirimi(v as ParaBirimi)}
                    options={[
                      { label: "₺ TL", value: "TRY" },
                      { label: "$ USD", value: "USD" },
                      { label: "€ EUR", value: "EUR" },
                    ]}
                  />
                  <span style={{ fontSize: 12, color: "var(--color-faint)" }}>
                    {paraBirimi === "TRY" ? "milyon TL" : "bin " + paraBirimi} cinsinden
                  </span>
                </div>

                <div
                  className="mb-6 rounded-xl px-5 py-5"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                >
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="overline">Bütçe aralığı</span>
                    <span className="num display" style={{ fontSize: 24, color: "var(--color-gold-soft)" }}>
                      {SEMBOL[paraBirimi]}{butce[0]} – {butce[1]} {paraBirimi === "TRY" ? "Mn" : "B"}
                    </span>
                  </div>
                  <Slider
                    range
                    min={paraBirimi === "TRY" ? 5 : 50}
                    max={paraBirimi === "TRY" ? 400 : 10000}
                    step={paraBirimi === "TRY" ? 5 : 50}
                    value={butce}
                    onChange={(v) => setButce(v as [number, number])}
                  />
                  <div style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                    Aralığı dar tutan talepler ortalama %40 daha fazla teklif alıyor.
                  </div>
                </div>

                <div className="mb-5">
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>Ödeme şekliniz</div>
                  <Select className="w-full" size="large" value={odeme} onChange={setOdeme}
                    options={ODEME_SECENEKLERI.map((o) => ({ label: o, value: o }))} />
                </div>

                <div className="mb-5">
                  <div className="mb-2.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>Ne zaman almak istiyorsunuz?</div>
                  <Radio.Group value={aciliyet} onChange={(e) => setAciliyet(e.target.value)} className="flex flex-col gap-2">
                    {ACILIYETLER.map((a) => (
                      <Radio key={a.deger} value={a.deger} className="w-full">
                        <span style={{ fontSize: 13.5, color: "var(--color-cream)" }}>{a.etiket}</span>
                        <span style={{ fontSize: 12, color: "var(--color-faint)", marginLeft: 8 }}>{a.metin}</span>
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>

                <div>
                  <div className="mb-2.5 flex items-baseline justify-between">
                    <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Satıcılara notunuz</span>
                    <span className="num" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{not.length}/500</span>
                  </div>
                  <Input.TextArea
                    rows={4}
                    maxLength={500}
                    value={not}
                    onChange={(e) => setNot(e.target.value)}
                    placeholder="Elemek istediğiniz şeyleri de yazın — neyi istemediğiniz, ne istediğiniz kadar değerli."
                  />
                </div>
              </div>
            )}

            {/* --- 4: Doğrulama --- */}
            {adim === 4 && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "var(--color-cream)" }}>
                  Doğrulama ve gizlilik
                </h2>
                <p className="mb-6" style={{ fontSize: 13, color: "var(--color-muted)", margin: "6px 0 24px", maxWidth: "58ch" }}>
                  Bu adım platformun tamamının dayandığı yer. Satıcılar ancak doğrulanmış alıcılara
                  teklif verdikleri için ciddi portföylerini buraya getiriyor.
                </p>

                <div className="mb-3 flex items-start gap-3.5 rounded-xl px-4 py-4"
                  style={{ background: "var(--ok-wash)", border: "1px solid var(--ok-line)" }}>
                  <CheckCircleFilled style={{ color: "var(--color-verified)", fontSize: 16, marginTop: 2 }} />
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-cream)" }}>Kimlik doğrulandı</div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)", marginTop: 3 }}>
                      T.C. kimlik ve telefon doğrulamanız tamamlandı · <span className="num">••••</span> 41 08
                    </div>
                  </div>
                  <SafetyCertificateOutlined style={{ color: "var(--color-verified)", fontSize: 15 }} />
                </div>

                <div
                  className="mb-6 rounded-xl px-4 py-4"
                  style={{
                    background: butceBelgesi ? "var(--ok-wash)" : "var(--color-surface-2)",
                    border: `1px solid ${butceBelgesi ? "var(--ok-line)" : "var(--color-line)"}`,
                  }}
                >
                  <div className="flex items-start gap-3.5">
                    {butceBelgesi ? (
                      <CheckCircleFilled style={{ color: "var(--color-verified)", fontSize: 16, marginTop: 2 }} />
                    ) : (
                      <BankOutlined style={{ color: "var(--color-gold)", fontSize: 16, marginTop: 2 }} />
                    )}
                    <div className="flex-1">
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-cream)" }}>
                        {butceBelgesi ? "Bütçe belgelendi" : "Bütçe doğrulaması"}
                      </div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)", margin: "4px 0 12px" }}>
                        Banka referans mektubu, hesap özeti veya portföy ekstresi. Belgeniz{" "}
                        <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>satıcılarla paylaşılmaz</strong>;
                        yalnızca &quot;bütçe belgelendi&quot; rozeti görünür.
                      </div>
                      {butceBelgesi ? (
                        <div className="num flex items-center gap-3" style={{ fontSize: 12.5, color: "var(--color-verified)" }}>
                          banka-referans-mektubu.pdf · 248 KB
                          <Button type="text" size="small" onClick={() => setButceBelgesi(false)} style={{ fontSize: 12 }}>
                            kaldır
                          </Button>
                        </div>
                      ) : (
                        <Upload
                          beforeUpload={() => {
                            setButceBelgesi(true);
                            message.success("Belge alındı — doğrulama birkaç dakika içinde tamamlanır");
                            return false;
                          }}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />}>Belge yükle</Button>
                        </Upload>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overline mb-3">Gizlilik tercihleri</div>
                <div className="flex flex-col gap-2.5">
                  <label
                    className="flex cursor-pointer items-start justify-between gap-4 rounded-xl px-4 py-3.5"
                    style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                  >
                    <span className="flex items-start gap-3">
                      <EyeInvisibleOutlined style={{ color: "var(--color-gold)", fontSize: 15, marginTop: 2 }} />
                      <span>
                        <span style={{ fontSize: 13.5, color: "var(--color-cream)", display: "block" }}>Kimliğim gizli kalsın</span>
                        <span style={{ fontSize: 12, color: "var(--color-faint)" }}>
                          Adınız ve telefonunuz yalnızca siz açtığınızda görünür
                        </span>
                      </span>
                    </span>
                    <Switch checked={gizliKimlik} onChange={setGizliKimlik} />
                  </label>

                  <label
                    className="flex cursor-pointer items-start justify-between gap-4 rounded-xl px-4 py-3.5"
                    style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                  >
                    <span className="flex items-start gap-3">
                      <SafetyCertificateOutlined style={{ color: "var(--color-gold)", fontSize: 15, marginTop: 2 }} />
                      <span>
                        <span style={{ fontSize: 13.5, color: "var(--color-cream)", display: "block" }}>
                          Sadece kurumsal üyeler teklif verebilsin
                        </span>
                        <span style={{ fontSize: 12, color: "var(--color-faint)" }}>
                          Bireysel mülk sahiplerinden teklif almak istemiyorsanız açın
                        </span>
                      </span>
                    </span>
                    <Switch checked={sadeceKurumsal} onChange={setSadeceKurumsal} />
                  </label>
                </div>
              </div>
            )}

            {/* --- 5: Yayın --- */}
            {adim === 5 && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "var(--color-cream)" }}>Son kontrol</h2>
                <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "6px 0 24px" }}>
                  Satıcılar talebinizi sağdaki gibi görecek. Kimliğiniz ve iletişim bilgileriniz görünmüyor.
                </p>

                <div className="mb-5 overflow-hidden rounded-xl" style={{ border: "1px solid var(--color-line)" }}>
                  {[
                    ["Kategori", `${kategori === "emlak" ? "Emlak" : kategori === "vasita" ? "Vasıta" : "Deniz aracı"} · ${tur}`],
                    ["Konum", onizleme.konum],
                    ["Bütçe", `${SEMBOL[paraBirimi]}${butce[0]} – ${butce[1]} ${paraBirimi === "TRY" ? "Mn" : "B"}`],
                    ["Ödeme", odeme],
                    ["Zorunlu kriter", `${kriterler.filter((k) => k.zorunlu).length} adet`],
                    ["Tercih kriteri", `${kriterler.filter((k) => !k.zorunlu).length} adet`],
                    ["Doğrulama", "Kimlik + bütçe belgesi"],
                    ["Görünürlük", sadeceKurumsal ? "Yalnızca kurumsal üyeler" : "Tüm doğrulanmış satıcılar"],
                    ["Kimlik", gizliKimlik ? "Gizli — siz açana kadar" : "Teklif verenlere açık"],
                  ].map(([e, d], i) => (
                    <div
                      key={e}
                      className="grid gap-3 px-4 py-3"
                      style={{
                        gridTemplateColumns: "160px 1fr",
                        borderBottom: i === 8 ? "none" : "1px solid var(--color-line)",
                        background: i % 2 ? "var(--color-surface-2)" : "transparent",
                      }}
                    >
                      <span style={{ fontSize: 12.5, color: "var(--color-faint)" }}>{e}</span>
                      <span style={{ fontSize: 13, color: "var(--color-cream)" }}>{d}</span>
                    </div>
                  ))}
                </div>

                <Alert
                  type="success"
                  showIcon
                  style={{ background: "var(--ok-wash)", border: "1px solid var(--ok-line)" }}
                  title={
                    <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                      Talebiniz yayınlandığında kriterlerinize uyan{" "}
                      <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>34 satıcıya</strong> bildirim
                      gidecek. Talep 90 gün açık kalır, dilediğiniz an kapatabilirsiniz.
                    </span>
                  }
                />
              </div>
            )}

            {/* --- Navigasyon --- */}
            <div
              className="mt-7 flex items-center justify-between gap-4 pt-5"
              style={{ borderTop: "1px solid var(--color-line)" }}
            >
              <Button disabled={adim === 0} onClick={() => setAdim((a) => a - 1)}>Geri</Button>
              <div className="flex items-center gap-3">
                {!adimGecerli && (
                  <span className="hidden sm:inline" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                    {adimUyarisi}
                  </span>
                )}
                {adim < ADIMLAR.length - 1 ? (
                  <Button type="primary" disabled={!adimGecerli} onClick={() => setAdim((a) => a + 1)}>
                    Devam
                  </Button>
                ) : (
                  <Button type="primary" size="large" onClick={() => setYayinlandi(true)}>
                    Talebi yayınla
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CANLI ÖNİZLEME ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 flex items-center gap-2">
            <span className="pulse-dot inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--color-gold)" }} />
            <span className="overline">Satıcılar bunu görecek</span>
          </div>
          <div style={{ pointerEvents: "none" }}>
            <TalepKarti talep={onizleme} />
          </div>
          <div
            className="mt-3 rounded-xl px-4 py-3"
            style={{ fontSize: 12, lineHeight: 1.6, color: "var(--color-faint)", background: "var(--color-surface-2)", border: "1px dashed var(--color-line-strong)" }}
          >
            Kartta adınız, telefonunuz veya belgeniz yok. Satıcı yalnızca aradığınızı ve
            doğrulanmış olduğunuzu görüyor.
          </div>
        </aside>
      </div>
    </div>
  );
}
