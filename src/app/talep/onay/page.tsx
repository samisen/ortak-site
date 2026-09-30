"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { App, Button, Radio, Upload } from "antd";
import { ArrowLeftOutlined, BankOutlined, CheckCircleFilled, TeamOutlined, UploadOutlined } from "@ant-design/icons";
import { ayristir, eksikler, type TaslakTalep } from "@/lib/ayristir";
import { useDemo } from "@/lib/demo-store";
import TalepDuzenleyici from "@/components/talep-duzenleyici";

function Onay() {
  const q = useSearchParams().get("q") ?? "";
  const router = useRouter();
  const { message } = App.useApp();
  const { talepAc } = useDemo();

  const ilk = useMemo(() => ayristir(q), [q]);
  const [taslak, setTaslak] = useState<TaslakTalep>(ilk);
  const [yol, setYol] = useState<"banka" | "emlakci">("banka");
  const [belge, setBelge] = useState(false);

  const eksik = eksikler(taslak);
  const hazir = eksik.length === 0 && (yol === "emlakci" || belge);

  function ilet() {
    talepAc(taslak, "alici", yol === "banka" ? "banka" : "kefil");
    message.success(yol === "banka" ? "Talebiniz bölgedeki emlakçılara iletildi" : "Talebiniz iletildi; emlakçınız bütçenize kefil olacak");
    router.push("/hesabim");
  }

  if (!q) {
    return (
      <div className="py-24 text-center" style={{ color: "var(--color-muted)" }}>
        Önce ne aradığınızı yazın. <Link href="/" style={{ color: "var(--color-gold)" }}>Başa dön</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Değiştir
      </Link>

      <h1 className="display" style={{ fontSize: "clamp(30px,5vw,40px)", margin: "0 0 10px" }}>Doğru anladık mı?</h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 28px" }}>“{taslak.cumle}”</p>

      <section className="panel mb-5 p-6">
        <TalepDuzenleyici taslak={taslak} onChange={setTaslak} />
      </section>

      <section className="panel mb-6 p-6">
        <h2 style={{ fontSize: 15.5, fontWeight: 600, margin: "0 0 6px", color: "var(--color-cream)" }}>Bütçenizi nasıl doğrulayalım?</h2>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--color-muted)", margin: "0 0 16px" }}>
          Emlakçılar yalnızca doğrulanmış taleplere teklif verir. Belgeniz kimseyle paylaşılmaz; doğrulandıktan sonra silinir.
        </p>

        <Radio.Group value={yol} onChange={(e) => setYol(e.target.value)} className="flex w-full flex-col gap-2.5">
          <label
            className="flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5"
            style={{ background: yol === "banka" ? "var(--accent-wash)" : "var(--color-surface-2)", border: `1px solid ${yol === "banka" ? "var(--accent-line)" : "var(--color-line)"}` }}
          >
            <Radio value="banka" style={{ marginTop: 2 }} />
            <div className="flex-1">
              <div className="flex items-center gap-2" style={{ fontSize: 14, fontWeight: 500, color: "var(--color-cream)" }}>
                <BankOutlined style={{ color: "var(--color-gold)" }} /> Banka referans mektubu
              </div>
              {yol === "banka" && (
                <div className="mt-3">
                  {belge ? (
                    <span className="num inline-flex items-center gap-2" style={{ fontSize: 13, color: "var(--color-verified)" }}>
                      <CheckCircleFilled /> referans-mektubu.pdf alındı
                    </span>
                  ) : (
                    <Upload beforeUpload={() => { setBelge(true); return false; }} showUploadList={false}>
                      <Button icon={<UploadOutlined />}>Belge yükle</Button>
                    </Upload>
                  )}
                </div>
              )}
            </div>
          </label>

          <label
            className="flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3.5"
            style={{ background: yol === "emlakci" ? "var(--accent-wash)" : "var(--color-surface-2)", border: `1px solid ${yol === "emlakci" ? "var(--accent-line)" : "var(--color-line)"}` }}
          >
            <Radio value="emlakci" style={{ marginTop: 2 }} />
            <div className="flex-1">
              <div className="flex items-center gap-2" style={{ fontSize: 14, fontWeight: 500, color: "var(--color-cream)" }}>
                <TeamOutlined style={{ color: "var(--color-gold)" }} /> Çalıştığım bir emlakçı var
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--color-muted)", marginTop: 4 }}>
                Talebi sizin adınıza o açar ve bütçenize kefil olur. Gelen teklifler önce ona düşer.
              </div>
            </div>
          </label>
        </Radio.Group>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span style={{ fontSize: 12.5, color: "var(--color-faint)" }}>
          {eksik.length ? `Eksik: ${eksik.join(", ")}` : yol === "banka" && !belge ? "Devam etmek için belgeyi yükleyin" : "Talebiniz 90 gün açık kalır"}
        </span>
        <Button type="primary" size="large" disabled={!hazir} onClick={ilet}>
          Talebi ilet
        </Button>
      </div>

      <p className="mt-8" style={{ fontSize: 11.5, color: "var(--color-faint)" }}>
        Prototip: cümle kural tabanlı ayrıştırılıyor. Gerçek üründe bunu bir yapay zekâ modeli yapacak.
      </p>
    </div>
  );
}

export default function OnaySayfasi() {
  return (
    <Suspense fallback={null}>
      <Onay />
    </Suspense>
  );
}
