import { Country } from "./auth";

export interface UserProfile {
  id: string;
  email: string;
  phone: string;
  document?: string;
  documentType?: string;
  name: string;
  sex: string;
  country: Country;
  role: UserRole | string;
  bornAt: string;
  cep: string;
  profileImageUrl?: string | null;
  siteUrl?: string | null;
  logoUrl?: string | null;
  fantasyName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
  MASTER = "MASTER",
}

export enum UserSex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface registerWithoutPassword {
  name: string;
  document?: string;
  email: string;
  country: Country;
  cep: string;
  sex: string;
  bornAt: string;
  phone: string;
}
