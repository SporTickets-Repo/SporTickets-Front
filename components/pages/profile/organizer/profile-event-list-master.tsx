"use client";
import TranslatedLink from "@/components/translated-link";
import { Event } from "@/interface/event";
import { ProfileEventCard } from "./profile-event-card";

interface ProfileEventListProps {
  events: Event[];
  user?: boolean;
}

export function ProfileEventListMaster({
  events,
  user = false,
}: ProfileEventListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-1 flex-col gap-3 max-h-[50vh] overflow-y-auto">
        {events
          .sort((a, b) => (a.name === null ? -1 : b.name === null ? 1 : 0))
          .map((event, index) => (
            <TranslatedLink
              href={`/evento/criar/${event.id}`}
              passHref
              key={index}
            >
              <ProfileEventCard key={event.id} event={event} />
            </TranslatedLink>
          ))}
      </div>
    </div>
  );
}
