"use client";

import { Event } from "@/interface/event";
import { TicketLot, TicketType } from "@/interface/tickets";
import { eventService } from "@/service/event";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SelectedTicket {
  ticketType: TicketType;
  ticketLot: TicketLot;
  quantity: number;
}

interface EventContextProps {
  event: Event | null;
  loading: boolean;
  error: string | null;
  setSlug: (slug: string) => void;
  selectedTickets: SelectedTicket[];
  updateTicketQuantity: (ticketTypeId: string, quantity: number) => void;
}

const EventContext = createContext<EventContextProps>({
  event: null,
  loading: false,
  error: null,
  setSlug: () => {},
  selectedTickets: [],
  updateTicketQuantity: () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
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

  const updateTicketQuantity = (ticketTypeId: string, quantity: number) => {
    setSelectedTickets((prev) => {
      if (quantity === 0) {
        return prev.filter((t) => t.ticketType.id !== ticketTypeId);
      }

      const existingTicket = prev.find((t) => t.ticketType.id === ticketTypeId);
      if (existingTicket) {
        return prev.map((t) =>
          t.ticketType.id === ticketTypeId ? { ...t, quantity } : t
        );
      }

      const ticketType = event?.ticketTypes.find((t) => t.id === ticketTypeId);
      if (!ticketType) return prev;

      const activeLot = ticketType.ticketLots.find((lot) => lot.isActive);
      if (!activeLot) return prev;

      return [...prev, { ticketType, ticketLot: activeLot, quantity }];
    });
  };

  return (
    <EventContext.Provider
      value={{
        event,
        loading,
        error,
        setSlug,
        selectedTickets,
        updateTicketQuantity,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
