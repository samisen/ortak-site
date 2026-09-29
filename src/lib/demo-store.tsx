"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SATICI } from "./data";

/**
 * Prototip boyunca tarayıcıda yaşayan tek ortak durum.
 * Gerçek üründe bunun yerine sunucu tarafı oturum + API gelecek.
 */
interface DemoDurum {
  jeton: number;
  harca: (adet: number) => void;
  yukle: (adet: number) => void;
  verilenTeklifler: string[];
  teklifEkle: (talepId: string) => void;
}

const Ctx = createContext<DemoDurum | null>(null);

export function DemoSaglayici({ children }: { children: ReactNode }) {
  const [jeton, setJeton] = useState(SATICI.token);
  const [verilenTeklifler, setVerilenTeklifler] = useState<string[]>([]);

  return (
    <Ctx.Provider
      value={{
        jeton,
        harca: (adet) => setJeton((j) => Math.max(0, j - adet)),
        yukle: (adet) => setJeton((j) => j + adet),
        verilenTeklifler,
        teklifEkle: (talepId) =>
          setVerilenTeklifler((p) => (p.includes(talepId) ? p : [...p, talepId])),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDemo(): DemoDurum {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDemo, DemoSaglayici içinde kullanılmalı");
  return c;
}
