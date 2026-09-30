"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Segmented, Tooltip, Badge } from "antd";
import { PlusOutlined, ThunderboltFilled, SunOutlined, MoonFilled } from "@ant-design/icons";
import { ALICI } from "@/lib/data";
import { useDemo } from "@/lib/demo-store";
import { useTema } from "@/lib/tema";

type Persona = "alici" | "satici";

const ALICI_YOLLARI = ["/talep/yeni", "/gelen-kutusu"];

const NAV: Record<Persona, { href: string; etiket: string }[]> = {
  alici: [
    { href: "/talep/yeni", etiket: "Talep oluştur" },
    { href: "/gelen-kutusu", etiket: "Gelen kutusu" },
    { href: "/talepler", etiket: "Tüm talepler" },
  ],
  satici: [
    { href: "/talepler", etiket: "Talep akışı" },
    { href: "/panel", etiket: "Panelim" },
  ],
};

/** Persona yoldan türetilir — böylece sunucu ve istemci hep aynı şeyi çizer */
function personaBul(yol: string): Persona {
  return ALICI_YOLLARI.some((y) => yol.startsWith(y)) ? "alici" : "satici";
}

export default function SiteHeader() {
  const yol = usePathname();
  const router = useRouter();
  const persona = personaBul(yol);
  const { jeton } = useDemo();
  const { tema, ayarla } = useTema();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5">
        <Link href="/" className="display shrink-0 text-[21px] no-underline">
          <span style={{ color: "var(--color-cream)" }}>arayan</span>
          <span style={{ color: "var(--color-gold)" }}>indan</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV[persona].map((n) => {
            const aktif = yol === n.href || (n.href !== "/" && yol.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-1.5 text-[13.5px] no-underline transition-colors"
                style={{
                  color: aktif ? "var(--color-cream)" : "var(--color-muted)",
                  background: aktif ? "var(--color-surface-2)" : "transparent",
                }}
              >
                {n.etiket}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Tooltip title={tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}>
            <Button
              type="text"
              shape="circle"
              aria-label={tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
              onClick={() => ayarla(tema === "dark" ? "light" : "dark")}
              icon={
                tema === "dark" ? (
                  <SunOutlined style={{ fontSize: 15 }} />
                ) : (
                  <MoonFilled style={{ fontSize: 14 }} />
                )
              }
            />
          </Tooltip>

          <Tooltip title="Demo için taraf değiştirin — ürün iki farklı deneyim sunuyor">
            <Segmented
              size="small"
              value={persona}
              onChange={(v) => router.push(v === "alici" ? "/talep/yeni" : "/talepler")}
              options={[
                { label: "Alıcı", value: "alici" },
                { label: "Satıcı", value: "satici" },
              ]}
            />
          </Tooltip>

          {persona === "satici" ? (
            <>
              <Tooltip title="Jeton bakiyeniz — iletişim açmak için harcanır, dönüş olmazsa iade edilir">
                <Link
                  href="/panel"
                  className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] no-underline sm:flex"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
                >
                  <ThunderboltFilled style={{ color: "var(--color-gold)", fontSize: 12 }} />
                  <span className="num" style={{ color: "var(--color-cream)" }}>{jeton}</span>
                  <span style={{ color: "var(--color-faint)" }}>jeton</span>
                </Link>
              </Tooltip>
              <Link href="/talepler">
                <Button type="primary">Talepleri gör</Button>
              </Link>
            </>
          ) : (
            <>
              <Badge count={ALICI.okunmamis} size="small" offset={[-2, 2]}>
                <Link
                  href="/gelen-kutusu"
                  className="hidden rounded-lg px-2.5 py-1.5 text-[13px] no-underline sm:block"
                  style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
                >
                  Teklifler
                </Link>
              </Badge>
              <Link href="/talep/yeni">
                <Button type="primary" icon={<PlusOutlined />}>
                  Talep oluştur
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
