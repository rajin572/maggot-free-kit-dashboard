import { FileWithPreview } from "@/Components/ui/CustomUi/ReuseForm/FileUpload";
import z from "zod";

export const PROJECT_STATUSES = ["draft", "active", "finished"] as const;
export const GENDER_STATUS = ["male", "female", "other"] as const;

export const projectSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
  status: z.enum(PROJECT_STATUSES),
  gender: z.enum(GENDER_STATUS),
  description: z.string().transform((v) => v || undefined),
  tags: z.array(z.string()).min(1, "At least one tag is required"), // Ensure at least one tag is selected
  images: z
    .array(z.custom<FileWithPreview>())
    ?.min(1, "At least one image is required"),

  date: z.string(),
  time: z.string(),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  users: z
    .array(z.object({ email: z.email() }))
    .min(1)
    .max(5),
});
