"use client";
import { EventSummary } from "@/interface/event";
import { eventService } from "@/service/event";
import { useEffect, useState } from "react";

export default function useHome() {
  const eventsMock: EventSummary[] = [
    {
      id: "9d11e079-6ff1-40ef-9db5-0b6bc53ccb40",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name1",
      status: "DRAFT",
      name: "Sportickets event",
      place: "Event place",
      title: "Volleyball event",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T15:22:12.467Z",
      updatedAt: "2025-02-14T15:22:12.467Z",
    },
    {
      id: "b0c0c9ce-2357-47eb-8249-7c42d75f8c5d",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name2",
      status: "DRAFT",
      name: "Sportickets event",
      place: "Event place",
      title: "Volleyball event",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl: null,
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T15:22:35.618Z",
      updatedAt: "2025-02-14T15:22:35.618Z",
    },
    {
      id: "c439d51e-abf0-4c42-b563-0f73a665422c",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name3",
      status: "DRAFT",
      name: "Sportickets event",
      place: "Event place",
      title: "Volleyball event",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-14T16:04:44.169Z",
      updatedAt: "2025-02-14T16:04:44.169Z",
    },
    {
      id: "73021238-2b9f-4f20-ab64-575ba44bc48f",
      createdBy: "ba2e8f30-3a40-420c-89a7-32c00c507f67",
      slug: "event-name",
      status: "DRAFT",
      name: "Sportickets event",
      place: "Event place",
      title: "Volleyball event",
      description: "Event of the year",
      regulation: "Event regulation",
      additionalInfo: "Event additional info",
      bannerUrl:
        "https://t96kpt9nk5xvwlvg.public.blob.vercel-storage.com/62d99005-8c7a-4587-85ba-5a3a6d221cf2/1740011929860_sg-11134201-7rdy2-m08u54sz50371b-xHF7nHu2R6xlvHQbDVaDLcKP1Ir94Z.jpg",
      endDate: "2025-12-01T18:00:00.000Z",
      startDate: "2025-12-01T10:00:00.000Z",
      createdAt: "2025-02-13T21:20:18.666Z",
      updatedAt: "2025-02-14T16:20:14.871Z",
    },
  ];

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const events = await eventService.getAllEvents(1, 10, "name");
        setEvents(events);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return { events, eventsMock };
}
