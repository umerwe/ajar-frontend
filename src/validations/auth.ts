import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user"]),
});

export const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters "),
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
  otp: z.string().min(1, "OTP is required")
})

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const ChangePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "Old password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type Login = z.infer<typeof LoginSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Verification = z.infer<typeof VerificationSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

