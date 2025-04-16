import { FreeCheckoutPayload } from "@/interface/free-checkout";
import { TicketCheckoutPayload } from "@/interface/tickets";
import { api } from "./api";

export const checkoutService = {
  checkout: async (payload: TicketCheckoutPayload) => {
    try {
      const response = await api.post(`/checkout`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  freeCheckout: async (payload: FreeCheckoutPayload) => {
    try {
      const response = await api.post(`/checkout/free`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
