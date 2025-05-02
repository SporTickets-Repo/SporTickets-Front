import { Metadata } from "next";
import { eventService } from "@/service/event";
import { EventStatus } from "@/interface/event";
import { stripHtml } from "@/utils/format";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await eventService.getEventBySlug(params.slug);
  
  if (!event || event.status === EventStatus.DRAFT || event.status === EventStatus.CANCELLED) {
    return {
      title: "Evento não encontrado | SporTickets",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sportickets.com.br";
  const eventUrl = `${baseUrl}/evento/${params.slug}`;
  
  const description = stripHtml(event.description || "").slice(0, 160);
  const bannerUrl = event.bannerUrl || "/logos/Logo-Horizontal-para-fundo-Roxo.png";
  const eventName = event.name || "Evento";

  return {
    title: `${eventName} | SporTiddckets`,
    description: description,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: eventUrl,
      title: eventName,
      description: description,
      siteName: "SporTickets",
      images: [
        {
          url: bannerUrl,
          width: 1200,
          height: 630,
          alt: eventName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: eventName,
      description: description,
      images: [bannerUrl],
    },
    alternates: {
      canonical: eventUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
} 