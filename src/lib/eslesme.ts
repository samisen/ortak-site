import type { Fark, KriterAnahtari, Portfoy, Talep } from "./types";
import { metre, tlKisa } from "./format";

/** Talep başına en fazla kaç emlakçı teklif verebilir */
export const KOLTUK = 3;

/** Bütçenin bu orana kadar üstündeki bir fiyat "esnek teklif" olarak gönderilebilir */
export const FIYAT_ESNEKLIGI = 0.12;

/** Esnek teklifte izin verilen en fazla zorunlu kriter farkı */
export const ESNEK_FARK_SINIRI = 1;

/** Bağlantı ücreti: talep bütçesinin ortasının binde yarımı, bine yuvarlanmış */
export const UCRET_ORANI = 0.0005;

/** Erken erişim: talep ilk 24 saat yalnızca bu kabul oranının üstündeki emlakçılara açılır */
export const ERKEN_ERISIM_SAAT = 24;
export const ERKEN_ERISIM_ORANI = 70;

export function baglantiUcreti(t: Pick<Talep, "butceMin" | "butceMax">): number {
  return Math.round((((t.butceMin + t.butceMax) / 2) * UCRET_ORANI) / 1000) * 1000;
}

export type EslesmeDurumu = "tam" | "esnek" | "uygun-degil";

export interface Karsilastirma {
  durum: EslesmeDurumu;
  /** Zorunlu kriterlerde tutmayanlar — esnek teklifte alıcıya baştan gösterilir */
  farklar: Fark[];
  /** Alıcının esnek dediği kriterlerde tutmayanlar — teklifi engellemez */
  esnekFarklar: Fark[];
  /** Tutan kriterlerin oranı, % */
  uyum: number;
}

interface Kontrol {
  anahtar: KriterAnahtari | "fiyat";
  etiket: string;
  tutuyor: boolean;
  istenen: string;
  sunulan: string;
}

const varYok = (b: boolean) => (b ? "var" : "yok");

export function karsilastir(t: Talep, p: Portfoy): Karsilastirma {
  const k = t.kriterler;
  const kontroller: Kontrol[] = [];

  if (k.semtler.length)
    kontroller.push({ anahtar: "semt", etiket: "Konum", tutuyor: k.semtler.includes(p.semt), istenen: k.semtler.join(", "), sunulan: p.semt });
  if (k.turler.length)
    kontroller.push({ anahtar: "tur", etiket: "Tür", tutuyor: k.turler.includes(p.tur), istenen: k.turler.join(" / "), sunulan: p.tur });
  if (k.minOda !== undefined)
    kontroller.push({ anahtar: "oda", etiket: "Oda", tutuyor: p.oda >= k.minOda, istenen: `en az ${k.minOda}`, sunulan: `${p.oda}` });
  if (k.minAlan !== undefined)
    kontroller.push({ anahtar: "alan", etiket: "Kapalı alan", tutuyor: p.alan >= k.minAlan, istenen: `en az ${k.minAlan} m²`, sunulan: `${p.alan} m²` });
  if (k.minArsa !== undefined)
    kontroller.push({ anahtar: "arsa", etiket: "Arsa", tutuyor: (p.arsa ?? 0) >= k.minArsa, istenen: `en az ${k.minArsa.toLocaleString("tr-TR")} m²`, sunulan: p.arsa ? `${p.arsa.toLocaleString("tr-TR")} m²` : "yok" });
  if (k.maxDeniz !== undefined)
    kontroller.push({ anahtar: "deniz", etiket: "Denize mesafe", tutuyor: p.deniz <= k.maxDeniz, istenen: `en fazla ${metre(k.maxDeniz)}`, sunulan: metre(p.deniz) });
  if (k.havuz)
    kontroller.push({ anahtar: "havuz", etiket: "Havuz", tutuyor: p.havuz, istenen: "var", sunulan: varYok(p.havuz) });
  if (k.bahce)
    kontroller.push({ anahtar: "bahce", etiket: "Bahçe", tutuyor: p.bahce, istenen: "var", sunulan: varYok(p.bahce) });
  if (k.yilBoyu)
    kontroller.push({ anahtar: "yilBoyu", etiket: "Kışın oturulabilir", tutuyor: p.yilBoyu, istenen: "evet", sunulan: p.yilBoyu ? "evet" : "hayır" });

  const fiyatTutuyor = p.fiyat <= t.butceMax;
  const fiyatAsiri = p.fiyat > t.butceMax * (1 + FIYAT_ESNEKLIGI);
  kontroller.push({
    anahtar: "fiyat",
    etiket: "Fiyat",
    tutuyor: fiyatTutuyor,
    istenen: `en fazla ${tlKisa(t.butceMax)}`,
    sunulan: `${tlKisa(p.fiyat)} (%${Math.round((p.fiyat / t.butceMax - 1) * 100)} üstünde)`,
  });

  const tutmayanlar = kontroller.filter((c) => !c.tutuyor);
  const farkaCevir = (c: Kontrol): Fark => ({ anahtar: c.anahtar, etiket: c.etiket, istenen: c.istenen, sunulan: c.sunulan });

  const esnekMi = (c: Kontrol) => c.anahtar !== "fiyat" && t.esnek.includes(c.anahtar);
  const farklar = tutmayanlar.filter((c) => !esnekMi(c)).map(farkaCevir);
  const esnekFarklar = tutmayanlar.filter(esnekMi).map(farkaCevir);

  const uyum = Math.round(((kontroller.length - tutmayanlar.length) / kontroller.length) * 100);

  let durum: EslesmeDurumu;
  if (fiyatAsiri || farklar.length > ESNEK_FARK_SINIRI) durum = "uygun-degil";
  else if (farklar.length === 0) durum = "tam";
  else durum = "esnek";

  return { durum, farklar, esnekFarklar, uyum };
}

/** Bir talep için portföydeki tam ve esnek eşleşme sayıları */
export function portfoyUyumu(t: Talep, portfoy: Portfoy[]) {
  let tam = 0, esnek = 0;
  for (const p of portfoy) {
    const d = karsilastir(t, p).durum;
    if (d === "tam") tam++;
    else if (d === "esnek") esnek++;
  }
  return { tam, esnek };
}
