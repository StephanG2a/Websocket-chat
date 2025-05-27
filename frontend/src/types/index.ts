export interface User {
  id: string;
  username: string;
  email: string;
  color: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Message {
  id: string;
  message: string;
  user: User;
  timestamp: Date;
}

export interface ConnectedUser {
  id: string;
  username: string;
  color: string;
} 