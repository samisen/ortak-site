import type { EvTuru, KriterAnahtari, Kriterler } from "./types";
import { BOLGELER, SEMTLER } from "./bolgeler";

/**
 * Alıcının kendi cümlesinden yapılandırılmış talep çıkarır.
 *
 * PROTOTİP: kural tabanlı ve temsilidir. Gerçek üründe bu iş bir LLM'e
 * verilecek; arayüz aynı kalır — alıcı yalnızca çıkan özeti onaylar.
 */

export interface TaslakTalep {
  cumle: string;
  kriterler: Kriterler;
  esnek: KriterAnahtari[];
  butceMin?: number;
  butceMax?: number;
  pesin: boolean;
}

export const ORNEK_CUMLELER = [
  "Mamurbaba ya da Ovacık'ta kışın da oturabileceğim, bahçeli, en az 4 odalı bir taş ev. Bütçem 50-60 milyon, peşin.",
  "Dalyan'da denize en fazla 200 metre, havuzlu, 5 odalı villa. 70 milyon civarı.",
  "Urla'da bağ evi havasında, 2.000 m² arsalı, havuzlu müstakil ev. 30-36 milyon.",
];

const TUR_KELIMELERI: [RegExp, EvTuru][] = [
  [/taş\s*ev/, "Taş ev"],
  [/villa/, "Villa"],
  [/müstakil|bağ\s*evi/, "Müstakil ev"],
  [/daire|rezidans/, "Daire"],
  [/arsa(?!l)|arazi/, "Arsa"],
];

const sayi = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

export function ayristir(cumle: string): TaslakTalep {
  const m = cumle.toLocaleLowerCase("tr");
  const kriterler: Kriterler = { turler: [], semtler: [] };

  // --- Konum: önce semt adları, sonra (hiç semt yoksa) bölge adları ---
  let kalan = m;
  for (const b of BOLGELER) {
    for (const s of SEMTLER[b]) {
      const ad = s.toLocaleLowerCase("tr").replace(" merkez", "");
      if (s.endsWith("merkez")) continue;
      if (kalan.includes(ad)) {
        kriterler.semtler.push(s);
        kalan = kalan.replaceAll(ad, " ");
      }
    }
  }
  for (const b of BOLGELER) {
    const ad = b.toLocaleLowerCase("tr");
    const bolgedenSemtVar = kriterler.semtler.some((s) => SEMTLER[b].includes(s));
    if (!bolgedenSemtVar && kalan.includes(ad)) kriterler.semtler.push(...SEMTLER[b]);
  }

  // --- Tür ---
  for (const [re, tur] of TUR_KELIMELERI) if (re.test(m) && !kriterler.turler.includes(tur)) kriterler.turler.push(tur);

  // --- Oda ---
  const oda = m.match(/(\d)\s*\+\s*\d/) ?? m.match(/(\d+)\s*oda/);
  if (oda) kriterler.minOda = Number(oda[1]);

  // --- Alan ve arsa ---
  for (const e of m.matchAll(/(\d[\d.]*)\s*(?:m2|m²|metrekare|metre kare)/g)) {
    const bas = e.index ?? 0;
    const cevre = m.slice(Math.max(0, bas - 14), bas + e[0].length + 12);
    if (/arsa|bahçe/.test(cevre)) kriterler.minArsa = sayi(e[1]);
    else kriterler.minAlan = sayi(e[1]);
  }

  // --- Denize mesafe ---
  if (/denize\s*sıfır/.test(m)) kriterler.maxDeniz = 50;
  else {
    const d = m.match(/denize\s*(?:en\s*fazla\s*)?(\d[\d.]*)\s*(?:m\b|metre)/);
    if (d) kriterler.maxDeniz = sayi(d[1]);
    else if (/denize\s*yakın/.test(m)) kriterler.maxDeniz = 500;
  }

  // --- Evet/hayır özellikler ---
  if (/havuz/.test(m)) kriterler.havuz = true;
  if (/bahçe/.test(m)) kriterler.bahce = true;
  if (/kış|yıl\s*boyu|dört\s*mevsim|12\s*ay/.test(m)) kriterler.yilBoyu = true;

  // --- Bütçe ---
  let butceMin: number | undefined, butceMax: number | undefined;
  const aralik = m.match(/(\d+(?:[.,]\d+)?)\s*(?:-|–|ile|ila)\s*(\d+(?:[.,]\d+)?)\s*(?:milyon|mn)/);
  const tek = m.match(/(\d+(?:[.,]\d+)?)\s*(?:milyon|mn)/);
  if (aralik) {
    butceMin = sayi(aralik[1]) * 1_000_000;
    butceMax = sayi(aralik[2]) * 1_000_000;
  } else if (tek) {
    butceMax = sayi(tek[1]) * 1_000_000;
    butceMin = Math.round((butceMax * 0.85) / 1_000_000) * 1_000_000;
  }

  return { cumle: cumle.trim(), kriterler, esnek: [], butceMin, butceMax, pesin: /peşin/.test(m) };
}

/** Onay ekranında sorulması gereken eksikler */
export function eksikler(t: TaslakTalep): string[] {
  const e: string[] = [];
  if (!t.kriterler.semtler.length) e.push("konum");
  if (!t.kriterler.turler.length) e.push("tür");
  if (!t.butceMax) e.push("bütçe");
  return e;
}
