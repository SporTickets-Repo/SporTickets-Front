"use client";

import EventDescription from "@/components/pages/event/event-description";
import EventHeader from "@/components/pages/event/event-header";
import EventPolicy from "@/components/pages/event/event-policy";
import RegistrationSummary from "@/components/pages/event/registration-summary";
import { Card } from "@/components/ui/card";
import { useEvent } from "@/context/event";
import { MapPin, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function EventPage() {
  const { slug } = useParams() as { slug: string };
  const { event, loading, error, setSlug } = useEvent();

  useEffect(() => {
    setSlug(slug);
  }, [slug]);

  if (loading) return <p className="text-center">Carregando evento...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!event)
    return <p className="text-center text-gray-500">Evento não encontrado.</p>;

  return (
    <div className="container">
      <div className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          {/* Event Banner */}
          <EventHeader />
          {/* Event Details */}
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Event Title and Info */}
              <div className="mb-4">
                <h1 className="text-xl font-bold">{event.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>{event.title}</span>
                  <span className="text-gray-400">|</span>
                  <span>{event.place}</span>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{event.status}</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>
                    {event.address?.localidade}, {event.address?.uf}
                  </span>
                </div>
              </div>

              {/* Map */}
              <div className="mb-4 overflow-hidden rounded-lg border">
                <img
                  src={
                    event.bannerUrl || "/placeholder.svg?height=200&width=600"
                  }
                  alt="Event location map"
                  width={600}
                  height={200}
                  className="h-[200px] w-full object-cover"
                />
                <div className="p-3 text-xs">
                  <p className="font-medium">{event.address?.bairro}</p>
                  <p className="text-gray-600">
                    {event.address?.bairro}, {event.address?.logradouro},{" "}
                    {event.address?.cep}
                  </p>
                </div>
              </div>

              {/* Description */}
              <Card className="mb-4 p-4">
                <EventDescription />
              </Card>

              {/* Policy */}
              <Card className="p-4">
                <EventPolicy />
              </Card>
            </div>

            {/* Registration Summary */}
            <div className="lg:col-span-1">
              <RegistrationSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
