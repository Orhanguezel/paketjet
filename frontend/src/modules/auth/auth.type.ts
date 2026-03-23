export type UserRole = "customer" | "carrier" | "admin";

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  wallet_balance?: string;
  role?: UserRole;
  avatar_url?: string | null;
  email_verified?: number;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: "carrier" | "customer";
}

export interface AuthResponse {
  user: User;
  access_token?: string;
}
