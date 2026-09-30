"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button, Modal, Segmented, Tooltip, Empty, Progress, App, Alert } from "antd";
import {
  CheckCircleFilled, CloseOutlined, PhoneFilled, StarOutlined, StarFilled,
  EnvironmentOutlined, PictureOutlined, ShopFilled, UserOutlined, ArrowLeftOutlined,
} from "@ant-design/icons";
import KilitliGorsel from "@/components/kilitli-gorsel";
import { TALEPLER, talepTeklifleri } from "@/lib/data";
import { para, butceAralik, gecenSure } from "@/lib/format";
import { useTema } from "@/lib/tema";
import type { Teklif, Talep } from "@/lib/types";

/** Alıcının kendi açık talepleri */
const BENIM_TALEPLERIM = ["TLP-4821", "TLP-4698"];

type Durum = "bekliyor" | "acildi" | "reddedildi";

export default function GelenKutusu() {
  const { message } = App.useApp();
  const taleplerim = TALEPLER.filter((t) => BENIM_TALEPLERIM.includes(t.id));

  const [secili, setSecili] = useState(BENIM_TALEPLERIM[0]);
  const [durumlar, setDurumlar] = useState<Record<string, Durum>>({});
  const [favoriler, setFavoriler] = useState<Record<string, boolean>>({});
  const [acilan, setAcilan] = useState<Teklif | null>(null);

  const talep = taleplerim.find((t) => t.id === secili)!;
  const teklifler = useMemo(
    () => talepTeklifleri(secili).slice().sort((a, b) => b.uyum - a.uyum),
    [secili]
  );

  const aktifler = teklifler.filter((t) => (durumlar[t.id] ?? "bekliyor") !== "reddedildi");

  function ac(t: Teklif) {
    setDurumlar((p) => ({ ...p, [t.id]: "acildi" }));
    setAcilan(t);
  }
  function reddet(t: Teklif) {
    setDurumlar((p) => ({ ...p, [t.id]: "reddedildi" }));
    message.info("Teklif reddedildi — satıcının jetonu iade edildi");
  }

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 no-underline" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        <ArrowLeftOutlined style={{ fontSize: 11 }} /> Ana sayfa
      </Link>

      <div className="mb-7">
        <div className="overline mb-2.5">Alıcı görünümü</div>
        <h1 className="display" style={{ fontSize: "clamp(30px,4vw,42px)", margin: 0 }}>
          Gelen teklifler
        </h1>
        <p style={{ fontSize: 14.5, color: "var(--color-muted)", margin: "10px 0 0", maxWidth: "64ch" }}>
          Zorunlu kriterlerinizi karşılamayan teklifler buraya hiç düşmez. Beğendiğinizin
          iletişimini açın; açmadığınız satıcı sizin kim olduğunuzu göremez.
        </p>
      </div>

      {/* Talep seçici */}
      <div className="mb-6">
        <Segmented
          size="large"
          value={secili}
          onChange={(v) => setSecili(v as string)}
          options={taleplerim.map((t) => ({
            value: t.id,
            label: (
              <span className="flex items-center gap-2.5 px-1 py-0.5">
                <span style={{ fontSize: 13 }}>{t.tur}</span>
                <span className="num" style={{ fontSize: 11, color: "var(--color-faint)" }}>{t.id}</span>
                <span
                  className="num rounded px-1.5"
                  style={{ fontSize: 11, background: "var(--color-gold-dim)", color: "var(--color-gold-soft)" }}
                >
                  {talepTeklifleri(t.id).length}
                </span>
              </span>
            ),
          }))}
        />
      </div>

      {/* Seçili talebin özeti */}
      <div className="panel mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4">
        <div>
          <div className="overline mb-1">Talebiniz</div>
          <div style={{ fontSize: 14, color: "var(--color-cream)", fontWeight: 500 }}>{talep.baslik}</div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-x-7 gap-y-2">
          <div>
            <div className="overline mb-1">Bütçeniz</div>
            <div className="num" style={{ fontSize: 14, color: "var(--color-gold-soft)", fontWeight: 600 }}>
              {butceAralik(talep.butceMin, talep.butceMax, talep.paraBirimi)}
            </div>
          </div>
          <div>
            <div className="overline mb-1">Gelen teklif</div>
            <div className="num" style={{ fontSize: 14, color: "var(--color-cream)", fontWeight: 600 }}>
              {teklifler.length}
            </div>
          </div>
          <Link href={`/talepler/${talep.id}`}>
            <Button size="small">Talebi düzenle</Button>
          </Link>
        </div>
      </div>

      {aktifler.length === 0 ? (
        <div className="panel flex items-center justify-center py-20">
          <Empty description={<span style={{ color: "var(--color-muted)" }}>Bu talep için aktif teklif kalmadı.</span>} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {aktifler.map((t) => (
            <TeklifKarti
              key={t.id}
              teklif={t}
              talep={talep}
              durum={durumlar[t.id] ?? "bekliyor"}
              favori={!!favoriler[t.id]}
              onFavori={() => setFavoriler((p) => ({ ...p, [t.id]: !p[t.id] }))}
              onAc={() => ac(t)}
              onReddet={() => reddet(t)}
            />
          ))}
        </div>
      )}

      {/* ---- İletişim açıldı modalı ---- */}
      <Modal open={!!acilan} onCancel={() => setAcilan(null)} footer={null} width={520} title="İletişim açıldı">
        {acilan && (
          <div className="pt-2">
            <Alert
              className="mb-5"
              type="success"
              showIcon
              style={{ background: "var(--ok-wash)", border: "1px solid var(--ok-line)" }}
              title={
                <span style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
                  Karşı tarafa da sizin iletişim bilginiz iletildi. Bundan sonrası ikinizin arasında —
                  platform araya girmiyor, komisyon almıyor.
                </span>
              }
            />

            <div className="panel-2 mb-4 p-5">
              <div className="overline mb-3">Satıcı</div>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 42, height: 42, background: "var(--color-surface-3)", border: "1px solid var(--color-line-strong)" }}
                >
                  {acilan.saticiTip === "kurumsal" ? (
                    <ShopFilled style={{ color: "var(--color-gold)" }} />
                  ) : (
                    <UserOutlined style={{ color: "var(--color-gold)" }} />
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-cream)" }}>
                    {acilan.saticiIsim ?? "Mehmet Aydın — Bireysel mülk sahibi"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-faint)" }}>
                    {acilan.saticiRozetler.join(" · ")}
                  </div>
                </div>
              </div>
              <a
                href="tel:+900000000000"
                className="flex items-center justify-center gap-2 rounded-lg py-3 no-underline"
                style={{ background: "var(--accent-wash-2)", border: "1px solid var(--accent-line-2)", color: "var(--color-gold-soft)", fontSize: 15, fontWeight: 600 }}
              >
                <PhoneFilled style={{ fontSize: 13 }} />
                <span className="num">{acilan.saticiTelefon ?? "+90 532 411 08 26"}</span>
              </a>
            </div>

            <div className="panel-2 p-5">
              <div className="overline mb-3">Artık görebilirsiniz</div>
              <div className="flex flex-col gap-2">
                {[`${acilan.fotoAdet} fotoğrafın tamamı`, "Tam adres ve ada/parsel bilgisi", "Tapu ve ekspertiz belgeleri", "Görüşme için uygun saatler"].map((s) => (
                  <div key={s} className="flex items-center gap-2.5" style={{ fontSize: 13, color: "var(--color-cream)" }}>
                    <CheckCircleFilled style={{ color: "var(--color-verified)", fontSize: 12 }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <Button type="primary" block size="large" className="mt-5" onClick={() => setAcilan(null)}>
              Tamam
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------------------------------------------------------- */

function TeklifKarti({
  teklif: t, talep, durum, favori, onFavori, onAc, onReddet,
}: {
  teklif: Teklif; talep: Talep; durum: Durum; favori: boolean;
  onFavori: () => void; onAc: () => void; onReddet: () => void;
}) {
  const { palet } = useTema();
  const acildi = durum === "acildi";
  const butceIci = t.fiyat >= talep.butceMin && t.fiyat <= talep.butceMax;

  return (
    <article
      className="panel overflow-hidden"
      style={{ borderColor: acildi ? "var(--ok-line)" : undefined }}
    >
      <div className="grid gap-5 p-5 md:grid-cols-[210px_1fr]">
        {/* Görsel */}
        <div>
          {acildi ? (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl"
              style={{ height: 180, background: "var(--color-surface-2)", border: "1px solid var(--ok-line)" }}
            >
              <PictureOutlined style={{ fontSize: 20, color: "var(--color-verified)" }} />
              <span className="num" style={{ fontSize: 12, color: "var(--color-muted)" }}>
                {t.fotoAdet} fotoğraf açıldı
              </span>
            </div>
          ) : (
            <KilitliGorsel adet={t.fotoAdet} />
          )}
          <div className="mt-3">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="overline">Uyum</span>
              <span className="num" style={{ fontSize: 12.5, color: "var(--color-gold-soft)", fontWeight: 600 }}>
                %{t.uyum}
              </span>
            </div>
            <Progress percent={t.uyum} showInfo={false} size="small" strokeColor={palet.gold} railColor={palet.surface3} />
          </div>
        </div>

        {/* İçerik */}
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded px-2 py-0.5"
              style={{ fontSize: 11, background: "var(--color-surface-3)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
            >
              {t.saticiTip === "kurumsal" ? <ShopFilled style={{ fontSize: 9 }} /> : <UserOutlined style={{ fontSize: 9 }} />}
              {acildi ? (t.saticiIsim ?? "Mehmet Aydın") : t.saticiKod}
            </span>
            {t.saticiRozetler.map((r) => (
              <span key={r} style={{ fontSize: 11, color: "var(--color-faint)" }}>{r}</span>
            ))}
            <span className="ml-auto" style={{ fontSize: 11, color: "var(--color-faint)" }}>{gecenSure(t.tarih)}</span>
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px", color: "var(--color-cream)", lineHeight: 1.4 }}>
            {t.baslik}
          </h3>

          <div className="mb-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="num display" style={{ fontSize: 23, color: "var(--color-gold-soft)" }}>
              {para(t.fiyat, t.paraBirimi)}
            </span>
            <Tooltip title={butceIci ? "Bütçe aralığınızın içinde" : "Bütçe aralığınızın dışında"}>
              <span
                className="rounded px-2 py-0.5"
                style={{
                  fontSize: 11,
                  background: butceIci ? "var(--ok-wash-2)" : "var(--warn-wash)",
                  border: `1px solid ${butceIci ? "var(--ok-line)" : "var(--warn-line)"}`,
                  color: butceIci ? "var(--color-verified)" : "var(--warn-fg)",
                }}
              >
                {butceIci ? "bütçe içinde" : "bütçe dışında"}
              </span>
            </Tooltip>
            <span className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: "var(--color-muted)" }}>
              <EnvironmentOutlined style={{ fontSize: 11, color: "var(--color-faint)" }} />
              {t.konum}
            </span>
          </div>

          <div className="mb-3.5 flex flex-wrap gap-1.5">
            {t.ozellikler.map((o) => (
              <span
                key={o}
                className="rounded-md px-2 py-1"
                style={{ fontSize: 11.5, background: "var(--color-surface-2)", border: "1px solid var(--color-line)", color: "var(--color-muted)" }}
              >
                {o}
              </span>
            ))}
          </div>

          <p
            className="mb-4 rounded-lg px-3.5 py-3"
            style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--color-cream)", background: "var(--color-surface-2)", borderLeft: "2px solid var(--color-gold-dim)", margin: "0 0 16px" }}
          >
            {t.mesaj}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {acildi ? (
              <span
                className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2"
                style={{ fontSize: 13, background: "var(--ok-wash)", border: "1px solid var(--ok-line)", color: "var(--color-verified)" }}
              >
                <CheckCircleFilled style={{ fontSize: 12 }} /> İletişim açıldı
              </span>
            ) : (
              <Button type="primary" onClick={onAc}>
                İletişimi aç
              </Button>
            )}
            <Button icon={favori ? <StarFilled style={{ color: "var(--color-gold)" }} /> : <StarOutlined />} onClick={onFavori}>
              {favori ? "Kaydedildi" : "Kaydet"}
            </Button>
            {!acildi && (
              <Tooltip title="Reddedilen tekliflerde satıcının jetonu iade edilir">
                <Button type="text" icon={<CloseOutlined />} onClick={onReddet} style={{ color: "var(--color-faint)" }}>
                  Reddet
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
