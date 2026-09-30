"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Segmented, Tooltip } from "antd";
import { MoonFilled, SunOutlined } from "@ant-design/icons";
import { useTema } from "@/lib/tema";
import { DEMO_ALICI, DEMO_EMLAKCI } from "@/lib/data";

type Rol = "alici" | "emlakci";

const EMLAKCI_NAV = [
  { href: "/emlakci", etiket: "Talepler", tam: true },
  { href: "/emlakci/panel", etiket: "Panel" },
  { href: "/emlakci/talep-ac", etiket: "Müşterim adına talep" },
];

function Logo({ rol }: { rol: Rol }) {
  return (
    <Link href={rol === "emlakci" ? "/emlakci" : "/"} className="display flex shrink-0 items-baseline gap-2 text-[21px] no-underline">
      <span>
        <span style={{ color: "var(--color-cream)" }}>arayan</span>
        <span style={{ color: "var(--color-gold)" }}>indan</span>
      </span>
      {rol === "emlakci" && (
        <span className="overline" style={{ fontFamily: "var(--font-sans)", color: "var(--color-muted)" }}>Emlakçı</span>
      )}
    </Link>
  );
}

export default function SiteHeader() {
  const yol = usePathname();
  const router = useRouter();
  const rol: Rol = yol.startsWith("/emlakci") ? "emlakci" : "alici";
  const { tema, ayarla } = useTema();

  const temaDugmesi = (
    <Tooltip title={tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}>
      <Button
        type="text"
        shape="circle"
        aria-label={tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
        onClick={() => ayarla(tema === "dark" ? "light" : "dark")}
        icon={tema === "dark" ? <SunOutlined style={{ fontSize: 15 }} /> : <MoonFilled style={{ fontSize: 14 }} />}
      />
    </Tooltip>
  );

  const rolDugmesi = (
    <Tooltip title="Demo: iki taraf ayrı hesaplardır, burada geçiş için birleştirildi">
      <Segmented
        size="small"
        value={rol}
        onChange={(v) => router.push(v === "emlakci" ? "/emlakci" : "/hesabim")}
        options={[
          { label: "Alıcı", value: "alici" },
          { label: "Emlakçı", value: "emlakci" },
        ]}
      />
    </Tooltip>
  );

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--header-bg)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--color-line)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-5">
        <Logo rol={rol} />

        {rol === "emlakci" && (
          <nav className="hidden items-center gap-1 md:flex">
            {EMLAKCI_NAV.map((n) => {
              const aktif = n.tam ? yol === n.href || yol.startsWith("/emlakci/talep/") : yol.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-1.5 text-[13.5px] no-underline"
                  style={{ color: aktif ? "var(--color-cream)" : "var(--color-muted)", background: aktif ? "var(--color-surface-2)" : "transparent" }}
                >
                  {n.etiket}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2.5">
          {rol === "alici" ? (
            <>
              <Link href="/hesabim" className="hidden rounded-lg px-3 py-1.5 text-[13.5px] no-underline sm:block" style={{ color: yol === "/hesabim" ? "var(--color-cream)" : "var(--color-muted)" }}>
                Taleplerim
              </Link>
              <span className="num hidden md:inline" style={{ fontSize: 12, color: "var(--color-faint)" }}>{DEMO_ALICI.kod}</span>
            </>
          ) : (
            <Tooltip title="Tekliflerinizin alıcılar tarafından ilgi görme oranı. %70 üstü, yeni taleplere ilk 24 saat erken erişim sağlar.">
              <span className="num hidden items-center gap-1.5 rounded-lg px-2.5 py-1 sm:inline-flex" style={{ fontSize: 12.5, background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}>
                <span style={{ color: "var(--color-cream)", fontWeight: 600 }}>%{DEMO_EMLAKCI.kabulOrani}</span> kabul
                {DEMO_EMLAKCI.kurucu && <span style={{ color: "var(--color-gold)" }}>· kurucu</span>}
              </span>
            </Tooltip>
          )}
          {temaDugmesi}
          {rolDugmesi}
        </div>
      </div>
    </header>
  );
}
