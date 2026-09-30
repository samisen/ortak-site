"use client";

import { Tooltip } from "antd";
import { SafetyCertificateFilled, TeamOutlined, PictureOutlined } from "@ant-design/icons";
import type { Dogrulama, KriterAnahtari, Kriterler } from "@/lib/types";
import { kriterEtiketleri } from "@/lib/kriterler";
import { KOLTUK } from "@/lib/eslesme";

/* ------------------------------------------------------------
   Kriter çipleri: şart olanlar düz, esnek olanlar kesik çizgili
   ------------------------------------------------------------ */
export function KriterCipleri({
  kriterler,
  esnek = [],
  kucuk = false,
}: {
  kriterler: Kriterler;
  esnek?: KriterAnahtari[];
  kucuk?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {kriterEtiketleri(kriterler).map((k) => {
        const esnekMi = esnek.includes(k.anahtar);
        return (
          <span
            key={k.anahtar}
            className="rounded-md"
            style={{
              fontSize: kucuk ? 11.5 : 12.5,
              padding: kucuk ? "2px 8px" : "4px 10px",
              color: esnekMi ? "var(--color-muted)" : "var(--color-cream)",
              background: esnekMi ? "transparent" : "var(--color-surface-2)",
              border: `1px ${esnekMi ? "dashed" : "solid"} var(--color-line-strong)`,
            }}
          >
            {k.etiket}
            {esnekMi && <span style={{ color: "var(--color-faint)" }}> · esnek</span>}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------
   Koltuk göstergesi: ●●○ 2/3
   ------------------------------------------------------------ */
export function Koltuklar({ dolu, etiket = true }: { dolu: number; etiket?: boolean }) {
  const d = Math.min(dolu, KOLTUK);
  return (
    <Tooltip title={`Bu talebe en fazla ${KOLTUK} emlakçı teklif verebilir. ${KOLTUK - d} koltuk boş.`}>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex gap-1">
          {Array.from({ length: KOLTUK }, (_, i) => (
            <span
              key={i}
              className="inline-block rounded-full"
              style={{
                width: 7,
                height: 7,
                background: i < d ? "var(--color-gold)" : "transparent",
                border: `1.25px solid ${i < d ? "var(--color-gold)" : "var(--color-line-strong)"}`,
              }}
            />
          ))}
        </span>
        {etiket && (
          <span className="num" style={{ fontSize: 12, color: d >= KOLTUK ? "var(--color-cream)" : "var(--color-muted)" }}>
            {d >= KOLTUK ? "koltuklar dolu" : `${d}/${KOLTUK} koltuk`}
          </span>
        )}
      </span>
    </Tooltip>
  );
}

/* ------------------------------------------------------------
   Doğrulama etiketi
   ------------------------------------------------------------ */
export function DogrulamaEtiketi({ tur }: { tur: Dogrulama }) {
  const metin = tur === "banka" ? "Bütçe banka mektubuyla doğrulandı" : "Bütçeye emlakçısı kefil";
  return (
    <Tooltip title={tur === "banka" ? "Alıcı banka referans mektubu yükledi; belge doğrulanıp silindi." : "Talebi açan emlakçı, müşterisinin bütçesine kefil oldu. Yetki belgesi doğrulanmış bir emlakçı."}>
      <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--color-verified)" }}>
        <SafetyCertificateFilled style={{ fontSize: 12 }} />
        {metin}
      </span>
    </Tooltip>
  );
}

/* ------------------------------------------------------------
   Talebi kim açtı
   ------------------------------------------------------------ */
export function AcanEtiketi({ acan }: { acan: "alici" | "emlakci" }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded px-2 py-0.5"
      style={{ fontSize: 11.5, color: "var(--color-muted)", background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
    >
      {acan === "emlakci" && <TeamOutlined style={{ fontSize: 10 }} />}
      {acan === "alici" ? "Doğrudan alıcı" : "Emlakçı, müşterisi adına"}
    </span>
  );
}

/* ------------------------------------------------------------
   Fotoğraf alanı — görseller alıcı koduyla filigranlıdır;
   sızarsa kimden sızdığı bellidir
   ------------------------------------------------------------ */
export function FotoAlani({
  adet,
  filigran,
  bulanik = false,
  yukseklik = 190,
}: {
  adet: number;
  filigran: string;
  bulanik?: boolean;
  yukseklik?: number;
}) {
  return (
    <div className="locked-media relative rounded-xl" style={{ height: yukseklik, border: "1px solid var(--color-line)" }}>
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ backdropFilter: bulanik ? "blur(6px)" : undefined }}
      >
        {!bulanik && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-around overflow-hidden py-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="num block text-center"
                style={{ fontSize: 11, letterSpacing: ".22em", color: "var(--color-faint)", opacity: 0.55, whiteSpace: "nowrap", transform: "rotate(-12deg)" }}
              >
                {filigran} · {filigran}
              </span>
            ))}
          </div>
        )}
        <span
          className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ fontSize: 12, background: "var(--locked-badge-bg)", border: "1px solid var(--color-line-strong)", color: "var(--color-muted)" }}
        >
          <PictureOutlined style={{ fontSize: 12 }} />
          {bulanik ? "Önce farkı görün" : `${adet} fotoğraf`}
        </span>
      </div>
    </div>
  );
}
