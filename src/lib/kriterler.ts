import type { KriterAnahtari, Kriterler } from "./types";
import { BOLGELER, SEMTLER } from "./bolgeler";
import { metre } from "./format";

export interface KriterEtiketi {
  anahtar: KriterAnahtari;
  etiket: string;
}

/** Semt listesini okunur hale getirir: bir bölgenin tamamı seçildiyse bölge adını yazar */
export function konumMetni(semtler: string[]): string {
  const parcalar: string[] = [];
  const kalan = new Set(semtler);
  for (const b of BOLGELER) {
    if (SEMTLER[b].every((s) => kalan.has(s))) {
      parcalar.push(`${b} (tümü)`);
      SEMTLER[b].forEach((s) => kalan.delete(s));
    }
  }
  return [...parcalar, ...kalan].join(", ");
}

/** Tanımlı kriterleri sırayla, kısa etiketlerle döner */
export function kriterEtiketleri(k: Kriterler): KriterEtiketi[] {
  const e: KriterEtiketi[] = [];
  if (k.semtler.length) e.push({ anahtar: "semt", etiket: konumMetni(k.semtler) });
  if (k.turler.length) e.push({ anahtar: "tur", etiket: k.turler.join(" / ") });
  if (k.minOda !== undefined) e.push({ anahtar: "oda", etiket: `en az ${k.minOda} oda` });
  if (k.minAlan !== undefined) e.push({ anahtar: "alan", etiket: `${k.minAlan} m²+ kapalı alan` });
  if (k.minArsa !== undefined) e.push({ anahtar: "arsa", etiket: `${k.minArsa.toLocaleString("tr-TR")} m²+ arsa` });
  if (k.maxDeniz !== undefined) e.push({ anahtar: "deniz", etiket: k.maxDeniz <= 50 ? "denize sıfır" : `denize en fazla ${metre(k.maxDeniz)}` });
  if (k.havuz) e.push({ anahtar: "havuz", etiket: "havuz" });
  if (k.bahce) e.push({ anahtar: "bahce", etiket: "bahçe" });
  if (k.yilBoyu) e.push({ anahtar: "yilBoyu", etiket: "kışın oturulabilir" });
  return e;
}

/** Bir kriteri kaldırılmış yeni Kriterler */
export function kriterKaldir(k: Kriterler, a: KriterAnahtari): Kriterler {
  const y = { ...k };
  if (a === "semt") y.semtler = [];
  if (a === "tur") y.turler = [];
  if (a === "oda") delete y.minOda;
  if (a === "alan") delete y.minAlan;
  if (a === "arsa") delete y.minArsa;
  if (a === "deniz") delete y.maxDeniz;
  if (a === "havuz") delete y.havuz;
  if (a === "bahce") delete y.bahce;
  if (a === "yilBoyu") delete y.yilBoyu;
  return y;
}
