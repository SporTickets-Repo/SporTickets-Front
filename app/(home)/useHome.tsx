"use client";
import {
  EventLevel,
  EventStatus,
  EventSummary,
  EventType,
} from "@/interface/event";
import { eventService } from "@/service/event";
import { useEffect, useMemo, useState } from "react";

export default function useHome() {
  const eventsMock: EventSummary[] = [
    {
      id: "9d11e079-6ff1-40ef-9db5-0b6bc53ccb40",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name1",
      status: EventStatus.DRAFT,
      type: EventType.FUTVOLEI,
      level: EventLevel.AMATEUR,
      name: "Sportickets event",
      place: "Event place",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      smallImageUrl: null,
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T15:22:12.467Z",
      updatedAt: "2025-02-14T15:22:12.467Z",
    },
    {
      id: "b0c0c9ce-2357-47eb-8249-7c42d75f8c5d",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name2",
      status: EventStatus.DRAFT,
      type: EventType.FUTVOLEI,
      level: EventLevel.BEGINNER,
      name: "Sportickets event",
      place: "Event place",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl: null,
      smallImageUrl: null,
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T15:22:35.618Z",
      updatedAt: "2025-02-14T15:22:35.618Z",
    },
    {
      id: "c439d51e-abf0-4c42-b563-0f73a665422c",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name3",
      status: EventStatus.DRAFT,
      type: EventType.FUTVOLEI,
      level: EventLevel.SEMIPROFESSIONAL,
      name: "Sportickets event",
      place: "Event place",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      smallImageUrl: null,
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T16:04:44.169Z",
      updatedAt: "2025-02-14T16:04:44.169Z",
    },
    {
      id: "73021238-2b9f-4f20-ab64-575ba44bc48f",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name",
      status: EventStatus.DRAFT,
      type: EventType.FUTVOLEI,
      level: EventLevel.PROFESSIONAL,
      name: "Sportickets event",
      place: "Event place",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      smallImageUrl: null,
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-13T21:20:18.666Z",
      updatedAt: "2025-02-14T16:20:14.871Z",
    },
  ];

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
        const events = await eventService.getAllEvents(1, 30, "name");
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
    eventsMock,
    eventTypes,
    loading,
    upcomingEvents,
    recentEvents,
    registrationEvents,
    finishedEvents,
  };
}
