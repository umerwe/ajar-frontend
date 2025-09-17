import z from "zod";

export const CheckoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(7, "Phone number is required"),
});

export const paymentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  expiryDate: z
    .string()
    .min(1, "Expiration date is required")
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Expiration date must be in MM/YY format")
    .refine(
      (value) => {
        const [month, year] = value.split("/").map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        const inputDate = new Date(2000 + year, month - 1);
        const currentDate = new Date(2000 + currentYear, currentMonth - 1);
        return inputDate >= currentDate;
      },
      { message: "Expiration date must not be in the past" }
    ),
  billingZip: z.string().min(1, "Billing ZIP code is required").regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  paymentOption: z.enum(["full", "affirm"]).refine((val) => val !== undefined && val !== null, {
    message: "Payment option is required",
  }),
  cardType: z.enum(["PayPal", "JCB", "VISA", "Discover", "American Express", "UnionPay", "Diners Club"]).refine(
    (val) => val !== undefined && val !== null,
    { message: "Card type is required" }
  ),
});

// Combined schema for the entire checkout form
export const combinedSchema = CheckoutSchema.merge(paymentSchema);

export type PaymentFormData = z.infer<typeof paymentSchema>;
export type CheckoutFormData = z.infer<typeof CheckoutSchema>;
export type CombinedFormData = z.infer<typeof combinedSchema>;
