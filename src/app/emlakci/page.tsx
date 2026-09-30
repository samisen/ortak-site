"use client";

import { useMemo, useState } from "react";
import { Empty, Segmented, Select, Switch } from "antd";
import { useDemo } from "@/lib/demo-store";
import { MUSTERI_TALEPLERIM, PORTFOYUM } from "@/lib/data";
import { KOLTUK, portfoyUyumu } from "@/lib/eslesme";
import { BOLGELER, talepBolgesi } from "@/lib/bolgeler";
import type { Bolge } from "@/lib/types";
import EmlakciTalepKarti from "@/components/emlakci-talep-karti";

type Siralama = "uyum" | "yeni" | "butce" | "bitis";

export default function EmlakciAkis() {
  const { tumTalepler, yeniTalepler, koltukDolu, gonderilenler } = useDemo();
  const [bolge, setBolge] = useState<Bolge | "hepsi">("hepsi");
  const [sadeceUyan, setSadeceUyan] = useState(false);
  const [siralama, setSiralama] = useState<Siralama>("uyum");

  // Kendi müşterilerimin talepleri akışta görünmez, panelde durur
  const kendiminkiler = useMemo(
    () => new Set([...MUSTERI_TALEPLERIM, ...yeniTalepler.filter((t) => t.acan === "emlakci").map((t) => t.id)]),
    [yeniTalepler]
  );

  const liste = useMemo(() => {
    const puan = (id: string) => {
      const t = tumTalepler.find((x) => x.id === id)!;
      const u = portfoyUyumu(t, PORTFOYUM);
      return u.tam * 10 + u.esnek;
    };
    return tumTalepler
      .filter((t) => !kendiminkiler.has(t.id))
      .filter((t) => bolge === "hepsi" || talepBolgesi(t.kriterler.semtler) === bolge)
      .filter((t) => {
        if (!sadeceUyan) return true;
        const u = portfoyUyumu(t, PORTFOYUM);
        return u.tam + u.esnek > 0;
      })
      .sort((a, b) => {
        // Dolu talepler her zaman sona
        const da = koltukDolu(a.id) >= KOLTUK ? 1 : 0, db = koltukDolu(b.id) >= KOLTUK ? 1 : 0;
        if (da !== db) return da - db;
        if (siralama === "uyum") return puan(b.id) - puan(a.id) || +new Date(b.yayin) - +new Date(a.yayin);
        if (siralama === "yeni") return +new Date(b.yayin) - +new Date(a.yayin);
        if (siralama === "bitis") return +new Date(a.bitis) - +new Date(b.bitis);
        return b.butceMax - a.butceMax;
      });
  }, [tumTalepler, kendiminkiler, bolge, sadeceUyan, siralama, koltukDolu]);

  const ozet = useMemo(() => {
    let tam = 0, esnek = 0;
    for (const t of tumTalepler) {
      if (kendiminkiler.has(t.id) || koltukDolu(t.id) >= KOLTUK) continue;
      const u = portfoyUyumu(t, PORTFOYUM);
      if (u.tam) tam++;
      else if (u.esnek) esnek++;
    }
    return { tam, esnek };
  }, [tumTalepler, kendiminkiler, koltukDolu]);

  const acik = tumTalepler.filter((t) => !kendiminkiler.has(t.id)).length;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="display" style={{ fontSize: "clamp(30px,4vw,42px)", margin: "0 0 8px" }}>Talepler</h1>
          <p style={{ fontSize: 14.5, color: "var(--color-muted)", margin: 0 }}>
            Çeşme, Alaçatı ve Urla&apos;da bütçesi doğrulanmış {acik} açık talep.
          </p>
        </div>
        <div className="panel flex items-center gap-5 px-5 py-4">
          <div>
            <div className="num display" style={{ fontSize: 30, color: "var(--color-gold-soft)" }}>{ozet.tam}</div>
            <div style={{ fontSize: 12, color: "var(--color-faint)" }}>talebe tam uyan<br />mülkünüz var</div>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: "var(--color-line)" }} />
          <div>
            <div className="num display" style={{ fontSize: 30, color: "var(--color-cream)" }}>{ozet.esnek}</div>
            <div style={{ fontSize: 12, color: "var(--color-faint)" }}>talebe tek farkla<br />uyan mülkünüz var</div>
          </div>
          {gonderilenler.length > 0 && (
            <>
              <div style={{ width: 1, alignSelf: "stretch", background: "var(--color-line)" }} />
              <div>
                <div className="num display" style={{ fontSize: 30, color: "var(--color-cream)" }}>{gonderilenler.length}</div>
                <div style={{ fontSize: 12, color: "var(--color-faint)" }}>teklif<br />gönderdiniz</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Segmented
          value={bolge}
          onChange={(v) => setBolge(v as Bolge | "hepsi")}
          options={[{ label: "Tümü", value: "hepsi" }, ...BOLGELER.map((b) => ({ label: b, value: b }))]}
        />
        <label className="flex cursor-pointer items-center gap-2.5" style={{ fontSize: 13.5, color: "var(--color-muted)" }}>
          <Switch size="small" checked={sadeceUyan} onChange={setSadeceUyan} />
          Yalnızca portföyüme uyanlar
        </label>
        <Select
          className="ml-auto"
          value={siralama}
          onChange={setSiralama}
          style={{ width: 210 }}
          options={[
            { label: "Portföyüme uyana göre", value: "uyum" },
            { label: "En yeni", value: "yeni" },
            { label: "Bütçesi en yüksek", value: "butce" },
            { label: "Süresi dolmak üzere", value: "bitis" },
          ]}
        />
      </div>

      {liste.length === 0 ? (
        <div className="panel flex justify-center py-20">
          <Empty description={<span style={{ color: "var(--color-muted)" }}>Bu filtrelerle eşleşen talep yok.</span>} />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {liste.map((t) => (
            <EmlakciTalepKarti
              key={t.id}
              talep={t}
              koltukDolu={koltukDolu(t.id)}
              gonderildi={gonderilenler.some((g) => g.talepId === t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
