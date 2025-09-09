import { z } from "zod";
export const loginSchema = z.object({
  phone: z.string().min(10, "phone must be 10 characters").max(10, "phone must be 10 characters"),
});

export type loginSchemaFormData = z.infer<typeof loginSchema>;
