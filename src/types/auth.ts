import { ReactNode } from "react";

export interface AuthLayoutProps {
  FormComponent: ReactNode,
  isVerfication?: boolean
}

export type EditProfile = {
  name: string;
  email: string;
  dob: string;
  nationality: string;
};
