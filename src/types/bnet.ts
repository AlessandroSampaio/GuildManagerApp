export interface BNetCredentialRequest {
  clientId: string | null;
  clientSecret: string | null;
  label?: string | null;
}

export interface BNetCredentialStatus {
  configured: boolean;
  label: string | null;
  updatedAt: string | null;
  message: string | null;
}

export interface BNetAuthorizeResponse {
  authorizeUrl: string | null;
  state: string | null;
  instructions: string | null;
}

export interface BNetStatusDto {
  userId: string;
  isAuthorized: boolean;
  battleTag: string | null;
  message: string | null;
}
