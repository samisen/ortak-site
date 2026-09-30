# arayanindan

Ters pazaryeri prototipi: **alıcı ne aradığını söyler, portföyünde uyan mülk olan emlakçılar ona teklif getirir.**
Pilot bölge Çeşme, Alaçatı ve Urla; yalnızca emlak.

Talebi alıcının kendisi de açabilir, onu temsil eden emlakçı da. Pilotun motoru ikincisi:
emlakçıların bugün WhatsApp gruplarında yaptığı "müşterim var, elinde olan?" paslaşmasının
doğrulanmış ve gizli hali.

> Bu bir **frontend prototipidir**. Veritabanı, API ve kimlik doğrulama yoktur —
> tüm veriler `src/lib/data.ts` içindeki mock verilerdir.

## Çalıştırma

```bash
nvm use            # .nvmrc -> 24.13.0
npm install
npm run dev        # http://localhost:8888
```

## Tema (açık / koyu)

Site hem açık hem koyu temayı destekler. Varsayılan, ziyaretçinin işletim
sistemi tercihidir; header'daki anahtarla değiştirilir ve seçim
`localStorage`'da saklanır.

- **Tek renk kaynağı `src/app/globals.css`.** Tüm renkler CSS değişkeni olarak
  `:root[data-theme="light"]` ve `:root[data-theme="dark"]` altında tanımlı.
  Bileşenlerde sabit kodlanmış renk yoktur.
