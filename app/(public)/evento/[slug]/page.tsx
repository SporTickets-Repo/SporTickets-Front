import EventSlugContent from "@/components/pages/event/event-slug-content";
import { EventStatus } from "@/interface/event";
import { stripHtml } from "@/utils/format";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Carregando evento | SporTickets",
    };
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://api.sportickets.com.br";
  const res = await fetch(`${apiUrl}/events/slug/${slug}`, {
    next: { revalidate: 21600 }, // 6 horas
  });

  if (!res.ok) {
    return {
      title: "Evento não encontrado | SporTickets",
      robots: { index: false, follow: false },
    };
  }

  const event = await res.json();

  if (
    !event ||
    event.status === EventStatus.DRAFT ||
    event.status === EventStatus.CANCELLED
  ) {
    return {
      title: "Evento não encontrado | SporTickets",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sportickets.com.br";
  const eventUrl = `${baseUrl}/evento/${slug}`;
  const description = stripHtml(event.description || "").slice(0, 160);
  const bannerUrl =
    event.bannerUrl || "/logos/Logo-Horizontal-para-fundo-Roxo.png";
  const eventName = event.name || "Evento";

  return {
    title: `${eventName} | SporTickets`,
    description,
    openGraph: {
      title: eventName,
      description,
      url: eventUrl,
      siteName: "SporTickets",
      images: [{ url: bannerUrl, width: 1200, height: 630 }],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: eventName,
      description,
      images: [bannerUrl],
    },
    alternates: {
      canonical: eventUrl,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  return <EventSlugContent />;
}
