"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventSummary } from "@/interface/event";
import { format, formatDate } from "date-fns";
import { MapPin, Tag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  event: EventSummary;
}

export default function EventCard({ event }: EventCardProps) {
  const date = formatDate(event.startDate, "dd/MM/yyyy");
  const time = format(event.startDate, "HH:mm");

  return (
    <Link href={`/evento/${event.slug}`}>
      <Card className="overflow-hidden bg-transparent border-0 shadow-md">
        {/* Imagem do evento */}
        <div className="relative">
          {event.bannerUrl ? (
            <Image
              src={event.bannerUrl}
              alt={event.title}
              width={600}
              height={400}
              className="w-full h-44 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-44 bg-gray-700 flex items-center justify-center rounded-t-lg">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}
          <Badge
            variant="default"
            className="absolute top-2 left-2 px-3 py-1 text-xs"
          >
            {date} • {time}
          </Badge>
        </div>

        {/* Conteúdo do Card */}
        <CardContent className="p-3 bg-gray-800 rounded-b-lg">
          <h3 className="font-bold mb-1">{event.title}</h3>

          {/* Informações do evento */}
          <div className="flex items-center text-xs mt-1 text-gray-300">
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
          </div>

          {/* Localização */}
          <div className="text-xs mt-1 text-gray-300">
            <MapPin size={12} className="inline mr-1" />
            <span>{event.place || "Local não informado"}</span>
          </div>

          {/* Status e vagas disponíveis */}
          <div className="flex justify-between items-center mt-2 text-xs">
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              {event.status || "ABERTO"}
            </Badge>
            <span className="text-gray-300">
              {event.additionalInfo
                ? `${event.additionalInfo} vagas restantes`
                : "Vagas não informadas"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
