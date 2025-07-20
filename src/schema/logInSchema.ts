import { z } from "zod";
export const loginSchema = z.object({
  phone: z.string().min(8, "phone must be 8 characters").max(8, "phone must be 8 characters"),
});

export type loginSchemaFormData = z.infer<typeof loginSchema>;
