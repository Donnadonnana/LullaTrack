export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type BabyGender = "boy" | "girl" | "other";

export type FeedingMethod = "breastfeeding" | "bottle" | "mixed";

export type Baby = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: BabyGender;
  feedingMethod: FeedingMethod;
};

export type RegisterRequest = {
  email: string;
  password: string;
  user: {
    firstName: string;
    lastName: string;
  };
  baby: {
    name: string;
    dateOfBirth: string;
    gender: BabyGender;
    feedingMethod: FeedingMethod;
  };
};

export type RegisterResponse = {
  user: User;
  baby: Baby;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
  };
  idToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type GetMeResponse = {
  user: User;
  babies: Baby[];
};
