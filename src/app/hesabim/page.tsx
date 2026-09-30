"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Segmented, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DEMO_ALICI, talepTeklifleri } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { butceAralik, kalanGun, tlKisa } from "@/lib/format";
import { KOLTUK } from "@/lib/eslesme";
import { BOLGELER, talepBolgesi } from "@/lib/bolgeler";
import type { Talep } from "@/lib/types";
import { DogrulamaEtiketi, KriterCipleri, Koltuklar } from "@/components/ui";
import TeklifKarti from "@/components/teklif-karti";

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

export default function Hesabim() {
  const { tumTalepler, yeniTalepler, kararlar, kararVer, koltukDolu } = useDemo();

  const benim = useMemo(
    () => [...yeniTalepler.filter((t) => t.acan === "alici"), ...tumTalepler.filter((t) => t.id === DEMO_ALICI.talepId)],
    [yeniTalepler, tumTalepler]
  );
  const [secili, setSecili] = useState<string>();
  const talep = benim.find((t) => t.id === secili) ?? benim[0];
  const teklifler = talepTeklifleri(talep.id);
  // Farkı görülmüş esnek teklif de hâlâ karar bekler
  const bekleyen = teklifler.filter((t) => !kararlar[t.id] || kararlar[t.id] === "farki-gordu").length;

  return (
    <div className="mx-auto max-w-[920px] px-5 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,40px)", margin: 0 }}>Talepleriniz</h1>
        <Link href="/"><Button icon={<PlusOutlined />}>Yeni talep</Button></Link>
      </div>

      {benim.length > 1 && (
        <Segmented
          className="mb-5"
          value={talep.id}
          onChange={(v) => setSecili(v as string)}
          options={benim.map((t) => ({ value: t.id, label: `${t.id} · ${t.kriterler.turler[0] ?? "Talep"}` }))}
        />
      )}

      {/* Talebin kendisi */}
      <section className="panel mb-8 p-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <span className="num display" style={{ fontSize: 26, color: "var(--color-gold-soft)" }}>
            {butceAralik(talep.butceMin, talep.butceMax)}{talep.pesin && <span style={{ fontSize: 15, color: "var(--color-muted)", fontFamily: "var(--font-sans)" }}> · peşin</span>}
          </span>
          <span className="num" style={{ fontSize: 12, color: "var(--color-faint)" }}>{talep.id} · {kalanGun(talep.bitis)} gün açık</span>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--color-cream)", margin: "0 0 14px" }}>“{talep.cumle}”</p>
        <div className="mb-4"><KriterCipleri kriterler={talep.kriterler} esnek={talep.esnek} /></div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4" style={{ borderTop: "1px solid var(--color-line)" }}>
          <Koltuklar dolu={koltukDolu(talep.id)} />
          <DogrulamaEtiketi tur={talep.dogrulama} />
        </div>
      </section>

      <Tabs
        items={[
          {
            key: "teklifler",
            label: `Teklifler${teklifler.length ? ` (${teklifler.length})` : ""}`,
            children: teklifler.length ? (
              <div className="flex flex-col gap-4">
                {bekleyen > 0 && (
                  <p style={{ fontSize: 13.5, color: "var(--color-muted)", margin: "4px 0 4px" }}>
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
              <div className="panel-2 px-6 py-12 text-center">
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
  );
}
