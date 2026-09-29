import type { Kategori } from "./types";

export interface KriterSablonu {
  etiket: string;
  secenekler: string[];
  varsayilanZorunlu: boolean;
}

export const TUR_SECENEKLERI: Record<Kategori, string[]> = {
  emlak: ["Villa", "Müstakil Ev", "Rezidans Dairesi", "Yalı Dairesi", "Taş Ev / Butik Yatırım", "Arazi", "Ofis Katı", "Butik Otel"],
  vasita: ["Otomobil", "SUV", "Süper Spor", "Klasik Otomobil", "Ticari Araç"],
  deniz: ["Motoryat", "Yelkenli", "Sürat Teknesi", "Gulet"],
};

export const KRITERLER: Record<Kategori, KriterSablonu[]> = {
  emlak: [
    { etiket: "Kapalı alan", secenekler: ["150 m² ve üzeri", "250 m² ve üzeri", "400 m² ve üzeri", "600 m² ve üzeri"], varsayilanZorunlu: true },
    { etiket: "Arsa", secenekler: ["500 m² ve üzeri", "1.000 m² ve üzeri", "2.000 m² ve üzeri"], varsayilanZorunlu: false },
    { etiket: "Oda", secenekler: ["3+1", "4+1", "5+1 ve üzeri", "5+2"], varsayilanZorunlu: true },
    { etiket: "Tapu", secenekler: ["Kat mülkiyetli, iskanlı", "Kat irtifaklı", "Müstakil tapulu"], varsayilanZorunlu: true },
    { etiket: "Havuz", secenekler: ["Özel havuz şart", "Ortak havuz yeterli", "Aranmıyor"], varsayilanZorunlu: false },
    { etiket: "Denize mesafe", secenekler: ["Denize sıfır", "Maksimum 300 m", "Maksimum 1 km", "Önemli değil"], varsayilanZorunlu: false },
    { etiket: "Yapım yılı", secenekler: ["2020 sonrası", "2015 sonrası", "2010 sonrası", "Önemli değil"], varsayilanZorunlu: false },
    { etiket: "Otopark", secenekler: ["Kapalı, 1 araç", "Kapalı, 2 araç ve üzeri", "Açık yeterli"], varsayilanZorunlu: false },
  ],
  vasita: [
    { etiket: "Model yılı", secenekler: ["2024 ve üzeri", "2023 ve üzeri", "2021 ve üzeri", "2018 ve üzeri"], varsayilanZorunlu: true },
    { etiket: "Kilometre", secenekler: ["Maksimum 10.000 km", "Maksimum 25.000 km", "Maksimum 50.000 km", "Maksimum 100.000 km"], varsayilanZorunlu: true },
    { etiket: "Hasar kaydı", secenekler: ["Kayıtsız, boyasız", "Ağır hasar kaydı olmayacak", "Önemli değil"], varsayilanZorunlu: true },
    { etiket: "Menşei", secenekler: ["Türkiye çıkışlı", "Yurt dışı çıkışlı olabilir", "İlk el tercih"], varsayilanZorunlu: false },
    { etiket: "Servis geçmişi", secenekler: ["Yetkili servis bakımlı", "Özel servis kabul", "Önemli değil"], varsayilanZorunlu: false },
    { etiket: "Şanzıman", secenekler: ["Otomatik", "Manuel", "Fark etmez"], varsayilanZorunlu: false },
    { etiket: "Renk", secenekler: ["Klasik renkler", "Mat renk düşünmüyorum", "Fark etmez"], varsayilanZorunlu: false },
  ],
  deniz: [
    { etiket: "Boy", secenekler: ["12–18 m", "18–24 m", "24–30 m", "30 m üzeri"], varsayilanZorunlu: true },
    { etiket: "Yapım yılı", secenekler: ["2020 ve üzeri", "2016 ve üzeri", "2010 ve üzeri"], varsayilanZorunlu: true },
    { etiket: "Kabin", secenekler: ["En az 3 misafir kabini", "En az 4 misafir kabini", "En az 6 misafir kabini"], varsayilanZorunlu: true },
    { etiket: "Bayrak", secenekler: ["TR bayraklı", "TR veya AB bayraklı", "Fark etmez"], varsayilanZorunlu: false },
    { etiket: "Motor saati", secenekler: ["1.000 saat altı", "3.000 saat altı", "Önemli değil"], varsayilanZorunlu: false },
    { etiket: "Charter geçmişi", secenekler: ["Belgeli charter geçmişi", "Charter yapılmamış", "Fark etmez"], varsayilanZorunlu: false },
  ],
};

export const SEHIR_SECENEKLERI = [
  "İstanbul", "Muğla", "İzmir", "Antalya", "Ankara", "Aydın", "Bursa", "Balıkesir", "Tekirdağ",
];

export const ODEME_SECENEKLERI = [
  "Tamamı peşin",
  "Peşin + banka kredisi",
  "Mevcut varlık satışı + peşin",
  "Takas + peşin",
  "Peşin + kısmi vadeli",
];
