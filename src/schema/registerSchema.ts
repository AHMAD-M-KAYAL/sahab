import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2, "Name rejected"),
   email:z.email("email rejected")

});

export type registerSchemaFormData = z.infer<typeof registerSchema>;
