import type { ParaBirimi } from "./types";

export const SEMBOL: Record<ParaBirimi, string> = { TRY: "₺", USD: "$", EUR: "€" };

/** 85000000 -> "85 Mn"  |  260000 -> "260 B" */
export function kisaSayi(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1).replace(".", ",")} Mn`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v : v.toFixed(0)} B`;
  }
  return String(n);
}

export function para(n: number, pb: ParaBirimi): string {
  return `${SEMBOL[pb]}${n.toLocaleString("tr-TR")}`;
}

export function paraKisa(n: number, pb: ParaBirimi): string {
  return `${SEMBOL[pb]}${kisaSayi(n)}`;
}

/** "₺85 – 120 Mn" — aynı birimdeyse tekrar etmez */
export function butceAralik(min: number, max: number, pb: ParaBirimi): string {
  const bMin = kisaSayi(min);
  const bMax = kisaSayi(max);
  const birim = bMin.split(" ")[1];
  if (birim && bMax.endsWith(birim)) {
    return `${SEMBOL[pb]}${bMin.split(" ")[0]} – ${bMax}`;
  }
  return `${SEMBOL[pb]}${bMin} – ${SEMBOL[pb]}${bMax}`;
}

const BUGUN = new Date("2026-09-29T12:00:00");

export function gecenSure(iso: string): string {
  const fark = Math.floor((BUGUN.getTime() - new Date(iso).getTime()) / 86400000);
  if (fark <= 0) return "bugün";
  if (fark === 1) return "dün";
  if (fark < 7) return `${fark} gün önce`;
  if (fark < 30) return `${Math.floor(fark / 7)} hafta önce`;
  return `${Math.floor(fark / 30)} ay önce`;
}

export function kalanGun(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - BUGUN.getTime()) / 86400000));
}

export function tarihTR(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
