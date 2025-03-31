export interface Ranking {
  id: string;
  eventId: string;
  name: string;
  url: string;
  isActive: boolean;
}

export interface RankingUpdate {
  id?: string;
  name?: string;
  url?: string;
  isActive?: boolean;
}
