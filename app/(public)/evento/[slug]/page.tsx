import EventSlugContent from "@/components/pages/event/event-slug-content";
import EventSlugInitializer from "@/components/pages/event/event-slug-initializer";
import { Event, EventStatus } from "@/interface/event";
import { formatDate, formatDateWithoutYear } from "@/utils/dateTime";
import {
  translateEventStatus,
  translateEventType,
} from "@/utils/eventTranslations";
import { Metadata } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api.sportickets.com.br";
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const res = await fetch(`${apiUrl}/events/slug/${slug}`, {
    next: { revalidate: 21600 }, // cache por 6 horas
  });

  if (!res.ok) {
    return {
      title: "Evento não encontrado | SporTickets",
      robots: { index: false, follow: false },
    };
  }

  const event: Event = await res.json();

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

  const eventUrl = `${baseUrl}/evento/${slug}`;

  formatDateWithoutYear;
  const eventDate = event?.startDate
    ? formatDate(event.startDate)
    : "data não disponível";

  const location =
    event.place || `${event.address?.street}, ${event.address?.city}`;

  const eventType = translateEventType(event.type).toLowerCase();
  const eventStatus = translateEventStatus(event.status).toLowerCase();

  const description = `${event.name} acontecerá em ${location} no dia ${eventDate}. Tipo: ${eventType}, status: ${eventStatus}.`;

  const bannerUrl =
    event.bannerUrl || "/assets/logos/Logo-Horizontal-para-fundo-Roxo.png";
  const smallImageUrl =
    event.smallImageUrl || "/assets/logos/Logo-Horizontal-para-fundo-Roxo.png";

  const eventName = event.name || "Evento";

  return {
    title: `${eventName} | SporTickets`,
    description,
    openGraph: {
      title: eventName,
      description,
      url: eventUrl,
      siteName: "SporTickets",
      images: [
        { url: smallImageUrl, width: 700, height: 350 },
        // { url: bannerUrl, width: 1268, height: 464 },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: eventName,
      description,
      images: [bannerUrl, smallImageUrl],
    },
    alternates: {
      canonical: eventUrl,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${apiUrl}/events/slug/${slug}`, {
    next: { revalidate: 0 }, // cache por 5 minutos
  });

  if (!res.ok) return <div>Evento não encontrado</div>;

  const event: Event = await res.json();

  if (
    event.status === EventStatus.DRAFT ||
    event.status === EventStatus.CANCELLED
  ) {
    return <div>Evento indisponível</div>;
  }

  return (
    <>
      <EventSlugInitializer slug={slug} />
      <EventSlugContent event={event} />;
    </>
  );
}
