export interface Bracket {
  id: string;
  eventId: string;
  name: string;
  url: string;
  isActive: boolean;
}

export interface BracketUpdate {
  id?: string;
  name?: string;
  url?: string;
  isActive?: boolean;
}
