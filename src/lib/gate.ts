"use client";

import { useCallback, useEffect, useState } from "react";
import { GATE_KEY, GATE_SALT, GATE_ITERATIONS } from "./gate-key";

const DEPO_ANAHTARI = "arayanindan-gate";

/**
 * Sifre hicbir yerde saklanmiyor. Build sirasinda sifreden PBKDF2 ile tek yonlu
 * bir anahtar turetiliyor (gate-key.ts) ve yalnizca o yayinlaniyor. Tarayici,
 * kullanicinin yazdigindan ayni anahtari turetip karsilastiriyor.
 *
 * localStorage'a bayrak degil anahtarin kendisi yaziliyor: sifre degisince
 * saklanan deger yeni GATE_KEY ile eslesmez ve eski sifreyle girmis tum
 * cihazlar kendiliginden disari duser.
 */
export function useKapi() {
  const [acik, setAcik] = useState(false);
  const [kontrolEdiliyor, setKontrolEdiliyor] = useState(false);
  const [kullanilamaz, setKullanilamaz] = useState(false);
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    // crypto.subtle yalnizca https ve localhost'ta var
    if (!window.crypto?.subtle) setKullanilamaz(true);
    try {
      if (localStorage.getItem(DEPO_ANAHTARI) === GATE_KEY) setAcik(true);
    } catch {
      /* private mode: localStorage erisilemeyebilir */
    }
    setHazir(true);
  }, []);

  const ac = useCallback(async (sifre: string): Promise<boolean> => {
    setKontrolEdiliyor(true);
    try {
      const dogru = (await turet(sifre)) === GATE_KEY;
      if (dogru) {
        try {
          localStorage.setItem(DEPO_ANAHTARI, GATE_KEY);
        } catch {
          /* saklanamazsa da bu oturum acik kalir */
        }
        setAcik(true);
      }
      return dogru;
    } finally {
      setKontrolEdiliyor(false);
    }
  }, []);

  return { acik, kontrolEdiliyor, kullanilamaz, hazir, ac };
}

/** Node tarafindaki pbkdf2Sync(pw, salt, iter, 32, 'sha256') ile birebir ayni sonuc */
async function turet(sifre: string): Promise<string> {
  const subtle = window.crypto.subtle;
  const bayt = new TextEncoder();
  const malzeme = await subtle.importKey("raw", bayt.encode(sifre), "PBKDF2", false, ["deriveBits"]);
  const bitler = await subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: bayt.encode(GATE_SALT),
      iterations: GATE_ITERATIONS,
      hash: "SHA-256",
    },
    malzeme,
    256
  );
  return Array.from(new Uint8Array(bitler), (b) => b.toString(16).padStart(2, "0")).join("");
}
