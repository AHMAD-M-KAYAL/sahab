import { z } from "zod";

export const EditAccountSchema = z.object({
  name:  z.string().min(2, "Name rejected"),
  phone: z.string().regex(/^\d{8}$/, "Phone must be 8 digits"),
  email: z.string().email("email rejected"),
  image: z.any().optional(), // ← خليّها optional أو اعملي refine على FileList إذا بدك
});

export type EditAccountSchemaFormData = z.infer<typeof EditAccountSchema>;
