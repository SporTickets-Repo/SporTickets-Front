"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Link href="/evento/criar">
          <Button
            variant="default-inverse"
            className="rounded-sm text-md font-medium py-5"
          >
            Criar novo evento
            <PlusIcon className="w-2 h-2 " />
          </Button>
        </Link>
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
