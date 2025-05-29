export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  country: Country;
  phone: string;
  document?: string;
  documentType?: string;
  name: string;
  sex: string;
  role: string;
  bornAt: string;
  cep: string;
  profileImageUrl?: string | null;
  siteUrl?: string | null;
  logoUrl?: string | null;
  fantasyName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ForgotPasswordResponse {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface RegisterBody {
  name: string;
  document?: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
  bornAt: string;
  cep: string;
  sex: string;
  phone: string;
}

export enum Country {
  BRAZIL = "BRAZIL",
  AUSTRALIA = "AUSTRALIA",
}
