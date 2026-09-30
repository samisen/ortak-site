export type EvTuru = "Taş ev" | "Villa" | "Müstakil ev" | "Daire" | "Arsa";
export type Bolge = "Alaçatı" | "Çeşme" | "Urla";

/** Alıcının aradığı özellikler. Tanımsız alan = alıcı bu konuda bir şey istemedi. */
export interface Kriterler {
  turler: EvTuru[];
  semtler: string[];
  minOda?: number;
  minAlan?: number;
  minArsa?: number;
  maxDeniz?: number;
  havuz?: boolean;
  bahce?: boolean;
  yilBoyu?: boolean;
}

export type KriterAnahtari = "tur" | "semt" | "oda" | "alan" | "arsa" | "deniz" | "havuz" | "bahce" | "yilBoyu";

/** Talebi kim açtı: alıcının kendisi mi, onu temsil eden emlakçı mı */
export type Acan = "alici" | "emlakci";

/** Bütçe nasıl doğrulandı */
export type Dogrulama = "banka" | "kefil";

export interface Talep {
  id: string;
  acan: Acan;
  /** Talebi açanın kendi cümlesi */
  cumle: string;
  kriterler: Kriterler;
  /** Alıcının taviz verebileceğini belirttiği kriterler — bunlar Flex-Match'e girmez */
  esnek: KriterAnahtari[];
  butceMin: number;
  butceMax: number;
  pesin: boolean;
  dogrulama: Dogrulama;
  yayin: string;
  bitis: string;
  /** Başka emlakçıların doldurduğu koltuk sayısı (0-3) */
  koltukDolu: number;
}

export interface Portfoy {
  id: string;
  baslik: string;
  tur: EvTuru;
  semt: string;
  oda: number;
  alan: number;
  arsa?: number;
  /** Denize mesafe, metre */
  deniz: number;
  havuz: boolean;
  bahce: boolean;
  yilBoyu: boolean;
  fiyat: number;
  fotoAdet: number;
}

export interface Emlakci {
  kod: string;
  ad: string;
  kurum: string;
  /** Tekliflerinin alıcılar tarafından kabul edilme oranı, % */
  kabulOrani: number;
  kurucu: boolean;
  telefon: string;
}

export interface Teklif {
  id: string;
  talepId: string;
  portfoy: Portfoy;
  emlakci: Emlakci;
  not: string;
  tarih: string;
}

/** Bir kriterde istenenle sunulan arasındaki fark */
export interface Fark {
  anahtar: KriterAnahtari | "fiyat";
  etiket: string;
  istenen: string;
  sunulan: string;
}
