import type { Bolge } from "./types";

/** Pilot bölgesi: Çeşme yarımadası ve Urla */
export const SEMTLER: Record<Bolge, string[]> = {
  Alaçatı: ["Alaçatı merkez", "Hacımemiş", "Port Alaçatı"],
  Çeşme: ["Mamurbaba", "Ovacık", "Germiyan", "Ilıca", "Dalyan", "Boyalık", "Çiftlikköy"],
  Urla: ["Urla merkez", "İskele", "Zeytinalanı", "Kuşçular", "Barbaros", "Çeşmealtı"],
};

export const BOLGELER = Object.keys(SEMTLER) as Bolge[];
export const TUM_SEMTLER = BOLGELER.flatMap((b) => SEMTLER[b]);

export function semtBolgesi(semt: string): Bolge | undefined {
  return BOLGELER.find((b) => SEMTLER[b].includes(semt));
}

/** Bir talebin semtlerinden bölgesini çıkarır; birden fazlaysa ilki */
export function talepBolgesi(semtler: string[]): Bolge | undefined {
  for (const s of semtler) {
    const b = semtBolgesi(s);
    if (b) return b;
  }
  return undefined;
}
