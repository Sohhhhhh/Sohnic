export type APIResponse = {
  status: string;
  statusCode: number;
  data?: object;
  size?: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  timestamp?: string;
};
