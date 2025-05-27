import { getTranslations } from "@/app/utils/translate";
import EventSlugContent from "@/components/pages/event/event-slug-content";
import EventSlugInitializer from "@/components/pages/event/event-slug-initializer";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Event, EventStatus } from "@/interface/event";
import { formatDate } from "@/utils/dateTime";
import { Metadata } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api.sportickets.com.br";
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.sportickets.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const dictionary = await getDictionary(lang);
  const t = await getTranslations(lang);

  const res = await fetch(`${apiUrl}/events/slug/${slug}`, {
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    return {
      title: `${dictionary.eventoNaoEncontrado} | SporTickets`,
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
      title: `${dictionary.eventoNaoEncontrado} | SporTickets`,
      robots: { index: false, follow: false },
    };
  }

  const eventUrl = `${baseUrl}/evento/${slug}`;
  const eventDate = event?.startDate
    ? formatDate(event.startDate)
    : dictionary.dataIndisponivel;

  const location =
    event.place || `${event.address?.street}, ${event.address?.city}`;

  const eventType = t.eventType(event.type).toLowerCase();
  const eventStatus = t.eventStatus(event.status).toLowerCase();

  const description = `${event.name} ${dictionary.ocorreraEm} ${location} ${dictionary.noDia} ${eventDate}. ${dictionary.tipo}: ${eventType}, ${dictionary.status}: ${eventStatus}.`;

  const bannerUrl =
    event.bannerUrl || "/assets/logos/Logo-Horizontal-para-fundo-Roxo.png";
  const smallImageUrl =
    event.smallImageUrl || "/assets/logos/Logo-Horizontal-para-fundo-Roxo.png";

  const eventName = event.name || dictionary.evento;

  return {
    title: `${eventName} | SporTickets`,
    description,
    openGraph: {
      title: eventName,
      description,
      url: eventUrl,
      siteName: "SporTickets",
      images: [{ url: smallImageUrl, width: 700, height: 350 }],
      locale: lang === "en" ? "en_US" : "pt_BR",
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
  params: Promise<{ slug: string; lang: Locale }>;
}) {
  const { slug, lang } = await params;
  const dictionary = await getDictionary(lang);

  const res = await fetch(`${apiUrl}/events/slug/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return <div>{dictionary.eventoNaoEncontrado}</div>;

  const event: Event = await res.json();

  if (
    event.status === EventStatus.DRAFT ||
    event.status === EventStatus.CANCELLED
  ) {
    return <div>{dictionary.eventoIndisponivel}</div>;
  }

  return (
    <>
      <EventSlugInitializer slug={slug} />
      <EventSlugContent event={event} lang={lang} />
    </>
  );
}
