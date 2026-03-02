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
