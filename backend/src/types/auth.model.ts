export interface RegisterUserProfile {
  firstName: string;
  lastName: string;
}

export interface RegisterBaby {
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  feedingMethod: "breastfeeding" | "formula" | "combination" | "other";
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
