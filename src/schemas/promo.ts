import z from "zod";

export const promoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  discount: z.coerce.number().min(1, "Must be at least 1").max(100, "Cannot exceed 100"),
  minimumSpend: z.coerce.number().min(0, "Must be 0 or more"),
  expirationDate: z.date({ error: "Expiration date is required" }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
