import type { Emlakci, Portfoy, Talep, Teklif } from "./types";

/* ============================================================
   DEMO KULLANICILARI
   ============================================================ */

/** Alıcı tarafında oturum açmış demo kullanıcı */
export const DEMO_ALICI = {
  kod: "Alıcı #0042",
  talepId: "T-0418",
};

/** Emlakçı tarafında oturum açmış demo kullanıcı */
export const DEMO_EMLAKCI: Emlakci & { yetkiBelgesi: string } = {
  kod: "Emlakçı #03",
  ad: "Cem Yıldırım",
  kurum: "Ege Kıyı Gayrimenkul",
  kabulOrani: 81,
  kurucu: true,
  telefon: "+90 532 ••• •• 08",
  yetkiBelgesi: "3500•••",
};

/** Demo emlakçının müşterileri adına açtığı talepler */
export const MUSTERI_TALEPLERIM = ["T-0452"];

/* ============================================================
   TALEPLER — Çeşme, Alaçatı, Urla
   ============================================================ */

export const TALEPLER: Talep[] = [
  {
    id: "T-0431",
    acan: "alici",
    cumle: "Germiyan, Ovacık ya da Mamurbaba'da taş ev arıyorum. En az 5 oda, 1.000 m² üzeri arsa, havuzlu olursa iyi olur. 55-65 milyon.",
    kriterler: { turler: ["Taş ev"], semtler: ["Germiyan", "Ovacık", "Mamurbaba"], minOda: 5, minArsa: 1000, havuz: true },
    esnek: ["havuz"],
    butceMin: 55_000_000, butceMax: 65_000_000, pesin: false,
    dogrulama: "banka",
    yayin: "2026-09-30T02:00:00+03:00", bitis: "2026-12-30T00:00:00+03:00",
    koltukDolu: 1,
  },
  {
    id: "T-0427",
    acan: "emlakci",
    cumle: "Müşterim Dalyan ya da Boyalık'ta denize en fazla 200 metre, havuzlu, 5 odalı bir villa arıyor. 65-75 milyon, peşin.",
    kriterler: { turler: ["Villa"], semtler: ["Dalyan", "Boyalık"], minOda: 5, maxDeniz: 200, havuz: true },
    esnek: [],
    butceMin: 65_000_000, butceMax: 75_000_000, pesin: true,
    dogrulama: "kefil",
    yayin: "2026-09-27T15:00:00+03:00", bitis: "2026-11-27T00:00:00+03:00",
    koltukDolu: 1,
  },
  {
    id: "T-0439",
    acan: "alici",
    cumle: "Hacımemiş ya da Alaçatı merkezde, çarşıya yürüme mesafesinde, en az 4 odalı taş ev. Kışın da kalacağız. 40-48 milyon.",
    kriterler: { turler: ["Taş ev"], semtler: ["Hacımemiş", "Alaçatı merkez"], minOda: 4, yilBoyu: true },
    esnek: [],
    butceMin: 40_000_000, butceMax: 48_000_000, pesin: true,
    dogrulama: "banka",
    yayin: "2026-09-29T19:30:00+03:00", bitis: "2026-12-29T00:00:00+03:00",
    koltukDolu: 0,
  },
  {
    id: "T-0444",
    acan: "alici",
    cumle: "Urla'da bağ evi havasında, 2.000 m² üzeri arsalı, havuzlu bir müstakil ev ya da villa. 30-36 milyon.",
    kriterler: { turler: ["Müstakil ev", "Villa"], semtler: ["Zeytinalanı", "Kuşçular", "Barbaros"], minArsa: 2000, havuz: true },
    esnek: [],
    butceMin: 30_000_000, butceMax: 36_000_000, pesin: false,
    dogrulama: "banka",
    yayin: "2026-09-25T11:00:00+03:00", bitis: "2026-12-25T00:00:00+03:00",
    koltukDolu: 1,
  },
  {
    id: "T-0418",
    acan: "alici",
    cumle: "Mamurbaba ya da Ovacık'ta kışın da oturabileceğim, bahçesi büyük, en az 4 odalı bir taş ev. Denize en fazla 500 metre. Bütçem 50-60 milyon, peşin.",
    kriterler: { turler: ["Taş ev"], semtler: ["Mamurbaba", "Ovacık"], minOda: 4, maxDeniz: 500, bahce: true, yilBoyu: true },
    esnek: [],
    butceMin: 50_000_000, butceMax: 60_000_000, pesin: true,
    dogrulama: "banka",
    yayin: "2026-09-18T10:00:00+03:00", bitis: "2026-11-18T00:00:00+03:00",
    koltukDolu: 3,
  },
  {
    id: "T-0421",
    acan: "emlakci",
    cumle: "Müşterim için Ilıca'da denize sıfır, en az 3 odalı bir daire bakıyorum. Site içi olabilir. 20-26 milyon.",
    kriterler: { turler: ["Daire"], semtler: ["Ilıca"], minOda: 3, maxDeniz: 100 },
    esnek: [],
    butceMin: 20_000_000, butceMax: 26_000_000, pesin: true,
    dogrulama: "kefil",
    yayin: "2026-09-20T09:00:00+03:00", bitis: "2026-11-20T00:00:00+03:00",
    koltukDolu: 3,
  },
  {
    id: "T-0412",
    acan: "alici",
    cumle: "Boyalık ya da Ilıca'da havuzlu villa, 4 oda, denize en fazla 600 metre. 45-55 milyon.",
    kriterler: { turler: ["Villa"], semtler: ["Boyalık", "Ilıca"], minOda: 4, maxDeniz: 600, havuz: true },
    esnek: [],
    butceMin: 45_000_000, butceMax: 55_000_000, pesin: false,
    dogrulama: "banka",
    yayin: "2026-09-14T13:00:00+03:00", bitis: "2026-11-14T00:00:00+03:00",
    koltukDolu: 2,
  },
  {
    id: "T-0409",
    acan: "alici",
    cumle: "Çiftlikköy'de rüzgardan korunaklı, 4 odalı, bahçeli bir villa. 28-34 milyon.",
    kriterler: { turler: ["Villa"], semtler: ["Çiftlikköy"], minOda: 4, bahce: true },
    esnek: [],
    butceMin: 28_000_000, butceMax: 34_000_000, pesin: false,
    dogrulama: "banka",
    yayin: "2026-09-11T08:00:00+03:00", bitis: "2026-11-11T00:00:00+03:00",
    koltukDolu: 2,
  },
  {
    id: "T-0436",
    acan: "alici",
    cumle: "Urla İskele'de denize yakın 3+1 bir daire ya da küçük bir müstakil ev. 14-18 milyon.",
    kriterler: { turler: ["Daire", "Müstakil ev"], semtler: ["İskele", "Urla merkez"], minOda: 3, maxDeniz: 500 },
    esnek: [],
    butceMin: 14_000_000, butceMax: 18_000_000, pesin: false,
    dogrulama: "banka",
    yayin: "2026-09-23T17:00:00+03:00", bitis: "2026-12-23T00:00:00+03:00",
    koltukDolu: 0,
  },
  {
    id: "T-0448",
    acan: "emlakci",
    cumle: "Müşterim Çeşmealtı'nda denize sıfır, en az 1.500 m² bir arsa arıyor, kendi evini yaptıracak. 18-24 milyon.",
    kriterler: { turler: ["Arsa"], semtler: ["Çeşmealtı"], minArsa: 1500, maxDeniz: 50 },
    esnek: [],
    butceMin: 18_000_000, butceMax: 24_000_000, pesin: true,
    dogrulama: "kefil",
    yayin: "2026-09-26T10:00:00+03:00", bitis: "2026-12-26T00:00:00+03:00",
    koltukDolu: 1,
  },
  {
    id: "T-0452",
    acan: "emlakci",
    cumle: "Müşterim Port Alaçatı ya da Alaçatı merkezde, havuzlu, en az 3 odalı bir villa arıyor. 35-45 milyon, peşin.",
    kriterler: { turler: ["Villa"], semtler: ["Port Alaçatı", "Alaçatı merkez"], minOda: 3, havuz: true },
    esnek: [],
    butceMin: 35_000_000, butceMax: 45_000_000, pesin: true,
    dogrulama: "kefil",
    yayin: "2026-09-26T16:00:00+03:00", bitis: "2026-12-26T00:00:00+03:00",
    koltukDolu: 2,
  },
];

