export type Restriction = "NONE" | "SAME_CATEGORY";

export interface Category {
  id: string;
  ticketTypeId: string;
  title: string;
  restriction: Restriction;
  quantity: number;
  soldQuantity: number;
  deletedAt?: string | null;
}
