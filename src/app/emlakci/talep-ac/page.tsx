"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Checkbox, Input } from "antd";
import { ayristir, eksikler, ORNEK_CUMLELER, type TaslakTalep } from "@/lib/ayristir";
import { useDemo } from "@/lib/demo-store";
import TalepDuzenleyici from "@/components/talep-duzenleyici";

export default function MusteriAdinaTalep() {
  const router = useRouter();
  const { message } = App.useApp();
  const { talepAc } = useDemo();

  const [metin, setMetin] = useState("");
  const [taslak, setTaslak] = useState<TaslakTalep | null>(null);
  const [kefil, setKefil] = useState(false);
  const [icNot, setIcNot] = useState("");

  const hazir = !!taslak && eksikler(taslak).length === 0 && kefil;

  function yayinla() {
    if (!taslak) return;
    talepAc(taslak, "emlakci");
    message.success("Talep yayında. Gelen teklifler panelinize düşecek.");
    router.push("/emlakci/panel");
  }

  return (
    <div className="mx-auto max-w-[760px] px-5 py-10">
      <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,40px)", margin: "0 0 8px" }}>Müşteriniz ne arıyor?</h1>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--color-muted)", margin: "0 0 24px" }}>
        Müşterinizin adı hiçbir yerde görünmez. Teklifler size gelir; müşterinize siz iletirsiniz.
        Satış olursa komisyonu teklif veren emlakçıyla bugün yaptığınız gibi paylaşırsınız.
      </p>

      <section className="panel mb-5 p-5">
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 7 }}
          value={metin}
          onChange={(e) => {
            setMetin(e.target.value);
            setTaslak(null);
          }}
          placeholder="Müşterinin cümleleriyle ya da kendi notlarınızla yazın."
          style={{ fontSize: 15.5, lineHeight: 1.6 }}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => {
              setMetin(`Müşterim ${ORNEK_CUMLELER[1]}`);
              setTaslak(null);
            }}
            style={{ fontSize: 12.5, color: "var(--color-gold)", background: "none", border: "none", padding: 0 }}
          >
            Örnek doldur
          </button>
          <Button type="primary" disabled={metin.trim().length < 10} onClick={() => setTaslak(ayristir(metin))}>
            Özetle
          </Button>
        </div>
      </section>

      {taslak && (
        <>
          <section className="panel mb-5 p-6">
            <h2 style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 14px", color: "var(--color-cream)" }}>Özet</h2>
            <TalepDuzenleyici taslak={taslak} onChange={setTaslak} />
          </section>

          <section className="panel mb-6 p-6">
            <Checkbox checked={kefil} onChange={(e) => setKefil(e.target.checked)}>
              <span style={{ fontSize: 14, color: "var(--color-cream)" }}>Müşterimin bütçesini doğruladım ve kefil oluyorum</span>
            </Checkbox>
            <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-faint)", margin: "8px 0 16px 24px" }}>
              Kefil olduğunuz talepte bütçe tutmazsa kabul oranınız düşer.
            </p>
            <Input.TextArea
              rows={2}
              value={icNot}
              onChange={(e) => setIcNot(e.target.value)}
              placeholder="Kendinize not (yalnızca siz görürsünüz): müşteri adı, görüşme tarihi…"
            />
          </section>

          <div className="flex justify-end">
            <Button type="primary" size="large" disabled={!hazir} onClick={yayinla}>Talebi yayınla</Button>
          </div>
        </>
      )}
    </div>
  );
}
