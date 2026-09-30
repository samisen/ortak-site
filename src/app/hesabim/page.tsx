"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DEMO_ALICI, talepTeklifleri } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { butceAralik, kalanGun, tlKisa } from "@/lib/format";
import { konumMetni } from "@/lib/kriterler";
import { KOLTUK } from "@/lib/eslesme";
import { BOLGELER, talepBolgesi } from "@/lib/bolgeler";
import type { Talep } from "@/lib/types";
import { DogrulamaEtiketi, KriterCipleri, Koltuklar } from "@/components/ui";
import TeklifKarti from "@/components/teklif-karti";
import Kap from "@/components/kap";

/** Piyasa Nabzı: bir bölgede bundan az talep varsa rakamlar gösterilmez */
const ESIK = 5;

function PiyasaNabzi({ talepler }: { talepler: Talep[] }) {
  const bolgeler = BOLGELER.map((b) => {
    const t = talepler.filter((x) => talepBolgesi(x.kriterler.semtler) === b);
    const butceler = t.map((x) => x.butceMax).sort((a, c) => a - c);
    const toplam = butceler.reduce((a, c) => a + c, 0);
    const medyan = butceler.length ? butceler[Math.floor(butceler.length / 2)] : 0;
    const turSayim = new Map<string, number>();
    t.forEach((x) => x.kriterler.turler.forEach((tur) => turSayim.set(tur, (turSayim.get(tur) ?? 0) + 1)));
    const enCok = [...turSayim.entries()].sort((a, c) => c[1] - a[1])[0]?.[0];
    return { bolge: b, adet: t.length, toplam, medyan, enCok };
  });

  return (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--color-muted)", margin: "0 0 20px", maxWidth: "62ch" }}>
        Bölgede şu anda açık olan doğrulanmış taleplerin toplu görünümü. Kimse tek tek görünmez;
        bir bölgede {ESIK} talepten az varsa o bölgenin rakamlarını göstermiyoruz, çünkü az sayıda talepte
        rakamlar kişileri ele verebilir.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {bolgeler.map((b) => (
          <div key={b.bolge} className="panel p-5">
            <div className="overline mb-3" style={{ color: "var(--color-gold)" }}>{b.bolge}</div>
            {b.adet >= ESIK ? (
              <>
                <div className="num display" style={{ fontSize: 34, color: "var(--color-cream)" }}>{b.adet}</div>
                <div style={{ fontSize: 12.5, color: "var(--color-faint)", marginBottom: 14 }}>açık talep</div>
                {[
                  ["Toplam doğrulanmış bütçe", tlKisa(b.toplam)],
                  ["Ortanca bütçe", tlKisa(b.medyan)],
                  ["En çok aranan", b.enCok ?? "—"],
                ].map(([e, d]) => (
                  <div key={e} className="flex justify-between py-2" style={{ borderTop: "1px solid var(--color-line)", fontSize: 13 }}>
                    <span style={{ color: "var(--color-muted)" }}>{e}</span>
                    <span className="num" style={{ color: "var(--color-cream)", fontWeight: 500 }}>{d}</span>
                  </div>
                ))}
              </>
            ) : (
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-faint)", margin: 0 }}>
                Henüz yeterli veri yok. En az {ESIK} talep olunca gösterilecek.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sol sütundaki talep kartı: seçili olan açık, diğerleri özet halinde */
function TalepKutusu({ talep: t, secili, teklifSayisi, koltuk, onSec }: { talep: Talep; secili: boolean; teklifSayisi: number; koltuk: number; onSec: () => void }) {
  if (!secili) {
    return (
      <button
        type="button"
        onClick={onSec}
        className="panel lift w-full cursor-pointer p-4 text-left"
        style={{ color: "inherit" }}
      >
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="num" style={{ fontSize: 15, fontWeight: 600, color: "var(--color-gold-soft)" }}>{butceAralik(t.butceMin, t.butceMax)}</span>
          <span className="num" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{t.id}</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--color-muted)" }}>
          {t.kriterler.turler.join(" / ")} · {konumMetni(t.kriterler.semtler)}
        </div>
        <div className="mt-2" style={{ fontSize: 12, color: "var(--color-faint)" }}>
          {teklifSayisi ? `${teklifSayisi} teklif` : "Teklif bekleniyor"}
        </div>
      </button>
    );
  }

  return (
    <section className="panel p-5" style={{ borderColor: "var(--accent-line)" }}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="num display" style={{ fontSize: 26, color: "var(--color-gold-soft)" }}>{butceAralik(t.butceMin, t.butceMax)}</span>
        <span className="num" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>{t.id}</span>
      </div>
      <div className="mb-3" style={{ fontSize: 12.5, color: "var(--color-faint)" }}>
        {t.pesin ? "Peşin · " : ""}{kalanGun(t.bitis)} gün açık
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-cream)", margin: "0 0 14px" }}>“{t.cumle}”</p>
      <div className="mb-4"><KriterCipleri kriterler={t.kriterler} esnek={t.esnek} kucuk /></div>
      <div className="flex flex-col gap-2 pt-4" style={{ borderTop: "1px solid var(--color-line)" }}>
        <Koltuklar dolu={koltuk} />
        <DogrulamaEtiketi tur={t.dogrulama} />
      </div>
    </section>
  );
}

export default function Hesabim() {
  const { tumTalepler, yeniTalepler, aliciTalepIdleri, kararlar, kararVer, koltukDolu } = useDemo();

  const benim = useMemo(
    () => [...yeniTalepler.filter((t) => aliciTalepIdleri.includes(t.id)), ...tumTalepler.filter((t) => t.id === DEMO_ALICI.talepId)],
    [yeniTalepler, aliciTalepIdleri, tumTalepler]
  );
  const [secili, setSecili] = useState<string>();
  const talep = benim.find((t) => t.id === secili) ?? benim[0];
  const teklifler = talepTeklifleri(talep.id);
  // Farkı görülmüş esnek teklif de hâlâ karar bekler
  const bekleyen = teklifler.filter((t) => !kararlar[t.id] || kararlar[t.id] === "farki-gordu").length;

  return (
    <Kap className="py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,40px)", margin: 0 }}>Talepleriniz</h1>
        <Link href="/"><Button icon={<PlusOutlined />}>Yeni talep</Button></Link>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-3 lg:sticky lg:top-24">
          {benim.map((t) => (
            <TalepKutusu
              key={t.id}
              talep={t}
              secili={t.id === talep.id}
              teklifSayisi={talepTeklifleri(t.id).length}
              koltuk={koltukDolu(t.id)}
              onSec={() => setSecili(t.id)}
            />
          ))}
        </aside>

        <div className="min-w-0">
          <Tabs
            style={{ marginTop: -8 }}
            items={[
              {
                key: "teklifler",
                label: `Teklifler${teklifler.length ? ` (${teklifler.length})` : ""}`,
                children: teklifler.length ? (
                  <div className="flex flex-col gap-4">
                    {bekleyen > 0 && (
                      <p style={{ fontSize: 13.5, color: "var(--color-muted)", margin: "0 0 4px" }}>
                        {bekleyen} teklif kararınızı bekliyor. İlgilenmediğiniz tekliflerde emlakçıya ücret yansımaz.
                      </p>
                    )}
                    {teklifler.map((tk) => (
                      <TeklifKarti
                        key={tk.id}
                        teklif={tk}
                        talep={talep}
                        karar={kararlar[tk.id]}
                        onKarar={(k, s) => kararVer(tk.id, k, s)}
                        filigran={DEMO_ALICI.kod}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="panel-2 px-6 py-14 text-center">
                    <div style={{ fontSize: 15, color: "var(--color-cream)", marginBottom: 6 }}>Teklif bekleniyor</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)" }}>
                      Talebiniz bölgedeki emlakçılara iletildi. {KOLTUK} koltuğun tamamı boş;
                      teklifler geldikçe burada görünecek.
                    </div>
                  </div>
                ),
              },
              { key: "piyasa", label: "Piyasa Nabzı", children: <PiyasaNabzi talepler={tumTalepler} /> },
            ]}
          />
        </div>
      </div>
    </Kap>
  );
}