/* ============================================================
   DEMO EMLAKÇININ PORTFÖYÜ — hiçbir alıcıya gösterilmez,
   yalnızca talep eşleştirmesi için kullanılır
   ============================================================ */

export const PORTFOYUM: Portfoy[] = [
  { id: "P-01", baslik: "Mamurbaba'da havuzlu taş ev", tur: "Taş ev", semt: "Mamurbaba", oda: 5, alan: 320, arsa: 1100, deniz: 1200, havuz: true, bahce: true, yilBoyu: true, fiyat: 58_000_000, fotoAdet: 24 },
  { id: "P-02", baslik: "Hacımemiş'te taş ev", tur: "Taş ev", semt: "Hacımemiş", oda: 4, alan: 240, arsa: 450, deniz: 1800, havuz: false, bahce: true, yilBoyu: true, fiyat: 46_000_000, fotoAdet: 17 },
  { id: "P-03", baslik: "Dalyan'da denize yakın villa", tur: "Villa", semt: "Dalyan", oda: 5, alan: 420, arsa: 900, deniz: 150, havuz: true, bahce: true, yilBoyu: true, fiyat: 72_000_000, fotoAdet: 31 },
  { id: "P-04", baslik: "Zeytinalanı'nda bağ içinde villa", tur: "Villa", semt: "Zeytinalanı", oda: 4, alan: 300, arsa: 2000, deniz: 2500, havuz: true, bahce: true, yilBoyu: true, fiyat: 38_000_000, fotoAdet: 20 },
  { id: "P-05", baslik: "Ilıca'da denize sıfır daire", tur: "Daire", semt: "Ilıca", oda: 3, alan: 180, deniz: 80, havuz: true, bahce: false, yilBoyu: true, fiyat: 24_000_000, fotoAdet: 14 },
];

