export type Kategori = "emlak" | "vasita" | "deniz";

export type RozetKod =
  | "kimlik"      // Kimlik doğrulandı
  | "butce"       // Bütçe belgelendi
  | "gecmis"      // Geçmiş işlem
  | "hizli"       // Hızlı dönüş
  | "kurumsal"    // Kurumsal üye
  | "pesin";      // Peşin alıcı

export type Aciliyet = "acil" | "normal" | "firsat";
export type ParaBirimi = "TRY" | "USD" | "EUR";

export interface Kriter {
  etiket: string;
  deger: string;
  zorunlu: boolean;
}

export interface Talep {
  id: string;
  kategori: Kategori;
  tur: string;
  baslik: string;
  sehir: string;
  konum: string;
  butceMin: number;
  butceMax: number;
  paraBirimi: ParaBirimi;
  odeme: string;
  kriterler: Kriter[];
  not: string;
  rozetler: RozetKod[];
  aciliyet: Aciliyet;
  aciliyetMetin: string;
  yayin: string;
  sonGecerlilik: string;
  goruntuleme: number;
  teklifSayisi: number;
  izleyen: number;
  tokenMaliyeti: number;
  aliciKod: string;
  uyum: number;
}

export interface Teklif {
  id: string;
  talepId: string;
  saticiKod: string;
  saticiTip: "kurumsal" | "bireysel";
  saticiRozetler: string[];
  saticiIsim?: string;
  saticiTelefon?: string;
  baslik: string;
  fiyat: number;
  paraBirimi: ParaBirimi;
  konum: string;
  ozellikler: string[];
  mesaj: string;
  fotoAdet: number;
  uyum: number;
  tarih: string;
  durum: "yeni" | "incelendi" | "acildi" | "reddedildi";
}
