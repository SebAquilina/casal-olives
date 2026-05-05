import type { MetadataRoute } from "next";
export const runtime = "edge";
const OILS = ["verde", "maturo", "riserva"];
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://casal-olives-web.pages.dev";
  const now = new Date();
  const paths = [
    "/", "/oils", "/grove", "/journal", "/tastings", "/contact",
    "/concept", "/privacy", "/terms", "/checkout",
    ...OILS.map((s) => `/oils/${s}`),
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.7,
  }));
}
