# arayanindan

Ters pazaryeri prototipi: **alıcı ne aradığını ilan eder, portföy sahipleri ona teklif verir.**
Klasik ilan sitelerinin (sahibinden vb.) vitrin modelinin tersi.

> Bu bir **frontend prototipidir**. Veritabanı, API ve kimlik doğrulama yoktur —
> tüm veriler `src/lib/data.ts` içindeki mock verilerdir.

## Çalıştırma

```bash
nvm use            # .nvmrc -> 24.13.0
npm install
npm run dev        # http://localhost:8888
```

## Yayın (GitHub Pages)

Site statik olarak export edilip GitHub Pages'te yayınlanır:
**https://samisen.github.io/ortak-site/**

`main` dalına her push'ta `.github/workflows/pages.yml` çalışır, `npx next build`
ile `out/` üretir ve Pages'e yükler.

Depo ayarlarında **Settings → Pages → Build and deployment → Source** değeri
**GitHub Actions** olmalıdır ("Deploy from a branch" değil).

Yerelde Pages çıktısını denemek için:

```bash
GITHUB_PAGES=true npx next build     # out/ uretir, basePath=/ortak-site
mkdir -p /tmp/p && ln -sfn "$PWD/out" /tmp/p/ortak-site
cd /tmp/p && python3 -m http.server 8899
# http://localhost:8899/ortak-site/
```

Notlar:
- `basePath` yalnızca `GITHUB_PAGES=true` iken açılır; `npm run dev` kökte çalışmaya devam eder.
- `public/.nojekyll` şarttır — Jekyll `_next/` gibi alt çizgiyle başlayan dizinleri yok sayar.
- Tüm rotalar statiktir; `/talepler/[id]` sayfaları `generateStaticParams` ile önceden üretilir.

## Teknoloji

| Katman | Seçim | Neden |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SEO — organik trafik bu üründe hayati |
| Dil | TypeScript | |
| UI kütüphanesi | Ant Design 6 | Hazır form/tablo/modal seti, hızlı prototipleme |
| Stil | Tailwind v4 (preflight kapalı) + özel CSS değişkenleri | antd ile çakışmaması için preflight devre dışı |
| Font | Inter + Instrument Serif (`next/font`, latin-ext) | Türkçe karakter desteği |

## Ekranlar

| Yol | Taraf | İçerik |
|---|---|---|
| `/` | Her ikisi | Değer önerisi, model karşılaştırması, canlı talep vitrini |
| `/talep/yeni` | Alıcı | 6 adımlı talep sihirbazı + canlı önizleme kartı |
| `/gelen-kutusu` | Alıcı | Gelen teklifler, kilitli görseller, iletişim açma |
| `/talepler` | Satıcı | Filtrelenebilir talep akışı, kayıtlı arama |
| `/talepler/[id]` | Satıcı | Talep detayı, alıcı doğrulaması, teklif verme + jeton akışı |
| `/panel` | Satıcı | Jeton bakiyesi, teklif geçmişi, dönüşüm hunisi, paketler |

Header'daki **Alıcı / Satıcı** anahtarı iki deneyim arasında geçiş yapar.

## İş modeli (prototipte gösterilen hali)

- Satıcı, bir talebe teklif göndermek için **jeton** harcar (talep başına 3–10 jeton).
- Jeton başı ≈ **₺500**; hacimle ₺390'a iner.
- Alıcı **48 saat** içinde teklifi görüntülemezse jeton **otomatik iade** edilir.
  Klasik ilan sitelerinin çözemediği "ölü lead" problemine karşı asıl farklılaştırıcı budur.
- Aylık sabit ilan ücreti yoktur. Platform kapanıştan komisyon almaz.

## Mimari notlar

- `src/lib/data.ts` — talepler, teklifler, rozet tanımları (tek mock kaynağı)
- `src/lib/sablonlar.ts` — kategoriye göre kriter şablonları (sihirbaz bunu kullanır)
- `src/lib/demo-store.tsx` — jeton bakiyesi gibi ekranlar arası paylaşılan demo durumu;
  gerçek üründe yerini sunucu oturumu + API alacak
- `src/components/providers.tsx` — antd `ConfigProvider` (koyu tema + altın vurgu) ve tr_TR yerelleştirmesi

## Bilinen sınırlar

- Kalıcılık yok: sayfa yenilenince tüm durum sıfırlanır.
- Arama/filtreleme istemci tarafında, 15 kayıt üzerinde çalışır.
- Görseller temsilidir; "kilitli fotoğraf" alanları CSS ile üretilmiştir.
- Portföy tanımlama ve eşleşme skoru hesaplama akışı yoktur (skorlar mock).
