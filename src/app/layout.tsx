import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "@/components/providers";
import SiteHeader from "@/components/site-header";
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${serif.variable}`}>
      <body>
        <AntdRegistry>
          <Providers>
            <SiteHeader />
            <main>{children}</main>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
