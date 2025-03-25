"use client";
import { Button } from "@/components/ui/button";
import { eventService } from "@/service/event";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileEventCard } from "./profile-event-card";

interface Event {
  title: string;
  location: string;
  type: string;
}

interface ProfileEventListProps {
  events: Event[];
}

export function ProfileEventList({ events }: ProfileEventListProps) {
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
      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {events.map((event, index) => (
          <ProfileEventCard
            key={index}
            title={event.title}
            location={event.location}
            type={event.type}
          />
        ))}
      </div>
    </div>
  );
}
