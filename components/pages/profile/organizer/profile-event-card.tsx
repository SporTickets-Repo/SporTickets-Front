"use client";
import { Event } from "@/interface/event";
import { translateEventType } from "@/utils/eventTranslations";
import Image from "next/image";
import { FC } from "react";

interface ProfileEventCardProps {
  event: Event;
}

export const ProfileEventCard: FC<ProfileEventCardProps> = ({ event }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-primary/10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg relative">
          <Image
            src={
              event?.smallImageUrl || "/assets/pattern/Pattern-1-fundo-Azul.png"
            }
            alt="LogoEvento"
            fill
            className="rounded-lg object-cover"
            unoptimized
          />
        </div>
        <div className="flex flex-col">
          <h3 className="text-md font-medium text-gray-900">
            {event?.name ?? "Evento sem nome"}
          </h3>
          <p className="text-sm text-gray-500">
            {event?.place ?? "Evento sem local"} ·{" "}
            {translateEventType(event?.type)}
          </p>
          <p className="text-sm text-gray-500">
            {event?.slug ? `/${event.slug}` : "Evento sem slug"}
          </p>
        </div>
      </div>
    </div>
  );
};
