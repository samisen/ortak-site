import { TALEPLER } from "@/lib/data";
import TalepDetay from "./talep-detay";

/** Statik export icin tum talep sayfalari onceden uretilir */
export function generateStaticParams() {
  return TALEPLER.map((t) => ({ id: t.id }));
}

export default async function Sayfa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TalepDetay id={id} />;
}
