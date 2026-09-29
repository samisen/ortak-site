"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Input } from "antd";
import { LockFilled, WarningOutlined } from "@ant-design/icons";
import { useKapi } from "@/lib/gate";

function Logo({ boyut = 26 }: { boyut?: number }) {
  return (
    <div className="display" style={{ fontSize: boyut }}>
      <span style={{ color: "var(--color-cream)" }}>arayan</span>
      <span style={{ color: "var(--color-gold)" }}>indan</span>
    </div>
  );
}

/**
 * Kok sablonda @if yerine bu sarmalayici kullaniliyor: kapali oldugu surece
 * children hic render edilmiyor, dolayisiyla statik export ciktisinda da
 * sayfa icerigi yer almiyor. Route guard'da olabilecek "unutulan rota"
 * sorunu burada yapisal olarak yok.
 */
export default function GateKapisi({ children }: { children: ReactNode }) {
  const { acik, kontrolEdiliyor, kullanilamaz, hazir, ac } = useKapi();
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState(false);

  // Ilk localStorage okumasi bitene kadar sade bir perde: boylece daha once
  // giris yapmis kullaniciya sifre formu bir an icin gorunup kaybolmuyor.
  if (!hazir) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: "100dvh" }}>
        <div style={{ opacity: 0.25 }}>
          <Logo />
        </div>
      </div>
    );
  }

  if (acik) return <>{children}</>;

  async function gonder(e?: FormEvent) {
    e?.preventDefault();
    if (!sifre || kontrolEdiliyor) return;
    const dogru = await ac(sifre);
    if (!dogru) {
      setHata(true);
      setSifre("");
    }
  }

  return (
    <div
      className="glow grid-tex relative flex items-center justify-center px-5"
      style={{ minHeight: "100dvh" }}
    >
      <div className="relative z-10 w-full" style={{ maxWidth: 380 }}>
        <div className="mb-8 text-center">
          <Logo boyut={30} />
          <div className="overline mt-3">Kapali erisim</div>
        </div>

        <div className="panel p-7">
          <div
            className="mx-auto mb-5 flex items-center justify-center rounded-full"
            style={{
              width: 44,
              height: 44,
              background: "rgba(200,163,74,.09)",
              border: "1px solid rgba(200,163,74,.24)",
            }}
          >
            <LockFilled style={{ color: "var(--color-gold)", fontSize: 16 }} />
          </div>

          <p
            className="mb-6 text-center"
            style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--color-muted)", margin: "0 0 24px" }}
          >
            Bu prototip henuz herkese acik degil. Devam etmek icin erisim
            sifresini girin.
          </p>

          {kullanilamaz ? (
            <div
              className="flex items-start gap-2.5 rounded-lg px-3.5 py-3"
              style={{
                background: "rgba(196,112,63,.08)",
                border: "1px solid rgba(196,112,63,.28)",
              }}
            >
              <WarningOutlined style={{ color: "#D98C5A", fontSize: 14, marginTop: 2 }} />
              <span style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)" }}>
                Tarayici sifreleme API&apos;si kullanilamiyor. Siteyi{" "}
                <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>https</strong> veya{" "}
                <strong style={{ color: "var(--color-cream)", fontWeight: 500 }}>localhost</strong>{" "}
                uzerinden acin — LAN IP adresiyle (http://192.168…) calismaz.
              </span>
            </div>
          ) : (
            <form onSubmit={gonder}>
              <Input.Password
                size="large"
                autoFocus
                value={sifre}
                placeholder="Erisim sifresi"
                status={hata ? "error" : undefined}
                onChange={(e) => {
                  setSifre(e.target.value);
                  if (hata) setHata(false);
                }}
                onPressEnter={gonder}
              />

              <div style={{ minHeight: 22, paddingTop: 8 }}>
                {hata && (
                  <span style={{ fontSize: 12.5, color: "#C0553F" }}>
                    Sifre hatali. Tekrar deneyin.
                  </span>
                )}
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={kontrolEdiliyor}
                disabled={!sifre}
                style={{ height: 46, marginTop: 4 }}
              >
                {kontrolEdiliyor ? "Dogrulaniyor" : "Giris yap"}
              </Button>
            </form>
          )}
        </div>

        <p
          className="mt-6 text-center"
          style={{ fontSize: 11.5, lineHeight: 1.6, color: "var(--color-faint)", margin: "24px 0 0" }}
        >
          Sifreyi bilmiyorsaniz proje ekibinden isteyin.
        </p>
      </div>
    </div>
  );
}
