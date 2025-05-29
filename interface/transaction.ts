import { Category } from "./category";
import { Coupon } from "./coupons";
import { UserSex } from "./user";

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  AUTHORIZED = "AUTHORIZED",
  IN_PROCESS = "IN_PROCESS",
  IN_MEDIATION = "IN_MEDIATION",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  CHARGED_BACK = "CHARGED_BACK",
}

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: TransactionStatus;
  createdById: string;
  paymentMethod: "PIX" | "CREDIT_CARD" | "FREE" | string;
  externalPaymentId: string;
  externalStatus: string;
  pixQRCode: string | null;
  totalValue: string;
  paymentProvider: string | null;
  paidAt: string | null;
  tickets: Ticket[];
}

export interface Ticket {
  id: string;
  userId: string;
  transactionId: string;
  ticketLotId: string;
  categoryId: string;
  couponId: string | null;
  price: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  teamId: string;
  ticketLot: TicketLotDetails;
  user: TicketUserDetails;
  category: Category;
  personalizedFieldAnswers: PersonalizedFieldAnswer[];
  coupon: Coupon | null;
}

export interface TicketLotDetails {
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

export interface TicketTypeDetails {
  id: string;
  eventId: string;
  name: string;
  description: string;
  userType: "ATHLETE" | "VIEWER"; // Enum para tipos de usuário
  teamSize: number;
  deletedAt: string | null;
}

export interface TicketUserDetails {
  id: string;
  name: string;
  email: string;
  sex: UserSex;
  phone: string;
  profileImageUrl: string | null;
  documentType: string;
  document: string;
  bornAt: string;
}

export interface PersonalizedFieldAnswer {
  id: string;
  personalizedFieldId: string;
  answer: string;
  personalizedField: PersonalizedFieldDetails;
}

export interface PersonalizedFieldDetails {
  id: string;
  requestTitle: string;
}
