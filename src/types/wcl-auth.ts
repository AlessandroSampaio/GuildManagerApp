export interface WclAuthorizeResponse {
  authorizeUrl: string;
  state: string;
  instructions: string;
}

export interface WclStatus {
  userId: number;
  isAuthorized: boolean;
  message: string;
}

export interface WclCredentialStatus {
  configured: boolean;
  label: string | null;
  updatedAt: string | null;
  message: string;
}

export interface WclCredentialRequest {
  clientId: string;
  clientSecret: string;
  label?: string;
}
