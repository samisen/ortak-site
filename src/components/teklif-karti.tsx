"use client";

import { useState } from "react";
import { Button, Modal, Tag, Tooltip } from "antd";
import { CheckCircleFilled, EnvironmentOutlined, PhoneFilled, ShopFilled } from "@ant-design/icons";
import type { Talep, Teklif } from "@/lib/types";
import { karsilastir } from "@/lib/eslesme";
import { metre, tl } from "@/lib/format";
import type { AliciKarari } from "@/lib/demo-store";
import { FotoAlani } from "./ui";

type Mod = "alici" | "temsilci";

const RED_SEBEPLERI = ["Fiyat", "Konum", "Mülkün kendisi", "Zamanlama", "Diğer"];

export default function TeklifKarti({
  teklif,
  talep,
  karar,
  onKarar,
  mod = "alici",
  filigran,
}: {
  teklif: Teklif;
  talep: Talep;
  karar?: AliciKarari;
  onKarar: (k: AliciKarari, sebep?: string) => void;
  mod?: Mod;
  filigran: string;
}) {
  const [redAcik, setRedAcik] = useState(false);
  const [sebep, setSebep] = useState<string>();
  const [iletisimAcik, setIletisimAcik] = useState(false);

  const k = karsilastir(talep, teklif.portfoy);
  const esnek = k.durum === "esnek";
  const fark = k.farklar[0];
  const p = teklif.portfoy;
  const e = teklif.emlakci;

  const ilgiEtiketi = mod === "alici" ? "İlgileniyorum" : "Müşterim ilgileniyor";

  /* ---------- Reddedildi: sessiz satır ---------- */
  if (karar === "ilgilenmiyor") {
    return (
      <div className="panel-2 flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ opacity: 0.7 }}>
        <span style={{ fontSize: 13.5, color: "var(--color-muted)" }}>{p.baslik}</span>
        <span style={{ fontSize: 12, color: "var(--color-faint)" }}>İlgilenilmedi · emlakçıya ücret yansımadı, koltuk yeniden açıldı</span>
      </div>
    );
  }

  /* ---------- Esnek teklif ön kartı ---------- */
  if (esnek && !karar) {
    return (
      <article className="panel overflow-hidden" style={{ borderStyle: "dashed", borderColor: "var(--color-line-strong)" }}>
        <div className="grid gap-5 p-5 md:grid-cols-[200px_1fr]">
          <FotoAlani adet={p.fotoAdet} filigran={filigran} bulanik yukseklik={170} />
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Tag style={{ margin: 0, borderStyle: "dashed" }}>Esnek teklif</Tag>
              <span style={{ fontSize: 12, color: "var(--color-faint)" }}>%{k.uyum} uyum</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--color-cream)", margin: "0 0 14px" }}>
              Bu mülk talebinizin diğer tüm şartlarına uyuyor. Tek bir fark var:
            </p>
            <div
              className="mb-4 rounded-xl px-4 py-3.5"
              style={{ background: "var(--warn-wash)", border: "1px solid var(--warn-line)" }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-cream)", marginBottom: 4 }}>{fark.etiket}</div>
              <div className="num" style={{ fontSize: 13, color: "var(--color-muted)" }}>
                İstediğiniz: <span style={{ color: "var(--color-cream)" }}>{fark.istenen}</span>
                <span style={{ margin: "0 8px", color: "var(--color-faint)" }}>·</span>
                Bu mülkte: <span style={{ color: "var(--warn-fg)", fontWeight: 500 }}>{fark.sunulan}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 16px" }}>
              Emlakçının notu: “{teklif.not}”
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button type="primary" onClick={() => onKarar("farki-gordu")}>Görmek isterim</Button>
              <Tooltip title="Teklif kapanır, emlakçıya ücret yansımaz">
                <Button onClick={() => onKarar("ilgilenmiyor", `${fark.etiket} şart`)}>Bu benim için şart</Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ---------- Tam teklif (ya da farkı görülmüş esnek teklif) ---------- */
  const baglandi = karar === "baglandi";
  const ozellikler = [
    `${p.oda} oda`,
    `${p.alan} m²`,
    p.arsa ? `${p.arsa.toLocaleString("tr-TR")} m² arsa` : null,
    `denize ${metre(p.deniz)}`,
    p.havuz ? "havuz" : null,
    p.bahce ? "bahçe" : null,
    p.yilBoyu ? "kışın oturulabilir" : null,
  ].filter(Boolean) as string[];

  return (
    <article className="panel overflow-hidden" style={{ borderColor: baglandi ? "var(--ok-line)" : undefined }}>
      <div className="grid gap-5 p-5 md:grid-cols-[200px_1fr]">
        <FotoAlani adet={p.fotoAdet} filigran={filigran} yukseklik={170} />
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {esnek ? (
              <Tag style={{ margin: 0, borderStyle: "dashed" }}>Esnek teklif · {fark.etiket.toLocaleLowerCase("tr")} farklı</Tag>
            ) : (
              <Tag color="gold" style={{ margin: 0 }}>Tüm şartlarınıza uyuyor</Tag>
            )}
            <span style={{ fontSize: 12, color: "var(--color-faint)" }}>%{k.uyum} uyum</span>
          </div>

          <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 6px", color: "var(--color-cream)", lineHeight: 1.35 }}>{p.baslik}</h3>

          <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="num display" style={{ fontSize: 24, color: "var(--color-gold-soft)" }}>{tl(p.fiyat)}</span>
            <span className="inline-flex items-center gap-1" style={{ fontSize: 13, color: "var(--color-muted)" }}>
              <EnvironmentOutlined style={{ fontSize: 11 }} /> {p.semt}
            </span>
          </div>

          <div className="mb-3" style={{ fontSize: 13, color: "var(--color-muted)" }}>{ozellikler.join(" · ")}</div>

          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--color-cream)", margin: "0 0 14px" }}>“{teklif.not}”</p>

          <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ fontSize: 12, color: "var(--color-faint)" }}>
            <span className="inline-flex items-center gap-1.5"><ShopFilled style={{ fontSize: 10 }} /> {baglandi ? `${e.ad} · ${e.kurum}` : e.kod}</span>
            {e.kurucu && <span>Kurucu üye</span>}
            <span>Teklifleri %{e.kabulOrani} oranında ilgi görüyor</span>
          </div>

          {baglandi ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg px-4 py-3" style={{ background: "var(--ok-wash)", border: "1px solid var(--ok-line)" }}>
              <CheckCircleFilled style={{ color: "var(--color-verified)" }} />
              <span style={{ fontSize: 13.5, color: "var(--color-cream)" }}>İletişim açıldı</span>
              <span className="num inline-flex items-center gap-1.5" style={{ fontSize: 13.5, color: "var(--color-cream)", fontWeight: 600 }}>
                <PhoneFilled style={{ fontSize: 12 }} /> {e.telefon}
              </span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              <Button type="primary" onClick={() => setIletisimAcik(true)}>{ilgiEtiketi}</Button>
              <Button onClick={() => setRedAcik(true)}>İlgilenmiyorum</Button>
            </div>
          )}
        </div>
      </div>

      {/* İletişim onayı */}
      <Modal
        open={iletisimAcik}
        onCancel={() => setIletisimAcik(false)}
        title="İletişim bilgileri açılsın mı?"
        okText="Evet, açılsın"
        cancelText="Vazgeç"
        onOk={() => {
          onKarar("baglandi");
          setIletisimAcik(false);
        }}
      >
        <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--color-muted)" }}>
          {mod === "alici"
            ? "Emlakçının adı ve telefonu size, sizin adınız ve telefonunuz emlakçıya açılır. Bundan sonrası ikiniz arasında."
            : "Teklif veren emlakçıyla karşılıklı iletişim bilgileriniz açılır. Müşterinizin kimliği yine sizde kalır."}
        </p>
      </Modal>

      {/* İlgilenmeme sebebi */}
      <Modal
        open={redAcik}
        onCancel={() => setRedAcik(false)}
        title="Neden ilgilenmediniz?"
        okText="Gönder"
        cancelText="Vazgeç"
        onOk={() => {
          onKarar("ilgilenmiyor", sebep);
          setRedAcik(false);
        }}
      >
        <p style={{ fontSize: 13.5, color: "var(--color-muted)", margin: "0 0 14px" }}>
          İsteğe bağlı. Emlakçı yalnızca sebebi görür, sizi görmez; ücret yansımaz.
        </p>
        <div className="flex flex-wrap gap-2">
          {RED_SEBEPLERI.map((s) => (
            <Tag.CheckableTag key={s} checked={sebep === s} onChange={(c) => setSebep(c ? s : undefined)} style={{ fontSize: 13, padding: "4px 12px" }}>
              {s}
            </Tag.CheckableTag>
          ))}
        </div>
      </Modal>
    </article>
  );
}
