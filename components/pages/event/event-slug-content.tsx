import { getTranslations } from "@/app/utils/translate";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Address } from "@/interface/address";
import { Event } from "@/interface/event";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { getEventIcon } from "@/utils/eventIcons";
import { stripHtml } from "@/utils/format";
import { IoPin } from "react-icons/io5";
import { LuMedal } from "react-icons/lu";
import EventAditionalInfo from "./event-aditional-info";
import EventBracket from "./event-bracket";
import EventDescription from "./event-description";
import EventHeader from "./event-header";
import EventLocation from "./event-location";
import EventPolicy from "./event-policy";
import EventRanking from "./event-rank";
import RegistrationSummary from "./registration-summary";

interface Props {
  event: Event;
  lang: Locale;
}

export default async function EventSlugContent({ event, lang }: Props) {
  const dictionary = await getDictionary(lang);
  const t = await getTranslations(lang);
  const EventIcon = getEventIcon(event.type);

  const totalAvailable = event.ticketTypes.reduce((acc, ticket) => {
    const activeLot = ticket.ticketLots.find((lot) => lot.isActive);
    if (!activeLot) return acc;
    return acc + Math.max(activeLot.quantity - activeLot.soldQuantity, 0);
  }, 0);

  return (
    <div className="container-sm">
      <EventHeader
        alt={event?.name || dictionary.eventoSemNome}
        image={event.bannerUrl || "default-banner.jpg"}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <Badge
              variant="secondary"
              className="mb-2 w-full align-center justify-center text-sm font-light"
            >
              {event.startDate && formatDateWithoutYear(event.startDate)} •{" "}
              {event.startDate
                ? formatHour(event.startDate)
                : dictionary.horarioIndisponivel}
            </Badge>
            <h1 className="text-2xl font-bold italic">{event.name}</h1>
            <div className="flex items-center text-xs my-1">
              {event.type && (
                <div className="flex items-center gap-2">
                  <EventIcon className="text-gray-400" />
                  <span className="text-gray-600">
                    {t.eventType(event.type)}
                  </span>
                  <span className="mr-1 text-gray-600">•</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <LuMedal size={12} className="text-gray-400" />
                <span className="text-gray-600">
                  {t.eventLevel(event.level || "GERAL")}
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
              <span>{t.eventStatus(event.status)}</span>
              <span className="mx-1">•</span>
              {totalAvailable === 0 ? (
                <span className="text-sporticket-orange-500 font-medium">
                  {dictionary.eventoEsgotado}
                </span>
              ) : (
                event.allowFullTickets && (
                  <span>
                    {totalAvailable}{" "}
                    {totalAvailable === 1
                      ? dictionary.vagaDisponivel
                      : dictionary.vagasDisponiveis}
                  </span>
                )
              )}
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

          {event.description && stripHtml(event.description).length > 0 && (
            <EventDescription description={event.description} />
          )}

          <EventPolicy regulation={event?.regulation ?? undefined} />

          {event.ranking.length > 0 && (
            <EventRanking rankings={event.ranking} />
          )}
          {event.bracket.length > 0 && (
            <EventBracket brackets={event.bracket} />
          )}

          {event.additionalInfo &&
            stripHtml(event.additionalInfo).length > 0 && (
              <EventAditionalInfo additionalInfo={event.additionalInfo} />
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
  );
}
