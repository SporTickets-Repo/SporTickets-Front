"use client";
import TranslatedLink from "@/components/translated-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventSummary } from "@/interface/event";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { getEventIcon } from "@/utils/eventIcons";
import { createTranslator } from "@/utils/eventTranslations";
import Image from "next/image";
import { IoPin } from "react-icons/io5";
import { LuMedal } from "react-icons/lu";

interface EventCardProps {
  event: EventSummary;
  dictionary: any;
  dark?: boolean;
}

export default function EventCard({
  event,
  dictionary,
  dark = false,
}: EventCardProps) {
  const EventIcon = getEventIcon(event.type);
  const t = createTranslator(dictionary);

  return (
    <TranslatedLink href={`/evento/${event.slug}`}>
      <Card className="overflow-hidden bg-transparent border-0 shadow-none">
        <div className="relative">
          {event.smallImageUrl ? (
            <Image
              src={event.smallImageUrl}
              alt={event.name || dictionary.eventoSemNome}
              width={600}
              height={400}
              className="w-full h-44 object-cover rounded-lg bg-gray-500"
            />
          ) : (
            <div className="w-full h-44 bg-zinc-400 flex items-center justify-center rounded-lg"></div>
          )}
          <Badge
            variant="secondary"
            className="absolute bottom-0 left-0 text-md rounded-br-none rounded-tl-none rounded-tr-sm"
          >
            {event.startDate
              ? formatDateWithoutYear(event.startDate)
              : dictionary.dataIndisponivel}{" "}
            •{" "}
            {event.startDate
              ? formatHour(event.startDate)
              : dictionary.horarioIndisponivel}
          </Badge>
        </div>

        <CardContent className="p-3 space-y-1">
          <h3 className={`font-bold mb-1 ${dark ? "text-white" : ""}`}>
            {event.name}
          </h3>

          <div className="flex items-center text-xs ">
            {event.type && (
              <div className="flex items-center gap-1">
                <EventIcon className="text-gray-400" />
                <span className={`${dark ? "text-white" : "text-gray-600"}`}>
                  {t.eventType(event.type)}
                </span>
                <span className="mr-1 text-gray-600">•</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <LuMedal size={12} className="text-gray-400" />
              <span className={`${dark ? "text-white" : "text-gray-600"}`}>
                {t.eventLevel(event.level) || dictionary.desconhecido}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 -ml-[2px]">
            <IoPin className={` ${dark ? "text-zinc-400" : "text-zinc-400"}`} />
            <span
              className={`text-xs ${dark ? "text-white" : "text-zinc-600"}`}
            >
              {event.place || dictionary.localNaoInformado}
            </span>
          </div>

          <div className="flex items-center mt-2 text-xs text-sporticket-green-500 font-semibold">
            <span>
              {t.eventStatus(event.status) ||
                dictionary.eventStatus.REGISTRATION}
            </span>
          </div>
        </CardContent>
      </Card>
    </TranslatedLink>
  );
}
