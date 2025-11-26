import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user"]),
});


export const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required"),
  role: z.enum(["user"]),
  phone: z.string().optional(),
  image: z.any().optional(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const VerificationSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
  email: z.string().email("Invalid email address"),
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const CompleteProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required")
});

// types 
export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type CompleteProfile = z.infer<typeof CompleteProfileSchema>;
