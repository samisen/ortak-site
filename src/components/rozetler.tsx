"use client";

import { Tooltip } from "antd";
import {
  SafetyCertificateFilled,
  BankFilled,
  HistoryOutlined,
  ThunderboltFilled,
  ShopFilled,
  WalletFilled,
} from "@ant-design/icons";
import { ROZET_METIN } from "@/lib/data";
import type { RozetKod } from "@/lib/types";

const IKON: Record<RozetKod, React.ReactNode> = {
  kimlik: <SafetyCertificateFilled />,
  butce: <BankFilled />,
  gecmis: <HistoryOutlined />,
  hizli: <ThunderboltFilled />,
  kurumsal: <ShopFilled />,
  pesin: <WalletFilled />,
};

/** Bütçe ve kimlik rozetleri altın, diğerleri nötr — güven sinyali hiyerarşisi */
const VURGULU: RozetKod[] = ["butce", "kimlik"];

export function Rozet({ kod, kucuk = false }: { kod: RozetKod; kucuk?: boolean }) {
  const r = ROZET_METIN[kod];
  const vurgu = VURGULU.includes(kod);
  return (
    <Tooltip title={r.aciklama}>
      <span
        className="inline-flex items-center gap-1.5 rounded-md whitespace-nowrap"
        style={{
          fontSize: kucuk ? 11 : 12,
          padding: kucuk ? "2px 7px" : "3px 9px",
          color: vurgu ? "var(--color-gold-soft)" : "var(--color-muted)",
          background: vurgu ? "rgba(200,163,74,.09)" : "var(--color-surface-3)",
          border: `1px solid ${vurgu ? "rgba(200,163,74,.24)" : "var(--color-line)"}`,
        }}
      >
        <span style={{ fontSize: kucuk ? 10 : 11, opacity: 0.9 }}>{IKON[kod]}</span>
        {r.kisa}
      </span>
    </Tooltip>
  );
}

export function RozetListesi({ kodlar, kucuk }: { kodlar: RozetKod[]; kucuk?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {kodlar.map((k) => (
        <Rozet key={k} kod={k} kucuk={kucuk} />
      ))}
    </div>
  );
}
