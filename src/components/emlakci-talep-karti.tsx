"use client";

import Link from "next/link";
import { Tooltip } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined, ThunderboltFilled } from "@ant-design/icons";
import type { Talep } from "@/lib/types";
import { butceAralik, gecenSaat, gecenSure, kalanGun } from "@/lib/format";
import { ERKEN_ERISIM_SAAT, KOLTUK, portfoyUyumu } from "@/lib/eslesme";
import { talepBolgesi } from "@/lib/bolgeler";
import { konumMetni } from "@/lib/kriterler";
import { PORTFOYUM } from "@/lib/data";
import { AcanEtiketi, DogrulamaEtiketi, KriterCipleri, Koltuklar } from "./ui";

export default function EmlakciTalepKarti({
  talep: t,
  koltukDolu,
  gonderildi,
}: {
  talep: Talep;
  koltukDolu: number;
  gonderildi: boolean;
}) {
  const dolu = koltukDolu >= KOLTUK && !gonderildi;
  const { tam, esnek } = portfoyUyumu(t, PORTFOYUM);
  const erken = gecenSaat(t.yayin) < ERKEN_ERISIM_SAAT;

  return (
    <Link href={`/emlakci/talep/${t.id}`} className="block h-full no-underline">
      <article className="panel lift flex h-full flex-col p-5" style={{ color: "inherit", opacity: dolu ? 0.6 : 1 }}>
        {/* Üst satır */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="overline" style={{ color: "var(--color-gold)", letterSpacing: ".14em" }}>
            {talepBolgesi(t.kriterler.semtler)}
          </span>
          <AcanEtiketi acan={t.acan} />
          {erken && (
            <Tooltip title={`İlk ${ERKEN_ERISIM_SAAT} saat yalnızca yüksek kabul oranlı emlakçılar görüyor`}>
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5" style={{ fontSize: 11.5, color: "var(--color-gold-soft)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}>
                <ThunderboltFilled style={{ fontSize: 10 }} /> Erken erişim
              </span>
            </Tooltip>
          )}
          <span className="num ml-auto" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{t.id}</span>
        </div>

        {/* Bütçe */}
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
          <span className="num display" style={{ fontSize: 27, color: "var(--color-gold-soft)" }}>{butceAralik(t.butceMin, t.butceMax)}</span>
          {t.pesin && <span style={{ fontSize: 13, color: "var(--color-muted)" }}>peşin</span>}
        </div>
        <div className="mb-3 flex items-center gap-1.5" style={{ fontSize: 13, color: "var(--color-muted)" }}>
          <EnvironmentOutlined style={{ fontSize: 11 }} /> {konumMetni(t.kriterler.semtler)}
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--color-cream)", margin: "0 0 14px" }}>“{t.cumle}”</p>

        <div className="mb-4">
          <KriterCipleri kriterler={t.kriterler} esnek={t.esnek} kucuk />
        </div>

        {/* Alt bar */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3.5" style={{ borderTop: "1px solid var(--color-line)" }}>
          <Koltuklar dolu={koltukDolu} />
          <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--color-faint)" }}>
            <ClockCircleOutlined style={{ fontSize: 11 }} /> {kalanGun(t.bitis)} gün · {gecenSure(t.yayin)}
          </span>
          <span className="ml-auto">
            {gonderildi ? (
              <span style={{ fontSize: 12, color: "var(--color-verified)" }}>Teklif verdiniz</span>
            ) : tam || esnek ? (
              <span className="rounded px-2 py-0.5" style={{ fontSize: 12, fontWeight: 500, color: "var(--color-gold-soft)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}>
                Portföyünüzde {tam ? `${tam} tam` : ""}{tam && esnek ? " · " : ""}{esnek ? `${esnek} esnek` : ""} uyan
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "var(--color-faint)" }}>Portföyünüzde uyan yok</span>
            )}
          </span>
        </div>
        <div className="mt-2">
          <DogrulamaEtiketi tur={t.dogrulama} />
        </div>
      </article>
    </Link>
  );
}
