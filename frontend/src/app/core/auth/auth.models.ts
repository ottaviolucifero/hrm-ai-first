export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  email: string;
  userType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthenticatedUser;
}
