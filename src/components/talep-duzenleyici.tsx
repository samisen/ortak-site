"use client";

import { useState } from "react";
import { Button, InputNumber, Select, Switch, Tag, Tooltip } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import type { TaslakTalep } from "@/lib/ayristir";
import { eksikler } from "@/lib/ayristir";
import type { EvTuru, KriterAnahtari, Kriterler } from "@/lib/types";
import { BOLGELER, SEMTLER } from "@/lib/bolgeler";
import { kriterEtiketleri, kriterKaldir } from "@/lib/kriterler";
import { butceAralik } from "@/lib/format";

const TURLER: EvTuru[] = ["Taş ev", "Villa", "Müstakil ev", "Daire", "Arsa"];
const SEMT_SECENEKLERI = BOLGELER.map((b) => ({ label: b, options: SEMTLER[b].map((s) => ({ label: s, value: s })) }));

const MN = 1_000_000;

function Alan({ etiket, children }: { etiket: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{etiket}</span>
      {children}
    </label>
  );
}

export default function TalepDuzenleyici({
  taslak,
  onChange,
}: {
  taslak: TaslakTalep;
  onChange: (t: TaslakTalep) => void;
}) {
  const eksik = eksikler(taslak);
  const [acik, setAcik] = useState(false);
  const duzenle = acik || eksik.length > 0;

  const k = taslak.kriterler;
  const setK = (y: Partial<Kriterler>) => onChange({ ...taslak, kriterler: { ...k, ...y } });

  function esnekCevir(a: KriterAnahtari) {
    const esnek = taslak.esnek.includes(a) ? taslak.esnek.filter((x) => x !== a) : [...taslak.esnek, a];
    onChange({ ...taslak, esnek });
  }
  function kaldir(a: KriterAnahtari) {
    onChange({ ...taslak, kriterler: kriterKaldir(k, a), esnek: taslak.esnek.filter((x) => x !== a) });
  }

  const etiketler = kriterEtiketleri(k);

  return (
    <div>
      {/* --- Çipler: tıklayınca şart ↔ esnek --- */}
      <div className="mb-3 flex flex-wrap gap-2">
        {etiketler.map((e) => {
          const esnek = taslak.esnek.includes(e.anahtar);
          return (
            <Tooltip key={e.anahtar} title={esnek ? "Esnek: farkı baştan söyleyen teklifler gelebilir. Şart yapmak için tıklayın." : "Şart. Esneyebilirseniz tıklayın."}>
              <span
                role="button"
                tabIndex={0}
                onClick={() => esnekCevir(e.anahtar)}
                onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && esnekCevir(e.anahtar)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg select-none"
                style={{
                  fontSize: 13.5,
                  padding: "6px 8px 6px 12px",
                  color: esnek ? "var(--color-muted)" : "var(--color-cream)",
                  background: esnek ? "transparent" : "var(--color-surface-2)",
                  border: `1px ${esnek ? "dashed" : "solid"} var(--color-line-strong)`,
                }}
              >
                {e.etiket}
                {esnek && <span style={{ fontSize: 11.5, color: "var(--color-faint)" }}>esnek</span>}
                <span
                  role="button"
                  aria-label={`${e.etiket} kriterini kaldır`}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    kaldir(e.anahtar);
                  }}
                  className="inline-flex items-center justify-center rounded"
                  style={{ width: 18, height: 18, color: "var(--color-faint)" }}
                >
                  <CloseOutlined style={{ fontSize: 10 }} />
                </span>
              </span>
            </Tooltip>
          );
        })}
        {taslak.butceMax ? (
          <span
            className="num inline-flex items-center rounded-lg"
            style={{ fontSize: 13.5, padding: "6px 12px", color: "var(--color-gold-soft)", background: "var(--accent-wash)", border: "1px solid var(--accent-line)", fontWeight: 500 }}
          >
            {butceAralik(taslak.butceMin ?? taslak.butceMax, taslak.butceMax)}
            {taslak.pesin && " · peşin"}
          </span>
        ) : null}
      </div>

      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span style={{ fontSize: 12, color: "var(--color-faint)" }}>
          Çipe tıklayarak şart ya da esnek yapabilirsiniz.
        </span>
        {eksik.length === 0 && (
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => setAcik((a) => !a)} style={{ paddingInline: 0 }}>
            {acik ? "Kapat" : "Ayrıntıları düzenle"}
          </Button>
        )}
      </div>

      {/* --- Eksik ya da düzenlenmek istenen alanlar --- */}
      {duzenle && (
        <div className="mt-4 rounded-xl p-4" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}>
          {eksik.length > 0 && (
            <div className="mb-3" style={{ fontSize: 13, color: "var(--color-cream)" }}>
              Şunları anlayamadık: <strong style={{ fontWeight: 600 }}>{eksik.join(", ")}</strong>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {(acik || eksik.includes("konum")) && (
              <Alan etiket="Konum">
                <Select mode="multiple" value={k.semtler} onChange={(v) => setK({ semtler: v })} options={SEMT_SECENEKLERI} placeholder="Semt seçin" maxTagCount={3} />
              </Alan>
            )}
            {(acik || eksik.includes("tür")) && (
              <Alan etiket="Tür">
                <Select mode="multiple" value={k.turler} onChange={(v) => setK({ turler: v })} options={TURLER.map((t) => ({ label: t, value: t }))} placeholder="Tür seçin" />
              </Alan>
            )}
            {(acik || eksik.includes("bütçe")) && (
              <Alan etiket="Bütçe (milyon ₺)">
                <div className="flex items-center gap-2">
                  <InputNumber className="w-full" min={1} value={taslak.butceMin ? taslak.butceMin / MN : undefined} placeholder="en az" onChange={(v) => onChange({ ...taslak, butceMin: v ? v * MN : undefined })} />
                  <span style={{ color: "var(--color-faint)" }}>–</span>
                  <InputNumber className="w-full" min={1} value={taslak.butceMax ? taslak.butceMax / MN : undefined} placeholder="en fazla" onChange={(v) => onChange({ ...taslak, butceMax: v ? v * MN : undefined })} />
                </div>
              </Alan>
            )}
            {acik && (
              <>
                <Alan etiket="Peşin">
                  <div><Switch checked={taslak.pesin} onChange={(v) => onChange({ ...taslak, pesin: v })} /></div>
                </Alan>
                <Alan etiket="En az oda">
                  <InputNumber className="w-full" min={1} max={12} value={k.minOda} onChange={(v) => setK({ minOda: v ?? undefined })} />
                </Alan>
                <Alan etiket="En az kapalı alan (m²)">
                  <InputNumber className="w-full" min={50} step={10} value={k.minAlan} onChange={(v) => setK({ minAlan: v ?? undefined })} />
                </Alan>
                <Alan etiket="En az arsa (m²)">
                  <InputNumber className="w-full" min={100} step={100} value={k.minArsa} onChange={(v) => setK({ minArsa: v ?? undefined })} />
                </Alan>
                <Alan etiket="Denize en fazla (m)">
                  <InputNumber className="w-full" min={0} step={50} value={k.maxDeniz} onChange={(v) => setK({ maxDeniz: v ?? undefined })} />
                </Alan>
                <div className="sm:col-span-2">
                  <Alan etiket="Olmazsa olmazlar">
                    <div className="flex flex-wrap gap-2">
                      {([["havuz", "Havuz"], ["bahce", "Bahçe"], ["yilBoyu", "Kışın oturulabilir"]] as const).map(([a, e]) => (
                        <Tag.CheckableTag key={a} checked={!!k[a]} onChange={(c) => setK({ [a]: c || undefined })} style={{ fontSize: 13, padding: "4px 12px" }}>
                          {e}
                        </Tag.CheckableTag>
                      ))}
                    </div>
                  </Alan>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
