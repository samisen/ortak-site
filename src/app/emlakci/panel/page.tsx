"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button, Table, Tabs, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { useDemo } from "@/lib/demo-store";
import { DEMO_EMLAKCI, GECMIS_TEKLIFLERIM, MUSTERI_TALEPLERIM, PORTFOYUM, talepTeklifleri } from "@/lib/data";
import { baglantiUcreti, KOLTUK, portfoyUyumu } from "@/lib/eslesme";
import { butceAralik, kalanGun, metre, tl } from "@/lib/format";
import { DogrulamaEtiketi, KriterCipleri, Koltuklar } from "@/components/ui";
import TeklifKarti from "@/components/teklif-karti";

type Durum = "bekliyor" | "baglandi" | "reddedildi" | "suresi-doldu";

interface Satir {
  key: string;
  talepId: string;
  mulk: string;
  tip: "tam" | "esnek";
  durum: Durum;
  ucret: string;
}

const DURUM: Record<Durum, { etiket: string; renk?: string }> = {
  bekliyor: { etiket: "Karar bekleniyor", renk: "gold" },
  baglandi: { etiket: "İletişim açıldı", renk: "green" },
  reddedildi: { etiket: "İlgilenilmedi" },
  "suresi-doldu": { etiket: "Görülmedi" },
};

