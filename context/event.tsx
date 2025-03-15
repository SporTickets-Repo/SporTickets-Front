"use client";

import { Event } from "@/interface/event";
import React, { createContext, useContext, useEffect, useState } from "react";

import { eventService } from "@/service/event";

interface EventContextProps {
  event: Event | null;
  loading: boolean;
  error: string | null;
  setSlug: (slug: string) => void;
}

const EventContext = createContext<EventContextProps>({
  event: null,
  loading: false,
  error: null,
  setSlug: () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        //console.log("slug", slug);
        const eventData = await eventService.getEventBySlug(slug);
        setEvent(eventData);
      } catch (err) {
        setError("Erro ao carregar evento.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  return (
    <EventContext.Provider value={{ event, loading, error, setSlug }}>
      {children}
    </EventContext.Provider>
  );
};
