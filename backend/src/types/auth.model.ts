export interface RegisterUserProfile {
  firstName: string;
  lastName: string;
}

export interface RegisterBaby {
  name: string;
  dateOfBirth: string;
  gender: "boy" | "girl";
  feedingMethod: "breastfeeding" | "formula" | "combination";
}

export interface RegisterRequest {
  email: string;
  password: string;
  user: RegisterUserProfile;
  baby: RegisterBaby;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  baby: {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: RegisterBaby["gender"];
    feedingMethod: RegisterBaby["feedingMethod"];
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface FirebaseLoginResponse {
  localId: string;
  email: string;
  displayName?: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  registered: boolean;
}

export interface FirebaseAuthErrorResponse {
  error?: {
    code?: number;
    message?: string;
    errors?: Array<{
      message?: string;
      domain?: string;
      reason?: string;
    }>;
  };
}
