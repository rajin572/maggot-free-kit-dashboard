import z from "zod";

const strongPassword = z
  .string()
  .min(8, "কমপক্ষে ৮ অক্ষর হতে হবে")
  .regex(/[A-Z]/, "একটি বড় হাতের অক্ষর থাকতে হবে")
  .regex(/[a-z]/, "একটি ছোট হাতের অক্ষর থাকতে হবে")
  .regex(/[0-9]/, "একটি সংখ্যা থাকতে হবে")
  .regex(/[^A-Za-z0-9]/, "একটি বিশেষ চিহ্ন থাকতে হবে");

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  password: strongPassword,
  confirmPassword: z.string(),
});

export const updatePasswordSchema = z.object({
  password: strongPassword,
  confirmPassword: z.string(),
});

export const profileSchema = z.object({
  fullName: z.string().min(1),
  email: z.email(),
});
