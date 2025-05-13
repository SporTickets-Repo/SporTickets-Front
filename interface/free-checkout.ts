export interface FreeCheckoutPayload {
  team: FreeCheckoutTeam;
}

export interface FreeCheckoutTeam {
  ticketTypeId: string;
  player: FreeCheckoutPlayer[];
}

export interface FreeCheckoutPlayer {
  userId: string;
  categoryId?: string;
  personalFields?: {
    personalizedFieldId: string;
    answer: string;
  }[];
}
