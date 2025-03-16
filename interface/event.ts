import { Address } from "./address";
import { Bracket } from "./bracket";
import { TicketType } from "./tickets";

export interface Event {
  id: string;
  createdBy: string;
  slug: string;
  status: EventStatus;
  type: EventType;
  name: string;
  place: string;
  title: string;
  description: string;
  regulation: string;
  additionalInfo: string;
  bannerUrl: string | null;
  endDate: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  ticketTypes: TicketType[];
  bracket: Bracket[];
  address: Address;
}

export interface EventSummary {
  id: string;
  createdBy: string;
  slug: string;
  status: EventStatus;
  type: EventType;
  name: string;
  place: string;
  title: string;
  description: string;
  regulation: string;
  additionalInfo: string;
  bannerUrl: string | null;
  endDate: string;
  startDate: string;
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
  GERAL = "GERAL",
}
