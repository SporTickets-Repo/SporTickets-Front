"use client";
import { Event } from "@/interface/event";
import { eventService } from "@/service/event";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileEventCard } from "./profile-event-card";

interface ProfileEventListProps {
  events: Event[];
  user?: boolean;
}

export function ProfileEventListMaster({
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
