import { z } from "zod";

export const EditDepartmentFormValidateSchema = z.object({
  name: z
    .string({
      required_error: "Vui lòng nhập tên.",
    })
    .min(3, {
      message: "Tên không được ít hơn 3 ký tự.",
    })
    .max(100, {
      message: "Tên không được quá 100 ký tự.",
    })
    .trim(),
});

export type EditDepartmentFormValidate = z.infer<typeof EditDepartmentFormValidateSchema>;
