"use client";

import Link from "next/link";
import { Button } from "antd";
import {
  ArrowRightOutlined,
  EyeInvisibleOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  MessageOutlined,
  CheckCircleFilled,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import TalepKarti from "@/components/talep-karti";
import { TALEPLER } from "@/lib/data";

const ADIMLAR = [
  {
    ikon: <FileSearchOutlined />,
    baslik: "Alıcı ne aradığını yazar",
    metin:
      "Bütçe, konum ve zorunlu kriterler yapılandırılmış bir forma girilir. Kimlik ve bütçe doğrulanır. Alıcının kimliği gizli kalır.",
  },
  {
    ikon: <MessageOutlined />,
    baslik: "Portföy sahipleri teklif verir",
    metin:
      "Kriterlere uyan mülkü olan satıcılar kapalı kanaldan teklif gönderir. Hiçbir mülk vitrine çıkmaz, ilan yayınlanmaz.",
  },
  {
    ikon: <CheckCircleFilled />,
    baslik: "Alıcı seçer, taraflar tanışır",
    metin:
      "Alıcı yalnızca beğendiği tekliflerin kimliğini açar. Teklif veren sizsiniz — soğuk arama yok, pazarlık meraklısı yok.",
  },
];

const KARSILASTIRMA = [
  { eski: "Mülkünüzü vitrine asarsınız", yeni: "Mülkünüz hiç yayınlanmaz" },
  { eski: "Yüzlerce meraklı arar", yeni: "Bütçesi belgelenmiş tek alıcı" },
  { eski: "Komşu, kiracı, rakip görür", yeni: "Yalnızca eşleşen alıcı görür" },
  { eski: "Ayda sabit ilan ücreti", yeni: "Sadece iletişim açtığınızda ödersiniz" },
  { eski: "Ölü lead'in parası yanar", yeni: "Dönüş olmazsa jeton iade" },
];

export default function AnaSayfa() {
  const vitrin = [TALEPLER[0], TALEPLER[9], TALEPLER[4]];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="glow grid-tex relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 pb-20 pt-16 md:pt-24">
          <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(200,163,74,.08)",
                  border: "1px solid rgba(200,163,74,.22)",
                  fontSize: 12,
                  color: "var(--color-gold-soft)",
                }}
              >
                <span
                  className="pulse-dot inline-block rounded-full"
                  style={{ width: 6, height: 6, background: "var(--color-gold)" }}
                />
                Ters pazaryeri · Emlak, vasıta ve lüks varlıklar
              </div>

              <h1 className="display mb-6" style={{ fontSize: "clamp(40px, 6.2vw, 68px)", margin: 0 }}>
                İlan vermeyin.
                <br />
                <span style={{ color: "var(--color-gold)" }}>Alıcı size gelsin.</span>
              </h1>

              <p
                className="mb-8 max-w-[52ch]"
                style={{ fontSize: 17, lineHeight: 1.65, color: "var(--color-muted)" }}
              >
                Sahibinden&apos;de mülkünüzü vitrine asıp yüzlerce meraklıyla uğraşıyorsunuz.
                Burada sıra tersine döner: <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>alıcı
                ne aradığını ilan eder</strong>, bütçesi belgelenir, siz de yalnızca elinizdekine uyanlara
                teklif verirsiniz.
              </p>

              <div className="mb-10 flex flex-wrap gap-3">
                <Link href="/talep/yeni">
                  <Button type="primary" size="large" style={{ height: 48, paddingInline: 24, fontSize: 15 }}>
                    Aradığımı ilan edeceğim
                  </Button>
                </Link>
                <Link href="/talepler">
                  <Button
                    size="large"
                    style={{ height: 48, paddingInline: 24, fontSize: 15 }}
                    icon={<ArrowRightOutlined />}
                    iconPlacement="end"
                  >
                    Portföyüm var, talepleri göreyim
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {[
                  { ikon: <SafetyCertificateOutlined />, metin: "Bütçe belgeli alıcılar" },
                  { ikon: <EyeInvisibleOutlined />, metin: "Mülkünüz vitrine çıkmaz" },
                  { ikon: <ReloadOutlined />, metin: "Dönüş yoksa jeton iade" },
                ].map((m) => (
                  <div
                    key={m.metin}
                    className="flex items-center gap-2"
                    style={{ fontSize: 13, color: "var(--color-muted)" }}
                  >
                    <span style={{ color: "var(--color-gold)", fontSize: 14 }}>{m.ikon}</span>
                    {m.metin}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero yanı: gerçek bir talep kartı */}
            <div className="relative">
              <div className="overline mb-3">Canlı talep — satıcı gözünden</div>
              <div style={{ transform: "rotate(-.4deg)" }}>
                <TalepKarti talep={TALEPLER[0]} />
              </div>
              <div
                className="mt-3 rounded-xl px-4 py-3"
                style={{ background: "var(--color-surface-2)", border: "1px dashed var(--color-line-strong)", fontSize: 12.5, color: "var(--color-muted)" }}
              >
                Bu talebin sahibi kim, telefonu ne — görünmüyor. Portföyünüzde uyan bir mülk varsa
                teklif verirsiniz; iletişimi <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>alıcı</strong> açar.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- NASIL ÇALIŞIR ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <div className="mb-12 max-w-[60ch]">
          <div className="overline mb-3">Nasıl çalışır</div>
          <h2 className="display" style={{ fontSize: "clamp(28px,3.6vw,40px)", margin: 0 }}>
            Üç adım. Arada ilan yok.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {ADIMLAR.map((a, i) => (
            <div key={a.baslik} className="panel p-6">
              <div className="mb-5 flex items-center justify-between">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 42,
                    height: 42,
                    background: "rgba(200,163,74,.09)",
                    border: "1px solid rgba(200,163,74,.22)",
                    color: "var(--color-gold)",
                    fontSize: 17,
                  }}
                >
                  {a.ikon}
                </div>
                <span className="num display" style={{ fontSize: 34, color: "var(--color-surface-3)" }}>
                  0{i + 1}
                </span>
              </div>
              <h3 style={{ fontSize: 16.5, fontWeight: 600, margin: "0 0 10px", color: "var(--color-cream)" }}>
                {a.baslik}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--color-muted)", margin: 0 }}>{a.metin}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- KARŞILAŞTIRMA ---------- */}
      <section style={{ borderTop: "1px solid var(--color-line)", borderBottom: "1px solid var(--color-line)", background: "var(--color-surface)" }}>
        <div className="mx-auto max-w-[1240px] px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <div className="overline mb-3">Farkı ne?</div>
              <h2 className="display mb-5" style={{ fontSize: "clamp(28px,3.6vw,40px)", margin: 0 }}>
                Vitrin modeli sizi
                <br />
                yoruyor.
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--color-muted)", margin: 0 }}>
                Lüks segmentte satıcının asıl derdi alıcı bulmak değil; <em style={{ color: "var(--color-cream)", fontStyle: "normal" }}>doğru
                alıcıyı</em>, gürültüye karışmadan bulmak. Mülkün satılık olduğunun duyulmaması çoğu
                zaman fiyattan daha kıymetli.
              </p>
            </div>

            <div className="panel overflow-hidden">
              <div
                className="grid"
                style={{ gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-line)" }}
              >
                <div className="overline px-5 py-3.5">Klasik ilan sitesi</div>
                <div
                  className="overline px-5 py-3.5"
                  style={{ color: "var(--color-gold)", borderLeft: "1px solid var(--color-line)" }}
                >
                  arayanindan
                </div>
              </div>
              {KARSILASTIRMA.map((k, i) => (
                <div
                  key={k.eski}
                  className="grid"
                  style={{
                    gridTemplateColumns: "1fr 1fr",
                    borderBottom: i === KARSILASTIRMA.length - 1 ? "none" : "1px solid var(--color-line)",
                  }}
                >
                  <div className="flex items-start gap-2.5 px-5 py-4" style={{ fontSize: 13.5, color: "var(--color-faint)" }}>
                    <CloseOutlined style={{ fontSize: 11, marginTop: 4 }} />
                    {k.eski}
                  </div>
                  <div
                    className="flex items-start gap-2.5 px-5 py-4"
                    style={{ fontSize: 13.5, color: "var(--color-cream)", borderLeft: "1px solid var(--color-line)" }}
                  >
                    <CheckOutlined style={{ fontSize: 11, marginTop: 4, color: "var(--color-gold)" }} />
                    {k.yeni}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CANLI TALEPLER ---------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="overline mb-3">Şu anda açık talepler</div>
            <h2 className="display" style={{ fontSize: "clamp(28px,3.6vw,40px)", margin: 0 }}>
              Aradığı belli, bütçesi belli.
            </h2>
          </div>
          <Link href="/talepler">
            <Button icon={<ArrowRightOutlined />} iconPlacement="end" size="large">
              Tüm talepleri gör
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {vitrin.map((t) => (
            <TalepKarti key={t.id} talep={t} />
          ))}
        </div>
      </section>

      {/* ---------- JETON İADE GARANTİSİ ---------- */}
      <section style={{ borderTop: "1px solid var(--color-line)" }}>
        <div className="mx-auto max-w-[1240px] px-5 py-20">
          <div
            className="glow relative overflow-hidden rounded-2xl p-8 md:p-12"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
          >
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
              <div>
                <div className="overline mb-3" style={{ color: "var(--color-gold)" }}>
                  Satıcılar için
                </div>
                <h2 className="display mb-5" style={{ fontSize: "clamp(26px,3.2vw,38px)", margin: 0 }}>
                  Ölü lead&apos;in parasını ödemezsiniz.
                </h2>
                <p className="mb-7 max-w-[54ch]" style={{ fontSize: 15.5, lineHeight: 1.7, color: "var(--color-muted)" }}>
                  İletişim açmak için jeton harcarsınız. Alıcı 48 saat içinde dönmezse jetonunuz
                  otomatik olarak hesabınıza geri yüklenir. Aylık sabit ilan ücreti yok; ödediğiniz
                  her jetonun karşılığı ya bir görüşme olur, ya da cebinizde kalır.
                </p>
                <Link href="/talepler">
                  <Button type="primary" size="large" style={{ height: 46, paddingInline: 22 }}>
                    Talep akışını incele
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { sayi: "0 ₺", etiket: "Aylık sabit ücret" },
                  { sayi: "48 sa", etiket: "Dönüş yoksa iade" },
                  { sayi: "%100", etiket: "Bütçe doğrulaması" },
                  { sayi: "Gizli", etiket: "Portföyünüz yayınlanmaz" },
                ].map((s) => (
                  <div key={s.etiket} className="panel-2 p-5">
                    <div className="num display mb-1" style={{ fontSize: 28, color: "var(--color-gold-soft)" }}>
                      {s.sayi}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{s.etiket}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer style={{ borderTop: "1px solid var(--color-line)", background: "var(--color-surface)" }}>
        <div className="mx-auto max-w-[1240px] px-5 py-12">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-[38ch]">
              <div className="display mb-3" style={{ fontSize: 22 }}>
                <span style={{ color: "var(--color-cream)" }}>arayan</span>
                <span style={{ color: "var(--color-gold)" }}>indan</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--color-faint)", margin: 0 }}>
                Aradığınızı ilan edin, mülk size gelsin. Emlak, vasıta ve lüks varlıklar için
                doğrulanmış talep eşleştirme platformu.
              </p>
            </div>
            <div className="flex flex-wrap gap-14">
              {[
                { baslik: "Alıcı", linkler: [["Talep oluştur", "/talep/yeni"], ["Gelen kutusu", "/gelen-kutusu"]] },
                { baslik: "Satıcı", linkler: [["Talep akışı", "/talepler"], ["Panelim", "/panel"]] },
              ].map((g) => (
                <div key={g.baslik}>
                  <div className="overline mb-3">{g.baslik}</div>
                  <div className="flex flex-col gap-2">
                    {g.linkler.map(([e, h]) => (
                      <Link key={h} href={h} className="no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
                        {e}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="mt-10 flex flex-wrap items-center justify-between gap-3 pt-6"
            style={{ borderTop: "1px solid var(--color-line)", fontSize: 12, color: "var(--color-faint)" }}
          >
            <span>© 2026 arayanindan</span>
            <span
              className="rounded px-2 py-1"
              style={{ background: "var(--color-surface-3)", border: "1px solid var(--color-line)" }}
            >
              Prototip · Tüm veriler temsilidir
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
