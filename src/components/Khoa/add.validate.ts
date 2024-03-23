import { z } from "zod";

export const AddDepartmentFormValidateSchema = z.object({
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

export type AddDepartmentFormValidate = z.infer<typeof AddDepartmentFormValidateSchema>;
