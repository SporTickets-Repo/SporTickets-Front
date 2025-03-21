import { Coupon } from "./coupons";
import { UserSex } from "./user";

export interface TicketLot {
  id: string;
  ticketTypeId: string;
  name: string;
  price: string;
  quantity: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description: string;
  restriction: string;
  userType: string;
  teamSize: number;
  ticketLots: TicketLot[];
  categories: Category[];
  personalizedFields: PersonalizedField[];
}

export interface PersonalizedField {
  id: string;
  ticketTypeId: string;
  type: string;
  requestTitle: string;
  optionsList: {
    [key: string]: string;
  };
}

export interface Category {
  id: string;
  ticketTypeId: string;
  title: string;
  description: string;
  quantity: number;
}

//Objeto de gerenciamento de respostas
export interface TicketProps {
  id: string;
  ticketType: TicketType;
  ticketLot: TicketLot;
  players: Player[];
  coupon: Coupon;
}

export interface Player {
  Userid: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  sex: UserSex;
  personalizedField: PersonalizedFieldResponse[];
  category: Category;
}

export interface PersonalizedFieldResponse {
  personalizedFieldId: string;
  answer: string;
}

//Objetos de envio de API
export interface TicketCheckout {
  ticketType: TicketType;
  coupon: Coupon;
  tickets: TicketUser[];
  paymentData: PaymentData;
}
export interface TicketUser {
  userid: string;
  personalFields: PersonalizedFieldResponse[];
  category: Category;
}

export interface PaymentData {
  paymentMethod: string;
  cardData: CardData;
}

export interface CardData {
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  cardHolder: CardHolder;
}

export interface CardHolder {
  name: string;
  identification: Identification;
}

export interface Identification {
  type: string;
  number: string;
}