/* ============================================================
   GELEN TEKLİFLER
   ============================================================ */

const SELIN: Emlakci = { kod: "Emlakçı #12", ad: "Selin Aksoy", kurum: "Ovacık Emlak", kabulOrani: 74, kurucu: true, telefon: "+90 532 ••• •• 14" };
const KAAN: Emlakci = { kod: "Emlakçı #07", ad: "Kaan Demir", kurum: "Çeşme Kapı Gayrimenkul", kabulOrani: 88, kurucu: true, telefon: "+90 533 ••• •• 61" };
const DENIZ: Emlakci = { kod: "Emlakçı #19", ad: "Deniz Kaya", kurum: "Alaçatı Mülk", kabulOrani: 69, kurucu: false, telefon: "+90 535 ••• •• 27" };

export const TEKLIFLER: Teklif[] = [
  // --- T-0418: demo alıcının talebi (3 koltuk dolu) ---
  {
    id: "K-2201", talepId: "T-0418", emlakci: SELIN, tarih: "2026-09-24T10:00:00+03:00",
    portfoy: { id: "X-OV1", baslik: "Ovacık'ta bağ içinde taş ev", tur: "Taş ev", semt: "Ovacık", oda: 4, alan: 280, arsa: 900, deniz: 400, havuz: false, bahce: true, yilBoyu: true, fiyat: 55_000_000, fotoAdet: 18 },
    not: "Sahibi yurt dışında, mülk hiç ilana çıkmadı. Tapu ve iskân tamam, yerden ısıtma var.",
  },
  {
    id: "K-2204", talepId: "T-0418", emlakci: KAAN, tarih: "2026-09-25T15:00:00+03:00",
    portfoy: { id: "X-MB2", baslik: "Mamurbaba'da restore edilmiş taş ev", tur: "Taş ev", semt: "Mamurbaba", oda: 5, alan: 350, arsa: 1300, deniz: 450, havuz: true, bahce: true, yilBoyu: true, fiyat: 59_500_000, fotoAdet: 26 },
    not: "2022'de aslına uygun restore edildi. Havuz ve ayrı bir misafir evi var.",
  },
  {
    id: "K-2209", talepId: "T-0418", emlakci: DENIZ, tarih: "2026-09-27T09:00:00+03:00",
    portfoy: { id: "X-MB3", baslik: "Mamurbaba tepesinde deniz manzaralı taş ev", tur: "Taş ev", semt: "Mamurbaba", oda: 4, alan: 300, arsa: 1100, deniz: 1100, havuz: true, bahce: true, yilBoyu: true, fiyat: 57_000_000, fotoAdet: 21 },
    not: "Denize istediğinizden uzak, ama tepede ve önü hiç kapanmayacak bir deniz manzarası var.",
  },

  // --- T-0452: demo emlakçının müşterisi adına açtığı talep (2 koltuk dolu) ---
  {
    id: "K-2215", talepId: "T-0452", emlakci: KAAN, tarih: "2026-09-27T12:00:00+03:00",
    portfoy: { id: "X-PA1", baslik: "Port Alaçatı'da kanal kenarı villa", tur: "Villa", semt: "Port Alaçatı", oda: 4, alan: 260, arsa: 500, deniz: 20, havuz: true, bahce: true, yilBoyu: false, fiyat: 42_000_000, fotoAdet: 22 },
    not: "Kendi iskelesi var, kanala sıfır. Sahibi bu sezon satmak istiyor.",
  },
  {
    id: "K-2218", talepId: "T-0452", emlakci: SELIN, tarih: "2026-09-28T18:00:00+03:00",
    portfoy: { id: "X-AM2", baslik: "Alaçatı merkezde yeni yapı villa", tur: "Villa", semt: "Alaçatı merkez", oda: 3, alan: 210, arsa: 420, deniz: 1500, havuz: true, bahce: true, yilBoyu: true, fiyat: 48_500_000, fotoAdet: 16 },
    not: "Fiyat bütçenin biraz üstünde; çarşıya 3 dakika ve 2025 yapımı olması bunu karşılıyor.",
  },
];

/** Demo emlakçının daha önce verdiği teklifler — panelde geçmiş olarak görünür */
export const GECMIS_TEKLIFLERIM = [
  { talepId: "T-0405", mulk: "Ilıca'da denize sıfır daire", tip: "tam" as const, durum: "baglandi" as const, ucret: 11_000, tarih: "2026-09-12" },
  { talepId: "T-0398", mulk: "Dalyan'da denize yakın villa", tip: "tam" as const, durum: "baglandi" as const, ucret: 35_000, tarih: "2026-09-08" },
  { talepId: "T-0402", mulk: "Hacımemiş'te taş ev", tip: "esnek" as const, durum: "reddedildi" as const, ucret: 0, tarih: "2026-09-10" },
  { talepId: "T-0390", mulk: "Zeytinalanı'nda bağ içinde villa", tip: "tam" as const, durum: "suresi-doldu" as const, ucret: 0, tarih: "2026-09-02" },
];

export const talepBul = (id: string) => TALEPLER.find((t) => t.id === id);
export const talepTeklifleri = (id: string) => TEKLIFLER.filter((t) => t.talepId === id);