export default function Panel() {
  const { gonderilenler, tumTalepler, yeniTalepler, kararlar, kararVer, koltukDolu } = useDemo();

  const satirlar: Satir[] = useMemo(() => {
    const yeni: Satir[] = gonderilenler.map((g, i) => {
      const t = tumTalepler.find((x) => x.id === g.talepId);
      return {
        key: `y${i}`,
        talepId: g.talepId,
        mulk: PORTFOYUM.find((p) => p.id === g.portfoyId)?.baslik ?? "",
        tip: g.tip,
        durum: "bekliyor",
        ucret: t ? `Bağlanırsa ${DEMO_EMLAKCI.kurucu ? "₺0" : tl(baglantiUcreti(t))}` : "",
      };
    });
    const eski: Satir[] = GECMIS_TEKLIFLERIM.map((g, i) => ({
      key: `e${i}`,
      talepId: g.talepId,
      mulk: g.mulk,
      tip: g.tip,
      durum: g.durum,
      ucret: g.durum === "baglandi" ? `${tl(g.ucret)} · kurucu, alınmadı` : "Ödenmedi",
    }));
    return [...yeni, ...eski];
  }, [gonderilenler, tumTalepler]);

  const baglanti = satirlar.filter((s) => s.durum === "baglandi").length;
  const karar = satirlar.filter((s) => s.durum !== "bekliyor").length;
  const musteriTalepleri = [
    ...yeniTalepler.filter((t) => t.acan === "emlakci"),
    ...tumTalepler.filter((t) => MUSTERI_TALEPLERIM.includes(t.id)),
  ];

  const kolonlar: ColumnsType<Satir> = [
    {
      title: "Talep", dataIndex: "talepId", width: 96,
      // Kapanmış taleplerin sayfası yok; yalnızca açık olanlara bağlantı ver
      render: (v: string) =>
        tumTalepler.some((t) => t.id === v) ? (
          <Link href={`/emlakci/talep/${v}`} className="num" style={{ color: "var(--color-gold)" }}>{v}</Link>
        ) : (
          <span className="num" style={{ color: "var(--color-faint)" }}>{v}</span>
        ),
    },
    { title: "Sunduğunuz mülk", dataIndex: "mulk" },
    {
      title: "Tür", dataIndex: "tip", width: 96,
      render: (v: Satir["tip"]) => <Tag style={{ margin: 0, borderStyle: v === "esnek" ? "dashed" : "solid" }}>{v === "esnek" ? "Esnek" : "Tam"}</Tag>,
    },
    {
      title: "Durum", dataIndex: "durum", width: 150,
      render: (v: Durum) => <Tag color={DURUM[v].renk} style={{ margin: 0 }}>{DURUM[v].etiket}</Tag>,
    },
    { title: "Ücret", dataIndex: "ucret", width: 200, render: (v: string) => <span className="num" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{v}</span> },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <div className="mb-8">
        <h1 className="display" style={{ fontSize: "clamp(30px,4vw,40px)", margin: "0 0 8px" }}>{DEMO_EMLAKCI.kurum}</h1>
        <p style={{ fontSize: 14, color: "var(--color-muted)", margin: 0 }}>
          {DEMO_EMLAKCI.ad} · Yetki belgesi {DEMO_EMLAKCI.yetkiBelgesi} · {DEMO_EMLAKCI.kurucu ? "Kurucu üye, ilk 6 ay ücretsiz" : "Üye"}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { e: "Karar bekleyen teklif", d: String(satirlar.length - karar), a: "görülmezse ücret yok" },
          { e: "İletişim açılan", d: String(baglanti), a: "son 30 gün" },
          { e: "Kabul oranınız", d: `%${DEMO_EMLAKCI.kabulOrani}`, a: "erken erişim açık", vurgu: true },
          { e: "Ödediğiniz", d: "₺0", a: "kurucu üye" },
        ].map((k) => (
          <div key={k.e} className="panel p-5">
            <div className="overline mb-2">{k.e}</div>
            <div className="num display" style={{ fontSize: 30, color: k.vurgu ? "var(--color-gold-soft)" : "var(--color-cream)" }}>{k.d}</div>
            <div style={{ fontSize: 12, color: "var(--color-faint)" }}>{k.a}</div>
          </div>
        ))}
      </div>

      <Tabs
        items={[
          {
            key: "teklifler",
            label: "Tekliflerim",
            children: (
              <div className="panel overflow-hidden">
                <Table columns={kolonlar} dataSource={satirlar} pagination={false} scroll={{ x: 720 }} />
              </div>
            ),
          },
          {
            key: "musteri",
            label: `Müşterilerimin talepleri (${musteriTalepleri.length})`,
            children: (
              <div className="flex flex-col gap-8">
                <div className="flex justify-end">
                  <Link href="/emlakci/talep-ac"><Button icon={<PlusOutlined />}>Müşterim adına talep aç</Button></Link>
                </div>
                {musteriTalepleri.map((t) => {
                  const gelen = talepTeklifleri(t.id);
                  return (
                    <section key={t.id}>
                      <div className="panel mb-4 p-5">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <span className="num display" style={{ fontSize: 22, color: "var(--color-gold-soft)" }}>{butceAralik(t.butceMin, t.butceMax)}</span>
                          <span className="num" style={{ fontSize: 12, color: "var(--color-faint)" }}>{t.id} · {kalanGun(t.bitis)} gün açık</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-cream)", margin: "0 0 12px" }}>“{t.cumle}”</p>
                        <div className="mb-3"><KriterCipleri kriterler={t.kriterler} esnek={t.esnek} kucuk /></div>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                          <Koltuklar dolu={koltukDolu(t.id)} />
                          <DogrulamaEtiketi tur={t.dogrulama} />
                        </div>
                      </div>
                      {gelen.length ? (
                        <div className="flex flex-col gap-4">
                          {gelen.map((tk) => (
                            <TeklifKarti key={tk.id} teklif={tk} talep={t} karar={kararlar[tk.id]} onKarar={(k, s) => kararVer(tk.id, k, s)} mod="temsilci" filigran={DEMO_EMLAKCI.kod} />
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 13, color: "var(--color-muted)" }}>Henüz teklif yok · {KOLTUK} koltuk boş.</p>
                      )}
                    </section>
                  );
                })}
              </div>
            ),
          },
          {
            key: "portfoy",
            label: `Portföyüm (${PORTFOYUM.length})`,
            children: (
              <div>
                <p style={{ fontSize: 13.5, color: "var(--color-muted)", margin: "0 0 16px" }}>
                  Portföyünüz hiçbir alıcıya gösterilmez; yalnızca hangi talebe uyduğunu hesaplamak için kullanılır.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {PORTFOYUM.map((p) => {
                    const uyan = tumTalepler.filter((t) => {
                      const u = portfoyUyumu(t, [p]);
                      return (u.tam || u.esnek) && koltukDolu(t.id) < KOLTUK && !MUSTERI_TALEPLERIM.includes(t.id);
                    }).length;
                    return (
                      <div key={p.id} className="panel p-5">
                        <div className="mb-1 flex items-baseline justify-between gap-3">
                          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-cream)" }}>{p.baslik}</span>
                          <span className="num" style={{ fontSize: 13.5, color: "var(--color-gold-soft)" }}>{tl(p.fiyat)}</span>
                        </div>
                        <div className="mb-3" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                          {p.semt} · {p.oda} oda · {p.alan} m² · denize {metre(p.deniz)}
                        </div>
                        <span style={{ fontSize: 12.5, color: uyan ? "var(--color-gold-soft)" : "var(--color-faint)" }}>
                          {uyan ? `${uyan} açık talebe uyuyor` : "Şu an uyan açık talep yok"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
