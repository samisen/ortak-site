"use client";

import { LockFilled } from "@ant-design/icons";

export default function KilitliGorsel({
  adet,
  yukseklik = 180,
  etiket = "Fotoğraflar kilitli",
}: {
  adet: number;
  yukseklik?: number;
  etiket?: string;
}) {
  return (
    <div
      className="locked-media flex items-center justify-center rounded-xl"
      style={{ height: yukseklik, border: "1px solid var(--color-line)" }}
    >
      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 38,
            height: 38,
            background: "rgba(8,8,10,.6)",
            border: "1px solid var(--color-line-strong)",
          }}
        >
          <LockFilled style={{ color: "var(--color-gold)", fontSize: 14 }} />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--color-muted)" }}>{etiket}</div>
        <div className="num" style={{ fontSize: 11, color: "var(--color-faint)" }}>
          {adet} fotoğraf · konum · iletişim
        </div>
      </div>
    </div>
  );
}
