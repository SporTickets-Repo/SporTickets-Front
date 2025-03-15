"use client";
import EventCard from "@/components/pages/home/event-card";
import SportTypeCard from "@/components/pages/home/sport-type-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, SearchIcon, Volleyball } from "lucide-react";
import Image from "next/image";
import useHome from "./useHome";

function App() {
  const { events, eventsMock } = useHome();
  return (
    <div className="min-h-screen">
      <div className="flex flex-col min-h-[70vh] relative z-40 text-white bg-black pb-5 mb-5">
        <Image
          src="/assets/backgrounds/home-header.png"
          alt="Logo"
          width={2560}
          height={852}
          className="object-cover w-screen h-auto min-h-[70vh] absolute -z-10"
          unoptimized
        />
        <div className="flex flex-1 flex-col justify-center items-center md:max-w-4xl text-black gap-2 container mt-48 mb-24">
          <div className="relative w-full">
            <Input
              placeholder="Pesquisar"
              className="w-full pr-10 py-8 px-4 rounded-2xl !text-lg"
            />
            <SearchIcon
              size={24}
              className="absolute right-5 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <div className="flex flex-wrap w-full gap-2 justify-center align-center">
            <SportTypeCard
              className="w-full sm:w-[165px]"
              Icon={Volleyball}
              title="Vôlei"
            />
            <SportTypeCard
              className="w-full sm:w-[165px]"
              Icon={Volleyball}
              title="Vôlei"
            />
            <SportTypeCard
              className="w-full sm:w-[165px]"
              Icon={Volleyball}
              title="Vôlei"
            />
          </div>
        </div>
        <div className="container mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Tendências da semana</h2>
            <Button variant="tertiary" size="icon">
              <ArrowRight size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {eventsMock.map((eventsMock, index) => (
              <EventCard key={index} event={eventsMock} dark />
            ))}
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

      <div className="bg-black text-white py-10 mb-5">
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
