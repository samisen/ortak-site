"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Table, Tag, Progress, Tooltip, Modal, App, Alert } from "antd";
import {
  ThunderboltFilled, ArrowLeftOutlined, CheckCircleFilled, ReloadOutlined,
  EyeOutlined, ClockCircleOutlined, CloseCircleOutlined, RiseOutlined,
} from "@ant-design/icons";
import { SATICI } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { useTema } from "@/lib/tema";
import type { ColumnsType } from "antd/es/table";

const PAKETLER = [
  { jeton: 10, fiyat: 5_000, populer: false },
  { jeton: 30, fiyat: 13_500, populer: true },
  { jeton: 100, fiyat: 39_000, populer: false },
];

type TeklifDurum = "bekliyor" | "goruntulendi" | "acildi" | "iade" | "reddedildi";

interface Satir {
  key: string;
  talep: string;
  baslik: string;
  fiyat: string;
  jeton: number;
  durum: TeklifDurum;
  tarih: string;
}

const SATIRLAR: Satir[] = [
  { key: "1", talep: "TLP-4821", baslik: "Türkbükü, denize 180 m, 520 m² villa", fiyat: "₺98.000.000", jeton: 5, durum: "acildi", tarih: "27 Eyl" },
  { key: "2", talep: "TLP-4762", baslik: "Zekeriyaköy, 420 m² müstakil", fiyat: "₺68.500.000", jeton: 4, durum: "goruntulendi", tarih: "27 Eyl" },
  { key: "3", talep: "TLP-4702", baslik: "Göcek, iskele haklı villa", fiyat: "€3.900.000", jeton: 6, durum: "bekliyor", tarih: "26 Eyl" },
  { key: "4", talep: "TLP-4790", baslik: "Kandilli, deniz cepheli yalı dairesi", fiyat: "$7.800.000", jeton: 8, durum: "acildi", tarih: "24 Eyl" },
  { key: "5", talep: "TLP-4776", baslik: "Alaçatı merkez, 380 m² taş ev", fiyat: "₺36.000.000", jeton: 4, durum: "iade", tarih: "22 Eyl" },
  { key: "6", talep: "TLP-4749", baslik: "Kalkan, 2.400 m² imarlı arazi", fiyat: "₺21.000.000", jeton: 3, durum: "reddedildi", tarih: "21 Eyl" },
  { key: "7", talep: "TLP-4805", baslik: "Teşvikiye, 240 m² 4+1", fiyat: "₺54.000.000", jeton: 4, durum: "iade", tarih: "19 Eyl" },
  { key: "8", talep: "TLP-4718", baslik: "Maslak, kiracılı ofis katı", fiyat: "₺118.000.000", jeton: 10, durum: "goruntulendi", tarih: "17 Eyl" },
];

const DURUM: Record<TeklifDurum, { etiket: string; renk: string; ikon: React.ReactNode }> = {
  bekliyor:    { etiket: "Bekliyor",        renk: "default",   ikon: <ClockCircleOutlined /> },
  goruntulendi:{ etiket: "Görüntülendi",    renk: "gold",      ikon: <EyeOutlined /> },
  acildi:      { etiket: "İletişim açıldı", renk: "green",     ikon: <CheckCircleFilled /> },
  iade:        { etiket: "Jeton iade",      renk: "blue",      ikon: <ReloadOutlined /> },
  reddedildi:  { etiket: "Reddedildi",      renk: "default",   ikon: <CloseCircleOutlined /> },
};

