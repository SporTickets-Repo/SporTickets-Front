export interface Coupon {
  id: string;
  name: string;
  eventId: string;
  percentage: number;
  quantity: number;
  createdBy: string;
  deletedAt: string;
}

export interface CouponUpdate {
  name?: string;
  percentage?: number;
  quantity?: number;
}
