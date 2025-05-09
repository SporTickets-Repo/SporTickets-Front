"use client";
import { EventStatus, EventSummary } from "@/interface/event";
import { eventService } from "@/service/event";
import { useEffect, useMemo, useState } from "react";

export default function useHome() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  [];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const events = await eventService.getAllEvents(1, 50, "name");
        const filtered = events.filter(
          (event) =>
            event.status !== EventStatus.DRAFT &&
            event.status !== EventStatus.CANCELLED
        );
        setEvents(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventTypes = useMemo(
    () =>
      events
        .map((event) => event.type)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort(),
    [events]
  );

  return {
    events,
    eventTypes,
    loading,
  };
}
