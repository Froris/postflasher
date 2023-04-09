export interface AuthResponse {
  accessToken: string;
  data_access_expiration_time: number;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  grantedScopes?: string | undefined;
  reauthorize_required_in?: number | undefined;
}

export interface FbApiResponse {
  id: string;
}

export interface FbApiPhotoUploadResponse {
  id: string; // photo id
  post_id: string; // [post id]_[photo id]
}

export interface FbApiErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    fbtrace_id: string;
  };
}

export interface StatusResponse {
  status: 'authorization_expired' | 'connected' | 'not_authorized' | 'unknown';
  authResponse: AuthResponse;
}

export interface FbApiPageAccessResponse {
  data: [
    {
      access_token: string; // Page access token
      category: string;
      category_list: [
        {
          id: string;
          name: string;
        }
      ];
      name: string; // Page name
      id: string; // Page id
      tasks: string[];
    }
  ];
}
