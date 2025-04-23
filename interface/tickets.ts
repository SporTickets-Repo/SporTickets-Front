import { Category } from "./category";
import { Coupon } from "./coupons";
import { UserSex } from "./user";

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  description: string;
  userType: UserType;
  teamSize: number;
  categories: Category[];
  personalizedFields: PersonalizedField[];
  ticketLots: TicketLot[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface TicketLot {
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
  deletedAt?: string | null;
  ticketType: TicketType;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  userType: string;
  teamSize: number;
  ticketLots: TicketLot[];
  categories: Category[];
  personalizedFields: PersonalizedField[];
  deletedAt?: string | null;
}

export interface PersonalizedField {
  id: string;
  ticketTypeId: string;
  type: string;
  requestTitle: string;
  optionsList: string[];
  deletedAt?: string | null;
}

export interface TicketForm {
  id: string;
  ticketType: TicketType;
  ticketLot: TicketLot;
  players: Player[];
  coupon: Coupon;
  paymentData: PaymentData;
  slug: string;
}

export interface Player {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profileImageUrl: string;
  sex: UserSex;
  personalizedField: PersonalizedFieldResponse[];
  category: Category;
}

export interface PersonalizedFieldResponse {
  personalizedFieldId: string;
  answer: string;
}

export interface TicketCheckoutPayload {
  couponId?: string;
  teams: Teams[];
  paymentData: PaymentData;
}

export interface Teams {
  ticketTypeId: string;
  player: TicketUser[];
}

export interface TicketUser {
  userId: string;
  personalFields: PersonalizedFieldResponse[];
  categoryId: string;
}

export interface PaymentData {
  paymentMethod: string;
  cardData?: CardData;
}

export interface CardData {
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  cardHolder: CardHolder;
  installments?: number;
  cardBrand: string | null;
}

export interface CardHolder {
  name: string;
  identification: Identification;
}

export interface Identification {
  type: string;
  number: string;
}

export type UserType = "ATHLETE" | "VIEWER";

export interface TicketProps {
  id: string;
  eventId: string;
  name: string;
  description: string;
  userType: UserType;
  teamSize: number;
  categories: Category[];
  personalizedFields: PersonalizedField[];
  ticketLots: TicketLot[];
}
