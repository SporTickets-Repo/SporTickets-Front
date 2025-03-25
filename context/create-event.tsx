"use client";
import { Event, EventLevel, EventType } from "@/interface/event";
import { eventService } from "@/service/event";
import { createContext, ReactNode, useContext, useState } from "react";
import useSWR from "swr";

interface CreateEventContextData {
  event: Event | undefined;
  eventError: any;
  eventLoading: boolean;
  eventTypes: EventType[] | undefined;
  eventTypesError: any;
  eventTypesLoading: boolean;
  eventLevels: EventLevel[] | undefined;
  eventLevelsError: any;
  eventLevelsLoading: boolean;
  eventId: string | null;
  setEventId: (id: string | null) => void;
  smallImagePreview: string | null;
  setSmallImagePreview: (image: string | null) => void;
  bannerImagePreview: string | null;
  setBannerImagePreview: (image: string | null) => void;
}

const CreateEventContext = createContext<CreateEventContextData | undefined>(
  undefined
);

interface CreateEventProviderProps {
  children: ReactNode;
}

export function CreateEventProvider({ children }: CreateEventProviderProps) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [smallImagePreview, setSmallImagePreview] = useState<string | null>(
    null
  );
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );

  const {
    data: event,
    error: eventError,
    isLoading: eventLoading,
  } = useSWR<Event>(
    eventId ? `/events/${eventId}` : null,
    () => eventService.getEventById(eventId as string),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const {
    data: eventTypes,
    error: eventTypesError,
    isLoading: eventTypesLoading,
  } = useSWR<EventType[]>("/events/types", () => eventService.getEventTypes(), {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const {
    data: eventLevels,
    error: eventLevelsError,
    isLoading: eventLevelsLoading,
  } = useSWR<EventLevel[]>(
    "/events/levels",
    () => eventService.getEventLevels(),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const contextValue: CreateEventContextData = {
    event,
    eventError,
    eventLoading,
    eventTypes,
    eventTypesError,
    eventTypesLoading,
    eventLevels,
    eventLevelsError,
    eventLevelsLoading,
    eventId,
    setEventId,
    smallImagePreview,
    setSmallImagePreview,
    bannerImagePreview,
    setBannerImagePreview,
  };

  return (
    <CreateEventContext.Provider value={contextValue}>
      {children}
    </CreateEventContext.Provider>
  );
}

export function useCreateEventContext() {
  const context = useContext(CreateEventContext);
  if (!context) {
    throw new Error(
      "useCreateEventContext must be used within a CreateEventProvider"
    );
  }
  return context;
}
