"use client";
import { EventStatus, EventSummary } from "@/interface/event";
import { eventService } from "@/service/event";
import { useEffect, useMemo, useState } from "react";

export default function useHome() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [upcomingEvents, setUpcomingEvents] = useState<EventSummary[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventSummary[]>([]);
  const [registrationEvents, setRegistrationEvents] = useState<EventSummary[]>(
    []
  );
  const [finishedEvents, setFinishedEvents] = useState<EventSummary[]>([]);

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
        const now = new Date();

        // Eventos mais próximos de acontecer (por data de início)
        const upcoming = [...filtered]
          .filter((event) => event.startDate && new Date(event.startDate) > now)
          .sort(
            (a, b) =>
              new Date(a.startDate ?? "").getTime() -
              new Date(b.startDate ?? "").getTime()
          )
          .slice(0, 5);
        setUpcomingEvents(upcoming);

        // Eventos recentes (por data de criação)
        const recent = [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentEvents(recent);

        // Eventos em período de registro (mais antigos primeiro)
        const registering = [...filtered]
          .filter((event) => event.status === EventStatus.REGISTRATION)
          .sort((a, b) => {
            if (a.createdAt === b.createdAt) return 0;
            return a.createdAt < b.createdAt ? -1 : 1;
          });
        setRegistrationEvents(registering);

        // Eventos finalizados ou em andamento, priorizando os em andamento
        const finished = [...filtered]
          .filter(
            (event) =>
              event.status === EventStatus.FINISHED ||
              event.status === EventStatus.PROGRESS
          )
          .sort((a, b) => {
            if (a.status === b.status) return 0;
            return a.status === EventStatus.PROGRESS ? -1 : 1;
          });
        setFinishedEvents(finished);
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
    upcomingEvents,
    recentEvents,
    registrationEvents,
    finishedEvents,
  };
}
