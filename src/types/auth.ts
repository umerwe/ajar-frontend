import { ReactNode } from "react";

export interface AuthLayoutProps {
  FormComponent: ReactNode,
  isVerfication?: boolean
}

export type EditProfile = {
  name: string;
  dob: string;
  nationality: string;
};

export interface LoginSuccessResponse {
  user : {
    otp : {
    isVerified : false;
  }
  email : string;
  }
  require2FA?: boolean;
  message?: string;
  tempToken?: string;
  token?: string;
}

// Define the input type
export interface TwoFactorParams {
  token: string;
  authToken?: string;
}
