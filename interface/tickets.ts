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
  mode: string;
  ticketLots: TicketLot[];
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

export interface Player {
  Userid: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  personalizedFields: PersonalizedField[];
}

export interface Coupon {
  id: string;
  eventId: string;
  name: string;
  percentage: number;
}

export interface TicketProps {
  id: string;
  ticketType: TicketType;
  ticketLot: TicketLot;
  players: Player[];
  category: Category;
  coupon: Coupon;
}
