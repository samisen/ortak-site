import type { ReactNode } from "react";

/**
 * Sayfa kapsayıcısı. Header dahil tüm sayfalar bunu kullanır; böylece içerik
 * header'daki logo ve düğmelerle aynı sol/sağ çizgiye oturur.
 * Genişliği değiştirmek gerekirse yalnızca burayı değiştirin.
 */
export const KAP = "mx-auto w-full max-w-[1200px] px-5 md:px-8";

export default function Kap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${KAP} ${className}`}>{children}</div>;
}
