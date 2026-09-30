/**
 * antd ConfigProvider gercek renk degeri ister, CSS degiskeni kabul etmez
 * (deger SSR'da cozulemedigi icin hidrasyon uyusmazligi cikariyor).
 * Bu yuzden antd'nin ihtiyac duydugu degerler burada tekrar ediliyor.
 *
 * !! globals.css icindeki paletle ayni kalmali. Birini degistirirsen digerini de degistir.
 */

export type Tema = "light" | "dark";

export interface Palet {
  gold: string;
  goldSoft: string;
  verified: string;
  alert: string;
  error: string;

  ink: string;
  cream: string;
  surface: string;
  surface2: string;
  surface3: string;
  line: string;
  lineSoft: string;
}

export const PALET: Record<Tema, Palet> = {
  light: {
    gold: "#9A7A22",
    goldSoft: "#6E5514",
    verified: "#2F7A52",
    alert: "#A6511F",
    error: "#A8402C",

    ink: "#FAF8F4",
    cream: "#1B1A17",
    surface: "#FFFFFF",
    surface2: "#F4F1EA",
    surface3: "#EAE5DA",
    line: "#E4DFD3",
    lineSoft: "#EFEBE1",
  },
  dark: {
    gold: "#C8A34A",
    goldSoft: "#E3CB84",
    verified: "#5AA97B",
    alert: "#C4703F",
    error: "#C0553F",

    ink: "#08080A",
    cream: "#EFEBE3",
    surface: "#101013",
    surface2: "#17171B",
    surface3: "#1E1E24",
    line: "#26262E",
    lineSoft: "#1E1E24",
  },
};

export const TEMA_DEPO_ANAHTARI = "arayanindan-tema";
