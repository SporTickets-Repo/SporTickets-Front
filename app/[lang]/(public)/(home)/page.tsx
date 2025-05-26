// app/(public)/page.tsx ou app/page.tsx
import { CarouselEvents } from "@/components/pages/home/carrosel-events";
import { EmptyEventCard } from "@/components/pages/home/empty-events";
import { HomeSearchBar } from "@/components/pages/home/search-bar";
import SportTypeCard from "@/components/pages/home/sport-type-card";
import TranslatedLink from "@/components/translated-link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { EventStatus, EventSummary } from "@/interface/event";
import { getEventIcon } from "@/utils/eventIcons";
import { translateEventType } from "@/utils/eventTranslations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://api.sportickets.com.br";

async function getEvents(): Promise<EventSummary[]> {
  const res = await fetch(`${apiUrl}/events/all?page=1&limit=50&sort=name`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];

  const events: EventSummary[] = await res.json();
  return events.filter(
    (event) =>
      event.status !== EventStatus.DRAFT &&
      event.status !== EventStatus.CANCELLED
  );
}

export default async function Home(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  const events = await getEvents();
  const now = new Date();

  const eventTypes = Array.from(new Set(events.map((e) => e.type))).sort();

  const upcomingEvents = [...events]
    .filter((event) => event.startDate && new Date(event.startDate) > now)
    .sort(
      (a, b) =>
        new Date(a.startDate ?? "").getTime() -
        new Date(b.startDate ?? "").getTime()
    )
    .slice(0, 5);

  const recentEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const registrationEvents = [...events]
    .filter((event) => event.status === EventStatus.REGISTRATION)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

  const finishedEvents = [...events]
    .filter(
      (event) =>
        event.status === EventStatus.FINISHED ||
        event.status === EventStatus.PROGRESS
    )
    .sort((a, b) => (a.status === EventStatus.PROGRESS ? -1 : 1));

  const handleLinkSearch = "/evento/buscar";

  return (
    <div className="min-h-screen">
      <div className="flex flex-col min-h-[90vh] relative z-40 text-white bg-black mb-5">
        <Image
          src="/assets/backgrounds/home-header.png"
          alt="Banner"
          fill
          className="object-cover w-full h-full absolute -z-10"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black -z-10" />
        <div className="flex flex-1 flex-col justify-center items-center md:max-w-4xl text-black gap-2 container mt-48 mb-24">
          <div className="relative w-full">
            <HomeSearchBar />
          </div>
          <div className="flex flex-wrap w-full gap-2 justify-center align-center">
            {eventTypes.map((type, index) => (
              <TranslatedLink key={index} href={`/evento/buscar?type=${type}`}>
                <SportTypeCard
                  className="w-[165px]"
                  Icon={getEventIcon(type)}
                  title={translateEventType(type)}
                />
              </TranslatedLink>
            ))}
          </div>
        </div>

        {/* Destaques */}
        <div className="bg-black py-4">
          <div className="container">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md md:text-lg font-bold">
                Tendências da semana
              </h2>
              <Button variant="tertiary" size="sm" asChild>
                <TranslatedLink href={handleLinkSearch}>
                  <ArrowRight size={16} />
                </TranslatedLink>
              </Button>
            </div>
            {upcomingEvents.length > 0 ? (
              <CarouselEvents events={upcomingEvents} max={5} dark />
            ) : (
              <EmptyEventCard dark />
            )}
          </div>
        </div>
      </div>

      {/* Recentes */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-lg font-bold">
            {dictionary.eventosDisponiveis}
          </h2>
          <Button variant="tertiary" size="sm" asChild>
            <TranslatedLink href={handleLinkSearch}>
              <ArrowRight size={16} />
            </TranslatedLink>
          </Button>
        </div>
        {recentEvents.length > 0 ? (
          <CarouselEvents events={recentEvents} max={8} />
        ) : (
          <EmptyEventCard />
        )}
      </div>

      {/* Inscrições abertas */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-lg font-bold">Inscrições abertas</h2>
          <Button variant="tertiary" size="sm" asChild>
            <TranslatedLink href={handleLinkSearch}>
              <ArrowRight size={16} />
            </TranslatedLink>
          </Button>
        </div>
        {registrationEvents.length > 0 ? (
          <CarouselEvents events={registrationEvents} max={4} />
        ) : (
          <EmptyEventCard />
        )}
      </div>

      {/* Banner intermediário */}
      <div className="container">
        <div className="mb-6 h-40 md:h-[50vh] relative">
          <Image
            src="/assets/images/banner1.png"
            alt="Banner"
            fill
            className="absolute inset-0 w-full h-full -z-10 rounded-xl object-cover"
            unoptimized
          />
          <div className="flex flex-col justify-end items-start w-full h-full px-8 py-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 italic">
              Pronto para jogar? Descubra eventos e garanta seu ingresso!
            </h2>
          </div>
        </div>
      </div>

      {/* Seção produtor */}
      <div className="relative w-full text-white py-10 mb-5">
        <Image
          src="/assets/backgrounds/arquibancada.png"
          alt="Logo"
          fill
          className="absolute inset-0 w-full h-full -z-10 object-cover"
          unoptimized
        />
        <div className="container flex justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-md md:text-xl font-semibold">
              É um produtor de eventos?
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Veja todas as vantagens e benefícios de criar seu evento com a
              gente!
            </p>
          </div>
          <TranslatedLink href="/sobre">
            <Button variant="secondary" className="text-sm md:text-sm">
              Sou produtor
            </Button>
          </TranslatedLink>
        </div>
      </div>

      {/* Finalizados */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-lg font-bold">
            Eventos acontecendo ou finalizados
          </h2>
          <Button variant="tertiary" size="sm" asChild>
            <TranslatedLink href={handleLinkSearch}>
              <ArrowRight size={16} />
            </TranslatedLink>
          </Button>
        </div>
        {finishedEvents.length > 0 ? (
          <CarouselEvents events={finishedEvents} max={10} />
        ) : (
          <EmptyEventCard />
        )}
      </div>
    </div>
  );
}
