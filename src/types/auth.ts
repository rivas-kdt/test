// src/types/auth.ts
export interface WarehouseInfo {
  id: string;
  name: string;
  location: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  warehouse: WarehouseInfo | null;
  username: string;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
