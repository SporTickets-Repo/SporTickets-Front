import { Address } from "./address";
import { Bracket } from "./bracket";
import { Coupon } from "./coupons";
import { Ranking } from "./ranking";
import { TicketType } from "./tickets";

export interface Event {
  id: string;
  createdBy: string;
  slug: string | null;
  status: EventStatus;
  type: EventType;
  level: EventLevel;
  name: string | null;
  place: string | null;
  description: string | null;
  regulation: string | null;
  additionalInfo: string | null;
  bannerUrl: string | null;
  smallImageUrl: string | null;
  endDate: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
  ticketTypes: TicketType[];
  bracket: Bracket[];
  ranking: Ranking[];
  address: Address | null;
  paymentMethods: PaymentMethod[];
  coupons: Coupon[];
}

export interface EventSummary {
  id: string;
  createdBy: string;
  slug: string | null;
  status: EventStatus;
  type: EventType;
  level: EventLevel;
  name: string | null;
  place: string | null;
  description: string | null;
  regulation: string | null;
  additionalInfo: string | null;
  bannerUrl: string | null;
  smallImageUrl: string | null;
  endDate: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum EventStatus {
  DRAFT = "DRAFT",
  REGISTRATION = "REGISTRATION",
  PROGRESS = "PROGRESS",
  CANCELLED = "CANCELLED",
  FINISHED = "FINISHED",
}

export enum EventType {
  FUTVOLEI = "FUTVOLEI",
  BEACH_TENIS = "BEACH_TENIS",
  ALTINHA = "ALTINHA",
  FUTEBOL = "FUTEBOL",
  FUTEBOL_ARREIA = "FUTEBOL_ARREIA",
  FUTSAL = "FUTSAL",
  VOLEI = "VOLEI",
  GENERAL = "GENERAL",
}

export enum EventLevel {
  BEGINNER = "BEGINNER",
  AMATEUR = "AMATEUR",
  SEMIPROFESSIONAL = "SEMIPROFESSIONAL",
  PROFESSIONAL = "PROFESSIONAL",
  GENERAL = "GENERAL",
}

export enum PaymentMethod {
  PIX = "PIX",
  CREDIT_CARD = "CREDIT_CARD",
  BOLETO = "BOLETO",
}
