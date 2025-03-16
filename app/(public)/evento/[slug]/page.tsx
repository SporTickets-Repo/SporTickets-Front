"use client";

import EventDescription from "@/components/pages/event/event-description";
import EventHeader from "@/components/pages/event/event-header";
import EventLocation from "@/components/pages/event/event-location";
import EventPolicy from "@/components/pages/event/event-policy";
import EventRanking from "@/components/pages/event/event-rank";
import RegistrationSummary from "@/components/pages/event/registration-summary";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/context/event";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { MapPin } from "lucide-react";
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
          <EventHeader alt={event.name} image={event.bannerUrl || ""} />
          {/* Event Details */}
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Event Title and Info */}
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="mb-2 w-full align-center justify-center text-sm font-light"
                >
                  {formatDateWithoutYear(event.startDate)} •{" "}
                  {formatHour(event.startDate)}
                </Badge>
                <h1 className="text-2xl font-bold italic">{event.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>{event.title}</span>
                  <span className="text-gray-400">|</span>
                  <span>{event.place}</span>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center gap-1">
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

              <EventLocation address={event.address} place={event.place} />

              <EventDescription description={event.description} />

              <EventPolicy regulation={event.regulation} />

              <EventRanking />
            </div>

            {/* Registration Summary */}
            <div className="lg:col-span-1">
              <RegistrationSummary ticketTypes={event.ticketTypes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
