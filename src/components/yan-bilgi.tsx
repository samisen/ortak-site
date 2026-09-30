import type { ReactNode } from "react";

/** Form sayfalarının sağ sütunu: "sonra ne olacak" türü kısa, numaralı açıklama */
export default function YanBilgi({ baslik, adimlar, altNot }: { baslik: string; adimlar: ReactNode[]; altNot?: ReactNode }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="panel p-6">
        <div className="overline mb-4">{baslik}</div>
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {adimlar.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="num flex shrink-0 items-center justify-center rounded-full"
                style={{ width: 24, height: 24, fontSize: 12, fontWeight: 600, color: "var(--color-gold-soft)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)" }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--color-muted)", paddingTop: 2 }}>{a}</span>
            </li>
          ))}
        </ol>
        {altNot && (
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--color-line)", fontSize: 12.5, lineHeight: 1.6, color: "var(--color-faint)" }}>
            {altNot}
          </div>
        )}
      </div>
    </aside>
  );
}
