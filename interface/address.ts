export interface Address {
  id: string;
  eventId: string;
  zipCode: string | null;
  street: string | null;
  complement: string | null;
  neighborhood: string | null;
  number: string | null;
  city: string | null;
  state: string | null;
}
