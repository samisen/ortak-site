"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Talep } from "./types";
import type { TaslakTalep } from "./ayristir";
import { BUGUN } from "./format";
import { TALEPLER } from "./data";

/**
 * Prototip boyunca tarayıcı belleğinde yaşayan ortak durum. Sayfa yenilenince
 * sıfırlanır. Gerçek üründe yerini sunucu oturumu ve API alacak.
 */

export type AliciKarari = "baglandi" | "ilgilenmiyor" | "farki-gordu";

export interface GonderilenTeklif {
  talepId: string;
  portfoyId: string;
  tip: "tam" | "esnek";
  not: string;
}

interface DemoDurum {
  gonderilenler: GonderilenTeklif[];
  teklifGonder: (t: GonderilenTeklif) => void;

  kararlar: Record<string, AliciKarari>;
  redSebepleri: Record<string, string>;
  kararVer: (teklifId: string, karar: AliciKarari, sebep?: string) => void;

  /** Bu oturumda açılan talepler (alıcı ya da emlakçı tarafından) */
  yeniTalepler: Talep[];
  /** Alıcı akışından açılanlar — alıcının "Taleplerim" ekranında görünür */
  aliciTalepIdleri: string[];
  /** Demo emlakçının müşterileri adına açtıkları — panelde görünür, akışta görünmez */
  musteriTalepIdleri: string[];
  /**
   * kaynak: talebi hangi ekrandan açıldı.
   * emlakciIle: alıcı "çalıştığım emlakçı var" dedi — talebi emlakçısı işletir,
   * bütçeye o kefil olur.
   */
  talepAc: (taslak: TaslakTalep, kaynak: "alici" | "emlakci", emlakciIle?: boolean) => string;

  /** Mock + yeni talepler birlikte */
  tumTalepler: Talep[];
  /** Mock doluluk + bu oturumda gönderilen teklifler */
  koltukDolu: (talepId: string) => number;
}

const Ctx = createContext<DemoDurum | null>(null);

export function DemoSaglayici({ children }: { children: ReactNode }) {
  const [gonderilenler, setGonderilenler] = useState<GonderilenTeklif[]>([]);
  const [kararlar, setKararlar] = useState<Record<string, AliciKarari>>({});
  const [redSebepleri, setRedSebepleri] = useState<Record<string, string>>({});
  const [yeniTalepler, setYeniTalepler] = useState<Talep[]>([]);
  const [aliciTalepIdleri, setAliciTalepIdleri] = useState<string[]>([]);
  const [musteriTalepIdleri, setMusteriTalepIdleri] = useState<string[]>([]);

  const teklifGonder = useCallback((t: GonderilenTeklif) => {
    setGonderilenler((p) => (p.some((x) => x.talepId === t.talepId) ? p : [...p, t]));
  }, []);

  const kararVer = useCallback((id: string, karar: AliciKarari, sebep?: string) => {
    setKararlar((p) => ({ ...p, [id]: karar }));
    if (sebep) setRedSebepleri((p) => ({ ...p, [id]: sebep }));
  }, []);

  const sayac = useRef(0);
  const talepAc = useCallback((taslak: TaslakTalep, kaynak: "alici" | "emlakci", emlakciIle = false) => {
    const id = `T-${(460 + sayac.current++).toString().padStart(4, "0")}`;
    const acan: Talep["acan"] = kaynak === "emlakci" || emlakciIle ? "emlakci" : "alici";
    const t: Talep = {
      id,
      acan,
      cumle: taslak.cumle,
      kriterler: taslak.kriterler,
      esnek: taslak.esnek,
      butceMin: taslak.butceMin ?? 0,
      butceMax: taslak.butceMax ?? 0,
      pesin: taslak.pesin,
      dogrulama: acan === "emlakci" ? "kefil" : "banka",
      yayin: BUGUN.toISOString(),
      bitis: new Date(BUGUN.getTime() + 90 * 86_400_000).toISOString(),
      koltukDolu: 0,
    };
    setYeniTalepler((p) => [t, ...p]);
    if (kaynak === "alici") setAliciTalepIdleri((p) => [id, ...p]);
    else setMusteriTalepIdleri((p) => [id, ...p]);
    return id;
  }, []);

  const tumTalepler = useMemo(() => [...yeniTalepler, ...TALEPLER], [yeniTalepler]);

  const koltukDolu = useCallback(
    (talepId: string) => {
      const taban = tumTalepler.find((t) => t.id === talepId)?.koltukDolu ?? 0;
      return taban + gonderilenler.filter((g) => g.talepId === talepId).length;
    },
    [tumTalepler, gonderilenler]
  );

  const deger = useMemo<DemoDurum>(
    () => ({ gonderilenler, teklifGonder, kararlar, redSebepleri, kararVer, yeniTalepler, aliciTalepIdleri, musteriTalepIdleri, talepAc, tumTalepler, koltukDolu }),
    [gonderilenler, teklifGonder, kararlar, redSebepleri, kararVer, yeniTalepler, aliciTalepIdleri, musteriTalepIdleri, talepAc, tumTalepler, koltukDolu]
  );

  return <Ctx.Provider value={deger}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoDurum {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemo, DemoSaglayici içinde kullanılmalı");
  return c;
}