- **`src/lib/palet.ts`** yalnızca antd'nin ihtiyaç duyduğu değerleri tekrar eder.
  antd `ConfigProvider` gerçek renk değeri ister, CSS değişkeni kabul etmez
  (SSR'da çözülemediği için hidrasyon uyuşmazlığı çıkarır). Bu iki dosya
  birbiriyle senkron kalmalı.
- **`layout.tsx` içindeki satır içi script** boyama öncesi `data-theme`'i ayarlar.
  Olmazsa koyu tema seçmiş kullanıcı önce beyaz bir flaş görür.
- antd tarafı `theme.defaultAlgorithm` / `theme.darkAlgorithm` arasında geçer.

Yeni bir renk gerekirse: önce `globals.css`'e iki tema için de değişken ekleyin,
sonra bileşende `var(--...)` ile kullanın. Doğrudan hex yazmayın — biri mutlaka
diğer temada kırılır.

## Erişim kapısı (şifre duvarı)

Site kapalı erişimde. Şifre **hiçbir yerde saklanmıyor**: build sırasında şifreden
PBKDF2 ile tek yönlü bir anahtar türetilip yalnızca o yayınlanıyor. Tarayıcı,
kullanıcının yazdığından aynı anahtarı türetip karşılaştırıyor.

```
.env (gitignore)  ──build──>  türetilmiş anahtar  ──>  bundle
   asd987                      9bf58523…              şifre burada YOK
```

Kurulum:

```bash
cp .env.example .env     # icindeki SITE_PASSWORD degerini degistir
npm run gate:key         # src/lib/gate-key.ts uretir (gitignore'da)
```

`predev` ve `prebuild` kancaları sayesinde `npm run dev` / `npm run build`
bunu kendiliğinden çalıştırır.

**Dikkat:** `npx next build` demeyin — npm'in `pre*` kancaları yalnızca
`npm run build` ile çalışır, aksi halde `gate-key.ts` üretilmez ve build patlar.

Yayında şifreyi değiştirmek için: depo ayarlarında
**Settings → Secrets and variables → Actions → `SITE_PASSWORD`**.
Tanımlı değilse build kırılmaz, `scripts/gate-key.mjs` içindeki fallback'e düşer.

Doğrulama — şifrenin çıktıya sızmadığını her seferinde bununla test edin:

```bash
npm run build && grep -r "asd987" out/ ; echo "cikis: $?"   # 1 donmeli
```

Notlar ve sınırlar:

- `crypto.subtle` yalnızca **https** ve **localhost**'ta vardır. LAN IP'sinden
  (`http://192.168.x.x:8888`) açarsanız kapı hiç açılmaz; ekran bunu yakalayıp
  uyarı gösterir.
- `localStorage`'a bayrak değil **anahtarın kendisi** yazılır. Şifreyi
  değiştirdiğinizde saklanan değer yeni anahtarla eşleşmez ve eski şifreyle
  girmiş tüm cihazlar kendiliğinden dışarı düşer.
- Kapı, kök şablonda sarmalayıcı bileşenle kurulu (route guard değil). Kapalıyken
  `children` hiç render edilmediği için statik export çıktısındaki HTML dosyaları
  yalnızca kapı ekranını içerir — sayfa içeriği HTML'e hiç yazılmaz.
- Buna rağmen sayfa kodu JS bundle'ında yer alır. **Bu bir ön kapı kilididir:**
  davetsiz ziyaretçiyi ve crawler'ı durdurur, devtools bilen birini durdurmaz.
  Gerçek kilit gerekirse Cloudflare Pages + Cloudflare Access.
- `robots.txt` proje sayfalarında alt dizine düştüğü için crawler'lar onu okumaz;
  asıl korumayı `layout.tsx` içindeki `robots: { index: false }` meta etiketi sağlar.

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
| `/` | Alıcı | Tek satır: "Ne arıyorsunuz?" (yazı ya da temsili sesli giriş) |
| `/talep/onay` | Alıcı | Ayrıştırılan talebin özeti; çipe tıklayınca şart ↔ esnek; bütçe doğrulama |
| `/hesabim` | Alıcı | Kendi talepleri, gelen teklifler (tam + esnek ön kart), Piyasa Nabzı |
| `/emlakci` | Emlakçı | Talep akışı: bütçe, koltuklar, erken erişim, "portföyünüzde uyan" |
| `/emlakci/talep/[id]` | Emlakçı | Talep detayı, portföyden teklif, Flex-Match, bağlantı ücreti |
| `/emlakci/panel` | Emlakçı | Teklifler ve ücret durumu, müşterilerin talepleri, portföy |
| `/emlakci/talep-ac` | Emlakçı | Müşteri adına talep açma + kefalet |

Header'daki **Alıcı / Emlakçı** anahtarı iki deneyim arasında geçiş yapar (gerçek üründe ayrı hesaplar).

## Ürün kuralları (prototipte uygulanan hali)

Kuralların tamamı `src/lib/eslesme.ts` içinde sabit olarak durur.

- **Bağlantıda ücret.** Emlakçı yalnızca alıcı "ilgileniyorum" deyip iletişim karşılıklı
  açıldığında öder. Alıcı görmez, cevapsız bırakır ya da ilgilenmezse hiçbir şey ödenmez.
  Ücret talep bütçesinin ortasının binde yarımı (60M'lik talepte ₺30.000). Kurucu üyelere ilk 6 ay ₺0.
- **Koltuk.** Bir talebe en fazla 3 emlakçı teklif verebilir; reddedilen teklif koltuğu boşaltır.
- **Erken erişim.** Yeni talep ilk 24 saat yalnızca kabul oranı %70 üstündeki emlakçılara açılır.
- **Flex-Match.** Zorunlu kriterlerden yalnızca birini karşılamayan mülkle esnek teklif verilebilir.
  Alıcıya önce yalnızca o fark gösterilir; görmek isterse teklif açılır. Fiyat da bir kriterdir:
  bütçenin %12'sine kadar üstü esnek teklif sayılır.
- **Eşleşme gerçek.** Uyum oranları ve "portföyünüzde uyan" sayıları, emlakçının portföyü ile
  talebin kriterleri karşılaştırılarak hesaplanır; rastgele değildir.
- **Piyasa Nabzı eşiği.** Bir bölgede 5 talepten az varsa o bölgenin rakamları gösterilmez;
  az sayıda talepte rakamlar kişileri ele verebilir.
- **Filigran.** Teklif fotoğrafları görüntüleyenin koduyla filigranlanır.

## Mimari notlar

- `src/lib/data.ts` — talepler, demo emlakçının portföyü, gelen teklifler (tek mock kaynağı)
- `src/lib/eslesme.ts` — eşleştirme motoru ve ürün kuralları (koltuk, ücret, Flex-Match, erken erişim)
- `src/lib/ayristir.ts` — tek satırı yapılandırılmış talebe çeviren temsili ayrıştırıcı
- `src/lib/demo-store.tsx` — gönderilen teklifler, alıcı kararları, yeni talepler;
  gerçek üründe yerini sunucu oturumu + API alacak
- `src/components/providers.tsx` — antd `ConfigProvider` (açık/koyu tema) ve tr_TR yerelleştirmesi

## Bilinen sınırlar

- Kalıcılık yok: sayfa yenilenince demo sırasında yapılan her şey sıfırlanır.
- Ayrıştırma kural tabanlı ve temsilidir; gerçek üründe bir LLM yapacak (sunucu gerekir).
- Ses girişi temsilidir: mikrofona basınca örnek bir cümle yazılır.
- Belge yükleme ve doğrulama temsilidir; hiçbir dosya bir yere gönderilmez.
- Görseller CSS ile üretilmiş yer tutuculardır.
