"use client";
import { Button } from "@/components/ui/button";
import { Event } from "@/interface/event";
import { eventService } from "@/service/event";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileEventCard } from "./profile-event-card";

interface ProfileEventListProps {
  events: Event[];
  user?: boolean;
}

export function ProfileEventList({
  events,
  user = false,
}: ProfileEventListProps) {
  const router = useRouter();

  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const handleCreateEvent = async () => {
    try {
      const response = await eventService.init();

      if (response) {
        router.push(`/evento/criar/${response.eventId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {!user && (
        <div className="flex items-center justify-start">
          <Button
            type="button"
            onClick={async () => {
              setIsCreatingEvent(true);
              await handleCreateEvent();
              setIsCreatingEvent(false);
            }}
            variant="default-inverse"
            className="rounded-sm text-md font-medium py-5"
            disabled={isCreatingEvent}
          >
            {isCreatingEvent ? "Carregando..." : "Criar novo evento"}
            {!isCreatingEvent && <PlusIcon className="w-2 h-2" />}
          </Button>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 max-h-[50vh] overflow-y-auto">
        {events
          .sort((a, b) => (a.name === null ? -1 : b.name === null ? 1 : 0))
          .map((event, index) => (
            <Link href={`/evento/criar/${event.id}`} passHref key={index}>
              <ProfileEventCard key={event.id} event={event} />
            </Link>
          ))}
      </div>
    </div>
  );
}
