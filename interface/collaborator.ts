import { UserRole } from "./user";

export interface EventDashboardAccess {
  id: string;
  userId: string;
  eventId: string;
  user: Collaborator;
}
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl: string | null;
}
