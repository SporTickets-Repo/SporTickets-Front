"use client";
import { Coupon } from "@/interface/coupons";
import { Event } from "@/interface/event";
import {
  PaymentData,
  Player,
  TicketCheckoutPayload,
  TicketForm,
} from "@/interface/tickets";
import { checkoutService } from "@/service/checkout";
import { eventService } from "@/service/event";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface EventContextProps {
  event: Event | null;
  loading: boolean;
  error: string | null;
  setSlug: (slug: string) => void;
  selectedTickets: TicketForm[];
  setSelectedTickets: React.Dispatch<React.SetStateAction<TicketForm[]>>;
  addTicket: (ticketTypeId: string) => void;
  removeTicket: (ticketTypeId: string) => void;
  submitCheckout: () => Promise<void>;
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
  submitCheckout: async () => {},
});

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // Hook de navegação
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [selectedTickets, setSelectedTickets] = useState<TicketForm[]>([]);

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

      const newTicket: TicketForm = {
        id: uuidv4(),
        ticketType,
        ticketLot: activeLot,
        players: [] as Player[],
        coupon: {} as Coupon,
        paymentData: {} as PaymentData,
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

  const submitCheckout = async () => {
    if (selectedTickets.length === 0) return;

    const payload: TicketCheckoutPayload = {
      teams: selectedTickets.map((ticket) => ({
        ticketTypeId: ticket.ticketType.id,
        player: ticket.players.map((player) => ({
          userId: player.userId,
          categoryId: player.category.id,
          personalFields: player.personalizedField.map((field) => ({
            personalizedFieldId: field.personalizedFieldId,
            answer: field.answer,
          })),
        })),
      })),
      ...(selectedTickets[0].coupon?.id
        ? { couponId: selectedTickets[0].coupon.id }
        : {}),
      paymentData: selectedTickets[0].paymentData,
    };

    try {
      const response = await checkoutService.checkout(payload);
      const transactionId = response.transactionId;
      router.push(`/pagamento/${transactionId}`);
    } catch (err) {
      console.error("Erro ao enviar checkout:", err);
      toast.error(
        "Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde."
      );
    }
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
        submitCheckout,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
