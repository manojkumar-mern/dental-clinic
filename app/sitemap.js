import { SITE_CONFIG } from "@/constants";

export default async function sitemap() {
  const routes = ["", "/about", "/treatments", "/contact", "/booking"].map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}
