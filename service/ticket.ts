import { MyTicket } from "@/interface/myTickets";
import { TicketProps } from "@/interface/tickets";
import { api } from "./api";

export const ticketService = {
  getTicketsByEventId: async (eventId: string): Promise<TicketProps[]> => {
    try {
      const response = await api.get<TicketProps[]>(
        `/ticket-types/by-event/${eventId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  upsertTickets: async (
    data: TicketProps[],
    eventId: string
  ): Promise<TicketProps[]> => {
    try {
      const response = await api.put<TicketProps[]>(
        `/ticket-types/upsert/${eventId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  myTickets: async (): Promise<MyTicket[]> => {
    try {
      const response = await api.get<MyTicket[]>(`/tickets/my-tickets`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  allTickets: async (): Promise<MyTicket[]> => {
    try {
      const response = await api.get<MyTicket[]>(`/tickets/all`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
