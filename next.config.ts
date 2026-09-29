import type { NextConfig } from "next";

/**
 * GitHub Pages statik dosya servis ettigi icin tam statik export aliyoruz.
 * Site https://samisen.github.io/ortak-site/ altinda yayinlandigindan
 * basePath ve assetPrefix alt dizini isaret etmeli.
 *
 * Yerelde (npm run dev) basePath devre disi kalir; boylece
 * http://localhost:8888/ koku calismaya devam eder.
 */
const pages = process.env.GITHUB_PAGES === "true";
const altDizin = "/ortak-site";

const nextConfig: NextConfig = {
  output: "export",
  basePath: pages ? altDizin : undefined,
  assetPrefix: pages ? altDizin : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
