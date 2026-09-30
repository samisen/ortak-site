"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Dropdown, Segmented, Tooltip } from "antd";
import { MenuOutlined, MoonFilled, SunOutlined } from "@ant-design/icons";
import { useTema } from "@/lib/tema";
import { DEMO_ALICI, DEMO_EMLAKCI } from "@/lib/data";
import { KAP } from "./kap";

type Rol = "alici" | "emlakci";

const EMLAKCI_NAV = [
  { href: "/emlakci", etiket: "Talepler" },
  { href: "/emlakci/panel", etiket: "Panel" },
  { href: "/emlakci/talep-ac", etiket: "Müşterim adına talep" },
];

/** "Talepler" hem akışı hem talep detaylarını kapsar; diğerleri kendi yolunu */
function aktifMi(href: string, yol: string) {
  const y = yol.replace(/\/$/, "") || "/";
  if (href === "/emlakci") return y === "/emlakci" || y.startsWith("/emlakci/talep/");
  return y.startsWith(href);
}

function Logo({ rol }: { rol: Rol }) {
  return (
    <Link href={rol === "emlakci" ? "/emlakci" : "/"} className="display flex shrink-0 items-baseline gap-2 text-[21px] no-underline">
      <span>
        <span style={{ color: "var(--color-cream)" }}>arayan</span>
        <span style={{ color: "var(--color-gold)" }}>indan</span>
      </span>
      {rol === "emlakci" && (
        // Telefonda gizli: rol, sağdaki Alıcı/Emlakçı düğmesinde zaten görünüyor
        <span className="overline hidden sm:inline" style={{ fontFamily: "var(--font-sans)", color: "var(--color-muted)" }}>Emlakçı</span>
      )}
    </Link>
  );
}

export default function SiteHeader() {
  const yol = usePathname();
  const router = useRouter();
  const rol: Rol = yol.startsWith("/emlakci") ? "emlakci" : "alici";
  const { tema, ayarla } = useTema();
  const temaEtiketi = tema === "dark" ? "Açık temaya geç" : "Koyu temaya geç";

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "var(--header-bg)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--color-line)" }}
    >
      <div className={`${KAP} flex h-16 items-center gap-3 sm:gap-6`}>
        <Logo rol={rol} />

        {/* Geniş ekranda emlakçı menüsü satırda */}
        {rol === "emlakci" && (
          <nav className="hidden items-center gap-1 lg:flex">
            {EMLAKCI_NAV.map((n) => {
              const aktif = aktifMi(n.href, yol);
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

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
          {rol === "alici" ? (
            <>
              <Link
                href="/hesabim"
                className="hidden rounded-lg px-3 py-1.5 text-[13.5px] no-underline sm:block"
                style={{ color: aktifMi("/hesabim", yol) ? "var(--color-cream)" : "var(--color-muted)" }}
              >
                Taleplerim
              </Link>
              <span className="num hidden md:inline" style={{ fontSize: 12, color: "var(--color-faint)" }}>{DEMO_ALICI.kod}</span>
            </>
          ) : (
            <>
              <Tooltip title="Tekliflerinizin alıcılar tarafından ilgi görme oranı. %70 üstü, yeni taleplere ilk 24 saat erken erişim sağlar.">
                <span
                  className="num hidden items-center gap-1.5 rounded-lg px-2.5 py-1 lg:inline-flex"
                  style={{ fontSize: 12.5, background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
                >
                  <span style={{ color: "var(--color-cream)", fontWeight: 600 }}>%{DEMO_EMLAKCI.kabulOrani}</span> kabul
                  {DEMO_EMLAKCI.kurucu && <span style={{ color: "var(--color-gold)" }}>· kurucu</span>}
                </span>
              </Tooltip>

              {/* Dar ekranda menü açılır listeye iner. antd stilleri Tailwind
                  katmanını ezdiği için gizleme düğmeye değil kapsayıcıya uygulanır. */}
              <span className="lg:hidden">
                <Dropdown
                  trigger={["click"]}
                  placement="bottomRight"
                  menu={{
                    selectedKeys: EMLAKCI_NAV.filter((n) => aktifMi(n.href, yol)).map((n) => n.href),
                    items: EMLAKCI_NAV.map((n) => ({ key: n.href, label: n.etiket, onClick: () => router.push(n.href) })),
                  }}
                >
                  <Button type="text" shape="circle" aria-label="Menü" icon={<MenuOutlined style={{ fontSize: 15 }} />} />
                </Dropdown>
              </span>
            </>
          )}

          <Tooltip title={temaEtiketi}>
            <Button
              type="text"
              shape="circle"
              aria-label={temaEtiketi}
              onClick={() => ayarla(tema === "dark" ? "light" : "dark")}
              icon={tema === "dark" ? <SunOutlined style={{ fontSize: 15 }} /> : <MoonFilled style={{ fontSize: 14 }} />}
            />
          </Tooltip>

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
        </div>
      </div>
    </header>
  );
}
