import { TALEPLER } from "@/lib/data";
import TalepDetay from "./talep-detay";

/**
 * Statik export: mock taleplerin yanında, demo sırasında açılan yeni talepler
 * (T-0460…) için de sayfa üretilir. İçerik istemcide demo durumundan okunur.
 */
export function generateStaticParams() {
  const yedek = Array.from({ length: 10 }, (_, i) => ({ id: `T-${(460 + i).toString().padStart(4, "0")}` }));
  return [...TALEPLER.map((t) => ({ id: t.id })), ...yedek];
}

export default async function Sayfa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TalepDetay id={id} />;
}
