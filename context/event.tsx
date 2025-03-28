"use client";
import { Coupon } from "@/interface/coupons";
import { Event } from "@/interface/event";
import { Player, TicketResponse } from "@/interface/tickets";
import { eventService } from "@/service/event";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EventContextProps {
  event: Event | null;
  loading: boolean;
  error: string | null;
  setSlug: (slug: string) => void;
  selectedTickets: TicketResponse[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<TicketResponse[]>>;
  addTicket: (ticketTypeId: string) => void;
  removeTicket: (ticketTypeId: string) => void;
}

const EventContext = createContext<EventContextProps>({
  event: null,
  loading: false,
  error: null,
  setSlug: () => {},
  selectedTickets: [],
  setSelectedTickets: () => {},
  addTicket: () => {},
  removeTicket: () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [event, setEvent] = useState<Event | null>(null);
  console.log("EventProvider renderizou", event);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [selectedTickets, setSelectedTickets] = useState<TicketResponse[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventData = await eventService.getEventBySlug(slug);
        if (event?.slug !== eventData.slug) {
          setSelectedTickets([]);
        }
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

  const addTicket = (ticketTypeId: string) => {
    setSelectedTickets((prev) => {
      const ticketType = event?.ticketTypes.find((t) => t.id === ticketTypeId);
      if (!ticketType) return prev;

      const activeLot = ticketType.ticketLots.find((lot) => lot.isActive);
      if (!activeLot) return prev;

      const newTicket: TicketResponse = {
        id: uuidv4(),
        ticketType,
        ticketLot: activeLot,
        players: [] as Player[],
        coupon: {} as Coupon,
      };

      return [...prev, newTicket];
    });
  };

  const removeTicket = (ticketTypeId: string) => {
    setSelectedTickets((prev) => {
      const indexToRemove = prev.findIndex(
        (t) => t.ticketType.id === ticketTypeId
      );
      if (indexToRemove === -1) return prev;

      return prev.filter((_, index) => index !== indexToRemove);
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
        setSelectedTickets,
        addTicket,
        removeTicket,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
