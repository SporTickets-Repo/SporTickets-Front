import { Category } from "./category";
import { Coupon } from "./coupons";
import {
  PersonalizedFieldAnswer,
  TicketUserDetails,
  TransactionStatus,
} from "./transaction";

export interface MyTicket {
  id: string;
  price: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  codeBase64: string;
  transaction: {
    id: string;
    status: TransactionStatus;
    createdAt: string;
  };
  ticketLot: TicketLotDetails;
  category: Category;
  personalizedFieldAnswers: PersonalizedFieldAnswer[];
  coupon: Coupon;
  user: TicketUserDetails;
  team: {
    id: string;
  };
}

interface TicketLotDetails {
  id: string;
  ticketTypeId: string;
  name: string;
  price: string;
  quantity: number;
  soldQuantity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ticketType: TicketTypeDetails;
}

interface TicketTypeDetails {
  id: string;
  eventId: string;
  name: string;
  description: string;
  userType: "ATHLETE" | "VIEWER";
  teamSize: number;
  deletedAt: string | null;
  event: EventDetails;
}

interface EventDetails {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  slug: string;
  description: string;
  place: string;
  bannerUrl: string;
  smallImageUrl: string;
  type: string;
  status: string;
}
