"use client";
import EventCard from "@/components/pages/home/event-card";
import { HomeSearchBar } from "@/components/pages/home/search-bar";
import SportTypeCard from "@/components/pages/home/sport-type-card";
import { Button } from "@/components/ui/button";
import { getEventIcon } from "@/utils/eventIcons";
import { translateEventType } from "@/utils/eventTranslations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useHome from "./useHome";

function App() {
  const { events, eventsMock, eventTypes } = useHome();

  return (
    <div className="min-h-screen">
      <div className="flex flex-col min-h-[70vh] relative z-40 text-white bg-black mb-5">
        <Image
          src="/assets/backgrounds/home-header.png"
          alt="Logo"
          fill
          className="object-cover w-screen h-auto min-h-[70vh] absolute -z-10"
          unoptimized
        />
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
              <h2 className="text-lg font-bold">Tendências da semana</h2>
              <Button variant="tertiary" size="icon">
                <ArrowRight size={16} />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {eventsMock.map((eventsMock, index) => (
                <EventCard key={index} event={eventsMock} dark />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Events Section */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Eventos disponíveis</h2>
          <Button variant="tertiary" size="icon">
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>

      {/* Events Near You Section */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Eventos perto de você</h2>
          <Button variant="tertiary" size="icon">
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {eventsMock.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
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
            <h2 className="text-2xl font-bold text-white mb-4 italic">
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
        <div className="container flex justify-between items-center ">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold">É um produtos de eventos?</h1>
            <p className="text-zinc-400">
              Veja todas as vantagens e venefícios de criar seu evento com a
              gente!
            </p>
          </div>
          <Button variant="secondary">Sou produtor</Button>
        </div>
      </div>

      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Eventos perto de você</h2>
          <Button variant="tertiary" size="icon">
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {eventsMock.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
