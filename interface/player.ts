export interface Player {
  id?: string;
  name: string;
  email?: string;
  cpf?: string;
  instagram?: string;
  shirtSize?: string;
  photoUrl?: string;
  category?: string;
  gender?: string;
}

export interface Ticket {
  id: string;
  category: string;
  description: string;
  price: number;
  players: Player[];
  maxPlayers: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  remainingSpots: number;
}

export interface CheckoutState {
  tickets: Ticket[];
  selectedTicketId: string | null;
  discount: string;
  total: number;
}
