export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "worker";
  warehouse: string | null;
  location: string | null;
  created_at: string;
}

export interface Recipient {
  id: string;
  email: string;
  isactive: boolean;
  created_at: string;
}

export interface Warehouse {
  id: string;
  warehouse: string;
  location: string;
  workers: number;
  created_at: string;
}
