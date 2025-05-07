import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/auth/",
          "/pagamento/",
          "/usuario/",
          "/evento/criar/",
          "/perfil/",
          "/conta-existente/",
          "/termos/",
          "/privacidade/",
          "/cookies/",
          "/$",
        ],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/evento/sitemap.xml`],
  };
}
