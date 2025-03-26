"use client";

import EventCard from "@/components/pages/home/event-card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { EventSummary } from "@/interface/event";
import Autoplay from "embla-carousel-autoplay";

export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  );
}

interface CarouselEventsProps {
  events: EventSummary[];
  max?: number;
  dark?: boolean;
}

export function CarouselEvents({
  events,
  max = 10,
  dark = false,
}: CarouselEventsProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {events.slice(0, max).map((event, index) => (
          <CarouselItem
            key={index}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <div className="p-1">
              <EventCard event={event} dark={dark} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        variant={"ghost"}
        className="bg-transparent hover:bg-transparent "
      />
      <CarouselNext
        variant={"ghost"}
        className="bg-transparent hover:bg-transparent"
      />
    </Carousel>
  );
}
