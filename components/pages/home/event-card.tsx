"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventSummary } from "@/interface/event";
import { formatDateWithoutYear, formatHour } from "@/utils/dateTime";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: EventSummary;
  dark?: boolean;
}

export default function EventCard({ event, dark = false }: EventCardProps) {
  return (
    <Link href={`/evento/${event.slug}`}>
      <Card className="overflow-hidden bg-transparent border-0 shadow-none">
        {/* Imagem do evento */}
        <div className="relative">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
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
            {formatDateWithoutYear(event.startDate)} •{" "}
            {formatHour(event.startDate)}
          </Badge>
        </div>

        {/* Conteúdo do Card */}
        <CardContent className="p-3">
          <h3 className={`font-bold mb-1 ${dark ? "text-white" : ""}`}>
            {event.title}
          </h3>

          {/* <div className="flex items-center text-xs mt-1 text-gray-300">
            <Tag size={12} className="mr-1" />
            <span>{event.description || "Sem categoria"}</span>
            <span className="mx-1">•</span>
            <User size={12} className="mr-1" />
            <span>{event.regulation || "Nível não informado"}</span>
            <span className="mx-1">•</span>
            <span
              className={
                event.additionalInfo === "GRÁTIS"
                  ? "text-blue-400 font-bold"
                  : ""
              }
            >
              {event.additionalInfo || "Preço não informado"}
            </span>
          </div> */}

          <div>
            <MapPin
              size={12}
              className={`inline mr-1 ${
                dark ? "text-zinc-400" : "text-zinc-400"
              }`}
            />
            <span
              className={`text-xs ${dark ? "text-white" : "text-zinc-600"}`}
            >
              {event.place || "Local não informado"}
            </span>
          </div>

          <div className="flex items-center mt-2 text-xs text-sporticket-green-500 font-semibold">
            <span className="">{event.status || "ABERTO"}</span>
            <span className="mx-1">•</span>
            <span className="">{"Vagas não informadas"}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
