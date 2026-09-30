/** Prototipin "bugün"ü — tüm süre hesapları buna göre yapılır */
export const BUGUN = new Date("2026-09-30T12:00:00+03:00");

/** 85000000 -> "85 Mn" · 49500000 -> "49,5 Mn" */
export function kisaSayi(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1).replace(".", ",")} Mn`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)} B`;
  return String(n);
}

export const tl = (n: number) => `₺${n.toLocaleString("tr-TR")}`;
export const tlKisa = (n: number) => `₺${kisaSayi(n)}`;
export const metre = (n: number) => `${n.toLocaleString("tr-TR")} m`;

/** "₺50 – 60 Mn" */
export function butceAralik(min: number, max: number): string {
  const a = kisaSayi(min), b = kisaSayi(max);
  const birim = a.split(" ")[1];
  if (birim && b.endsWith(birim)) return `₺${a.split(" ")[0]} – ${b}`;
  return `₺${a} – ₺${b}`;
}

const GUN = 86_400_000;

export function kalanGun(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - BUGUN.getTime()) / GUN));
}

export function gecenSaat(iso: string): number {
  return Math.max(0, Math.floor((BUGUN.getTime() - new Date(iso).getTime()) / 3_600_000));
}

export function gecenSure(iso: string): string {
  const saat = gecenSaat(iso);
  if (saat < 1) return "az önce";
  if (saat < 24) return `${saat} sa önce`;
  const gun = Math.floor(saat / 24);
  if (gun === 1) return "dün";
  if (gun < 7) return `${gun} gün önce`;
  return `${Math.floor(gun / 7)} hafta önce`;
}
