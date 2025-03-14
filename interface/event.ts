import { Address } from "./address";
import { Bracket } from "./bracket";
import { TicketType } from "./tickets";

export interface Event {
  id: string;
  createdBy: string;
  slug: string;
  status: string;
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
  status: string;
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
