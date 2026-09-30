"use client";

import Link from "next/link";
import { Tooltip } from "antd";
import { EnvironmentOutlined, EyeOutlined, FieldTimeOutlined, TeamOutlined } from "@ant-design/icons";
import { butceAralik, gecenSure, kalanGun } from "@/lib/format";
import { KATEGORI_METIN } from "@/lib/data";
import { RozetListesi } from "./rozetler";
import type { Talep } from "@/lib/types";

const ACILIYET_RENK: Record<Talep["aciliyet"], { bg: string; bd: string; fg: string }> = {
  acil:    { bg: "var(--warn-wash)", bd: "var(--warn-line)", fg: "var(--warn-fg)" },
  normal:  { bg: "var(--color-surface-3)", bd: "var(--color-line)", fg: "var(--color-muted)" },
  firsat:  { bg: "var(--color-surface-3)", bd: "var(--color-line)", fg: "var(--color-faint)" },
};

export function UyumRozeti({ uyum }: { uyum: number }) {
  const iyi = uyum >= 85;
  const orta = uyum >= 70;
  const renk = iyi ? "var(--color-gold)" : orta ? "var(--color-muted)" : "var(--color-faint)";
  return (
    <Tooltip title="Portföyünüzdeki kayıtlı mülklerle bu talebin örtüşme oranı">
      <span
        className="num inline-flex items-center gap-1.5 rounded-md px-2 py-1"
        style={{
          fontSize: 11.5,
          color: renk,
          background: iyi ? "var(--accent-wash)" : "var(--color-surface-3)",
          border: `1px solid ${iyi ? "var(--accent-line)" : "var(--color-line)"}`,
        }}
      >
        <span style={{ fontWeight: 600 }}>%{uyum}</span>
        <span style={{ color: "var(--color-faint)", fontWeight: 400 }}>uyum</span>
      </span>
    </Tooltip>
  );
}

export default function TalepKarti({ talep: t }: { talep: Talep }) {
  const ac = ACILIYET_RENK[t.aciliyet];
  const kalan = kalanGun(t.sonGecerlilik);
  const zorunlu = t.kriterler.filter((k) => k.zorunlu);

  return (
    <Link href={`/talepler/${t.id}`} className="block no-underline">
      <article className="panel lift h-full p-5" style={{ color: "inherit" }}>
        {/* Üst satır */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className="overline"
            style={{ color: "var(--color-gold)", letterSpacing: ".14em" }}
          >
            {KATEGORI_METIN[t.kategori].ad}
          </span>
          <span style={{ color: "var(--color-line-strong)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{t.tur}</span>
          <span
            className="rounded px-2 py-0.5"
            style={{ fontSize: 11, background: ac.bg, border: `1px solid ${ac.bd}`, color: ac.fg }}
          >
            {t.aciliyetMetin}
          </span>
          <span className="num ml-auto" style={{ fontSize: 11, color: "var(--color-faint)" }}>
            {t.id}
          </span>
        </div>

        {/* Başlık */}
        <h3
          className="mb-2"
          style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.35, color: "var(--color-cream)", margin: 0 }}
        >
          {t.baslik}
        </h3>

        <div className="mb-4 flex items-center gap-1.5" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
          <EnvironmentOutlined style={{ fontSize: 11, color: "var(--color-faint)" }} />
          <span className="truncate">{t.konum}</span>
        </div>

        {/* Bütçe */}
        <div
          className="mb-4 flex items-end justify-between gap-3 rounded-xl px-4 py-3"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
        >
          <div>
            <div className="overline mb-1">Bütçe</div>
            <div className="num display" style={{ fontSize: 23, color: "var(--color-gold-soft)" }}>
              {butceAralik(t.butceMin, t.butceMax, t.paraBirimi)}
            </div>
          </div>
          <div className="text-right">
            <div className="overline mb-1">Ödeme</div>
            <div style={{ fontSize: 12.5, color: "var(--color-cream)" }}>{t.odeme}</div>
          </div>
        </div>

        {/* Rozetler */}
        <div className="mb-3.5">
          <RozetListesi kodlar={t.rozetler} kucuk />
        </div>

        {/* Zorunlu kriterler */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {zorunlu.slice(0, 4).map((k) => (
            <span
              key={k.etiket}
              className="rounded-md px-2 py-1"
              style={{ fontSize: 11.5, background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
            >
              <span style={{ color: "var(--color-faint)" }}>{k.etiket}:</span>{" "}
              <span style={{ color: "var(--color-cream)" }}>{k.deger}</span>
            </span>
          ))}
          {zorunlu.length > 4 && (
            <span className="rounded-md px-2 py-1" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
              +{zorunlu.length - 4} kriter
            </span>
          )}
        </div>

        {/* Alt bar */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-3.5"
          style={{ borderTop: "1px solid var(--color-line)", fontSize: 11.5, color: "var(--color-faint)" }}
        >
          <Tooltip title={`${t.izleyen} satıcı bu talebi izliyor`}>
            <span className="num inline-flex items-center gap-1.5">
              <TeamOutlined /> {t.izleyen}
            </span>
          </Tooltip>
          <span className="num inline-flex items-center gap-1.5">
            <EyeOutlined /> {t.goruntuleme}
          </span>
          <Tooltip title={`Talep ${kalan} gün sonra otomatik kapanır`}>
            <span className="num inline-flex items-center gap-1.5">
              <FieldTimeOutlined /> {kalan} gün
            </span>
          </Tooltip>
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--color-faint)" }}>{gecenSure(t.yayin)}</span>
            <UyumRozeti uyum={t.uyum} />
          </span>
        </div>
      </article>
    </Link>
  );
}
