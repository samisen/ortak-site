"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { App, Button, Input, Tag, Tooltip } from "antd";
import { ArrowLeftOutlined, CheckCircleFilled, EnvironmentOutlined, InfoCircleOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useDemo } from "@/lib/demo-store";
import { KAP } from "@/components/kap";
import { DEMO_EMLAKCI, PORTFOYUM } from "@/lib/data";
import { ERKEN_ERISIM_ORANI, ERKEN_ERISIM_SAAT, KOLTUK, baglantiUcreti, karsilastir } from "@/lib/eslesme";
import { butceAralik, gecenSaat, gecenSure, kalanGun, tl } from "@/lib/format";
import { talepBolgesi } from "@/lib/bolgeler";
import { konumMetni, kriterEtiketleri } from "@/lib/kriterler";
import { AcanEtiketi, DogrulamaEtiketi, Koltuklar } from "@/components/ui";

const SIRA = { tam: 0, esnek: 1, "uygun-degil": 2 } as const;

export default function TalepDetay({ id }: { id: string }) {
  const { message } = App.useApp();
  const { tumTalepler, koltukDolu, gonderilenler, teklifGonder } = useDemo();
  const t = tumTalepler.find((x) => x.id === id);

  const sonuclar = useMemo(
    () => (t ? PORTFOYUM.map((p) => ({ p, k: karsilastir(t, p) })).sort((a, b) => SIRA[a.k.durum] - SIRA[b.k.durum] || b.k.uyum - a.k.uyum) : []),
    [t]
  );
  const ilkUygun = sonuclar.find((s) => s.k.durum !== "uygun-degil")?.p.id;
  const [secili, setSecili] = useState<string | undefined>(ilkUygun);
  const [not, setNot] = useState("");

  if (!t) {
    return (
      <div className="py-24 text-center" style={{ color: "var(--color-muted)" }}>
        Talep bulunamadı. <Link href="/emlakci" style={{ color: "var(--color-gold)" }}>Talep akışına dön</Link>
      </div>
    );
  }

  const dolu = koltukDolu(t.id);
  const gonderilen = gonderilenler.find((g) => g.talepId === t.id);
  const koltukYok = dolu >= KOLTUK && !gonderilen;
  const erken = gecenSaat(t.yayin) < ERKEN_ERISIM_SAAT;
  const ucret = baglantiUcreti(t);
  const secim = sonuclar.find((s) => s.p.id === secili);
  const esnekSecim = secim?.k.durum === "esnek";
  const gonderilebilir = !!secim && secim.k.durum !== "uygun-degil" && (!esnekSecim || not.trim().length >= 20);

  function gonder() {
    if (!secim) return;
    teklifGonder({ talepId: t!.id, portfoyId: secim.p.id, tip: secim.k.durum === "esnek" ? "esnek" : "tam", not });
    message.success("Teklif iletildi");
  }

  return (
    <div className={`${KAP} py-10`}>
      <Link href="/emlakci" className="mb-6 inline-flex items-center gap-2 no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Talepler
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* ============ Talep ============ */}
        <div>
          <section className="panel mb-5 p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="overline" style={{ color: "var(--color-gold)", letterSpacing: ".14em" }}>{talepBolgesi(t.kriterler.semtler)}</span>
              <AcanEtiketi acan={t.acan} />
              <span className="num ml-auto" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{t.id} · {gecenSure(t.yayin)}</span>
            </div>
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3">
              <span className="num display" style={{ fontSize: 38, color: "var(--color-gold-soft)" }}>{butceAralik(t.butceMin, t.butceMax)}</span>
              {t.pesin && <span style={{ fontSize: 15, color: "var(--color-muted)" }}>peşin</span>}
            </div>
            <div className="mb-5 flex items-center gap-1.5" style={{ fontSize: 14, color: "var(--color-muted)" }}>
              <EnvironmentOutlined style={{ fontSize: 12 }} /> {konumMetni(t.kriterler.semtler)}
            </div>
            <p className="rounded-xl px-4 py-4" style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-cream)", background: "var(--color-surface-2)", borderLeft: "2px solid var(--color-gold-dim)", margin: 0 }}>
              “{t.cumle}”
            </p>
          </section>

          <section className="panel mb-5 p-6">
            <h2 style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 14px", color: "var(--color-cream)" }}>Şartlar</h2>
            <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--color-line)" }}>
              {kriterEtiketleri(t.kriterler).map((k, i, a) => {
                const esnek = t.esnek.includes(k.anahtar);
                return (
                  <div key={k.anahtar} className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: i === a.length - 1 ? "none" : "1px solid var(--color-line)" }}>
                    <span style={{ fontSize: 14, color: "var(--color-cream)" }}>{k.etiket}</span>
                    <span style={{ fontSize: 12, color: esnek ? "var(--color-faint)" : "var(--color-muted)" }}>{esnek ? "esnek" : "şart"}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-faint)", margin: "12px 0 0" }}>
              Şartlardan yalnızca birini karşılamayan bir mülkle esnek teklif verebilirsiniz; farkı alıcıya baştan söylersiniz.
            </p>
          </section>

          <section className="panel p-6">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <DogrulamaEtiketi tur={t.dogrulama} />
              <span style={{ fontSize: 12.5, color: "var(--color-faint)" }}>{kalanGun(t.bitis)} gün sonra kapanır</span>
            </div>
            {t.acan === "emlakci" && (
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--color-muted)", margin: "14px 0 0" }}>
                Bu talebi alıcının emlakçısı açtı. İletişim açılırsa onunla bağlanırsınız; satış olursa komisyonu
                bugün yaptığınız gibi aranızda paylaşırsınız. Platform komisyon almaz.
              </p>
            )}
          </section>
        </div>

        {/* ============ Teklif ver ============ */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="panel overflow-hidden">
            <div className="p-5" style={{ borderBottom: "1px solid var(--color-line)" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="overline">Teklif ver</span>
                <Koltuklar dolu={dolu} />
              </div>

              {erken && (
                <div className="mb-3 flex items-start gap-2 rounded-lg px-3 py-2.5" style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--color-muted)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}>
                  <ThunderboltFilled style={{ color: "var(--color-gold)", marginTop: 3, fontSize: 11 }} />
                  <span>
                    Erken erişim: ilk {ERKEN_ERISIM_SAAT} saat yalnızca kabul oranı %{ERKEN_ERISIM_ORANI} üstündeki emlakçılar görüyor.
                    Sizin oranınız %{DEMO_EMLAKCI.kabulOrani}.
                  </span>
                </div>
              )}

              <div className="rounded-lg px-3.5 py-3" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}>
                <div className="flex items-baseline justify-between">
                  <span style={{ fontSize: 13, color: "var(--color-cream)" }}>Bağlantı ücreti</span>
                  <span className="num">
                    {DEMO_EMLAKCI.kurucu && (
                      <span style={{ fontSize: 13, color: "var(--color-faint)", textDecoration: "line-through", marginRight: 8 }}>{tl(ucret)}</span>
                    )}
                    <span style={{ fontSize: 16, fontWeight: 600, color: "var(--color-gold-soft)" }}>{DEMO_EMLAKCI.kurucu ? "₺0" : tl(ucret)}</span>
                  </span>
                </div>
                <div className="mt-1.5 flex items-start gap-1.5" style={{ fontSize: 12, lineHeight: 1.55, color: "var(--color-faint)" }}>
                  <InfoCircleOutlined style={{ marginTop: 3 }} />
                  <span>
                    Yalnızca alıcı ilgilenip iletişim açılırsa alınır. Görmezse ya da ilgilenmezse hiçbir şey ödemezsiniz.
                    {DEMO_EMLAKCI.kurucu && " Kurucu üye olarak ilk 6 ay ücretsiz."}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5">
              {gonderilen ? (
                <div className="rounded-xl px-4 py-4" style={{ background: "var(--ok-wash)", border: "1px solid var(--ok-line)" }}>
                  <div className="mb-1 flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600, color: "var(--color-cream)" }}>
                    <CheckCircleFilled style={{ color: "var(--color-verified)" }} /> Teklifiniz iletildi
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 12px" }}>
                    {PORTFOYUM.find((p) => p.id === gonderilen.portfoyId)?.baslik} ·{" "}
                    {gonderilen.tip === "esnek" ? "esnek teklif" : "tam uyumlu"}. Alıcı karar verdiğinde haber vereceğiz.
                  </p>
                  <Link href="/emlakci/panel"><Button size="small">Panelde gör</Button></Link>
                </div>
              ) : koltukYok ? (
                <div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 12px" }}>
                    Bu talebin {KOLTUK} koltuğu dolu. Tekliflerden biri reddedilirse koltuk açılır.
                  </p>
                  <Button block onClick={() => message.info("Koltuk açılınca size haber vereceğiz")}>Açılınca haber ver</Button>
                </div>
              ) : (
                <>
                  <div className="mb-3" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-cream)" }}>Portföyünüzden seçin</div>
                  <div className="mb-4 flex flex-col gap-2">
                    {sonuclar.map(({ p, k }) => {
                      const olmaz = k.durum === "uygun-degil";
                      const aktif = secili === p.id;
                      return (
                        <Tooltip key={p.id} title={olmaz ? k.farklar.map((f) => `${f.etiket}: ${f.sunulan}`).join(" · ") : undefined} placement="left">
                          <button
                            type="button"
                            disabled={olmaz}
                            onClick={() => setSecili(p.id)}
                            className="w-full rounded-xl px-3.5 py-3 text-left"
                            style={{
                              cursor: olmaz ? "not-allowed" : "pointer",
                              opacity: olmaz ? 0.5 : 1,
                              background: aktif ? "var(--accent-wash)" : "var(--color-surface-2)",
                              border: `1px solid ${aktif ? "var(--accent-line-2)" : "var(--color-line)"}`,
                            }}
                          >
                            <div className="flex items-baseline justify-between gap-2">
                              <span style={{ fontSize: 13.5, color: "var(--color-cream)", fontWeight: 500 }}>{p.baslik}</span>
                              <span className="num" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{tl(p.fiyat)}</span>
                            </div>
                            <div className="mt-1.5">
                              {k.durum === "tam" && <Tag color="gold" style={{ margin: 0 }}>Tüm şartlara uyuyor</Tag>}
                              {k.durum === "esnek" && <Tag style={{ margin: 0, borderStyle: "dashed" }}>Tek fark: {k.farklar[0].etiket.toLocaleLowerCase("tr")}</Tag>}
                              {olmaz && <span style={{ fontSize: 12, color: "var(--color-faint)" }}>Uymuyor · {k.farklar.length} fark</span>}
                            </div>
                          </button>
                        </Tooltip>
                      );
                    })}
                  </div>

                  {esnekSecim && secim && (
                    <div className="mb-3 rounded-xl px-3.5 py-3" style={{ background: "var(--warn-wash)", border: "1px solid var(--warn-line)" }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)" }}>
                        Alıcıya önce yalnızca bu fark gösterilir:{" "}
                        <strong style={{ color: "var(--color-cream)", fontWeight: 600 }}>{secim.k.farklar[0].etiket}</strong> — istenen{" "}
                        {secim.k.farklar[0].istenen}, sizde {secim.k.farklar[0].sunulan}. Alıcı görmek isterse teklif açılır.
                      </div>
                    </div>
                  )}

                  {secim && (
                    <Input.TextArea
                      rows={3}
                      maxLength={300}
                      value={not}
                      onChange={(e) => setNot(e.target.value)}
                      placeholder={esnekSecim ? "Bu farkı neden göz ardı edebilir? (en az 20 karakter)" : "Alıcıya kısa bir not (isteğe bağlı)"}
                      className="mb-3"
                    />
                  )}

                  {ilkUygun ? (
                    <Button type="primary" block size="large" disabled={!gonderilebilir} onClick={gonder}>
                      {esnekSecim ? "Esnek teklif gönder" : "Teklif gönder"}
                    </Button>
                  ) : (
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)", margin: 0 }}>
                      Portföyünüzde bu talebe uyan mülk yok.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
