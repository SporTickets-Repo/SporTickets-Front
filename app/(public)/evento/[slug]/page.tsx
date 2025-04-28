"use client";

import EventAditionalInfo from "@/components/pages/event/event-aditional-info";
import EventBracket from "@/components/pages/event/event-bracket";
import EventDescription from "@/components/pages/event/event-description";
import EventHeader from "@/components/pages/event/event-header";
import EventLocation from "@/components/pages/event/event-location";
import EventPolicy from "@/components/pages/event/event-policy";
import EventRanking from "@/components/pages/event/event-rank";
import RegistrationSummary from "@/components/pages/event/registration-summary";
import { EventPageSkeleton } from "@/components/pages/event/skeleton-event";
import { Badge } from "@/components/ui/badge";
import { useEvent } from "@/context/event";
import { Address } from "@/interface/address";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { getEventIcon } from "@/utils/eventIcons";
import {
  translateEventLevel,
  translateEventStatus,
  translateEventType,
} from "@/utils/eventTranslations";
import { stripHtml } from "@/utils/format";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { IoPin } from "react-icons/io5";
import { LuMedal } from "react-icons/lu";

export default function EventPage() {
  const { slug } = useParams() as { slug: string };
  const { event, loading, error, setSlug } = useEvent();

  useEffect(() => {
    const storedSlug = localStorage.getItem("eventSlug");

    if (slug && slug !== storedSlug) {
      localStorage.setItem("eventSlug", slug);
      setSlug(slug);
    }
  }, [slug]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!event || loading) return <EventPageSkeleton />;

  const EventIcon = getEventIcon(event.type);

  return (
    <div className="container-sm">
      <div>
        <EventHeader alt={event.name as string} image={event.bannerUrl || ""} />

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="mb-2 w-full align-center justify-center text-sm font-light"
              >
                {formatDateWithoutYear(event.startDate as string)} •{" "}
                {formatHour(event.startDate as string)}
              </Badge>
              <h1 className="text-2xl font-bold italic">{event.name}</h1>
              <div className="flex items-center text-xs my-1 ">
                {event.type && (
                  <div className="flex items-center gap-2">
                    <EventIcon className="text-gray-400" />
                    <span className="text-gray-600">
                      {translateEventType(event.type)}
                    </span>
                    <span className="mr-1 text-gray-600">•</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <LuMedal size={12} className="text-gray-400" />
                  <span className={`text-gray-600`}>
                    {translateEventLevel(event.level || "GERAL")}
                  </span>
                  <span className="mr-1 text-gray-600">•</span>
                </div>
                <div className="flex items-center gap-1">
                  <IoPin size={14} className="text-gray-400" />
                  <span className="text-gray-600">
                    {event.address?.street}, {event.address?.city} -{" "}
                    {event.address?.state}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-2 text-xs text-sporticket-green-500 font-semibold">
                <span className="">
                  {translateEventStatus(event.status) || "ABERTO"}
                </span>
                <span className="mx-1">•</span>
                {(() => {
                  const totalAvailable = event.ticketTypes.reduce(
                    (acc, ticket) => {
                      const activeLot = ticket.ticketLots.find(
                        (lot) => lot.isActive
                      );
                      if (!activeLot) return acc;
                      return (
                        acc +
                        Math.max(activeLot.quantity - activeLot.soldQuantity, 0)
                      );
                    },
                    0
                  );

                  if (totalAvailable === 0) {
                    return (
                      <span className="text-sporticket-orange-500 font-medium">
                        ESGOTADO
                      </span>
                    );
                  }

                  if (event?.allowFullTickets) {
                    return (
                      <span className="">
                        {totalAvailable} vaga{totalAvailable > 1 ? "s" : ""}{" "}
                        disponíveis
                      </span>
                    );
                  }
                })()}
              </div>
            </div>

            <EventLocation
              address={event.address as Address}
              place={event.place as string}
            />

            <div className="block lg:hidden order-last">
              <RegistrationSummary
                ticketTypes={event.ticketTypes}
                ticketsVisibility={{
                  allowFullTickets: event.allowFullTickets,
                  allowIndividualTickets: event.allowIndividualTickets,
                }}
              />
            </div>

            {event?.description && stripHtml(event.description).length > 0 && (
              <EventDescription description={event.description as string} />
            )}

            <EventPolicy regulation={event.regulation as string} />

            {event.ranking.length > 0 && (
              <EventRanking rankings={event.ranking} />
            )}

            {event.bracket.length > 0 && (
              <EventBracket brackets={event.bracket} />
            )}

            {event?.additionalInfo &&
              stripHtml(event.additionalInfo).length > 0 && (
                <EventAditionalInfo
                  additionalInfo={event.additionalInfo as string}
                />
              )}
          </div>

          <div className="hidden lg:block lg:col-span-1 order-none">
            <RegistrationSummary
              ticketTypes={event.ticketTypes}
              ticketsVisibility={{
                allowFullTickets: event.allowFullTickets,
                allowIndividualTickets: event.allowIndividualTickets,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
