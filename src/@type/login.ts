export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  fullName?: string;
  avatar?: string;
  tokens: AuthTokens;
}

export interface FacebookLoginResponse {
   id: string;
    name: string;
    email?: string;
    picture?: {
        data: {
            height: number;
            is_silhouette: boolean;
            url: string;
            width: number;
        };
    }
    accessToken: string;
    }
