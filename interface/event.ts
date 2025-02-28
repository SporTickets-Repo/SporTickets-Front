export interface Event {
  id: string;
  createdBy: string;
  slug: string;
  status: string;
  name: string;
  place: string;
  title: string;
  description: string;
  regulation?: string | null;
  additionalInfo?: string | null;
  bannerUrl?: string | null;
  endDate: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}
