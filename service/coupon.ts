import { CouponUpdate } from "@/interface/coupons";
import { api } from "./api";

export const couponService = {
  useCoupon: async (name: string, eventId: string) => {
    try {
      const response = await api.post(`/coupons/use`, { name, eventId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCoupon: async (
    name: string,
    eventId: string,
    percentage: number,
    quantity: number,
    createdBy: string
  ) => {
    try {
      const response = await api.post(`/coupons`, {
        name,
        eventId,
        percentage,
        quantity,
        createdBy,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCouponsByEvent: async (eventId: string) => {
    try {
      const response = await api.get(`/coupons/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCoupon: async (couponId: string, data: CouponUpdate) => {
    try {
      const response = await api.patch(`/coupons/${couponId}`, {
        data,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCoupon: async (couponId: string) => {
    try {
      const response = await api.delete(`/coupons/${couponId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
