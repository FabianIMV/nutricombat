export interface User {
  id?: string;
  email: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  token?: string;
}
