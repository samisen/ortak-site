"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Checkbox, Input } from "antd";
import { ayristir, eksikler, ORNEK_CUMLELER, type TaslakTalep } from "@/lib/ayristir";
import { useDemo } from "@/lib/demo-store";
import TalepDuzenleyici from "@/components/talep-duzenleyici";
import Kap from "@/components/kap";
import YanBilgi from "@/components/yan-bilgi";

export default function MusteriAdinaTalep() {
  const router = useRouter();
  const { message } = App.useApp();
  const { talepAc } = useDemo();

  const [metin, setMetin] = useState("");
  const [taslak, setTaslak] = useState<TaslakTalep | null>(null);
  const [kefil, setKefil] = useState(false);
  const [icNot, setIcNot] = useState("");

  const hazir = !!taslak && eksikler(taslak).length === 0 && kefil;

  function metniDegistir(v: string) {
    setMetin(v);
    setTaslak(null);
  }

  function yayinla() {
    if (!taslak) return;
    talepAc(taslak, "emlakci");
    message.success("Talep yayında. Gelen teklifler panelinize düşecek.");
    router.push("/emlakci/panel");
  }

  return (
    <Kap className="py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,40px)", margin: "0 0 8px" }}>Müşteriniz ne arıyor?</h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--color-muted)", margin: "0 0 24px" }}>
            Müşterinizin cümleleriyle ya da kendi notlarınızla yazın; özetini biz çıkaralım.
          </p>

          <section className="panel mb-5 p-5">
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 7 }}
              value={metin}
              onChange={(e) => metniDegistir(e.target.value)}
              placeholder="Örn. Müşterim Dalyan'da denize en fazla 200 metre, havuzlu, 5 odalı villa arıyor. 70 milyon civarı."
              style={{ fontSize: 15.5, lineHeight: 1.6 }}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <Button type="link" size="small" style={{ paddingInline: 0 }} onClick={() => metniDegistir(`Müşterim ${ORNEK_CUMLELER[1]}`)}>
                Örnek doldur
              </Button>
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

        <YanBilgi
          baslik="Nasıl işler"
          adimlar={[
            "Müşterinizin adı hiçbir yerde görünmez; talep sizin kodunuzla yayınlanır.",
            "Portföyünde uyan mülk olan en fazla üç emlakçı teklif verir. Teklifler size gelir, müşterinize siz iletirsiniz.",
            "Müşteriniz ilgilenirse teklif veren emlakçıyla karşılıklı iletişiminiz açılır.",
            "Satış olursa komisyonu bugün yaptığınız gibi aranızda paylaşırsınız. Platform komisyon almaz.",
          ]}
          altNot="Talep açmak ücretsiz. Bağlantı ücretini yalnızca teklif veren taraf öder."
        />
      </div>
    </Kap>
  );
}
