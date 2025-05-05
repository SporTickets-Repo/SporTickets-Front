import { EventStatus } from "@/interface/event";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.sportickets.com.br";

  try {
    const res = await fetch(
      `${apiUrl}/events/all?page=1&limit=1000&sort=name`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Erro ao buscar eventos: ${res.statusText}`);
    }

    const events: any[] = await res.json();

    const publicEvents = events.filter(
      (event) =>
        event.status !== EventStatus.DRAFT &&
        event.status !== EventStatus.CANCELLED
    );

    return publicEvents.map((event) => ({
      url: `${baseUrl}/evento/${event.slug}`,
      lastModified: new Date(event.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }));
  } catch (error) {
    console.error("Erro ao gerar sitemap de eventos:", error);
    return [];
  }
}
