"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Tooltip } from "antd";
import { ArrowRightOutlined, AudioOutlined } from "@ant-design/icons";
import { ORNEK_CUMLELER } from "@/lib/ayristir";

export default function AliciAnaSayfa() {
  const router = useRouter();
  const [metin, setMetin] = useState("");
  const [dinliyor, setDinliyor] = useState(false);

  function ilet(m = metin) {
    if (m.trim().length < 10) return;
    router.push(`/talep/onay?q=${encodeURIComponent(m.trim())}`);
  }

  /** Demo: ses kaydı yerine örnek bir cümleyi "yazıya döker" */
  function sesliAnlat() {
    setDinliyor(true);
    setTimeout(() => {
      setMetin(ORNEK_CUMLELER[0]);
      setDinliyor(false);
    }, 1400);
  }

  return (
    <div className="glow grid-tex relative flex flex-col" style={{ minHeight: "calc(100dvh - 64px)" }}>
      <div className="relative z-10 mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-5 pb-24 pt-16">
        <div className="overline mb-4 text-center">Çeşme · Alaçatı · Urla</div>
        <h1 className="display mb-10 text-center" style={{ fontSize: "clamp(40px, 7vw, 64px)", margin: "0 0 40px" }}>
          Ne arıyorsunuz?
        </h1>

        <div
          className="rounded-2xl p-2"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-line-strong)", boxShadow: "var(--shadow-panel)" }}
        >
          <Input.TextArea
            variant="borderless"
            autoSize={{ minRows: 2, maxRows: 6 }}
            value={dinliyor ? "" : metin}
            placeholder={dinliyor ? "Dinliyorum…" : "Kendi cümlelerinizle anlatın: nerede, nasıl bir ev, bütçeniz."}
            onChange={(e) => setMetin(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                ilet();
              }
            }}
            style={{ fontSize: 17, lineHeight: 1.6, padding: "12px 14px" }}
          />
          <div className="flex items-center justify-between gap-2 px-2 pb-1">
            <Tooltip title="Sesli anlatın (demo)">
              <Button
                type="text"
                shape="circle"
                aria-label="Sesli anlat"
                onClick={sesliAnlat}
                icon={<AudioOutlined className={dinliyor ? "pulse-dot" : undefined} style={{ fontSize: 17, color: dinliyor ? "var(--color-gold)" : "var(--color-muted)" }} />}
              />
            </Tooltip>
            <Button type="primary" size="large" disabled={metin.trim().length < 10} onClick={() => ilet()} icon={<ArrowRightOutlined />} iconPlacement="end">
              Devam
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {ORNEK_CUMLELER.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setMetin(o)}
              className="cursor-pointer rounded-lg px-3 py-2 text-left"
              style={{ fontSize: 13, color: "var(--color-muted)", background: "transparent", border: "1px solid var(--color-line)" }}
            >
              {o}
            </button>
          ))}
        </div>

        <p className="mt-10 text-center" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--color-muted)", margin: "40px 0 0" }}>
          Adınız görünmez. Bölgedeki doğrulanmış emlakçılar size en fazla üç teklif getirir;
          <br className="hidden sm:inline" /> iletişimi yalnızca siz açarsınız.
        </p>
      </div>

      <div className="relative z-10 pb-8 text-center" style={{ fontSize: 13, color: "var(--color-faint)" }}>
        Emlakçı mısınız?{" "}
        <Link href="/emlakci" style={{ color: "var(--color-gold)" }}>
          Talepleri görün
        </Link>
      </div>
    </div>
  );
}
