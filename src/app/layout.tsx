import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "@/components/providers";
import SiteHeader from "@/components/site-header";
import GateKapisi from "@/components/gate-kapisi";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "arayanindan — Aradığınızı ilan edin, mülk size gelsin",
  description:
    "Ters pazaryeri: alıcı ne aradığını yazar, portföy sahipleri teklif verir. Mülkünüz vitrine çıkmadan alıcı bulun.",
  // Kapali erisimde oldugu surece arama motorlarina kapali
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <AntdRegistry>
          <Providers>
            <GateKapisi>
              <SiteHeader />
              <main>{children}</main>
            </GateKapisi>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
