"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PALET, TEMA_DEPO_ANAHTARI, type Palet, type Tema } from "./palet";

export type TemaTercihi = Tema | "sistem";

interface TemaDurumu {
  /** Ekrana uygulanan tema */
  tema: Tema;
  /** Kullanicinin secimi — "sistem" ise isletim sistemini takip eder */
  tercih: TemaTercihi;
  ayarla: (t: TemaTercihi) => void;
  palet: Palet;
}

const Ctx = createContext<TemaDurumu | null>(null);

function sistemTemasi(): Tema {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function TemaSaglayici({ children }: { children: ReactNode }) {
  // SSR ve ilk istemci render'i ayni olsun diye "light" ile basliyoruz.
  // layout'taki satir ici script data-theme'i zaten paint oncesi dogru
  // degere ayarladigi icin kullanici koyu temada da flas gormuyor;
  // asagidaki effect React tarafini ayni tick icinde senkronluyor.
  const [tercih, setTercih] = useState<TemaTercihi>("sistem");
  const [tema, setTema] = useState<Tema>("light");
  // Tercih okunana kadar data-theme'e dokunmuyoruz: satir ici script onu
  // zaten dogru ayarladi, erken yazmak kisa bir tema flasina yol aciyor.
  const [cozuldu, setCozuldu] = useState(false);

  useEffect(() => {
    let kayitli: TemaTercihi = "sistem";
    try {
      const v = localStorage.getItem(TEMA_DEPO_ANAHTARI);
      if (v === "light" || v === "dark" || v === "sistem") kayitli = v;
    } catch {
      /* private mode */
    }
    setTercih(kayitli);
    setTema(kayitli === "sistem" ? sistemTemasi() : kayitli);
    setCozuldu(true);
  }, []);

  // Sistem temasi degisirse takip et (yalnizca tercih "sistem" iken)
  useEffect(() => {
    if (tercih !== "sistem") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const el = () => setTema(mq.matches ? "dark" : "light");
    mq.addEventListener("change", el);
    return () => mq.removeEventListener("change", el);
  }, [tercih]);

  // CSS degiskenlerini tasiyan attribute
  useEffect(() => {
    if (!cozuldu) return;
    document.documentElement.dataset.theme = tema;
  }, [tema, cozuldu]);

  const ayarla = useCallback((t: TemaTercihi) => {
    setTercih(t);
    setTema(t === "sistem" ? sistemTemasi() : t);
    try {
      localStorage.setItem(TEMA_DEPO_ANAHTARI, t);
    } catch {
      /* private mode */
    }
  }, []);

  const deger = useMemo<TemaDurumu>(
    () => ({ tema, tercih, ayarla, palet: PALET[tema] }),
    [tema, tercih, ayarla]
  );

  return <Ctx.Provider value={deger}>{children}</Ctx.Provider>;
}

export function useTema(): TemaDurumu {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTema, TemaSaglayici icinde kullanilmali");
  return c;
}
