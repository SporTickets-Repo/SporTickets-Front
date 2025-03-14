import EventCard from "@/components/pages/home/event-card";
import SportTypeCard from "@/components/pages/home/sport-type-card";
import { Input } from "@/components/ui/input";
import { Event } from "@/interface/event";
import { ChevronRight, SearchIcon, Volleyball } from "lucide-react";
import Image from "next/image";

// Event data from your JSON
const events: Event[] = [
  {
    id: "9d11e079-6ff1-40ef-9db5-0b6bc53ccb40",
    createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
    slug: "event-name1",
    status: "DRAFT",
    name: "Sportickets event",
    place: "Event place",
    title: "Volleyball event",
    description: "Event of the year",
    regulation: "Event regulation",
    additionalInfo: "Event additional info",
    bannerUrl:
      "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
    endDate: "2025-12-01T18:00:00.000Z",
    startDate: "2025-12-01T10:00:00.000Z",
    createdAt: "2025-02-14T15:22:12.467Z",
    updatedAt: "2025-02-14T15:22:12.467Z",
  },
  {
    id: "b0c0c9ce-2357-47eb-8249-7c42d75f8c5d",
    createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
    slug: "event-name2",
    status: "DRAFT",
    name: "Sportickets event",
    place: "Event place",
    title: "Volleyball event",
    description: "Event of the year",
    regulation: "Event regulation",
    additionalInfo: "Event additional info",
    bannerUrl: null,
    endDate: "2025-12-01T18:00:00.000Z",
    startDate: "2025-12-01T10:00:00.000Z",
    createdAt: "2025-02-14T15:22:35.618Z",
    updatedAt: "2025-02-14T15:22:35.618Z",
  },
  {
    id: "c439d51e-abf0-4c42-b563-0f73a665422c",
    createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
    slug: "event-name3",
    status: "DRAFT",
    name: "Sportickets event",
    place: "Event place",
    title: "Volleyball event",
    description: "Event of the year",
    regulation: "Event regulation",
    additionalInfo: "Event additional info",
    bannerUrl:
      "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
    endDate: "2025-12-01T18:00:00.000Z",
    startDate: "2025-12-01T10:00:00.000Z",
    createdAt: "2025-02-14T16:04:44.169Z",
    updatedAt: "2025-02-14T16:04:44.169Z",
  },
  {
    id: "73021238-2b9f-4f20-ab64-575ba44bc48f",
    createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
    slug: "event-name",
    status: "DRAFT",
    name: "Sportickets event",
    place: "Event place",
    title: "Volleyball event",
    description: "Event of the year",
    regulation: "Event regulation",
    additionalInfo: "Event additional info",
    bannerUrl:
      "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
    endDate: "2025-12-01T18:00:00.000Z",
    startDate: "2025-12-01T10:00:00.000Z",
    createdAt: "2025-02-13T21:20:18.666Z",
    updatedAt: "2025-02-14T16:20:14.871Z",
  },
];

function App() {
  return (
    <div className="min-h-screen text-white bg-black">
      <div className="flex flex-col min-h-[70vh] w-screen relative z-40">
        <div className="flex flex-1 flex-col justify-center items-center md:max-w-4xl text-black gap-2 container">
          <div className="relative w-full">
            <Input
              placeholder="Pesquisar"
              className="w-full pr-10 py-8 rounded-2xl !text-lg"
            />
            <SearchIcon
              size={24}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap w-full gap-2 justify-center">
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
        <Image
          src="/assets/backgrounds/home-header.png"
          alt="Logo"
          width={2560}
          height={852}
          className="object-cover w-screen h-auto min-h-[70vh] absolute -z-10"
          unoptimized
        />
      </div>

      {/* Weekly Trends Section */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Tendências da semana</h2>
          <button className="bg-gray-800 p-1 rounded">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>

      {/* Available Events Section */}
      <div className="container mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Eventos disponíveis</h2>
          <button className="bg-gray-800 p-1 rounded">
            <ChevronRight size={16} />
          </button>
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
          <button className="bg-gray-800 p-1 rounded">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {events.map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
