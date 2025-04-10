"use client";
import { CarouselEvents } from "@/components/pages/home/carrosel-events";
import { EmptyEventCard } from "@/components/pages/home/empty-events";
import { HomeSearchBar } from "@/components/pages/home/search-bar";
import { HomeSkeleton } from "@/components/pages/home/skeleton-home";
import SportTypeCard from "@/components/pages/home/sport-type-card";
import { Button } from "@/components/ui/button";
import { getEventIcon } from "@/utils/eventIcons";
import { translateEventType } from "@/utils/eventTranslations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useHome from "./useHome";

function App() {
  const {
    eventTypes,
    recentEvents,
    finishedEvents,
    upcomingEvents,
    registrationEvents,
    loading,
  } = useHome();
  const router = useRouter();
  const handleLinkSearch = () => {
    router.push("/evento/buscar");
  };

  return (
    <>
      {loading ? (
        <HomeSkeleton />
      ) : (
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
                  <Link key={index} href={`/evento/buscar?type=${type}`}>
                    <SportTypeCard
                      className="w-[165px]"
                      Icon={getEventIcon(type)}
                      title={translateEventType(type)}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-black py-4">
              <div className="container">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-md md:text-lg font-bold">
                    Tendências da semana
                  </h2>
                  <Button
                    variant="tertiary"
                    size="sm"
                    type="button"
                    onClick={() => handleLinkSearch()}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
                {upcomingEvents.length > 0 ? (
                  <CarouselEvents events={upcomingEvents} max={5} dark />
                ) : (
                  <div className="container mb-10">
                    <EmptyEventCard dark />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md md:text-lg font-bold">
                Eventos disponíveis
              </h2>
              <Button
                variant="tertiary"
                size="sm"
                type="button"
                onClick={() => handleLinkSearch()}
              >
                <ArrowRight size={16} />
              </Button>
            </div>
            {recentEvents.length > 0 ? (
              <CarouselEvents events={recentEvents} max={8} />
            ) : (
              <div className="container mb-10">
                <EmptyEventCard />
              </div>
            )}
          </div>

          <div className="container mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md md:text-lg font-bold">
                Inscrições abertas
              </h2>
              <Button
                variant="tertiary"
                size="sm"
                type="button"
                onClick={() => handleLinkSearch()}
              >
                <ArrowRight size={16} />
              </Button>
            </div>
            {registrationEvents.length > 0 ? (
              <CarouselEvents events={registrationEvents} max={4} />
            ) : (
              <div className="container mb-10">
                <EmptyEventCard />
              </div>
            )}
          </div>

          <div className="container">
            <div className="mb-6 h-[50vh] relative">
              <Image
                src="/assets/images/banner1.png"
                alt="Logo"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 w-full h-full -z-10 rounded-xl"
                unoptimized
              />
              <div className="flex flex-col justify-end items-start w-full h-full px-8 py-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 italic">
                  Pronto para jogar? Descubra eventos e garanta seu ingresso!
                </h2>
              </div>
            </div>
          </div>

          <div className="relative w-full text-white py-10 mb-5">
            <Image
              src="/assets/backgrounds/arquibancada.png"
              alt="Logo"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 w-full h-full -z-10"
              unoptimized
            />
            <div className="container flex justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-md md:text-xl font-semibold">
                  É um produtos de eventos?
                </h1>
                <p className="text-zinc-400 text-sm md:text-base">
                  Veja todas as vantagens e venefícios de criar seu evento com a
                  gente!
                </p>
              </div>
              <Link href="/sobre">
                <Button
                  variant="secondary"
                  className="text-sm md:text-sm"
                  type="button"
                  onClick={() => handleLinkSearch()}
                >
                  Sou produtor
                </Button>
              </Link>
            </div>
          </div>

          <div className="container mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-md md:text-lg font-bold">
                Eventos acontecendo e finalizados
              </h2>
              <Button variant="tertiary" size="sm">
                <ArrowRight size={16} />
              </Button>
            </div>
            {finishedEvents.length > 0 ? (
              <CarouselEvents events={finishedEvents} max={10} />
            ) : (
              <div className="container mb-10">
                <EmptyEventCard />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
