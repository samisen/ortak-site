"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Button, Modal, Steps, Input, InputNumber, Select, Result, Alert, Empty,
} from "antd";
import {
  ArrowLeftOutlined, EnvironmentOutlined, EyeOutlined, TeamOutlined, FieldTimeOutlined,
  ThunderboltFilled, LockFilled, CheckCircleFilled, SafetyCertificateOutlined, InfoCircleOutlined,
} from "@ant-design/icons";
import { talepBul, talepTeklifleri, KATEGORI_METIN, ROZET_METIN } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { butceAralik, para, paraKisa, gecenSure, kalanGun, tarihTR, SEMBOL } from "@/lib/format";

import { UyumRozeti } from "@/components/talep-karti";

export default function TalepDetay({ id }: { id: string }) {
  const talep = talepBul(id);

  const [modalAcik, setModalAcik] = useState(false);
  const [adim, setAdim] = useState(0);
  const [gonderildi, setGonderildi] = useState(false);
  const { jeton, harca, teklifEkle } = useDemo();

  // Teklif formu — antd Form yerine sade state (Modal içindeki Form SSR'da portal uyarısı veriyor)
  const [tBaslik, setTBaslik] = useState("");
  const [tFiyat, setTFiyat] = useState<number | null>(null);
  const [tKonum, setTKonum] = useState("");
  const [tOzellikler, setTOzellikler] = useState<string[]>([]);
  const [tMesaj, setTMesaj] = useState("");

  const mevcutTeklifler = useMemo(() => (talep ? talepTeklifleri(talep.id) : []), [talep]);

  if (!talep) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-24">
        <Empty description={<span style={{ color: "var(--color-muted)" }}>Talep bulunamadı.</span>} />
      </div>
    );
  }

  const zorunlu = talep.kriterler.filter((k) => k.zorunlu);
  const tercih = talep.kriterler.filter((k) => !k.zorunlu);
  const kalan = kalanGun(talep.sonGecerlilik);
  const yeterliJeton = jeton >= talep.tokenMaliyeti;

  const teklifFiyatlari = mevcutTeklifler.map((t) => t.fiyat);
  const fiyatAlt = teklifFiyatlari.length ? Math.min(...teklifFiyatlari) : 0;
  const fiyatUst = teklifFiyatlari.length ? Math.max(...teklifFiyatlari) : 0;

  const adimGecerli =
    adim === 0
      ? tBaslik.trim().length >= 10 && !!tFiyat && tKonum.trim().length >= 3 && tOzellikler.length > 0
      : adim === 1
      ? tMesaj.trim().length >= 40
      : true;

  function gonder() {
    harca(talep!.tokenMaliyeti);
    teklifEkle(talep!.id);
    setGonderildi(true);
  }

  function kapat() {
    setModalAcik(false);
    setTimeout(() => {
      if (gonderildi) return;
      setAdim(0);
    }, 200);
  }

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8">
      <Link
        href="/talepler"
        className="mb-6 inline-flex items-center gap-2 no-underline"
        style={{ fontSize: 13, color: "var(--color-muted)" }}
      >
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Talep akışı
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_356px]">
        {/* ================= SOL ================= */}
        <div>
          {/* Başlık bloğu */}
          <div className="panel mb-5 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="overline" style={{ color: "var(--color-gold)", letterSpacing: ".14em" }}>
                {KATEGORI_METIN[talep.kategori].ad}
              </span>
              <span style={{ color: "var(--color-line-strong)" }}>·</span>
              <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{talep.tur}</span>
              <span
                className="rounded px-2 py-0.5"
                style={{
                  fontSize: 11,
                  background: talep.aciliyet === "acil" ? "rgba(196,112,63,.12)" : "var(--color-surface-3)",
                  border: `1px solid ${talep.aciliyet === "acil" ? "rgba(196,112,63,.32)" : "var(--color-line)"}`,
                  color: talep.aciliyet === "acil" ? "#D98C5A" : "var(--color-muted)",
                }}
              >
                {talep.aciliyetMetin}
              </span>
              <span className="num ml-auto" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                {talep.id}
              </span>
            </div>

            <h1 className="display mb-3" style={{ fontSize: "clamp(24px,3.2vw,34px)", margin: 0 }}>
              {talep.baslik}
            </h1>

            <div className="mb-6 flex items-center gap-2" style={{ fontSize: 13.5, color: "var(--color-muted)" }}>
              <EnvironmentOutlined style={{ fontSize: 12, color: "var(--color-faint)" }} />
              {talep.konum}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel-2 p-4" style={{ gridColumn: "span 2" }}>
                <div className="overline mb-1.5">Bütçe aralığı</div>
                <div className="num display" style={{ fontSize: 30, color: "var(--color-gold-soft)" }}>
                  {butceAralik(talep.butceMin, talep.butceMax, talep.paraBirimi)}
                </div>
                <div className="num mt-1" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                  {para(talep.butceMin, talep.paraBirimi)} – {para(talep.butceMax, talep.paraBirimi)}
                </div>
              </div>
              <div className="panel-2 p-4">
                <div className="overline mb-1.5">Ödeme şekli</div>
                <div style={{ fontSize: 14, color: "var(--color-cream)", lineHeight: 1.5 }}>{talep.odeme}</div>
              </div>
            </div>
          </div>

          {/* Alıcı doğrulaması */}
          <div className="panel mb-5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 style={{ fontSize: 15.5, fontWeight: 600, margin: 0, color: "var(--color-cream)" }}>
                Alıcı doğrulaması
              </h2>
              <span className="num" style={{ fontSize: 12, color: "var(--color-faint)" }}>
                {talep.aliciKod}
              </span>
            </div>

            <div className="mb-5 grid gap-2.5 sm:grid-cols-2">
              {talep.rozetler.map((r) => (
                <div
                  key={r}
                  className="flex items-start gap-2.5 rounded-lg px-3.5 py-3"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                >
                  <CheckCircleFilled style={{ color: "var(--color-verified)", fontSize: 13, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-cream)" }}>
                      {ROZET_METIN[r].kisa}
                    </div>
                    <div style={{ fontSize: 11.5, lineHeight: 1.55, color: "var(--color-faint)", marginTop: 2 }}>
                      {ROZET_METIN[r].aciklama}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Alert
              type="info"
              showIcon
              icon={<SafetyCertificateOutlined />}
              style={{ background: "rgba(200,163,74,.06)", border: "1px solid rgba(200,163,74,.2)" }}
              title={
                <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                  Alıcının kimliği, iletişim bilgisi ve tam adresi <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>teklifiniz
                  kabul edilene kadar</strong> gizli tutulur. İletişimi açma kararı alıcıya aittir.
                </span>
              }
            />
          </div>

          {/* Kriterler */}
          <div className="panel mb-5 p-6">
            <h2 className="mb-4" style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 16px", color: "var(--color-cream)" }}>
              Aranan özellikler
            </h2>

            <div className="mb-2 flex items-center gap-2">
              <span className="overline" style={{ color: "var(--color-gold)" }}>Zorunlu</span>
              <span style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                — karşılanmayan teklifler alıcıya gösterilmez
              </span>
            </div>
            <div className="mb-6 overflow-hidden rounded-xl" style={{ border: "1px solid var(--color-line)" }}>
              {zorunlu.map((k, i) => (
                <div
                  key={k.etiket}
                  className="grid gap-3 px-4 py-3"
                  style={{
                    gridTemplateColumns: "180px 1fr",
                    borderBottom: i === zorunlu.length - 1 ? "none" : "1px solid var(--color-line)",
                    background: i % 2 ? "var(--color-surface-2)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--color-muted)" }}>{k.etiket}</span>
                  <span style={{ fontSize: 13, color: "var(--color-cream)", fontWeight: 500 }}>{k.deger}</span>
                </div>
              ))}
            </div>

            {tercih.length > 0 && (
              <>
                <div className="mb-2 flex items-center gap-2">
                  <span className="overline">Tercih edilen</span>
                  <span style={{ fontSize: 11.5, color: "var(--color-faint)" }}>— uyum skorunuzu yükseltir</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tercih.map((k) => (
                    <span
                      key={k.etiket}
                      className="rounded-lg px-3 py-2"
                      style={{ fontSize: 12.5, background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                    >
                      <span style={{ color: "var(--color-faint)" }}>{k.etiket}:</span>{" "}
                      <span style={{ color: "var(--color-cream)" }}>{k.deger}</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Alıcı notu */}
          <div className="panel p-6">
            <h2 className="mb-3" style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 12px", color: "var(--color-cream)" }}>
              Alıcının notu
            </h2>
            <p
              className="m-0 rounded-xl px-4 py-4"
              style={{
                fontSize: 14.5,
                lineHeight: 1.75,
                color: "var(--color-cream)",
                background: "var(--color-surface-2)",
                borderLeft: "2px solid var(--color-gold-dim)",
              }}
            >
              {talep.not}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2" style={{ fontSize: 12, color: "var(--color-faint)" }}>
              <span>Yayın: {tarihTR(talep.yayin)} ({gecenSure(talep.yayin)})</span>
              <span>Otomatik kapanış: {tarihTR(talep.sonGecerlilik)}</span>
            </div>
          </div>
        </div>

        {/* ================= SAĞ ================= */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* Teklif ver */}
          <div className="panel mb-4 overflow-hidden">
            <div className="p-5" style={{ borderBottom: "1px solid var(--color-line)" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="overline">Teklif ver</span>
                <UyumRozeti uyum={talep.uyum} />
              </div>

              <div className="mb-4 flex items-baseline gap-2">
                <ThunderboltFilled style={{ color: "var(--color-gold)", fontSize: 15 }} />
                <span className="num display" style={{ fontSize: 30, color: "var(--color-cream)" }}>
                  {talep.tokenMaliyeti}
                </span>
                <span style={{ fontSize: 13, color: "var(--color-muted)" }}>jeton</span>
                <span className="num ml-auto" style={{ fontSize: 12, color: "var(--color-faint)" }}>
                  bakiye: {jeton}
                </span>
              </div>

              {gonderildi ? (
                <div
                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(90,169,123,.08)", border: "1px solid rgba(90,169,123,.28)" }}
                >
                  <CheckCircleFilled style={{ color: "var(--color-verified)" }} />
                  <span style={{ fontSize: 13, color: "var(--color-cream)" }}>Teklifiniz iletildi</span>
                </div>
              ) : (
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{ height: 46 }}
                  disabled={!yeterliJeton}
                  onClick={() => setModalAcik(true)}
                >
                  {yeterliJeton ? "Portföyümden teklif ver" : "Yetersiz jeton"}
                </Button>
              )}

              <div
                className="mt-3 flex items-start gap-2"
                style={{ fontSize: 11.5, lineHeight: 1.55, color: "var(--color-faint)" }}
              >
                <InfoCircleOutlined style={{ marginTop: 2, color: "var(--color-gold)" }} />
                <span>
                  Alıcı <strong style={{ color: "var(--color-muted)", fontWeight: 500 }}>48 saat</strong> içinde
                  teklifinizi görüntülemezse jetonlarınız otomatik iade edilir.
                </span>
              </div>
            </div>

            {/* Rekabet durumu */}
            <div className="p-5">
              <div className="overline mb-3">Talebin durumu</div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                {[
                  { ikon: <TeamOutlined />, deger: talep.izleyen, etiket: "satıcı izliyor" },
                  { ikon: <EyeOutlined />, deger: talep.goruntuleme, etiket: "görüntülenme" },
                  { ikon: <CheckCircleFilled />, deger: talep.teklifSayisi, etiket: "teklif verildi" },
                  { ikon: <FieldTimeOutlined />, deger: kalan, etiket: "gün kaldı" },
                ].map((s) => (
                  <div key={s.etiket} className="panel-2 px-3.5 py-3">
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span style={{ fontSize: 11, color: "var(--color-faint)" }}>{s.ikon}</span>
                      <span className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--color-cream)" }}>
                        {s.deger}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-faint)" }}>{s.etiket}</div>
                  </div>
                ))}
              </div>

              {teklifFiyatlari.length > 1 && (
                <div
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                >
                  <div className="overline mb-1.5">Verilen tekliflerin aralığı</div>
                  <div className="num" style={{ fontSize: 14.5, color: "var(--color-gold-soft)", fontWeight: 600 }}>
                    {paraKisa(fiyatAlt, talep.paraBirimi)} – {paraKisa(fiyatUst, talep.paraBirimi)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-faint)", marginTop: 3 }}>
                    Fiyatınızı konumlandırmanız için — satıcı kimlikleri gizlidir
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kilitli alan */}
          <div className="panel p-5">
            <div className="mb-3 flex items-center gap-2">
              <LockFilled style={{ color: "var(--color-faint)", fontSize: 12 }} />
              <span className="overline">Teklif kabul edilince açılır</span>
            </div>
            <div className="flex flex-col gap-2">
              {["Alıcının adı soyadı", "Doğrudan telefon numarası", "Tercih ettiği görüşme saatleri", "Varsa çalıştığı danışman"].map((s) => (
                <div
                  key={s}
                  className="shimmer flex items-center justify-between rounded-lg px-3.5 py-2.5"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                >
                  <span style={{ fontSize: 12.5, color: "var(--color-faint)" }}>{s}</span>
                  <span style={{ fontSize: 11, color: "var(--color-line-strong)" }}>••••••</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>


      {/* ================= TEKLİF MODALI ================= */}
      <Modal open={modalAcik} onCancel={kapat} footer={null} width={620} title={gonderildi ? null : "Portföyünüzden teklif verin"}>
        {gonderildi ? (
          <Result
            status="success"
            title={<span style={{ color: "var(--color-cream)", fontSize: 19 }}>Teklifiniz alıcıya iletildi</span>}
            subTitle={
              <span style={{ color: "var(--color-muted)", fontSize: 13.5 }}>
                {talep.aliciKod} teklifinizi görüntülediğinde bildirim alacaksınız. 48 saat içinde
                görüntülenmezse {talep.tokenMaliyeti} jeton otomatik iade edilir.
              </span>
            }
            extra={[
              <Button key="kapat" type="primary" onClick={kapat}>Tamam</Button>,
              <Link key="panel" href="/panel"><Button>Panelime git</Button></Link>,
            ]}
          />
        ) : (
          <>
            <Steps
              size="small"
              current={adim}
              className="mb-7 mt-5"
              items={[{ title: "Varlık" }, { title: "Mesaj" }, { title: "Onay" }]}
            />

            {/* --- Adım 0: Varlık --- */}
            {adim === 0 && (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="mb-2" style={{ fontSize: 13, color: "var(--color-muted)" }}>Varlık başlığı</div>
                  <Input
                    value={tBaslik}
                    onChange={(e) => setTBaslik(e.target.value)}
                    placeholder="Örn. Türkbükü'nde denize 180 m, 520 m² villa — 2019 yapım"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2" style={{ fontSize: 13, color: "var(--color-muted)" }}>Talep ettiğiniz fiyat</div>
                    <InputNumber
                      className="w-full"
                      min={0}
                      step={1_000_000}
                      value={tFiyat}
                      onChange={(v) => setTFiyat(v)}
                      placeholder="98000000"
                      formatter={(v) => (v ? `${SEMBOL[talep.paraBirimi]} ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "")}
                      parser={(v) => Number(v?.replace(/[^\d]/g, "") || 0)}
                    />
                  </div>
                  <div>
                    <div className="mb-2" style={{ fontSize: 13, color: "var(--color-muted)" }}>Konum</div>
                    <Input value={tKonum} onChange={(e) => setTKonum(e.target.value)} placeholder="Bodrum / Türkbükü" />
                  </div>
                </div>

                <div>
                  <div className="mb-1" style={{ fontSize: 13, color: "var(--color-muted)" }}>
                    Karşıladığınız kriterler
                  </div>
                  <div className="mb-2.5" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
                    Alıcının zorunlu kriterlerinden hangilerini karşıladığınızı işaretleyin — eşleşme
                    skorunuz buna göre hesaplanır.
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zorunlu.map((k) => {
                      const deger = `${k.etiket}: ${k.deger}`;
                      const secili = tOzellikler.includes(deger);
                      return (
                        <button
                          key={k.etiket}
                          type="button"
                          onClick={() =>
                            setTOzellikler((p) =>
                              p.includes(deger) ? p.filter((x) => x !== deger) : [...p, deger]
                            )
                          }
                          className="cursor-pointer rounded-lg px-3 py-2 text-left transition-colors"
                          style={{
                            fontSize: 12.5,
                            background: secili ? "rgba(200,163,74,.1)" : "var(--color-surface-2)",
                            border: `1px solid ${secili ? "rgba(200,163,74,.34)" : "var(--color-line)"}`,
                            color: secili ? "var(--color-gold-soft)" : "var(--color-muted)",
                          }}
                        >
                          {secili && <CheckCircleFilled style={{ fontSize: 10, marginRight: 6 }} />}
                          <span style={{ color: secili ? "var(--color-gold-soft)" : "var(--color-faint)" }}>
                            {k.etiket}:
                          </span>{" "}
                          {k.deger}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3">
                    <Select
                      mode="tags"
                      className="w-full"
                      value={tOzellikler.filter((o) => !zorunlu.some((k) => `${k.etiket}: ${k.deger}` === o))}
                      onChange={(v) =>
                        setTOzellikler([
                          ...tOzellikler.filter((o) => zorunlu.some((k) => `${k.etiket}: ${k.deger}` === o)),
                          ...v,
                        ])
                      }
                      placeholder="Ek özellik eklemek isterseniz yazıp Enter'a basın"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- Adım 1: Mesaj --- */}
            {adim === 1 && (
              <div>
                <Alert
                  className="mb-4"
                  type="warning"
                  showIcon
                  style={{ background: "rgba(196,112,63,.07)", border: "1px solid rgba(196,112,63,.25)" }}
                  title={
                    <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                      Mesajınıza telefon, e-posta veya dış bağlantı eklemeyin. Sistem bunları otomatik
                      gizler ve tekrarında hesabınız askıya alınır.
                    </span>
                  }
                />
                <div className="mb-2 flex items-baseline justify-between">
                  <span style={{ fontSize: 13, color: "var(--color-muted)" }}>Alıcıya mesajınız</span>
                  <span className="num" style={{ fontSize: 11.5, color: tMesaj.length < 40 ? "var(--color-alert)" : "var(--color-faint)" }}>
                    {tMesaj.length}/800
                  </span>
                </div>
                <Input.TextArea
                  rows={7}
                  maxLength={800}
                  value={tMesaj}
                  onChange={(e) => setTMesaj(e.target.value)}
                  placeholder="Talebinizdeki zorunlu kriterleri karşılıyor. Mülk halen hiçbir ilan sitesinde yayınlanmıyor..."
                />
                {tMesaj.length < 40 && (
                  <div style={{ fontSize: 11.5, color: "var(--color-faint)", marginTop: 6 }}>
                    En az 40 karakter — alıcı ciddiyetinizi buradan ölçüyor.
                  </div>
                )}
              </div>
            )}

            {/* --- Adım 2: Onay --- */}
            {adim === 2 && (
              <div>
                <div className="panel-2 mb-4 p-5">
                  <div className="overline mb-3">Özet</div>
                  {[
                    ["Talep", `${talep.id} · ${talep.baslik}`],
                    ["Varlığınız", tBaslik || "—"],
                    ["Fiyatınız", tFiyat ? para(tFiyat, talep.paraBirimi) : "—"],
                    ["Alıcının bütçesi", butceAralik(talep.butceMin, talep.butceMax, talep.paraBirimi)],
                    ["Karşıladığınız kriter", `${tOzellikler.length} adet`],
                  ].map(([e, d]) => (
                    <div key={e} className="flex gap-3 py-2" style={{ borderBottom: "1px solid var(--color-line)" }}>
                      <span style={{ fontSize: 12.5, color: "var(--color-faint)", width: 130, flexShrink: 0 }}>{e}</span>
                      <span style={{ fontSize: 13, color: "var(--color-cream)" }}>{d}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="mb-4 flex items-center justify-between rounded-xl px-4 py-4"
                  style={{ background: "rgba(200,163,74,.06)", border: "1px solid rgba(200,163,74,.22)" }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: "var(--color-cream)", fontWeight: 500 }}>Harcanacak jeton</div>
                    <div style={{ fontSize: 11.5, color: "var(--color-faint)", marginTop: 2 }}>
                      48 saatte görüntülenmezse iade edilir
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <ThunderboltFilled style={{ color: "var(--color-gold)", fontSize: 14 }} />
                    <span className="num display" style={{ fontSize: 26, color: "var(--color-gold-soft)" }}>
                      {talep.tokenMaliyeti}
                    </span>
                  </div>
                </div>

                <div className="num flex items-center justify-between" style={{ fontSize: 12.5, color: "var(--color-faint)" }}>
                  <span>Mevcut bakiye: {jeton}</span>
                  <span>İşlem sonrası: {jeton - talep.tokenMaliyeti}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button onClick={adim === 0 ? kapat : () => setAdim((a) => a - 1)}>
                {adim === 0 ? "Vazgeç" : "Geri"}
              </Button>
              {adim < 2 ? (
                <Button type="primary" disabled={!adimGecerli} onClick={() => setAdim((a) => a + 1)}>
                  Devam
                </Button>
              ) : (
                <Button type="primary" onClick={gonder}>
                  {talep.tokenMaliyeti} jeton harca, teklifi gönder
                </Button>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
