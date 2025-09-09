import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2, "Name rejected"),
   email:z.email("email rejected"),
  phone: z.string().min(10, "Phone rejected").optional(),  

});

export type registerSchemaFormData = z.infer<typeof registerSchema>;