export default function Panel() {
  const { message } = App.useApp();
  const { jeton, yukle } = useDemo();
  const { palet } = useTema();
  const [satinAlim, setSatinAlim] = useState<(typeof PAKETLER)[number] | null>(null);

  const harcanan = SATIRLAR.filter((s) => s.durum !== "iade").reduce((a, s) => a + s.jeton, 0);
  const iadeEdilen = SATIRLAR.filter((s) => s.durum === "iade").reduce((a, s) => a + s.jeton, 0);
  const acilanSayi = SATIRLAR.filter((s) => s.durum === "acildi").length;
  const donusum = Math.round((acilanSayi / SATIRLAR.length) * 100);
  const gercekMaliyet = harcanan * 500;

  const kolonlar: ColumnsType<Satir> = [
    {
      title: "Talep",
      dataIndex: "talep",
      width: 108,
      render: (v: string) => (
        <Link href={`/talepler/${v}`} className="num no-underline" style={{ fontSize: 12, color: "var(--color-gold)" }}>
          {v}
        </Link>
      ),
    },
    {
      title: "Sunduğunuz varlık",
      dataIndex: "baslik",
      render: (v: string) => <span style={{ fontSize: 13, color: "var(--color-cream)" }}>{v}</span>,
    },
    {
      title: "Fiyatınız",
      dataIndex: "fiyat",
      width: 138,
      align: "right",
      render: (v: string) => <span className="num" style={{ fontSize: 13, color: "var(--color-muted)" }}>{v}</span>,
    },
    {
      title: "Jeton",
      dataIndex: "jeton",
      width: 78,
      align: "center",
      render: (v: number, r) => (
        <span
          className="num"
          style={{ fontSize: 13, color: r.durum === "iade" ? "var(--color-faint)" : "var(--color-cream)", textDecoration: r.durum === "iade" ? "line-through" : "none" }}
        >
          {v}
        </span>
      ),
    },
    {
      title: "Durum",
      dataIndex: "durum",
      width: 152,
      render: (v: TeklifDurum) => (
        <Tag color={DURUM[v].renk} icon={DURUM[v].ikon} style={{ fontSize: 11.5 }}>
          {DURUM[v].etiket}
        </Tag>
      ),
    },
    { title: "Tarih", dataIndex: "tarih", width: 78, render: (v: string) => <span style={{ fontSize: 12, color: "var(--color-faint)" }}>{v}</span> },
  ];

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-8">
      <Link href="/talepler" className="mb-6 inline-flex items-center gap-2 no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Talep akışı
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="overline mb-2.5">Satıcı paneli</div>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,42px)", margin: 0 }}>
            {SATICI.kurum}
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "10px 0 0" }}>
            {SATICI.ad} · <span className="num">{SATICI.kod}</span> · Kurumsal üye
          </p>
        </div>

        <div
          className="flex items-center gap-5 rounded-xl px-5 py-4"
          style={{ background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}
        >
          <div>
            <div className="overline mb-1">Jeton bakiyeniz</div>
            <div className="flex items-baseline gap-2">
              <ThunderboltFilled style={{ color: "var(--color-gold)", fontSize: 16 }} />
              <span className="num display" style={{ fontSize: 34, color: "var(--color-gold-soft)" }}>{jeton}</span>
            </div>
          </div>
          <Button type="primary" onClick={() => setSatinAlim(PAKETLER[1])}>
            Jeton al
          </Button>
        </div>
      </div>

      {/* --- Özet kartlar --- */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { etiket: "Verilen teklif", deger: SATIRLAR.length, alt: "son 30 günde" },
          { etiket: "İletişim açıldı", deger: acilanSayi, alt: `%${donusum} dönüşüm`, vurgu: true },
          { etiket: "İade edilen jeton", deger: iadeEdilen, alt: "dönüş olmadığı için" },
          { etiket: "Net harcama", deger: `₺${gercekMaliyet.toLocaleString("tr-TR")}`, alt: "son 30 gün" },
        ].map((k) => (
          <div key={k.etiket} className="panel p-5">
            <div className="overline mb-2">{k.etiket}</div>
            <div
              className="num display mb-1"
              style={{ fontSize: 30, color: k.vurgu ? "var(--color-gold-soft)" : "var(--color-cream)" }}
            >
              {k.deger}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{k.alt}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* --- Teklif tablosu --- */}
        <div>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--color-line)" }}>
              <h2 style={{ fontSize: 15.5, fontWeight: 600, margin: 0, color: "var(--color-cream)" }}>
                Verdiğiniz teklifler
              </h2>
              <Link href="/talepler">
                <Button size="small" type="primary">Yeni teklif ver</Button>
              </Link>
            </div>
            <Table
              columns={kolonlar}
              dataSource={SATIRLAR}
              pagination={false}
              size="middle"
              scroll={{ x: 760 }}
            />
          </div>

          {/* Huni */}
          <div className="panel mt-6 p-5">
            <h2 className="mb-4" style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 16px", color: "var(--color-cream)" }}>
              Dönüşüm huniniz
            </h2>
            <div className="flex flex-col gap-3.5">
              {[
                { etiket: "İncelediğiniz talep", deger: 46, oran: 100 },
                { etiket: "Teklif verdiğiniz", deger: SATIRLAR.length, oran: 17 },
                { etiket: "Görüntülenen", deger: 6, oran: 13 },
                { etiket: "İletişim açılan", deger: acilanSayi, oran: 4 },
                { etiket: "Görüşmeye giden", deger: 2, oran: 2 },
              ].map((h) => (
                <div key={h.etiket}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span style={{ fontSize: 13, color: "var(--color-muted)" }}>{h.etiket}</span>
                    <span className="num" style={{ fontSize: 13, color: "var(--color-cream)", fontWeight: 600 }}>{h.deger}</span>
                  </div>
                  <Progress
                    percent={h.oran}
                    showInfo={false}
                    size={["100%", 6]}
                    strokeColor={palet.gold}
                    railColor={palet.surface3}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Sağ sütun --- */}
        <aside className="flex flex-col gap-4">
          {/* Maliyet karşılaştırması */}
          <div className="panel p-5">
            <div className="mb-4 flex items-center gap-2">
              <RiseOutlined style={{ color: "var(--color-gold)", fontSize: 14 }} />
              <span className="overline">Maliyet karşılaştırması</span>
            </div>
            <div className="mb-3 flex items-baseline justify-between">
              <span style={{ fontSize: 13, color: "var(--color-faint)" }}>Klasik ilan sitesi / ay</span>
              <span className="num" style={{ fontSize: 15, color: "var(--color-faint)", textDecoration: "line-through" }}>
                ₺24.000
              </span>
            </div>
            <div className="mb-4 flex items-baseline justify-between">
              <span style={{ fontSize: 13, color: "var(--color-cream)" }}>Sizin net harcamanız</span>
              <span className="num" style={{ fontSize: 19, color: "var(--color-gold-soft)", fontWeight: 600 }}>
                ₺{gercekMaliyet.toLocaleString("tr-TR")}
              </span>
            </div>
            <div
              className="rounded-lg px-3.5 py-3"
              style={{ fontSize: 11.5, lineHeight: 1.6, color: "var(--color-muted)", background: "var(--color-surface-2)" }}
            >
              Dönüş alamadığınız <strong className="num" style={{ color: "var(--color-cream)", fontWeight: 500 }}>{iadeEdilen} jeton</strong>{" "}
              (₺{(iadeEdilen * 500).toLocaleString("tr-TR")}) iade edildi. Sabit ilan ücretinde bu para yanardı.
            </div>
          </div>

          {/* Jeton paketleri */}
          <div className="panel p-5">
            <div className="overline mb-4">Jeton paketleri</div>
            <div className="flex flex-col gap-2.5">
              {PAKETLER.map((p) => (
                <button
                  key={p.jeton}
                  onClick={() => setSatinAlim(p)}
                  className="lift w-full cursor-pointer rounded-xl px-4 py-3.5 text-left"
                  style={{
                    background: p.populer ? "var(--accent-wash)" : "var(--color-surface-2)",
                    border: `1px solid ${p.populer ? "var(--accent-line-2)" : "var(--color-line)"}`,
                  }}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="num" style={{ fontSize: 17, fontWeight: 600, color: "var(--color-cream)" }}>
                      {p.jeton} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--color-muted)" }}>jeton</span>
                    </span>
                    <span className="num" style={{ fontSize: 15, color: "var(--color-gold-soft)", fontWeight: 600 }}>
                      ₺{p.fiyat.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="num" style={{ fontSize: 11, color: "var(--color-faint)" }}>
                      jeton başı ₺{Math.round(p.fiyat / p.jeton).toLocaleString("tr-TR")}
                    </span>
                    {p.populer && (
                      <span
                        className="rounded px-1.5 py-0.5"
                        style={{ fontSize: 10, background: "var(--color-gold-dim)", color: "var(--color-gold-soft)" }}
                      >
                        en çok tercih edilen
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <Alert
              className="mt-4"
              type="info"
              showIcon
              style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
              title={
                <span style={{ fontSize: 11.5, lineHeight: 1.55, color: "var(--color-faint)" }}>
                  Jetonların süresi dolmaz. Aylık sabit ücret veya taahhüt yoktur.
                </span>
              }
            />
          </div>

          {/* Portföy uyarısı */}
          <div
            className="rounded-xl p-5"
            style={{ background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}
          >
            <div className="mb-1.5" style={{ fontSize: 13.5, fontWeight: 600, color: "var(--color-cream)" }}>
              Portföyünüzü tanımlayın
            </div>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 14px" }}>
              Elinizdeki varlıkları sisteme girerseniz uyum skorları hesaplanır ve yalnızca gerçekten
              eşleşen talepler için bildirim alırsınız. Portföyünüz hiçbir alıcıya gösterilmez.
            </p>
            <Tooltip title="Prototipte bu akış henüz yok">
              <Button block size="small">Portföy ekle</Button>
            </Tooltip>
          </div>
        </aside>
      </div>

      {/* --- Satın alma modalı --- */}
      <Modal
        open={!!satinAlim}
        onCancel={() => setSatinAlim(null)}
        title="Jeton satın al"
        okText="Ödemeyi tamamla"
        cancelText="Vazgeç"
        onOk={() => {
          if (satinAlim) {
            yukle(satinAlim.jeton);
            message.success(`${satinAlim.jeton} jeton hesabınıza tanımlandı`);
          }
          setSatinAlim(null);
        }}
        width={440}
      >
        {satinAlim && (
          <div className="py-3">
            <div className="panel-2 mb-4 p-5 text-center">
              <div className="num display mb-1" style={{ fontSize: 44, color: "var(--color-gold-soft)" }}>
                {satinAlim.jeton}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-muted)" }}>jeton</div>
            </div>
            {[
              ["Paket tutarı", `₺${satinAlim.fiyat.toLocaleString("tr-TR")}`],
              ["Jeton başı maliyet", `₺${Math.round(satinAlim.fiyat / satinAlim.jeton).toLocaleString("tr-TR")}`],
              ["Yeni bakiyeniz", `${jeton + satinAlim.jeton} jeton`],
            ].map(([e, d]) => (
              <div key={e} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid var(--color-line)" }}>
                <span style={{ fontSize: 13, color: "var(--color-faint)" }}>{e}</span>
                <span className="num" style={{ fontSize: 13.5, color: "var(--color-cream)", fontWeight: 500 }}>{d}</span>
              </div>
            ))}
            <div className="mt-4" style={{ fontSize: 11.5, lineHeight: 1.55, color: "var(--color-faint)" }}>
              Prototip — gerçek bir ödeme alınmaz.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
